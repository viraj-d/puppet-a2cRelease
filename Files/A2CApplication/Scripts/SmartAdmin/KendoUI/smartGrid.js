(function ($) {
    var opt,
    // Import Drawing API namespaces
    draw = kendo.drawing;
    geom = kendo.geometry;

    // PDF Output is fixed at 72 DPI
    // This gives us a fixed mm/px ratio
    MM_TO_PX = 2.8347;

    // A4 Sheet with 1 cm borders, landscape
    PAPER_RECT = new geom.Rect(
        [5, 5], [(210 - 5) * MM_TO_PX, (297 - 5) * MM_TO_PX]
    );

    A2CGridExt = {
        excelExport: function (e) {
            //Prevent saving file.
            e.preventDefault();
            var workbook = e.workbook,
            sheet = workbook.sheets[0],
            pdfOption = this.options.excel;

            var lockColumnExists = false;
            for (var i = 0; i < this.options.columns.length; i++)
                if (lockColumnExists == false)
                    lockColumnExists = this.options.columns[i].locked;


            for (var colIndex = 0; colIndex < sheet.columns.length; colIndex++) {
                if (sheet.columns[colIndex].width < 20 || lockColumnExists) {
                    sheet.columns[colIndex].width = 140;
                }
                else
                    sheet.columns[colIndex].autoWidth = true;
            }

            var defer = $.Deferred();
            defer.then(function (wb) {
                kendo.saveAs({
                    dataURI: new kendo.ooxml.Workbook(wb).toDataURL(),
                    fileName: pdfOption.fileName,
                    proxyURL: "/proxy",
                    filterable: true,
                    allPages: pdfOption.allPages
                });
            }).done(function (arg) {
                //Clear busy div icon on excel export complition.
                clearPageDiv();
            });
            defer.resolve(workbook);
        },
        pdfExport: function (e) {
            // Stop the built-in export
            e.preventDefault();

            //save pdf option customized by developer
            var pdfOption = this.options.pdf;

            // Clone the Grid HTML offscreen
            var wrapper = this.wrapper;
            var shadow = $("<div class='k-export-wrap'>")
                         .css("width", wrapper.width());

            // Prepend the export container
            wrapper.before(shadow);

            // This group will be our document containing all pages
            var doc = new draw.Group();

            this.dataSource.bind("change", function handler() {
                var dataSource = this;

                // Copy the current page view to the export container
                shadow.empty().append(wrapper.clone());

                draw.drawDOM(shadow)
                    .done(function (group) {
                        // Format the current page
                        var pageNum = dataSource.page();
                        var totalPages = dataSource.totalPages();

                        var page = A2CGridExt.formatPage(group, {
                            page: pageNum,
                            total: totalPages
                        });

                        doc.append(page);

                        if (pageNum < totalPages) {
                            // Move to the next page
                            dataSource.page(pageNum + 1);
                        } else {
                            // Last page processed reached
                            dataSource.unbind("change", handler);
                            shadow.remove();
                            A2CGridExt.saveReport(doc, pdfOption);
                        }
                    });
            });

            // Read the first page
            this.dataSource.fetch();
        },
        saveReport: function (doc, pdfOption) {
            draw.exportPDF(doc, {
                paperSize: "A4",
                filterable: true,
                landscape: false,
                creator: "Progresso",
                margin: { left: "0cm", top: "0.5cm", right: "0cm", bottom: "0.5cm" },
                multiPage: true,
                allPages: false
            }).done(function (data) {
                // Save the PDF file
                kendo.saveAs({
                    dataURI: data,
                    fileName: pdfOption.fileName,
                    proxyURL: "/proxy"
                });
            });
        },
        formatPage: function (content) {
            // Fit the content in the available space
            content = A2CGridExt.fit(content, PAPER_RECT)

            // Center the content
            content = A2CGridExt.hAlign(content, PAPER_RECT, "topLeft")

            // Add a frame to fix the page size
            var frame = draw.Path.fromRect(PAPER_RECT, {
                stroke: null
            });

            var page = new draw.Group();
            page.append(frame, content);

            return page;
        },
        // Transform the content to fit into the specified size
        fit: function (content, rect) {
            var bbox = content.clippedBBox();
            var size = rect.size;
            var scale = Math.min(
                size.width / bbox.width(),
                size.height / bbox.height()
            );

            // We apply the actual transformation on a wrapper
            // so its applied before any existing transformations
            var wrap = new draw.Group({
                transform: geom.transform().scale(scale, scale)
            });

            wrap.append(content);

            return wrap;
        },
        // Horizontally aligns an element within a rectangle
        // Supported aligments are "left", "center" and "right"
        hAlign: function (element, rect, pos) {
            var offset = 0;
            var anchor = "topLeft";

            if (pos === "center") {
                anchor = "center";
            } else if (pos === "right") {
                anchor = "topRight";
            }

            var offset = rect[anchor]().x - element.clippedBBox()[anchor]().x;

            // We apply the actual transformation on a wrapper
            // so its applied before any existing transformations
            var wrap = new draw.Group({
                transform: geom.transform().translate(offset, 0)
            });

            wrap.append(element);

            return wrap;
        },
        /*Select column template*/
        rowSelectionColumn: function (selectable, columns) {
            if (selectable) {
                var checkBoxColumn = { template: "<input type='checkbox' class='rowselection' />", width: 25, lockable: false };
                columns.splice(0, 0, checkBoxColumn);
            }
        },
        onDataChange: function (grid, e) {
            if (e && e.action) {
                /*Grid datachange event function call*/
                if (grid && grid.Editable && $.isFunction(grid.OnDataChangeCallBack)) {
                    grid.OnDataChangeCallBack(e);
                }
            }
        },
        onChange: function (e) {
            var grid = e.options.A2CGrid;
            /*Grid row selection event function call*/
            if (grid.Selectable && $.isFunction(grid.OnSelectCallBack)) {
                var entityGrid = grid.KendoGrid.data("kendoGrid");
                var selectedRowCount = entityGrid.select().length;
                grid.OnSelectCallBack(e.options.A2CGrid, selectedRowCount);
            }
        },
        setFilteredMembers: function (filter, members) {
            /* Function to find kendo column header with filter applied */
            if (filter.filters) {
                for (var i = 0; i < filter.filters.length; i++) {
                    A2CGridExt.setFilteredMembers(filter.filters[i], members);
                }
            }
            else {
                members[filter.field] = true;
            }
        },
        dataBound: function (e) {
            var grid = e.options.A2CGrid;
            if ($.isFunction(grid.DataBound)) {
                grid.DataBound.call(e.options.A2CGrid);
            }
            /*Resize grid after data bind, based on number of row*/
            grid.Resize(true);
        },
        toolbarTemplate: function (advancefilter, defaultfilter, clearfilter, toolBarCustom) {
            var tempElement = $('<span/>');
            var isCustomToolbar = false;
            if (toolBarCustom != undefined && toolBarCustom != '' && toolBarCustom != null) {
                tempElement.append(toolBarCustom);
                isCustomToolbar = true;
            }
            if (this.Advancefilter) {
                $.advfilterExt.createAdvanceFilterButtons(tempElement, advancefilter, defaultfilter, clearfilter);
            }
            return ((tempElement.children('a').length > 0) || (isCustomToolbar === true)) ? "<div class='pull-right'>" + tempElement.html() + "</div>" + "<div class='pull-right filtername'></div>" : '';
        },
        isEllipsisActive: function (e) {
            //Duplicate the current element in hidden state and check if width is changed
            var element = $(e).clone().css({ display: 'inline', width: 'auto', visibility: 'hidden' }).appendTo('body');
            var isElementSmaller = element.width() > $(e).width();

            //Remove the duplicate element
            element.remove();
            return isElementSmaller;    //return (e.offsetWidth <= e.scrollWidth);
        },
        prepareSearchJson: function (advOption) {
            return {
                ActionPath: advOption.actionPath,
                ParentDiv: advOption.parentDivToRenderGrid,
                ParentDivToRenderGrid: advOption.parentDivToRenderGrid,
                SearchAreaKey: advOption.searchAreaKey,
                GuestSchoolId: 0,
                DefaultParameter: 'null',
                LinkUrl: '/AdvanceSearchSmart/AdvanceSearchNonEts',
                ModalTitle: mngAdvFilterText
            };
        },
        preparePostData: function (A2CGrid) {
            return function () {
                var data = $.isFunction(A2CGrid.Data) ? A2CGrid.Data.call() : A2CGrid.Data,
                    advfilter = {};

                if (A2CGrid.Advancefilter) {
                    var advOption = A2CGrid.Advancefilter;
                    if (A2CGrid.AdvanceSearchData) {
                        /*Call if user apply filter and click on search button*/
                        advfilter[advOption.parameterName] = A2CGrid.AdvanceSearchData;
                    }
                    else {
                        advfilter[advOption.parameterName] = A2CGridExt.prepareSearchJson(advOption);
                    }
                }
                return $.extend({}, data, advfilter ? advfilter : {});
            };
        },
        initializeTooltip: function (element, filter) {
            return element.kendoTooltip({
                autoHide: true,
                filter: ".k-td-customtooltip",
                callout: true,
                content: function (e) {
                    var target = e.target,
                        tooltip = e.sender,
                        tooltipText = "";

                    if (A2CGridExt.isEllipsisActive(target[0])) {
                        tooltipText = kendo.htmlEncode($(target).text());
                    }

                    tooltip.popup.unbind("open");

                    tooltip.popup.bind("open", function (arg) {
                        tooltip.refreshTooltip = false;
                        this.wrapper.css("width", "500px");

                        if (!A2CGridExt.isEllipsisActive(target[0])) {
                            arg.preventDefault();
                        }
                        else if (tooltipText !== kendo.htmlEncode($(target).text())) {
                            tooltip.refreshTooltip = true;
                        }
                        else if ($(target[0]).hasClass("k-grid-allowwrap")) {
                            // don't show the tooltip when content is allowed to wrap
                            arg.preventDefault();
                        }
                    });

                    return tooltipText;
                },
                show: function () {
                    if (this.refreshTooltip) {
                        this.refresh();
                    }
                }
            }).data("kendoTooltip");
        },
        autoResize: function (A2CGrid) {
            var onAutoResize = function () {
                A2CGrid.Parent.css("height", $(window).height() - A2CGrid.Parent.offset().top - 20);
                /*Re-set grid height*/
                A2CGrid.OriginalSize.height = 0;
                A2CGrid.Resize();
            };
            /*Bind window auto resize event*/
            $(window).on('resize', function () {
                onAutoResize();
            });
            onAutoResize();
        },
        onStateChang: function (e) {
            var grid = e.options.A2CGrid;
            /*Grid state change event function call*/
            if ($.isFunction(grid.OnStateChangCallBack)) {
                setTimeout(function () {
                    grid.OnStateChangCallBack(grid);
                }, 50);
            }
        },
        setFilterable: function (type) {

            if (type == 'integer') {
                return {
                    ui: function (element) {
                        element.kendoNumericTextBox({
                            format: "n0"
                        });
                    }
                };
            }
            else if (type == 'date') {
                return {
                    ui: function (element) {
                        element.kendoDatePicker({ format: javaScriptDateFormat });
                    }
                };
            }
            else if (type == 'time') {
                return { ui: "timepicker" };
            }
            else if (type == 'commaseparatedstring') {
                return {
                    operators: {
                        string: {
                            contains: "contains"
                        }
                    }
                };
            }
            else if (type == 'dayOfWeek') {
                return {
                    operators: {
                        string: {
                            eq: "Is equal to"
                        }
                    }
                };
            }
        }
        ,
        convertFilterDateToUTC: function (filters) {
            for (var filter = 0; filter < filters.length; filter++) {
                if (filters[filter].filters != null)
                    this.convertFilterDateToUTC(filters[filter].filters);
                else if (filters[filter].value instanceof Date) {
                    filters[filter].value = filters[filter].value.ConvertToJSON();
                }
            }
        }
        ,
        convertDateStringToDateType: function (filterList, columns) {
            for (var j = 0; j < filterList.length; j++) {
                if (filterList[j].filters != null)
                    A2CGridExt.convertDateStringToDateType(filterList[j].filters, columns);
                else {
                    for (var i = 0; i < columns.length; i++) {
                        if (filterList[j].field == columns[i].field) {
                            if (columns[i].type == 'date')
                                filterList[j].value = new Date(filterList[j].value);
                            break;
                        }
                    }
                }
            }
        }
    },
    A2CGrid = function (options, parentDiv) {
        this.RefreshAllAdvanceFitlerList = true;
        this.AllFilterGridObject = null;
        this.GridKey = options.gridKey;
        this.Url = options.url;
        this.Columns = options.columns;
        this.Data = options.data;
        this.Editable = options.editable;
        this.Sortable = options.sortable;
        this.Pageable = options.pageable;
        this.Groupable = options.groupable;
        this.Reorderable = options.reorderable;
        this.Resizable = options.resizable;
        this.Filterable = options.filterable;
        this.Selectable = options.selectable;
        this.Scrollable = options.scrollable;
        this.Navigatable = options.navigatable;
        this.OnSelectCallBack = options.onSelectCallBack;
        this.OnDataChangeCallBack = options.onDataChangeCallBack;
        this.OnStateChangCallBack = options.onStateChangCallBack;
        this.GridState = options.gridState;
        this.Advancefilter = options.advancefilter;
        this.Defaultfilter = options.defaultfilter;
        this.Clearefilter = options.clearefilter;
        this.ColumnMenu = options.columnMenu;
        this.MaxRowCount = options.maxRowCount;
        this.ToolBar = options.toolbar;
        this.MaximizedMode = false;
        this.OriginalSize = { height: 0, width: 0 };
        this.AdvanceSearchData = false;
        this.DataSource = options.dataSource;
        this.DataBound = options.dataBound;
        this.Parent = $(parentDiv);
        this.KendoGrid = {};
        this.AutoResize = options.autoResize;
        this.DetailInit = options.detailInit;
        this.ExportOption = options.exportOption;
    };

    $.fn.A2CGrid = function (options) {
        opt = $.extend({}, $.fn.A2CGrid.options, options);
        var instance = new A2CGrid(opt, this.get(0));
        return instance;
    };

    $.fn.A2CGrid.options = {
        gridKey: "",
        url: "",
        columns: [],
        data: null,
        editable: false,
        sortable: true,
        pageable: true,
        groupable: false,
        reorderable: true,
        resizable: true,
        filterable: true,
        scrollable: true,
        selectable: "multiple",
        advancefilter: false,
        defaultfilter: false,
        clearefilter: false,
        columnMenu: true,
        navigatable: false,
        maxRowCount: 0,
        toolbar: '',
        gridState: '',
        onSelectCallBack: {},
        onDataChangeCallBack: {},
        onStateChangCallBack: {},
        dataBound: {},
        autoResize: false,
        dataSource: false,
        detailInit: null
    };

    $.extend(A2CGrid, {
        prototype: {
            Render: function () {
                /*Check column type and assign appropriate template*/
                for (var i = 0; i < this.Columns.length; i++) {
                    var item = this.Columns[i];
                    var custAttr = new Array();
                    if (item.attributes == undefined || item.attributes.length == 0) {
                        item.attributes = new Object();
                    }
                    else {
                        custAttr = item.attributes;
                        item.attributes = new Object();
                    }
                    item.attributes["customType"] = item.type;
                    //Tooltip incorporate logic
                    var tooltip = item.title;
                    if (item.tooltip != '' && item.tooltip != undefined && item.tooltip != null) {
                        tooltip = item.tooltip;
                    }
                    if (item.headerTemplate == undefined) {
                        item.headerTemplate = '<span class="smartgridhead" title="' + tooltip + '" rel="tooltip">' + item.title + '</span>';
                    }
                    if (item.type === 'number') {
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                    }
                    else if (item.type === 'integer') {
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                        item.type = 'number';
                        item.format = '{0:n0}';
                        item.filterable = A2CGridExt.setFilterable(item.type);
                    }
                    else if (item.type === 'string') {
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                    }
                    else if (item.type === 'date') {
                        var format;
                        if (item.format == "" || item.format == undefined)
                            format = javaScriptDateFormat;
                        else
                            format = item.format;
                        if (item.filterable === undefined || item.filterable === true) {
                            item.filterable = A2CGridExt.setFilterable(item.type);
                        }
                        item.type = 'date';

                        if (format.search("{0:") === -1) {
                            item.format = "{0:" + format + "}";
                        }

                        item.attributes["class"] = "table-cell k-td-customtooltip";
                    }
                    else if (item.type === 'time') {
                        if (item.filterable === undefined || item.filterable === true)
                            item.filterable = A2CGridExt.setFilterable(item.type);
                        item.type = 'time';
                        item.format = "{0:" + javaScriptTimeFormat + "}"
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                    }
                    else if (item.type === 'multiselect') {
                        item.attributes["class"] = "table-cell k-tablecell-center";
                        item.template = checkBoxDisplay;
                    }
                    else if (item.type === 'url') {
                        item.type = 'string';
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                        item.template = "<a href='" + item.url + "'> #:" + item.field + "#</a>"
                    }
                    else if (item.type === 'image') {
                        item.type = 'string';
                        item.filterable = false;
                        item.sortable = false;
                        item.attributes["class"] = "table-cell k-tablecell-center";
                        item.template = "<img src='" + item.src + "' />"
                    }
                    else if (item.type === 'imagelink') {
                        item.type = 'string';
                        item.filterable = false;
                        item.sortable = false;
                        item.attributes["class"] = "table-cell k-tablecell-center";
                        item.template = "<a href='" + item.url + "'><img src='" + item.src + "' alt='" + item.alt + "' title='" + item.tooltip + "' /></a>"
                    }
                    else if (item.type === 'iconlink') {
                        item.type = 'string';
                        item.filterable = false;
                        item.sortable = false;
                        item.attributes["class"] = "table-cell";
                        item.template = "<a href='" + item.url + "'><i class='" + item.imgclass + "' /></a>"
                    }
                    else if (item.type === 'iconlinkjs') {
                        item.type = 'string';
                        item.filterable = false;
                        item.sortable = false;
                        item.attributes["class"] = "table-cell";
                        item.template = "<a href='javaScript:;' onClick=" + item.jsfunction + "><i class='" + item.imgclass + "' /></a>"
                    }
                    else if (item.type === 'percentage') {
                        item.type = 'string';
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                    }
                    else if (item.type === 'commaseparatedstring') {
                        item.type = 'string';
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                        item.filterable = A2CGridExt.setFilterable(item.type);
                    }
                    else if (item.type === 'dayOfWeek') {
                        item.type = 'string';
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                        item.filterable = A2CGridExt.setFilterable(item.type);
                    }
                    else {
                        item.attributes["class"] = "table-cell k-td-customtooltip";
                    }
                    //Merge the attributes
                    if (custAttr != undefined && custAttr != null && Object.keys(custAttr).length > 0) {
                        for (var j = 0; j < Object.keys(custAttr).length; j++) {
                            if (Object.keys(custAttr)[j] in item.attributes) {
                                item.attributes[Object.keys(custAttr)[j]] = item.attributes[Object.keys(custAttr)[j]] + " " + custAttr[Object.keys(custAttr)[j]];
                            }
                            else {
                                item.attributes[Object.keys(custAttr)[j]] = custAttr[Object.keys(custAttr)[j]];
                            }
                        }
                    }
                }

                this.KendoGrid = this.Parent.kendoGrid({
                    dataSource: this.DataSource ? this.DataSource : {
                        type: "json",
                        transport: {
                            read: {
                                url: this.Url,
                                dataType: "json",
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                data: A2CGridExt.preparePostData(this)
                            },
                            parameterMap: function (options, operation) {
                                if (options.filter != null && options.filter.filters != null && options.filter.filters.length > 0)
                                {
                                    var filters = options.filter.filters;
                                    A2CGridExt.convertFilterDateToUTC(filters);
                                }
                                var data = JSON.stringify(options);
                                return data;
                            }
                        },
                        schema: { data: "SmartGridData", total: "TotalRecords" },
                        serverSorting: (this.Pageable === true && this.Sortable === true) ? true : false,
                        serverPaging: this.Pageable,
                        serverFiltering: (this.Pageable === true && this.Filterable === true) ? true : false,
                        error: function (e) {
                            displayAjaxError(e.xhr);
                        }
                        ,
                        pageSize: (this.Pageable === true)?20:undefined
                    },
                    selectable: this.Selectable,
                    reorderable: this.Reorderable,
                    resizable: this.Resizable,
                    sortable: (this.Sortable === true) ? {
                        mode: "single",
                        allowUnsort: true
                    } : this.Sortable,
                    pageable: (this.Pageable === true) ? {
                        refresh: false,                        
                        pageSizes: [20, 50, 100, 200, 300],
                        buttonCount: 3,
                        messages: {
                            display: "{0} to {1} of {2} items",
                            empty: "No items to display"
                        }
                    } : {
                        refresh: false,
                        info: true,
                        pageSizes: false,
                        previousNext: false,
                        numeric: false,
                        messages: {
                            display: "1 to {2} of {2} items",
                            empty: "No items to display"
                        }
                    },
                    filterable: this.Filterable,
                    groupable: this.Groupable,
                    columnMenu: this.ColumnMenu,
                    columns: this.Columns,
                    editable: this.Editable,
                    scrollable: this.Scrollable,
                    navigatable: this.Navigatable,
                    change: function (e) {
                        A2CGridExt.onChange(this);
                        A2CGridExt.onStateChang(this);
                    },
                    dataBound: function (e) {
                        /*Apply filtered class to header for column menu*/
                        var filter = this.dataSource.filter();
                        this.thead.find(".k-header-column-menu.k-state-active").removeClass("k-state-active");
                        if (this.lockedHeader != undefined)
                            this.lockedHeader.find(".k-header-column-menu.k-state-active").removeClass("k-state-active");
                        /* set previous page when last record is deleted on current page */
                        if (this.dataSource.view().length == 0) {
                            var currentPage = this.dataSource.page();
                            if (currentPage > 1) {
                                this.dataSource.page(currentPage - 1);
                            }
                        }
                        if (filter) {
                            var filteredMembers = {};
                            A2CGridExt.setFilteredMembers(filter, filteredMembers);
                            this.thead.find("th[data-field]").each(function () {
                                var cell = $(this);
                                var filtered = filteredMembers[cell.data("field")];
                                if (filtered) {
                                    cell.find(".k-header-column-menu").addClass("k-state-active").addClass("custom-color");
                                }
                            });
                            if (this.lockedHeader != undefined) {
                                this.lockedHeader.find("th[data-field]").each(function () {
                                    var cell = $(this);
                                    var filtered = filteredMembers[cell.data("field")];
                                    if (filtered) {
                                        cell.find(".k-header-column-menu").addClass("k-state-active").addClass("custom-color");
                                    }
                                });
                            }
                        }
                        
                        /*Ends here*/
                        A2CGridExt.dataBound(this);
                        A2CGridExt.onStateChang(this);
                    },
                    toolbar: A2CGridExt.toolbarTemplate.call(this, this.Advancefilter, this.Defaultfilter, this.Clearefilter, this.ToolBar),
                    autoResize: this.AutoResize,
                    autoBind: false,
                    detailInit: this.DetailInit,
                    excelExport: A2CGridExt.excelExport,
                    columnHide: function (e) {
                        A2CGridExt.onStateChang(this);
                    },
                    columnShow: function (e) {
                        A2CGridExt.onStateChang(this);
                    },
                    columnReorder: function (e) {
                        A2CGridExt.onStateChang(this);
                    },
                    columnResize: function (e) {
                        A2CGridExt.onStateChang(this);
                    },
                    columnLock: function (e) {
                        A2CGridExt.onStateChang(this);
                    },
                    columnUnlock: function (e) {
                        A2CGridExt.onStateChang(this);
                    },
                });

                /*Add this to kendo grid option*/
                $.extend(this.KendoGrid.data("kendoGrid").options, { A2CGrid: this });

                /*bind data chang event*/
                if (this.Editable) {
                    var A2CGrid = this;
                    this.KendoGrid.data("kendoGrid").dataSource.bind("change", function (e) {
                        A2CGridExt.onDataChange(A2CGrid, e);
                    })
                }

                /*Re-set last grid state*/
                try {
                    if (this.GridState != null && this.GridState.length > 0) {
                        var options = JSON.parse(this.GridState);
                        for (var i = 0; i < options.columns.length; i++) {
                            var item = options.columns[i];
                            var filterable = A2CGridExt.setFilterable(item.attributes["customType"]);
                            if(filterable!=undefined)
                                item.filterable = filterable;                            
                        }

                        if (options.dataSource.filter != null && options.dataSource.filter.filters != null)
                        {
                            var filterList = options.dataSource.filter.filters;
                            A2CGridExt.convertDateStringToDateType(filterList,options.columns)
                        }
                         
                        this.KendoGrid.data("kendoGrid").setOptions(options);
                    }
                } catch (error) {};

                /*Start binding data and html generation*/
                this.Refresh();

                /*Attache click event after grid renderd*/
                if (this.Advancefilter) {
                    var advOption = this.Advancefilter;
                    var allGridObj = this.AllFilterGridObject;
                    var mainKendoGrid = this;
                    $(".k-toolbar-manageadvancefilter", this.KendoGrid.toolbar).SelectAdvanceFilterNonETS(A2CGridExt.prepareSearchJson(advOption), mainKendoGrid);
                    var advCtrl = null;
                    $(".k-toolbar-advancefilter", this.KendoGrid.toolbar).click(function () {
                        advCtrl = $(this);
                        var mainCtrl = $(this).parent().find('#advContent');
                        mainCtrl.toggleClass('dnone');
                        if (mainCtrl.html().length == 0) {
                            $(window).resize(function () {
                                mainCtrl.addClass('dnone');
                            });

                            $(document).mouseup(function (e) {
                                if (!mainCtrl.is(e.target) && mainCtrl.has(e.target).length == 0 && !advCtrl.is(e.target) && advCtrl.has(e.target).length == 0 && $('.k-menu-vertical').has(e.target).length == 0) {
                                    mainCtrl.addClass('dnone');
                                    mainCtrl.addClass('doccall');
                                }
                            });
                        }
                        if (mainKendoGrid.RefreshAllAdvanceFitlerList) {
                            if (allGridObj == null) {
                                allGridObj = mainCtrl.A2CGrid({
                                    gridKey: 'MyAllList',
                                    url: '/AdvanceSearchSmart/GetAllFilterList',
                                    data: { loadGridType: "All", areaKey: advOption.searchAreaKey },
                                    advancefilter: false,
                                    selectable: 'single',
                                    clearefilter: false,
                                    autoResize: false,
                                    resizable: false,
                                    pageable: false,
                                    reorderable: false,
                                    filterable: true,
                                    onSelectCallBack: function (obj, x) {
                                        busyPageDiv();
                                        mainCtrl.addClass('dnone');
                                        mainKendoGrid.KendoGrid.find('.k-toolbar-clearfilter').show();
                                        postJSON('/AdvanceSearchSmart/GetFilterInformation', { filterId: obj.Selected()[0].SearchFilterID }, function (data) {
                                            var advanceSearchForNonEts = {
                                                "SearchIndex": data.SearchIndex,
                                                "SearchAttribute": data.SearchAttribute,
                                                "SearchField": data.SearchField,
                                                "SearchCondition": data.SearchCondition,
                                                "SearchValueList": data.SearchValueList,
                                                "SearchConditionText": data.SearchConditionText,
                                                "IsBlank": data.IsBlank,
                                                "SortOrder": data.SortOrder,
                                                "SortField": data.SortField,
                                                "ActionPath": mainKendoGrid.Advancefilter.actionPath,
                                                "ParentDiv": mainKendoGrid.Advancefilter.parentDivToRenderGrid,
                                                "SearchAreaKey": mainKendoGrid.Advancefilter.searchAreaKey
                                            };

                                            mainKendoGrid.RefreshWithSearch(advanceSearchForNonEts);
                                            mainKendoGrid.KendoGrid.find('.filtername').html('Applied Filter - ' + kendo.htmlEncode(obj.Selected()[0].FilterName));
                                            clearPageDiv();
                                        });
                                    },
                                    columns: [
                                         { field: "FilterName", title: "Filter Name", width: "35%" },
                                         { field: "Description", title: "Description" }
                                    ]
                                });
                                allGridObj.Render();
                                mainKendoGrid.AllFilterGridObject = mainCtrl;
                            }
                            else {
                                allGridObj.Refresh();
                                mainKendoGrid.AllFilterGridObject = mainCtrl;
                            }
                            mainKendoGrid.RefreshAllAdvanceFitlerList = false;
                            mainKendoGrid.AllFilterGridObject = mainCtrl;
                        }
                        mainCtrl.css('left', $(this).position().left - 600 + 33);
                    });
                }
                if (this.Defaultfilter) {
                    var A2CGrid = this;
                    $(".k-toolbar-defaultfilter", this.KendoGrid.toolbar).on("click", function () {
                    });
                }
                if (this.Clearefilter) {
                    var A2CGrid = this;
                    $(".k-toolbar-clearfilter", this.KendoGrid.toolbar).on("click", function () {
                        $(this).hide();
                        A2CGrid.ClearFilter();
                        $(this).parent().parent().find('.filtername').html('');
                    });
                }

                /*Bind auto resize*/
                if (this.AutoResize) {
                    A2CGridExt.autoResize(this);
                }

                bindTooltip();
                A2CGridExt.initializeTooltip(this.KendoGrid, ".k-td-customtooltip");
            },
            ClearFilter: function () {
                var filters = this.KendoGrid.data("kendoGrid").dataSource.filter();
                if (this.AdvanceSearchData || filters) {
                    this.AdvanceSearchData = false;
                    this.KendoGrid.data("kendoGrid").dataSource.filter({});
                    this.Refresh();
                   this.AllFilterGridObject.find('.k-state-selected').removeClass('k-state-selected');
                }
            },
            RefreshWithSearch: function (searchOption) {
                this.AdvanceSearchData = $.extend({}, searchOption);
                this.Refresh();
            },
            Refresh: function () {
                this.KendoGrid.data("kendoGrid").dataSource.read();
            },
            Options: function () {
                return this.KendoGrid.data("kendoGrid").options;
            },
            Selected: function () {
                var selectedItems = new Array();
                var entityGrid = this.KendoGrid.data("kendoGrid");
                var rows = entityGrid.select();

                rows.each(function (index, row) {
                    var selectedItem = entityGrid.dataItem(row);
                    selectedItems.push(selectedItem);
                });
                return selectedItems;
            },
            SelectedRowLength: function () {
                var entityGrid = this.KendoGrid.data("kendoGrid");
                var rows = entityGrid.select().length;
                return rows;
            },
            SetMaximizedMode: function (mode) {
                this.MaximizedMode = mode;
            },
            SetMaximizedModeForPopUp: function (mode) {
                if (mode != false) {
                    var entityGrid = this.KendoGrid.data("kendoGrid"),
                    maxRowCount = this.MaxRowCount,
                    autoResize = true,
                    maximizedMode = this.MaximizedMode,
                    gridElement = this.Parent,
                    dataArea = gridElement.find(".k-grid-content"),
                    originalSize = this.OriginalSize;
                    var rowCount = entityGrid.dataSource.view().length;
                    if (rowCount > 20)
                        gridElement.height(20 * rowHeightConst);
                    else
                        gridElement.height('auto');
                    dataArea.height('auto');

                }
            },
            Resize: function (flag) {

                var entityGrid = this.KendoGrid.data("kendoGrid"),
                    maxRowCount = this.MaxRowCount,
                    autoResize = this.AutoResize,
                    maximizedMode = this.MaximizedMode,
                    gridElement = this.Parent,
                    originalSize = this.OriginalSize;

                /*Auto resize grid in widget and on landing page*/
                if (maxRowCount > 0 || autoResize) {
                    var setGridHeight = function (flag) {
                        if (entityGrid == undefined)
                            return;

                        var rowCount = entityGrid.dataSource.view().length;

                        if (entityGrid.dataSource._group) {
                            if (entityGrid.dataSource._group.length > 0)
                                rowCount = rowCount + entityGrid.dataSource._pristineTotal;
                        }

                        dataArea = gridElement.find(".k-grid-content"),
                        otherElements = gridElement.children().not(".k-grid-content, .k-grid-content-locked"),
                        otherElementsHeight = 0;
                        otherElements.each(function () {
                            otherElementsHeight += $(this).outerHeight();
                        });

                        /* Check for split grid and decide for grid scroll*/
                        if (dataArea != undefined) {
                            if (dataArea.length > 1) {
                                overFlowScroll = dataArea[dataArea.length - 1].clientWidth < dataArea[dataArea.length - 1].scrollWidth;
                            }
                            else if (dataArea.length > 0) {
                                overFlowScroll = dataArea[0].clientWidth < dataArea[0].scrollWidth;
                            }
                            else
                                overFlowScroll = false;
                        }
                        else {
                            overFlowScroll = false;
                        }

                        if (flag) {
                            /*if maximized mode*/
                            var parentHeight = gridElement.height();
                            //Add 10px height to grid as kendo makes row of 35px for no records
                            var zeroRecordsLead = 0;

                            if (originalSize.height <= 0) {
                                originalSize.height = parentHeight;
                            }
                            else {
                                parentHeight = originalSize.height;
                            }

                            if (rowCount <= 1) {
                                rowCount = 1;
                                zeroRecordsLead = 10;
                            }
                            var rowHeight = (rowCount * rowHeightConst) + otherElementsHeight + (overFlowScroll ? 19 : 0) + zeroRecordsLead;
                            if (rowHeight <= parentHeight) {
                                gridElement.height(rowHeight);
                            }
                            else {
                                gridElement.height(parentHeight);
                            }
                        }
                        else {
                            /*Widget default mode*/
                            //Add 10px height to grid as kendo makes row of 35px for no records
                            var zeroRecordsLead = 0;
                            if (rowCount >= maxRowCount) {
                                rowCount = maxRowCount;
                            }
                            else if (rowCount <= 1) {
                                rowCount = 1;
                                zeroRecordsLead = 10;
                            }
                            gridElement.height((rowCount * rowHeightConst) + otherElementsHeight + (overFlowScroll ? 19 : 0) + zeroRecordsLead);
                        }
                    }

                    if (maxRowCount > 0 && !maximizedMode) {
                        setGridHeight(false);
                    }
                    else if (maximizedMode || autoResize) {
                        setGridHeight(true);
                    }
                }
                if (entityGrid) {
                    entityGrid.resize();
                }
            },
            GetData: function (callback) {
                var dataSource = this.KendoGrid.data("kendoGrid").dataSource;
                $.each(dataSource.view(), callback);
            },
            Destroy: function () {
                var entityGrid = this.KendoGrid.data("kendoGrid");
                if (entityGrid) {
                    entityGrid.destroy();
                }
                this.KendoGrid.empty();
                this.KendoGrid = {};
                this.Columns = [];
                this.DataSource = false;
            },
            Export: function (flag) {
                var kGrid = this.KendoGrid.data("kendoGrid");
                if (flag === 0 || flag === 1) //0 - Export to current page to excel or 1 - Export to all rows to excel
                {
                    if (flag === 1) {
                        var totalRecords = kGrid.dataSource.total();
                        if (totalRecords > 2500) {
                            getAjaxError(JSON.stringify({ Message: 'A maximum of 2500 rows can be exported, please filter the data to reduce the amount of rows returned.' }));
                            return;
                        }
                    }
                    //Show busy div icon, refer 'excelExport' option to hide busy div icon
                    busyPageDiv();

                    //var tmpDate = new Date();
                    //var filenameExtend = (tmpDate.getDate() <= 9 ? '0' + tmpDate.getDate() : tmpDate.getDate()) + '' + ((tmpDate.getMonth() + 1) <= 9 ? '0' + (tmpDate.getMonth() + 1) : (tmpDate.getMonth() + 1)) + '' + tmpDate.getFullYear();

                    var exportOption = {
                        fileName: (this.ExportOption && this.ExportOption.fileName) ? this.ExportOption.fileName + '.xlsx' : "Progresso.xlsx",
                        proxyURL: "/proxy",
                        filterable: true,
                        allPages: flag === 1 ? true : false
                    };
                    $.extend(kGrid.options.excel, exportOption);
                    kGrid.saveAsExcel();
                }
            },
            setOptions: function (options) {
                this.KendoGrid.data("kendoGrid").setOptions(JSON.parse(options));
            },
            getOptions: function ()
            {
                return JSON.stringify(this.KendoGrid.data("kendoGrid").getOptions());
            },            
            ClearSortFilter:function()
            {
                //explicitly reset radio buttons (A2C-742)                
                $("input:radio[name='filters[0].value']").each(function (i) {
                    this.checked = false;
                });

                this.KendoGrid.data("kendoGrid").dataSource.query({
                    page: 1,
                    pageSize: 20,
                    sort: {                        
                    },
                    filter: [                        
                    ]
                });
            }            
        }
    });
})(jQuery);


