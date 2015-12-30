
$(document).ready(function () {
    $('#productCatalogueTabView').hide();

    $('#Centre').change(function () //wire up on change event of the 'country' dropdownlist
    {
        var centreId = $('#Centre').val();
        busyDiv();
        postJSON('/Catalogue/SelectAwardingOrganisationList/', {
            centreId: centreId
        }, function (result) {
            var value = '';
            var text = selectText;
            var options = $("#AwardingOrganisaionOrBoard");
            options.empty();
            $.each(result, function () {
                if (centreId != '' && centreId.indexOf(',0') < 0 && this.Value != '') {
                    value = this.Value;
                    text = this.Text;
                }
                options.append($("<option />").val(this.Value).text(this.Text));
            });
            options.val(value);
            $("#s2id_AwardingOrganisaionOrBoard .select2-chosen").text(text);
            clearDiv();
        });
    })
});

function RefreshProductCatalogue(searchIn) {
    if ($("#form0").valid() == false) {
        return false;
    }
    ClearValidationMessage();
    busyDiv();
    postJSON('/Catalogue/CheckProductCatalogueExists', {
        awardingOrganisationCentreId: $('#AwardingOrganisaionOrBoard').val(),
        awardingOrganisationText: $("#AwardingOrganisaionOrBoard option:selected").text(),
        centreText: $("#Centre option:selected").text()
    }, function (data) {
        if (data.result) {
            aoCentreId = data.aoCentreId;
            searchPCDetailsForColumn = searchIn;
            searchTextValue = $("#searchText").val();
            var pcsearchSelection;
            var pcSelection = jQuery.validator.format(selectedproductCatalogueforAOCenter, '<b>' + $("#AwardingOrganisaionOrBoard option:selected").text() + '</b>', '<b>' + $("#Centre option:selected").text() + '</b>');
            if (searchTextValue.length > 0 && searchIn == 'All') {
                pcsearchSelection = '(' + qeidRT + ' or ' + QEShortTitleRT + ' or ' + QualificationReferenceNumberRT + ') contains ';
                pcSelection = pcSelection + jQuery.validator.format(productCatalogueSearchCriteriaRT, pcsearchSelection);
            }
            else if (searchTextValue.length > 0 && searchIn == 'AoqeId') {
                pcsearchSelection = '(' + qeidRT + ') contains ';
                pcSelection = pcSelection + jQuery.validator.format(productCatalogueSearchCriteriaRT, pcsearchSelection);
            }
            else if (searchTextValue.length > 0 && searchIn == 'QEShortTitle') {
                pcsearchSelection = '(' + QEShortTitleRT + ') contains ';
                pcSelection = pcSelection + jQuery.validator.format(productCatalogueSearchCriteriaRT, pcsearchSelection);
            }
            else if (searchTextValue.length > 0 && searchIn == 'QualificationReferenceNumber') {
                pcsearchSelection = '(' + QualificationReferenceNumberRT + ') contains ';
                pcSelection = pcSelection + jQuery.validator.format(productCatalogueSearchCriteriaRT, pcsearchSelection);
            }

            $('#lblSelectedAOCenter').html(pcSelection);
            $('#lblPCSearchText').text($("#searchText").val());
            $('#productCatalogueTabView').show();

            // store the currently selected tab in the hash value
            $("ul.nav-tabs > li > a").on("shown.bs.tab", function (e) {
                var id = $(e.target).attr("href").substr(1);
                window.location.hash = id;
            });

            // on load of the page: switch to the currently selected tab; If no selectio found it will select first tab by default
            var hash = window.location.hash;
            $('#mainTab a[href="' + hash + '"]').tab('show');
            if (hash == undefined || hash == null || hash == "") {
                $("#mainTab li:eq(0) a").tab('show');
            }
            else {
                $('#mainTab a[href="' + hash + '"]').tab('show');
            }

            refereshTabData(hash);
            clearDiv();
        }
        else {
            clearDiv();
            $('#productCatalogueTabView').hide();
            DisplayError([{ Id: '', ErrorMessages: [data.errorMsg] }]);
            return false;
        }
    });
}

//Load tabs
function refereshTabData(hash) {
    //$("#schemeGrid").hide();
    //$("#awardGrid").hide();
    //$("#learningUnitGrid").hide();
    //$("#assessableGrid").hide();
    // $("#qePathwayGrid").hide();

    if (schemeGrid != null)
        schemeGrid.Destroy();
    schemeGrid = null;

    if (awardGrid != null)
        awardGrid.Destroy();
    awardGrid = null;

    if (learningUnitGrid != null)
        learningUnitGrid.Destroy();
    learningUnitGrid = null;

    if (assessableGrid != null)
        assessableGrid.Destroy();
    assessableGrid = null;

    if (qePathwayGrid != null)
        qePathwayGrid.Destroy();
    qePathwayGrid = null;

    schemeTabLoadedForAoCentreId = 0;
    awardTabLoadedForAoCentreId = 0;
    learningUnitTabLoadedForAoCentreId = 0;
    assessableTabLoadedForAoCentreId = 0;
    pathwayTabLoadedForAoCentreId = 0;
    selectedChildTabForScheme = null;
    selectedLevel2QualificationDetailsTabForScheme = null;
    selectedLevel3AvailabilityTabForScheme = null;
    selectedChildTabForAward = null;
    selectedLevel2QualificationDetailsTabForAward = null;
    selectedLevel3AvailabilityTabForAward = null;
    selectedChildTabForAssessable = null;
    selectedLevel2QualificationDetailsTabForAssessable = null;
    selectedLevel3AvailabilityTabForAssessable = null;
    selectedChildTabForLearningUnit = null;
    selectedLevel2QualificationDetailsTabForLearningUnit = null;
    selectedLevel3AvailabilityTabForLearningUnit = null;
    selectedChildTabForPathway = null;
    selectedLevel2QualificationDetailsTabForPathway = null;
    selectedLevel3AvailabilityTabForPathway = null;

    selectedSchemeSeriesLable = ''
    selectedAwardSeriesLable = ''
    selectedAssessableSeriesLable = ''
    selectedLearningUnitSeriesLable = ''
    selectedPathwaySeriesLable = ''
    selectedSchemaqulificationType = ''
    selectedSeriesAwardType = ''

    schemeRelationshipHierarchyObject.tree = null;
    awardRelationshipHierarchyObject.tree = null;
    learningUnitRelationshipHierarchyObject.tree = null;
    assessableRelationshipHierarchyObject.tree = null;
    pathwayRelationshipHierarchyObject.tree = null;

    if (isFirstTimeAutoLoad == false) {
        if (hash == undefined || hash == null || hash == "") {
            hash = "#dschemesTab";
        }
    }

    switch (hash) {
        case "#dschemesTab":
            LoadProductCatalogueSchemeTab();
            break;
        case "#dawardsTab":
            LoadProductCatalogueAwardTab();
            break;
        case "#dlearningUnitsTab":
            LoadProductCatalogueLearningUnitTab();
            break;
        case "#dassessablesTab":
            LoadProductCatalogueAssessableTab();
            break;
        case "#dpathwayTab":
            LoadProductCataloguePathwayTab();
            break;
    }

}

function LoadProductCatalogueSchemeTab() {
    if (schemeTabLoadedForAoCentreId != aoCentreId) {
        busyDiv();
        postJSON('/Catalogue/ProductCatalogueSchemes', { parameter: aoCentreId }, function (data) {
            schemeTabLoadedForAoCentreId = aoCentreId;
            $("#dschemesTab").html(data);
            GetSchemes();
        });
        clearDiv();
    }
}

