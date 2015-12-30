var body = $('body');
// The rate at which the menu expands revealing child elements on click
//$.menu_speed = 235;
$.sound_path = "/content/smartadmin/sound/";
// Note: You will also need to change this variable in the "variable.less" file.
$.navbar_height = 49;
$.left_panel = $('#left-panel');

var hideMsgInSecond = 10000;
$(document).mouseup(function (e) {

    var searchcontainer = $("#left-panel ul[data-type=submenu]");

    if (!searchcontainer.is(e.target) // if the target of the click isn't the container...
        && searchcontainer.has(e.target).length === 0) // ... nor a descendant of the container
    {
        searchcontainer.removeClass('show');
    }
    // remove tooltip from DOM
    $('div.tooltip').each(function () { if ($(this).hasClass('fade') && $(this).hasClass('in')) { $(this).remove(); } });
});

function bindTooltip() { if ($("[rel=tooltip]").length > 0) { $("[rel=tooltip]").tooltip({ container: 'body' }); } }

function generateDropDown() {
    if ($.fn.select2) {
        $('select').each(function () {
            if ($(this).hasClass('select2'))
                $(this).select2('destroy');
        });

        if ($('.select2-container').length)
            $('.select2-container').remove();

        $('select').each(function () {
            if ($(this).hasClass('select2')) {
                var $this = $(this);
                var width = $this.attr('data-select-width') || '100%';
                //, _showSearchInput = $this.attr('data-select-search') === 'true';
                $this.select2({
                    //showSearchInput : _showSearchInput,
                    allowClear: true,
                    width: width
                })
            }
        })
    }
}

