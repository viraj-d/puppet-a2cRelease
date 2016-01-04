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
PRINT N'Creating [dbo].[A2COutSequenceRequests]...';


GO
CREATE TABLE [dbo].[A2COutSequenceRequests] (
    [A2COutSequenceRequestId]      INT            NOT NULL,
    [AwardingOrganisationCentreId] INT            NOT NULL,
    [Feedback]                     NVARCHAR (MAX) NULL,
    [LastModifiedDate]             DATETIME       NULL,
    [AOAssignCentreNumber]         NVARCHAR (MAX) NULL,
    [LastSequence]                 BIGINT         NULL,
    [PendingSequence]              NVARCHAR (MAX) NULL,
    [MissingSequence]              NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_A2COutSequenceRequests] PRIMARY KEY CLUSTERED ([A2COutSequenceRequestId] ASC, [AwardingOrganisationCentreId] ASC)
);


GO
PRINT N'Creating [dbo].[OutSequence]...';


GO
CREATE TABLE [dbo].[OutSequence] (
    [AwardingOrganisationCentreId] INT      NOT NULL,
    [SequenceNumber]               BIGINT   NOT NULL,
    [IsOutSequence]                BIT      NULL,
    [LastModifiedDate]             DATETIME NOT NULL,
    CONSTRAINT [PK_MissingSequence] PRIMARY KEY CLUSTERED ([AwardingOrganisationCentreId] ASC, [SequenceNumber] ASC)
);


GO
PRINT N'Creating DF_A2COutSequenceRequests_LastModifiedDate...';


GO
ALTER TABLE [dbo].[A2COutSequenceRequests]
    ADD CONSTRAINT [DF_A2COutSequenceRequests_LastModifiedDate] DEFAULT (getutcdate()) FOR [LastModifiedDate];


GO
PRINT N'Creating DF_MissingSequence_IsOutofSequence...';


GO
ALTER TABLE [dbo].[OutSequence]
    ADD CONSTRAINT [DF_MissingSequence_IsOutofSequence] DEFAULT ((0)) FOR [IsOutSequence];


GO
PRINT N'Creating DF_OutSequence_LastModifiedDate...';


GO
ALTER TABLE [dbo].[OutSequence]
    ADD CONSTRAINT [DF_OutSequence_LastModifiedDate] DEFAULT (getutcdate()) FOR [LastModifiedDate];


GO
PRINT N'Creating FK_MissingSequence_AwardingOrganisationCentres...';


GO
ALTER TABLE [dbo].[OutSequence] WITH NOCHECK
    ADD CONSTRAINT [FK_MissingSequence_AwardingOrganisationCentres] FOREIGN KEY ([AwardingOrganisationCentreId]) REFERENCES [dbo].[AwardingOrganisationCentres] ([AwardingOrganisationCentreId]);


GO
PRINT N'Altering [dbo].[usp_Delete_EDIFileInformation]...';


GO

ALTER PROCEDURE [dbo].[usp_Delete_EDIFileInformation]
@ediFileInformationId int,
@endPointIssue bit
as
begin
	declare @filePath nvarchar(300)
	select @filePath=FilePath from EDIFileInformations where EDIFileInformationId=@ediFileInformationId
	delete from EDIFileInformations where EDIFileInformationId=@ediFileInformationId
	if @endPointIssue=0 
	begin
		delete from EDIFileNotConnectedInformations where FilePath=@filePath
	end