function LoadProductCatalogueAwardTab() {
    if (awardTabLoadedForAoCentreId != aoCentreId) {
        busyDiv();
        postJSON('/Catalogue/ProductCatalogueAwards', { parameter: aoCentreId }, function (data) {
            awardTabLoadedForAoCentreId = aoCentreId;
            $("#dawardsTab").html(data);
            GetAwards();
        });
        clearDiv();
    }
}

function LoadProductCatalogueLearningUnitTab() {
    if (learningUnitTabLoadedForAoCentreId != aoCentreId) {
        postJSON('/Catalogue/ProductCatalogueLearningUnits', { parameter: aoCentreId }, function (data) {
            learningUnitTabLoadedForAoCentreId = aoCentreId;
            $("#dlearningUnitsTab").html(data);
            GetLearningUnits();
        });
        //GetLearningUnits();
    }
}

function LoadProductCatalogueAssessableTab() {
    if (assessableTabLoadedForAoCentreId != aoCentreId) {
        postJSON('/Catalogue/ProductCatalogueAssessables', { parameter: aoCentreId }, function (data) {
            assessableTabLoadedForAoCentreId = aoCentreId;
            $("#dassessablesTab").html(data);
            GetAssessables();
        });
    }
}

function LoadProductCataloguePathwayTab() {
    if (pathwayTabLoadedForAoCentreId != aoCentreId) {
        postJSON('/Catalogue/ProductCataloguePathway', { awardingOrganisationCentreId: aoCentreId }, function (data) {
            pathwayTabLoadedForAoCentreId = aoCentreId;
            $("#dpathwayTab").html(data);
            GetQEForPathway();
        });
    }
}

function HideandDestroyAllChildTab(qeType, lblName, txtRT) {
    //$('#lblSelectedScheme').text(selectText + ' ' + schemeRT);
    $('#' + lblName).text(selectText + ' ' + txtRT);

    switch (qeType) {
        case "Scheme":
            parentQEIdScheme = 0;
            $("#pcDetailSchemeTabView").hide();
            $("#pcDetailLevel2TabViewScheme").hide();
            ResetSchemaObjects();
            break;
        case "Award":
            parentQEIdAward = 0;
            $("#pcDetailAwardTabView").hide();
            $("#pcDetailLevel2TabViewAward").hide();
            ResetAwardObjects();
            break;
        case "Assessable":
            parentQEIdAssessable = 0;
            $("#pcDetailAssessableTabView").hide();
            $("#pcDetailLevel2TabViewAssessable").hide();
            ResetAssessableObjects();
            break;
        case "LearningUnit":
            parentQEIdLearningUnit = 0;
            $("#pcDetailLearningUnitTabView").hide();
            $("#pcDetailLevel2TabViewLearningUnit").hide();
            ResetLearningUnitObjects();
            break;
        case "Pathway":
            parentQEIdPathway = 0;
            $("#pcDetailPathwayTabView").hide();
            $("#pcDetailLevel2TabViewPathway").hide();
            ResetPathwayObjects();
            break;
    }
}

function HideandDestroyAllLeve3ChildTab(qeType) {
    switch (qeType) {
        case "Scheme":
            $("#pcAvailabilityDetailSchemeTabView").hide();
            ResetLevel3SchemaObjects();
            break;
        case "Award":
            $("#pcAvailabilityDetailAwardTabView").hide();
            ResetLevel3AwardObjects();
            break;
        case "Assessable":
            $("#pcAvailabilityDetailAssessableTabView").hide();
            ResetLevel3AssessableObjects();
            break;
        case "LearningUnit":
            $("#pcAvailabilityDetailLearningUnitTabView").hide();
            ResetLevel3LearningUnitObjects();
            break;
        case "Pathway":
            $("#pcAvailabilityDetailPathwayTabView").hide();
            ResetLevel3PathwayObjects();
            break;
    }
}



//Tree view click event
//function onExpand(e) {
//    var dataItem = this.dataItem(e.node);


//    var treeview = $("#pathwayTreeView").data("kendoTreeView");
//    var getitem;
//    var childNodes
//    var nodeData = { awardingOrganisationCentreId: aoCentreId, qualificationElementId: dataItem.TreeNodePath };
//    postJSON('/Catalogue/GetPathwayTreeData', nodeData, function (data) {
//        childNodes = data;
//        $.each(childNodes, function () {
//            getitem = treeview.dataSource.get(this.TreeNodePath);
//            if (!(getitem != undefined && treeview.findByUid(getitem.TreeNodePath) != undefined)) {
//                pathwayTree.append({
//                    TreeNodeId: this.TreeNodeId,
//                    TreeNodeText: this.TreeNodeText,
//                    spriteCssClass: this.spriteCssClass,
//                    HasChild: this.HasChild,
//                    TreeNodePath: this.TreeNodePath,
//                    TreeNodeDisplayId: this.TreeNodeDisplayId,
//                }, $(e.node));
//}
//        });
//    });
//}

function onSelect(e) {
    //var dataItem = this.dataItem(e.node);
    // alert("Selecting: " + dataItem.TreeNodeDisplayId + ' ' + dataItem.TreeNodeText);
}


//Load Treeview data
//function LoadPathwayTreeView() {
//    if (pathwayTree == null) {
//    pathwayTree = $("#pathwayTreeView").kendoTreeView({
//            dataTextField: ["TreeNodeText", "TreeNodeText"],
//            dataValueField: ["TreeNodePath", "TreeNodePath"],

//            select: onSelect,
//            expand: onExpand,
//            animation: false
//        }).data("kendoTreeView");
//    }
//    pathwayTree.setDataSource(new kendo.data.HierarchicalDataSource({
//             transport: {
//                 read: {
//                url: '/Catalogue/GetRootNode',
//                data: function () {
//                    var t = $('#qeTypePathway').val();
//                    var nodeDto = {
//                        awardingOrganisationCentreId: aoCentreId, qualificationElementId: parentQEIdPathway
//                    };
//                    return nodeDto
//                },
//                     dataType: "json",
//                     type: "POST"
//                 }
//             },
//             schema: {
//                 model: {
//                     id: "TreeNodePath",
//                    hasChildren: "HasChild",
//                    children: "TreeNodeChildren"
//                 }
//             }
//    }));

//}

