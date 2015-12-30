
$(this.document).ready(function () {
    LoadTransactionLogSuccessList();
});

var grid;
var selectedRequestId = 0;
var resendRequestIdStatusList = [];
function LoadTransactionLogSuccessList() {
    if (grid == undefined) {
        grid = $("#grid").A2CGrid({
            gridKey: 'grid',
            url: '/ViewMessage/GetTransactionLogSuccessList',
            pageable: true,
            Sortable: true,
            onSelectCallBack: ResetSelectedMessage,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "multiple",
            autoResize: true,
            maxRowCount: 10,                         
            dataBound: function () {
                ResetSelectedMessage();
            },
            gridState: BrowserCache.Get(BrowserCache.Key.TransactionLogSuccessListView),            
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.TransactionLogSuccessListView, this.getOptions());
            },
            columns: [
                { field: "CentreNumber", title: ViewMessageCentre, tooltip: ViewMessageCentre, type: "string", width: "10%" },
                { field: "AwardingOrganisation", title: ViewMessageAO, tooltip: ViewMessageAO, type: "string", width: "12%" }
                , { field: "OutgoingSequence", title: ViewMessageSequence, tooltip: ViewMessageSequence, type: "integer", width: "15%" }
                , { field: "LastModifiedDate", title: ViewMessageTransactionDate, tooltip: ViewMessageTransactionDate, type: "date", width: "15%", format: javaScriptDateTimeFormat },
                { field: "TransactionName", title: ViewMessageTransactionName, tooltip: ViewMessageTransactionName, type: "string", width: "20%" },
                { field: "FileName", title: ViewMessageFileName, tooltip: ViewMessageFileName, type: "string", width: "10%" }
                , { field: "A2CMessageGuid", title: ViewMessageGUID, tooltip: ViewMessageGUID, type: "string", width: "18%" }
            ]
        });
        grid.Render();
    }
    else {
        grid.ClearSortFilter();
    }
}
function ResetSelectedMessage() {
    var rows = grid.Selected();
    if (rows.length == 1 && rows[0].A2CTransactionRequestId == selectedRequestId) {
        return;
    }
    selectedRequestId = 0;
    $('#mainTabContent').hide();
}
function SetEnvelope(envelope) {
    if (envelope) {
        $('#envelopeContent').show();
        $('#attachmentContent').hide();
    }
    else {
        $('#envelopeContent').hide();
        $('#attachmentContent').show();

    }
}
function ResendRequestInBlock(startIndex, resendRequests) {
    if (startIndex >= resendRequests.length) {
        if (resendRequestIdStatusList.length > 0) {
            var successEdi = [];
            var successXml = [];
            var failEdi = [];
            var failXml = [];

            for (var sendStatusIndex = 0; sendStatusIndex < resendRequestIdStatusList.length; sendStatusIndex = sendStatusIndex + 1) {
                var resendRequestIdStatus = resendRequestIdStatusList[sendStatusIndex];
                if (resendRequestIdStatus.SuccessStatus) {
                    if (resendRequestIdStatus.IsXml) {
                        successXml.push(resendRequestIdStatus.Message);
                    }
                    else {
                        successEdi.push(resendRequestIdStatus.Message);
                    }
                }
                else {
                    if (resendRequestIdStatus.IsXml) {
                        failXml.push(resendRequestIdStatus.Message);
                    }
                    else {
                        failEdi.push(resendRequestIdStatus.Message);
                    }
                }
            }
            var firstTime = false;
            if (successXml.length > 0) {
                DisplaySuccess(SuccessXmlMessage.format([successXml.join(', ')]), undefined, firstTime);
                firstTime = true;
            }
            if (successEdi.length > 0) {
                DisplaySuccess(SuccessEdiMessage.format([successEdi.join(', ')]), undefined, firstTime);
                firstTime = true;
            }
            if (failXml.length > 0) {
                var errorMsg = [];
                errorMsg.push(FailXmlMessage.format([failXml.join(', ')]));
                var errorData = {
                    Id: '',
                    ErrorMessages: errorMsg
                }
                var errorDataArray = [];
                errorDataArray.push(errorData);
                DisplayError(errorDataArray, undefined, firstTime);
                firstTime = true;
            }
            if (failEdi.length > 0) {
                var errorMsg = [];
                errorMsg.push(FailEdiMessage.format([failEdi.join(', ')]));
                var errorData = {
                    Id: '',
                    ErrorMessages: errorMsg
                }
                var errorDataArray = [];
                errorDataArray.push(errorData);
                DisplayError(errorDataArray, undefined, firstTime);
            }
            clearDiv();
            if (successXml.length > 0 || successEdi.length > 0)
                LoadTransactionLogSuccessList();

        }
    }
    else {
        var selectedIndexBlockLength = startIndex + 10;
        if (selectedIndexBlockLength > resendRequests.length)
            selectedIndexBlockLength = resendRequests.length;

        var resendRequestsBlock = [];
        for (var selectedIndexBlock = startIndex; selectedIndexBlock < selectedIndexBlockLength; selectedIndexBlock++) {
            resendRequestsBlock.push(resendRequests[selectedIndexBlock].A2CTransactionRequestId);
        }

        var resendRequestsBlock;
        postJSON('/ViewMessage/ResendMessage/', {
            resendRequestIdList: resendRequestsBlock
        }, function (data) {
            $.merge(resendRequestIdStatusList, data);
            ResendRequestInBlock(selectedIndexBlockLength, resendRequests);
        });
    }
}