function ExpandCollaseMenu() {
    $('.minifyme').click(function (e) {
        //$('#mainBody').toggleClass("minified") ;
        body.toggleClass("minified");
        if (body.hasClass('minified'))
            BrowserCache.Edit(BrowserCache.Key.BodyClass, "minified");
        else
            BrowserCache.Edit(BrowserCache.Key.BodyClass, "");
        $(this).effect("highlight", {}, 500);
        e.preventDefault();

        setTimeout(function () {
            //nav_page_height(); $1.4 ##2
            $(window).resize();
        }, 200);
    });
}
function toggleHeader() {
    //body.toggleClass("header-minified");
    //if ($('#mainBody').hasClass('header-minified')) {
    //    $('#mainBody').removeClass('header-minified');
    //    isToggleHeader = false;
    //}
    //else {
    //    $('#mainBody').addClass('header-minified');
    //    isToggleHeader = true;
    //}
    body.toggleClass("header-minified");
    if (body.hasClass('header-minified'))
        BrowserCache.Edit(BrowserCache.Key.HeaderClass, "header-minified");
    else
        BrowserCache.Edit(BrowserCache.Key.HeaderClass, "");

    resizeHead();
}
function unSelectSchool()
{    
    postJSON('/SelectSchool/SchoolSelected/', {
        schoolId: null,
        schoolName: null
    }, function (data) {
        clearAllBrowserCache();
        clearDiv();
        document.location.href = '/Home/Index';
    });
}
function pageSetup() {
    if (BrowserCache.Get(BrowserCache.Key.Header) == null && BrowserCache.Get(BrowserCache.Key.LeftMenu) == null) {
        var headerCtrl = '<div id="logo-group" class="prg-logo-group">' +
                        '<img id="ApplicationTitle" rel="tooltip" data-placement="bottom" alt="' + applicationTitle + '" title="' + applicationTitle + '" src="' + schoolLogoUrl + '" onclick="window.location.href=\'/\'" />' +
                '</div>' +
               '<div id="welcomeName" style="min-width:15%">' +
                    '<span class="label">Welcome</span>' +
                    '<span id="spnDisplayName"></span>' +
                '</div>' +
                '<div id="roleSelection" style="min-width:10%">' +
                    '<span class="label">Role</span>' +
                    '<span id="spnRoleSelectionName" style="display:none">Role</span>' +                    
                    '<span id="role-selector" class="dropdown-toggle dropdown-large" data-arrive="false" onclick="getRoles();" data-toggle="dropdown"></span>' +
                '</div>' +                
                '<div class="pull-right clearfix" id="topRightNav">' +
                    '<div class="resizeHead" onclick="toggleHeader();">.....</div>'+
                    '<div id="logout" class="btn-header pull-right">' +
                        '<span><a href="javascript:signOut();" data-placement="bottom" rel="tooltip" title="Sign Out"><i class="fa fa-sign-out"></i></a></span>' +
                    '</div>'+
                '<div id="profile" class="btn-header pull-right"><span><a href="javascript:currentUserProfileSelected();" rel="tooltip" data-placement="bottom" title="Manage Profile"><i class="moon icon-A2C_Manageprofile"></i></a></span></div>' +
                '</div>' +
               '<div id="selectedSchoolName" class="pull-right clearfix" style="min-width:25%">' +
                    '<span id="spnDisplaySchoolNameLabel" class="label">School </span>' +
                    '<span id="spnDisplaySchoolName"></span>' +
                '</div>';

        $('#header').html(headerCtrl);
        
        postJSON('/Home/GetHomepageData', null, function (data) {
            var menu = '';

            var transform = { tag: 'li', title: '${Title}', rel: 'tooltip', 'data-placement': "right", children: [{ tag: 'a', 'href': function () { return this.DefaultLink == '' ? "javascript:;" : this.DefaultLink }, 'data-id': '${MenuId}', children: [{ tag: 'i', 'class': '${Class}' }, { tag: 'span', class: 'menu-item-parent', html: '${Title}' }] }] };
            menu = '<div class="login-info"><div class="minifyme" data-action="minifyMenu"><i class="fa fa-arrow-circle-left hit"></i></div></div><nav><ul></ul></nav>';
            $('#left-panel').html(menu);
            ExpandCollaseMenu();
            $('#left-panel').find('ul').json2html(data.LeftMenu, transform);

            

            $('#left-panel a[href="javascript:;"]').each(function () {
                $(this).attr('onclick', 'getSubmenu($(this))');
            })                      
           

            
            $('#spnDisplayName').text(data.DisplayName);
            $('#spnDisplaySchoolName').text(data.DisplaySchoolName);
            if (data.DisplayUnselectIcon) {
                $('#spnDisplaySchoolNameLabel').append('<span id="schooldeselect" rel="tooltip" data-placement="bottom"  title="' + unselectSchool + '" data-original-title="' + unSelectSchool + '" onclick="javascript:unSelectSchool()" style="cursor:pointer" >[<i class="fa fa-times"></i>]</span>')
            }
            
            var roleNameSelected = data.SelectedRole;
            if (data.RoleCount > 1) {
                $('#role-selector').show();
                $('#role-selector').html('<div id=\"RoleId\">' + roleNameSelected + '</div>&nbsp;<i class=\"fa fa-caret-down\"  style=\"padding-left:3px\"></i>')
                                    .attr('data-rolecount', data.RoleCount);
                $('#spnRoleSelectionName').hide();                
            }
            else {
                $('#role-selector').hide();
                $('#spnRoleSelectionName').show();
                $('#spnRoleSelectionName').text(roleNameSelected);
            }
            if (data.DefaultLicenseKeyUser)
                $('#profile').hide();
            bindTooltip();
            BrowserCache.Edit(BrowserCache.Key.LeftMenu, $('#left-panel').html());
            BrowserCache.Edit(BrowserCache.Key.Header, $('#header').html());
            menuSettings();
        });
    }
    else {
        $('#header').html(BrowserCache.Get(BrowserCache.Key.Header));
        $('#left-panel').html(BrowserCache.Get(BrowserCache.Key.LeftMenu));
        $('#topRightNav .popover').remove();
        menuSettings();
        $('#roleSelection').removeClass('open');
        $('#left-panel .dropdown-menu-large').removeClass('show');
        $('div[class="tooltip fade right in"]').hide();
        setBodyClass();
    }
}
function currentUserProfileSelected() {
    if (currentUserId && currentUserId.toString().length > 0)
    {
        if (isSuperUser=='True')
            window.location.href = '/User/UserProfileSuperUser';
        else
            window.location.href = '/User/UserProfileSchoolUser';
    }
}
$(document).ready(function () {    
    generateDropDown();
    pageSetup();
    ExpandCollaseMenu();
    bindTooltip();
    //setLeftMenuScroll();
});
//$(window).resize(function () {
//    setLeftMenuScroll();
//});
//function setLeftMenuScroll() { // Commented code to resolve hight issue (A2C-968)
    //if (($(window).height() - $('header').height()) > $('nav').height()) {
    //    body.addClass('fixed-navigation');
    //}
    //else {
    //    body.removeClass('fixed-navigation');
    //}