//Set active tab
function SetChildTabActive(qeTypeTabName, divId) {
    if (divId.startsWith('#dQualificationDetailsLevel2Tab') || divId.startsWith('#dAvailabilityLevel2Tab')) {
        switch (qeTypeTabName) {
            case "Scheme":
                selectedLevel2QualificationDetailsTabForScheme = divId;
                break;
            case "Award":
                selectedLevel2QualificationDetailsTabForAward = divId;
                break;
            case "Assessable":
                selectedLevel2QualificationDetailsTabForAssessable = divId;
                break;
            case "LearningUnit":
                selectedLevel2QualificationDetailsTabForLearningUnit = divId;
                break;
            case "Pathway":
                selectedLevel2QualificationDetailsTabForPathway = divId;
                break;
        }
    }
        //else if (divId.startsWith('#dAvailabilityLevel2Tab')) {
        //    switch (qeTypeTabName) {
        //        case "Scheme":
        //            selectedLevel3AvailabilityTabForScheme = divId;
        //            break;
        //        case "Award":
        //            selectedLevel3AvailabilityTabForAward = divId;
        //            break;
        //        case "Assessable":
        //            selectedLevel3AvailabilityTabForAssessable = divId;
        //            break;
        //        case "LearningUnit":
        //            selectedLevel3AvailabilityTabForLearningUnit = divId;
        //            break;
        //    }
        //}
    else {
        switch (qeTypeTabName) {
            case "Scheme":
                if (selectedLevel2QualificationDetailsTabForScheme.startsWith('#dQualificationDetailsLevel2Tab'))
                    selectedChildTabForScheme = divId;
                else
                    selectedLevel3AvailabilityTabForScheme = divId;
                break;
            case "Award":
                if (selectedLevel2QualificationDetailsTabForAward.startsWith('#dQualificationDetailsLevel2Tab'))
                    selectedChildTabForAward = divId;
                else
                    selectedLevel3AvailabilityTabForAward = divId;
                break;
            case "Assessable":
                if (selectedLevel2QualificationDetailsTabForAssessable.startsWith('#dQualificationDetailsLevel2Tab'))
                    selectedChildTabForAssessable = divId;
                else
                    selectedLevel3AvailabilityTabForAssessable = divId;
                break;
            case "LearningUnit":
                if (selectedLevel2QualificationDetailsTabForLearningUnit.startsWith('#dQualificationDetailsLevel2Tab'))
                    selectedChildTabForLearningUnit = divId;
                else
                    selectedLevel3AvailabilityTabForLearningUnit = divId;
                break;
            case "Pathway":
                if (selectedLevel2QualificationDetailsTabForPathway.startsWith('#dQualificationDetailsLevel2Tab'))
                    selectedChildTabForPathway = divId;
                else
                    selectedLevel3AvailabilityTabForPathway = divId;
                break;
        }
    }
}

function ResetSchemaObjects() {
    schemeRelationshipObject.qualificationElementId = 0;
    schemePreferenceObject.qualificationElementId = 0;
    schemaAvailibilityObject.qualificationElementId = 0;
    schemeLearnerIdentifierObject.qualificationElementId = 0;
    schemeGradeRangeObject.qualificationElementId = 0;

    if (schemeRelationshipObject != null && schemeRelationshipObject.grid != null) {
        schemeRelationshipObject.grid.Destroy();
        schemeRelationshipObject.grid = null;
    }
    if (schemaAvailibilityObject != null && schemaAvailibilityObject.grid != null) {
        schemaAvailibilityObject.grid.Destroy();
        schemaAvailibilityObject.grid = null;
    }
    if (schemePreferenceObject != null && schemePreferenceObject.grid != null) {
        schemePreferenceObject.grid.Destroy();
        schemePreferenceObject.grid = null;
    }
    if (schemeLearnerIdentifierObject != null && schemeLearnerIdentifierObject.grid != null) {
        schemeLearnerIdentifierObject.grid.Destroy();
        schemeLearnerIdentifierObject.grid = null;
    }
    if (schemeRelationshipHierarchyObject != null) {
        schemeRelationshipHierarchyObject.qualificationElementId = 0;
    }
    if (schemeGradeRangeObject != null && schemeGradeRangeObject.grid != null) {
        schemeGradeRangeObject.grid.Destroy();
        schemeGradeRangeObject.grid = null;
    }
}
function ResetLevel3SchemaObjects() {
    schemeAssessmentMaterialObject.qualificationElementId = 0;
    schemaKeyEventObject.qualificationElementId = 0;
    schemaKeyEventFeeObject.qualificationElementId = 0;
    schemeAssessmentMaterialObject.availabilityId = 0;
    schemaKeyEventObject.availabilityId = 0;
    schemaKeyEventFeeObject.availabilityId = 0;
    if (schemaKeyEventObject != null && schemaKeyEventObject.grid != null) {
        schemaKeyEventObject.grid.Destroy();
        schemaKeyEventObject.grid = null;
    }
    if (schemaKeyEventFeeObject != null && schemaKeyEventFeeObject.grid != null) {
        schemaKeyEventFeeObject.grid.Destroy();
        schemaKeyEventFeeObject.grid = null;
    }
    if (schemeAssessmentMaterialObject != null && schemeAssessmentMaterialObject.grid != null) {
        schemeAssessmentMaterialObject.grid.Destroy();
        schemeAssessmentMaterialObject.grid = null;
    }

    schemeGradeBoundaryObject.qualificationElementId = 0;
    schemeGradeBoundaryObject.availabilityId = 0;

    if (schemeGradeBoundaryObject != null && schemeGradeBoundaryObject.grid != null) {
        schemeGradeBoundaryObject.grid.Destroy();
        schemeGradeBoundaryObject.grid = null;
    }

    schemeMaximumMarksObject.qualificationElementId = 0;
    schemeMaximumMarksObject.availabilityId = 0;

    if (schemeMaximumMarksObject != null && schemeMaximumMarksObject.grid != null) {
        schemeMaximumMarksObject.grid.Destroy();
        schemeMaximumMarksObject.grid = null;
    }
}
function ResetLevel3PathwayObjects() {    
    pathwayAssessmentMaterialObject.qualificationElementId = 0;
    pathwayAssessmentMaterialObject.availabilityId = 0;
    pathwayKeyEventObject.qualificationElementId = 0;
    pathwayKeyEventFeeObject.qualificationElementId = 0;
    pathwayKeyEventObject.availabilityId = 0;
    pathwayKeyEventFeeObject.availabilityId = 0;

    pathwayGradeBoundaryObject.qualificationElementId = 0;
    pathwayGradeBoundaryObject.availabilityId = 0;

    if (pathwayGradeBoundaryObject != null && pathwayGradeBoundaryObject.grid != null) {
        pathwayGradeBoundaryObject.grid.Destroy();
        pathwayGradeBoundaryObject.grid = null;
    }

    pathwayMaximumMarksObject.qualificationElementId = 0;
    pathwayMaximumMarksObject.availabilityId = 0;

    if (pathwayMaximumMarksObject != null && pathwayMaximumMarksObject.grid != null) {
        pathwayMaximumMarksObject.grid.Destroy();
        pathwayMaximumMarksObject.grid = null;
    }

    if (pathwayKeyEventObject != null && pathwayKeyEventObject.grid != null) {
        pathwayKeyEventObject.grid.Destroy();
        pathwayKeyEventObject.grid = null;
    }
    if (pathwayKeyEventFeeObject != null && pathwayKeyEventFeeObject.grid != null) {
        pathwayKeyEventFeeObject.grid.Destroy();
        pathwayKeyEventFeeObject.grid = null;
    }
    if (pathwayAssessmentMaterialObject != null && pathwayAssessmentMaterialObject.grid != null) {
        pathwayAssessmentMaterialObject.grid.Destroy();
        pathwayAssessmentMaterialObject.grid = null;
    }
}
function ResetAwardObjects() {
    awardRelationshipObject.qualificationElementId = 0;
    awardPreferenceObject.qualificationElementId = 0;
    awardAvailibilityObject.qualificationElementId = 0;
    awardLearnerIdentifierObject.qualificationElementId = 0;
    pathwayAvailibilityObject.qualificationElementId = 0;
    awardGradeRangeObject.qualificationElementId = 0;
    if (awardRelationshipObject != null && awardRelationshipObject.grid != null) {
        awardRelationshipObject.grid.Destroy();
        awardRelationshipObject.grid = null;
    }
    if (awardAvailibilityObject != null && awardAvailibilityObject.grid != null) {
        awardAvailibilityObject.grid.Destroy();
        awardAvailibilityObject.grid = null;
    }
    if (awardPreferenceObject != null && awardPreferenceObject.grid != null) {
        awardPreferenceObject.grid.Destroy();
        awardPreferenceObject.grid = null;
    }
    if (awardLearnerIdentifierObject != null && awardLearnerIdentifierObject.grid != null) {
        awardLearnerIdentifierObject.grid.Destroy();
        awardLearnerIdentifierObject.grid = null;
    }
    if (awardRelationshipHierarchyObject != null) {
        awardRelationshipHierarchyObject.qualificationElementId = 0;
    }
    if (awardGradeRangeObject != null && awardGradeRangeObject.grid != null) {
        awardGradeRangeObject.grid.Destroy();
        awardGradeRangeObject.grid = null;
    }
}
function ResetLevel3AwardObjects() {         
    awardGradeBoundaryObject.qualificationElementId = 0;
    awardGradeBoundaryObject.availabilityId = 0;
    
    awardMaximumMarksObject.qualificationElementId = 0;
    awardMaximumMarksObject.availabilityId = 0;

    awardAssessmentMaterialObject.qualificationElementId = 0;
    awardKeyEventObject.qualificationElementId = 0;
    awardKeyEventFeeObject.qualificationElementId = 0;
    awardKeyEventFeeObject.availabilityId = 0;
    awardKeyEventObject.availabilityId = 0;
    awardAssessmentMaterialObject.availabilityId = 0;

    if (awardGradeBoundaryObject != null && awardGradeBoundaryObject.grid != null) {
        awardGradeBoundaryObject.grid.Destroy();
        awardGradeBoundaryObject.grid = null;
    }

    if (awardMaximumMarksObject != null && awardMaximumMarksObject.grid != null) {
        awardMaximumMarksObject.grid.Destroy();
        awardMaximumMarksObject.grid = null;
    }
     
    if (awardAssessmentMaterialObject != null && awardAssessmentMaterialObject.grid != null) {
        awardAssessmentMaterialObject.grid.Destroy();
        awardAssessmentMaterialObject.grid = null;
    }
    if (awardKeyEventObject != null && awardKeyEventObject.grid != null) {
        awardKeyEventObject.grid.Destroy();
        awardKeyEventObject.grid = null;
    }
    if (awardKeyEventFeeObject != null && awardKeyEventFeeObject.grid != null) {
        awardKeyEventFeeObject.grid.Destroy();
        awardKeyEventFeeObject.grid = null;
    }
}
function ResetLearningUnitObjects() {
    learningUnitRelationshipObject.qualificationElementId = 0;
    learningUnitPreferenceObject.qualificationElementId = 0;
    learningUnitAvailibilityObject.qualificationElementId = 0;
    learningUnitLearnerIdentifierObject.qualificationElementId = 0;
    learningUnitGradeRangeObject.qualificationElementId = 0;
    if (learningUnitRelationshipObject != null && learningUnitRelationshipObject.grid != null) {
        learningUnitRelationshipObject.grid.Destroy();
        learningUnitRelationshipObject.grid = null;
    }
    if (learningUnitAvailibilityObject != null && learningUnitAvailibilityObject.grid != null) {
        learningUnitAvailibilityObject.grid.Destroy();
        learningUnitAvailibilityObject.grid = null;
    }
    if (learningUnitPreferenceObject != null && learningUnitPreferenceObject.grid != null) {
        learningUnitPreferenceObject.grid.Destroy();
        learningUnitPreferenceObject.grid = null;
    }
    if (learningUnitLearnerIdentifierObject != null && learningUnitLearnerIdentifierObject.grid != null) {
        learningUnitLearnerIdentifierObject.grid.Destroy();
        learningUnitLearnerIdentifierObject.grid = null;
    }
    if (learningUnitRelationshipHierarchyObject != null) {
        learningUnitRelationshipHierarchyObject.qualificationElementId = 0;
    }
    if (learningUnitGradeRangeObject != null && learningUnitGradeRangeObject.grid != null) {
        learningUnitGradeRangeObject.grid.Destroy();
        learningUnitGradeRangeObject.grid = null;
    }
}

