var hideMsgInSecond = 10000;
$(function () {
    if (typeof (messageToShow) != 'undefined' && messageToShow !== 'null' && messageToShow != '') {
        DisplaySuccess(messageToShow); 
    }
});
function LogOn() {
    //var x = $("<div class='alert alert-info'><span class='close' data-dismiss='alert'>x</span><span class='label label-warning'> There is some warning </span></div>");
    //window.setTimeout(function () { x.show(); }, '50');
    if ($("#form0").valid() == false) {
        return false;
    }

    var username = $('#UserName').val();
    var password = $('#Password').val();
    var homeLogOnDto = { UserName: username, Password: password };

    busyDiv();

    $.ajax({
        type: "POST",
        url: '/Account/LogOn',
        data: homeLogOnDto,
        success: returnFromSmartLogin,
        error: function (data) {
            clearDiv();
            //alert(data.ErrorMessage);
            //DisplayError("Login data is incorrect!", 'form0');
        },
        dataType: 'json'
    });

    return false;
}

function returnFromSmartLogin(data) {
    if (!data.isValid) {
        DisplayError(data.errorList);
        clearDiv();
    }
    else {
        BrowserCache.ClearAllItems();
        clearDiv();
        window.location = data.url;
    }
}

function InitiateResetPassword() {
    if ($("#form0").valid() == false) {
        return false;
    }
    else {
        var username = $("#UserName").val();
        busyDiv();
       
        $.ajax({
            type: "POST",
            url: '/Account/ResetUserPassword',
            data: {userName:username},
            success: ForgotPasswordCallback,
            error: function (xhr, status, err) {
                clearDiv();
                //console.log('error sending forgot password request. ' + status + ' ' + err)
            },
            dataType: 'json'
        });
    }
}

function ForgotPasswordCallback(data) {
     clearDiv();
    if (data.result) {
        window.location.href = '/Home/LogOn?parameter=ResetPasswordMailSent';
    }
    else {
        DisplayError(data.errorMsg);
    }
}

function progressBar(container, toggle) {
    var mask = findElement(container, ".p-loading-mask"),
    leftRight, webkitCorrection, containerScrollLeft;
    container = $(container);
    if (toggle) {
        if (!mask.length) {
            //isRtl = support.isRtl(container);
            leftRight = "left";
            containerScrollLeft = container.scrollLeft();
            //webkitCorrection = browser.webkit ? (!isRtl ? 0 : container[0].scrollWidth - container.width() - 2 * containerScrollLeft) : 0;
            //+webkitCorrection
            mask = $("<div class='p-loading-mask'><span class='p-loading-text'>Loading...</span><div class='p-loading-image'/><div class='p-loading-color'/></div>")
                .width("100%").height("100%")
                .css("top", container.scrollTop())
                .css(leftRight, Math.abs(containerScrollLeft))
                .prependTo(container);
        }
    } else if (mask) {
        mask.remove();
    }
}
function findElement(container, element) {
    return $(container + ' ' + element);
}
function busyDiv(element) {
    if (element != undefined) {
        progressBar(element, true);
    }
    else {
        progressBar("#main", true);
    }
}
function clearDiv(element) {
    if (element != undefined) {
        progressBar(element, false);
    }
    else {
        progressBar("#main", false);
    }
}

function ChangePassword() {
    if ($("#form0").valid() == false) {
        return false;
    }
    //alert(userName);
    var currentPassword = $('#CurrentPassword').val();
    var newPassword = $('#NewPassword').val();
    var confirmNewPassword = $('#ConfirmNewPassword').val();
    var userOnDto = { CurrentPassword: currentPassword, NewPassword: newPassword, ConfirmNewPassword: confirmNewPassword };

    busyDiv();

    $.ajax({
        type: "POST",
        url: '/Account/ChangePassword',
        data: userOnDto,
        success: function (data) {
            if (data.isValid) {
                clearAllBrowserCache();
                window.location.href = '/Account/LogOn?parameter=PasswordChangedSuccessfully';
            }
            else {
                DisplayError(data.errorList);
            }
            clearDiv();
        },
        dataType: 'json'
    });

    return false;
}
function clearAllBrowserCache() {
    BrowserCache.ClearAllItems();
}