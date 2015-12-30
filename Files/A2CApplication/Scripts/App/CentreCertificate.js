$(document).ready(function () {
    LoadCenterGrid();
});
var grid;
function LoadCenterGrid() {
    if (grid != undefined) {
        grid.ClearSortFilter();
        grid.Refresh();
        return;
    }
    grid = $("#grid").A2CGrid({
        gridKey: 'CenterOrganisationListGrid',
        url: '/ImportCentreCertificate/SelectAwardingOrganisationCentreList',
        pageable: false,
        Sortable: true,
        filterable: true,
        clearefilter: true,
        scrollable: true,
        //selectable: "multiple",
        autoResize: true,
        columns: [
                { field: "AONumber", title: AONumber, tooltip: AONumber, type: "string", width: "10%" }
                , { field: "Name", title: Name, tooltip: Name, type: "string", width: "10%" }
                , { field: "CentreNumber", title: CentreNumber, tooltip: CentreNumber, type: "string", width: "10%" }
                , { field: "Status", title: Status, tooltip: Status, type: "string", width: "10%" }
                , { field: "CertificateExpiredDate", title: CertificateExpiredDate, tooltip: CertificateExpiredDate, type: "date", width: "10%" }
                , { field: "LastModifiedDate", title: LastModifiedDate, tooltip: LastModifiedDate, type: "date", width: "15%", format: javaScriptDateTimeFormat, filterable: false }
                , { field: "Message", title: Message, tooltip: Message, type: "string", width: "35%" }
        ]
    });
    grid.Render();
   
}
function Save() {
    if ($("#form0").valid() == false) {
        return false;
    }

    var fileName = document.getElementById('FileName').files[0];
    if (!(/\.(a2cc)$/i).test(fileName.name)) {
        var errorMsg = [];
        errorMsg.push('Please upload file with a2cc extension file');
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);
        return;
    }

    if (window.FormData !== undefined) {
        var data = new FormData();
        data.append("file" + $('#Password').val(), fileName);
        busyDiv();

        postFile('/ImportCentreCertificate/Save/', data, function (result) {
            var firstTime = false;
            for (var i = 0; i < result.errorMsg.length; i++) {
                if (result.errorMsg[i].Id != "Success") {
                    var errorArray = [];
                    errorArray.push(result.errorMsg[i]);
                    DisplayError(errorArray, undefined, firstTime);
                    firstTime = true;
                }
                if (result.errorMsg[i].Id == "Success") {
                    DisplaySuccess(result.errorMsg[i].ErrorMessages[0], undefined, firstTime);
                    firstTime = true;
                }
            }
            $('#Password').val('');
            $('#fileText').val('');
            document.getElementById('FileName').type = "text";
            document.getElementById('FileName').type = "file";
            clearDiv();
            LoadCenterGrid();
        }, false, function () {
            clearDiv();
        });

    }
    else {
        var errorMsg = [];
        errorMsg.push(ImportCentreCertificateNotSupport);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);      
    }
}
function updateFileText(object) {
    if (document.getElementById('FileName').files.length > 0)
        $("#fileText").val(document.getElementById('FileName').files[0].name);
    else
        $("#fileText").val('');
}