function ResetLevel3LearningUnitObjects() {
    learningUnitAssessmentMaterialObject.qualificationElementId = 0;
    learningUnitKeyEventObject.qualificationElementId = 0;
    learningUnitKeyEventFeeObject.qualificationElementId = 0;
    learningUnitKeyEventObject.availabilityId = 0;
    learningUnitKeyEventFeeObject.availabilityId = 0;
    learningUnitAssessmentMaterialObject.availabilityId = 0;
    if (learningUnitAssessmentMaterialObject != null && learningUnitAssessmentMaterialObject.grid != null) {
        learningUnitAssessmentMaterialObject.grid.Destroy();
        learningUnitAssessmentMaterialObject.grid = null;
    }
    if (learningUnitKeyEventObject != null && learningUnitKeyEventObject.grid != null) {
        learningUnitKeyEventObject.grid.Destroy();
        learningUnitKeyEventObject.grid = null;
    }
    if (learningUnitKeyEventFeeObject != null && learningUnitKeyEventFeeObject.grid != null) {
        learningUnitKeyEventFeeObject.grid.Destroy();
        learningUnitKeyEventFeeObject.grid = null;
    }

    learningUnitGradeBoundaryObject.qualificationElementId = 0;
    learningUnitGradeBoundaryObject.availabilityId = 0;

    if (learningUnitGradeBoundaryObject != null && learningUnitGradeBoundaryObject.grid != null) {
        learningUnitGradeBoundaryObject.grid.Destroy();
        learningUnitGradeBoundaryObject.grid = null;
    }

    learningUnitMaximumMarksObject.qualificationElementId = 0;
    learningUnitMaximumMarksObject.availabilityId = 0;

    if (learningUnitMaximumMarksObject != null && learningUnitMaximumMarksObject.grid != null) {
        learningUnitMaximumMarksObject.grid.Destroy();
        learningUnitMaximumMarksObject.grid = null;
    }
}
function ResetAssessableObjects() {
    assessableRelationshipObject.qualificationElementId = 0;
    assessablePreferenceObject.qualificationElementId = 0;
    assessableAvailibilityObject.qualificationElementId = 0;
    assessableLearnerIdentifierObject.qualificationElementId = 0;
    assessableGradeRangeObject.qualificationElementId = 0;
    if (assessableRelationshipObject != null && assessableRelationshipObject.grid != null) {
        assessableRelationshipObject.grid.Destroy();
        assessableRelationshipObject.grid = null;
    }
    if (assessableAvailibilityObject != null && assessableAvailibilityObject.grid != null) {
        assessableAvailibilityObject.grid.Destroy();
        assessableAvailibilityObject.grid = null;
    }
    if (assessablePreferenceObject != null && assessablePreferenceObject.grid != null) {
        assessablePreferenceObject.grid.Destroy();
        assessablePreferenceObject.grid = null;
    }
    if (assessableLearnerIdentifierObject != null && assessableLearnerIdentifierObject.grid != null) {
        assessableLearnerIdentifierObject.grid.Destroy();
        assessableLearnerIdentifierObject.grid = null;
    }
    if (assessableRelationshipHierarchyObject != null) {
        assessableRelationshipHierarchyObject.qualificationElementId = 0;
    }
    if (assessableGradeRangeObject != null && assessableGradeRangeObject.grid != null) {
        assessableGradeRangeObject.grid.Destroy();
        assessableGradeRangeObject.grid = null;
    }
}
function ResetLevel3AssessableObjects() {
    assessableAssessmentMaterialObject.qualificationElementId = 0;
    assessableKeyEventObject.qualificationElementId = 0;
    assessableKeyEventFeeObject.qualificationElementId = 0;

    assessableAssessmentMaterialObject.availabilityId = 0;
    assessableKeyEventObject.availabilityId = 0;
    assessableKeyEventFeeObject.availabilityId = 0;

    assessableGradeBoundaryObject.qualificationElementId = 0;
    assessableGradeBoundaryObject.availabilityId = 0;

    if (assessableGradeBoundaryObject != null && assessableGradeBoundaryObject.grid != null) {
        assessableGradeBoundaryObject.grid.Destroy();
        assessableGradeBoundaryObject.grid = null;
    }

    assessableMaximumMarksObject.qualificationElementId = 0;
    assessableMaximumMarksObject.availabilityId = 0;

    if (assessableMaximumMarksObject != null && assessableMaximumMarksObject.grid != null) {
        assessableMaximumMarksObject.grid.Destroy();
        assessableMaximumMarksObject.grid = null;
    }

    if (assessableAssessmentMaterialObject != null && assessableAssessmentMaterialObject.grid != null) {
        assessableAssessmentMaterialObject.grid.Destroy();
        assessableAssessmentMaterialObject.grid = null;
    }
    if (assessableKeyEventObject != null && assessableKeyEventObject.grid != null) {
        assessableKeyEventObject.grid.Destroy();
        assessableKeyEventObject.grid = null;
    }
    if (assessableKeyEventFeeObject != null && assessableKeyEventFeeObject.grid != null) {
        assessableKeyEventFeeObject.grid.Destroy();
        assessableKeyEventFeeObject.grid = null;
    }
}

