var grid;

$(this.document).ready(function () {    
    LoadSchoolList();
});
function LoadSchoolList() {
    if (!grid) {
        grid = $("#grid").A2CGrid({
            gridKey: 'GetSchoolListGrid',
            url: '/SelectSchool/GetSchoolList',
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            gridState: BrowserCache.Get(BrowserCache.Key.SchoolListView),
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.SchoolListView, this.getOptions());
            },
            columns: [                   
                    { field: "EstablishmentId", title: SchoolEstablishmentId, tooltip: SchoolEstablishmentId, type: "string", width: "25%" },
                    { field: "EstablishmentName", title: SchoolEstablishmentName, tooltip: SchoolEstablishmentName, type: "string", width: "25%" },
                    { field: "LAId", title: SchoolLAId, tooltip: SchoolLAId, type: "string", width: "25%" },
                    { field: "LAName", title: SchoolLAName, tooltip: SchoolLAName, type: "string", width: "25%" }
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
        errorMsg.push(SelectSchoolNoRecordFound);
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
    postJSON('/SelectSchool/SchoolSelected/', {
        schoolId: selectedSchoolId,
        schoolName:schoolName
    }, function (data) {
        clearAllBrowserCache();
        clearDiv();
        document.location.href = '/SelectSchool/Index';
    });
}