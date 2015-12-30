var curTabId = 0;
var $section = { "topwiz": 1, "bottomleftwiz": 2, "bottomrigthwiz": 3 };
var jarvisWIZ;
var globalWidgetJSON = {
    "TabId": 0,
    "TabName": "",
    "Count": $("#destinationWidgets ul li").length,
    "Widgets": []
};

$(function () {
    /*$("#ribbon").hide();*/
    if (widgetInfo && widgetInfo.Data && widgetInfo.Data.length > 0) {
        $("#content")
            .show()
            .addClass('padding-top-55 padding-bottom-14');
        /*SetUpTabs();*/
        SetUpTabWidgets();
        /*FetchOSRWidgets();*/
    }
    else
    {
        $("#content").hide();
    }
});

function SetUpTabWidgets() {
    $("#ajaxLoadingIcon").show();
    var obj = { currentTabId: curTabId };
    $("#mainTab li.active").removeClass('active');
    $('#mainTab li a[id="' + curTabId + '"]').parent().addClass('active');
    BrowserCache.Edit(BrowserCache.Key.LastVisitedDashboardTab, curTabId);

    var d1 = widgetInfo;

    var wizCol1 = $.grep(d1.Data, function (n, i) { return n.WCOL == 1 });
    var wizCol2 = $.grep(d1.Data, function (n, i) { return n.WCOL == 2 });
    var wizCol3 = $.grep(d1.Data, function (n, i) { return n.WCOL == 3 });

    var transform = {
        "tag": "div", "class": "jarviswidget", "id": "${WID}", "data-widget-colorbutton": "false", "data-widget-load": "/${WC}/${WA}/${WID}", "data-widget-setting-callback": "${SaveSettingsCallBack}", "data-widget-editbutton": "${WSS}"
        , "children": [
                        {
                            "tag": "header", "children": [
                                {
                                    "tag": "span", "class": "widget-icon", "children": [
                                        { "tag": "i", "class": "${WI}", "html": "" }
                                    ]
                                },
                                { "tag": "h2", "html": function () { return htmlEncode(this.WN) } }
                            ]
                        },
                        {
                            "tag": "div", "children": [
                                { "tag": "div", "class": "jarviswidget-editbox padding-none border-bottom-1", "style": "border-bottom: 1px solid #CCC !important;", "html": "", "id": "wizFilter-${WID}" },
                            { "tag": "div", "class": "widget-body no-padding", "html": "", "id": "wizContent-${WID}" }
                            ]
                        }
        ]
    }

    $("#topwiz").empty().json2html(wizCol1, transform);
    $("#bottomleftwiz").empty().json2html(wizCol2, transform);
    $("#bottomrigthwiz").empty().json2html(wizCol3, transform);

    $(".jarviswidget").off();/*Need to done as Jarvis doesn't support Reload Dashbaord feature*/
    $("#widget-grid").removeData("jarvisWidgets");/*Need to done as Jarvis doesn't support Reload Dashbaord feature*/

    InitiateJarvisWidget();
    $("#ajaxLoadingIcon").hide();
}

