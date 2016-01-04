﻿/*
Deployment script for A2CDB

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar UserName "A2CUser"
:setvar DatabaseName "A2CDB"
:setvar DefaultFilePrefix "A2CDB"
:setvar DefaultDataPath ""
:setvar DefaultLogPath ""

GO
:on error exit
GO
/*
Detect SQLCMD mode and disable script execution if SQLCMD mode is not supported.
To re-enable the script after enabling SQLCMD mode, execute the following:
SET NOEXEC OFF; 
*/
:setvar __IsSqlCmdEnabled "True"
GO
IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
    BEGIN
        PRINT N'SQLCMD mode must be enabled to successfully execute this script.';
        SET NOEXEC ON;
    END


GO
IF (SELECT is_default
    FROM   [$(DatabaseName)].[sys].[filegroups]
    WHERE  [name] = N'FileStream') = 0
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            MODIFY FILEGROUP [FileStream] DEFAULT;
    END


GO
USE [$(DatabaseName)];


GO
/*
 Pre-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be executed before the build script.	
 Use SQLCMD syntax to include a file in the pre-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the pre-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
GO

GO
PRINT N'Dropping DF_A2CTransactionResponseEnvelopeMessages_ImportPriority...';


GO
ALTER TABLE [dbo].[A2CTransactionResponseEnvelopeMessages] DROP CONSTRAINT [DF_A2CTransactionResponseEnvelopeMessages_ImportPriority];


GO
PRINT N'Creating DF_A2CTransactionResponseEnvelopeMessages_ImportPriority...';


GO
ALTER TABLE [dbo].[A2CTransactionResponseEnvelopeMessages]
    ADD CONSTRAINT [DF_A2CTransactionResponseEnvelopeMessages_ImportPriority] DEFAULT ((999999)) FOR [ImportPriority];


GO
PRINT N'Altering [dbo].[usp_ProcessEditIncomingSequenceNumber]...';


GO
ALTER PROCEDURE [dbo].[usp_ProcessEditIncomingSequenceNumber]
	@SchoolId int,
	@awardingOrganisationCentreId int,
	@NewSequence bigint,
	@IgnorePendingMessages bit
AS
	BEGIN TRY
	--decide import priority

	--default import priority is 999999, so any pending messages priority will be set to 1 to process them first
	Declare @NewImportPriority int = 1

	--check if any message already exists with import priority other than 999999
	IF EXISTS (select 
					1
				from 
					A2CTransactionResponseEnvelopeMessages m
				where 
					m.DataImportStatus = 0
					and m.AwardingOrganisationCentreId=@awardingOrganisationCentreId
					and m.schoolid = @SchoolId
					and m.ImportPriority <> 999999)--any priority other than default 999999
	BEGIN
		select 
			@NewImportPriority = max(m.ImportPriority) + 1 -- get the max of other than default 999999 and increment it by 1
		from 
			A2CTransactionResponseEnvelopeMessages m
		where 
			m.DataImportStatus = 0
			and m.AwardingOrganisationCentreId=@awardingOrganisationCentreId
			and m.schoolid = @SchoolId
			and m.ImportPriority <> 999999--any priority other than default 999999
	END

	BEGIN TRAN SEQUPDATE
		--update messages already pending for processing with new import priority
		update 
			m
		set 				
			m.ImportPriority = @NewImportPriority
		from 
			A2CTransactionResponseEnvelopeMessages m				
		where 
			m.AwardingOrganisationCentreId = @awardingOrganisationCentreId
			and m.SchoolId = @SchoolId
			and m.DataImportStatus = 0
			and m.ImportPriority = 999999

		--step 1 - ignore pending out of sequence messages if ignore option checkbox selected
		IF(@IgnorePendingMessages = 1) 
		BEGIN
			update 
				m
			set 
				m.DataImportStatus = -4 --ignored message status
			from 
				A2CTransactionResponseEnvelopeMessages m
				inner join OutSequence os
				on os.AwardingOrganisationCentreId = m.AwardingOrganisationCentreId
			where 
				os.SequenceNumber = m.IncomingSequence
				and m.DataImportStatus = -1 --those marked as out of sequence
				and m.AwardingOrganisationCentreId = @awardingOrganisationCentreId
				and os.AwardingOrganisationCentreId = @awardingOrganisationCentreId
				and m.SchoolId = @SchoolId
		END
		ELSE 
		--STEP 2 - mark pending out of sequence messages for processing, must be processed before any new incoming message after this update
		BEGIN
			--update messages marked as out of sequence for processing, with new import priority
			update 
				m
			set 
				m.DataImportStatus = 0, --will be processed now
				m.ImportPriority = @NewImportPriority
			from 
				A2CTransactionResponseEnvelopeMessages m
				inner join OutSequence os
				on os.AwardingOrganisationCentreId = m.AwardingOrganisationCentreId
			where 
				os.SequenceNumber = m.IncomingSequence
				and os.AwardingOrganisationCentreId = @awardingOrganisationCentreId
				and m.DataImportStatus = -1 --those marked as out of sequence
				and m.AwardingOrganisationCentreId = @awardingOrganisationCentreId				
				and m.SchoolId = @SchoolId	
				and m.ImportPriority = 999999							
		END

		--step 3 - delete out of sequence messages from tracking table
		--resolve out of sequence scenario
		delete from OutSequence where AwardingOrganisationCentreId=@awardingOrganisationCentreId
	
		--step 4 - update incoming sequence column
		IF @NewSequence = 4294967295
			set @NewSequence = 1 

		update 
			AwardingOrganisationCentres
		set
			IncomingSequence = isnull(@NewSequence,1) - 1	
		where 
			A2CSchoolId=@SchoolId and
			AwardingOrganisationCentreId=@awardingOrganisationCentreId
			
		select 1		
		COMMIT TRAN SEQUPDATE
	END TRY
	BEGIN CATCH
		ROLLBACK TRAN SEQUPDATE

		--rethrow error as catch will eat error
		DECLARE @ErrorMessage NVARCHAR(MAX);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;

		SELECT 
			@ErrorMessage = ERROR_MESSAGE(),
			@ErrorSeverity = ERROR_SEVERITY(),
			@ErrorState = ERROR_STATE();

		RAISERROR (@ErrorMessage, -- Message text.
				   @ErrorSeverity, -- Severity.
				   @ErrorState -- State.
				   );
		select 0
	END CATCH
GO
PRINT N'Altering [Version]...';


GO
EXECUTE sp_updateextendedproperty @name = N'Version', @value = N'15.1.11.2';


GO
/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

Update A2CTransactionResponseEnvelopeMessages
Set ImportPriority = 999999
Where ImportPriority = 9999
GO

GO
PRINT N'Update complete.';


GO