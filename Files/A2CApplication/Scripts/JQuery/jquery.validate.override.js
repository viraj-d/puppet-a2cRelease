
//MVC3ChangeSet7

var $jQval = $.validator,
adapters,
data_validation = "unobtrusiveValidation";
// Create a closure so that we can define intermediary
// method pointers that don't collide with other items
// in the global name space.
(function () {
    // Store a reference to the original remove method.
    var originalRemoveMethod = $jQval.unobtrusive.parse;

    // Define overriding method.
    $jQval.unobtrusive.parse = function (selector) {
        // Log the fact that we are calling our override.
        $(selector).find("input[data-val=true],textarea[data-val=true],select[data-val=true]").each(function () {
            $jQval.unobtrusive.parseElement(this, true);
        });

        $("form").each(function () {
            if (this.className != 'etsform') {
                var info = validationInfo(this);
                if (info) {
                    info.attachValidation();
                }
            }
        });
    }

    $jQval.unobtrusive.parseElement = function (element, skipAttach) {

        /// <summary>
        /// Parses a single HTML element for unobtrusive validation attributes.
        /// </summary>
        /// <param name="element" domElement="true">The HTML element to be parsed.</param>
        /// <param name="skipAttach" type="Boolean">[Optional] true to skip attaching the
        /// validation to the form. If parsing just this single element, you should specify true.
        /// If parsing several elements, you should specify false, and manually attach the validation
        /// to the form when you are finished. The default is false.</param>

        var $element = $(element),
                form = $element.parents("form")[0],
                valInfo, rules, messages;

        if (!form) {  // Cannot do client-side validation without a form
            return;
        }

        valInfo = validationInfo(form);
        valInfo.options.rules[element.name] = rules = {};
        valInfo.options.messages[element.name] = messages = {};

        $.each(this.adapters, function () {
            var prefix = "data-val-" + this.name,
                    message = $element.attr(prefix),
                    paramValues = {};

            if (message !== undefined) {  // Compare against undefined, because an empty message is legal (and falsy)
                prefix += "-";

                $.each(this.params, function () {
                    paramValues[this] = $element.attr(prefix + this);
                });

                this.adapt({
                    element: element,
                    form: form,
                    message: message,
                    params: paramValues,
                    rules: rules,
                    messages: messages
                });
            }
        });

        if (!skipAttach) {
            valInfo.attachValidation();
        }
    }

})();

function validationInfo(form) {

    var $form = $(form),
    result = $form.data(data_validation);

    if (!result) {
        result = {
            options: {  // options structure passed to jQuery Validate's validate() method
                //errorClass: "input-validation-error",
                errorElement: "span",
                errorPlacement: $.proxy(onError, form),
                //invalidHandler: $.proxy(onErrors, form),
                messages: {},
                rules: {},
                success: $.proxy(onSuccess, form)
            },
            attachValidation: function () {
                $form.validate(this.options);
            },
            validate: function () {  // a validation function that is called by unobtrusive Ajax
                $form.validate();
                return $form.valid();
            }
        };
        $form.data(data_validation, result);
    }

    return result;
}
function onError(error, inputElement) {
    // 'this' is the form element
    var container = $(this).find("[data-valmsg-for='" + inputElement[0].name + "']");
    if (container.length != 0) {
        var replace = $.parseJSON(container.attr("data-valmsg-replace")) !== false;

        container.removeClass("field-validation-valid").addClass("field-validation-error");
        error.data("unobtrusiveContainer", container);

        if (replace) {
            container.empty();
            error.removeClass("input-validation-error").appendTo(container);
        }
        else {
            error.hide();
        }
    }
}
function onSuccess(error) {  // 'this' is the form element

    //    var container = $(this).find("[data-valmsg-summary=true]"),
    //    list = container.find("ul");
    //    list.empty();

    //    var container = error.data("unobtrusiveContainer"),
    //            replace = $.parseJSON(container.attr("data-valmsg-replace"));

    //    if (container) {
    //        container.addClass("field-validation-valid").removeClass("field-validation-error");
    //        error.removeData("unobtrusiveContainer");

    //        if (replace) {
    //            container.empty();
    //        }
    //    }
}

function onErrors(form, validator) {

}