//}

function resizeHead() {
    //nav_page_height(); $1.4 ##2
    setTimeout(function () {
        $(window).resize();
    }, 200);
}
function setBodyClass() {
    var bodyClass = BrowserCache.Get(BrowserCache.Key.BodyClass);
    if (bodyClass == null) {
        $('body').addClass('minified');
        BrowserCache.Edit(BrowserCache.Key.BodyClass, 'minified');
    }
    else {
        if ($('body').hasClass('minified'))
            $('body').removeClass('minified')
        $('body').addClass(bodyClass);
    }
    var headerClass = BrowserCache.Get(BrowserCache.Key.HeaderClass);
    if (headerClass != null)
        $('body').addClass(headerClass);
}
function menuSettings() {
    $('nav').resize(function () {
        //nav_page_height(); $1.4 ##2
    });

    // INITIALIZE LEFT NAV
    $('nav ul').jarvismenu({
        accordion: false,
        speed: $.menu_speed,
        closedSign: '<em class="fa fa-expand-o"></em>',
        openedSign: '<em class="fa fa-collapse-o"></em>'
    });

    // HIDE MENU
    $('#hide-menu >:first-child > a').click(function (e) {
        $('body').toggleClass("hidden-menu");
        e.preventDefault();
    });

    // COLLAPSE LEFT NAV

    //nav_page_height(); $1.4 ##2

    $('.menu-item-parent').closest('li').removeClass('active');
    $('.menu-item-parent').each(function () {
        if ($(this).html() == firstLevelMenu) {
            $(this).closest('li').addClass('active');
        }
    })
}
$.fn.extend({
    //pass the options variable to the function
    jarvismenu: function (options) {

        var defaults = {
            accordion: 'true',
            speed: 200,
            closedSign: '[+]',
            openedSign: '[-]'
        };

        // Extend our default options with those provided.
        var opts = $.extend(defaults, options);
        //Assign current element to variable, in this case is UL element
        var $this = $(this);

        //add a mark [+] to a multilevel menu
        $this.find("li").each(function () {
            if ($(this).find("ul").size() != 0) {
                //add the multilevel sign next to the link
                $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

                //avoid jumping to the top of the page when the href is an #
                if ($(this).find("a:first").attr('href') == "#") {
                    $(this).find("a:first").click(function () {
                        return false;
                    });
                }
            }
        });

        //open active level
        $this.find("li.active").each(function () {
            $(this).parents("ul").slideDown(opts.speed);
            $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
            $(this).parents("ul").parent("li").addClass("open")
        });

        $this.find("li a").click(function () {

            if ($(this).parent().find("ul").size() != 0) {

                if (opts.accordion) {
                    //Do nothing when the list is open
                    if (!$(this).parent().find("ul").is(':visible')) {
                        parents = $(this).parent().parents("ul");
                        visible = $this.find("ul:visible");
                        visible.each(function (visibleIndex) {
                            var close = true;
                            parents.each(function (parentIndex) {
                                if (parents[parentIndex] == visible[visibleIndex]) {
                                    close = false;
                                    return false;
                                }
                            });
                            if (close) {
                                if ($(this).parent().find("ul") != visible[visibleIndex]) {
                                    $(visible[visibleIndex]).slideUp(opts.speed, function () {
                                        $(this).parent("li").find("b:first").html(opts.closedSign);
                                        $(this).parent("li").removeClass("open");
                                    });

                                }
                            }
                        });
                    }
                } // end if
                if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
                    $(this).parent().find("ul:first").slideUp(opts.speed, function () {
                        $(this).parent("li").removeClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
                    });

                } else {
                    $(this).parent().find("ul:first").slideDown(opts.speed, function () {
                        /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
                        $(this).parent("li").addClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
                    });
                } // end else
            } // end if
        });
    } // end function
});
function getSubmenu(ctrl) {
    var id = ctrl.attr('data-id');
    if (id>0)  
    {
        $('#left-panel').removeClass('open');
        $('#left-panel ul[data-type=submenu]').removeClass('show');

        if ($('#left-panel #submenu-' + id).length == 0) {
           
            var menu = $('<ul class="dropdown-menu dropdown-menu-large row" id="submenu-' + id + '" data-type="submenu"><ul>');
            menu.append('<div class="arrow"></div>');
            menu.append('<div class="close"><i class="fa fa-times"></i></div>');
            $('#left-panel').append(menu);
            $('#left-panel #submenu-' + id).addClass('submenuloading').find('.close').attr('onclick', '$(this).parent().removeClass("show")');
            showSubmenu(ctrl, id);

            postJSON('/Menu/GetMenuList/', { id: id }, function (data) {
                createSubMenu(data, id, ctrl.find('.menu-item-parent').html());
                $('#left-panel #submenu-' + id).removeClass('submenuloading');
                BrowserCache.Edit(BrowserCache.Key.LeftMenu, $('#left-panel').html());
            });
        }
        else {
            showSubmenu(ctrl, id);
        }
    }  

    return false;
}
function showSubmenu(ctrl, id) {
   
    $('#left-panel').addClass('open');
    var submenuCtrl = $('#left-panel #submenu-' + id);
    submenuCtrl.addClass('show');
    var pointerPos = ctrl.parent().position().top + 55;
    submenuCtrl.find('.arrow').css('top', pointerPos);
    return;
}

