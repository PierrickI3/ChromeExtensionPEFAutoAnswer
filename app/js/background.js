(function () {
  const OLD_CHROME_EXTENSION_ID = 'jggihgggkggcaiehcnkmldpheaihblom';

  var popUpWindowId;

  var popUpMessageHandlers = {
    unload: function () {
      toolbarIconService.setToolbarIconToInactiveIcon();
    },
  };

  function init() {
    toolbarIconService.onToolbarIconClicked(function () {
      popUpExists(function (exists) {
        if (!exists) {
          createPopUp();
        } else {
          focusPopUp();
        }
      });
    });

    chrome.windows.onRemoved.addListener(function (windowId) {
      if (popUpWindowId == windowId) {
        toolbarIconService.setToolbarIconToInactiveIcon();
      }
    });

    subscribeToMessagesFromPopup();

    createRightClickToMakeCallContextMenu();
  }

  function popUpExists(callback) {
    if (popUpWindowId) {
      chrome.windows.get(popUpWindowId, { windowTypes: ['popup'] }, function (win) {
        if (win) {
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  }

  function createPopUp() {
    chrome.windows.create(
      {
        url: 'popup.html',
        type: 'popup',
        top: 9999,
        left: 9999,
        width: 200,
        height: 473,
      },
      function (win) {
        console.log('Popup created: ' + JSON.stringify(win));
        popUpWindowId = win.id;
      }
    );
  }

  function focusPopUp() {
    if (popUpWindowId) {
      chrome.windows.update(popUpWindowId, {
        focused: true,
      });
    }
  }

  function subscribeToMessagesFromPopup() {
    chrome.runtime.onMessage.addListener(function (event) {
      var handler = popUpMessageHandlers[event.type];
      if (handler) {
        handler(event);
      }
    });
  }

  function createRightClickToMakeCallContextMenu() {
    var MAKE_CALL_CONTEXT_MENU_ID = 'clickToCall';

    chrome.contextMenus.create({
      title: chrome.i18n.getMessage('contextMenuMakeCall'),
      id: MAKE_CALL_CONTEXT_MENU_ID,
      contexts: ['selection'],
    });

    chrome.contextMenus.onClicked.addListener(function (event) {
      console.log('Context menu is clicked: ' + JSON.stringify(event));
      if (event.menuItemId == MAKE_CALL_CONTEXT_MENU_ID) {
        sendMessageToPopup({
          number: event.selectionText,
          type: 'clickToCall',
        });
      }
    });
  }

  function sendMessageToPopup(message) {
    chrome.runtime.sendMessage(message);
  }

  function onChromeRuntimeExternalMessage(data, sender, sendResponse) {
    if (sender.id === OLD_CHROME_EXTENSION_ID) {
      if (data.type) {
        var handler = chromeExternalMessageHandlers[data.type];
        if (handler) {
          handler(data);
        } else {
          console.log('no handler found for external message type: ' + data.type);
        }
      } else {
        console.warn('external message type not supported: ' + JSON.stringify(data));
      }
    }
  }

  var chromeExternalMessageHandlers = {
    saveSettings: function (message) {
      var settingsToSave = {
        url: message.url,
        clickToDial: message.clickToDial,
        enableServerSideLogging: message.enableServerSideLogging,
        enableConfigurableCallerID: message.enableConfigurableCallerID,
      };
      console.log('Saving settings in the storage: ' + JSON.stringify(settingsToSave));
      chrome.storage.sync.set(settingsToSave);
    },
  };

  init();
})();