function ResetPathwayObjects() {
    if (pathwayAvailibilityObject != null) {
        pathwayAvailibilityObject.qualificationElementId = 0;
        if (pathwayAvailibilityObject.grid != null) {
            pathwayAvailibilityObject.grid.Destroy();
            pathwayAvailibilityObject.grid = null;
        }
    }

    if (pathwayRelationshipObject != null) {
        pathwayRelationshipObject.qualificationElementId = 0;
        if (pathwayRelationshipObject.grid != null) {
            pathwayRelationshipObject.grid.Destroy();
            pathwayRelationshipObject.grid = null;
        }
    }

    if (pathwayPreferenceObject != null) {
        pathwayPreferenceObject.qualificationElementId = 0;
        if (pathwayPreferenceObject.grid != null) {
            pathwayPreferenceObject.grid.Destroy();
            pathwayPreferenceObject.grid = null;
        }
    }

    if (pathwayLearnerIdentifierObject != null) {
        pathwayLearnerIdentifierObject.qualificationElementId = 0;
        if (pathwayLearnerIdentifierObject.grid != null) {
            pathwayLearnerIdentifierObject.grid.Destroy();
            pathwayLearnerIdentifierObject.grid = null;
        }
    }

    if (pathwayRelationshipHierarchyObject != null) {
        pathwayRelationshipHierarchyObject.qualificationElementId = 0;
    }
    if (pathwayGradeRangeObject != null) {
        pathwayGradeRangeObject.qualificationElementId = 0;
        if (pathwayGradeRangeObject.grid != null) {
            pathwayGradeRangeObject.grid.Destroy();
            pathwayGradeRangeObject.grid = null;
        }
    }
}