(function () {
    // Define overriding method.
    $.validator.prototype.init = function () {

        this.labelContainer = $(this.settings.errorLabelContainer);
        this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
        this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
        this.submitted = {};
        this.valueCache = {};
        this.pendingRequest = 0;
        this.pending = {};
        this.invalid = {};
        this.reset();

        var groups = (this.groups = {});
        $.each(this.settings.groups, function (key, value) {
            $.each(value.split(/\s/), function (index, name) {
                groups[name] = key;
            });
        });
        var rules = this.settings.rules;
        $.each(rules, function (key, value) {
            rules[key] = $.validator.normalizeRule(value);
        });

        function delegate(event) {
            var validator = $.data(this[0].form, "validator");
            validator.settings["on" + event.type] && validator.settings["on" + event.type].call(validator, this[0]);
        }

        if (this.settings.invalidHandler)
            $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
    }

    /*override validators to trim values - Start*/
    $.validator.methods.url = function (value, element) {
        return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test($.trim(value));
    }

    $.validator.methods.email = function (value, element) {
        return this.optional(element) || /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|\.|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test($.trim(value));
    }

    $.validator.methods.range = function (value, element, param) {
        value = $.trim(value);
        if (param[0] != NaN && param[1] != NaN)
            return this.optional(element) || ( parseFloat(value) >= parseFloat(param[0]) && value <= parseFloat(param[1]));            
        else
            return this.optional(element) || (value >= param[0] && value <= param[1]);
    }

    $.validator.methods.number = function (value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test($.trim(value));
    }

    $.validator.methods.digits = function (value, element) {
        return this.optional(element) || /^\d+$/.test($.trim(value));
    }   
})();

function SetFocusOnElement(targetElementId) {
    try {
        if (targetElementId != undefined && targetElementId != '') {
            if (targetElementId.indexOf("tinymce") == 0) {
                /* To Set focus on tinymce */
                var tinyMCEId = targetElementId.substring(8);
                tinyMCE.execCommand('mceFocus', false, tinyMCEId);
            }
            else if (!$("#" + targetElementId).attr("readOnly")) {
                $("#" + targetElementId).focus();
            }
        }
    }
    catch (e) { }
}




