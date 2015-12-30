var grid;

$(this.document).ready(function () {
    $('#SelectedAwardingOrganisationId').select2('focus');
    $('#SelectedAwardingOrganisationId').on('focus', function () { $('#SelectedAwardingOrganisationId').select2('focus'); })
    $('#SelectedCentreId').select2('focus');
    $('#SelectedCentreId').on('focus', function () { $('#SelectedCentreId').select2('focus'); })
    

    LoadRequestList();
   
    $('#SelectedCentreId').change(function () //wire up on change event of the 'country' dropdownlist
    {
        var centreId = $('#SelectedCentreId').val();
        busyDiv();
        postJSON('/SubmitRequest/SelectAwardingOrganisationList/', {
            centreId: centreId
        }, function (result) {
            var options = $("#SelectedAwardingOrganisationId");
            var value = '';
            var text = submitA2CRequestSelectAwardingOrganisation;
            options.empty();
            options.append($("<option />").val('').text(submitA2CRequestSelectAwardingOrganisation));
            $.each(result, function () {
                if (centreId != '' && centreId.indexOf(',0') < 0)
                {
                    value = this.AwardingOrganisationCentreId;
                    text = this.Name;
                }
                options.append($("<option />").val(this.AwardingOrganisationCentreId).text(this.Name));
            });
            options.val(value);
            $("#s2id_SelectedAwardingOrganisationId .select2-chosen").text(text);
            clearDiv();
        });
    })
});
function LoadRequestList() {

    if (!grid) {
        grid = $("#grid").A2CGrid({
            gridKey: 'submitRequestGrid',
            url: '/SubmitRequest/GetRequestList',
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "multiple",
            autoResize: true,
            columns: [
                    { field: "CentreNumber", title: CentreNumber, tooltip: CentreNumber, type: "string", width: "8%" },
                    { field: "Name", title: Name, tooltip: Name, type: "string", width: "9%" },
                    { field: "AONumber", title: AONumber, tooltip: AONumber, type: "string", width: "7%" },
                    { field: "IdentifierType", title: IdentifierType, tooltip: IdentifierType, type: "string", width: "12%" },
                     { field: "TransactionType", title: TransactionType, tooltip: TransactionType, type: "string", width: "14%" },
                    { field: "IdentifierValue", title: IdentifierValue, tooltip: IdentifierValue, type: "string", width: "12%" },
                    { field: "Feedback", title: Feedback, tooltip: Feedback, type: "string", width: "24%" }
                    , { field: "LastModifiedDate", title: LastModifiedDate, tooltip: LastModifiedDate, type: "date", width: "14%", filterable: true, format: javaScriptDateTimeFormat }
            ]
        });
        grid.Render();
    }
    else {
        grid.ClearSortFilter();
    }
}
function SaveRequest() {
    if ($("#form0").valid() == false) {
        return false;
    }

    ClearValidationMessage();
    var centreNumberText = $('#SelectedCentreId option:selected').text().split(" (")[0];
    showConfirmationMessage(SubmitRequestConfirmRPC.format([centreNumberText, $('#SelectedAwardingOrganisationId option:selected').text()]), function () {
        busyDiv();
        postJSON('/SubmitRequest/SubmitRequestSave/', {
            awardingOrganisationCentreId: $('#SelectedAwardingOrganisationId').val(),
            centreNumber: centreNumberText,
            awardingOrganisationNumber: $('#SelectedAwardingOrganisationId option:selected').text()
        }, function (data) {
            clearDiv();
            LoadRequestList();
        });
    });

}