function PCDetailToLoad(target) {
    switch (target) {
        case "#dRelationshipsTabScheme":
            if (schemeRelationshipObject.qualificationElementId != parentQEIdScheme) {
                schemeRelationshipObject.qualificationElementId = parentQEIdScheme;
                GetQERelationshipList(schemeRelationshipObject);
            }
            break;
        case "#dRelationshipsTabAward":
            if (awardRelationshipObject.qualificationElementId != parentQEIdAward) {
                awardRelationshipObject.qualificationElementId = parentQEIdAward;
                GetQERelationshipList(awardRelationshipObject);
            }
            break;
        case "#dRelationshipsTabLearningUnit":
            if (learningUnitRelationshipObject.qualificationElementId != parentQEIdLearningUnit) {
                learningUnitRelationshipObject.qualificationElementId = parentQEIdLearningUnit;
                GetQERelationshipList(learningUnitRelationshipObject);
            }
            break;
        case "#dRelationshipsTabAssessable":
            if (assessableRelationshipObject.qualificationElementId != parentQEIdAssessable) {
                assessableRelationshipObject.qualificationElementId = parentQEIdAssessable;
                GetQERelationshipList(assessableRelationshipObject);
            }
            break;
        case "#dRelationshipsTabPathway":
            if (pathwayRelationshipObject.qualificationElementId != parentQEIdPathway) {
                pathwayRelationshipObject.qualificationElementId = parentQEIdPathway;
                GetQERelationshipList(pathwayRelationshipObject);
            }
            break;
        case "#dPreferencesTabScheme":
            if (schemePreferenceObject.qualificationElementId != parentQEIdScheme) {
                schemePreferenceObject.qualificationElementId = parentQEIdScheme;
                GetQEPreferenceList(schemePreferenceObject);
            }
            break;
        case "#dPreferencesTabAward":
            if (awardPreferenceObject.qualificationElementId != parentQEIdAward) {
                awardPreferenceObject.qualificationElementId = parentQEIdAward;
                GetQEPreferenceList(awardPreferenceObject);
            }
            break;
        case "#dPreferencesTabAssessable":
            if (assessablePreferenceObject.qualificationElementId != parentQEIdAssessable) {
                assessablePreferenceObject.qualificationElementId = parentQEIdAssessable;
                GetQEPreferenceList(assessablePreferenceObject);
            }
            break;
        case "#dPreferencesTabLearningUnit":
            if (learningUnitPreferenceObject.qualificationElementId != parentQEIdLearningUnit) {
                learningUnitPreferenceObject.qualificationElementId = parentQEIdLearningUnit;
                GetQEPreferenceList(learningUnitPreferenceObject);
            }
            break;
        case "#dPreferencesTabPathway":
            if (pathwayPreferenceObject.qualificationElementId != parentQEIdPathway) {
                pathwayPreferenceObject.qualificationElementId = parentQEIdPathway;
                GetQEPreferenceList(pathwayPreferenceObject);
            }
            break;
        case "#dAvailabilityLevel2TabScheme":
            if (schemaAvailibilityObject.qualificationElementId != parentQEIdScheme) {
                schemaAvailibilityObject.qualificationElementId = parentQEIdScheme;
                schemaAvailibilityObject.seriesLabel = selectedSchemeSeriesLable;
                GetQEAvailibilityList(schemaAvailibilityObject);
            }
            break;
        case "#dAvailabilityLevel2TabAward":
            if (awardAvailibilityObject.qualificationElementId != parentQEIdAward) {
                awardAvailibilityObject.qualificationElementId = parentQEIdAward;
                awardAvailibilityObject.seriesLabel = selectedAwardSeriesLable;
                GetQEAvailibilityList(awardAvailibilityObject);
            }
            break;
        case "#dAvailabilityLevel2TabAssessable":
            if (assessableAvailibilityObject.qualificationElementId != parentQEIdAssessable) {
                assessableAvailibilityObject.qualificationElementId = parentQEIdAssessable;
                assessableAvailibilityObject.seriesLabel = selectedAssessableSeriesLable;
                GetQEAvailibilityList(assessableAvailibilityObject);
            }
            break;
        case "#dAvailabilityLevel2TabLearningUnit":
            if (learningUnitAvailibilityObject.qualificationElementId != parentQEIdLearningUnit) {
                learningUnitAvailibilityObject.qualificationElementId = parentQEIdLearningUnit;
                learningUnitAvailibilityObject.seriesLabel = selectedLearningUnitSeriesLable;
                GetQEAvailibilityList(learningUnitAvailibilityObject);
            }
            break;
        case "#dAvailabilityLevel2TabPathway":
            if (pathwayAvailibilityObject.qualificationElementId != parentQEIdPathway) {
                pathwayAvailibilityObject.qualificationElementId = parentQEIdPathway;
                pathwayAvailibilityObject.seriesLabel = selectedPathwaySeriesLable;
                GetQEAvailibilityList(pathwayAvailibilityObject);
            }
            break;
        case "#dAssessmentMaterialTabScheme":
            if (schemeAssessmentMaterialObject.qualificationElementId != parentQEIdScheme || schemeAssessmentMaterialObject.availabilityId != availabilityIdScheme) {
                schemeAssessmentMaterialObject.qualificationElementId = parentQEIdScheme;
                schemeAssessmentMaterialObject.availabilityId = availabilityIdScheme;
                GetAssessmentMaterialAwardList(schemeAssessmentMaterialObject);
            }
            break;
        case "#dAssessmentMaterialTabAward":
            if (awardAssessmentMaterialObject.qualificationElementId != parentQEIdAward || awardAssessmentMaterialObject.availabilityId != availabilityIdAward) {
                awardAssessmentMaterialObject.qualificationElementId = parentQEIdAward;
                awardAssessmentMaterialObject.availabilityId = availabilityIdAward;
                GetAssessmentMaterialAwardList(awardAssessmentMaterialObject);
            }
            break;
        case "#dAssessmentMaterialTabLearningUnit":
            if (learningUnitAssessmentMaterialObject.qualificationElementId != parentQEIdLearningUnit || learningUnitAssessmentMaterialObject.availabilityId != availabilityIdLearningUnit) {
                learningUnitAssessmentMaterialObject.qualificationElementId = parentQEIdLearningUnit;
                learningUnitAssessmentMaterialObject.availabilityId = availabilityIdLearningUnit;
                GetAssessmentMaterialAwardList(learningUnitAssessmentMaterialObject);
            }
            break;
        case "#dAssessmentMaterialTabAssessable":
            if (assessableAssessmentMaterialObject.qualificationElementId != parentQEIdAssessable || assessableAssessmentMaterialObject.availabilityId != availabilityIdAssessable) {
                assessableAssessmentMaterialObject.qualificationElementId = parentQEIdAssessable;
                assessableAssessmentMaterialObject.availabilityId = availabilityIdAssessable;
                GetAssessmentMaterialAwardList(assessableAssessmentMaterialObject);
            }
            break;
        case "#dAssessmentMaterialTabPathway":
            if (pathwayAssessmentMaterialObject.qualificationElementId != parentQEIdPathway || pathwayAssessmentMaterialObject.availabilityId != availabilityIdPathway) {
                pathwayAssessmentMaterialObject.qualificationElementId = parentQEIdPathway;
                pathwayAssessmentMaterialObject.availabilityId = availabilityIdPathway;
                GetAssessmentMaterialAwardList(pathwayAssessmentMaterialObject);
            }
            break;
        case "#dKeyEventTabScheme":
            if (schemaKeyEventObject.qualificationElementId != parentQEIdScheme || schemaKeyEventObject.availabilityId != availabilityIdScheme) {
                schemaKeyEventObject.qualificationElementId = parentQEIdScheme;
                schemaKeyEventObject.availabilityId = availabilityIdScheme;
                GetQEKeyEventList(schemaKeyEventObject);
            }
            break;
        case "#dKeyEventTabAward":
            if (awardKeyEventObject.qualificationElementId != parentQEIdAward || awardKeyEventObject.availabilityId != availabilityIdAward) {
                awardKeyEventObject.qualificationElementId = parentQEIdAward;
                awardKeyEventObject.availabilityId = availabilityIdAward;
                GetQEKeyEventList(awardKeyEventObject);
            }
            break;
        case "#dKeyEventTabAssessable":
            if (assessableKeyEventObject.qualificationElementId != parentQEIdAssessable || assessableKeyEventObject.availabilityId != availabilityIdAssessable) {
                assessableKeyEventObject.qualificationElementId = parentQEIdAssessable;
                assessableKeyEventObject.availabilityId = availabilityIdAssessable;
                GetQEKeyEventList(assessableKeyEventObject);
            }
            break;
        case "#dKeyEventTabLearningUnit":
            if (learningUnitKeyEventObject.qualificationElementId != parentQEIdLearningUnit || learningUnitKeyEventObject.availabilityId != availabilityIdLearningUnit) {
                learningUnitKeyEventObject.qualificationElementId = parentQEIdLearningUnit;
                learningUnitKeyEventObject.availabilityId = availabilityIdLearningUnit;
                GetQEKeyEventList(learningUnitKeyEventObject);
            }
            break;
        case "#dKeyEventTabPathway":
            if (pathwayKeyEventObject.qualificationElementId != parentQEIdPathway || pathwayKeyEventObject.availabilityId != availabilityIdPathway) {
                pathwayKeyEventObject.qualificationElementId = parentQEIdPathway;
                pathwayKeyEventObject.availabilityId = availabilityIdPathway;
                GetQEKeyEventList(pathwayKeyEventObject);
            }
            break;
        case "#dGradeBoundaryTabAward":
            if (awardGradeBoundaryObject.qualificationElementId != parentQEIdAward || awardGradeBoundaryObject.availabilityId != availabilityIdAward) {
                awardGradeBoundaryObject.qualificationElementId = parentQEIdAward;
                awardGradeBoundaryObject.availabilityId = availabilityIdAward;
                GetQEGradeBoundaryList(awardGradeBoundaryObject);
            }
            break;
        case "#dGradeBoundaryTabLearningUnit":
            if (learningUnitGradeBoundaryObject.qualificationElementId != parentQEIdLearningUnit || learningUnitGradeBoundaryObject.availabilityId != availabilityIdLearningUnit) {
                learningUnitGradeBoundaryObject.qualificationElementId = parentQEIdLearningUnit;
                learningUnitGradeBoundaryObject.availabilityId = availabilityIdLearningUnit;
                GetQEGradeBoundaryList(learningUnitGradeBoundaryObject);
            }
            break;
        case "#dGradeBoundaryTabAssessable":
            if (assessableGradeBoundaryObject.qualificationElementId != parentQEIdAssessable || assessableGradeBoundaryObject.availabilityId != availabilityIdAssessable) {
                assessableGradeBoundaryObject.qualificationElementId = parentQEIdAssessable;
                assessableGradeBoundaryObject.availabilityId = availabilityIdAssessable;
                GetQEGradeBoundaryList(assessableGradeBoundaryObject);
            }
            break;
        case "#dGradeBoundaryTabPathway":
            if (pathwayGradeBoundaryObject.qualificationElementId != parentQEIdPathway || pathwayGradeBoundaryObject.availabilityId != availabilityIdPathway) {
                pathwayGradeBoundaryObject.qualificationElementId = parentQEIdPathway;
                pathwayGradeBoundaryObject.availabilityId = availabilityIdPathway;
                GetQEGradeBoundaryList(pathwayGradeBoundaryObject);
            }
            break;
        case "#dGradeBoundaryTabScheme":
            if (schemeGradeBoundaryObject.qualificationElementId != parentQEIdScheme || schemeGradeBoundaryObject.availabilityId != availabilityIdScheme) {
                schemeGradeBoundaryObject.qualificationElementId = parentQEIdScheme;
                schemeGradeBoundaryObject.availabilityId = availabilityIdScheme;
                GetQEGradeBoundaryList(schemeGradeBoundaryObject);
            }
            break;
        case "#dMaximumMarksTabAward":
            if (awardMaximumMarksObject.qualificationElementId != parentQEIdAward || awardMaximumMarksObject.availabilityId != availabilityIdAward) {
                awardMaximumMarksObject.qualificationElementId = parentQEIdAward;
                awardMaximumMarksObject.availabilityId = availabilityIdAward;
                GetQEMaximumMarksList(awardMaximumMarksObject);
            }
            break;
        case "#dMaximumMarksTabPathway":
            if (pathwayMaximumMarksObject.qualificationElementId != parentQEIdPathway || pathwayMaximumMarksObject.availabilityId != availabilityIdPathway) {
                pathwayMaximumMarksObject.qualificationElementId = parentQEIdPathway;
                pathwayMaximumMarksObject.availabilityId = availabilityIdPathway;
                GetQEMaximumMarksList(pathwayMaximumMarksObject);
            }
            break;
        case "#dMaximumMarksTabLearningUnit":
            if (learningUnitMaximumMarksObject.qualificationElementId != parentQEIdLearningUnit || learningUnitMaximumMarksObject.availabilityId != availabilityIdLearningUnit) {
                learningUnitMaximumMarksObject.qualificationElementId = parentQEIdLearningUnit;
                learningUnitMaximumMarksObject.availabilityId = availabilityIdLearningUnit;
                GetQEMaximumMarksList(learningUnitMaximumMarksObject);
            }
            break;
        case "#dMaximumMarksTabAssessable":
            if (assessableMaximumMarksObject.qualificationElementId != parentQEIdAssessable || assessableMaximumMarksObject.availabilityId != availabilityIdAssessable) {
                assessableMaximumMarksObject.qualificationElementId = parentQEIdAssessable;
                assessableMaximumMarksObject.availabilityId = availabilityIdAssessable;
                GetQEMaximumMarksList(assessableMaximumMarksObject);
            }
            break;
        case "#dMaximumMarksTabScheme":
            if (schemeMaximumMarksObject.qualificationElementId != parentQEIdScheme || schemeMaximumMarksObject.availabilityId != availabilityIdScheme) {
                schemeMaximumMarksObject.qualificationElementId = parentQEIdScheme;
                schemeMaximumMarksObject.availabilityId = availabilityIdScheme;
                GetQEMaximumMarksList(schemeMaximumMarksObject);
            }
            break;
        case "#dLearnerIdentifiersTabScheme":
            if (schemeLearnerIdentifierObject.qualificationElementId != parentQEIdScheme) {
                schemeLearnerIdentifierObject.qualificationElementId = parentQEIdScheme;
                GetQELearnerIdentifierList(schemeLearnerIdentifierObject);
            }
            break;
        case "#dLearnerIdentifiersTabAward":
            if (awardLearnerIdentifierObject.qualificationElementId != parentQEIdAward) {
                awardLearnerIdentifierObject.qualificationElementId = parentQEIdAward;
                GetQELearnerIdentifierList(awardLearnerIdentifierObject);
            }
            break;
        case "#dLearnerIdentifiersTabAssessable":
            if (assessableLearnerIdentifierObject.qualificationElementId != parentQEIdAssessable) {
                assessableLearnerIdentifierObject.qualificationElementId = parentQEIdAssessable;
                GetQELearnerIdentifierList(assessableLearnerIdentifierObject);
            }
            break;
        case "#dLearnerIdentifiersTabLearningUnit":
            if (learningUnitLearnerIdentifierObject.qualificationElementId != parentQEIdLearningUnit) {
                learningUnitLearnerIdentifierObject.qualificationElementId = parentQEIdLearningUnit;
                GetQELearnerIdentifierList(learningUnitLearnerIdentifierObject);
            }
            break;
        case "#dLearnerIdentifiersTabPathway":
            if (pathwayLearnerIdentifierObject.qualificationElementId != parentQEIdPathway) {
                pathwayLearnerIdentifierObject.qualificationElementId = parentQEIdPathway;
                GetQELearnerIdentifierList(pathwayLearnerIdentifierObject);
            }
            break;
        case "#dKeyEventFeeTabScheme":
            if (schemaKeyEventFeeObject.qualificationElementId != parentQEIdScheme || schemaKeyEventFeeObject.availabilityId != availabilityIdScheme) {
                schemaKeyEventFeeObject.qualificationElementId = parentQEIdScheme;
                schemaKeyEventFeeObject.availabilityId = availabilityIdScheme;
                GetQEKeyEventFeeList(schemaKeyEventFeeObject);
            }
            break;
        case "#dKeyEventFeeTabAward":
            if (awardKeyEventFeeObject.qualificationElementId != parentQEIdAward || awardKeyEventFeeObject.availabilityId != availabilityIdAward) {
                awardKeyEventFeeObject.qualificationElementId = parentQEIdAward;
                awardKeyEventFeeObject.availabilityId = availabilityIdAward;
                GetQEKeyEventFeeList(awardKeyEventFeeObject);
            }
            break;
        case "#dKeyEventFeeTabAssessable":
            if (assessableKeyEventFeeObject.qualificationElementId != parentQEIdAssessable || assessableKeyEventFeeObject.availabilityId != availabilityIdAssessable) {
                assessableKeyEventFeeObject.qualificationElementId = parentQEIdAssessable;
                assessableKeyEventFeeObject.availabilityId = availabilityIdAssessable;
                GetQEKeyEventFeeList(assessableKeyEventFeeObject);
            }
            break;
        case "#dKeyEventFeeTabLearningUnit":
            if (learningUnitKeyEventFeeObject.qualificationElementId != parentQEIdLearningUnit || learningUnitKeyEventFeeObject.availabilityId != availabilityIdLearningUnit) {
                learningUnitKeyEventFeeObject.qualificationElementId = parentQEIdLearningUnit;
                learningUnitKeyEventFeeObject.availabilityId = availabilityIdLearningUnit;
                GetQEKeyEventFeeList(learningUnitKeyEventFeeObject);
            }
            break;
        case "#dKeyEventFeeTabPathway":
            if (pathwayKeyEventFeeObject.qualificationElementId != parentQEIdPathway || pathwayKeyEventFeeObject.availabilityId != availabilityIdPathway) {
                pathwayKeyEventFeeObject.qualificationElementId = parentQEIdPathway;
                pathwayKeyEventFeeObject.availabilityId = availabilityIdPathway;
                GetQEKeyEventFeeList(pathwayKeyEventFeeObject);
            }
            break;
            //case "#dQualificationDetailsLevel2TabLearningUnit":
            //    if (selectedChildTabForLearningUnit != null && selectedChildTabForLearningUnit != "")
            //        PCDetailToLoad(selectedChildTabForLearningUnit);
            //break;
        case "#dRelationshipHierarchyTabPathway":
            if (pathwayRelationshipHierarchyObject.qualificationElementId != parentQEIdPathway) {
                pathwayRelationshipHierarchyObject.qualificationElementId = parentQEIdPathway;
                LoadRelationshipHierarchy(pathwayRelationshipHierarchyObject);
            }
            break;

        case "#dRelationshipHierarchyTabScheme":
            if (schemeRelationshipHierarchyObject.qualificationElementId != parentQEIdScheme) {
                schemeRelationshipHierarchyObject.qualificationElementId = parentQEIdScheme;
                LoadRelationshipHierarchy(schemeRelationshipHierarchyObject);
            }
            break;
        case "#dRelationshipHierarchyTabAward":
            if (awardRelationshipHierarchyObject.qualificationElementId != parentQEIdAward) {
                awardRelationshipHierarchyObject.qualificationElementId = parentQEIdAward;
                LoadRelationshipHierarchy(awardRelationshipHierarchyObject);
            }
            break;
        case "#dRelationshipHierarchyTabLearningUnit":
            if (learningUnitRelationshipHierarchyObject.qualificationElementId != parentQEIdLearningUnit) {
                learningUnitRelationshipHierarchyObject.qualificationElementId = parentQEIdLearningUnit;
                LoadRelationshipHierarchy(learningUnitRelationshipHierarchyObject);
            }
            break;
        case "#dRelationshipHierarchyTabAssessable":
            if (assessableRelationshipHierarchyObject.qualificationElementId != parentQEIdAssessable) {
                assessableRelationshipHierarchyObject.qualificationElementId = parentQEIdAssessable;
                LoadRelationshipHierarchy(assessableRelationshipHierarchyObject);
            }
            break;

        case "#dGradeRangeTabScheme":
            if (schemeGradeRangeObject.qualificationElementId != parentQEIdScheme) {
                schemeGradeRangeObject.qualificationElementId = parentQEIdScheme;
                GetQEGradeRangeList(schemeGradeRangeObject);
            }
            break;
        case "#dGradeRangeTabAward":
            if (awardGradeRangeObject.qualificationElementId != parentQEIdAward) {
                awardGradeRangeObject.qualificationElementId = parentQEIdAward;
                GetQEGradeRangeList(awardGradeRangeObject);
            }
            break;
        case "#dGradeRangeTabLearningUnit":
            if (learningUnitGradeRangeObject.qualificationElementId != parentQEIdLearningUnit) {
                learningUnitGradeRangeObject.qualificationElementId = parentQEIdLearningUnit;
                GetQEGradeRangeList(learningUnitGradeRangeObject);
            }
            break;
        case "#dGradeRangeTabAssessable":
            if (assessableGradeRangeObject.qualificationElementId != parentQEIdAssessable) {
                assessableGradeRangeObject.qualificationElementId = parentQEIdAssessable;
                GetQEGradeRangeList(assessableGradeRangeObject);
            }
            break;
        case "#dGradeRangeTabPathway":
            if (pathwayGradeRangeObject.qualificationElementId != parentQEIdPathway) {
                pathwayGradeRangeObject.qualificationElementId = parentQEIdPathway;
                GetQEGradeRangeList(pathwayGradeRangeObject);
            }
            break;
    }

}