function ResendRequest() {
    resendRequestIdStatusList = [];
    var rows = grid.Selected();
    ClearValidationMessage();
    if (rows.length == 0) {
        var errorMsg = [];
        errorMsg.push(SelectNoRecordFound);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);
        return;
    }
    busyDiv();
    var isXmlFile = false;
    var resendRequests = [];
    rows.forEach(function (row, index) {
        resendRequests.push({
            A2CTransactionRequestId: row.A2CTransactionRequestId,
            AwardingOrganisationCentreId: row.AwardingOrganisationCentreId,
            OutgoingSequence: row.OutgoingSequence,
            LastModifiedDate : row.LastModifiedDate
        });
    });
    resendRequests.sort(function (a, b) {
        var aAwardingOrganisationCentreId = a.AwardingOrganisationCentreId;
        var bAwardingOrganisationCentreId = b.AwardingOrganisationCentreId;
        var aOutgoingSequence = a.OutgoingSequence;
        var bOutgoingSequence = b.OutgoingSequence;
        var alastModifiedDate = a.LastModifiedDate;
        var blastModifiedDate = b.LastModifiedDate;
        if (aAwardingOrganisationCentreId == bAwardingOrganisationCentreId) {            
            return (aOutgoingSequence < bOutgoingSequence) ? -1 : (aOutgoingSequence > bOutgoingSequence) ? 1 : 
                ((alastModifiedDate < blastModifiedDate) ? -1 : (alastModifiedDate > blastModifiedDate) ? 1 : 0);
        }
        else {
            return (aAwardingOrganisationCentreId < bAwardingOrganisationCentreId) ? -1 : 1;
        }
    });
    ResendRequestInBlock(0, resendRequests);

}
function ViewRequest() {
    var rows = grid.Selected();
    ClearValidationMessage();
    if (rows.length == 0) {
        var errorMsg = [];
        errorMsg.push(SelectNoRecordFound);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);
        return;
    }
    if (rows.length > 1) {
        var errorMsg = [];
        errorMsg.push(ViewMessageViewMultipleValidation);
        var errorData = {
            Id: '',
            ErrorMessages: errorMsg
        }
        var errorDataArray = [];
        errorDataArray.push(errorData);
        DisplayError(errorDataArray);
        return;
    }
    var isXmlFile = false;
    rows.forEach(function (row, index) {
        selectedRequestId = row.A2CTransactionRequestId;
        isXmlFile = (row.A2CMessageGuid == '' || row.A2CMessageGuid == null) ? false : true;
    });
    busyDiv();
    postJSON('/ViewMessage/GetMessageDetails/', {
        transactionRequestId: selectedRequestId,
        isXmlFile: isXmlFile
    }, function (data) {
        clearDiv();
        $('#mainTabContent').show();
        $('#preEnvelopeContent').html(data.Envelope);
        $('#preAttachmentContent').html(data.Message);
        $("#attachmentTabUl li:eq(0) a").tab('show');
        SetEnvelope(true);
    });
}