adapters = $jQval.unobtrusive.adapters;
adapters.addSingleVal("erriscustom", "jsfunction");
$jQval.addMethod("erriscustom", function (value, element, param) {

    if (!param || param.length <= 0) {
        return true;
    }
    else {
        try {
            var fn = window[param];
            if (typeof fn === 'function') {
                return fn(value, element);
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }
});

adapters = $jQval.unobtrusive.adapters;
adapters.addSingleVal("errisregex", "pattern");
$jQval.addMethod("errisregex", function (value, element, param) {
    if (!param || param.length <= 0) {
        return true;
    }
    else {
        try {
            if (value != undefined && value != '') {
                value = $.trim(value);
                var regularExpression = new RegExp(param);
                return regularExpression.test(value);
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }
});

adapters = $jQval.unobtrusive.adapters;
adapters.addSingleVal("maxlength", "max");
$jQval.addMethod("maxlength", function (value, element, param) {
    if(value)
    {
        return !(value.toString().length > param);
    }
            return true;
});

adapters.addSingleVal("minlength", "min");
$jQval.addMethod("minlength", function (value, element, param) {
    if (value) {
        return !(value.toString().length < param);
            }
            return true;
});

adapters.addSingleVal("regex", "pattern");
$jQval.addMethod("regex", function (value, element, param) {
    if (value) {
        return new RegExp(param).test(value);
    }
    return true;
});

function setValidationValues(options, ruleName, value) {
    options.rules[ruleName] = value;
    if (options.message) {
        options.messages[ruleName] = options.message;
    }
}

function AttachDynamicContentValidation(response, containerId, skipFormRemoval) {
    if (!skipFormRemoval) {
        var RegularExpression = new RegExp("<form\\s+(\"[^\"]*\"|'[^']*'|[^'\">])*>");
        if (response.match(RegularExpression)) {
            response = response.replace(RegularExpression, '');
            response = response.replace('</form>', '');
        }
    }
    $("#" + containerId).html(response);
    $jQval.unobtrusive.parse(document);
}


if ($.validator) {
    $.validator.setDefaults({
        highlight: function (element) {
            $(element).closest("section").removeClass("state-success").addClass("state-error");
        },
        unhighlight: function (element) {
            $(element).closest("section").removeClass("state-error").addClass('state-success');
        }
    });
}

function getInformationTemplate() {
    return '<div id="msg-info"></div>';
}

function getErrorMsgTemplate() {
    return '<div id="msg-error"></div>';
}

function getSuccessMsgTemplate() {
    return '<div id="msg-success"></div>';
}

function getWarnningTemplate() {
    return '<div id="msg-warn"></div>';
}

var MessageType = {
    Error: 1,
    Warnning: 2,
    Success: 0,
    Information: 3
}

function showErroMessages(errorData, msgType, formId, canAppend, requiredAutoHide) {
    if (requiredAutoHide == undefined)
        requiredAutoHide = true;

    if (formId == undefined)
        formId = "form0";

    if (canAppend == undefined)
        canAppend = false;

    var ctrl = $('#' + formId), ctrlId = "msg" + formId;

    var mainCtrl, msgTemplate = '', msgClassName = '',msgTypeId='';

    switch (msgType) {
        case MessageType.Error:
            msgClassName = ' alert-danger';
            msgTypeId = 'msg-error';
            msgTemplate = getErrorMsgTemplate();
            break;
        case MessageType.Success:
            msgClassName = ' alert-success';
            msgTypeId = 'msg-success';
            msgTemplate = getSuccessMsgTemplate();
            break;
        case MessageType.Warnning:
            msgClassName = " alert-warning";
            msgTypeId = 'msg-warn';
            msgTemplate = getWarnningTemplate();
            break;
        case MessageType.Information:
            msgClassName = ' alert-info';
            msgTypeId = 'msg-info';
            msgTemplate = getInformationTemplate();
            break;
    }

    if (ctrl.find('#' + ctrlId).length == 0) {
        ctrl.find('fieldset:first').prepend('<section id="' + ctrlId + '"></section>');
    }

    mainCtrl = ctrl.find('#' + ctrlId);

    if (canAppend == false)
        mainCtrl.empty();

    if (mainCtrl.find('#' + msgTypeId).length == 0)
        mainCtrl.append(msgTemplate);
    

    $.each(errorData, function (valIndex, value) {
        var element = $("#" + value.Id);
        $.each(value.ErrorMessages, function (errIndex, error) {          
            var x = $("<div class='alert " + msgClassName + " fade in'><span class='close' data-dismiss='alert'>x</span><a href='#' onclick=\"javascript:SetFocusOnElement('" + value.Id + "');return false;\">" + encodeHtml(error) + "</a></div>").appendTo(mainCtrl.find('#' + msgTypeId + ":last"));
            if (requiredAutoHide && msgType == MessageType.Success)
                window.setTimeout(function () { x.hide(); }, hideMsgInSecond);
        });
    });

    $.each(errorData, function (valIndex, value) {
    });
}

function DisplayError(errorData, formId, canAppend) {
    if (canAppend == undefined)
        canAppend = false;

    showErroMessages(errorData, MessageType.Error, formId, canAppend);
}

function HideError() {
    $("#msg-error").hide();
}

function DisplaySuccess(successMsg, formId, canAppend) {
    if (formId == undefined)
        formId = "form0";

    if (canAppend == undefined)
        canAppend = false;

    var ctrl = $('#' + formId), ctrlId = 'msg' + formId;

    if (ctrl.find('#' + ctrlId).length == 0) {
        ctrl.find('fieldset').first().prepend('<section id="' + ctrlId + '"></section>');
    }

    var msgCtrl = ctrl.find('#' + ctrlId);

    if (canAppend == false)
        msgCtrl.empty();

    if (msgCtrl.find('#msg-success').length == 0)
        msgCtrl.append(getSuccessMsgTemplate());
    var x = $('<div class=\"alert alert-success fade in\"><span class="close" data-dismiss="alert">x</span>' + successMsg + '</div>');
    msgCtrl.find('#msg-success').append(x);
    window.setTimeout(function () { x.hide(); }, hideMsgInSecond);
}

function DisplayInformation(infoData, formId, canAppend,requireAutoHide) {
    showErroMessages(infoData, MessageType.Information, formId, canAppend, requireAutoHide);
}

function DisplayWarnning(errorData, formId, canAppend) {
    showErroMessages(errorData, MessageType.Warnning, formId, canAppend);
}

function ClearValidationMessage(formId)
{
    if (formId == null || formId == undefined)
        formId = 'form0';
    $('#' + formId + ' section[id=msg' + formId + ']').remove();
}

function SetFocusOnElement(targetElementId) {
    try {
        if (targetElementId != undefined && targetElementId != '') {
            if (targetElementId.indexOf("tinymce") == 0) {
                /* To Set focus on tinymce */
                var tinyMCEId = targetElementId.substring(8);
                tinyMCE.execCommand('mceFocus', false, tinyMCEId);
            }
            else if (!$("#" + targetElementId).attr("readOnly")) {
                $("#" + targetElementId).focus();
            }
        }
    }
    catch (e) { }
}

/* This function binds tooltip to Input, Textarea, Select type of fields */
function BindTooltipForInputFields() {
    $('.smart-form').find('input[title],select[title],textarea[title]').each(function () {
        $(this).parent().append('<b class="tooltip tooltip-bottom-right">' + $(this).attr('title') + '</b>');
        $(this).attr('title', '');
    });
}

$(document).ready(function () {
    BindTooltipForInputFields();
})
var ampRegExp = /&/g,
        ltRegExp = /</g,
        quoteRegExp = /"/g,
        aposRegExp = /'/g,
        gtRegExp = />/g;

function encodeHtml(value) {
    return ("" + value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
}