//Child tab click event
function PCDetailTabClickEvent(qeTypeTabName, e) {
    var target = $(e.target).attr("href") // activated tab
    if (target != "#dschemesTab" && target != "#dawardsTab" && target != "#dlearningUnitsTab" && target != "#dassessablesTab" && target != "#dpathwayTab") {
        SetChildTabActive(qeTypeTabName, target);
        PCDetailToLoad(target);
    }

    switch (target) {
        case "#dQualificationDetailsLevel2TabScheme":
            PCDetailToLoad(selectedChildTabForScheme);
            break;
        case "#dQualificationDetailsLevel2TabAward":
            PCDetailToLoad(selectedChildTabForAward);
            break;
        case "#dQualificationDetailsLevel2TabLearningUnit":
            PCDetailToLoad(selectedChildTabForLearningUnit);
            break;
        case "#dQualificationDetailsLevel2TabAssessable":
            PCDetailToLoad(selectedChildTabForAssessable);
            break;
        case "#dQualificationDetailsLevel2TabPathway":
            PCDetailToLoad(selectedChildTabForPathway);
            break;
    }
}

function SetAndFillLevel3TabForScheme() {

    if (selectedLevel3AvailabilityTabForScheme == null) {
        selectedLevel3AvailabilityTabForScheme = "#dKeyEventTabScheme";
        $('#schemeAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForScheme + '"]').tab('show');
    }
    else
        PCDetailToLoad(selectedLevel3AvailabilityTabForScheme);
}

function SetAndFillLevel3TabForAssessable() {

    if (selectedLevel3AvailabilityTabForAssessable == null) {
        selectedLevel3AvailabilityTabForAssessable = "#dKeyEventTabAssessable";
        $('#assessableAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForAssessable + '"]').tab('show');
    }
    else
        PCDetailToLoad(selectedLevel3AvailabilityTabForAssessable);
}

function SetAndFillLevel3TabForAward() {

    if (selectedLevel3AvailabilityTabForAward == null) {
        selectedLevel3AvailabilityTabForAward = "#dKeyEventTabAward";
        $('#awardAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForAward + '"]').tab('show');
    }
    else
        PCDetailToLoad(selectedLevel3AvailabilityTabForAward);
}

function SetAndFillLevel3TabForLearningUnit() {

    if (selectedLevel3AvailabilityTabForLearningUnit == null) {
        selectedLevel3AvailabilityTabForLearningUnit = "#dKeyEventTabLearningUnit";
        $('#learningUnitAvailabilityChildTab a[href="' + selectedLevel3AvailabilityTabForLearningUnit + '"]').tab('show');
    }
    else
        PCDetailToLoad(selectedLevel3AvailabilityTabForLearningUnit);
}




//function LoadQETypeAndSeriesLable(qualificationElementType, awardingOrganisationCentreId) {
//    busyDiv();
//    postJSON('/Catalogue/GetQualificationTypeByQualificationElementType/', {
//        qualificationElementType: qualificationElementType,
//        awardingOrganisationCentreId: awardingOrganisationCentreId
//    }, function (result) {

//        var options = $("#qulificationTypePathway");
//        options.empty();
//        $.each(result, function () {
//            options.append($("<option />").val(this.Value).text(this.Text));
//        });
//        options.val('');
//        $("#s2id_qulificationTypePathway .select2-chosen").text(allText);
//        clearDiv();
//    });

//    postJSON('/Catalogue/GetSeriesLabelByQualificationElementType/', {
//        qualificationElementType: qualificationElementType,
//        awardingOrganisationCentreId: awardingOrganisationCentreId
//    }, function (result) {

//        var options = $("#seriesLablePathway");
//        options.empty();
//        $.each(result, function () {
//            options.append($("<option />").val(this.Value).text(this.Text));
//        });
//        options.val('');
//        $("#s2id_seriesLablePathway .select2-chosen").text(allText);
//        clearDiv();
//    });
//}

if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) === 0;
    };
}

