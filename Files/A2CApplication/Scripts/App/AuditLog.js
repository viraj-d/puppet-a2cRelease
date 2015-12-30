var auditLogGrid;

function LoadAuditLogList() {
    if (!auditLogGrid) {
        auditLogGrid = $("#auditLogGrid").A2CGrid({
            gridKey: 'auditLogGrid',
            url: '/AuditLog/GetAuditLogList',
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            gridState: BrowserCache.Get(BrowserCache.Key.AuditLogListView),
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.AuditLogListView, this.getOptions());
            },
            columns: [
                { field: "LastModifiedDate", title: DateTitle, tooltip: DateTitle, type: "date", width: "13%", filterable: true,  format: javaScriptDateTimeFormat },
                { field: "SchoolName", title: SchoolNameTitle, tooltip: SchoolNameTitle, type: "string", width: "15%" },
                { field: "UserName", title: LoggedinUserTitle, tooltip: LoggedinUserTitle, type: "string", width: "12%" },
                { field: "A2CRoleType", title: RoleoftheUserTitle, tooltip: RoleoftheUserTitle, type: "string", width: "14%" },
                { field: "Screen", title: ScreenofActionTitle, tooltip: ScreenofActionTitle, type: "string", width: "15%" },
                { field: "Description", title: DescriptionTitle, tooltip: DescriptionTitle, type: "string", width: "31%" }
            ]
        });
        auditLogGrid.Render();
    }
    else {
        auditLogGrid.Refresh();
    }
}