end
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
		Select @MessageAwardingOrganisationCentreId =aoc.AwardingOrganisationCentreId from AwardingOrganisationCentres aoc
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

	declare @MaxSequenceLimit bigint
	declare @IncomingSequencePresent bigint=0
	set @MaxSequenceLimit=4294967295 
	select @IncomingSequencePresent = isnull(IncomingSequence,0)
	from AwardingOrganisationCentres
	where AwardingOrganisationCentreId = @MessageAwardingOrganisationCentreId	

	if @IncomingSequence is not null and @IncomingSequence>0 and @MessageAwardingOrganisationCentreId>0
		begin	
				if @IncomingSequence=1 and @MaxSequenceLimit=@IncomingSequencePresent
				begin
						--print 'update'	
						update AwardingOrganisationCentres
						set IncomingSequence=@IncomingSequence
						where AwardingOrganisationCentreId = @MessageAwardingOrganisationCentreId
				end
				else
				begin
					--print 'innn'
					declare @OutSequence bigint
					set @OutSequence=@IncomingSequence	
					if not exists(select 1 from OutSequence where AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId and SequenceNumber<@OutSequence)
					and (@OutSequence - 1 = @IncomingSequencePresent)
					begin
					--print 'innn111'
						while exists(select 1 from OutSequence where AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId  and SequenceNumber= @OutSequence + 1)
						begin
							---print 'delete' + cast(@OutSequence + 1 as varchar(max))
							delete from OutSequence where AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId  and SequenceNumber= @OutSequence + 1			
			
							update A2CTransactionResponseEnvelopeMessages set DataImportStatus=0 where 			
							SchoolId=@A2CSchoolId and AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId  
							and DataImportStatus=-1 and IncomingSequence=@OutSequence+ 1	

							set @OutSequence= @OutSequence+ 1	
						end
					end

					if not exists(select 1 from OutSequence where AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId and
						SequenceNumber<=@OutSequence)
					begin	
						--print 'insertupdate'
						if @OutSequence>@IncomingSequence or @IncomingSequencePresent + 1 = @IncomingSequence 
						begin
								--print 'update'	
								update AwardingOrganisationCentres
								set IncomingSequence=@OutSequence
								where AwardingOrganisationCentreId = @MessageAwardingOrganisationCentreId
						end
					end
	
					if @OutSequence<=@IncomingSequence and @IncomingSequence > @IncomingSequencePresent + 1 
					begin
						--print 'insertoutsequence'	

						if not exists(select 1 from OutSequence where AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId and
						SequenceNumber=@IncomingSequence)
						begin		
							insert into OutSequence(AwardingOrganisationCentreId,SequenceNumber)
							select @MessageAwardingOrganisationCentreId,@IncomingSequence							
						end		
							update A2CTransactionResponseEnvelopeMessages set DataImportStatus=-1 where 			
							SchoolId=@A2CSchoolId and AwardingOrganisationCentreId=@MessageAwardingOrganisationCentreId  
							and DataImportStatus=0 and IncomingSequence=@IncomingSequence
					end	
			end
	end

	update A2CTransactionRequests set CentreNumber=@CentreNumber where A2CTransactionRequestId=@A2CTransactionRequestId
	and SchoolId=@A2CSchoolId

	END
GO
PRINT N'Altering [dbo].[usp_Select_AwardingOrganisationByUniqueKey]...';


GO


ALTER PROCEDURE [dbo].[usp_Select_AwardingOrganisationByUniqueKey]
(
@AwardingOrganisationDetailId int=null
)
AS
  SELECT 
	AO.AwardingOrganisationDetailId
	,AO.AONumber  
	,AwO.Name
	,AwO.EndPoint
	,AwO.PhoneNumber
	,AO.MISCertificate
	,AwO.Description
	,AO.LastModifiedDate
	,AwO.AwardingOrganisationId
  FROM AwardingOrganisationDetails AO 
  Inner Join AwardingOrganisations AwO ON AO.AwardingOrganisationId=AwO.AwardingOrganisationId
  Where AO.AwardingOrganisationDetailId=@AwardingOrganisationDetailId or @AwardingOrganisationDetailId is null
GO
PRINT N'Altering [dbo].[usp_Select_AwardingOrganisationsByCentreId]...';


