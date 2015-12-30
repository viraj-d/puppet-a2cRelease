var schoolUserGrid = null;

function LoadSchoolUserList()
{
    if (!schoolUserGrid) {
        schoolUserGrid = $("#userGrid").A2CGrid({
            gridKey: 'schoolUserGrid',
            url: '/SchoolUser/GetSchoolUserList',
            /*data: function () { },*/
            pageable: true,
            Sortable: true,
            filterable: true,
            clearefilter: true,
            scrollable: true,
            selectable: "multiple",
            autoResize: true,
            gridState: BrowserCache.Get(BrowserCache.Key.SchoolUserListView),
            onStateChangCallBack: function () {
                BrowserCache.Edit(BrowserCache.Key.SchoolUserListView, this.getOptions());
            },
            columns: [
                    { field: "UserName", title: Username, tooltip: Username, type: "string", width: "15%" },
                    { field: "Forename", title: Forename, tooltip: Forename, type: "string", width: "15%" },
                    { field: "Surname", title: Surname, tooltip: Surname, type: "string", width: "15%" },
                    { field: "Role", title: Role, tooltip: Role, type: "string", width: "40%" },
                    { field: "Status", title: Status, tooltip: Status, type: "string", width: "15%" }
            ]
        });
        schoolUserGrid.Render();
    }
    else {
        schoolUserGrid.Refresh();
    }
}
function DeleteUser() {
    if ($("#form0").valid() == false) {
        return false;
    }
    var rows = schoolUserGrid.Selected();
    var selectedUserIds = '';
    var isLicenseUser = false;
    var licenseUser = '';
    rows.forEach(function (row) {
        if (row.IsLicenseKeyUser) {
            isLicenseUser = true;
            licenseUser = row.UserName;
        }
        else {
            selectedUserIds += row.UserId + ',';
        }
    });
    ClearValidationMessage();
    if (selectedUserIds.length > 0) {
        selectedUserIds= selectedUserIds.substring(0, selectedUserIds.length - 1);
        showConfirmationMessage(UserDeleteConfirmation, function () {
            postJSON('/SchoolUser/DeleteUsers', { userIds: selectedUserIds }, function (data) {
                if (data.result) {
                    DisplaySuccess(DeleteUserSuccess, 'form0', true);
                    schoolUserGrid.Refresh();
                }
                else {
                    DisplayInformation(data.errorMsg, 'form0', true);
                    schoolUserGrid.Refresh();
                }
            });
        });
    }
    else if (!isLicenseUser)
    {
        DisplayError([{ Id: '', ErrorMessages: [UserSelect] }], 'form0', true);
        return false;
    }
    if (isLicenseUser)
    {
        DisplayError([{ Id: '', ErrorMessages: [LKeyUserNotDelete.format([licenseUser])] }], 'form0', true);
        return false;
}
}

function UnLockUser() {
    if ($("#form0").valid() == false) {
        return false;
    }
    var rows = schoolUserGrid.Selected();
    var selectedUserIds = '';
    var selectedUserNames = '';
    var AnyLocked = false;
    var isLicenseUser = false;
    var licenseUser = '';

    rows.forEach(function (row) {
        if (row.IsLicenseKeyUser) {
            isLicenseUser = true;
            licenseUser = row.UserName;
        }
        else {
        selectedUserIds += row.UserId + ',';
        selectedUserNames += row.UserName + ',';
        if (row.Status == 'Locked')
            AnyLocked = true;
        }
    });
    ClearValidationMessage();
    if (selectedUserIds.length > 0) {

        if (AnyLocked == false)
        {
            selectedUserNames = selectedUserNames.substring(0, selectedUserNames.length - 1);
            DisplayError([{ Id: '', ErrorMessages: [jQuery.validator.format(UnLockOtherthanLocked, selectedUserNames)] }], 'form0',true);
        }
        else
        {
            selectedUserIds = selectedUserIds.substring(0, selectedUserIds.length - 1);
                postJSON('/SchoolUser/UnlockUsers', { userIds: selectedUserIds }, function (data) {
                    if (data.result) {
                        DisplaySuccess(UnLockSuccess, 'form0',true);
                        schoolUserGrid.Refresh();
                    }
                    else {
                        DisplayInformation(data.errorMsg, 'form0',true);
                        schoolUserGrid.Refresh();
                    }
                });
        }
    }
    else if (!isLicenseUser) {
        DisplayError([{ Id: '', ErrorMessages: [UserSelect] }], 'form0', true);
        return false;
    }
    if (isLicenseUser) {
        DisplayError([{ Id: '', ErrorMessages: [LKeyUserNotLock.format([licenseUser])] }], 'form0', true);
        return false;
    }
}

