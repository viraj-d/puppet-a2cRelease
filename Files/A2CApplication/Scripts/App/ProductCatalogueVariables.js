var schemeGrid = null;
var awardGrid = null;
var learningUnitGrid = null;
var assessableGrid = null;
var qePathwayGrid = null;
var titleQEPathway
var isFirstTimeAutoLoad = false;
var schemeTabLoadedForAoCentreId = 0;
var awardTabLoadedForAoCentreId = 0;
var learningUnitTabLoadedForAoCentreId = 0;
var assessableTabLoadedForAoCentreId = 0;
var pathwayTabLoadedForAoCentreId = 0;

var searchTextValue;
var searchPCDetailsForColumn;

var parentQEIdScheme = 0, parentQEIdAward = 0, parentQEIdLearningUnit = 0, parentQEIdAssessable = 0, parentQEIdPathway = 0;
var availabilityIdScheme = 0, availabilityIdAward = 0, availabilityIdLearningUnit = 0, availabilityIdAssessable = 0, availabilityIdPathway = 0;

var selectedChildTabForScheme = null;
var selectedLevel2QualificationDetailsTabForScheme = null;
var selectedLevel3AvailabilityTabForScheme = null;
var selectedChildTabForAward = null;
var selectedLevel2QualificationDetailsTabForAward = null;
var selectedLevel3AvailabilityTabForAward = null;
var selectedChildTabForAssessable = null;
var selectedLevel2QualificationDetailsTabForAssessable = null;
var selectedLevel3AvailabilityTabForAssessable = null;
var selectedChildTabForLearningUnit = null;
var selectedLevel2QualificationDetailsTabForLearningUnit = null;
var selectedLevel3AvailabilityTabForLearningUnit = null;
var selectedChildTabForPathway = null;
var selectedLevel2QualificationDetailsTabForPathway = null;
var selectedLevel3AvailabilityTabForPathway = null;

var selectedSchemeSeriesLable = ''
var selectedAwardSeriesLable = ''
var selectedAssessableSeriesLable = ''
var selectedLearningUnitSeriesLable = ''
var selectedPathwaySeriesLable = ''
var selectedSchemaqulificationType = ''
var selectedSeriesAwardType = ''


var pathwayTreeNodeList = null;
var pathwayTree = null;

var schemeAssessmentMaterialObject = {
    grid: undefined,
    gridKey: 'QEAssessmentMaterialGridScheme',
    divId: '#qeAssessmentMaterialGridScheme',
    qualificationElementId: 0,
    availabilityId: 0
}

var awardAssessmentMaterialObject = {
    grid: undefined,
    gridKey: 'QEAssessmentMaterialGridAward',
    divId: '#qeAssessmentMaterialGridAward',
    qualificationElementId: 0,
    availabilityId: 0
}

var learningUnitAssessmentMaterialObject = {
    grid: undefined,
    gridKey: 'QEAssessmentMaterialGridLearningUnit',
    divId: '#qeAssessmentMaterialGridLearningUnit',
    qualificationElementId: 0,
    availabilityId: 0
}

var assessableAssessmentMaterialObject = {
    grid: undefined,
    gridKey: 'QEAssessmentMaterialGridAssessable',
    divId: '#qeAssessmentMaterialGridAssessable',
    qualificationElementId: 0,
    availabilityId: 0
}
var pathwayAssessmentMaterialObject = {
    grid: undefined,
    gridKey: 'QEAssessmentMaterialGridPathway',
    divId: '#qeAssessmentMaterialGridPathway',
    qualificationElementId: 0,
    availabilityId: 0
}
var schemaAvailibilityObject = {
    grid: undefined,
    gridKey: 'QEAvailibilityGridScheme',
    divId: '#qeAvailibilityGridScheme',
    qualificationElementId: 0,
    seriesLabel: '',
    parentQEType: "Scheme"
}