GO
ALTER PROCEDURE [dbo].[usp_Select_AwardingOrganisationsByCentreId]
(
@A2CSchoolId int,
@CentreId int,
@AwardingOrganisationsByCentreId int
)
AS
SELECT 
      Distinct AO.AONumber+' '+AWO.Name as Name, AO.AwardingOrganisationDetailId,AO.AONumber,AOC.AwardingOrganisationCentreId
  FROM [dbo].[AwardingOrganisationCentres] AOC
  Inner Join AwardingOrganisationDetails AO ON AO.AwardingOrganisationDetailId=AOC.AwardingOrganisationDetailId
  Inner Join AwardingOrganisations AwO ON AO.AwardingOrganisationId=AwO.AwardingOrganisationId
  Inner Join Centres C ON C.A2CSchoolId=AOC.A2CSchoolId AND C.CentreId=AOC.CentreId
  Inner Join AwardingOrganisationCertificates AOCCer on AOCCer.AwardingOrganisationId=AO.AwardingOrganisationId
  Inner Join AwardingOrganisationCentreCertificates AOCC on
			AOCCer.AwardingOrganisationCertificateId = AOCC.AwardingOrganisationCertificateId
			AND AOCC.AwardingOrganisationCentreId=AOC.AwardingOrganisationCentreId  
  Left Join AwardingOrganisationAOAssignedCentres ACI
		  on ACI.AwardingOrganisationDetailId = AOC.AwardingOrganisationDetailId
		  and ACI.A2CSchoolId = AOC.A2CSchoolId
		  and AOC.CentreId = ACI.CentreId
  Where AOC.A2CSchoolId=@A2CSchoolId
  AND ((@AwardingOrganisationsByCentreId<=0 and C.CentreId=@CentreId and ACI.AwardingOrganisationAOAssignedCentreId is null)
  or (@AwardingOrganisationsByCentreId>0 AND AOC.AwardingOrganisationCentreId = @AwardingOrganisationsByCentreId))
  order by AO.AONumber+' '+AWO.Name
GO
PRINT N'Altering [dbo].[usp_SelectA2CTransactionLog]...';


