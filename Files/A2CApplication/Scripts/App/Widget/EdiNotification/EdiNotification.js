function GetEDIFileDetials(fileName, transactionName, transactionResponseEnvelopeEdiId, transactionRequestId) {
    var popupTitle;
    switch (transactionName) {
        case 'R':
            popupTitle = PreviewResultFileRT;
            break;
        case 'F':
            popupTitle = PreviewForecastFileRT;
            break;
        case 'M':
            popupTitle = PreviewCourseworkFileRT;
            break;
        case 'A':
            popupTitle = PreviewAmendmentFileRT;
            break;
        case 'E':
            popupTitle = PreviewEntryFileRT;
            break;

    }
    var CommentsArgJson = { fileName: fileName, transactionName: transactionName, transactionResponseEnvelopeEdiId: transactionResponseEnvelopeEdiId, transactionRequestId: transactionRequestId };
    $.A2C.ModalPopup({
        Title: popupTitle,
        DynamicContent: { Type: "POST", URL: '/Widget/EdiFilePreviewPopup', Data: CommentsArgJson },
        ShowPopUp: true,
        OnLoadCallback: function () { $('.modal-body').css('word-wrap', 'break-word'); }
    });


}

function PreviewEDIFile(transactionName, transactionResponseEnvelopeEdiId, transactionRequestId) {
    if (transactionResponseEnvelopeEdiId != null && transactionResponseEnvelopeEdiId > 0) {
        busyDiv();
        PreviewResultEdiFile(transactionResponseEnvelopeEdiId);
        clearDiv();
    }
    else if (transactionRequestId != null && transactionRequestId > 0) {
        busyDiv();
        switch (transactionName) {
            case 'F':
                PreviewForecastGradeEdiFile(transactionRequestId, 'F');
                break;
            case 'M':
                PreviewCourseworkMarkEdiFile(transactionRequestId, 'M');
                break;
            case 'A':
                PreviewEntryEdiFile(transactionRequestId, 'A');
                break;
            case 'E':
                PreviewEntryEdiFile(transactionRequestId, 'E');
                break;
        }
        clearDiv();
    }
}

function PreviewResultEdiFile(transactionResponseEnvelopeEdiId) {
    $("#ediDataGrid").A2CGrid({
        gridKey: 'ediDataGrid',
        url: '/Widget/GetReceivedEdiFileDetails',
        //dataSource: ediData,
        data: function () {
            var ediDataDto = { transactionResponseEnvelopeEdiId: transactionResponseEnvelopeEdiId };
            return ediDataDto
        },
        pageable: false,
        sortable: false,
        filterable: false,
        clearefilter: true,
        scrollable: true,
        selectable: "single",
        autoResize: true,
        maxRowCount: 10,
        columnMenu: false,
        dataBound: function () {
            clearDiv();
            InvalidFileMessage();
        },
        columns: [
                    { field: "DataType", title: DataTypeRT, tooltip: DataTypeRT, type: "string", width: "55px", sortable: false, filterable: false },
                    { field: "RecordType", title: RecordTypeRT, tooltip: RecordTypeRT, type: "string", width: "60px", sortable: false, filterable: false },
                    { field: "CentreNumber", title: CentreNumberRT, tooltip: CentreNumberRT, type: "string", width: "70px", sortable: false, filterable: false },
                    { field: "CandidateNumber", title: CandidateNumberRT, tooltip: CandidateNumberRT, type: "string", width: "75px", sortable: false, filterable: false },
                    { field: "UniqueCandidateIdentifier", title: UniqueCandidateIdentifierRT, tooltip: UniqueCandidateIdentifierRT, type: "string", width: "125px", sortable: false, filterable: false },
                    { field: "UniqueLearnerNumber", title: UniqueLearnerNumberRT, tooltip: UniqueLearnerNumberRT, type: "string", width: "110px", sortable: false, filterable: false },
                    { field: "EntryCode", title: EntryCodeRT, tooltip: EntryCodeRT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "ResultsCode", title: ResultsCodeRT, tooltip: ResultsCodeRT, type: "string", width: "65px", sortable: false, filterable: false },
                    { field: "ResultType", title: ResultTypeRT, tooltip: ResultTypeRT, type: "string", width: "60px", sortable: false, filterable: false },
                    { field: "Grades", title: GradesRT, tooltip: GradesRT, type: "string", width: "90px", sortable: false, filterable: false }
        ]
    }).Render();
}

