var grid;

$(this.document).ready(function () {

   
    $('#SelectedAwardingOrganisationId').select2('focus');
    $('#SelectedAwardingOrganisationId').on('focus', function () { $('#SelectedAwardingOrganisationId').select2('focus'); })
    $('#SelectedCentreId').select2('focus');
    $('#SelectedCentreId').on('focus', function () { $('#SelectedCentreId').select2('focus'); })
    ResetSequenceNumber();
    $('#SelectedCentreId').change(function () //wire up on change event of the 'country' dropdownlist
    {
        ResetSequenceNumber();
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
                if (centreId != '' && centreId.indexOf(',0') < 0) {
                    value = this.AwardingOrganisationCentreId;
                    text = this.Name;
                }
                options.append($("<option />").val(this.AwardingOrganisationCentreId).text(this.Name));
            });
            options.val(value);
            if (value != '')
                GetSequenceNumber();
            $("#s2id_SelectedAwardingOrganisationId .select2-chosen").text(text);
            clearDiv();
        });
    })
    $('#SelectedAwardingOrganisationId').change(function () //wire up on change event of the 'country' dropdownlist
    {
        GetSequenceNumber();
    });
});
function GetSequenceNumber() {
    var awardingOrganisationCentreId = $('#SelectedAwardingOrganisationId').val();
    if (awardingOrganisationCentreId > 0) {
        busyDiv();
        postJSON('/EditSequence/SelectSequenceNumber/', {
            awardingOrganisationCentreId: awardingOrganisationCentreId
        }, function (result) {
            $("#ResetSequenceNumber").val("");           
            $("#CurrentSequenceNumber").val(result);          
            clearDiv();
        });
    }
    else {
        ResetSequenceNumber();
    }
}
function ResetSequenceNumber() {   
    $("#CurrentSequenceNumber").val("");
    $("#ResetSequenceNumber").val("");
}
function SaveSequenceNumber() {        
    ClearValidationMessage();    
    if ($("#form0").valid() == false) {
        return false;
    }    
    var centreNumberText = $('#SelectedCentreId option:selected').text().split(" (")[0];
    busyDiv();
    var editSequenceModelSave = {
        awardingOrganisationCentreId: $('#SelectedAwardingOrganisationId').val(),
        resetSequenceNumber: $("#ResetSequenceNumber").val(),
        centreNumber: centreNumberText,
        awardingOrganisationNumber: $('#SelectedAwardingOrganisationId option:selected').text()
    }

    postJSON('/EditSequence/EditSequenceSave/', {
        editSequenceModelSave: editSequenceModelSave
    }, function (data) {                
        if (data && data.status) {
            $("#CurrentSequenceNumber").val($("#ResetSequenceNumber").val());
            $("#ResetSequenceNumber").val("");
            DisplaySuccess(configurationSaveSuccessMessage, 'form0');
        }
        else {
            DisplayError(data.errorMsg);
        }
        clearDiv();
    });
}