var ctrlCount = 0;
var originalGridHeight = 0;

(function ($) {
    $.A2C = function () { };

    var Methods = {
        Maximize: function (control) {
            var ctrl = control.closest('.modal-dialog');
            if (ctrl.hasClass('mpFullScreen')) {
                control.attr('data-original-title', maximizelebal);
                control.find('i').removeClass('fa-resize-small').addClass('fa-resize-full');
                ctrl.removeClass('mpFullScreen')
                ctrl.find('.modal-content').height('');
                ctrl.find('.modal-content').width('');
                ctrl.tooltip('destroy');
                Methods.ResizeGridInPopup(ctrl);
                Methods.ResizeTextAreaInPopup(ctrl);
            }
            else {
                control.find('i').removeClass('fa-resize-full').addClass('fa-resize-small');
                control.attr('data-original-title', restoreLabel);
                ctrl.addClass('mpFullScreen');
                Methods.ResizeGridInPopup(ctrl);
                ctrl.find('.modal-content').height($(window).height());
                ctrl.find('.modal-content').width($(window).width());
                ctrl.tooltip('destroy');
                Methods.ResizeTextAreaInPopup(ctrl);
            }

            ctrl.find('.modal-header').find('[rel=tooltip]').tooltip({ container: 'body', placement: 'bottom' });
            ctrl.find('.modal-content').css('top', '').css('left', '');
        },
        ResizeTextAreaInPopup: function (elm) {
            var ctrlTexArea = elm.find('.textarea');
            if (ctrlTexArea[0] != undefined) {
                var ctrlTexAreaId = ctrlTexArea[0].id;
                if (ctrlTexAreaId != null && ctrlTexAreaId != 'undefined' && ctrlTexAreaId != '') {
                    var w = $('.modal-body').width();
                    var h = $('.modal-body').height();
                    elm.find('.textarea').width((w - 40));
                    if (elm.hasClass('mpFullScreen')) {
                        elm.find('.textarea').height((h - 40));
                    }
                    else {
                        elm.find('.textarea').height((300));
                    }
                }
            }
        },
        ResizeGridInPopup: function (elm) {
            var currentPopupbodyHeight = 0;
            var gridParent = elm.find(".k-grid");
            var gridId = gridParent.attr("id");

            if (gridId != null && gridId != 'undefined' && gridId != '') {
                if (elm.hasClass('mpFullScreen')) {
                    currentgrdbodyHeight = elm.find('.modal-body').height() - elm.find(".modal-header").height();
                    originalGridHeight = gridParent.height();

                    var otherElements = elm.find('.modal-body').find('form div.row');
                    var otherElementsHeight = 0;
                    otherElements.each(function () {
                        if ($(this).find('.k-grid').length == 0) {
                            otherElementsHeight += $(this).outerHeight(true);
                        }
                    });

                    gridParent.height(currentgrdbodyHeight);

                    var A2CGrid = gridParent.data("kendoGrid").options.A2CGrid;
                    A2CGrid.SetMaximizedModeForPopUp(true);
                    // A2CGrid.SetMaximizedMode(true);
                    A2CGrid.Resize();
                }
                else {
                    gridParent.height(originalGridHeight);
                    var A2CGrid = gridParent.data("kendoGrid").options.A2CGrid;
                    A2CGrid.SetMaximizedModeForPopUp(false);
                    // A2CGrid.SetMaximizedMode(false);
                    A2CGrid.Resize();
                }
            }
        },
        SetScroll: function (isBeforeClose) {
            if (isBeforeClose) {
                if ($('body [role=dialog]').length > 1)
                    window.setTimeout("$('body').addClass('modal-open');", 1000);
            }
            else {
                if ($('body [role=dialog]').length >= 1)
                    window.setTimeout("$('body').addClass('modal-open');", 1000);
            }
        },
        GenerateControl: function (options, control) {
            $('html').css('overflow-y', 'hidden');
            $('body').addClass("modal-open");

            ctrlCount++;
            var mainDiv = $("<div id='long'>").attr('tabindex', '-1')
            .attr('class', 'modal')
            .attr('role', 'dialog')
            .attr('aria-hidden', 'true')
            .attr('aria-labelledby', 'myModalLabel' + ctrlCount)
            .attr('id', 'StandardCallback' + ctrlCount);

            control.ControlId = 'StandardCallback' + ctrlCount;

            var modalDialog = $('<div>').addClass('modal-dialog');
            if (options.IsRequireLargeModal)
                modalDialog.addClass('modal-lg');

            var modalConent = $('<div>').addClass('modal-content');
            var modalHeader = $('<div>').addClass('modal-header');

            var title = $("<div>").addClass('mpTitle').append("<h4>" + options.Title + "</h4>");
            modalHeader.append(title);
            modalHeader.append($("<div class='pull-right btn-group' id='btnGroupD'/><div class='pull-right btn-group' id='btnGroupC'/><div class='pull-right btn-group' id='btnGroupB'/><div class='pull-right btn-group' id='btnGroupA'/>"));


            if (options.IsRestoreMaximizeRequired) {
                var btnMaximize = $("<a class='btn btn-icon' href='#' rel='tooltip' title='" + maximizelebal + "'> <i class='icon-prepend fa fa-resize-full'></i></a>");
                btnMaximize.click(function () { Methods.Maximize($(this)); })
            }
            modalHeader.find('div[id=btnGroupD]').append(btnMaximize);

            var cancelButton = $('<a>').attr({ class: "btn btn-icon", 'rel': 'tooltip', type: "button", "aria-hidden": "true", title: closeTitle });
            cancelButton.click(function () {
                if (options.IsDirtyAttached && options.IsDirtyAttached == true) {
                    if (!control.Confirmation()) {
                        return false;
                    }
                }

                $(this).tooltip('destroy');
                Methods.SetScroll(true);
                control.ModalHide();
            });

            if (options.CancelButton) {
                if (options.CancelButton.Callback) {
                    cancelButton.click(function () {
                        if (control.DirtyObject == null)
                            options.CancelButton.Callback();
                        else if (!control.DirtyObject.isDirty)
                            options.CancelButton.Callback();
                    });
                }
            }


            var iCancelButton = $("<i>").attr({ class: "icon-prepend fa fa-times" });

            cancelButton.append(iCancelButton);
            modalHeader.find('div[id=btnGroupD]').append(cancelButton);




            // Below code adds other buttons (if any) except ok and cancel 
            if (options.Buttons && options.Buttons.length > 0) {
                var btnGroup = 'D';
                options.Buttons.forEach(function (button) {
                    if (!button.Type) {
                        var myButton = $("<a>").attr({ class: "btn btn-icon", id: button.Id, rel: 'tooltip' });
                        var itag = $("<i>");
                        if (button.Class) {
                            itag.addClass(button.Class);
                        }
                        myButton.click(function () {
                            button.Click();
                        })
                        btnGroup = 'D';
                        if (button.attributes != undefined && button.attributes != null) {
                            for (var i = 0; i < button.attributes.length; i++) {
                                if (button.attributes[i][0] == 'Group')
                                    btnGroup = button.attributes[i][1].toUpperCase();
                                else
                                    myButton.attr(button.attributes[i][0], button.attributes[i][1]);
                            }
                        }
                        myButton.append(itag);
                        myButton.append(button.Text);
                        modalHeader.find('div[id=btnGroup' + btnGroup + ']').append(myButton);
                    }
                });
            }

            var modalBody = $('<div>').addClass('modal-body clearBoth');
            modalBody.append('<div class="ui-widget-overlay" id="modalLoading"><img title="Loading..." alt="Loading..." class="modal-loading" src="/Content/SmartAdmin/img/ajax-loader.gif"></div>');
            modalConent.append(modalHeader).append(modalBody);
            modalDialog.append(modalConent);
            mainDiv.append(modalDialog);

            if (options.ShowPopUp) {
                mainDiv.modal({ backdrop: 'static' });
            }

            Methods.StartLoading(mainDiv);
            // below code remove modal from the DOM
            mainDiv.on('hidden.bs.modal', function (e) {
                $(this).remove();
            })

            mainDiv.on('hide.bs.modal', function (e) {
                $('html').css('overflow-y', 'auto');
            })
            //$('html').css('overflow-y', 'hidden');

            mainDiv.find('[rel=tooltip]').tooltip({ container: 'body', placement: 'bottom' });

            if (options.Content) {
                mainDiv.find('.modal-body').append(options.Content).promise().done(function () {
                    Methods.BindLoadCallBack(mainDiv, options, control);
                });
            }
            else if (options.ContentID) {
                mainDiv.find('.modal-body').append($(options.ContentID).html()).promise().done(function () {
                    Methods.BindLoadCallBack(mainDiv, options, control);
                });
            }
            else if (options.DynamicContent) {
                loadJsonParser();
                var ajax = {};
                ajax.url = options.DynamicContent.URL,
                ajax.contentType = "application/json;";
                ajax.type = options.DynamicContent.Type ? options.DynamicContent.Type : "GET";

                if (options.DynamicContent.Data) {
                    ajax.data = $.toJSON(options.DynamicContent.Data);
                }

                ajax.success = function (data) {
                    if (options.DynamicContent.IsIframe) {
                        var isIframeLoad = false;
                        $("<iframe height='100%' width='100%' style='min-height:600px;min-width:800px;border:0px;'></iframe>").appendTo(modalBody).load(function () {
                            if (!isIframeLoad) {
                                isIframeLoad = true;
                                var doc = $(this)[0].contentWindow.document;
                                doc.open();
                                doc.write(data);
                                doc.close();
                            }
                        });
                    }
                    else {
                        mainDiv.find('.modal-body').append(data).promise().done(function () {
                            Methods.BindLoadCallBack(mainDiv, options, control);
                        });
                    }
                };
                $.ajax(ajax);
            }

            return mainDiv;
        },
        BindLoadCallBack: function (ctrl, options, control) {
            if (options.OnLoadCallback) {
                options.OnLoadCallback(control);
            }
            ctrl.find(".modal-content").draggable({ handle: ctrl.find('.modal-header'), revert: function () { if (ctrl.find('.modal-header').offset().top < 0) { return true; } return false; } });
            Methods.ResizeEventBind(ctrl);
            Methods.AttachValidation();
            ctrl.find('.modal-body #modalLoading').hide();
            if (options.IsDirtyAttached && options.IsDirtyAttached == true) {
                control.AttachDirty();
            }
        },
        AttachValidation: function () {
            try {
                $("form").removeData("validator").removeData("unobtrusiveValidation");
                if ($.validator.unobtrusive) { $.validator.unobtrusive.parse("form"); }
            }
            catch (e) {
            }
        },
        ResizeEventBind: function (ctrl) {
            return false;
            ctrl.find(".modal-content").resizable({
                resize: function (event, ui) {
                    $(this).resizable({ handles: 'ew' });
                }
            });
        },
        StartLoading: function (ctrl) {
            $('#' + ctrl.ControlId + ' .modal-body #modalLoading').show();
            $(document).off('focusin.modal');
        },
        EndLoading: function (ctrl) {
            $('#' + ctrl.ControlId + ' .modal-body #modalLoading').hide();
        }
    };

    $.A2C.ModalPopup = function (options) {
        this.PropertyRef = true;

        this.DirtyObject = null;

        this.AttachDirty = function () {
            this.DirtyObject = $('#' + this.ControlId).dirtyPageCheck({ OnBeforeunloadMessage: beforeUnloadmessage, OnConfirmationMessage: confirmmessage });
            this.DirtyObject.AttachDirty();
        }

        this.ClearDirty = function () {
            this.DirtyObject.ClearDirty();
        }

        this.DetachDirty = function () {
            this.DirtyObject.DetachDirty();
        }

        this.SetDirty = function () {
            this.DirtyObject.SetDirty();
        }

        this.Confirmation = function () {
            return this.DirtyObject.Confirmation();
        }

        this.ControlId = null;

        this.ModalHide = function () {
            $('#' + this.ControlId).modal('hide');
            Methods.SetScroll();
        }
        this.SetTitle = function (title) {
            $('#' + this.ControlId).find('.mpTitle h4').html(title);
        }

        this.GetTitle = function () {
            return $('#' + this.ControlId).find('.mpTitle h4').html();
        }

        this.StartLoading = function () {
            Methods.StartLoading(this);
        }
        this.EndLoading = function () {
            Methods.EndLoading(this);
        }
        var tmpOptions = $.extend({}, $.A2C.ModalPopup.Defaults, options);
        Methods.GenerateControl(tmpOptions, this);
    }

    $.A2C.ModalPopup.Defaults = {
        Title: '',// It will display title for modal popup
        Content: null,// content will be displayed in the modal popup
        DynamicContent: null, // Type,URL,Params[QueryString/Object]
        ContentID: null, // ID of the control of which content will be displayed
        OnLoadCallback: null,// when content load it will be called.
        CancelButton: null,// it contains {Text, Callback, Display}
        ShowPopUp: true,// either true or false.
        IsRestoreMaximizeRequired: true,
        IsDirtyAttached: false,
        PropertyRef: null,
        IsRequireLargeModal: false
    };
})(jQuery);