function DeactivateUser() {
    if ($("#form0").valid() == false) {
        return false;
    }
    var rows = schoolUserGrid.Selected();
    var selectedUserIds = '';
    var selectedUserNames = '';
    var AnyActive = false;
    var isLicenseUser = false;
    var licenseUser = '';
    rows.forEach(function (row) {
        if (row.IsLicenseKeyUser) {
            isLicenseUser = true;
            licenseUser = row.UserName;
        }
        else {
        selectedUserIds += row.UserId + ',';
        selectedUserNames += row.UserName + ',';
        if (row.Status == 'Activated' || row.Status == 'Locked')
            AnyActive = true;
        }
    });
    ClearValidationMessage();
    if (selectedUserIds.length > 0) {

        if (AnyActive == false) {
            selectedUserNames = selectedUserNames.substring(0, selectedUserNames.length - 1);
            DisplayError([{ Id: '', ErrorMessages: [jQuery.validator.format(AlreadyDeactivatedUser, selectedUserNames)] }], 'form0', true);            
        }
        else {
            selectedUserIds = selectedUserIds.substring(0, selectedUserIds.length - 1);
            postJSON('/SchoolUser/DeactivateUsers', { userIds: selectedUserIds }, function (data) {
                if (data.result) {
                    DisplaySuccess(DeactivatedSuccess, 'form0', true);
                    schoolUserGrid.Refresh();
                }               
            });
        }
    }
    else if (!isLicenseUser) {
        DisplayError([{ Id: '', ErrorMessages: [UserSelect] }], 'form0', true);
        return false;
    }
    if (isLicenseUser) {
        DisplayError([{ Id: '', ErrorMessages: [LKeyUserNotDeactivate.format([licenseUser])] }], 'form0', true);
        return false;
    }
}

function ActivateUser() {
    if ($("#form0").valid() == false) {
        return false;
    }
    var rows = schoolUserGrid.Selected();
    var selectedUserIds = '';
    var selectedUserNames = '';
    var AnyDeactive = false;
    var isLicenseUser = false;
    var licenseUser = '';
    rows.forEach(function (row) {
        if (row.IsLicenseKeyUser) {
            isLicenseUser = true;
            licenseUser = row.UserName;
        }
        else {
        selectedUserIds += row.UserId + ',';
        selectedUserNames += row.UserName + ',';
        if (row.Status == 'Deactivated')
            AnyDeactive = true;
        }
    });
    ClearValidationMessage();
    if (selectedUserIds.length > 0) {

        if (AnyDeactive == false) {
            selectedUserNames = selectedUserNames.substring(0, selectedUserNames.length - 1);
            DisplayError([{ Id: '', ErrorMessages: [jQuery.validator.format(AlreadyActivatedUser, selectedUserNames)] }], 'form0', true);
        }
        else {
            selectedUserIds = selectedUserIds.substring(0, selectedUserIds.length - 1);
            postJSON('/SchoolUser/ActivateUsers', { userIds: selectedUserIds }, function (data) {
                if (data.result) {
                    DisplaySuccess(ActivatedSuccess, 'form0', true);
                    schoolUserGrid.Refresh();
                }
            });
        }
    }
    else if (!isLicenseUser) {
        DisplayError([{ Id: '', ErrorMessages: [UserSelect] }], 'form0', true);
        return false;
    }
    if (isLicenseUser) {
        DisplayError([{ Id: '', ErrorMessages: [LKeyUserNotActive.format([licenseUser])] }], 'form0', true);
        return false;
    }
}

function EditShowError(errors) {
    try {
        if (errors) {
            DisplayError(JSON.parse(errors));
        }
    } catch (e) { }
}

function EditUser()
{
    if (schoolUserGrid) {
        var selectedRow = schoolUserGrid.SelectedRowLength();
        if (selectedRow <= 0) {
            DisplayError([{ Id: '', ErrorMessages: [UserSelect] }]);
        }
        else if (selectedRow > 1) {
            DisplayError([{ Id: '', ErrorMessages: [SelectOneRecord] }]);
        }
        else
        {
            var rows = schoolUserGrid.Selected();
            if (rows && rows.length > 0) {
                if (rows[0].Status == 'Deactivated') {
                    DisplayError([{ Id: '', ErrorMessages: [DeactivatedEditMessage] }]);
                }
                else {
                    if (rows[0].IsLicenseKeyUser) {
                        DisplayError([{ Id: '', ErrorMessages: [LKeyUserNotEdit.format([rows[0].UserName])] }], 'form0', true);
                    }
                    else {
                    window.location.href = jQuery.validator.format('/SchoolUser/Edit/{0}', rows[0].UserId);
                }
            }
            }
            else
            {
                DisplayError([{ Id: '', ErrorMessages: [UserSelect] }]);
            }
        }
    }
    else{
        DisplayError([{ Id: '', ErrorMessages: [UserSelect] }]);
    }
}

function EditSchoolUser()
{
    if ($("#form0").valid() == false) {
        return false;
    }
    var schoolUser = {
        SelectedRoles: $("#SelectedRoles").val() || [],
        UserName: $('#UserName').val(),
        Forename: $('#Forename').val(),
        Surname: $('#Surname').val(),
        Email: $('#Email').val(),
        Password: $('#Password').val(),
        ConfirmPassword: $('#ConfirmPassword').val(),
        UserId: editUserId,
    };
    postJSON('/SchoolUser/Edit', schoolUser, function (result) {
        if (result && result.status) {
            window.location.href = '/SchoolUser/Index/2';
        }
        else {
            DisplayError(result.errorMsg);
        }
    });
}

function AddUser()
{
    window.location.href = '/SchoolUser/Add';
}
function SchoolCancel()
{
    window.location.href = '/SchoolUser/Index';
}
function AddSchoolUser()
{
    if ($("#form0").valid() == false) {
        return false;
    }
    var schoolUser = {
        SelectedRoles: $("#SelectedRoles" ).val() || [],
        UserName: $('#UserName').val(),
        Forename: $('#Forename').val(),
        Surname: $('#Surname').val(),
        Email: $('#Email').val(),
    };
    postJSON('/SchoolUser/Add', schoolUser, function (result) {
        if (result && result.status)
        {
            window.location.href = '/SchoolUser/Index/1';

        }
        else
        {
            DisplayError(result.errorMsg);
        }
    });
}