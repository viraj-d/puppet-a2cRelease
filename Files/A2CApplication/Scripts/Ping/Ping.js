var grid;

$(this.document).ready(function () {
    $('#Centre').change(function () //wire up on change event of the 'country' dropdownlist
    {
        if (grid == undefined) {
            grid = $("#OrganisationList_grid").A2CGrid({
                gridKey: 'OrganisationListGrid',
                url: '/Ping/GetAwardingOrganisationsByCentreId',
                data: function () {
                    var selectedCentreId = $('#Centre').val();
                    if (selectedCentreId == '')
                        selectedCentreId = 0;
                    return {                  
                        centreId: selectedCentreId
                    }
                },
                pageable: false,
                Sortable: true,
                filterable: true,
                clearefilter: true,
                scrollable: true,
                selectable: "multiple",
                autoResize: true,
                columns: [
                        { field: "Name", title: AOName, tooltip: AOName, type: "string", width: "10%" },
                        { field: "AONumber", title: AOId, tooltip: AOId, type: "string", width: "10%" }
                        , { field: "Feedback", title: Feedback, tooltip: Feedback, type: "string", width: "60%", sortable: false, filterable: false }
                        , { field: "Timestamp", title: TimeStamp, tooltip: TimeStamp, type: "string", width: "20%", sortable: false, filterable: false }
                ]
            });
            grid.Render();
        }
        else {
            grid.Refresh();
        }
    })
});

function Ping() {
    if ($("#form0").valid() == false) {
        return false;
    }
    var rows = grid.Selected();
    ClearValidationMessage();
    if (rows.length == 0) {
        var errorMsg = [];
        errorMsg.push(AOSelectMessage);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);
        return;
    }
    var selectedAwardingOrganisations = [];
    var selectedUid = [];
    rows.forEach(function (row, index) {
        selectedAwardingOrganisations.push(row.AwardingOrganisationDetailId);
        selectedUid.push(row.uid);
    });
    busyDiv();
    postJSON('/Ping/Ping/', {
        centreId: $('#Centre').val(),
        centreNumber: $('#Centre option:selected').text(),
        awardingOrganisationDetailIdList: selectedAwardingOrganisations
    }, function (data) {
        for (var sequence = 0; sequence < data.length; sequence++) {
            var item = $('#OrganisationList_grid').data("kendoGrid").dataSource.getByUid(selectedUid[sequence]);
            item.set("Feedback", data[sequence].Feedback);
            item.set("Timestamp", data[sequence].Timestamp);
        }
        clearDiv();
    });
}