function InitiateJarvisWidget() {

    jarvisWIZ = $('#widget-grid').jarvisWidgets({
        grid: 'article',
        widgets: '.jarviswidget',
        localStorage: true,
        deleteSettingsKey: '#deletesettingskey-options',
        settingsKeyLabel: 'Reset settings?',
        deletePositionKey: '#deletepositionkey-options',
        positionKeyLabel: 'Reset position?',
        sortable: false,
        buttonsHidden: false,
        // toggle button
        toggleButton: false,
        toggleClass: 'fa fa-minus | fa fa-plus',
        toggleSpeed: 200,
        onToggle: function () {
        },
        // delete btn
        deleteButton: false,
        deleteClass: 'fa fa-times',
        deleteSpeed: 200,
        onDelete: function () {
        },
        // edit btn
        editButton: true,
        editPlaceholder: '.jarviswidget-editbox',
        editClass: 'fa fa-cog | fa fa-times',
        editSpeed: 200,
        onEdit: function (elm, e) {
            if ($(this).children(".fa-times").length > 0) {
                //Add save button
                var functionToCall = elm.attr('data-widget-setting-callback');
                if (functionToCall.length > 0) {
                    var wizID = elm.attr('id');
                    var btnSave = $("<a id='btnSaveSettings" + wizID + "' class='button-icon' data-placement='bottom' title='Save' rel='tooltip' href='javascript: void(0)'><i class='fa fa-floppy-o'></i></a>");
                    if (elm.find('#btnSaveSettings' + wizID).length == 0)
                        elm.find(".jarviswidget-ctrls").prepend(btnSave);

                    var settingElement = elm.find("div.jarviswidget-editbox");
                    var refreshWidget = elm.find(".jarviswidget-refresh-btn");

                    var jarvisToPass = this;
                    elm.find(".jarviswidget-ctrls #btnSaveSettings" + wizID).unbind('click');
                    elm.find(".jarviswidget-ctrls #btnSaveSettings" + wizID).bind("click", function (e) {
                        window[functionToCall](function () {
                            var widgetTitle = $(settingElement).find('#widgetTitle').val();
                            elm.children('header').children('h2').text(widgetTitle);
                            jarvisToPass.click();
                            refreshWidget.click();
                        }, elm);
                    });
                }
                $(this).attr("data-original-title", "Close");
                bindTooltip();
            } else {
                //remove save button
                var wizID = elm.attr('id');
                elm.find(".jarviswidget-ctrls #btnSaveSettings" + wizID).remove();
                $(this).attr("data-original-title", "Settings");
                bindTooltip();
            }
            if (elm.find("div.jarviswidget-editbox").has('div').length > 0)
                return true;
            else {
                var wizID = elm.attr('id');
                var controller = elm.attr('data-widget-load').split('/')[1];
                var url = "/" + controller + "/Settings/" + wizID;
                var jarvisToPass = this;
                $.get(url, function (view) {
                    var settingElement = elm.find("div.jarviswidget-editbox");
                    settingElement.empty().html(view).css('border-bottom', '1px solid #CCC !important');/*Since Jarvis overwrite existin css, need to apply css here*/

                    /*To Valide Settings forms*/
                    $("form").removeData("validator").removeData("unobtrusiveValidation");
                    $.validator.unobtrusive.parse("form");                    
                });
            }
        },
        // color button
        colorButton: false,
        // full screen
        fullscreenButton: true,
        fullscreenClass: 'fa fa-resize-full | fa fa-resize-small',
        fullscreenDiff: 3,
        onFullscreen: function (a) {
            /*nav_page_height();*/
            $('div.tooltip').hide();
            if (a.parent().attr("id") == 'jarviswidget-fullscreen-mode') {
                a.find(".jarviswidget-fullscreen-btn").attr('data-original-title', 'Restore');
            }
            else {
                a.find(".jarviswidget-fullscreen-btn").attr('data-original-title', 'Full Screen');
            }
            if (a.find('.k-grid').length > 0) {
                ResizeGridInWidget(a);/*Done to resize grid inside widget*/
            }
            if (a.find('.fc').length > 0) {                
                a.find('.jarviswidget-refresh-btn').click();
            }
        },
        // custom btn
        customButton: false,
        customClass: 'folder-10 | next-10',
        // order
        buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
        opacity: 1.0,
        dragHandle: '> header',
        placeholderClass: 'jarviswidget-placeholder',
        indicator: true,
        indicatorTime: 600,
        ajax: true,
        timestampPlaceholder: '.jarviswidget-timestamp',
        timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
        refreshButton: true,
        refreshButtonClass: 'fa fa-refresh',
        labelError: sessionTimeOutMessage,
        labelUpdated: 'Last Update:',
        labelRefresh: 'Refresh',
        labelDelete: 'Delete widget:',
        afterLoad: function (a) {            
            a.find(".jarviswidget-edit-btn").attr('data-original-title', 'Settings');
            if (a.find('.k-grid').length > 0) {
                ResizeGridInWidget(a);/*Done to resize grid inside widget*/
            }
            $("form").removeData("validator").removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse("form");
        },
        rtl: false, // best not to toggle this!
        onChange: function (a, b) {            
        },
        onSave: function (a, b) {
            /*JARVIS return a as null when only widget position is changed*/            
        },
        ajaxnav: true, // declears how the localstorage should be saved
        onError: function (request) {
            displayAjaxError(request);
        }
    });
}

