var SelectedEmailIntegrationMode = "";

function CancelSuperUserConfiguration() {
    window.location.href = '/Configuration/ApplicationConfig';
}

function SaveSuperUserConfiguration() {
    if ($("#form0").valid() == false) {
        return false;
    }

    var applicationConfig = {
        AuthenticationRequired: $("#chkAuthenticationRequired").is(':checked'),
        Password: $('#EmailProvider_Password').val(),
        UserId: $('#EmailProvider_UserId').val(),
        Email: $('#EmailProvider_Email').val().trim(),
        Host: $('#EmailProvider_Host').val(),
        Port: $('#EmailProvider_Port').val(),
        SMTPEmailProviderId: $('#EmailProvider_SMTPEmailProviderId').val(),
    };
    busyDiv();
    postJSON('/Configuration/SaveApplicationConfig', { applicationConfig: applicationConfig }, function (result) {
        if (result && result.status) {
            $('#EmailProvider_SMTPEmailProviderId').val(result.sMTPEmailProviderId);
            DisplaySuccess(configurationSaveSuccessMessage, 'form0');            
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveApplicationURL() {
    if ($("#formApplicationURL").valid() == false) {
        return false;
    }
    var systemConfigurations = {
        A2CApplicationUrl: $('#A2CApplicationUrl').val()
    };
    var applicationURL = $('#A2CApplicationUrl').val();
    busyDiv();
    postJSON('/Configuration/SaveApplicationUrl', { systemConfigurations: systemConfigurations }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveCoreComponentFrequencyForEDI() {
    if ($("#formCoreComponentFrequencyEDI").valid() == false) {
        return false;
    }
    var systemConfigurations = {
        PickupFileFromEdiFolderInMinutes: $('#PickupFileFromEdiFolderInMinutes').val()
    };
    busyDiv();
    postJSON('/Configuration/SaveCoreComponentFrequencyForEDI',{ systemConfigurations: systemConfigurations }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveMessageSendFrequency() {
    if ($("#formMessageSendFrequency").valid() == false) {
        return false;
    }
    var systemConfigurations = {
        SendA2CRequestInMinutes: $('#SendA2CRequestInMinutes').val()
    };
    busyDiv();
    postJSON('/Configuration/SaveMessageSendFrequency', { systemConfigurations: systemConfigurations }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SavePollingFrequency() {
    if ($("#formPollingFrequency").valid() == false) {
        return false;
    }
    var systemConfigurations = {
        PollingInMinutes: $('#PollingInMinutes').val()
    };
    busyDiv();
    postJSON('/Configuration/SavePollingFrequency', { systemConfigurations: systemConfigurations }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveNoOfDaysToStoreMessagesLogs() {
    if ($("#formNoOfDaysToStoreMessagesLogs").valid() == false) {
        return false;
    }
    var systemConfigurations = {
        NoOfDaysToStoreAuditLogs: $('#NoOfDaysToStoreAuditLogs').val(),
        NoOfDaysToStoreMessages: $('#NoOfDaysToStoreMessages').val(),
        NoOfDaysToStoreFeedbackMessages: $('#NoOfDaysToStoreFeedbackMessages').val(),
        NoOfDaysToStoreBusinessErrorLogs: $('#NoOfDaysToStoreBusinessErrorLogs').val()
    };
    busyDiv();
    postJSON('/Configuration/SaveNoOfDaysToStoreMessagesLogs', { systemConfigurations: systemConfigurations }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveApplicationContactEmailPhone() {
    if ($("#formContactEmailPhone").valid() == false) {
        return false;
    }
    var systemConfigurations = {
        ContactEmail: $('#ContactEmail').val().trim(),
        ContactPhoneNumber: $('#ContactPhoneNumber').val()
    };
    busyDiv();
    postJSON('/Configuration/SaveContactEmailPhone', { systemConfigurations: systemConfigurations }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveSchoolContactEmailPhone() {
    if ($("#formContactEmailPhone").valid() == false) {
        return false;
    }
    var schoolApplicationConfiguration = {
        ContactEmail: $('#ContactEmail').val().trim(),
        ContactPhoneNumber: $('#ContactPhoneNumber').val()
    };
    var schoolConfigurationId=$('#SchoolConfigurationId').val();
    busyDiv();
    postJSON('/Configuration/SaveSchoolContactEmailPhone', { schoolApplicationConfiguration: schoolApplicationConfiguration, schoolConfigurationId: schoolConfigurationId }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function SaveSchoolEDIExceptionHandling() {
    if ($("#formEDIException").valid() == false) {
        return false;
    }
    var schoolApplicationConfiguration = {
        NumberOfAttemptCheckForAOConnection: $('#NumberOfAttemptCheckForAOConnection').val()
    };
    var schoolConfigurationId = $('#SchoolConfigurationId').val();
    busyDiv();
    postJSON('/Configuration/SaveSchoolEdiExceptionHandling', { schoolApplicationConfiguration: schoolApplicationConfiguration, schoolConfigurationId: schoolConfigurationId }, function (result) {
        if (result && result.status) {
            DisplaySuccess(configurationSaveSuccessMessage);
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function setEmailIntegrationMode() {
    resetValidation();
    SelectedEmailIntegrationMode = "";

    if ($('input:radio[name=rdbEmailIntegrationMode]:checked').val() == "None") {
        SelectedEmailIntegrationMode = "None";        
        disableSMTPInputs();
        $('#EmailProvider_AmazonCloudEmail').prop('disabled', true);
        $('#EmailProvider_AmazonCloudEmail').val('');
    }
    else if ($('input:radio[name=rdbEmailIntegrationMode]:checked').val() == "Amazon") {
        SelectedEmailIntegrationMode = "Amazon";
        disableSMTPInputs();
        $('#EmailProvider_AmazonCloudEmail').prop('disabled', false);
    }
    else if ($('input:radio[name=rdbEmailIntegrationMode]:checked').val() == "SMTP") {
        SelectedEmailIntegrationMode = "SMTP";
        enableSMTPInputs();
        $('#AEmailProvider_mazonCloudEmail').prop('disabled', true);
        $('#EmailProvider_AmazonCloudEmail').val('');
    }

    enableDisableEmailIntegration(SelectedEmailIntegrationMode);
}

function enableDisableEmailIntegration(selection) {
    if (selection == "None") {       
        disableSMTPInputs();
        $('#EmailProvider_AmazonCloudEmail').prop('disabled', true);
        $('#EmailProvider_AmazonCloudEmail').val('');
        $('#EmailProvider_AmazonCloudEmail').addClass('A2CDisabledInput');
    }
    else if (selection == "Amazon") {       
        disableSMTPInputs();
        $('#EmailProvider_AmazonCloudEmail').prop('disabled', false);
        $('#EmailProvider_AmazonCloudEmail').removeClass('A2CDisabledInput');
        $('#EmailProvider_AmazonCloudEmail').focus();
    }
    else if (selection == "SMTP") {        
        enableSMTPInputs();
        $('#EmailProvider_AmazonCloudEmail').prop('disabled', true);
        $('#EmailProvider_AmazonCloudEmail').val('');
        $('#EmailProvider_AmazonCloudEmail').addClass('A2CDisabledInput');
        $('#EmailProvider_SMTPEmail').focus();
    }
}

function disableSMTPInputs() {
    $('#EmailProvider_SMTPEmail').prop('disabled', true);
    $('#EmailProvider_SMTPEmail').val('');
    $('#EmailProvider_SMTPEmail').addClass('A2CDisabledInput');

    $('#EmailProvider_Host').prop('disabled', true);
    $('#EmailProvider_Host').val('');
    $('#EmailProvider_Host').addClass('A2CDisabledInput');

    $('#EmailProvider_Port').prop('disabled', true);
    $('#EmailProvider_Port').val('');
    $('#EmailProvider_Port').addClass('A2CDisabledInput');

    $('#EmailProvider_UserId').prop('disabled', true);
    $('#EmailProvider_UserId').val('');
    $('#EmailProvider_UserId').addClass('A2CDisabledInput');

    $('#EmailProvider_Password').prop('disabled', true);
    $('#EmailProvider_Password').val('');
    $('#EmailProvider_Password').addClass('A2CDisabledInput');

    $('#chkAuthenticationRequired').prop('disabled', true);
    $('#chkAuthenticationRequired').prop('checked', false);
    $('#chkAuthenticationRequired').addClass('A2CDisabledInput');
}

function enableSMTPInputs() {
    $('#EmailProvider_SMTPEmail').prop('disabled', false);
    $('#EmailProvider_SMTPEmail').removeClass('A2CDisabledInput');
    $('#EmailProvider_Host').prop('disabled', false);
    $('#EmailProvider_Host').removeClass('A2CDisabledInput');
    $('#EmailProvider_Port').prop('disabled', false);
    $('#EmailProvider_Port').removeClass('A2CDisabledInput');
    $('#EmailProvider_UserId').prop('disabled', false);
    $('#EmailProvider_UserId').removeClass('A2CDisabledInput');
    $('#EmailProvider_Password').prop('disabled', false);
    $('#EmailProvider_Password').removeClass('A2CDisabledInput');
    $('#chkAuthenticationRequired').prop('disabled', false);
    $('#chkAuthenticationRequired').removeClass('A2CDisabledInput');
}

function saveSchoolUserConfiguration() {    
    if (SelectedEmailIntegrationMode == "Amazon") {
        if ($("#EmailProvider_AmazonCloudEmail").valid() == false) {
            return false;
        }
    }
    else if (SelectedEmailIntegrationMode == "SMTP") {
        var ValidationOk = true;

        if ($("#EmailProvider_SMTPEmail").valid() == false)
            ValidationOk = false;
        if ($("#EmailProvider_Host").valid() == false)
            ValidationOk = false;
        if ($("#EmailProvider_Port").valid() == false)
            ValidationOk = false;
        if ($("#EmailProvider_UserId").valid() == false)
            ValidationOk = false;

        if (ValidationOk == false)
        {
            return false;
        }
    }

    var selectedMode = -1;

    if (SelectedEmailIntegrationMode == "None") {
        selectedMode = 0;
    }
    else if (SelectedEmailIntegrationMode == "SMTP") {
        selectedMode = 1;
    }
    else if (SelectedEmailIntegrationMode == "Amazon") {
        selectedMode = 2;
    }    

    var schoolEmailProvider = {
        AmazonCloudEmail: $('#EmailProvider_AmazonCloudEmail').val().trim(),
        SMTPEmail: $('#EmailProvider_SMTPEmail').val().trim(),
        Host: $('#EmailProvider_Host').val(),
        Port: $('#EmailProvider_Port').val(),
        UserId: $('#EmailProvider_UserId').val(),
        Password: $('#EmailProvider_Password').val(),
        AuthenticationRequired: $("#chkAuthenticationRequired").is(':checked'),
        SMTPEmailProviderId: $('#EmailProvider_SMTPEmailProviderId').val(),
        SelectedEmailIntegrationMode: selectedMode
    };

    busyDiv();

    postJSON('/Configuration/SaveSchoolApplicationConfig', { schoolEmailProvider: schoolEmailProvider }, function (result) {
        if (result && result.status) {
            $('#EmailProvider_SMTPEmailProviderId').val(result.sMTPEmailProviderId);
            DisplaySuccess(configurationSaveSuccessMessage, 'form0');
        }
        else {
            DisplayError(result.errorMsg);
        }
        clearDiv();
    });
}

function resetValidation() {
    var validator = $("#form0").validate();
    validator.resetForm();
    
    $('#EmailProvider_AmazonCloudEmail').parent().parent().removeClass('state-error');
    $('#EmailProvider_SMTPEmail').parent().parent().removeClass('state-error');
    $('#EmailProvider_Host').parent().parent().removeClass('state-error');
    $('#EmailProvider_Port').parent().parent().removeClass('state-error');
    $('#EmailProvider_UserId').parent().parent().removeClass('state-error');
}

function setSelectedEmailIntegrationModeValue(val) {
    if (val == '0') {
        SelectedEmailIntegrationMode = "None";
    }
    else if (val == '1') {
        SelectedEmailIntegrationMode = "SMTP";
    }
    else if (val == '2') {
        SelectedEmailIntegrationMode = "Amazon";
    }
}

function setNoneModeVisibility(val) {    
    if (val == "true" || val == "True")
        $("#divEmailIntegrationModeNone").show();
    else
        $("#divEmailIntegrationModeNone").hide();
}


$('a[data-toggle="collapse"]').on('click', function () {
    $('a[data-toggle="collapse"]').each(function () {
        var objectID = $(this).attr('href');
        if ($(objectID).hasClass('in') === true) {
            $(objectID).collapse('hide');
        }
    });
});

$('#lblAuthenticationRequired').focus(function () {
    $('#chkAuthenticationRequired').removeClass('checkbox style-2');
    $('#chkAuthenticationRequired').addClass('checkbox style-5');
}).blur(function () {
    $('#chkAuthenticationRequired').removeClass('checkbox style-5');
    $('#chkAuthenticationRequired').addClass('checkbox style-2');
});

$('#lblAuthenticationRequired').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '32') { //space
        if($("#chkAuthenticationRequired").is(':checked'))
            $('#chkAuthenticationRequired').prop('checked', false);   // unchecked
        else
            $("#chkAuthenticationRequired").prop('checked', true);  // checked
    }
});