GO
ALTER PROCEDURE [dbo].[usp_SelectA2CTransactionLog]
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
else  atm.OutgoingSequence end as Sequence,
arpem.A2CTransactionResponseEnvelopeMessageId,
srm.SignalResponseText
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
left join A2CTransactionResponseEnvelopeSignals ares on arpe.SchoolId = ares.SchoolId and arpe.A2CTransactionResponseEnvelopeId = ares.A2CTransactionResponseEnvelopeId
left join SignalResponseMasters srm on ares.SignalResponseMasterId =  srm.SignalResponseMasterId
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
	 Declare @ListQuery1 as nvarchar(max)
	
	--print 'ttt1'
	Set @ListQuery=
	'select SchoolId, A2CTransactionId, A2CTransactionRequestId, CentreNumber,AwardingOrganisation,TransactionDate,TransactionName,MessageGuid,FileName,Sequence,RN,
	CASE Transactionname
		WHEN ''ProcessRequestProductCatalogue'' THEN
			ISNULL(SignalResponseText, ''RPC'')
		WHEN ''ManageRequestProductCatalogue'' THEN
			CAST(A2CTransactionResponseEnvelopeMessageId AS nvarchar(500))
		ELSE	
			''''
	END AS Feedback from 
(select SchoolId, A2CTransactionId, A2CTransactionRequestId, CentreNumber,AwardingOrganisation,TransactionDate,TransactionName,MessageGuid,FileName,Sequence ,
A2CTransactionResponseEnvelopeMessageId, SignalResponseText,ROW_NUMBER() OVER (ORDER BY ' + @OrderBy + ') AS RN
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
else  atm.OutgoingSequence end as Sequence,
arpem.A2CTransactionResponseEnvelopeMessageId,
srm.SignalResponseText'
SET @ListQuery1 = 'from A2CTransactions at inner join A2CTransactionMasters am on at.A2CTransactionMasterId=am.A2CTransactionMasterId
inner join AwardingOrganisationCentres aoc on at.SchoolId=aoc.A2CSchoolId and at.AwardingOrganisationCentreId=aoc.AwardingOrganisationCentreId
inner join AwardingOrganisationDetails ad on aoc.AwardingOrganisationDetailId=ad.AwardingOrganisationDetailId
inner join AwardingOrganisations ao on ao.AwardingOrganisationId=ad.AwardingOrganisationId
left join A2CTransactionMessages atm on atm.SchoolId=at.SchoolId and atm.A2CTransactionId=at.A2CTransactionId
left join A2CTransactionEDIs atedi on atedi.SchoolId=at.SchoolId and atedi.A2CTransactionId=at.A2CTransactionId
left join A2CTransactionRequests are on at.SchoolId=are.SchoolId and at.A2CTransactionId=are.A2CTransactionId 
left join A2CTransactionResponses arp on are.SchoolId=arp.SchoolId and are.A2CTransactionRequestId=arp.A2CTransactionRequestId
left join A2CTransactionResponseEnvelopes arpe on arpe.SchoolId=arp.SchoolId and arpe.A2CTransactionResponseId=arp.A2CTransactionResponseId
left join A2CTransactionResponseEnvelopeMessages arpem on arpe.SchoolId=arpem.SchoolId and arpe.A2CTransactionResponseEnvelopeId=arpem.A2CTransactionResponseEnvelopeId
left join A2CTransactionResponseEnvelopeSignals ares on arpe.SchoolId = ares.SchoolId and arpe.A2CTransactionResponseEnvelopeId = ares.A2CTransactionResponseEnvelopeId
left join SignalResponseMasters srm on ares.SignalResponseMasterId =  srm.SignalResponseMasterId
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
	
	DECLARE @ListQueryFinal AS NVARCHAR(MAX)
	SET @ListQueryFinal = @ListQuery + ' ' + @ListQuery1
	
	EXECUTE sp_executesql	@CountQuery, 
							N'@TotalCountOut int OUTPUT', 
							@TotalCountOut = @TotalCount OUTPUT
	EXECUTE sp_executesql @ListQueryFinal, N'@Skip int, @Take int', @Skip = @Skip, @Take = @Take


END
GO
PRINT N'Creating [dbo].[usp_GetXMLFeedbackForResponseEnvelopeMessage]...';


GO



CREATE  PROCEDURE [dbo].[usp_GetXMLFeedbackForResponseEnvelopeMessage]
@SchoolId AS INT,
@A2CTransactionResponseEnvelopeMessageId AS INT

AS
	SET NOCOUNT ON;

	SELECT CAST(data AS XML) AS XMLFeedback, IsMessageLevelFeedbackMessage FROM A2CTransactionResponseEnvelopeMessages
	WHERE IsFeedbackMessage=1 AND A2CTransactionResponseEnvelopeMessageId = @A2CTransactionResponseEnvelopeMessageId AND SchoolId = @SchoolId
GO
PRINT N'Altering [Version]...';


GO
EXECUTE sp_updateextendedproperty @name = N'Version', @value = N'15.1.7.1';


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
From	(Select 1023 ScreenMasterId, 'PollNow' ScreenName,'Poll Now' ScreenDescription
		union all
		Select 1022, 'EditSequence','Edit Sequence'		
		) As temp
		Left Join ScreenMasters sm 
		on temp.ScreenMasterId = sm.ScreenMasterId
Where sm.ScreenMasterId is null

GO

GO
PRINT N'Checking existing data against newly created constraints';


GO
USE [$(DatabaseName)];


GO
ALTER TABLE [dbo].[OutSequence] WITH CHECK CHECK CONSTRAINT [FK_MissingSequence_AwardingOrganisationCentres];


GO
PRINT N'Update complete.';


GO