function ResizeGridInWidget(elm) {
    var currentwizbodyHeight = 0;
    var widgetBody = elm.find('div.widget-body');
    var dataArea = widgetBody.find('div.k-grid-content');
    if (elm.parent().attr("id") == 'jarviswidget-fullscreen-mode') {
        currentwizbodyHeight = $("#jarviswidget-fullscreen-mode").height() - $("#jarviswidget-fullscreen-mode header").height() - 5;
        widgetBody.height(currentwizbodyHeight);
        var otherElements = widgetBody.find('form div.row');
        var otherElementsHeight = 0;
        otherElements.each(function () {
            if ($(this).find('.k-grid').length == 0) {
                otherElementsHeight += $(this).outerHeight(true);
            }
        });
        var gridParent = widgetBody.find('.k-grid');
        var originalHeight = gridParent.height();
        gridParent.height(currentwizbodyHeight - otherElementsHeight - 20);
        var a2cGrid = gridParent.data("kendoGrid").options.A2CGrid;
        a2cGrid.SetMaximizedMode(true);
        a2cGrid.Resize();
    }
    else {
        widgetBody.css("height", "auto");
        currentwizbodyHeight = 620;
        var gridParent = widgetBody.find('.k-grid');
        var a2cGrid = gridParent.data("kendoGrid").options.A2CGrid;
        a2cGrid.SetMaximizedMode(false);
        a2cGrid.Resize();
    }
}

function OpenWidgetCategories(a) {
    var catid = (a == null || a == 'undefined' || a.length == 0) ? "0" : a;
    var url = '/Home/WidgetGalleryById?categoryId=' + catid;
    var transform = { "tag": "li", "rel": "${WidgetIdentifier}", "class": "ui-state-default", "title": function () { return htmlEncode(this.Name + " - " + this.Description) }, "Id": "${Id}", "children": [{ "tag": "span", "class": "dblock text-center-align", "html": function () { return htmlEncode(this.Name) } }, { "tag": "i", "class": "note", "html": function () { return htmlEncode(this.Description) } }, { "tag": "span", "class": "s" }, { "tag": "i", "class": "note", "html": "${CategoryName}", "style": "float:right;bottom: 0px;position: absolute;right: 0px;" }] };
    $.get(url, function (json) {
        var categoryName = $("#widgetCategories li.active").find('span').text();
        var osrWidgetsToAdd = $.grep(osrWidgetsByRole, function (val, i) { return val.AreaName.toLowerCase() == categoryName.toLowerCase(); });
        $.each(osrWidgetsToAdd, function (i, v) {
            json.push(v)
        });
        $('#sourceWidgets ul#wizbycategory').empty().json2html(json, transform);
        $("#sourceWidgets ul#wizbycategory li").draggable({
            appendTo: "body",
            helper: function (event) {
                return $('<span class="ui-widget-header"/>')
                        .text($(this).find('span').first().text());
            },
            cursorAt: { top: -5, left: -10 }
        });
    });

    $("#destinationWidgets ul").droppable({
        /*hoverClass: "ui-state-highlighter",*/
        drop: function (event, ui) {
            if ($(ui.draggable).parents('section').attr('id') != 'destinationWidgets') {
                if ($("#destinationWidgets ul li").length < 6) {
                    id = ui.draggable.attr('id');
                    var relValue = ui.draggable.attr('rel');
                    $("<li class='ui-state-highlight' rel='" + relValue + "' wizId='0' wizBaseId='" + id + "'></li>").text(ui.draggable.find('span').text()).append('<a class="close" onclick="CloseWizTemplate(this); return false;">x</a>').appendTo(this);
                }
                else {
                    $(this).effect("highlight", { color: "#ff0000" }, 2000);
                }
                SetWigetCounter();
            }
            if (this.id === 'destinationSection1' || this.id === 'destinationSection2' || this.id === 'destinationSection3') {
                page.SetDirty();
            }
        }
    });

    $("#destinationWidgets ul").sortable({ items: ".ui-state-highlight", connectWith: ".connectedSortable", placeholder: "ui-state-placeholder" });

    $("#destinationWidgets ul").bind('sortstart', function (event, ui) {
        ui.item.addClass('ui-state-placeholder-elm').find('.close').addClass('display-none');
        $('.ui-state-placeholder').empty().append('<span>Drop here</span>').css({ 'text-align': 'center' });

    });
    $("#destinationWidgets ul").bind('sortstop', function (event, ui) {
        ui.item.addClass('ui-state-highlight').removeClass('ui-state-placeholder-elm').find('.close').removeClass('display-none');

    });
}