function createSubMenu(datObj, id, menuName) {
    var menuObj = datObj.MenuList;
    var totalItem = datObj.TotalItem;

    var childMenu = '', childObj;
    var classType = 'col-sm-12';
    
    childMenu = '<div class="submenuheader">' + menuName + '</div>';
    childMenu += '<li class="' + classType + '"><ul>';
    for (var i = 0; i < menuObj.length; i++) {
        //childMenu += '<li class="dropdown-header">' + menuObj[i].Title + '</li>';
        childMenu += '<li><a href="' + menuObj[i].DefaultLink.replace('//', '/') + '" target="_self"><i class="fa fa-angle-double-right"></i>  ' + menuObj[i].Title + '</a></li>';
    }
    childMenu += '</ul></li>';
    $('#left-panel #submenu-' + id).append(childMenu);
}

function getRoles() {
    if ($('#role-selector').attr('data-arrive') == 'false' && $('#role-selector').attr('data-rolecount')!="1") {
        $('#role-selector').addClass('ui-autocomplete-loading');
        postJSON('/Home/GetRoleList', null, function (data) {
            createRoles(data);
            $('#role-selector').removeClass('ui-autocomplete-loading');
            BrowserCache.Edit(BrowserCache.Key.Header, $('#header').html());
        })
    }
}
function createRoles(datObj) {
    var roleObj = datObj.Roles;
    var totalItem = datObj.TotalRecord, itemsPerCol = 15;
    var columnSize = (12 / Math.ceil(totalItem / itemsPerCol));

    if (roleObj.length == 1) {
        var childMenu = $('<ul class="dropdown-menu"></ul>');

        var transform = { tag: 'li', class: function () { return datObj.SelectedRoleId == this.RoleId ? "active" : "" }, children: [{ tag: 'a', 'data-roleid': '${RoleId}', href: 'javascript:;', html: function () { return htmlEncode(this.RoleName) } }] };

        childMenu.json2html(roleObj[0], transform);
        //childMenu.find('li a').each(function () {
        //    $(this).attr('onclick', 'RoleSelected("' + $(this).attr('data-roleid') + '");return false');
        //});
        $('#roleSelection').append(childMenu)
    }
    else {

        var childMenu = '<ul class="dropdown-menu">', childObj;

        for (var i = 0; i < roleObj.length; i++) {
            if (roleObj[i] == datObj.SelectedRoleId)
                childMenu += '<li class="active"><a href="javascript:;">' + htmlEncode(roleObj[i]) + '</a></li>';
            else
                childMenu += '<li><a href="javascript:;" onclick="RoleSelected(\'' + roleObj[i] + '\')">' + htmlEncode(roleObj[i]) + '</a></li>';
        }
        childMenu += '</ul>';
        $('#roleSelection').append(childMenu);
    } 
    $('#role-selector').attr('data-arrive', 'true');
}
function signOut() {
    clearAllBrowserCache();
    window.location.href = '/Account/LogOff';
}

