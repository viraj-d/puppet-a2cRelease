$(this.document).ready(function () {
    $('#SelectedAwardingOrganisationId').select2('focus');
    $('#SelectedAwardingOrganisationId').on('focus', function () { $('#SelectedAwardingOrganisationId').select2('focus'); })

    $('#SelectedCentreId').select2('focus');
    $('#SelectedCentreId').on('focus', function () { $('#SelectedCentreId').select2('focus'); })

    ResetSequenceNumber(false);
    
    $('#SelectedCentreId').change(function () {
        busyDiv();

        ResetSequenceNumber(true);
        var centreId = $('#SelectedCentreId').val();

        postJSON('/SubmitRequest/SelectAwardingOrganisationList/', {
            centreId: centreId
        }, function (result) {
            var options = $("#SelectedAwardingOrganisationId");
            var value = '';
            var text = SelectAwardingOrganisationText;
            options.empty();
            options.append($("<option />").val('').text(SelectAwardingOrganisationText));
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
    });

    $('#SelectedAwardingOrganisationId').change(function ()
    {
        GetSequenceNumber();
    });
});

function GetSequenceNumber() {
    var awardingOrganisationCentreId = $('#SelectedAwardingOrganisationId').val();
    if (awardingOrganisationCentreId > 0) {
        busyDiv();
        postJSON('/EditIncomingSequenceNumber/GetSequenceNumbers/', {
            awardingOrganisationCentreId: awardingOrganisationCentreId
        }, function (result) {
            $("#ResetSequenceNumber").val("");
            $("#ExpectedSequenceNumber").val(result.ExpectedSequenceNumber);
            $("#PendingMessages").val(result.PendingMessages);
            clearDiv();
        });
    }
    else {
        ResetSequenceNumber(true);
    }
}

function ResetSequenceNumber(resetFlag) {
    $("#ExpectedSequenceNumber").val("");
    $("#ResetSequenceNumber").val("");
    $("#PendingMessages").val("");
    if(resetFlag == true)
        $('#chkIgnoreMessages').prop('checked', true);
}

function SaveSequenceNumber() {
    busyDiv();

    ClearValidationMessage();

    if ($("#form0").valid() == false) {
        clearDiv();
        return false;
    }

    var centreNumberText = $('#SelectedCentreId option:selected').text().split(" (")[0];
    
    var incomingSequenceNumber = {
        AwardingOrganisationCentreId: $('#SelectedAwardingOrganisationId').val(),
        ResetSequenceNumber: $("#ResetSequenceNumber").val(),
        CentreNumber: centreNumberText,
        AwardingOrganisationNumber: $('#SelectedAwardingOrganisationId option:selected').text(),
        IgnorePendingMessages: $("#chkIgnoreMessages").is(':checked'),
        OldSequenceNumber: $("#ExpectedSequenceNumber").val()
    }

    postJSON('/EditIncomingSequenceNumber/SaveSequence/', {
        incomingSequenceNumber: incomingSequenceNumber
    }, function (data) {
        if (data && data.status) {
            var resetVal = $("#ResetSequenceNumber").val();
            ResetSequenceNumber(false);
            $("#ExpectedSequenceNumber").val(resetVal);
            DisplaySuccess(configurationSaveSuccessMessage, 'form0');
        }
        else {
            DisplayError(data.errorMsg);
        }
        clearDiv();
    });
}