function CloseWizTemplate(eleli) {
    $(eleli).parents('li:first').remove();
    page.SetDirty();
    SetWigetCounter();
    return false;
}

function CustomizeTab(customizeType) {
    busyPageDiv();
    var url = '/Home/ManageTabLayout';
    var tabId = null;

    if (customizeType == 2)/*Edit Tab*/ {
        var currentTab = $("#mainTab li.active");

        if (userTabs.Data.length < 1) {
            clearPageDiv();
            $.smallBox({
                content: "<i class='fa fa-ban'></i> <i> There are no tabs exists on dashboard. </i>",
                color: "#C46A69",//"#DB4D4D",
                iconSmall: "fa fa-warning shake animated",
                timeout: 1000,
                sound: false
            });
            return false;
        }
        else if (currentTab.find('a').attr("rel") == "True") {
            $.smallBox({
                content: "<i class='fa fa-ban'></i> <i>Cannot edit your default tab</i>",
                color: "#C46A69",//"#DB4D4D",
                iconSmall: "fa fa-warning shake animated",
                timeout: 3000,
                sound: false
            });
            clearPageDiv();
            return false;
        }
        else if (currentTab.find('a').attr("userTab") == 'False') {
            $.smallBox({
                content: "<i class='fa fa-ban'></i> <i>Cannot edit system defined tab</i>",
                color: "#C46A69",//"#DB4D4D",
                iconSmall: "fa fa-warning shake animated",
                timeout: 3000,
                sound: false
            });
            clearPageDiv();
            return false;
        }
        tabId = curTabId;
    }

    $.ajax({
        async: false,
        type: "POST",
        data: { tabId: tabId },
        url: url,
        success: function (data) {
            $("#tabLayoutContainer").html(data);
            $("form").removeData("validator");
            $("form").removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse("#form0");

            if (typeof (contactLoggedIn) != "undefined" && contactLoggedIn == true) {
                $("#childrenTabs").addClass('display-none');
            }
            $("#mainTab").addClass('display-none');
            $("#tabContent").addClass('display-none');

            if (tabId > 0)
                $("#tabLayoutContainer").find("#tabName").val($("#mainTab li[class='active']").text());

            var d1 = $.parseJSON(wizPerTab);

            var wizSec1 = $.grep(d1.Data, function (n, i) { return n.WCOL == 1 });
            var wizSec2 = $.grep(d1.Data, function (n, i) { return n.WCOL == 2 });
            var wizSec3 = $.grep(d1.Data, function (n, i) { return n.WCOL == 3 });

            var transform = { "tag": "li", "class": "ui-state-highlight", "html": function () { return htmlEncode(this.WN) }, "title": "${WN}", "wizBaseId": "${WBID}", "wizId": "${WID}", "children": [{ "tag": "a", "class": "close", "onclick": function () { CloseWizTemplate(this); return false }, "html": "x" }] };

            $("#destinationSection1").empty().json2html(wizSec1, transform);
            $("#destinationSection2").empty().json2html(wizSec2, transform);
            $("#destinationSection3").empty().json2html(wizSec3, transform);


            if ($("#tabLayoutContainer").is(":hidden")) {
                $("#tabLayoutContainer").removeClass('display-none');
                $("#tabLayoutContainer").slideDown('slow');
                
                var categories = $.parseJSON(wizCategories);

                var wizCategoryTransform = {
                    "tag": "li", "rel": "${Value}", "children": [
                        {
                            "tag": "a", "href": "#", "onclick": function () { var a = $(this).parent('li').attr('rel'); OpenWidgetCategories(a); }, "data-toggle": "tab", "children": [                                
                                { "tag": "span", "class": "padding-5 .ignoredirty", "html": "${Text}" }
                            ]
                        }
                    ]
                };

                $("#widgetCategories").empty().json2html(categories, wizCategoryTransform);
                $("#widgetCategories li:first").addClass('active');
                /*first time when screen loads*/
                var cat = $("#widgetCategories li:first").attr('rel');
                OpenWidgetCategories(cat);
                $("#tabName").focus();                
                SetWigetCounter();
            }
            else {
                $("#tabLayoutContainer").slideUp();
                if (typeof (contactLoggedIn) != "undefined" && contactLoggedIn == true) {
                    $("#childrenTabs").removeClass('display-none');
                }
                $("#mainTab").removeClass('display-none');
                $("#tabContent").removeClass('display-none');                
            }

            generateDropDown();
            bindTooltip();
            page.AttachDirty();
        }
    });
    if (customizeType == 1) {
        $(".scrTitle").html(addTab);
    }
    else if (customizeType == 2) {
        $(".scrTitle").html(editTab);
    }

    clearPageDiv();
    return false;
}

