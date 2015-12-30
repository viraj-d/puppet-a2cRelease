//Load grid data
function GetSchemes() {
    $('#lblSelectedScheme').text(selectText + ' ' + schemeRT);
    selectedSchemeSeriesLable = $('#seriesLable').val();
    selectedSchemaqulificationType = $('#qulificationType').val();
    if (!schemeGrid) {
        schemeGrid = $("#schemeGrid").A2CGrid({
            gridKey: 'schemeGrid',
            url: '/Catalogue/GetSchemeList',
            data: function () {
                busyDiv();
                HideandDestroyAllChildTab('Scheme', 'lblSelectedScheme', schemeRT);
                var schemeDto = {
                    awardingOrganisationCentreId: aoCentreId, qualificationType: selectedSchemaqulificationType, seriesLabel: selectedSchemeSeriesLable,
                    searchTextValue: searchTextValue, searchPCDetailsForColumn: searchPCDetailsForColumn
                };
                return schemeDto
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            onSelectCallBack: GetSelectedRowDetailOfSchemeGrid,
            selectable: "single",
            autoResize: false,
            maxRowCount: 10,
            dataBound: function () {
                clearDiv();
            },
            columns: [
                        { field: "AoqeId", title: AoqeIdRT, tooltip: AoqeIdRT, type: "string", width: "210px", locked: true, lockable: false },
                        { field: "QEShortTitle", title: QEShortTitleRT, tooltip: QEShortTitleRT, type: "string", width: "250px", locked: true },
                        { field: "QEDescription", title: QEDescriptionRT, tooltip: QEDescriptionRT, type: "string", width: "250px", hidden: true, lockable: false },
                        { field: "QETitle", title: QualificationElementTitleRT, tooltip: QualificationElementTitleRT, type: "string", width: "250px", hidden: true, lockable: false },
                        { field: "QEEffectiveVersionDate", title: QEEffectiveVersionDateRT, tooltip: QEEffectiveVersionDateRT, type: "date", width: "200px", hidden: true, lockable: false },
                        { field: "QEEffectiveVersionEndDate", title: QEEffectiveVersionEndDateRT, tooltip: QEEffectiveVersionEndDateRT, type: "date", width: "215px", hidden: true, lockable: false },
                        { field: "PrivateLearnerType", title: PrivateLearnerTypeRT, tooltip: PrivateLearnerTypeRT, type: "string", width: "200px", hidden: true, lockable: false },
                        { field: "QEModerationType", title: QEModerationTypeRT, tooltip: QEModerationTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                        { field: "FirstLanguageRequired", title: IsFirstLanguageRequiredRT, tooltip: IsFirstLanguageRequiredRT, type: "boolean", width: "190px", hidden: true, lockable: false },
                        //{ field: "RecordDeleted", title: IsRecordDeletedRT, tooltip: IsRecordDeletedRT, type: "boolean", width: "150px", hidden: true, lockable: false },
                        { field: "QualificationReferenceNumber", title: QualificationReferenceNumberRT, tooltip: QualificationReferenceNumberRT, type: "string", width: "250px", hidden: true, lockable: false },
                        { field: "LearningAimCode", title: LearningAimCodeRT, tooltip: LearningAimCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                        { field: "QEAdminCode", title: QEAdminCodeRT, tooltip: QEAdminCodeRT, type: "string", width: "250px", hidden: true, lockable: false },

                        { field: "QualificationType", title: QualificationTypeRT, tooltip: QualificationTypeRT, type: "string", width: "240px", lockable: false },
                        { field: "SeriesBased", title: SeriesBasedRT, tooltip: SeriesBasedRT, type: "boolean", width: "130px", lockable: false },
                        { field: "QEAvailabilityText", title: QEAvailabilityTextRT, tooltip: QEAvailabilityTextRT, type: "string", width: "395px", lockable: false },
                        { field: "AssessmentMaxLearnerAge", title: AssessmentMaxLearnerAgeRT, tooltip: AssessmentMaxLearnerAgeRT, type: "number", width: "210px", hidden: true, lockable: false },
                        { field: "AssessmentMinLearnerAge", title: AssessmentMinLearnerAgeRT, tooltip: AssessmentMinLearnerAgeRT, type: "number", width: "210px", hidden: true, lockable: false },
                        { field: "FirstTeachingDate", title: FirstTeachingDateRT, tooltip: FirstTeachingDateRT, type: "date", width: "160px", hidden: true, lockable: false },
                        { field: "LastTeachingDate", title: LastTeachingDateRT, tooltip: LastTeachingDateRT, type: "date", width: "160px", hidden: true, lockable: false },
                        { field: "QECentreAuthenticationAgreementText", title: QECentreAuthenticationAgreementTextRT, tooltip: QECentreAuthenticationAgreementTextRT, type: "string", width: "250px", hidden: true, lockable: false },
                        { field: "DateOfBirthRequired", title: DateOfBirthRequiredRT, tooltip: DateOfBirthRequiredRT, type: "boolean", width: "180px", hidden: true, lockable: false },
                        { field: "LegalSexRequired", title: LegalSexRequiredRT, tooltip: LegalSexRequiredRT, type: "boolean", width: "160px", hidden: true, lockable: false },
            ]
        });
        schemeGrid.Render();
    }
    else {
        schemeGrid.ClearSortFilter();
    }
    if ($('#schemeGrid').is(':hidden'))
        $("#schemeGrid").show();
}

function GetAwards() {
    $('#lblSelectedAward').text(selectText + ' ' + awardRT);
    selectedAwardSeriesLable = $('#seriesLableAward').val();
    selectedSeriesAwardType = $('#seriesLableAwardType').val();
    if (!awardGrid) {
        awardGrid = $("#awardGrid").A2CGrid({
            gridKey: 'awardGrid',
            url: '/Catalogue/GetAwardList',
            data: function () {
                busyDiv();
                HideandDestroyAllChildTab('Award', 'lblSelectedAward', awardRT);
                var schemeDto = {
                    awardingOrganisationCentreId: aoCentreId, seriesLabel: selectedAwardSeriesLable, awardType: selectedSeriesAwardType,
                    searchTextValue: searchTextValue, searchPCDetailsForColumn: searchPCDetailsForColumn
                };
                return schemeDto
            },
            pageable: true,
            Sortable: true,
            onSelectCallBack: GetSelectedRowDetailOfAwardGrid,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'row',
            autoResize: false,
            maxRowCount: 10,
            dataBound: function () {
                clearDiv();
            },
            columns: [
                         { field: "AoqeId", title: AoqeIdRT, tooltip: AoqeIdRT, type: "string", width: "210px", locked: true, lockable: false },
                         { field: "QEShortTitle", title: QEShortTitleRT, tooltip: QEShortTitleRT, type: "string", width: "215px", locked: true },
                         { field: "AwardLevelType", title: AwardLevelTypeRT, tooltip: AwardLevelTypeRT, type: "string", width: "190px", lockable: false },
                         { field: "AwardType", title: AwardTypeRT, tooltip: AwardTypeRT, type: "string", width: "190px", lockable: false },
                         { field: "ResitRuleText", title: ResitRuleTextRT, tooltip: ResitRuleTextRT, type: "string", width: "420px", lockable: false },

                         { field: "QEDescription", title: QEDescriptionRT, tooltip: QEDescriptionRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QualificationElementTitle", title: QualificationElementTitleRT, tooltip: QualificationElementTitleRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEEffectiveVersionDate", title: QEEffectiveVersionDateRT, tooltip: QEEffectiveVersionDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "QEEffectiveVersionEndDate", title: QEEffectiveVersionEndDateRT, tooltip: QEEffectiveVersionEndDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "PrivateLearnerType", title: PrivateLearnerTypeRT, tooltip: PrivateLearnerTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEModerationType", title: QEModerationTypeRT, tooltip: QEModerationTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "IsFirstLanguageRequired", title: IsFirstLanguageRequiredRT, tooltip: IsFirstLanguageRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         //{ field: "IsRecordDeleted", title: IsRecordDeletedRT, tooltip: IsRecordDeletedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "QualificationReferenceNumber", title: QualificationReferenceNumberRT, tooltip: QualificationReferenceNumberRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "LearningAimCode", title: LearningAimCodeRT, tooltip: LearningAimCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEAdminCode", title: QEAdminCodeRT, tooltip: QEAdminCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "AccreditationEndReviewDate", title: AccreditationEndReviewDateRT, tooltip: AccreditationEndReviewDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "AccreditationStartDate", title: AccreditationStartDateRT, tooltip: AccreditationStartDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "AOAccredVersionNumber", title: AOAccredVersionNumberRT, tooltip: AOAccredVersionNumberRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "AssessmentLanguageType", title: AssessmentLanguageTypeRT, tooltip: AssessmentLanguageTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "IsCertificateOfUnitCreditIssued", title: IsCertificateOfUnitCreditIssuedRT, tooltip: IsCertificateOfUnitCreditIssuedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "CertificationEndDate", title: CertificationEndDateRT, tooltip: CertificationEndDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "CertificationStartDate", title: CertificationStartDateRT, tooltip: CertificationStartDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "IsContributingUnitsListed", title: IsContributingUnitsListedRT, tooltip: IsContributingUnitsListedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "CourseLengthType", title: CourseLengthTypeRT, tooltip: CourseLengthTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "IsEndorsedTitleRequired", title: IsEndorsedTitleRequiredRT, tooltip: IsEndorsedTitleRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "GuidedLearningHoursMax", title: GuidedLearningHoursMaxRT, tooltip: GuidedLearningHoursMaxRT, type: "number", width: "250px", hidden: true, lockable: false },
                         { field: "GuidedLearningHoursMin", title: GuidedLearningHoursMinRT, tooltip: GuidedLearningHoursMinRT, type: "number", width: "250px", hidden: true, lockable: false },
                         { field: "OperationalEndDate", title: OperationalEndDateRT, tooltip: OperationalEndDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "OperationalStartDate", title: OperationalStartDateRT, tooltip: OperationalStartDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "QEDeliveryModelType", title: QEDeliveryModelTypeRT, tooltip: QEDeliveryModelTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "IsQEEvidenceRequirementProvided", title: IsQEEvidenceRequirementProvidedRT, tooltip: IsQEEvidenceRequirementProvidedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "QEEvidenceRequirementType", title: QEEvidenceRequirementTypeRT, tooltip: QEEvidenceRequirementTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "RegistrationExpiryMonth", title: RegistrationExpiryMonthRT, tooltip: RegistrationExpiryMonthRT, type: "number", width: "250px", hidden: true, lockable: false },
                         { field: "IsStatementOfCreditIssued", title: IsStatementOfCreditIssuedRT, tooltip: IsStatementOfCreditIssuedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "StudyGuideAvailableType", title: StudyGuideAvailableTypeRT, tooltip: StudyGuideAvailableTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "StudyGuideDetails", title: StudyGuideDetailsRT, tooltip: StudyGuideDetailsRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "StudyGuideReference", title: StudyGuideReferenceRT, tooltip: StudyGuideReferenceRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "StudyGuideReferenceType", title: StudyGuideReferenceTypeRT, tooltip: StudyGuideReferenceTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEClassification", title: QEClassificationRT, tooltip: QEClassificationRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "PartyIdAccreditor", title: PartyIdAccreditorRT, tooltip: PartyIdAccreditorRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "PartyIdSectorLead", title: PartyIdSectorLeadRT, tooltip: PartyIdSectorLeadRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "PartyRoleTypeAssessor", title: PartyRoleTypeAssessorRT, tooltip: PartyRoleTypeAssessorRT, type: "string", width: "250px", hidden: true, lockable: false }

            ]
        });
        awardGrid.Render();
    }
    else {
        awardGrid.ClearSortFilter();
    }
    if ($('#awardGrid').is(':hidden'))
        $("#awardGrid").show();
}

function GetLearningUnits() {
    $('#lblSelectedLearningUnit').text(selectText + ' ' + learningUnitRT);
    selectedLearningUnitSeriesLable = $('#seriesLableLearningUnit').val();
    if (!learningUnitGrid) {
        learningUnitGrid = $("#learningUnitGrid").A2CGrid({
            gridKey: 'learningUnitGrid',
            url: '/Catalogue/GetLearningUnitList',
            data: function () {
                busyDiv();
                HideandDestroyAllChildTab('LearningUnit', 'lblSelectedLearningUnit', learningUnitRT);
                var learningUnitDto = {
                    awardingOrganisationCentreId: aoCentreId, seriesLabel: selectedLearningUnitSeriesLable,
                    searchTextValue: searchTextValue, searchPCDetailsForColumn: searchPCDetailsForColumn
                };
                return learningUnitDto
            },
            pageable: true,
            Sortable: true,
            onSelectCallBack: GetSelectedRowDetailOfLearningUnitGrid,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            dataBound: function () {
                clearDiv();
            },
            columns: [
                         { field: "AoqeId", title: AoqeIdRT, tooltip: AoqeIdRT, type: "string", width: "210px", locked: true, lockable: false },
                         { field: "QEShortTitle", title: QEShortTitleRT, tooltip: QEShortTitleRT, type: "string", width: "580px", locked: true },
                         { field: "LearningUnitLevelType", title: LearningUnitLevelTypeRT, tooltip: LearningUnitLevelTypeRT, type: "string", width: "215px", lockable: false },
                         { field: "MaximumResitsAllowed", title: MaximumResitsAllowedRT, tooltip: MaximumResitsAllowedRT, type: "number", width: "215px", lockable: false },

                         { field: "QEDescription", title: QEDescriptionRT, tooltip: QEDescriptionRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QualificationElementTitle", title: QualificationElementTitleRT, tooltip: QualificationElementTitleRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEEffectiveVersionDate", title: QEEffectiveVersionDateRT, tooltip: QEEffectiveVersionDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "QEEffectiveVersionEndDate", title: QEEffectiveVersionEndDateRT, tooltip: QEEffectiveVersionEndDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "PrivateLearnerType", title: PrivateLearnerTypeRT, tooltip: PrivateLearnerTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEModerationType", title: QEModerationTypeRT, tooltip: QEModerationTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "IsFirstLanguageRequired", title: IsFirstLanguageRequiredRT, tooltip: IsFirstLanguageRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         //{ field: "IsRecordDeleted", title: IsRecordDeletedRT, tooltip: IsRecordDeletedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "QualificationReferenceNumber", title: QualificationReferenceNumberRT, tooltip: QualificationReferenceNumberRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "LearningAimCode", title: LearningAimCodeRT, tooltip: LearningAimCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEAdminCode", title: QEAdminCodeRT, tooltip: QEAdminCodeRT, type: "string", width: "250px", hidden: true, lockable: false }
            ]
        });
        learningUnitGrid.Render();
    }
    else {
        learningUnitGrid.ClearSortFilter();
    }
    if ($('#learningUnitGrid').is(':hidden'))
        $("#learningUnitGrid").show();
}

function GetQEAvailibilityList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEAvailability',
            data: function () {
                HideandDestroyAllLeve3ChildTab(object.parentQEType);
                return {
                    qualificationElementId: object.qualificationElementId,
                    awardingOrganisationCentreId: aoCentreId,
                    seriesLabel: object.seriesLabel
                }
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            maxRowCount: 10,
            onSelectCallBack:
                function () { GetSelectedRowDetailOfQEAvailibilityGrid(object) },
            columns: [
                    { field: "QeaEffectiveStartDateTime", title: QEAvalibilityQeaEffectiveStartDateTimeTitle, tooltip: QEAvalibilityQeaEffectiveStartDateTime, type: "date", width: "25%", format: javaScriptDateTimeFormat },
                    { field: "QeaEffectiveEndDateTime", title: QEAvalibilityQeaEffectiveEndDateTimeTitle, tooltip: QEAvalibilityQeaEffectiveEndDateTime, type: "date", width: "25%", format: javaScriptDateTimeFormat },
                    { field: "SeriesLabel", title: QEAvailibilitySeriesLabelTitle, tooltip: QEAvailibilitySeriesLabel, type: "string", width: "50%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetQEGradeBoundaryList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEGradeBoundary',
            data: function () {
                return {
                    qualificationElementId: object.qualificationElementId,
                    awardingOrganisationCentreId: aoCentreId,
                    availabilityId: object.availabilityId
                }
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            maxRowCount: 10,
            columns: [
                    { field: "QEOutcomeValueType", title: OutcomeRT, tooltip: OutcomeRT, type: "string", width: "34%" },
                    { field: "QEGrade", title: GradeTitle, tooltip: GradeTitle, type: "string", width: "33%" },
                    { field: "GradeBoundaryLowerLimit", title: LowerLimitTitle, tooltip: LowerLimitTitle, type: "number", width: "33%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetQEMaximumMarksList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEMaximumMarks',
            data: function () {
                return {
                    qualificationElementId: object.qualificationElementId,
                    awardingOrganisationCentreId: aoCentreId,
                    availabilityId: object.availabilityId
                }
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            maxRowCount: 10,
            columns: [                   
                    { field: "QEOutcomeValueType", title: OutcomeValueType, tooltip: OutcomeValueType, type: "string", width: "50%" },
                    { field: "QEAvailabilityMaximumMark", title: MaximumMarksTitle, tooltip: MaximumMarksTitle, type: "number", width: "50%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetQEKeyEventList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEAvailabilityKeyEvent',
            data: function () {
                return {
                    qualificationElementId: object.qualificationElementId,
                    awardingOrganisationCentreId: aoCentreId,
                    availabilityId: object.availabilityId
                }
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            maxRowCount: 10,
            columns: [                    
                    { field: "KeyEventName", title: KeyEventName, tooltip: KeyEventName, type: "string", width: "20%" },
                    { field: "KeyEventStartDateTime", title: KeyEventStartDateTime, tooltip: KeyEventStartDateTime, type: "date", width: "15%", format: javaScriptDateTimeFormat },
                    { field: "KeyEventEndDateTime", title: KeyEventEndDateTime, tooltip: KeyEventEndDateTime, type: "date", width: "15%", format: javaScriptDateTimeFormat },
                    { field: "TimePeriodType", title: TimePeriodType, tooltip: TimePeriodType, type: "string", width: "15%" },
                    { field: "KeyEventAdditionalText", title: KeyEventAdditionalText, tooltip: KeyEventAdditionalText, type: "string", width: "35%" }                    
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetQEKeyEventFeeList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEAvailabilityKeyEventFee',
            data: function () {
                return {
                    qualificationElementId: object.qualificationElementId,
                    awardingOrganisationCentreId: aoCentreId,
                    availabilityId: object.availabilityId
                }
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "single",
            autoResize: true,
            maxRowCount: 10,
            columns: [                    
                    { field: "KeyEventName", title: KeyEventName, tooltip: KeyEventName, type: "string", width: "19%" },                                        
                    { field: "FeePeriodStartDateTime", title: FeePeriodStartDateTime, tooltip: FeePeriodStartDateTime, type: "date", width: "15%", format: javaScriptDateTimeFormat },
                    { field: "FeePeriodEndDateTime", title: FeePeriodEndDateTime, tooltip: FeePeriodEndDateTime, type: "date", width: "15%", format: javaScriptDateTimeFormat },
                    { field: "FeeAmount", title: FeeAmount, tooltip: FeeAmount, type: "number", width: "10%" },
                    { field: "QEFeeCategoryType", title: QEFeeCategoryType, tooltip: QEFeeCategoryType, type: "string", width: "14%" },
                    { field: "FeePeriodTitle", title: FeePeriodTitle, tooltip: FeePeriodTitle, type: "string", width: "12%" },
                    { field: "FeeAdditionalText", title: FeeAdditionalText, tooltip: FeeAdditionalText, type: "string", width: "15%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetAssessables() {
    $('#lblSelectedAssessable').text(selectText + ' ' + assessableRT);
    selectedAssessableSeriesLable = $('#seriesLableAssessable').val();
    if (!assessableGrid) {
        assessableGrid = $("#assessableGrid").A2CGrid({
            gridKey: 'assessableGrid',
            url: '/Catalogue/GetAssessableList',
            data: function () {
                busyDiv();
                HideandDestroyAllChildTab('Assessable', 'lblSelectedAssessable', assessableRT);
                var assessableDto = {
                    awardingOrganisationCentreId: aoCentreId, seriesLabel: selectedAssessableSeriesLable,
                    searchTextValue: searchTextValue, searchPCDetailsForColumn: searchPCDetailsForColumn
                };
                return assessableDto
            },
            pageable: true,
            Sortable: true,
            onSelectCallBack: GetSelectedRowDetailOfAssessableGrid,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            dataBound: function () {
                clearDiv();
            },
            columns: [
                         { field: "AoqeId", title: AoqeIdRT, tooltip: AoqeIdRT, type: "string", width: "210px", locked: true, lockable: false },
                         { field: "QEShortTitle", title: QEShortTitleRT, tooltip: QEShortTitleRT, type: "string", width: "390px", locked: true },
                         { field: "AssessmentMethodType", title: AssessmentMethodTypeRT, tooltip: AssessmentMethodTypeRT, type: "string", width: "200px", lockable: false },
                         { field: "OnDemand", title: OnDemandRT, tooltip: OnDemandRT, type: "boolean", width: "210px", lockable: false },
                         { field: "QETimetabled", title: QETimetabledRT, tooltip: QETimetabledRT, type: "boolean", width: "215px", lockable: false },

                         { field: "QEDescription", title: QEDescriptionRT, tooltip: QEDescriptionRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QualificationElementTitle", title: QualificationElementTitleRT, tooltip: QualificationElementTitleRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEEffectiveVersionDate", title: QEEffectiveVersionDateRT, tooltip: QEEffectiveVersionDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "QEEffectiveVersionEndDate", title: QEEffectiveVersionEndDateRT, tooltip: QEEffectiveVersionEndDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                         { field: "PrivateLearnerType", title: PrivateLearnerTypeRT, tooltip: PrivateLearnerTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEModerationType", title: QEModerationTypeRT, tooltip: QEModerationTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "IsFirstLanguageRequired", title: IsFirstLanguageRequiredRT, tooltip: IsFirstLanguageRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         //{ field: "IsRecordDeleted", title: IsRecordDeletedRT, tooltip: IsRecordDeletedRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "QualificationReferenceNumber", title: QualificationReferenceNumberRT, tooltip: QualificationReferenceNumberRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "LearningAimCode", title: LearningAimCodeRT, tooltip: LearningAimCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "QEAdminCode", title: QEAdminCodeRT, tooltip: QEAdminCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "ExtraTimeRequired", title: ExtraTimeRequiredRT, tooltip: ExtraTimeRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "AssessmentActualDateTimeRequired", title: AssessmentActualDateTimeRequiredRT, tooltip: AssessmentActualDateTimeRequiredRT, type: "boolean", width: "280px", hidden: true, lockable: false },
                         { field: "AttendanceDataRequired", title: AttendanceDataRequiredRT, tooltip: AttendanceDataRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "CambridgeAssessmentTimeZoneNumber", title: CambridgeAssessmentTimeZoneNumberRT, tooltip: CambridgeAssessmentTimeZoneNumberRT, type: "number", width: "270px", hidden: true, lockable: false },
                         { field: "CarryForwardPermissible", title: CarryForwardPermissibleRT, tooltip: CarryForwardPermissibleRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "MaximumExtraTimeMinutes", title: MaximumExtraTimeMinutesRT, tooltip: MaximumExtraTimeMinutesRT, type: "number", width: "250px", hidden: true, lockable: false },
                         { field: "TestDayPhotographRequired", title: TestDayPhotographRequiredRT, tooltip: TestDayPhotographRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                         { field: "TierLevelType", title: TierLevelTypeRT, tooltip: TierLevelTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "TierLevelCommonReference", title: TierLevelCommonReferenceRT, tooltip: TierLevelCommonReferenceRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "TimeAllowedMinutes", title: TimeAllowedMinutesRT, tooltip: TimeAllowedMinutesRT, type: "number", width: "250px", hidden: true, lockable: false },
                         { field: "PartyRoleTypeAssessor", title: PartyRoleTypeAssessorRT, tooltip: PartyRoleTypeAssessorRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "PartyRoleTypeAdditionalDecider", title: PartyRoleTypeAdditionalDeciderRT, tooltip: PartyRoleTypeAdditionalDeciderRT, type: "string", width: "250px", hidden: true, lockable: false },
                         { field: "AssessmentMediumType", title: AssessmentMediumTypeRT, tooltip: AssessmentMediumTypeRT, type: "string", width: "250px", hidden: true, lockable: false }
            ]
        });
        assessableGrid.Render();
    }
    else {
        assessableGrid.ClearSortFilter();
    }
    if ($('#assessableGrid').is(':hidden'))
        $("#assessableGrid").show();
}

function GetQEForPathway() {    
    selectedPathwaySeriesLable = $('#seriesLablePathway').val();
    if (!qePathwayGrid) {
        qePathwayGrid = $("#qePathwayGrid").A2CGrid({
            gridKey: 'qePathwayGrid',
            url: '/Catalogue/GetQEForPathway',
            data: function () {
                busyDiv();
                HideandDestroyAllChildTab('Pathway', 'lblSelectedPathway', qaulificationElementForPathwayRT);               
                var qEForPathwayDto = {
                    awardingOrganisationCentreId: aoCentreId, seriesLabel: selectedPathwaySeriesLable,
                    searchTextValue: searchTextValue, searchPCDetailsForColumn: searchPCDetailsForColumn
                };
                return qEForPathwayDto
            },
            pageable: true,
            Sortable: true,
            onSelectCallBack: GetSelectedRowDetailOfQEPathwayGrid,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            dataBound: function () {
                clearDiv();
            },
            columns: [
                { field: "AoqeId", title: AoqeIdRT, tooltip: AoqeIdRT, type: "string", width: "270px", locked: true, lockable: false },
                { field: "QEShortTitle", title: QEShortTitleRT, tooltip: QEShortTitleRT, type: "string", width: "505px", locked: true, lockable: true },
                { field: "MaximumUnitSelection", title: MaximumUnitSelection, tooltip: MaximumUnitSelection, type: "number", width: "225px", lockable: false },
                { field: "MinimumUnitSelection", title: MinimumUnitSelection, tooltip: MinimumUnitSelection, type: "number", width: "225px", lockable: false },

                { field: "QEDescription", title: QEDescriptionRT, tooltip: QEDescriptionRT, type: "string", width: "250px", hidden: true, lockable: false },
                { field: "QualificationElementTitle", title: QualificationElementTitleRT, tooltip: QualificationElementTitleRT, type: "string", width: "250px", hidden: true, lockable: false },
                { field: "QEEffectiveVersionDate", title: QEEffectiveVersionDateRT, tooltip: QEEffectiveVersionDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                { field: "QEEffectiveVersionEndDate", title: QEEffectiveVersionEndDateRT, tooltip: QEEffectiveVersionEndDateRT, type: "date", width: "250px", hidden: true, lockable: false },
                { field: "PrivateLearnerType", title: PrivateLearnerTypeRT, tooltip: PrivateLearnerTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                { field: "QEModerationType", title: QEModerationTypeRT, tooltip: QEModerationTypeRT, type: "string", width: "250px", hidden: true, lockable: false },
                { field: "IsFirstLanguageRequired", title: IsFirstLanguageRequiredRT, tooltip: IsFirstLanguageRequiredRT, type: "boolean", width: "250px", hidden: true, lockable: false },
                { field: "QualificationReferenceNumber", title: QualificationReferenceNumberRT, tooltip: QualificationReferenceNumberRT, type: "string", width: "250px", hidden: true, lockable: false },
                { field: "QEAdminCode", title: QEAdminCodeRT, tooltip: QEAdminCodeRT, type: "string", width: "250px", hidden: true, lockable: false },
                { field: "LearningAimCode", title: LearningAimCodeRT, tooltip: LearningAimCodeRT, type: "string", width: "250px", hidden: true, lockable: false },

                { field: "EqualsIndicator", title: EqualsIndicatorFlag, tooltip: EqualsIndicatorFlag, type: "boolean", width: "200px", hidden: true, lockable: false },
                { field: "MandatoryInGroup", title: MandatoryInGroupFlag, tooltip: MandatoryInGroupFlag, type: "boolean", width: "200px", hidden: true, lockable: false },
                { field: "MinimumPathwaySelection", title: MinimumPathwaySelection, tooltip: MinimumPathwaySelection, type: "number", width: "210px", hidden: true, lockable: false },
                { field: "MaximumPathwaySelection", title: MaximumPathwaySelection, tooltip: MaximumPathwaySelection, type: "number", width: "215px", hidden: true, lockable: false },
                { field: "MinimumCreditValue", title: MinimumCreditValue, tooltip: MinimumCreditValue, type: "number", width: "200px", hidden: true, lockable: false }
            ]
        });

        qePathwayGrid.Render();
    }
    else {
        qePathwayGrid.ClearSortFilter();
    }

    if ($('#qePathwayGrid').is(':hidden'))
        $("#qePathwayGrid").show();
}

function GetQERelationshipList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQERelationshipList',
            data: function () {
                var qeRelationshipDto = { awardingOrganisationCentreId: aoCentreId, qeParentId: object.qualificationElementId };
                return qeRelationshipDto
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            columns: [
                        { field: "AoqeId", title: AoqeIdRT, tooltip: AoqeIdRT, type: "string", width: "20%" },
                        { field: "QEChildShortTitle", title: QEShortTitleRT, tooltip: QEShortTitleRT, type: "string", width: "25%" },
                        { field: "QualificationElementType", title: QualificationTypeRT, tooltip: QualificationTypeRT, type: "string", width: "21%" },
                        { field: "RelationshipType", title: RelationshipTypeRT, tooltip: RelationshipTypeRT, type: "string", width: "18%" },
                        { field: "RelationshipRuleType", title: RelationshipRuleTypeRT, tooltip: RelationshipRuleTypeRT, type: "string", width: "18%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetQEPreferenceList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEPreferenceList',
            data: function () {
                var qeRelationshipDto = { awardingOrganisationCentreId: aoCentreId, qeParentId: object.qualificationElementId };
                return qeRelationshipDto
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            columns: [
                        //{ field: "QEPartyIdCreator", title: QEPartyIdCreatorRT, tooltip: QEPartyIdCreatorRT, type: "string", width: "40%" },
                        { field: "QEPreference", title: QEPreferenceRT, tooltip: QEPreferenceRT, type: "string", width: "99%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function GetQELearnerIdentifierList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQELearnerIdentifierList',
            data: function () {
                var qeRelationshipDto = { awardingOrganisationCentreId: aoCentreId, qeParentId: object.qualificationElementId };
                return qeRelationshipDto
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            columns: [
                        { field: "QEPartyRRReferenceType", title: QEPartyRRReferenceTypeRT, tooltip: QEPartyRRReferenceTypeRT, type: "string", width: "70%" },
                        { field: "QELearnerIdMandatory", title: QELearnerIdMandatoryRT, tooltip: QELearnerIdMandatoryRT, type: "boolean", width: "30%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}
//Grid row selected event
function GetSelectedRowDetailOfAwardGrid() {
    var rows = awardGrid.Selected();
    if (rows.length > 0) {

        var id = rows[0].AoqeId;
        var title = rows[0].QEShortTitle;
        parentQEIdAward = rows[0].QualificationElementId;
        if (id == null)
            id = ' ';
        if (title == null)
            title = ' ';
        var innerHtmlScheme = AoqeIdRT + ': <b>' + id + '</b> ' + QEShortTitleRT + ': <b>' + title + '</b>';
        $('#lblSelectedAward').html(innerHtmlScheme);
        $("#pcDetailAwardTabView").show();
        $("#pcDetailLevel2TabViewAward").show();

        if (selectedLevel2QualificationDetailsTabForAward == null) {
            selectedLevel2QualificationDetailsTabForAward = "#dQualificationDetailsLevel2TabAward";
            $('#awardDetailLevel2ChildTab a[href="' + selectedLevel2QualificationDetailsTabForAward + '"]').tab('show');
        }
        if (selectedLevel2QualificationDetailsTabForAward.startsWith("#dQualificationDetailsLevel2Tab")) {
            if (selectedChildTabForAward == null) {
                selectedChildTabForAward = "#dGeneralTabAward";
                $('#awardChildTab a[href="' + selectedChildTabForAward + '"]').tab('show');
            }
            else
                PCDetailToLoad(selectedChildTabForAward);
        }
        else if (selectedLevel2QualificationDetailsTabForAward.startsWith("#dAvailabilityLevel2Tab")) {
            PCDetailToLoad(selectedLevel2QualificationDetailsTabForAward);
        }
        DisplayAwardGeneralDetails(rows[0]);
    }
}

function GetSelectedRowDetailOfSchemeGrid() {
    var rows = schemeGrid.Selected();
    if (rows.length > 0) {

        var id = rows[0].AoqeId;
        var title = rows[0].QEShortTitle;
        parentQEIdScheme = rows[0].QEId;

        if (id == null)
            id = ' ';
        if (title == null)
            title = ' ';
        var innerHtmlScheme = AoqeIdRT + ': <b>' + id + '</b> ' + QEShortTitleRT + ': <b>' + title + '</b>';
        $('#lblSelectedScheme').html(innerHtmlScheme);
        $("#pcDetailSchemeTabView").show();
        $("#pcDetailLevel2TabViewScheme").show();

        if (selectedLevel2QualificationDetailsTabForScheme == null) {
            selectedLevel2QualificationDetailsTabForScheme = "#dQualificationDetailsLevel2TabScheme";
            $('#schemeDetailLevel2ChildTab a[href="' + selectedLevel2QualificationDetailsTabForScheme + '"]').tab('show');
        }
        if (selectedLevel2QualificationDetailsTabForScheme.startsWith("#dQualificationDetailsLevel2Tab")) {
            if (selectedChildTabForScheme == null) {
                selectedChildTabForScheme = "#dGeneralTabScheme";
                $('#schemeChildTab a[href="' + selectedChildTabForScheme + '"]').tab('show');
            }
            else
                PCDetailToLoad(selectedChildTabForScheme);
        }
        else if (selectedLevel2QualificationDetailsTabForScheme.startsWith("#dAvailabilityLevel2Tab")) {
            PCDetailToLoad(selectedLevel2QualificationDetailsTabForScheme);
        }
        DisplaySchemeGeneralDetails(rows[0]);
    }
}

function GetSelectedRowDetailOfLearningUnitGrid() {
    var rows = learningUnitGrid.Selected();
    if (rows.length > 0) {

        var id = rows[0].AoqeId;
        var title = rows[0].QEShortTitle;
        parentQEIdLearningUnit = rows[0].QualificationElementId;
        if (id == null)
            id = ' ';
        if (title == null)
            title = ' ';
        var innerHtmlScheme = AoqeIdRT + ': <b>' + id + '</b> ' + QEShortTitleRT + ': <b>' + title + '</b>';
        $('#lblSelectedLearningUnit').html(innerHtmlScheme);
        $("#pcDetailLearningUnitTabView").show();
        $("#pcDetailLevel2TabViewLearningUnit").show();

        if (selectedLevel2QualificationDetailsTabForLearningUnit == null) {
            selectedLevel2QualificationDetailsTabForLearningUnit = "#dQualificationDetailsLevel2TabLearningUnit";
            $('#learningUnitDetailLevel2ChildTab a[href="' + selectedLevel2QualificationDetailsTabForLearningUnit + '"]').tab('show');
        }
        if (selectedLevel2QualificationDetailsTabForLearningUnit.startsWith("#dQualificationDetailsLevel2Tab")) {
            if (selectedChildTabForLearningUnit == null) {
                selectedChildTabForLearningUnit = "#dGeneralTabLearningUnit";
                $('#learningUnitChildTab a[href="' + selectedChildTabForLearningUnit + '"]').tab('show');
            }
            else
                PCDetailToLoad(selectedChildTabForLearningUnit);
        }
        else if (selectedLevel2QualificationDetailsTabForLearningUnit.startsWith("#dAvailabilityLevel2Tab")) {
            PCDetailToLoad(selectedLevel2QualificationDetailsTabForLearningUnit);
        }
        DisplayLearningUnitGeneralDetails(rows[0]);
    }
}

function GetSelectedRowDetailOfAssessableGrid() {
    var rows = assessableGrid.Selected();
    if (rows.length > 0) {

        var id = rows[0].AoqeId;
        var title = rows[0].QEShortTitle;
        parentQEIdAssessable = rows[0].QualificationElementId;
        if (id == null)
            id = ' ';
        if (title == null)
            title = ' ';
        var innerHtmlAssessable = AoqeIdRT + ': <b>' + id + '</b> ' + QEShortTitleRT + ': <b>' + title + '</b>';
        $('#lblSelectedAssessable').html(innerHtmlAssessable);
        $("#pcDetailAssessableTabView").show();
        $("#pcDetailLevel2TabViewAssessable").show();
        if (selectedLevel2QualificationDetailsTabForAssessable == null) {
            selectedLevel2QualificationDetailsTabForAssessable = "#dQualificationDetailsLevel2TabAssessable";
            $('#assessableDetailLevel2ChildTab a[href="' + selectedLevel2QualificationDetailsTabForAssessable + '"]').tab('show');
        }
        if (selectedLevel2QualificationDetailsTabForAssessable.startsWith("#dQualificationDetailsLevel2Tab")) {
            if (selectedChildTabForAssessable == null) {
                selectedChildTabForAssessable = "#dGeneralTabAssessable";
                $('#assessableChildTab a[href="' + selectedChildTabForAssessable + '"]').tab('show');
            }
            else
                PCDetailToLoad(selectedChildTabForAssessable);
        }
        else if (selectedLevel2QualificationDetailsTabForAssessable.startsWith("#dAvailabilityLevel2Tab")) {
            PCDetailToLoad(selectedLevel2QualificationDetailsTabForAssessable);
        }
        DisplayAssessableGeneralDetails(rows[0]);
    }
}

function GetSelectedRowDetailOfQEPathwayGrid() {
    var rows = qePathwayGrid.Selected();
    if (rows.length > 0) {
        var id = rows[0].AoqeId;
        titleQEPathway = rows[0].QEShortTitle;
        parentQEIdPathway = rows[0].QualificationElementId;

        if (id == null)
            id = ' ';
        if (titleQEPathway == null)
            titleQEPathway = ' ';

        var innerHtmlAssessable = AoqeIdRT + ': <b>' + id + '</b> ' + QEShortTitleRT + ': <b>' + titleQEPathway + '</b>';
        $('#lblSelectedPathway').html(innerHtmlAssessable);
        $("#pcDetailPathwayTabView").show();
        $("#pcDetailLevel2TabViewPathway").show();

        if (selectedLevel2QualificationDetailsTabForPathway == null) {
            selectedLevel2QualificationDetailsTabForPathway = "#dQualificationDetailsLevel2TabPathway";
            $('#pathwayDetailLevel2ChildTab a[href="' + selectedLevel2QualificationDetailsTabForPathway + '"]').tab('show');
        }
        if (selectedLevel2QualificationDetailsTabForPathway.startsWith("#dQualificationDetailsLevel2Tab")) {
            if (selectedChildTabForPathway == null) {
                selectedChildTabForPathway = "#dGeneralTabPathway";
                $('#pathwayChildTab a[href="' + selectedChildTabForPathway + '"]').tab('show');
            }
            else
                PCDetailToLoad(selectedChildTabForPathway);
        }
        else if (selectedLevel2QualificationDetailsTabForPathway.startsWith("#dAvailabilityLevel2Tab")) {
            PCDetailToLoad(selectedLevel2QualificationDetailsTabForPathway);
        }
        DisplayPathwayGeneralDetails(rows[0]);
    }
}

function GetSelectedRowDetailOfQEAvailibilityGrid(object) {
    var rows = object.grid.Selected();
    if (rows.length > 0) {
        switch (object.parentQEType) {
            case "Scheme":
                availabilityIdScheme = rows[0].QEAvailabilityId;
                $('#pcAvailabilityDetailSchemeTabView').show();
                if (selectedLevel3AvailabilityTabForScheme == null) {
                    selectedLevel3AvailabilityTabForScheme = "#dKeyEventTabScheme";
                    $('#schemeAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForScheme + '"]').tab('show');
                }
                else
                    PCDetailToLoad(selectedLevel3AvailabilityTabForScheme);
                break;
            case "Award":
                availabilityIdAward = rows[0].QEAvailabilityId;
                $('#pcAvailabilityDetailAwardTabView').show();
                if (selectedLevel3AvailabilityTabForAward == null) {
                    selectedLevel3AvailabilityTabForAward = "#dKeyEventTabAward";
                    $('#awardAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForAward + '"]').tab('show');
                }
                else
                    PCDetailToLoad(selectedLevel3AvailabilityTabForAward);
                break;
            case "Assessable":
                availabilityIdAssessable = rows[0].QEAvailabilityId;
                $('#pcAvailabilityDetailAssessableTabView').show();
                if (selectedLevel3AvailabilityTabForAssessable == null) {
                    selectedLevel3AvailabilityTabForAssessable = "#dKeyEventTabAssessable";
                    $('#assessableAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForAssessable + '"]').tab('show');
                }
                else
                    PCDetailToLoad(selectedLevel3AvailabilityTabForAssessable);
                break;
            case "LearningUnit":
                availabilityIdLearningUnit = rows[0].QEAvailabilityId;
                $('#pcAvailabilityDetailLearningUnitTabView').show();
                if (selectedLevel3AvailabilityTabForLearningUnit == null) {
                    selectedLevel3AvailabilityTabForLearningUnit = "#dKeyEventTabLearningUnit";
                    $('#learningUnitAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForLearningUnit + '"]').tab('show');
                }
                else
                    PCDetailToLoad(selectedLevel3AvailabilityTabForLearningUnit);
                break;
            case "Pathway":
                availabilityIdPathway = rows[0].QEAvailabilityId;
                $('#pcAvailabilityDetailPathwayTabView').show();
                if (selectedLevel3AvailabilityTabForPathway == null) {
                    selectedLevel3AvailabilityTabForPathway = "#dKeyEventTabPathway";
                    $('#PathwayAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForPathway + '"]').tab('show');
                }
                else
                    PCDetailToLoad(selectedLevel3AvailabilityTabForPathway);
                break;
        }


    }
}

function GetAssessmentMaterialAwardList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEAssessmentMaterialList',
            data: function () {
                var qeRelationshipDto = { awardingOrganisationCentreId: aoCentreId, qeParentId: object.qualificationElementId,qeAvailabilityId:object.availabilityId };
                return qeRelationshipDto
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            columns: [
                        { field: "MaterialId", title: QEAMMaterialIdTitle, tooltip: QEAMMaterialIdTitle, type: "string", width: "10%" },
                        { field: "MaterialName", title: QEAMNameTitle, tooltip: QEAMNameTitle, type: "string", width: "10%" },
                        { field: "MaterialDescription", title: QEAMDescriptionTitle, tooltip: QEAMDescriptionTitle, type: "string", width: "16%" },
                        { field: "Source", title: QEAMSourceTitle, tooltip: QEAMSourceTitle, type: "string", width: "8%" },
                        { field: "SourceType", title: QEAMSourceTypeTitle, tooltip: QEAMSourceTypeTitle, type: "string", width: "10%" },
                        { field: "MediumType", title: QEAMMediumTypeTitle, tooltip: QEAMMediumTypeTitle, type: "string", width: "11%" },
                        { field: "NumberPerLearner", title: QEAMNumberPerLearnerTitle, tooltip: QEAMNumberPerLearnerTitle, type: "integer", width: "12%" },
                        { field: "NumberPerCentre", title: QEAMNumberPerCentreTitle, tooltip: QEAMNumberPerCentreTitle, type: "integer", width: "12%" },
                        { field: "ReleaseDate", title: QEAMReleaseDateTitle, tooltip: QEAMReleaseDateTitle, type: "date", width: "11%" }
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}

function DisplaySchemeGeneralDetails(row) {
    busyDiv();
    var scheme = {
        QETitle: row.QETitle, QEShortTitle: row.QEShortTitle, QEDescription: row.QEDescription, QEEffectiveVersionDate: row.QEEffectiveStartDate,
        QEEffectiveVersionEndDate: row.QEEffectiveEndDate, QualificationReferenceNumber: row.QualificationReferenceNumber, LearningAimCode: row.LearningAimCode,
        QEAdminCode: row.QEAdminCode, PrivateLearnerType: row.PrivateLearnerType, QEModerationType: row.QEModerationType, FirstLanguageRequired: row.FirstLanguageRequired,

        QualificationType: row.QualificationType, QEAvailabilityText: row.QEAvailabilityText, QECentreAuthenticationAgreementText: row.QECentreAuthenticationAgreementText,
        FirstTeachingDate: row.QEFirstTeachingDate, LastTeachingDate: row.QELastTeachingDate, DateOfBirthRequired: row.DateOfBirthRequired, LegalSexRequired: row.LegalSexRequired,
        SeriesBased: row.SeriesBased, AssessmentMinLearnerAge: row.AssessmentMinLearnerAge, AssessmentMaxLearnerAge: row.AssessmentMaxLearnerAge
    };
    postJSON('/Catalogue/DisplaySchemeGeneralDetails', { scheme: scheme }, function (data) {
        $("#dGeneralTabScheme").html(data);
        clearDiv();
    });
}

function DisplayAwardGeneralDetails(row) {
    busyDiv();
    var award = {
        QualificationElementTitle: row.QualificationElementTitle, QEShortTitle: row.QEShortTitle, QEDescription: row.QEDescription, QEEffectiveVersionDate: row.QEEffectiveStartDate,
        QEEffectiveVersionEndDate: row.QEEffectiveEndDate, QualificationReferenceNumber: row.QualificationReferenceNumber, LearningAimCode: row.LearningAimCode,
        QEAdminCode: row.QEAdminCode, PrivateLearnerType: row.PrivateLearnerType, QEModerationType: row.QEModerationType, FirstLanguageRequired: row.FirstLanguageRequired,

        AccreditationStartDate: row.QEAccreditationStartDate, AccreditationEndReviewDate: row.QEAccreditationEndDate, CertificationStartDate: row.QECertificationStartDate,
        CertificationEndDate: row.QECertificationEndDate, OperationalStartDate: row.QEOperationalStartDate, OperationalEndDate: row.QEOperationalEndDate, GuidedLearningHoursMax: row.GuidedLearningHoursMax,
        GuidedLearningHoursMin: row.GuidedLearningHoursMin, AOAccredVersionNumber: row.AOAccredVersionNumber, AssessmentLanguageType: row.AssessmentLanguageType,
        AwardLevelType: row.AwardLevelType, AwardType: row.AwardType, CourseLengthType: row.CourseLengthType, QEEvidenceRequirementType: row.QEEvidenceRequirementType,
        QEDeliveryModelType: row.QEDeliveryModelType, StudyGuideAvailableType: row.StudyGuideAvailableType, StudyGuideReference: row.StudyGuideReference, StudyGuideReferenceType: row.StudyGuideReferenceType,
        RegistrationExpiryMonth: row.RegistrationExpiryMonth, QEClassification: row.QEClassification, StudyGuideDetails: row.StudyGuideDetails, ResitRuleText: row.ResitRuleText,
        PartyIdAccreditor: row.PartyIdAccreditor, PartyIdSectorLead: row.PartyIdSectorLead, PartyRoleTypeAssessor: row.PartyRoleTypeAssessor, IsCertificateOfUnitCreditIssued: row.IsCertificateOfUnitCreditIssued,
        IsContributingUnitsListed: row.IsContributingUnitsListed, IsEndorsedTitleRequired: row.IsEndorsedTitleRequired, IsQEEvidenceRequirementProvided: row.IsQEEvidenceRequirementProvided,
        IsStatementOfCreditIssued: row.IsStatementOfCreditIssued
    };
    postJSON('/Catalogue/DisplayAwardGeneralDetails', { award: award }, function (data) {
        $("#dGeneralTabAward").html(data);
        clearDiv();
    });
}

function DisplayLearningUnitGeneralDetails(row) {
    busyDiv();
    var learningUnit = {
        QualificationElementTitle: row.QualificationElementTitle, QEShortTitle: row.QEShortTitle, QEDescription: row.QEDescription, QEEffectiveVersionDate: row.QEEffectiveStartDate,
        QEEffectiveVersionEndDate: row.QEEffectiveEndDate, QualificationReferenceNumber: row.QualificationReferenceNumber, LearningAimCode: row.LearningAimCode,
        QEAdminCode: row.QEAdminCode, PrivateLearnerType: row.PrivateLearnerType, QEModerationType: row.QEModerationType, FirstLanguageRequired: row.FirstLanguageRequired,

        LearningUnitLevelType: row.LearningUnitLevelType, MaximumResitsAllowed: row.MaximumResitsAllowed
    };
    postJSON('/Catalogue/DisplayLearningUnitGeneralDetails', { learningUnit: learningUnit }, function (data) {
        $("#dGeneralTabLearningUnit").html(data);
        clearDiv();
    });
}

function DisplayAssessableGeneralDetails(row) {
    busyDiv();
    var assessable = {
        QualificationElementTitle: row.QualificationElementTitle, QEShortTitle: row.QEShortTitle, QEDescription: row.QEDescription, QEEffectiveVersionDate: row.QEEffectiveStartDate,
        QEEffectiveVersionEndDate: row.QEEffectiveEndDate, QualificationReferenceNumber: row.QualificationReferenceNumber, LearningAimCode: row.LearningAimCode,
        QEAdminCode: row.QEAdminCode, PrivateLearnerType: row.PrivateLearnerType, QEModerationType: row.QEModerationType, FirstLanguageRequired: row.FirstLanguageRequired,

        AssessmentMethodType: row.AssessmentMethodType, TierLevelType: row.TierLevelType, TierLevelCommonReference: row.TierLevelCommonReference,
        CambridgeAssessmentTimeZoneNumber: row.CambridgeAssessmentTimeZoneNumber, MaximumExtraTimeMinutes: row.MaximumExtraTimeMinutes, TimeAllowedMinutes: row.TimeAllowedMinutes, 
        PartyRoleTypeAssessor: row.PartyRoleTypeAssessor, PartyRoleTypeAdditionalDecider: row.PartyRoleTypeAdditionalDecider, AssessmentMediumType: row.AssessmentMediumType,
        ExtraTimeRequired: row.ExtraTimeRequired, AssessmentActualDateTimeRequired: row.AssessmentActualDateTimeRequired, AttendanceDataRequired: row.AttendanceDataRequired,
        CarryForwardPermissible: row.CarryForwardPermissible, OnDemand: row.OnDemand, QETimetabled: row.QETimetabled, TestDayPhotographRequired: row.TestDayPhotographRequired
    };
    postJSON('/Catalogue/DisplayAssessableGeneralDetails', { assessable: assessable }, function (data) {
        $("#dGeneralTabAssessable").html(data);
        clearDiv();
    });
}

function DisplayPathwayGeneralDetails(row) {
    busyDiv();
    var pathway = {
        QualificationElementTitle: row.QualificationElementTitle, QEShortTitle: row.QEShortTitle, QEDescription: row.QEDescription, QEEffectiveVersionDate: row.QEEffectiveStartDate,
        QEEffectiveVersionEndDate: row.QEEffectiveEndDate, QualificationReferenceNumber: row.QualificationReferenceNumber, LearningAimCode: row.LearningAimCode,
        QEAdminCode: row.QEAdminCode, PrivateLearnerType: row.PrivateLearnerType, QEModerationType: row.QEModerationType, FirstLanguageRequired: row.FirstLanguageRequired,

        MinimumUnitSelection: row.MinimumUnitSelection, MaximumUnitSelection: row.MaximumUnitSelection, MinimumPathwaySelection: row.MinimumPathwaySelection,
        MaximumPathwaySelection: row.MaximumPathwaySelection, MinimumCreditValue: row.MinimumCreditValue, EqualsIndicator: row.EqualsIndicator,
        MandatoryInGroup: row.MandatoryInGroup
    };
    postJSON('/Catalogue/DisplayPathwayGeneralDetails', { pathway: pathway }, function (data) {
        $("#dGeneralTabPathway").html(data);
        clearDiv();
    });
}


function LoadRelationshipHierarchy(object) {
    if (object.tree == null) {
        object.tree = $(object.divId).kendoTreeView({
            dataTextField: ["TreeNodeText", "TreeNodeText"],
            dataValueField: ["TreeNodePath", "TreeNodePath"],

            select: onSelect,
            expand:
                function (e) { onExpand(e, object) },
            animation: false
        }).data("kendoTreeView");
    }
    object.tree.setDataSource(new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: '/Catalogue/GetRootNode',
                data: function () {
                    var nodeDto = {
                        awardingOrganisationCentreId: aoCentreId, qualificationElementId: object.qualificationElementId
                    };
                    return nodeDto
                },
                dataType: "json",
                type: "POST"
            }
        },
        schema: {
            model: {
                id: "TreeNodePath",
                hasChildren: "HasChild",
                children: "TreeNodeChildren"
            }
        }
    }));

}

function onExpand(e, object) {
    var dataItem = object.tree.dataItem(e.node);


    var treeview = $(object.divId).data("kendoTreeView");
    var getitem;
    var childNodes
    var nodeData = { awardingOrganisationCentreId: aoCentreId, qualificationElementId: dataItem.TreeNodePath };
    postJSON('/Catalogue/GetPathwayTreeData', nodeData, function (data) {
        childNodes = data;
        $.each(childNodes, function () {
            getitem = treeview.dataSource.get(this.TreeNodePath);
            if (!(getitem != undefined && treeview.findByUid(getitem.TreeNodePath) != undefined)) {
                object.tree.append({
                    TreeNodeId: this.TreeNodeId,
                    TreeNodeText: this.TreeNodeText,
                    spriteCssClass: this.spriteCssClass,
                    HasChild: this.HasChild,
                    TreeNodePath: this.TreeNodePath,
                    TreeNodeDisplayId: this.TreeNodeDisplayId,
                }, $(e.node));
            }
        });
    });
}

function GetQEGradeRangeList(object) {
    if (!object.grid) {
        object.grid = $(object.divId).A2CGrid({
            gridKey: object.gridKey,
            url: '/Catalogue/GetQEGradeRangeList',
            data: function () {
                var qeGradeDto = { awardingOrganisationCentreId: aoCentreId, qualificationElementId: object.qualificationElementId };
                return qeGradeDto
            },
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: 'single',
            autoResize: false,
            maxRowCount: 10,
            columns: [
                        { field: "Grade", title: GradeRT, tooltip: GradeRT, type: "string", width: "7%" },
                        { field: "Description", title: QEDescriptionRT, tooltip: QEDescriptionRT, type: "string", width: "11%" },
                        { field: "Outcome", title: OutcomeRT, tooltip: OutcomeRT, type: "string", width: "8%" },
                        { field: "Sequence", title: SequenceRT, tooltip: SequenceRT, type: "number", width: "9%" },
                        { field: "PerformancePoints", title: PerformancePointsRT, tooltip: PerformancePointsRT, type: "number", width: "10%" },
                        { field: "Level1Threshold", title: Level1ThresholdRT, tooltip: Level1ThresholdRT, type: "number", width: "9%" },
                        { field: "Level2Threshold", title: Level2ThresholdRT, tooltip: Level2ThresholdRT, type: "number", width: "9%" },
                        { field: "Level3Threshold", title: Level3ThresholdRT, tooltip: Level3ThresholdRT, type: "number", width: "9%" },
                        { field: "EffectiveDate", title: EffectiveDateRT, tooltip: EffectiveDateRT, type: "date", width: "11%" },
                        { field: "EffectiveEndDate", title: EffectiveEndDateRT, tooltip: EffectiveEndDateRT, type: "date", width: "10%" },
                        { field: "Owner", title: OwnerRT, tooltip: OwnerRT, type: "string", width: "7%" },
            ]
        });
        object.grid.Render();
    }
    else {
        object.grid.ClearSortFilter();
    }
}