function clearAllBrowserCache() {
    BrowserCache.ClearAllItems();
}
function RoleSelected(roleId) {

    postJSON('/Home/UserRoleSelected', { role: roleId }, function (data) {
        clearAllBrowserCache();

        $('#RoleId').text(roleId);
        document.location.href = '/Home/Index';
    })
}
function ChangeUrl(url) {
    try {
        window.history.pushState(window.location.href, 'Title', url);
    } catch (error) { }
}
function showConfirmationMessage(message, yesCallback) {
    $.SmartMessageBox({
        title: "<i class='fa fa-warning txt-color-white'></i> <span class='txt-color-white'><strong>Confirmation</strong></span>",
        content: message,
        buttons: '[No][Yes]'

    }, function (ButtonPressed) {
        if (ButtonPressed == "Yes") {
            yesCallback();
        }
    });
}
function showConfirmationMessageWithCallBack(message, yesCallback, noCallback) {
    $.SmartMessageBox({
        title: "<i class='fa fa-warning txt-color-white'></i> <span class='txt-color-white'><strong>Confirmation</strong></span>",
        content: message,
        buttons: '[No][Yes]'

    }, function (ButtonPressed) {
        if (ButtonPressed == "Yes") {
            yesCallback();
        }
        else if (ButtonPressed == "No") {
            noCallback();
        }
    });
}
function loadJsonParser() {
    (function ($) {
        m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
$.toJSON = function (value, whitelist) {
    var a,          // The array holding the partial texts.
i,          // The loop counter.
k,          // The member key.
l,          // Length.
r = /["\\\x00-\x1f\x7f-\x9f]/g,
v;          // The member value.

    switch (typeof value) {
        case 'string':
            return r.test(value) ?
'"' + value.replace(r, function (a) {
    var c = m[a];
    if (c) {
        return c;
    }
    c = a.charCodeAt();
    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
}) + '"' :
'"' + value + '"';

        case 'number':
            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
            return String(value);

        case 'object':
            if (!value) {
                return 'null';
            }
            if (typeof value.toJSON === 'function') {
                return $.toJSON(value.toJSON());
            }
            a = [];
            if (typeof value.length === 'number' &&
!(value.propertyIsEnumerable('length'))) {
                l = value.length;
                for (i = 0; i < l; i += 1) {
                    a.push($.toJSON(value[i], whitelist) || 'null');
                }
                return '[' + a.join(',') + ']';
            }
            if (whitelist) {
                l = whitelist.length;
                for (i = 0; i < l; i += 1) {
                    k = whitelist[i];
                    if (typeof k === 'string') {
                        v = $.toJSON(value[k], whitelist);
                        if (v) {
                            a.push($.toJSON(k) + ':' + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (typeof k === 'string') {
                        v = $.toJSON(value[k], whitelist);
                        if (v) {
                            a.push($.toJSON(k) + ':' + v);
                        }
                    }
                }
            }
            return '{' + a.join(',') + '}';
    }
};

    })(jQuery);

}

//To submit file with other information
function postFile(url, data, callback, isAsyncRequest, errorcallback)
{
    if (jQuery.isFunction(errorcallback) == false) {
        errorcallback = function () { };
    }

    var async = true;
    if (isAsyncRequest != undefined)
        async = isAsyncRequest;

    $.ajax({
        type: "POST",
        url: url,
        contentType: false,
        processData: false,
        data: data,
        async: isAsyncRequest,
        success: function (data) {
            callback(data);
        },
        error: function (request, error, errorThrown) {
            displayAjaxError(request);
            errorcallback();
        }
    });
}

//To submit only json object
function postJSON(url, data, callback, isAsyncRequest, errorcallback) {

    if (jQuery.isFunction(errorcallback) == false) {
        errorcallback = function () { };
    }

    var encoded = data;

    if (window.JSON) {
        encoded = JSON.stringify(data);
    } else {
        loadJsonParser();
        encoded = $.toJSON(data);
    }

    var async = true;
    if (isAsyncRequest != undefined)
        async = isAsyncRequest;

    return jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        data: encoded,
        success: function (data) {
            callback(data);
        },
        error: function (request, error, errorThrown) {
            displayAjaxError(request);
            errorcallback();
        },
        //dataType: 'json',
        async: async
    });
}
function displayAjaxError(request) {
    clearDiv();
    if (request.getResponseHeader('SessionExpire') == 'true') {
        sessionExpiredInformation();
    }
    else if (request.getResponseHeader('InternalServerError') == 'true') {
        displayInternalServerError(request.responseText);
    }
}
function displayInternalServerError(errorInformation)
{
    var err = JSON.parse(errorInformation);
    $.SmartMessageBox({
        title: "<i class='fa fa-warning txt-color-white'></i> <span class='txt-color-white'><strong>" + err.Title + "</strong></span>",
        content: err.ErrorMessage,
        buttons: '[OK]'
    });
}
function sessionExpiredInformation()
{
    $.SmartMessageBox({
        title: "<i class='fa fa-warning txt-color-white'></i> <span class='txt-color-white'><strong>" + sessionTimedOutTitle + "</strong></span>",
        content: sessionTimeOutMessage,
        buttons: '[OK]'

    }, function (ButtonPressed) {
        if (ButtonPressed == "OK") {
            signOut();
        }
    });
}

var ampRegExp = /&/g,
        ltRegExp = /</g,
        quoteRegExp = /"/g,
        aposRegExp = /'/g,
        gtRegExp = />/g;

function htmlEncode(value) {
    return ("" + value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
}
function progressBar(container, toggle, isButtonDivEnable) {
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
    if (isButtonDivEnable == undefined || isButtonDivEnable == false) {
        container = $('#ribbon');
        if (container.length > 0) {
            mask = findElement('#ribbon', ".p-loading-mask"),
            leftRight, webkitCorrection, containerScrollLeft;

            if (toggle) {
                if (!mask.length) {
                    leftRight = "left";
                    containerScrollLeft = container.scrollLeft();
                    mask = $("<div class='p-loading-mask'><div class='p-loading-color'/></div>")
                        .width("100%").height("100%")
                        .css("top", container.scrollTop())
                        .css(leftRight, Math.abs(containerScrollLeft))
                        .prependTo(container);
                }
            } else if (mask) {
                mask.remove();
            }
        }
    }
}
function findElement(container,element)
{
    return $(container + ' ' + element);
}
function busyDiv(element)
{
    if (element != undefined) {
        progressBar(element, true);
    }
    else {
        progressBar("#main", true);
    }
}
function clearDiv(element)
{
    if (element != undefined) {
        progressBar(element, false);
    }
    else {
        progressBar("#main", false);
    }
}
// This is the function.
String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
