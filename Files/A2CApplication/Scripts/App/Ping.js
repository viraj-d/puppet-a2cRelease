var grid;

$(this.document).ready(function () {
    $('#SelectedCentreId').select2('focus');
    $('#SelectedCentreId').on('focus', function () { $('#SelectedCentreId').select2('focus'); })
    $('#SelectedCentreId').change(function () //wire up on change event of the 'country' dropdownlist
    {
        if (grid == undefined) {
            grid = $("#OrganisationList_grid").A2CGrid({
                gridKey: 'OrganisationListGrid',
                url: '/Ping/GetAwardingOrganisationsByCentreId',
                data: function () {                 
                    return {                  
                        centreId: $('#SelectedCentreId').val()
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
                        { field: "Name", title: AOId, tooltip: AOId, type: "string", width: "20%" },
                        //{ field: "Name", title: AOName, tooltip: AOName, type: "string", width: "10%" },
                        //{ field: "AONumber", title: AOId, tooltip: AOId, type: "string", width: "10%" },
                        { field: "Timestamp", title: TimeStamp, tooltip: TimeStamp, type: "string", width: "20%", sortable: false, filterable: false },
                        { field: "Feedback", title: Feedback, tooltip: Feedback, type: "string", width: "60%", sortable: false, filterable: false }
                ]
            });
            grid.Render();
        }
        else {
            grid.ClearSortFilter();
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
    var aoNames='';
    rows.forEach(function (row, index) {
        selectedAwardingOrganisations.push(row.AwardingOrganisationDetailId);
        selectedUid.push(row.uid);
        aoNames += row.Name + ',';
    });
    busyDiv();
    if (aoNames.length > 0) {
        aoNames = aoNames.substring(0, aoNames.length - 1);
    }
    postJSON('/Ping/Ping/', {
        centreId: $('#SelectedCentreId').val(),       
        awardingOrganisationDetailIdList: selectedAwardingOrganisations,
        centreName:$('#select2-chosen-1').text(), 
        names: aoNames
    }, function (data) {
        for (var sequence = 0; sequence < data.length; sequence++) {
            var item = $('#OrganisationList_grid').data("kendoGrid").dataSource.getByUid(selectedUid[sequence]);
            item.set("Feedback", data[sequence].Feedback);
            item.set("Timestamp", data[sequence].Timestamp);
        }
        clearDiv();
    });
}

function PollNow()
{
    if ($("#form0").valid() == false) {
        return false;
    }
    var rows = grid.Selected();
    ClearValidationMessage();
    if (rows.length == 0) {
        DisplayError([{ Id: '', ErrorMessages: [AOSelectMessage] }], 'form0', true);
        return;
    }
    var selectedAwardingOrganisations = [];
    var selectedUid = [];
    var aoNames='';
    rows.forEach(function (row, index) {
        selectedAwardingOrganisations.push(row.AwardingOrganisationDetailId);
        selectedUid.push(row.uid);
        aoNames += row.Name + ',';
    });
    busyDiv();
    if (aoNames.length > 0) {
        aoNames = aoNames.substring(0, aoNames.length - 1);
    }
    postJSON('/Ping/PollNow/', {
        centreId: $('#SelectedCentreId').val(),
        awardingOrganisationDetailIdList: selectedAwardingOrganisations,
        centreName: $('#select2-chosen-1').text(),
        names: aoNames
    }, function (data) {
        for (var sequence = 0; sequence < data.length; sequence++) {
            var item = $('#OrganisationList_grid').data("kendoGrid").dataSource.getByUid(selectedUid[sequence]);
            item.set("Feedback", data[sequence].Feedback);
            item.set("Timestamp", data[sequence].Timestamp);
        }
        clearDiv();
    });
}