function DeleteTab() {
    var tabToDelete = $("#mainTab li.active");
    var isDefault = tabToDelete.find('a').attr('rel');
    var isUserDefined = tabToDelete.find('a').attr("userTab");
    if (userTabs.Data.length < 1) {
        $.smallBox({
            content: "<i class='fa fa-ban'></i> <i> There are no tabs exists on dashboard. </i>",
            color: "#C46A69",//"#DB4D4D",
            iconSmall: "fa fa-warning shake animated",
            timeout: 1000,
            sound: false
        });
    }
    else if (isDefault == 'True') {
        $.smallBox({
            content: "<i class='fa fa-ban'></i> <i>" + defaultTabDeleteError + "</i>",
            color: "#C46A69",//"#DB4D4D",
            iconSmall: "fa fa-warning shake animated",
            timeout: 3000,
            sound: false
        });
        return false;
    }
    else if (isUserDefined == 'False') {
        $.smallBox({
            content: "<i class='fa fa-ban'></i> <i>Cannot delete system defined tab</i>",
            color: "#C46A69",//"#DB4D4D",
            iconSmall: "fa fa-warning shake animated",
            timeout: 3000,
            sound: false
        });
        return false;
    }
    else {
        /*Delete tab*/
        showConfirmationMessage(confirmTabDeletion, function () {
            var tabId = curTabId;
            var tabName = $(tabToDelete).children("a:first").text();
            $("#ajaxLoadingIcon").show();
            $.ajax({
                async: false,
                type: "POST",
                data: { tabId: tabId, tabName: tabName },
                url: '/Home/DeleteUserTab',
                success: function (data) {
                    if ($(tabToDelete).next().length > 0) {
                        $(tabToDelete).next().addClass('active');
                        var nxtTabId = $(tabToDelete).next().find('a').attr("id");
                        curTabId = nxtTabId;
                        SetUpTabWidgets();
                        tabToDelete.remove();
                    }
                    else {
                        tabToDelete.remove();
                        if ($("#mainTab > li").length > 1) {
                            $("#mainTab li:last").addClass('active');
                            var lastTabId = $("#mainTab li:last").find('a').attr("id");
                            curTabId = lastTabId;
                            SetUpTabWidgets();
                        }
                        else {                            
                            $("#tabContent article").empty();
                        }
                    }

                    userTabs.Data = $.map(userTabs.Data, function (n, i) { if (n.tid != tabId) return n; });

                    $("#ajaxLoadingIcon").hide();
                    $.smallBox({
                        content: "<i class='fa fa-thumbs-up'></i> <i>Tab deleted successfully.</i>",
                        color: "#8ac38b",
                        iconSmall: "fa fa-check shake animated",
                        timeout: 2000,
                        sound: false
                    });

                },
                error: function (xhr, status, err) {
                    $.smallBox({
                        content: "<i class='fa fa-ban'></i> <i>" + status + "</i>",
                        color: "#C46A69",//"#DB4D4D",
                        iconSmall: "fa fa-warning shake animated",
                        timeout: 1000,
                        sound: false
                    });
                }
            });
        });
    }
}

