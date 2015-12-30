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
PRINT N'Altering [dbo].[A2CTransactionMessages]...';


GO
ALTER TABLE [dbo].[A2CTransactionMessages] ALTER COLUMN [A2CMessageGuid] NVARCHAR (100) NOT NULL;


GO
PRINT N'Altering [dbo].[A2CTransactionRequests]...';


GO
ALTER TABLE [dbo].[A2CTransactionRequests]
    ADD [CentreNumber] NVARCHAR (50) NULL;


GO
PRINT N'Creating [dbo].[A2CTransactionRequests].[ix_A2CTransactionRequestsTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [ix_A2CTransactionRequestsTransactionLog]
    ON [dbo].[A2CTransactionRequests]([SchoolId] ASC, [A2CTransactionId] ASC)
    INCLUDE([A2CTransactionRequestId], [LastModifiedDate], [CentreNumber]);


GO
PRINT N'Altering [dbo].[A2CTransactions]...';


GO
ALTER TABLE [dbo].[A2CTransactions]
    ADD [CentreNumber] NVARCHAR (50) NULL;


GO
PRINT N'Creating [dbo].[A2CTransactions].[IX_A2CTransactionsTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [IX_A2CTransactionsTransactionLog]
    ON [dbo].[A2CTransactions]([SchoolId] ASC, [AwardingOrganisationCentreId] ASC, [A2CTransactionMasterId] ASC)
    INCLUDE([A2CTransactionId], [LastModifiedDate])
    ON [INDEXES];


GO
PRINT N'Creating [dbo].[A2CTransactionMasters].[IX_A2CTransactionMastersLog]...';


GO
CREATE NONCLUSTERED INDEX [IX_A2CTransactionMastersLog]
    ON [dbo].[A2CTransactionMasters]([A2CTransactionMasterId] ASC, [TransactionName] ASC)
    ON [INDEXES];


GO
PRINT N'Creating [dbo].[A2CTransactionResponseEnvelopes].[Ix_A2CTransactionResponseEnvelopesTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [Ix_A2CTransactionResponseEnvelopesTransactionLog]
    ON [dbo].[A2CTransactionResponseEnvelopes]([SchoolId] ASC, [A2CTransactionResponseId] ASC)
    INCLUDE([A2CTransactionResponseEnvelopeId])
    ON [INDEXES];


GO
PRINT N'Creating [dbo].[A2CTransactionResponseEnvelopeSignalErrors].[Ix_A2CTransactionResponseEnvelopeSignalErrorsTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [Ix_A2CTransactionResponseEnvelopeSignalErrorsTransactionLog]
    ON [dbo].[A2CTransactionResponseEnvelopeSignalErrors]([SchoolId] ASC, [A2CTransactionResponseEnvelopeSignalId] ASC)
    ON [INDEXES];


GO
PRINT N'Creating [dbo].[A2CTransactionResponseEnvelopeSignalErrors].[Ix_A2CTransactionResponseEnvelopesTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [Ix_A2CTransactionResponseEnvelopesTransactionLog]
    ON [dbo].[A2CTransactionResponseEnvelopeSignalErrors]([SchoolId] ASC, [A2CTransactionResponseEnvelopeSignalId] ASC);


GO
PRINT N'Creating [dbo].[A2CTransactionResponseEnvelopeSignals].[Ix_A2CTransactionResponseEnvelopeSignalsTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [Ix_A2CTransactionResponseEnvelopeSignalsTransactionLog]
    ON [dbo].[A2CTransactionResponseEnvelopeSignals]([SchoolId] ASC, [A2CTransactionResponseEnvelopeId] ASC)
    INCLUDE([A2CTransactionResponseEnvelopeSignalId])
    ON [INDEXES];


GO
PRINT N'Creating [dbo].[A2CTransactionResponses].[ix_A2CTransactionResponsesTransactionLog]...';


GO
CREATE NONCLUSTERED INDEX [ix_A2CTransactionResponsesTransactionLog]
    ON [dbo].[A2CTransactionResponses]([SchoolId] ASC, [A2CTransactionRequestId] ASC)
    INCLUDE([A2CTransactionResponseId])
    ON [INDEXES];


GO
PRINT N'Altering [dbo].[usp_Insert_A2CTransactionMessages]...';


GO


ALTER PROCEDURE [dbo].[usp_Insert_A2CTransactionMessages]
@A2CTransactionId int,
@AwardingOrganisationCentreId int,
@A2CMessageGuid nvarchar(100),
@OutgoingSequence bigint,
@SchoolId int
AS
BEGIN

Insert into A2CTransactionMessages (SchoolId,A2CTransactionId,AwardingOrganisationCentreId,A2CMessageGuid,OutgoingSequence)
	values(@SchoolId,@A2CTransactionId,@AwardingOrganisationCentreId,@A2CMessageGuid,@OutgoingSequence)
select cast(SCOPE_IdENTITY() as int)

END
GO
PRINT N'Altering [dbo].[usp_Insert_A2CTransactionRequests]...';


GO



ALTER PROCEDURE [dbo].[usp_Insert_A2CTransactionRequests]
 @A2CTransactionId int,
@A2CTransactionGuid nvarchar(50),
@EndPoint nvarchar(300),
@Envelope varbinary (max),
@AwardingOrganisationCentreId int,
@SchoolId int ,
@CentreNumber nvarchar(50)
AS



BEGIN

	Insert into A2CTransactionRequests (SchoolId,A2CTransactionId ,A2CTransactionGuid,EndPoint,Envelope,AwardingOrganisationCentreId,CentreNumber)
