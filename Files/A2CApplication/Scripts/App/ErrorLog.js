var errorLogGrid;

function LoadErrorLogList() {
    if (!errorLogGrid) {
        errorLogGrid = $("#errorLogGrid").A2CGrid({
            gridKey: 'errorLogGrid',
            url: '/ErrorLog/GetErrorLogList',
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            gridState: BrowserCache.Get(BrowserCache.Key.ErrorLogListView),
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.ErrorLogListView, this.getOptions());
            },
            columns: [
                { field: "Centre", title: CentreTitle, tooltip: CentreTitle, type: "string", width: "20%" },
                { field: "AwardingOrganization", title: AwardingOrganizationTitle, tooltip: AwardingOrganizationTitle, type: "string", width: "20%" },
                { field: "LastModifiedDate", title: DateTitle, tooltip: DateTitle, type: "date", width: "20%", filterable: true, format: javaScriptDateTimeFormat },
                { field: "Screen", title: ScreenTitle, tooltip: ScreenTitle, type: "string", width: "20%" },
                { title: DescriptionTitle, tooltip: DescriptionTitle, type: "string", width: "20%", template: "<a class='fa fa-info-circle' href=javascript:GetDescription(#= data.ErrorLogId #);></a>", sortable: false, filterable: false }
        ]});
        errorLogGrid.Render();    
    }
    else {
        errorLogGrid.Refresh();
    }
}

function GetDescription(errorLogId) {    
    var CommentsArgJson = { "errorLogId": errorLogId };

    $.A2C.ModalPopup({
        Title: DescriptionTitle,
        DynamicContent: { Type: "POST", URL: '/ErrorLog/GetErrorLogDetails', Data: CommentsArgJson },
        ShowPopUp: true,
        OnLoadCallback: function () { $('.modal-body').css('word-wrap', 'break-word'); }
    });
}