function SaveTabs() {

    if ($("#form0").valid() == false) {
        return false;
    }
    $("#ajaxLoadingIcon").show();
    globalWidgetJSON.TabId = $("#hdnCurTabID").val();
    globalWidgetJSON.TabName = $("#tabName").val();

    if (globalWidgetJSON.TabId == '0') {
        var sameTabNameExists = $.grep(userTabs.Data, function (m, i) { return m.tnm.toLowerCase() == globalWidgetJSON.TabName.toLowerCase(); });
        if (sameTabNameExists.length > 0) {
            $("#ajaxLoadingIcon").hide();
            var errorMsg = [];
            errorMsg.push({
                ErrorMessages: { "[0]": duplicateTabNameMessage },
                Id: "CurrentTabName",
                Property: "Entity.String"
            });
            DisplayError(errorMsg);
            return false;
        }
    }

    $("#destinationSection1 li").each(function (index, element) {
        globalWidgetJSON.Widgets.push({ "wizId": $(this).attr("wizId"), "wizBaseId": $(this).attr("wizBaseId"), "sec": 1, "pos": ++index, "refId": $(this).attr("rel") });
    });

    $("#destinationSection2 li").each(function (index, element) {
        globalWidgetJSON.Widgets.push({ "wizId": $(this).attr("wizId"), "wizBaseId": $(this).attr("wizBaseId"), "sec": 2, "pos": ++index, "refId": $(this).attr("rel") });
    });

    $("#destinationSection3 li").each(function (index, element) {
        globalWidgetJSON.Widgets.push({ "wizId": $(this).attr("wizId"), "wizBaseId": $(this).attr("wizBaseId"), "sec": 3, "pos": ++index, "refId": $(this).attr("rel") });
    });

    globalWidgetJSON.Count = $("#destinationWidgets ul li").length;

    var url = '/Home/UpdateUserTab';

    postJSON(url, { globalWidgetJSON: globalWidgetJSON }, function (data) {
        $("#ajaxLoadingIcon").hide();
        if (data.status) {
            page.ClearDirty();
            if ($("#hdnCurTabID").val() == "0") {
                try {
                    var isActiveTab = userTabs.Data.length <= 0 ? "active" : "";
                    var newTab = '<li class="' + isActiveTab + '"><a href="#" data-toggle="tab" rel="False" id="' + data.newTabId + '">' + $("#tabName").val() + '</a></li>';
                    var newTabJson = { tnm: $("#tabName").val(), tid: data.newTabId, act: isActiveTab, dflt: "False", isusrtab: "True" };
                    userTabs.Data.push(newTabJson);
                    $(newTab).appendTo("#mainTab");
                    $("#mainTab").find("a[id='" + data.newTabId + "']").click(function () {
                        curTabId = $(this).attr("id");
                        return SetUpTabWidgets();
                    });
                    if (userTabs.Data.length == 1) {
                        curTabId = data.newTabId;
                        SetUpTabWidgets();
                    }
                } catch (e) {
                    alert(e);
                }
            }
            else {
                curTabId = $("#hdnCurTabID").val();
                var updatedTabName = $("#tabName").val();
                $("#mainTab").find("a[id='" + data.newTabId + "']").text(updatedTabName);
                $.each(userTabs.Data, function () {
                    if (this.tid.toString() === curTabId) {
                        this.tnm = updatedTabName;
                    }
                });
                SetUpTabWidgets();
            }
            $("#tabLayoutContainer").slideUp();
            closeWidgetGallery();
        }
        else {
            var errorMsg = [];
            errorMsg.push({
                ErrorMessages: { "[0]": errorOnTabSave },
                Id: "CurrentTabName",
                Property: "Entity.String"
            });
            DisplayError(errorMsg);
        }
    });
    globalWidgetJSON = {
        "TabId": 0,
        "TabName": "",
        "Count": 0,
        "Widgets": []
    };    
}