var awardAvailibilityObject = {
    grid: undefined,
    gridKey: 'QEAvailibilityGridAward',
    divId: '#qeAvailibilityGridAward',
    qualificationElementId: 0,
    seriesLabel: '',
    parentQEType: "Award"
}

var learningUnitAvailibilityObject = {
    grid: undefined,
    gridKey: 'QEAvailibilityGridLearningUnit',
    divId: '#qeAvailibilityGridLearningUnit',
    qualificationElementId: 0,
    seriesLabel: '',
    parentQEType: "LearningUnit"
}

var assessableAvailibilityObject = {
    grid: undefined,
    gridKey: 'QEAvailibilityGridAssessable',
    divId: '#qeAvailibilityGridAssessable',
    qualificationElementId: 0,
    seriesLabel: '',
    parentQEType: "Assessable"
}

var pathwayAvailibilityObject = {
    grid: undefined,
    gridKey: 'QEAvailibilityGridPathway',
    divId: '#qeAvailibilityGridPathway',
    qualificationElementId: 0,
    seriesLabel: '',
    parentQEType: "Pathway"
}
/*****Key event****/
var schemaKeyEventObject = {
    grid: undefined,
    gridKey: 'QEKeyEventGridScheme',
    divId: '#qeKeyEventTabScheme',
    qualificationElementId: 0,
    availabilityId : 0
}

var awardKeyEventObject = {
    grid: undefined,
    gridKey: 'QEKeyEventGridAward',
    divId: '#qeKeyEventTabAward',
    qualificationElementId: 0,
    availabilityId: 0    
}

var learningUnitKeyEventObject = {
    grid: undefined,
    gridKey: 'QEKeyEventGridLearningUnit',
    divId: '#qeKeyEventTabLearningUnit',
    qualificationElementId: 0,
    availabilityId: 0
}

var assessableKeyEventObject = {
    grid: undefined,
    gridKey: 'QEKeyEventGridAssessable',
    divId: '#qeKeyEventTabAssessable',
    qualificationElementId: 0,
    availabilityId: 0
}

var pathwayKeyEventObject = {
    grid: undefined,
    gridKey: 'QEKeyEventGridPathway',
    divId: '#qeKeyEventTabPathway',
    qualificationElementId: 0,
    availabilityId: 0
}
/***** end*****/

/*****Grade Boundary****/
var awardGradeBoundaryObject = {
    grid: undefined,
    gridKey: 'QEGradeBoundaryGridAward',
    divId: '#qeGradeBoundaryGridAward',
    qualificationElementId: 0,
    availabilityId: 0
}

var schemeGradeBoundaryObject = {
    grid: undefined,
    gridKey: 'QEGradeBoundaryTabScheme',
    divId: '#qeGradeBoundaryTabScheme',
    qualificationElementId: 0,
    availabilityId: 0
}

var learningUnitGradeBoundaryObject = {
    grid: undefined,
    gridKey: 'QEGradeBoundaryTabLearningUnit',
    divId: '#qeGradeBoundaryTabLearningUnit',
    qualificationElementId: 0,
    availabilityId: 0
}

var assessableGradeBoundaryObject = {
    grid: undefined,
    gridKey: 'QEGradeBoundaryTabAssessable',
    divId: '#qeGradeBoundaryTabAssessable',
    qualificationElementId: 0,
    availabilityId: 0
}

var pathwayGradeBoundaryObject = {
    grid: undefined,
    gridKey: 'QEGradeBoundaryTabPathway',
    divId: '#qeGradeBoundaryTabPathway',
    qualificationElementId: 0,
    availabilityId: 0
}

/***** end*****/

/*****Maximum Marks****/
var awardMaximumMarksObject = {
    grid: undefined,
    gridKey: 'QEMaximumMarksTabAward',
    divId: '#qeMaximumMarksTabAward',
    qualificationElementId: 0,
    availabilityId: 0
}