function PreviewEntryEdiFile(transactionRequestId, transactionName) {
    $("#ediDataGrid").A2CGrid({
        gridKey: 'ediDataGrid',
        url: '/Widget/GetSentEdiFileDetails',
        data: function () {
            var ediDataDto = { transactionRequestId: transactionRequestId, transactionName: transactionName };
            return ediDataDto
        },
        pageable: false,
        Sortable: false,
        filterable: false,
        clearefilter: true,
        scrollable: true,
        selectable: "single",
        autoResize: true,
        maxRowCount: 10,
        columnMenu: false,
        dataBound: function () {
            clearDiv();
            InvalidFileMessage();
        },
        columns: [
                    { field: "DataType", title: DataTypeRT, tooltip: DataTypeRT, type: "string", width: "55px", sortable: false, filterable: false, columns: false },
                    { field: "RecordType", title: RecordTypeRT, tooltip: RecordTypeRT, type: "string", width: "60px", sortable: false, filterable: false },
                    { field: "CandidateStatus", title: CandidateStatusRT, tooltip: CandidateStatusRT, type: "string", width: "75px", sortable: false, filterable: false },
                    { field: "CentreNumber", title: CentreNumberRT, tooltip: CentreNumberRT, type: "string", width: "70px", sortable: false, filterable: false },
                    { field: "CandidateNumber", title: CandidateNumberRT, tooltip: CandidateNumberRT, type: "string", width: "75px", sortable: false, filterable: false },
                    { field: "CandidateName", title: CandidateNameRT, tooltip: CandidateNameRT, type: "string", width: "205px", sortable: false, filterable: false },
                    { field: "Sex", title: SexRT, tooltip: SexRT, type: "string", width: "40px", sortable: false, filterable: false },
                    { field: "DateOfBirth", title: DateofBirthRT, tooltip: DateofBirthRT, type: "string", width: "70px", sortable: false, filterable: false },
                    { field: "CandidateIdentifier", title: CandidateIdentifierRT, tooltip: CandidateIdentifierRT, type: "string", width: "125px", sortable: false, filterable: false },
                    { field: "PupilNumber", title: PupilNumberRT, tooltip: PupilNumberRT, type: "string", width: "125px", sortable: false, filterable: false },
                    { field: "UniqueLearnerNumber", title: UniqueLearnerNumberRT, tooltip: UniqueLearnerNumberRT, type: "string", width: "110px", sortable: false, filterable: false },
                    { field: "Qualifier", title: QualifierFlagRT, tooltip: QualifierFlagRT, type: "string", width: "70px", sortable: false, filterable: false },
                    { field: "OptionalCentreNumber", title: OptionalCentreNumberRT, tooltip: OptionalCentreNumberRT, type: "string", width: "110px", sortable: false, filterable: false },
                    { field: "OptionalCandidateNumber", title: OptionalCandidateNumberRT, tooltip: OptionalCandidateNumberRT, type: "string", width: "130px", sortable: false, filterable: false },
                    { field: "DocumentationGroup", title: DocumentationGroupRT, tooltip: DocumentationGroupRT, type: "string", width: "100px", sortable: false, filterable: false },

                    
                    { field: "OptionEntryCode1", title: OptionEntryCode1RT, tooltip: OptionEntryCode1RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator1", title: OptionEntryIndicator1RT, tooltip: OptionEntryIndicator1RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode2", title: OptionEntryCode2RT, tooltip: OptionEntryCode2RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator2", title: OptionEntryIndicator2RT, tooltip: OptionEntryIndicator2RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode3", title: OptionEntryCode3RT, tooltip: OptionEntryCode3RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator3", title: OptionEntryIndicator3RT, tooltip: OptionEntryIndicator3RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode4", title: OptionEntryCode4RT, tooltip: OptionEntryCode4RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator4", title: OptionEntryIndicator4RT, tooltip: OptionEntryIndicator4RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode5", title: OptionEntryCode5RT, tooltip: OptionEntryCode5RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator5", title: OptionEntryIndicator5RT, tooltip: OptionEntryIndicator5RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode6", title: OptionEntryCode6RT, tooltip: OptionEntryCode6RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator6", title: OptionEntryIndicator6RT, tooltip: OptionEntryIndicator6RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode7", title: OptionEntryCode7RT, tooltip: OptionEntryCode7RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator7", title: OptionEntryIndicator7RT, tooltip: OptionEntryIndicator7RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode8", title: OptionEntryCode8RT, tooltip: OptionEntryCode8RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator8", title: OptionEntryIndicator8RT, tooltip: OptionEntryIndicator8RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode9", title: OptionEntryCode9RT, tooltip: OptionEntryCode9RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator9", title: OptionEntryIndicator9RT, tooltip: OptionEntryIndicator9RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode10", title: OptionEntryCode10RT, tooltip: OptionEntryCode10RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator10", title: OptionEntryIndicator10RT, tooltip: OptionEntryIndicator10RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode11", title: OptionEntryCode11RT, tooltip: OptionEntryCode11RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator11", title: OptionEntryIndicator11RT, tooltip: OptionEntryIndicator11RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryCode12", title: OptionEntryCode12RT, tooltip: OptionEntryCode12RT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "OptionEntryIndicator12", title: OptionEntryIndicator12RT, tooltip: OptionEntryIndicator12RT, type: "string", width: "90px", sortable: false, filterable: false }


        ]
    }).Render();
}

