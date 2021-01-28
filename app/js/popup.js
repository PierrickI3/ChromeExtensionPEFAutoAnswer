window.onload = function () {
  var settings = {};

  // var handShakeTimeoutId;

  // var browserConnectorMessageHandlers = {
  //   handShake: function (message) {
  //     console.log('Received the first post message from the crm web client successfully!');
  //     stopHandShake();
  //   },
  //   onConnectionChanged: function (data) {
  //     if (data) {
  //       if (data.isConnected === true) {
  //         toolbarIconService.setToolbarIconToActiveIcon();
  //       } else {
  //         toolbarIconService.setToolbarIconToInactiveIcon();
  //       }
  //     }
  //   },
  //   urlScreenPop: function (message) {
  //     chrome.tabs.create({ url: message.url });
  //   },
  //   createPopupWindow: function (data) {
  //     chrome.windows.create({
  //       url: data.url,
  //       allowScriptsToClose: true,
  //       height: 500,
  //       width: 500,
  //       type: 'popup',
  //     });
  //   },
  // };

  // var contentScriptOrBackgroundScriptMessageHandlers = {
  //   clickToCall: function (data) {
  //     if (data.number || data.address) {
  //       window.focus();
  //       postMessageToBrowserConnector(data);
  //     }
  //   },
  // };

  // var windowEventHandlers = {
  //   unload: function () {
  //     sendMessageToBackgroundScript({ type: 'unload' });
  //   },
  // };

  var CLIENT_WIDTH = 200;
  var CLIENT_HEIGHT = 450;

  function init() {
    resizeWindowWithFrame(CLIENT_WIDTH, CLIENT_HEIGHT);
    settingsHelper.getSettings(function (data) {
      settings = data;
      addExtensionInfo(settings);
      var url = settingsHelper.fixUrl(settings.url);
      loadIframe(url);
    });
    // subscribeToMessagesFromBrowserConnector();
    // subscribeToMessagesFromContentScriptOrBackgroundScript();
    // subscribeToWindowEvents();
    // subscribeToStorageEvents();
    // translateContents();
  }

  function addExtensionInfo(data) {
    var manifest = chrome.runtime.getManifest();
    data.extensionId = chrome.runtime.id;
    data.extensionName = manifest.name;
    data.extensionVersion = manifest.version;
    data.extensionUniqueName = data.extensionName + '_' + data.extensionVersion + '_' + data.extensionId;
  }

  var iframe;

  function loadIframe(url) {
    iframe = document.getElementById('crmClient');
    console.log('Loading iframe: ' + url);
    iframe.src = url;
    // iframe.addEventListener('load', function () {
    //   stopHandShake();
    //   repeatHandShake();
    // });
  }

  // function sendHandShakeMessage() {
  //   console.log('Sending a handshake message');
  //   postMessageToBrowserConnector({ type: 'handShake', settings: settings });
  // }

  // function repeatHandShake() {
  //   sendHandShakeMessage();
  //   handShakeTimeoutId = setTimeout(repeatHandShake, 1000);
  // }

  // function stopHandShake() {
  //   if (handShakeTimeoutId) {
  //     clearTimeout(handShakeTimeoutId);
  //     handShakeTimeoutId = null;
  //   }
  // }

  // function subscribeToMessagesFromBrowserConnector() {
  //   window.addEventListener('message', function (event) {
  //     var data = parseEventData(event);
  //     console.log('Received a message from Browser Connector: ' + JSON.stringify(data));
  //     var handler = browserConnectorMessageHandlers[data.type];
  //     if (handler) {
  //       handler(data);
  //     }
  //   });
  // }

  // function parseEventData(event) {
  //   var data = event && event.data;
  //   if (data) {
  //     try {
  //       data = JSON.parse(data);
  //     } catch (e) {}
  //   }
  //   return data;
  // }

  // function subscribeToWindowEvents() {
  //   for (var eventName in windowEventHandlers) {
  //     if (windowEventHandlers.hasOwnProperty(eventName)) {
  //       window.addEventListener(eventName, windowEventHandlers[eventName]);
  //     }
  //   }
  // }

  // function subscribeToMessagesFromContentScriptOrBackgroundScript() {
  //   chrome.runtime.onMessage.addListener(function (event) {
  //     console.log('Received a message from a content script or background page: ' + JSON.stringify(event));
  //     var handler = contentScriptOrBackgroundScriptMessageHandlers[event.type];
  //     if (handler) {
  //       handler(event);
  //     }
  //   });
  // }

  // function subscribeToStorageEvents() {
  //   chrome.storage.onChanged.addListener(function (changes, namespace) {
  //     for (var key in changes) {
  //       if (changes.hasOwnProperty(key)) {
  //         var storageChange = changes[key];
  //         console.log('Storage key "%s" changed. Old value was "%s", new value is "%s"', key, storageChange.oldValue, storageChange.newValue);
  //         if (key === 'url') {
  //           window.location.reload();
  //         }
  //       }
  //     }
  //   });
  // }

  // function postMessageToBrowserConnector(message) {
  //   if (typeof message != 'string') {
  //     message = JSON.stringify(message);
  //   }
  //   console.log('Posting a message to Browser Connector: ' + message);
  //   iframe.contentWindow.postMessage(message, '*');
  // }

  // function sendMessageToBackgroundScript(message) {
  //   console.log('Sending a message to a background script: ' + JSON.stringify(message));
  //   chrome.runtime.sendMessage(message);
  // }

  // function translateContents() {
  //   document.getElementsByTagName('title')[0].textContent = chrome.i18n.getMessage('appTitle');
  // }

  function resizeWindowWithFrame(width, height) {
    var diffWidth = window.outerWidth - window.innerWidth;
    var diffHeight = window.outerHeight - window.innerHeight;
    window.resizeTo(width + diffWidth, height + diffHeight);
  }

  init();
};