var schemeMaximumMarksObject = {
    grid: undefined,
    gridKey: 'QEMaximumMarksTabScheme',
    divId: '#qeMaximumMarksTabScheme',
    qualificationElementId: 0,
    availabilityId: 0
}

var assessableMaximumMarksObject = {
    grid: undefined,
    gridKey: 'QEMaximumMarksTabAssessable',
    divId: '#qeMaximumMarksTabAssessable',
    qualificationElementId: 0,
    availabilityId: 0
}

var learningUnitMaximumMarksObject = {
    grid: undefined,
    gridKey: 'QEMaximumMarksTabLearningUnit',
    divId: '#qeMaximumMarksTabLearningUnit',
    qualificationElementId: 0,
    availabilityId: 0
}

var pathwayMaximumMarksObject = {
    grid: undefined,
    gridKey: 'QEMaximumMarksTabPathway',
    divId: '#qeMaximumMarksTabPathway',
    qualificationElementId: 0,
    availabilityId: 0
}

/***** end*****/

/*****Key event fee****/
var schemaKeyEventFeeObject = {
    grid: undefined,
    gridKey: 'QEKeyEventFeeGridScheme',
    divId: '#qeKeyEventFeeTabScheme',
    qualificationElementId: 0,
    availabilityId: 0
}

var awardKeyEventFeeObject = {
    grid: undefined,
    gridKey: 'QEKeyEventFeeGridAward',
    divId: '#qeKeyEventFeeTabAward',
    qualificationElementId: 0,
    availabilityId: 0
}

var learningUnitKeyEventFeeObject = {
    grid: undefined,
    gridKey: 'QEKeyEventFeeGridLearningUnit',
    divId: '#qeKeyEventFeeTabLearningUnit',
    qualificationElementId: 0,
    availabilityId: 0
}

var assessableKeyEventFeeObject = {
    grid: undefined,
    gridKey: 'QEKeyEventFeeGridAssessable',
    divId: '#qeKeyEventFeeTabAssessable',
    qualificationElementId: 0,
    availabilityId: 0
}

var pathwayKeyEventFeeObject = {
    grid: undefined,
    gridKey: 'QEKeyEventFeeGridPathWay',
    divId: '#qeKeyEventFeeTabPathway',
    qualificationElementId: 0,
    availabilityId: 0
}

/***** end*****/

var schemeRelationshipObject = {
    grid: undefined,
    gridKey: 'QERelationshipGridScheme',
    divId: '#qeRelationshipGridScheme',
    qualificationElementId: 0
}

var awardRelationshipObject = {
    grid: undefined,
    gridKey: 'QERelationshipGridAward',
    divId: '#qeRelationshipGridAward',
    qualificationElementId: 0
}

var learningUnitRelationshipObject = {
    grid: undefined,
    gridKey: 'QERelationshipGridLearningUnit',
    divId: '#qeRelationshipGridLearningUnit',
    qualificationElementId: 0
}
var assessableRelationshipObject = {
    grid: undefined,
    gridKey: 'QERelationshipGridAssessable',
    divId: '#qeRelationshipGridAssessable',
    qualificationElementId: 0
}

var pathwayRelationshipObject = {
    grid: undefined,
    gridKey: 'QERelationshipGridPathway',
    divId: '#qeRelationshipGridPathway',
    qualificationElementId: 0
}

var pathwayLearnerIdentifierObject = {
    grid: undefined,
    gridKey: 'QELearnerIdentifierGridPathway',
    divId: '#qeLearnerIdentifierGridPathway',
    qualificationElementId: 0
}

var pathwayPreferenceObject = {
    grid: undefined,
    gridKey: 'QEPreferenceGridPathway',
    divId: '#qePreferenceGridPathway',
    qualificationElementId: 0
}

var schemePreferenceObject = {
    grid: undefined,
    gridKey: 'QEPreferenceGridScheme',
    divId: '#qePreferenceGridScheme',
    qualificationElementId: 0
}