function PreviewForecastGradeEdiFile(transactionRequestId, transactionName) {
    $("#ediDataGrid").A2CGrid({
        gridKey: 'ediDataGrid',
        url: '/Widget/GetSentEdiFileDetails',
        data: function () {
            var ediDataDto = { transactionRequestId: transactionRequestId, transactionName: transactionName };
            return ediDataDto
        },
        pageable: false,
        Sortable: false,
        filterable: false,
        clearefilter: true,
        scrollable: true,
        selectable: "single",
        autoResize: true,
        maxRowCount: 10,
        columnMenu: false,
        dataBound: function () {
            clearDiv();
            InvalidFileMessage();
        },
        columns: [
                    { field: "DataType", title: DataTypeRT, tooltip: DataTypeRT, type: "string", width: "55px", sortable: false, filterable: false },
                    { field: "RecordType", title: RecordTypeRT, tooltip: RecordTypeRT, type: "string", width: "60px", sortable: false, filterable: false },
                    { field: "CentreNumber", title: CentreNumberRT, tooltip: CentreNumberRT, type: "string", width: "80px", sortable: false, filterable: false },
                    { field: "CandidateNumber", title: CandidateNumberRT, tooltip: CandidateNumberRT, type: "string", width: "85px", sortable: false, filterable: false },
                    { field: "EntryCode", title: EntryCodeRT, tooltip: EntryCodeRT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "FirstGrade", title: FirstGradeRT, tooltip: FirstGradeRT, type: "string", width: "70px", sortable: false, filterable: false },
                    { field: "SecondGrade", title: SecondGradeRT, tooltip: SecondGradeRT, type: "string", width: "80px", sortable: false, filterable: false }
        ]
    }).Render();
}

function PreviewCourseworkMarkEdiFile(transactionRequestId, transactionName) {
    $("#ediDataGrid").A2CGrid({
        gridKey: 'ediDataGrid',
        url: '/Widget/GetSentEdiFileDetails',
        data: function () {
            var ediDataDto = { transactionRequestId: transactionRequestId, transactionName: transactionName };
            return ediDataDto
        },
        pageable: false,
        Sortable: false,
        filterable: false,
        clearefilter: true,
        scrollable: true,
        selectable: "single",
        autoResize: true,
        maxRowCount: 10,
        columnMenu: false,
        dataBound: function () {
            clearDiv();
            InvalidFileMessage();
        },
        columns: [
                    { field: "DataType", title: DataTypeRT, tooltip: DataTypeRT, type: "string", width: "55px", sortable: false, filterable: false },
                    { field: "RecordType", title: RecordTypeRT, tooltip: RecordTypeRT, type: "string", width: "60px", sortable: false, filterable: false },
                    { field: "CentreNumber", title: CentreNumberRT, tooltip: CentreNumberRT, type: "string", width: "70px", sortable: false, filterable: false },
                    { field: "CandidateNumber", title: CandidateNumberRT, tooltip: CandidateNumberRT, type: "string", width: "75px", sortable: false, filterable: false },
                    { field: "ComponentCode", title: ComponentCodeRT, tooltip: ComponentCodeRT, type: "string", width: "105px", sortable: false, filterable: false },
                    { field: "MarkGradeStatus", title: MarkGradeStatusRT, tooltip: MarkGradeStatusRT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "MarkGrade", title: MarkGradeRT, tooltip: MarkGradeRT, type: "string", width: "90px", sortable: false, filterable: false },
                    { field: "PreviousCentreNumber", title: PreviousCentreNumberRT, tooltip: PreviousCentreNumberRT, type: "string", width: "110px", sortable: false, filterable: false },
                    { field: "PreviousCandidateNumber", title: PreviousCandidateNumberRT, tooltip: PreviousCandidateNumberRT, type: "string", width: "135px", sortable: false, filterable: false },
                    { field: "PreviousSeries", title: PreviousSeriesRT, tooltip: PreviousSeriesRT, type: "string", width: "80px", sortable: false, filterable: false }
        ]
    }).Render();
}

function InvalidFileMessage() {
    if ($("#ediDataGrid").data("kendoGrid").dataSource.total() == 0) {
        $('#ediDataGrid').hide();
        var errorMsg = [];
        errorMsg.push(InvalidEdiFormatRT);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray, "ediPopupContent", false);

    }
    else if ($("#ediDataGrid").data("kendoGrid").dataSource.total() == -1) {
        $('#ediDataGrid').hide();
        var errorMsg = [];
        errorMsg.push(InvalidEdiFormatRT + " " + CheckBusinessErrorLogRT);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray, "ediPopupContent", false);
    }
    else {
        $('#ediDataGrid').show();
    }
}

function DownloadEdiFile(fileName, transactionResponseEnvelopeEdiId, transactionRequestId) {
    var data = {
        fileName: fileName,
        transactionResponseEnvelopeEdiId: transactionResponseEnvelopeEdiId,
        transactionRequestId: transactionRequestId
    };
    busyDiv();
    postJSON('/Widget/DownloadEdiFile', data, function (result) {
        if (result.status == false) {
            if (result.error!="")
                DisplayError([{ Id: '', ErrorMessages: [result.error] }], 'ediPopupContent', false);
        }
        else {
            window.location = "../Widget/EdiFileDownload?fileName=" + fileName + "&transactionResponseEnvelopeEdiId=" + transactionResponseEnvelopeEdiId + "&transactionRequestId=" + transactionRequestId;
        }
        clearDiv();
    });
}