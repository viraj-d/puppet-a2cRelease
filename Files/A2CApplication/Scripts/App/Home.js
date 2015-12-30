
var ediNotoficationGrid;
function LoadEdiNotofications() {
    ediNotoficationGrid = $("#ediNotoficationGrid").A2CGrid({
        gridKey: 'ediNotoficationGrid',
        url: '/Home/GetEdiNotifications',
        pageable: true,
        Sortable: true,
        filterable: true,
        clearefilter: true,
        scrollable: true,
        selectable: "single",
        autoResize: true,
        //gridState: BrowserCache.Get(BrowserCache.Key.TransactionLogListView),
        //onStateChangCallBack: function () {
        //    BrowserCache.Edit(BrowserCache.Key.TransactionLogListView, this.getOptions());
        //},
        columns: [
            { field: "CentreNumber", title: CentreTitle, tooltip: CentreTitle, type: "string", width: "10%" },
            { field: "AwardingOrganisation", title: AwardingOrganizationTitle, tooltip: AwardingOrganizationTitle, type: "string", width: "15%" },
            { field: "TransactionDate", title: DateTitle, tooltip: TransactionLogTransactionDateTitle, type: "date", width: "15%", format: javaScriptDateTimeFormat },
            { field: "FileName", title: TransactionLogFileNameTitle, tooltip: TransactionLogFileNameTitle, template: "<a href=javascript:GetEDIFileDetials('#= data.TransactionName #',#= data.A2CTransactionResponseEnvelopeEdiId #,#= data.A2CTransactionRequestId #)>${FileName}</a>", width: "15%" },
            { field: "FeedbackDetails", title: FeedbackPopupTitleRT, tooltip: FeedbackPopupTitleRT, type: "string", width: "45%" }
        ]
    });
    ediNotoficationGrid.Render();
}


function GetEDIFileDetials(transactionName, transactionResponseEnvelopeEdiId, transactionRequestId)
{
    //alert(transactionName);
    //alert(transactionResponseEnvelopeEdiId);
    //alert(transactionRequestId);
    //var transactionName;
    //var A2CTransactionResponseEnvelopeEdiId;
    //var A2CTransactionRequestId;

    //if(A2CTransactionResponseEnvelopeEdiId != null && A2CTransactionResponseEnvelopeEdiId > 0)
    //{
    //    ShowPopupForResultFile();
    //}
    //else if (A2CTransactionRequestId != null && A2CTransactionRequestId > 0)
    //{
        
    //}
}

function InvalidFileMessage()
{
    alert("Invalid format");
}
