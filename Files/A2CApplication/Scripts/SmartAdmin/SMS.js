/// <reference path="MasterPage.js" />
/// <reference path="http://ajax.microsoft.com/ajax/jQuery/jquery-1.4.1-vsdoc.js"/>
/// <reference path="jquery-2.1.1.min.js" />

var messageCollection;
var SMSDialog;
var mergeFieldsCount;
var addressCount = 0;
var smsGrid;
var selectLearnerContactsModal;

jQuery.fn.extend({
    insertAtCaret: function (myValue) {
        return this.each(function (i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});

/*This function will insert selected mail merge field into editor at cursor location.*/
function InsertMailMergeFields(fieldName) {
    $('#SMSTextArea').insertAtCaret(fieldName);
    SMSDialog.SetDirty();

    //var myField = $('#SMSTextArea');
    //var presentValue = (myField.val() == undefined || myField.val() == '') ? '' : myField.val();
    //var value = presentValue + fieldName;
    //myField.val(value);
}

/* Below was added against parature id: 5527-10236865. There was no learnerlist passed at code behind from widget of roll call absence. */
function sendShortMessageForRollCallAbsence(formId) {
    var temp = [];
    var learnerId = $("#hdnRollCallAbsence").val().split(",");
    for (var i = 0; i < learnerId.length; i++) {
        temp.push(learnerId[i]);
    }

    var from = $("#hdnFromAddress").val();
    var msgText = $("#SMSTextArea").val().replace(/(<([^>]+)>)/ig, "");
    var divCount = $("#divTonumbers > div").size();
    var toAddresses = "";

    for (var i = 0; i < divCount; i++) {
        if (toAddresses == "") {
            toAddresses = $('#divTonumbers').children('div')[i].id.replace("divToName", "");
        }
        else {
            toAddresses = toAddresses + "," + $('#divTonumbers').children('div')[i].id.replace("divToName", "");
        }
    }

    var mergedFields = msgText.match(/{+[^}+]*}/gm);
    mergeFieldsCount = 0;

    if (mergedFields != null) {
        mergeFieldsCount = mergedFields.length;
    }

    var sendMessageModel = ({
        "FromAddress": from,
        "ToAddress": toAddresses,
        "ShortMessageBody": msgText,
        "Recipients": shortMessageReceipientCollection,
        "MailMergeFieldsCount": mergeFieldsCount,
        "LearnerList": temp
    });

    $('#ShortMessageBody').unbind("focusout");
    postJSON(sendSMSUrl, sendMessageModel, function (restext) {
        if (restext.result != "") {
            var errors = [];
            errors.push({ ErrorMessages: { "[0]": smsSendFailFirst + " " + restext.result + ". " + smsSendFailSecond + " : " + restext.status.Data }, Id: "", Property: "" });
            DisplayError(errors, "smsForm");
            return false;
        }
        else {
            SMSDialog.ClearDirty();
            SMSDialog.ModalHide();
            DisplaySuccess(smsSentSuccessfully, formId);
            //showConfirmationMessage(smsSentSuccessfully, function () {
            //    SMSDialog.ModalHide();
            //});
        }
    });
};

/* Below was added against parature id: 5527-10236865. There was no learnerlist passed at code behind from widget of roll call absence. */
function SendMessageForRollCallAbsence(formId) {
    var msgText = $("#SMSTextArea").val().replace(/(<([^>]+)>)/ig, "");
    if (msgText.toString().length <= 0) {
        var errors = [];
        errors.push({ ErrorMessages: { "[0]": smsBodyRequired }, Id: "", Property: "" });
        DisplayError(errors, "smsForm");
        return false;
    }

    sendShortMessageForRollCallAbsence(formId);
};

/* Below was added against parature id: 5527-10236865. There was no learnerlist passed at code behind from widget of roll call absence. */
function ShowSMSPopupWithNoRestrictedForRollCallAbsence(shortMessageReceipientCollection, dataLearnerIds, formId) {
    postJSON(CheckSMSProviderURL, null, function (data) {
        if (data.result) {
            var isSMSReadOnly = false;
            postJSON(checkEmailReadOnlyRights, null, function (data) {
                if (data != null && data.status != null) {
                    isSMSReadOnly = data.status;
                }
            }, false);

            SMSDialog = new $.Progresso.ModalPopup({
                        Title: sendSMS,
                        DynamicContent: { Type: "POST", URL: sendSMSDialogUrl, Data: shortMessageReceipientCollection },
                        ShowPopUp: true,
                        OnLoadCallback: function () {
                            $("#hdnRollCallAbsence").val(dataLearnerIds.learnerIds.toString());
                            bindTooltip();
                        },
                        Buttons: [{ Id: "btn1", Class: "moon icon-Progresso_SMs", Click: function () { SendMessageForRollCallAbsence(formId); }, attributes: [["Group", "A"], ["title", "Send SMS"]] },
                                  { Id: "btnAddRecepients", Class: "fa fa-male", Click: function () { OpenShortMessageAddressBook(); }, attributes: [["Group", "B"], ["title", "Add Recipients"]] }],
                        IsRequireLargeModal: true,
                        IsDirtyAttached: true
            });
        }
        else {
            var configureProvider = providerNotConfigured.replace("{0}", navigationSMS).replace("{0}", navigationSMS);
            var errors = [];
            errors.push({
                ErrorMessages: {
                    "[0]": configureProvider
                },
                Id: "",
                Property: ""
            });
            DisplayError(errors, formId);
            return false;
        }
    }, false);
};

/*This function used to open the Send SMS dialog screen.*/
function openSendMessageDialog(shortMessageReceipientCollection, formId) {
    postJSON(RestrictedRoleUrl, shortMessageReceipientCollection, function (data) {
        if (data.status) {
            var msg = smsAllRestrictPersmission.replace("{0}", data.result);
            var errors = [];
            errors.push({
                ErrorMessages: {
                    "[0]": msg
                },
                Id: "",
                Property: ""
            });
            DisplayError(errors, formId);
            return false;
        }
        else {
            if (data.result.length > 2) {
                var msg = smsPermission.replace("{0}", data.result);
                ShowSMSPopup(msg, shortMessageReceipientCollection);
            }
            else {
                ShowSMSPopupWithNoRestricted(shortMessageReceipientCollection);
            }
        }
    }, false);
};

/* Below was added against parature id: 5527-10236865. There was no learnerlist passed at code behind from widget of roll call absence. */
function openSendMessageDialogForRollCallAbsence(shortMessageReceipientCollection, dataLearner, formId) {
    postJSON(RestrictedRoleUrl, shortMessageReceipientCollection, function (data) {
        if (data.status) {
            var msg = smsAllRestrictPersmission.replace("{0}", data.result);
            var errors = [];
            errors.push({
                ErrorMessages: {
                    "[0]": msg
                },
                Id: "",
                Property: ""
            });
            DisplayError(errors, formId);
            return false;
        }
        else {
            if (data.result.length > 2) {
                var msg = smsPermission.replace("{0}", data.result);
                ShowSMSPopup(msg, shortMessageReceipientCollection);
            }
            else {
                ShowSMSPopupWithNoRestrictedForRollCallAbsence(shortMessageReceipientCollection, dataLearner, formId);
            }
        }
    }, false);
};

/*This function will open alert message*/
function displayAlertMessage(alertMessage, formId) {
    var errors = [];
    errors.push({ ErrorMessages: { "[0]": alertMessage }, Id: "", Property: "" });
    DisplayError(errors, formId);
    return false;
}

/*This function will open confirmation message*/
function displayConfirmMessage(confirmDialog) {
    showConfirmationMessage(confirmDialog, function () { SMSDialog.ModalHide(); });
}

/*This function is used to remove contact from To address bar of send sms popup screen*/
function removeFormField(id) {
    if ($("#divTonumbers > div").size() > 1) {
        showConfirmationMessage(removeRecipientMessage, function () {
            SMSDialog.SetDirty();
            $(id).remove();
        });
    }
    else {
        var errors = [];
        errors.push({
            ErrorMessages: {
                "[0]": removeRecipientWarning
            },
            Id: "divTonumbers",
            Property: ""
        });
        DisplayError(errors, "smsForm");
        return false;
    }
}

/*This function will open a grid for Template Selection*/
function ViewShortMessageTemplate() {
    $("#smsTemplates").show();
    smsGrid = $("#smsTemplates").progressoGrid({
        gridKey: 'sms_Templates',
        url: '/Communications/ShortMessageTemplate/GetTemplateListNew',
        data: '',
        pageable: false,
        selectable: 'single',
        onSelectCallBack: updateTemplateSelection,
        columns: [
                { field: "TemplateName", title: "Template Name", tooltip: "Template Name", type: "string", width: '25%' },
                { field: "ShortMessageBody", title: "Message", tooltip: "Message", type: "string", width: '75%' }
        ]
    });

    smsGrid.Render();
}

/*This function will update the selected template in text area*/
function updateTemplateSelection() {
    var selectedTemplate = "";
    var rows = smsGrid.Selected();
    SMSDialog.SetDirty();

    if (rows.length === 1) {
        selectedTemplate = rows[0].ShortMessageBody;
    }
    $('#SMSTextArea').val(selectedTemplate);
}

/*Open address book to assign additional contacts of the selected learners*/
function OpenShortMessageAddressBook() {
    var temp = [];
    var learnerId = $("#hdnRollCallAbsence").val().split(",");
    var learnerSMSContactUrl = "/Communications/Communications/LearnerContactsForSMS";
    for (var i = 0; i < learnerId.length; i++) {
        temp.push(learnerId[i]);
    }

    var sendMessageModel = ({
        "personIds": temp
    });

    selectLearnerContactsModal = new $.Progresso.ModalPopup({
        Title: "Add Recipients",
        DynamicContent: { Type: "POST", URL: learnerSMSContactUrl, Data: temp },
        ShowPopUp: true,
        Buttons: [{ Id: "btnAddContacts", Text: "To", Click: function () { AddAdditionalContactsToAddressbar(gridSMSContacts); }, attributes: [["Group", "A"], ["title", "To"], ["style", "display:none"]] }],
        IsDirtyAttached: true,
        IsRequireLargeModal: true,
        OnLoadCallback: function () {
            $('#btnAddContacts').hide();
            gridSMSContacts = $("#LearnerContactSMSGrid").progressoGrid({
                gridKey: 'Contacts_SMSPopup',
                url: openModalPopupForAddLearnerContactsForSMSUrl,
                data: { "personIds": temp },
                autoResize: true,
                maxRowCount: 10,
                columns: [
                        { field: "ContactFirstName", title: "Forename", tooltip: "Forename", type: "string", width: '17%' },
                        { field: "ContactLastName", title: "Surname", tooltip: "Surname", type: "string", width: '18%' },
                        { field: "PhoneNumber", title: "Mobile Number", tooltip: "Mobile Number", type: "string", width: '15%' },
                        { field: "PersonName", title: "Learner Name", tooltip: "Learner Name", type: "string", width: '25%' },
                        { field: "Relationship", title: "Relation ", tooltip: "Relation ", type: "string", width: '20%' }
                ],
                onSelectCallBack: function () {
                    $('#btnAddContacts').hide();
                    var selected = gridSMSContacts.SelectedRowLength();
                    if (selected > 0) {
                        $('#btnAddContacts').show();
                    }
                }
            });
            gridSMSContacts.Render();
        }
    });
}

/*Displays updated address bar. */
function refreshAddressBar(selectedTemplates) {
    var roleCategory = "Contact";
    selectedTemplates.push(roleCategory);
    var lastCount = $(".divCount").length;
    selectedTemplates.push(lastCount);

    if (selectedTemplates != null && selectedTemplates.length > 0) {
        var _personIdList = selectedTemplates.toString();
        $.ajax({
            type: "POST",
            data: { toPersonIdList: _personIdList },
            url: "/Communications/ShortMessageTemplate/RefreshAddressList/",
            success: function (data) {
                clearPageDiv();
                selectLearnerContactsModal.ModalHide();
                var div = document.createElement('div');
                $("#divTonumbers").append(data.substring(data.indexOf('<script') , data.lastIndexOf('</div>')));
                bindTooltip();
            },
            dataType: "html",
            traditional: true
        });
    }
};

function AddAdditionalContactsToAddressbar(gridSMSContacts) {
    var selectedTemplates = new Array();
    var rows = gridSMSContacts.Selected();

    if (rows.length <= 0) {
        var errors = [];
        errors.push({ ErrorMessages: { "[0]": noRecordSelected }, Id: "LearnerContactSMSGrid", Property: "" });
        DisplayError(errors, "LearnerContactSMSForm");
        return false;
    }

    for (var i = 0; i < rows.length; i++) {
        selectedTemplates.push(rows[i].PersonId);
    }
    busyPageDiv();
    ///check the roles of the selected addresses
    postJSON(RestrictedRoleUrlInAddressList, { PersonIds: selectedTemplates }, function (data) {
        if (data.status) {
            var msg = smsAllRestrictPersmission.replace("{0}", data.result);
            var errors = [];
            errors.push({ ErrorMessages: { "[0]": msg }, Id: "", Property: "" });
            DisplayError(errors, "LearnerContactSMSForm");
            return false;
        }
        else {
            if (data.result.length > 2) {
                selectedTemplates = data.allowedPersonIds;
                var msg = smsPermission.replace("{0}", data.result);
                showConfirmationMessage(msg, function () { refreshAddressBar(selectedTemplates); });
            }
            else {
                refreshAddressBar(selectedTemplates);
            }
        }
    }, false);
}
