(function ($) {
    var Methods = {
        CreateWizard: function (ctrl) {
            var option = ctrl.Options;
            var mainCtrl = $('<div>').addClass('clearBoth').addClass('my-wizard');

            var wTab = $('<div>').addClass('form-bootstrapWizard');
            var wTabUl = $('<ul>').addClass('bootstrapWizard').addClass('form-wizard');

            var wTabLiA, stepNo;
            var tabContent = $('<div>').addClass('tab-content');
            for (var i = 0; i < option.Data.length; i++) {
                if (option.AutoGenerateNo)
                    stepNo = i + 1;
                else
                    stepNo = option.Data[i].No;
                wTabLiA = $('<a>').attr('href', '#' + Methods.GenerateTabId(ctrl) + stepNo).attr('data-toggle', "tab");
                wTabLiA.append($('<span>').addClass('step').html(stepNo));
                wTabLiA.append($('<span>').addClass('title').html(option.Data[i].Name));
                wTabUl.append($('<li>').append(wTabLiA).attr('data-target', '#step' + stepNo));
                tabContent.append($('<div>').addClass('tab-pane').attr('data-index', i).attr('id', Methods.GenerateTabId(ctrl) + stepNo));
            }
            wTab.append($('<div class="pull-left">')).append($('<div class="pull-right">'));
            wTab.children().eq(0).append(wTabUl).css('width', '100%');
            wTab.append($('<div>').addClass('clearfix'));

            if (option.IsRequireNavigation) {                
                var navControl = wTab.children().eq(1);
                navControl.css('width', '10%');
                wTab.children().eq(0).css('width', '89%');
                navControl.append("<a class='btn btn-icon btn-form-icon pull-right' rel='tooltip' title='" + nextText + "' style='margin-left:5px;' id='rightNav' href='#'><i class='fa fa-chevron-right'></i></a><a class='btn btn-icon btn-form-icon pull-right' rel='tooltip' title='" + previousText + "' id='leftNav' href='#'><i class='fa fa-chevron-left'></i></a>");
                navControl.find('#leftNav').click(function () { Methods.MoveWithNavigation(ctrl, ctrl.CurrentStep - 1, true); });
                navControl.find('#rightNav').click(function () { Methods.MoveWithNavigation(ctrl, ctrl.CurrentStep + 1, false); })            
            }
            

            mainCtrl.append(wTab).append(tabContent);

            ctrl.html(mainCtrl);

            Methods.MovetoStep(ctrl, option.ActiveStepNo);

            if (option.OnLoadStep)
                Methods.OnLoadStep(ctrl);

            Methods.RemoveTooltip();
        },
        MoveWithNavigation: function (ctrl, stepNo, isLeftOrRight, sameStepCallCount) {

            if (stepNo < 0)
                stepNo = 0;

            if (stepNo >= ctrl.Options.Data.length)
                stepNo = ctrl.Options.Data.length - 1;

            var option = ctrl.Options;
            var head = ctrl.find('.bootstrapWizard li[data-target]').eq(stepNo);

            if (head.find('a[data-toggle=tab]').length == 0) {
                if (isLeftOrRight)
                    stepNo--;
                else
                    stepNo++;

                if (stepNo <= 0 || stepNo >= ctrl.find('.bootstrapWizard li').length) {
                    if (sameStepCallCount == undefined)
                        sameStepCallCount = 1;
                    else
                        sameStepCallCount++;
                }

                if (sameStepCallCount < 2 || sameStepCallCount == undefined)
                    Methods.MoveWithNavigation(ctrl, stepNo, isLeftOrRight, sameStepCallCount);
            }
            else {
                sameStepCallCount = 0;
                ctrl.find('.bootstrapWizard li').removeClass('active');
                head.addClass('active');
                ctrl.find('.tab-content div[class^="tab-pane"]').removeClass('active');
                var content = ctrl.find('.tab-content div[data-index=' + stepNo + ']');
                content.addClass('active');

                if (option.OnLoadStep) {
                    var tmpStepNo =  1;
                    if (option.AutoGenerateNo)
                        tmpStepNo = stepNo + 1;
                    else
                        tmpStepNo = option.Data[stepNo].No;

                    option.OnLoadStep(option.Data[stepNo], ctrl.find('.tab-content div[id=' + Methods.GenerateTabId(ctrl) + tmpStepNo + ']'));
                }
                ctrl.CurrentStep = stepNo;
            }

            Methods.RemoveTooltip();
        },

        MovetoStep: function (ctrl, stepNo) {
            var option = ctrl.Options;
            if (stepNo == null) {
                if (option.AutoGenerateNo)
                    stepNo = 1;
                else
                    stepNo = option.Data[0].No;
            }

            if (ctrl.find('.bootstrapWizard li[data-target="#step' + stepNo + '"] a[data-toggle]').length == 0) {                
                return;
            }

            
            var head = ctrl.find('.bootstrapWizard li[data-target="#step' + stepNo + '"]');
            if (option.OnLoadStep && head.find('a[data-toggle=tab]').length == 1) {
                ctrl.find('.bootstrapWizard li').removeClass('active');
                head.addClass('active');
                ctrl.find('.tab-content div[class^="tab-pane"]').removeClass('active');
                var content = ctrl.find('.tab-content div[id=' + Methods.GenerateTabId(ctrl) + stepNo + ']');
                content.addClass('active');


                var index = Methods.GetIndexFromControl(ctrl, stepNo);
                option.OnLoadStep(option.Data[index], ctrl.find('.tab-content div[id=' + Methods.GenerateTabId(ctrl) + stepNo + ']'));
                ctrl.CurrentStep = index;
            }

            Methods.RemoveTooltip();
        },
        RemoveTooltip: function () {
            $('div.tooltip').each(function () { if ($(this).hasClass('fade') && $(this).hasClass('in')) { $(this).remove(); } });
        },
        OnLoadStep: function (ctrl) {            
            var option = ctrl.Options;
            if (option.OnLoadStep) {                
                ctrl.find('.bootstrapWizard li a').each(function (index) {                  
                    $(this).click(function () {
                        var stepNo = 1;
                        if (option.AutoGenerateNo)
                            stepNo = index + 1;
                        else
                            stepNo = option.Data[index].No;

                        if ($(this).attr('data-toggle') == 'tab') {
                            option.OnLoadStep(option.Data[index], ctrl.find('.tab-content div[id=' + Methods.GenerateTabId(ctrl) + stepNo + ']'));
                            ctrl.CurrentStep = index;
                        }
                    });
                });
            }
            Methods.RemoveTooltip();
        },
        DisableSteps: function (ctrl, stepNos) {
            ctrl.find('.bootstrapWizard li a').each(function (index) {
                if (Methods.IsElementExist(stepNos, $(this).attr('href').replace('#' + Methods.GenerateTabId(ctrl), ''))) {
                    $(this).removeAttr('data-toggle');
                    $(this).css('opacity', 0.4);
                }
            });
            Methods.RemoveTooltip();
        },
        EnableSteps: function (ctrl, stepNos) {
            ctrl.find('.bootstrapWizard li a').each(function (index) {
                if (Methods.IsElementExist(stepNos, $(this).attr('href').replace('#' + Methods.GenerateTabId(ctrl), ''))) {
                    $(this).attr('data-toggle', 'tab');
                    $(this).css('opacity', '');
                }
            });
            Methods.RemoveTooltip();
        },
        IsElementExist: function (arr, element) {
            for (var i = 0; i < arr.length; i++)
                if (element == arr[i])
                    return true;
            return false;
        },
        GetIndexFromControl: function (ctrl, stepNo) {
            var currentIndex = 0;
            ctrl.find('.bootstrapWizard li a').each(function (index) {
                if ((stepNo == $(this).attr('href').replace('#' + Methods.GenerateTabId(ctrl), '')) && currentIndex == 0) {
                    currentIndex = index;
                }
            });
            return currentIndex;
        },
        GenerateTabId: function (ctrl) {
            return ctrl.attr('id') + 'tab';
        }
    };


    $.fn.Wizard = function (option) {

        this.DisableSteps = function (stepNos) {
            Methods.DisableSteps(this, stepNos);
        };

        this.MovetoStep = function (stepNo) {
            Methods.MovetoStep(this, stepNo);
        }

        this.EnableSteps = function (stepNos) {
            Methods.EnableSteps(this, stepNos);
        };

        var tmpOptions = $.extend({}, $.fn.Wizard.Defaults, option);
        this.Options = tmpOptions;
        this.CurrentStep = 0;
        var currentCtrl = this;

        return this.each(function () {
            Methods.CreateWizard(currentCtrl);
            bindTooltip();
        });
    }
    $.fn.Wizard.Defaults = {
        Data: [{ No: 0, Name: '' }],
        AutoGenerateNo: true,
        ActiveStepNo: null,
        OnLoadStep: null,
        IsRequireNavigation: true
    };
})(jQuery);