values(@SchoolId,@A2CTransactionId,@A2CTransactionGuid,@EndPoint,@Envelope,@AwardingOrganisationCentreId,@CentreNumber)

	select cast(SCOPE_IdENTITY() as int)

END
GO
PRINT N'Altering [dbo].[usp_Insert_A2CTransactions]...';


GO



ALTER PROCEDURE [dbo].[usp_Insert_A2CTransactions]
@TransactionName nvarchar(100)=null,
@AwardingOrganisationCentreId int,
@SchoolId int,
@CentreNumber nvarchar(50)
AS



BEGIN
DECLARE @A2CTransactionMasterId INT

	EXEC @A2CTransactionMasterId= [usp_Select_A2CTransactionMasters_IdByName] @TransactionName
	Insert into A2CTransactions (SchoolId,A2CTransactionMasterId,AwardingOrganisationCentreId,CentreNumber)
	values(@SchoolId,@A2CTransactionMasterId,@AwardingOrganisationCentreId,@CentreNumber)

	select cast(SCOPE_IdENTITY() as int)

END
GO
PRINT N'Altering [dbo].[usp_GetActiveAwardingOrganisation]...';


GO
ALTER PROCEDURE usp_GetActiveAwardingOrganisation
AS
BEGIN
	SET NOCOUNT ON;

	Select	Distinct AO.AwardingOrganisationId AwardingOrganisationId, 
			AO.Name AoName, 
			AO.[EndPoint] [EndPoint],
			(SELECT PollingInMinutes * 60 FROM SystemConfigurations) AS Frequency
	From	AwardingOrganisationCentreCertificates AOCC
		JOIN AwardingOrganisationCentres AOCE
			ON AOCC.AwardingOrganisationCentreId = AOCE.AwardingOrganisationCentreId
		JOIN AwardingOrganisationCertificates AOC
			ON AOCC.AwardingOrganisationCertificateId = AOC.AwardingOrganisationCertificateId
		JOIN Centres C
			ON AOCE.CentreId = C.CentreId
		JOIN A2CSchools S
			ON C.A2CSchoolId = S.A2CSchoolId
			AND AOCE.A2CSchoolId = S.A2CSchoolId
			AND AOC.A2CSchoolId = S.A2CSchoolId
		JOIN AwardingOrganisations AO
			ON AOC.AwardingOrganisationId = AO.AwardingOrganisationId
END
GO
PRINT N'Altering [dbo].[usp_GetSMTPProviderDetails]...';


GO
ALTER PROCEDURE [dbo].[usp_GetSMTPProviderDetails]
	@SchoolId int = NULL,
	@ApplicationName varchar(Max)
