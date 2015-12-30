var grid;
$(this.document).ready(function () {
    grid = $("#grid").A2CGrid({
        gridKey: 'QEAvailibilityGrid',
        url: '/Catalogue/GetQEAvailability',
        data: function () {          
            return {
                qualificationElementId: 4838,
                awardingOrganisationCentreId: 1020
            }
        },
        pageable: true,
        Sortable: true,
        filterable: true,
        clearefilter: true,
        scrollable: true,
        selectable: "multiple",
        autoResize: true,
        columns: [
                { field: "QeaEffectiveStartDateTime", title: QEAvalibilityQeaEffectiveStartDateTimeTitle, tooltip: QEAvalibilityQeaEffectiveStartDateTime, type: "date", width: "17%", format: javaScriptDateTimeFormat },
                { field: "QeaEffectiveEndDateTime", title: QEAvalibilityQeaEffectiveEndDateTimeTitle, tooltip: QEAvalibilityQeaEffectiveEndDateTime, type: "date", width: "18%", format: javaScriptDateTimeFormat },
                { field: "SeriesLabel", title: QEAvailibilitySeriesLabelTitle, tooltip: QEAvailibilitySeriesLabel, type: "string", width: "20%" },
                { field: "SlaOnDemandResultClndrDays", title: QEAvalibilitySlaOnDemandResultClndrDaysTitle, tooltip: QEAvalibilitySlaOnDemandResultClndrDays, type: "number", width: "15%" },
                { field: "OnDemandEntryCalendarDays", title: QEAvailibilityOnDemandEntryCalendarDaysTitle, tooltip: QEAvailibilityOnDemandEntryCalendarDays, type: "number", width: "30%" }
        ]
    });
    grid.Render();
});