var awardPreferenceObject = {
    grid: undefined,
    gridKey: 'QEPreferenceGridAward',
    divId: '#qePreferenceGridAward',
    qualificationElementId: 0
}

var learningUnitPreferenceObject = {
    grid: undefined,
    gridKey: 'QEPreferenceGridLearningUnit',
    divId: '#qePreferenceGridLearningUnit',
    qualificationElementId: 0
}
var assessablePreferenceObject = {
    grid: undefined,
    gridKey: 'QEPreferenceGridAssessable',
    divId: '#qePreferenceGridAssessable',
    qualificationElementId: 0
}
var schemeLearnerIdentifierObject = {
    grid: undefined,
    gridKey: 'QELearnerIdentifierGridScheme',
    divId: '#qeLearnerIdentifierGridScheme',
    qualificationElementId: 0
}

var awardLearnerIdentifierObject = {
    grid: undefined,
    gridKey: 'QELearnerIdentifierGridAward',
    divId: '#qeLearnerIdentifierGridAward',
    qualificationElementId: 0
}

var learningUnitLearnerIdentifierObject = {
    grid: undefined,
    gridKey: 'QELearnerIdentifierGridLearningUnit',
    divId: '#qeLearnerIdentifierGridLearningUnit',
    qualificationElementId: 0
}
var assessableLearnerIdentifierObject = {
    grid: undefined,
    gridKey: 'QELearnerIdentifierGridAssessable',
    divId: '#qeLearnerIdentifierGridAssessable',
    qualificationElementId: 0
}


var schemeRelationshipHierarchyObject = {
    tree: undefined,
    treeKey: 'QERelationshipHierarchyTreeScheme',
    divId: '#qeRelationshipHierarchyTreeScheme',
    qualificationElementId: 0
}
var awardRelationshipHierarchyObject = {
    tree: undefined,
    treeKey: 'QERelationshipHierarchyTreeAward',
    divId: '#qeRelationshipHierarchyTreeAward',
    qualificationElementId: 0
}
var learningUnitRelationshipHierarchyObject = {
    tree: undefined,
    treeKey: 'QERelationshipHierarchyTreeLearningUnit',
    divId: '#qeRelationshipHierarchyTreeLearningUnit',
    qualificationElementId: 0
}
var assessableRelationshipHierarchyObject = {
    tree: undefined,
    treeKey: 'QERelationshipHierarchyTreeAssessable',
    divId: '#qeRelationshipHierarchyTreeAssessable',
    qualificationElementId: 0
}
var pathwayRelationshipHierarchyObject = {
    tree: undefined,
    treeKey: 'QERelationshipHierarchyTreePathway',
    divId: '#qeRelationshipHierarchyTreePathway',
    qualificationElementId: 0
}

var schemeGradeRangeObject = {
    grid: undefined,
    gridKey: 'QEGradeRangeGridScheme',
    divId: '#qeGradeRangeGridScheme',
    qualificationElementId: 0
}

var awardGradeRangeObject = {
    grid: undefined,
    gridKey: 'QEGradeRangeGridAward',
    divId: '#qeGradeRangeGridAward',
    qualificationElementId: 0
}

var learningUnitGradeRangeObject = {
    grid: undefined,
    gridKey: 'QEGradeRangeGridLearningUnit',
    divId: '#qeGradeRangeGridLearningUnit',
    qualificationElementId: 0
}
var assessableGradeRangeObject = {
    grid: undefined,
    gridKey: 'QEGradeRangeGridAssessable',
    divId: '#qeGradeRangeGridAssessable',
    qualificationElementId: 0
}

var pathwayGradeRangeObject = {
    grid: undefined,
    gridKey: 'QEGradeRangeGridPathway',
    divId: '#qeGradeRangeGridPathway',
    qualificationElementId: 0
}
