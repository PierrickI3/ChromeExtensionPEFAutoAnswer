var toolbarIconService = {
  onToolbarIconClicked: function (callback) {
    chrome.browserAction.onClicked.addListener(callback);
  },
  setToolbarIconToActiveIcon: function () {
    chrome.browserAction.setIcon({ path: 'assets/img/logo38.png' });
  },
  setToolbarIconToInactiveIcon: function () {
    chrome.browserAction.setIcon({ path: 'assets/img/inactiveLogo38.png' });
  },
};