AS
BEGIN

    SET NOCOUNT ON;	

	DECLARE @SSURECORDEXIST BIT = 0
	DECLARE @SCHOOLRECORDEXISTS BIT = 0
	DECLARE @ISFACILITY BIT = 0 --this parameter is only used for Facility

	IF UPPER(LTRIM(RTRIM(ISNULL(@ApplicationName,'')))) = 'FACILITY'
	BEGIN
		SET @ISFACILITY = 1		
	END

	IF EXISTS (SELECT * FROM dbo.SMTPEmailProviders WHERE SchoolId is null)
	BEGIN
		SET @SSURECORDEXIST = 1
	END

	IF EXISTS (SELECT * FROM dbo.SMTPEmailProviders WHERE SchoolId = @SchoolId)
	BEGIN
		SET @SCHOOLRECORDEXISTS = 1
	END
	
	--GET RECORD FOR SSU
	IF @SSURECORDEXIST = 1
	BEGIN		
		SELECT TOP 1
			ISNULL(SP.HostName,'') as Host, ISNULL(SP.Port,0) AS Port,ISNULL(SP.UserName,'') AS UserName,ISNULL(SP.[Password],'') AS [Password],
			ISNULL(SP.FromEmail,'') AS FromEmail,SP.SchoolId,ISNULL(SP.[AuthenticationRequired],0) AS AuthenticationRequired
		INTO
			#SSU			
		FROM
			dbo.SMTPEmailProviders SP         
		WHERE
			SP.SchoolId is null	
		ORDER BY 
			SP.SMTPEmailProviderId ASC
	END

	--SELECT DATA AS PER EMAIL CONFIGURATION CHOICE AND APPLICATION(FACILITY/PROGRESSO)
	IF @SchoolId IS NULL
	BEGIN
		IF @SSURECORDEXIST = 1
			SELECT * FROM #SSU
		ELSE
		BEGIN		
			RETURN	
			--IF @ISFACILITY = 1
			--BEGIN
			--	--IN CASE OF FACILITY, ANY RECORD EXISTING IN TABLE IS USED FOR EMAIL SENDING
			--	SELECT TOP 1
			--		ISNULL(SP.HostName,'') as Host, ISNULL(SP.Port,0) AS Port,ISNULL(SP.UserName,'') AS UserName,ISNULL(SP.[Password],'') AS [Password],
			--		ISNULL(SP.FromEmail,'') AS FromEmail,SP.SchoolId,ISNULL(SP.[AuthenticationRequired],0) AS [AuthenticationRequired],
			--		CASE @ISFACILITY WHEN 1 THEN ISNULL(SP.[EmailConfigurationChoice],1) ELSE ISNULL(SP.[EmailConfigurationChoice],2) END AS [EmailConfigurationChoice]				
			--	FROM   
			--		dbo.SMTPEmailProviders SP 				
			--	ORDER BY 
			--		SP.SMTPEmailProviderId ASC
			--END
			--ELSE
			--BEGIN
			--	--IN CASE OF PROGRESSO
			--	RETURN
			--END
		END
	END
	ELSE
	BEGIN
		IF @SCHOOLRECORDEXISTS = 0
		BEGIN
			--NO RECORD EXIST AT SCHOOL LEVEL, SELECT SSU DETAILS
			IF @SSURECORDEXIST = 1
				SELECT * FROM #SSU
			ELSE				
				RETURN
		END
		ELSE
		BEGIN
			--RECORD EXISTS AT SCHOOL LEVEL
			SELECT TOP 1
				ISNULL(SP.HostName,'') as Host, ISNULL(SP.Port,0) AS Port,ISNULL(SP.UserName,'') AS UserName,ISNULL(SP.[Password],'') AS [Password],
				ISNULL(SP.FromEmail,'') AS FromEmail,SP.SchoolId,ISNULL(SP.[AuthenticationRequired],0) AS [AuthenticationRequired],
				CASE @ISFACILITY WHEN 1 THEN ISNULL(SP.[EmailConfigurationChoice],1) ELSE ISNULL(SP.[EmailConfigurationChoice],2) END AS [EmailConfigurationChoice]
			INTO
				#SCHOOL
			FROM   
				dbo.SMTPEmailProviders SP 
			WHERE  
				SP.SchoolId = @SchoolId
			ORDER BY 
				SP.SMTPEmailProviderId ASC

			--NOW SELECT DATA AS PER SCHOOL CONFIGURATION CHOICE
			IF (SELECT [EmailConfigurationChoice] FROM #SCHOOL) = 1 --SMTP OPTION SELECTED
			BEGIN
				SELECT * FROM #SCHOOL
			END			
			ELSE IF (SELECT [EmailConfigurationChoice] FROM #SCHOOL) = 2 --AMAZON CLOUD OPTION SELECTED
			BEGIN	
				IF @SSURECORDEXIST = 1	
				BEGIN		
					--SELECT ALL DETAILS OF SSU EXCEPT EMAID ADDRESS
					UPDATE #SSU SET FromEmail = S.FromEmail FROM #SCHOOL S	
					SELECT * FROM #SSU
				END
				ELSE
					--SELECT NULL
					RETURN
			END			
			ELSE  --NONE OPTION SELECTED
			BEGIN
				IF @SSURECORDEXIST = 1
					SELECT * FROM #SSU
				ELSE
					--SELECT NULL
					RETURN
			END
		END
	END
END
GO
PRINT N'Altering [dbo].[usp_Insert_A2CTransactionResponseEnvelopeEDIs]...';


GO









ALTER PROCEDURE [dbo].[usp_Insert_A2CTransactionResponseEnvelopeEDIs]
@AwardingOrganisationCentreId int,
@A2CTransactionResponseEnvelopeId int,
@data varbinary(max) ,
@FileName nvarchar(100),
@AwardingOrganisationNumber nvarchar(200),
@CentreNumber nvarchar(200),
@A2CSchoolId int,
@TransactionName nvarchar(100)=null,
@A2CTransactionRequestId int
AS
BEGIN
	
	DECLARE @A2CTransactionMasterId INT
	Declare @MessageAwardingOrganisationCentreId int
	EXEC @A2CTransactionMasterId= [usp_Select_A2CTransactionMasters_IdByName] @TransactionName

	
	Select @MessageAwardingOrganisationCentreId =aoc.AwardingOrganisationCentreId from AwardingOrganisationCentres aoc
	inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
	inner join Centres c on c.CentreId=aoc.CentreId and c.A2CSchoolId=aoc.A2CSchoolId
	where 
	aoc.A2CSchoolId=@A2CSchoolId and
	c.CentreNumber=@CentreNumber and ad.AwardingOrganisationDetailId=aoc.AwardingOrganisationDetailId
	and ad.AONumber=@AwardingOrganisationNumber

	If @MessageAwardingOrganisationCentreId is null
	begin
		Select @CentreNumber = c.CentreNumber, @MessageAwardingOrganisationCentreId =aoc.AwardingOrganisationCentreId from AwardingOrganisationCentres aoc
		inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
		inner join Centres c on c.CentreId=aoc.CentreId and c.A2CSchoolId=aoc.A2CSchoolId
		inner join AwardingOrganisationAOAssignedCentres aoassign on aoassign.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
		and aoassign.A2CSchoolId=aoc.A2CSchoolId
		where 
		aoc.A2CSchoolId=@A2CSchoolId 
		and ad.AwardingOrganisationDetailId=aoc.AwardingOrganisationDetailId
		and aoassign.AOAssignCentreNumber=@CentreNumber
		and ad.AONumber=@AwardingOrganisationNumber
	end

	Insert into A2CTransactionResponseEnvelopeEDIs (SchoolId,AwardingOrganisationCentreId,A2CTransactionResponseEnvelopeId,[data],FileName, MessageAwardingOrganisationCentreId,A2CTransactionMasterId)
	values(@A2CSchoolId,@AwardingOrganisationCentreId,@A2CTransactionResponseEnvelopeId,@data,@FileName,@MessageAwardingOrganisationCentreId,@A2CTransactionMasterId)
	
	update A2CTransactionRequests set CentreNumber=@CentreNumber where A2CTransactionRequestId=@A2CTransactionRequestId
	and SchoolId=@A2CSchoolId

	select @CentreNumber
END
GO
PRINT N'Altering [dbo].[usp_Insert_A2CTransactionResponseEnvelopeMessages]...';


GO




ALTER PROCEDURE [dbo].[usp_Insert_A2CTransactionResponseEnvelopeMessages]
@A2CSchoolId int,
@AwardingOrganisationDetailId int,
@CentreId int,
@A2CTransactionResponseEnvelopeId int,
@MessageId nvarchar(50),
@RefMessageId nvarchar(50)=null,
@TimeStamp datetime,
@TransactionName nvarchar(100)=null,
@IncomingSequence bigint=null,
@data varbinary(max),
@IsFeedbackMessage  bit,
@AwardingOrganisationCentreId int,
@AwardingOrganisationNumber nvarchar(200),
@CentreNumber nvarchar(200),
@IsMessageLevelFeedbackMessage bit,
@A2CTransactionRequestId int
AS
BEGIN
	DECLARE @A2CTransactionMasterId INT
	Declare @MessageAwardingOrganisationCentreId int
	EXEC @A2CTransactionMasterId= [usp_Select_A2CTransactionMasters_IdByName] @TransactionName
	Declare @A2CMessageId int

	Select @MessageAwardingOrganisationCentreId =aoc.AwardingOrganisationCentreId from AwardingOrganisationCentres aoc
	inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
	inner join Centres c on c.CentreId=aoc.CentreId and c.A2CSchoolId=aoc.A2CSchoolId
	where 
	aoc.A2CSchoolId=@A2CSchoolId and
	c.CentreNumber=@CentreNumber and ad.AwardingOrganisationDetailId=aoc.AwardingOrganisationDetailId
	and ad.AONumber=@AwardingOrganisationNumber

	If @MessageAwardingOrganisationCentreId is null
	begin
		Select @CentreNumber = c.CentreNumber,@MessageAwardingOrganisationCentreId =aoc.AwardingOrganisationCentreId from AwardingOrganisationCentres aoc
		inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
		inner join Centres c on c.CentreId=aoc.CentreId and c.A2CSchoolId=aoc.A2CSchoolId
		inner join AwardingOrganisationAOAssignedCentres aoassign on aoassign.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
		and aoassign.A2CSchoolId=aoc.A2CSchoolId
		where 
		aoc.A2CSchoolId=@A2CSchoolId 
		and ad.AwardingOrganisationDetailId=aoc.AwardingOrganisationDetailId
		and aoassign.AOAssignCentreNumber=@CentreNumber
		and ad.AONumber=@AwardingOrganisationNumber
	end
	

	

	Insert into A2CTransactionResponseEnvelopeMessages (SchoolId,A2CTransactionResponseEnvelopeId,MessageId,RefMessageId,[TimeStamp],A2CTransactionMasterId,IncomingSequence,[data],IsFeedbackMessage,A2CMessageId,AwardingOrganisationCentreId,MessageAwardingOrganisationCentreId,IsMessageLevelFeedbackMessage)
	values(@A2CSchoolId,@A2CTransactionResponseEnvelopeId,@MessageId,@RefMessageId,@TimeStamp,@A2CTransactionMasterId,@IncomingSequence,@data,@IsFeedbackMessage,@A2CMessageId,@AwardingOrganisationCentreId,@MessageAwardingOrganisationCentreId,@IsMessageLevelFeedbackMessage)
	select cast(SCOPE_IdENTITY() as int)

	if @IncomingSequence is not null and @IncomingSequence>0 and @MessageAwardingOrganisationCentreId>0
	begin
		update AwardingOrganisationCentres
		set IncomingSequence=@IncomingSequence
		where AwardingOrganisationCentreId = @MessageAwardingOrganisationCentreId
	end

	update A2CTransactionRequests set CentreNumber=@CentreNumber where A2CTransactionRequestId=@A2CTransactionRequestId
	and SchoolId=@A2CSchoolId

	
END
GO
PRINT N'Altering [dbo].[USP_UpdateSystemConfiguration]...';


GO
ALTER PROCEDURE [dbo].[USP_UpdateSystemConfiguration]

@FieldNames NVARCHAR (MAX),
@FieldValues NVARCHAR (MAX),
@Delimiter VARCHAR(1)
AS

BEGIN

    SET NOCOUNT ON;

	SET @FieldValues=REPLACE(@FieldValues, '''', '');

	DECLARE @FieldName NVARCHAR(MAX);
	DECLARE @posFieldName INT;
	DECLARE @posFieldValue INT;
	DECLARE @FieldValue NVARCHAR(MAX);
	Declare @stringToSplitFieldName NVARCHAR (MAX);
	DECLARE @stringToSplitFieldValue NVARCHAR (MAX);
	DECLARE @UpdatedFileds NVARCHAR (MAX);
		
	DECLARE @UpdateSQL NVARCHAR(MAX);
	Set @stringToSplitFieldName=@FieldNames;
	Set @stringToSplitFieldValue=@FieldValues;

	--Declare @inputUserData TABLE (UserId uniqueidentifier primary key, NewPassword nvarchar(128));

	-- Slipt Userid and insert in to temp table
	SET @UpdatedFileds = '';
	WHILE LEN(@stringToSplitFieldName) > 0
	BEGIN

		SELECT @posFieldName  = CHARINDEX(@Delimiter, @stringToSplitFieldName)
		SELECT @posFieldValue  = CHARINDEX(@Delimiter, @stringToSplitFieldValue)

		if @posFieldName = 0
			Begin
				SELECT @posFieldName = LEN(@stringToSplitFieldName)
				SELECT @FieldName = SUBSTRING(@stringToSplitFieldName, 1, @posFieldName)
				SELECT @posFieldValue = LEN(@stringToSplitFieldValue)
				SELECT @FieldValue = SUBSTRING(@stringToSplitFieldValue, 1, @posFieldValue)
			End
		Else
			Begin
				SELECT @FieldName = SUBSTRING(@stringToSplitFieldName, 1, @posFieldName-1)
				SELECT @FieldValue = SUBSTRING(@stringToSplitFieldValue, 1, @posFieldValue-1)
			End

		--SET @UpdateSQL = 'UPDATE	[dbo].[SystemConfigurations] SET ' + @FieldName + ' = ''' + @FieldValue + '''	
		--		, [LastModified] = GETUTCDATE()'
		--		EXEC( @UpdateSQL)

		if(len(@UpdatedFileds) > 0)
		SET @UpdatedFileds = @UpdatedFileds + ', '
		 SET @UpdatedFileds = @UpdatedFileds + @FieldName + ' = ''' + @FieldValue + '''';
			
		SELECT @stringToSplitFieldName = SUBSTRING(@stringToSplitFieldName, @posFieldName+1, LEN(@stringToSplitFieldName)-@posFieldName)
		SELECT @stringToSplitFieldValue = SUBSTRING(@stringToSplitFieldValue, @posFieldValue+1, LEN(@stringToSplitFieldValue)-@posFieldValue)
	END
	PRINT @UpdatedFileds
	SET @UpdateSQL = 'UPDATE	[dbo].[SystemConfigurations] SET ' + @UpdatedFileds +', [LastModified] = GETUTCDATE()'
				EXEC( @UpdateSQL)
	
END
GO
PRINT N'Creating [dbo].[usp_GetAuditLogs]...';


GO
CREATE PROCEDURE [dbo].[usp_GetAuditLogs]
	@SchoolId int = null,
	@UserId	uniqueidentifier = null,
	@RoleType tinyint = 0, --SuperUser = 1, SchoolAdministrator = 2, ExamOfficer = 3
	@OrderBy nvarchar(255) = '[LastModifiedDate] desc',
	@GridWhereClause nvarchar(max) = null,
	@PageNumber int = 1,
	@PageSize int = 20,
	@TotalCount int = 0 OUTPUT
As
Begin
	SET NOCOUNT ON;

	SET @TotalCount = 0;

	Declare @Skip int = (@PageNumber * @PageSize) - (@PageSize-1), @Take int = (@PageNumber * @PageSize)

	Declare @WhereClause nvarchar(max), @CountQuery nvarchar(max), @ListQuery nvarchar(max), @MainQuery nvarchar(max)

	SET @MainQuery = ' select
							I.InformationLogId,
							I.LastModifiedDate,		
							I.A2CSchoolId as SchoolId,					
							ISNULL(SC.EstablishmentName,''NA'') as SchoolName,
							ISNULL(U.UserName,''NA'') AS UserName,
							I.RoleType,
							CASE ISNULL(I.RoleType,0) WHEN 1 THEN ''Super User'' WHEN 2 THEN ''School Administrator'' WHEN 3 THEN ''Exam Officer'' ELSE ''NA'' END AS A2CRoleType,
							CASE I.ScreenMasterId WHEN 1004 THEN ''NA'' WHEN 1014 THEN ''NA'' ELSE ISNULL(S.ScreenDescription,''NA'') END as Screen,
							I.[Description],
							I.IsVisibleToAll,
							I.UserId
						from InformationLogs I	
							left outer join ScreenMasters S on I.ScreenMasterId = S.ScreenMasterId
							left outer join A2CSchools SC on I.A2CSchoolId = SC.A2CSchoolId	
							left outer join aspnet_Users U on I.UserId = U.UserId '

	IF ISNULL(@RoleType, 0) = 1 --Super User
	BEGIN
		set @WhereClause = ' ISNULL(SchoolId,0)=  ' + cast(ISNULL(@SchoolId,0) as nvarchar(10)) +								 
							case when (@GridWhereClause is null or len(ltrim(rtrim(@GridWhereClause))) <= 0) then ''
							else ' and ' + @GridWhereClause end

		set @CountQuery = N'select @TotalCountOut=count(1)
						from('
						+ @MainQuery + 										 											
						' ) q1
						where ' + @WhereClause							

		set @ListQuery = N'select * from
							(select  *,Row_NUMBER() OVER (ORDER BY ' + @OrderBy + ' ) AS RowNumber from('
							+ @MainQuery +		 											
							' ) q1
							where ' + @WhereClause + ') q2 
						WHERE q2.RowNumber BETWEEN @Skip AND @Take'
	END
	ELSE IF ISNULL(@RoleType, 0) = 2 --School Administrator User
	BEGIN
		set @WhereClause = ' (SchoolId = ' + cast(@SchoolId as nvarchar(10)) +
							' OR IsVisibleToAll = 1 ) ' +								 
							case when (@GridWhereClause is null or len(ltrim(rtrim(@GridWhereClause))) <= 0) then ''
							else ' and ' + @GridWhereClause end 							

		set @CountQuery = N'select @TotalCountOut=count(1)
						from('
							+ @MainQuery + 										 											
						') q1
						where ' + @WhereClause							

		set @ListQuery = N'select * 
							from
							(select  *,Row_NUMBER() OVER (ORDER BY ' + @OrderBy + ' ) AS RowNumber from('
								+ @MainQuery + 											 											
							') q1
							where ' + @WhereClause + ') q2 
						WHERE q2.RowNumber BETWEEN @Skip AND @Take'
	END
	ELSE IF ISNULL(@RoleType, 0) = 3 --Exam Officer User
	BEGIN
		set @WhereClause = ' SchoolId = ' + cast(@SchoolId as nvarchar(10)) +
							' AND UserId = ' + '''' + cast(@UserId as nvarchar(100)) +	'''' +	
							' AND RoleType = 3 ' +							 
							case when (@GridWhereClause is null or len(ltrim(rtrim(@GridWhereClause))) <= 0) then ''
							else ' and ' + @GridWhereClause end 

		set @CountQuery = N'select @TotalCountOut=count(1)
						from('
							+ @MainQuery + 										 											
						') q1
						where ' + @WhereClause							

		set @ListQuery = N'select * 
							from
							(select  *,Row_NUMBER() OVER (ORDER BY ' + @OrderBy + ' ) AS RowNumber from('
								+ @MainQuery + 											 											
							') q1
							where ' + @WhereClause + ') q2 
						WHERE q2.RowNumber BETWEEN @Skip AND @Take'
	END
										
	EXECUTE sp_executesql @CountQuery, N'@TotalCountOut int OUTPUT', @TotalCountOut = @TotalCount OUTPUT

	EXECUTE sp_executesql @ListQuery, N'@Skip int, @Take int', @Skip = @Skip, @Take = @Take	
End
GO
PRINT N'Creating [dbo].[usp_SelectA2CTransactionLog]...';


GO




---usp_SelectA2CTransactionLog 1000,1,'[TransactionDate] desc',NULL,1157,20
CREATE PROCEDURE [dbo].[usp_SelectA2CTransactionLog]
@SchoolId int,
@TotalCount int = 0 OUTPUT,
@OrderBy nvarchar(255) = '[TransactionDate] desc',
@GridWhereClause nvarchar(max) = null,
@PageNumber int = 1,
@PageSize int = 20
AS
BEGIN

SET NOCOUNT ON;


	SET @TotalCount = 0;
	Declare @Skip int = (@PageNumber * @PageSize) - (@PageSize-1),
	@Take int = (@PageNumber * @PageSize),
	@WhereClause nvarchar(max) = '[SchoolId] = ' + cast(@SchoolId as nvarchar(10)) +
								case when @GridWhereClause is null or len(ltrim(rtrim(@GridWhereClause))) <= 0 then ''
								else ' and ' + @GridWhereClause end


SET @TotalCount = 0;
	
	

	declare @CountQuery as nvarchar(max) = 'Select @TotalCountOut = Count(1) from
	(
select at.SchoolId,at.A2CTransactionId,are.A2CTransactionRequestId,case when are.A2CTransactionRequestId is not null then are.CentreNumber 
else at.CentreNumber end as CentreNumber,case when arpee.A2CTransactionResponseEnvelopeEDIId is not null then adEDI.AONumber + '' '' + aoEDI.Name 
when arpem.A2CTransactionResponseEnvelopeMessageId is not null then adMessage.AONumber + '' '' + aoMessage.Name 
else ad.AONumber + '' '' + ao.Name end as AwardingOrganisation,
at.LastModifiedDate TransactionDate,
case when arpee.A2CTransactionResponseEnvelopeEDIId is not null then  arpeetrMaster.TransactionName
when arpem.A2CTransactionResponseEnvelopeMessageId is not null then  arpemtrMaster.TransactionName
else am.TransactionName  end as TransactionName,
case when arpem.A2CTransactionResponseEnvelopeMessageId is not null then arpem.MessageId else atm.A2CMessageGuid end as MessageGuid,
case when arpee.A2CTransactionResponseEnvelopeEDIId is not null then arpee.FileName
else atedi.FileName end as FileName,
case when arpem.A2CTransactionResponseEnvelopeMessageId is not null then arpem.IncomingSequence
else  atm.OutgoingSequence end as Sequence
from A2CTransactions at inner join A2CTransactionMasters am on at.A2CTransactionMasterId=am.A2CTransactionMasterId
inner join AwardingOrganisationCentres aoc on at.SchoolId=aoc.A2CSchoolId and at.AwardingOrganisationCentreId=aoc.AwardingOrganisationCentreId
inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
inner join AwardingOrganisations ao on ao.AwardingOrganisationId=ad.AwardingOrganisationId
left join A2CTransactionMessages atm on atm.SchoolId=at.SchoolId and atm.A2CTransactionId=at.A2CTransactionId
left join A2CTransactionEDIs atedi on atedi.SchoolId=at.SchoolId and atedi.A2CTransactionId=at.A2CTransactionId
left join A2CTransactionRequests are on at.SchoolId=are.SchoolId and at.A2CTransactionId=are.A2CTransactionId 
left join A2CTransactionResponses arp on are.SchoolId=arp.SchoolId and are.A2CTransactionRequestId=arp.A2CTransactionRequestId
left join A2CTransactionResponseEnvelopes arpe on arpe.SchoolId=arp.SchoolId and arpe.A2CTransactionResponseId=arp.A2CTransactionResponseId
left join A2CTransactionResponseEnvelopeMessages arpem on arpe.SchoolId=arpem.SchoolId and arpe.A2CTransactionResponseEnvelopeId=arpem.A2CTransactionResponseEnvelopeId
left join AwardingOrganisationCentres aocMessage on arpem.SchoolId=aocMessage.A2CSchoolId and arpem.MessageAwardingOrganisationCentreId=aocMessage.AwardingOrganisationCentreId
left join AwardingOrganisationDetails adMessage on aocMessage.AwardingOrganisationDetailId=adMessage.AwardingOrganisationDetailId
left join AwardingOrganisations aoMessage on aoMessage.AwardingOrganisationId=adMessage.AwardingOrganisationId
left join A2CTransactionMasters arpemtrMaster on arpemtrMaster.A2CTransactionMasterId = arpem.A2CTransactionMasterId
left join A2CTransactionResponseEnvelopeEDIs arpee on arpee.SchoolId=arpe.SchoolId and arpee.A2CTransactionResponseEnvelopeId=arpe.A2CTransactionResponseEnvelopeId
left join A2CTransactionMasters arpeetrMaster on arpeetrMaster.A2CTransactionMasterId = arpee.A2CTransactionMasterId
left join AwardingOrganisationCentres aocEDI on arpee.SchoolId=aocEDI.A2CSchoolId and arpee.MessageAwardingOrganisationCentreId=aocEDI.AwardingOrganisationCentreId
left join AwardingOrganisationDetails adEDI on aocEDI.AwardingOrganisationDetailId=adEDI.AwardingOrganisationDetailId 
left join AwardingOrganisations aoEDI on aoEDI.AwardingOrganisationId=adEDI.AwardingOrganisationId
) t
Where ' + @WhereClause
	 
	 

	 Declare @ListQuery as nvarchar(max)
	
	print 'ttt1'
	Set @ListQuery=
	'select SchoolId, A2CTransactionId, A2CTransactionRequestId, CentreNumber,AwardingOrganisation,TransactionDate,TransactionName,MessageGuid,FileName,Sequence,RN from 
(select SchoolId, A2CTransactionId, A2CTransactionRequestId, CentreNumber,AwardingOrganisation,TransactionDate,TransactionName,MessageGuid,FileName,Sequence ,ROW_NUMBER() OVER (ORDER BY ' + @OrderBy + ') AS RN
from (select at.SchoolId,at.A2CTransactionId,are.A2CTransactionRequestId,case when are.A2CTransactionRequestId is not null then are.CentreNumber 
else at.CentreNumber end as CentreNumber,case when arpee.A2CTransactionResponseEnvelopeEDIId is not null then adEDI.AONumber + '' '' + aoEDI.Name 
when arpem.A2CTransactionResponseEnvelopeMessageId is not null then adMessage.AONumber + '' '' + aoMessage.Name 
else ad.AONumber + '' '' + ao.Name end as AwardingOrganisation,
at.LastModifiedDate TransactionDate,
case when arpee.A2CTransactionResponseEnvelopeEDIId is not null then  arpeetrMaster.TransactionName
when arpem.A2CTransactionResponseEnvelopeMessageId is not null then  arpemtrMaster.TransactionName
else am.TransactionName  end as TransactionName,
case when arpem.A2CTransactionResponseEnvelopeMessageId is not null then arpem.MessageId else atm.A2CMessageGuid end as MessageGuid,
case when arpee.A2CTransactionResponseEnvelopeEDIId is not null then arpee.FileName
else atedi.FileName end as FileName,
case when arpem.A2CTransactionResponseEnvelopeMessageId is not null then arpem.IncomingSequence
else  atm.OutgoingSequence end as Sequence
from A2CTransactions at inner join A2CTransactionMasters am on at.A2CTransactionMasterId=am.A2CTransactionMasterId
inner join AwardingOrganisationCentres aoc on at.SchoolId=aoc.A2CSchoolId and at.AwardingOrganisationCentreId=aoc.AwardingOrganisationCentreId
inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
inner join AwardingOrganisations ao on ao.AwardingOrganisationId=ad.AwardingOrganisationId
left join A2CTransactionMessages atm on atm.SchoolId=at.SchoolId and atm.A2CTransactionId=at.A2CTransactionId
left join A2CTransactionEDIs atedi on atedi.SchoolId=at.SchoolId and atedi.A2CTransactionId=at.A2CTransactionId
left join A2CTransactionRequests are on at.SchoolId=are.SchoolId and at.A2CTransactionId=are.A2CTransactionId 
left join A2CTransactionResponses arp on are.SchoolId=arp.SchoolId and are.A2CTransactionRequestId=arp.A2CTransactionRequestId
left join A2CTransactionResponseEnvelopes arpe on arpe.SchoolId=arp.SchoolId and arpe.A2CTransactionResponseId=arp.A2CTransactionResponseId
left join A2CTransactionResponseEnvelopeMessages arpem on arpe.SchoolId=arpem.SchoolId and arpe.A2CTransactionResponseEnvelopeId=arpem.A2CTransactionResponseEnvelopeId
left join AwardingOrganisationCentres aocMessage on arpem.SchoolId=aocMessage.A2CSchoolId and arpem.MessageAwardingOrganisationCentreId=aocMessage.AwardingOrganisationCentreId
left join AwardingOrganisationDetails adMessage on aocMessage.AwardingOrganisationDetailId=adMessage.AwardingOrganisationDetailId
left join AwardingOrganisations aoMessage on aoMessage.AwardingOrganisationId=adMessage.AwardingOrganisationId
left join A2CTransactionMasters arpemtrMaster on arpemtrMaster.A2CTransactionMasterId = arpem.A2CTransactionMasterId
left join A2CTransactionResponseEnvelopeEDIs arpee on arpee.SchoolId=arpe.SchoolId and arpee.A2CTransactionResponseEnvelopeId=arpe.A2CTransactionResponseEnvelopeId
left join A2CTransactionMasters arpeetrMaster on arpeetrMaster.A2CTransactionMasterId = arpee.A2CTransactionMasterId
left join AwardingOrganisationCentres aocEDI on arpee.SchoolId=aocEDI.A2CSchoolId and arpee.MessageAwardingOrganisationCentreId=aocEDI.AwardingOrganisationCentreId
left join AwardingOrganisationDetails adEDI on aocEDI.AwardingOrganisationDetailId=adEDI.AwardingOrganisationDetailId 
left join AwardingOrganisations aoEDI on aoEDI.AwardingOrganisationId=adEDI.AwardingOrganisationId
) t where ' + @WhereClause + 
') t1 where t1.RN between @Skip AND @Take'
    --print @ListQuery
	--print 'ttt2'
	
	
	EXECUTE sp_executesql	@CountQuery, 
							N'@TotalCountOut int OUTPUT', 
							@TotalCountOut = @TotalCount OUTPUT
	EXECUTE sp_executesql @ListQuery, N'@Skip int, @Take int', @Skip = @Skip, @Take = @Take


END
GO
PRINT N'Altering [Version]...';


GO
EXECUTE sp_updateextendedproperty @name = N'Version', @value = N'15.1.6.3';


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

Insert into ScreenMasters(ScreenMasterId, ScreenName,ScreenDescription)
Select	temp.ScreenMasterId, temp.ScreenName,temp.ScreenDescription
From	(Select 1018 ScreenMasterId, 'SchoolApplicationConfiguration' ScreenName,'School Application Configuration' ScreenDescription
		union all
		Select 1019, 'BusinessErrorLog','Business Error Log'
		union all
		Select 1020, 'AuditLog','Audit Log'
		union all
		Select 1021, 'TransactionLog','Transaction Log'
		) As temp
		Left Join ScreenMasters sm 
		on temp.ScreenMasterId = sm.ScreenMasterId
Where sm.ScreenMasterId is null

--Insert Default Value in System Configurations 

DECLARE @SystemConfigurationId INT
DECLARE @A2CApplicationURL NVARCHAR(2083)
DECLARE @ContactEmail NVARCHAR(256)
DECLARE @ContactPhoneNumber NVARCHAR(50)
DECLARE @PickUpFileFromEDIFolderInMinutes SMALLINT
DECLARE @SendA2CRequestInMinutes SMALLINT
DECLARE @PollingInMinutes SMALLINT

SET	@A2CApplicationURL = 'https://a2c.abhsindia.local:4431/Account/LogOn'
SET	@ContactEmail = 'a2capplication-admin@a2ccore.net'
SET @ContactPhoneNumber = '08456888400'
SET @PickUpFileFromEDIFolderInMinutes = 30
SET @SendA2CRequestInMinutes = 5
SET @PollingInMinutes = 60

SELECT @SystemConfigurationId = SystemConfigurationId FROM SystemConfigurations

IF ISNULL(@SystemConfigurationId, 0) = 0
BEGIN
	INSERT INTO [dbo].[SystemConfigurations]([A2CApplicationURL], [ContactEmail], [ContactPhoneNumber], [PickUpFileFromEDIFolderInMinutes], [SendA2CRequestInMinutes],
												[PollingInMinutes])
     VALUES
           (@A2CApplicationURL, @ContactEmail, @ContactPhoneNumber, @PickUpFileFromEDIFolderInMinutes, @SendA2CRequestInMinutes, @PollingInMinutes)
END


--Insert Default Value in School Configurations 

--DECLARE @SchoolConfigurationId INT
--DECLARE @SchoolID INT
--DECLARE @ContactEmailSchool NVARCHAR(256)
--DECLARE @ContactPhoneNumberSchool NVARCHAR(50)
--DECLARE @NumberofAttemptCheckForAOConnection SMALLINT

--SET	@SchoolID = 1000
--SET	@ContactEmailSchool = 'a2capplication-admin@a2ccore.net'
--SET @ContactPhoneNumberSchool = '08456888400'
--SET @NumberofAttemptCheckForAOConnection = 5

--SELECT @SchoolConfigurationId = SchoolConfigurationId FROM SchoolConfigurations WHERE SchoolID = @SchoolID

--IF ISNULL(@SchoolConfigurationId, 0) = 0
--BEGIN

--		INSERT INTO [dbo].[SchoolConfigurations]([SchoolID], [ContactEmail], [ContactPhoneNumber], [NumberofAttemptCheckForAOConnection], [LastModified])
--		VALUES(@SchoolID, @ContactEmailSchool, @ContactPhoneNumberSchool, @NumberofAttemptCheckForAOConnection, GETUTCDATE())

--END


update at set CentreNumber=case when aoassign.AwardingOrganisationAOAssignedCentreId is not null then
aoassign.AOAssignCentreNumber else c.CentreNumber
end
from A2CTransactionRequests at
inner join
AwardingOrganisationCentres aoc on at.AwardingOrganisationCentreId=aoc.AwardingOrganisationCentreId
		inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
		inner join Centres c on c.CentreId=aoc.CentreId and c.A2CSchoolId=aoc.A2CSchoolId
		left join AwardingOrganisationAOAssignedCentres aoassign on aoassign.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
		and aoassign.A2CSchoolId=aoc.A2CSchoolId


update at set CentreNumber=case when aoassign.AwardingOrganisationAOAssignedCentreId is not null then
aoassign.AOAssignCentreNumber else c.CentreNumber
end
from A2CTransactionResponseEnvelopeMessages aem
inner join A2CTransactionResponseEnvelopes ae on aem.A2CTransactionResponseEnvelopeId=ae.A2CTransactionResponseEnvelopeId
inner join A2CTransactionResponses are on are.A2CTransactionResponseId=ae.A2CTransactionResponseId
inner join A2CTransactionRequests at on at.A2CTransactionRequestId=are.A2CTransactionRequestId
inner join
AwardingOrganisationCentres aoc on at.AwardingOrganisationCentreId=aoc.AwardingOrganisationCentreId
inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
inner join Centres c on c.CentreId=aoc.CentreId and c.A2CSchoolId=aoc.A2CSchoolId
left join AwardingOrganisationAOAssignedCentres aoassign on aoassign.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
and aoassign.A2CSchoolId=aoc.A2CSchoolId


DECLARE @A2CTransactionMasterId INT	
EXEC @A2CTransactionMasterId= [usp_Select_A2CTransactionMasters_IdByName] 'R'
UPDATE A2CTransactionResponseEnvelopeEDIs SET A2CTransactionMasterId=@A2CTransactionMasterId Where A2CTransactionMasterId is null
GO

GO
PRINT N'Update complete.';


GO
