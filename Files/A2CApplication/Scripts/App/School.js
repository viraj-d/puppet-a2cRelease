var grid;

$(this.document).ready(function () {
    LoadSchoolList();
});
function LoadSchoolList() {
    if (!grid) {
        grid = $("#grid").A2CGrid({
            gridKey: 'GetSchoolListGrid',
            url: '/School/GetSchoolList',
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            gridState: BrowserCache.Get(BrowserCache.Key.SchoolUserListView),
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.SchoolUserListView, this.getOptions());
            },
            columns: [
                    { field: "LAId", title: SchoolLAId, tooltip: SchoolLAId, type: "string", width: "10%" },
                    { field: "LAName", title: SchoolLAName, tooltip: SchoolLAName, type: "string", width: "13%" },
                    { field: "EstablishmentId", title: SchoolEstablishmentId, tooltip: SchoolEstablishmentId, type: "string", width: "10%" },
                    { field: "EstablishmentName", title: SchoolEstablishmentName, tooltip: SchoolEstablishmentName, type: "string", width: "10%" },
            ]
        });
        grid.Render();
    }
}
function Save() {
    if ($("#form0").valid() == false) {
        return false;
    }
    var selectedSchoolId;
    var schoolName;
    var rows = grid.Selected();
    ClearValidationMessage();
    if (rows.length == 0) {
        var errorMsg = [];
        errorMsg.push('Select school');
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);
        return;
    }
    rows.forEach(function (row, index) {
        selectedSchoolId = row.A2CSchoolId;
        schoolName = row.EstablishmentName;
    });    
    postJSON('/School/SchoolSelected/', {
        schoolId: selectedSchoolId,
        schoolName:schoolName
    }, function (data) {
        clearAllBrowserCache();
        clearDiv();
        document.location.href = '/School/Index';
    });
}