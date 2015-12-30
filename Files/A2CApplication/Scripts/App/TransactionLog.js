
$(this.document).ready(function () {
    LoadTransactionLogList();
});

var transactionLogGrid;
function LoadTransactionLogList() {
        transactionLogGrid = $("#transactionLogGrid").A2CGrid({
            gridKey: 'transactionLogGrid',
            url: '/TransactionLog/GetTransactionLogList',
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            gridState: BrowserCache.Get(BrowserCache.Key.TransactionLogListView),
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.TransactionLogListView, this.getOptions());
            },
            columns: [
                { field: "CentreNumber", title: CentreTitle, tooltip: CentreTitle, type: "string", width: "12%" },
                { field: "AwardingOrganisation", title: AwardingOrganizationTitle, tooltip: AwardingOrganizationTitle, type: "string", width: "11%" },
                { field: "TransactionDate", title: DateTitle, tooltip: TransactionLogTransactionDateTitle, type: "date", width: "15%", format: javaScriptDateTimeFormat },
                { field: "TransactionName", title: TransactionLogTransactionNameTitle, tooltip: TransactionLogTransactionNameTitle, type: "string", width: "17%" },
                { field: "FileName", title: TransactionLogFileNameTitle, tooltip: TransactionLogFileNameTitle, type: "string", width: "10%" },
                { field: "Sequence", title: TransactionLogSequenceTitle, tooltip: TransactionLogSequenceTitle, type: "integer", width: "15%" },
                { field: "MessageGuid", title: TransactionLogGUIDTitle, tooltip: TransactionLogGUIDTitle, type: "string", width: "10%" },
                { title: TestPingScreenAOFeedbackLable, tooltip: TestPingScreenAOFeedbackLable, type: "string", width: "10%", template: "# if (TransactionName == 'ProcessRequestProductCatalogue') { # #= FeedbackDetails # # } else if (A2CTransactionRequestId != null && A2CTransactionMessageId != null) { # <a class='fa fa-info-circle' href=javascript:GetCentreToAOFeedback(#= data.A2CTransactionRequestId #,#= data.A2CTransactionMessageId #)></a> # } else if (FeedbackDetails != null) { if(IsRedCodeFeedback) { # <a class='fa fa-info-circle redCode' href=javascript:GetManageRequestProductCatalogueFeedback(#= data.FeedbackDetails #)></a> #  } else {  # <a class='fa fa-info-circle' href=javascript:GetManageRequestProductCatalogueFeedback(#= data.FeedbackDetails #)></a> # } } else { # # } #" }
        ]});
        transactionLogGrid.Render();    
}

function GetManageRequestProductCatalogueFeedback(e)
{
    var CommentsArgJson = { "transactionResponseEnvelopeMessageId": e };
    $.A2C.ModalPopup({
        Title: FeedbackPopupTitleRT,
        DynamicContent: { Type: "POST", URL: '/TransactionLog/FeedbackPopup', Data: CommentsArgJson },
        ShowPopUp: true,
        OnLoadCallback: function () { $('.modal-body').css('word-wrap', 'break-word'); }
    });

    $("#feedbackPopup").html()
}
function GetCentreToAOFeedback(requestId, messageId) {

    var CommentsArgJson = { "transactionRequestId": requestId, "transactionMessageId": messageId };
    
    $.A2C.ModalPopup({
        Title: FeedbackPopupTitleRT,
        DynamicContent: { Type: "POST", URL: '/TransactionLog/FeedbackPopup', Data: CommentsArgJson },
        ShowPopUp: true,
        OnLoadCallback: function () { $('.modal-body').css('word-wrap', 'break-word'); }
    });

    $("#feedbackPopup").html()
}

function GetFeedback(e) {
    $("#feedbackDetailsGrid").A2CGrid({
        gridKey: 'feedbackDetailsGrid',
        url: '/TransactionLog/GetFeedback',
            data: function () {
                var feedbackDetailsDto = { feedback: e };
                return feedbackDetailsDto
            },
            pageable: false,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: false,
            width: 600,
            dataBound: function () {
                clearDiv();
            },
            columns: [
                        { field: "Code", title: CodeRT, tooltip: CodeRT, type: "string", width: "20%" },
                        { field: "Severity", title: SeverityRT, tooltip: SeverityRT, type: "string", width: "20%" },
                        { field: "Description", title: ErrorLogDescriptionRT, tooltip: ErrorLogDescriptionRT, type: "string", width: "60%", encoded: false }
            ]
        }).Render();
}