function SetWigetCounter() {
    var wizRemaining = eval(6 - $("#destinationWidgets ul li").length);
    $("#widgetCounter").text(wizRemaining);
    if (wizRemaining <= 0) {
        $("#widgetCounter").removeClass('bg-color-green').addClass('bg-color-red');
    }
    else {
        $("#widgetCounter").removeClass('bg-color-red').addClass('bg-color-green');
    }

}

function OpenTabSorting() {
    if ($("#tabLayoutContainer").is(':hidden')) {        
        $.get('/Home/ReOrderTabs', null, function (data) {
            if (typeof (contactLoggedIn) != "undefined" && contactLoggedIn == true) {
                $("#childrenTabs").addClass('display-none');
            }
            $("#mainTab").addClass('display-none');
            $("#tabContent").addClass('display-none');
            $("#tabLayoutContainer").empty().html(data);
            InitiateTabSorting();
            page.AttachDirty();
        });
    }
    else {
        $("#tabLayoutContainer").slideUp();
        closeWidgetGallery();
    }

}

function InitiateTabSorting() {

    if (userTabs.Data.length > 0) {
        var userDefinedTabs = $.grep(userTabs.Data, function (n, i) {
            return n.isusrtab == 'True';
        });

        var transform = { "tag": "li", "class": "ui-state-highlight", "rel": "${dflt}", "userTab": "${isusrtab}", "id": "${tid}", "html": function () { return htmlEncode(this.tnm) } };

        $("#tabLayoutContainer ul#userDefinedTabList").json2html(userDefinedTabs, transform);
        $("#tabLayoutContainer").removeClass('display-none');
        $("#tabLayoutContainer").slideDown();
        $("#userDefinedTabList").sortable({
            placeholder: 'ui-state-placeholder',
            containment: "parent"
        });
        $("#userDefinedTabList").bind('sortstart', function (event, ui) {
            ui.item.addClass('ui-state-placeholder-elm').find('.close').addClass('display-none');
            $('.ui-state-placeholder').empty().append('<span>Drop here</span>').css({ 'text-align': 'center' });
        });
        $("#userDefinedTabList").bind('sortstop', function (event, ui) {
            ui.item.addClass('ui-state-highlight').removeClass('ui-state-placeholder-elm').find('.close').removeClass('display-none');
            page.SetDirty();
        });        
    }
    else {
        if (typeof (contactLoggedIn) != "undefined" && contactLoggedIn == true) {
            $("#childrenTabs").removeClass('display-none');
        }
        $("#mainTab").removeClass('display-none');
        $("#tabContent").removeClass('display-none');
        $.smallBox({
            content: "<i class='fa fa-ban'></i> <i> There are no tabs exists on dashboard. </i>",
            color: "#C46A69",//"#DB4D4D",
            iconSmall: "fa fa-warning shake animated",
            timeout: 1000,
            sound: false
        });
    }
    $("#tabLayoutContainer").find(".scrTitle").html(reorderTab);
}

function SaveTabOrder() {
    var x = $("#userDefinedTabList li").toArray();

    var x = $.map(x, function (a, i) { return { TabId: $(a).attr('id'), TabPos: i + 1 } });

    postJSON('/Home/UpdateUserTabLocation', { userTabsUpdated: x }, function (data) {
        if (data.success) {
            page.ClearDirty();
            window.location.reload(true);
        }
        else {
            DisplayError(data.errors);
        }
    });
}

function closeWidgetGallery() {
    if (page.Confirmation()) {
        $("#tabLayoutContainer").slideUp();
        if (typeof (contactLoggedIn) != "undefined" && contactLoggedIn == true) {
            $("#childrenTabs").removeClass('display-none');
        }
        $("#mainTab").removeClass('display-none');
        $("#tabContent").removeClass('display-none');
        return false;
    }
}
