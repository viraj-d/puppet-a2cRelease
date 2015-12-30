
BrowserCache = function () {

}

BrowserCache.IsStorageAvailable = function () {
    if (typeof (Storage) == undefined) {
        alert('Webstorage is not available.');
        return false;
    }
    return true;
}

var Methods = {
    AddItem: function (key, value) {
        if (Methods.IsItemExist(key)) {
            alert('Item is already exist.');
        }
        else {
            localStorage.setItem(key, value);
        }
    },
    EditItem: function (key, value) {
        localStorage.setItem(key, value);
    },
    ClearItem: function (key) {
        localStorage.removeItem(key);
    },
    GetItem: function (key) {
        return localStorage.getItem(key);
    },
    IsItemExist: function (key) {
        if (localStorage.getItem(key) == undefined)
            return false;
        return true;
    },
    ClearAllItems: function () {
        window.localStorage.clear();
    }
};

BrowserCache.Add = function (key, value) {
    Methods.AddItem(key, value);
}

BrowserCache.Edit = function (key, value) {
    Methods.EditItem(key, value);
}

BrowserCache.Clear = function (key) {
    Methods.ClearItem(key);
}

BrowserCache.Get = function (Key) {
    return Methods.GetItem(Key);
}

BrowserCache.ClearAllItems = function () {
    Methods.ClearAllItems();
}

/* Static Keys for cache. */
BrowserCache.Key = {
    Header: "A2Cheader",
    LeftMenu: 'A2CleftMenu',
    BodyClass: 'A2CbodyClass',
    HeaderClass : 'A2CheaderClass',
    LastWizUpdate: 'A2ClastWizUpdate',
    Theme: 'A2Ctheme',
    LastVisitedDashboardTab: 'A2CactiveTab',
    SchoolUserListView: 'A2CSchoolUserListView',
    ErrorLogListView: 'ErrorLogListView',
    TransactionLogListView: 'TransactionLogListView',
    AuditLogListView: 'AuditLogListView',
    TransactionLogSuccessListView: 'TransactionLogSuccessListView'
}

if (BrowserCache.Get(BrowserCache.Key.Theme) != null) {
    var style = document.createElement("style");
    var attr = document.createAttribute("type");
    attr.value = "text/css";
    style.setAttributeNode(attr);
    style.appendChild(document.createTextNode(BrowserCache.Get(BrowserCache.Key.Theme)));
    document.getElementsByTagName("head")[0].appendChild(style);
}
