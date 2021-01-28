/**
 * The content script gets run on page load (in sand-box environment), parses DOM elements in the page and
 * register handlers that intercept clicks on tel links to perform click-to-dial in pc4chrome.
 */
(function () {
  var FIREFOX_EXTENSION_ID = 'purecloudForFirefox@mypurecloud.com';

  var pendingClickToDial = false;

  var dataKeys = {
    DATA_KEY_NUMBER_TO_DIAL: 'inin_numbertodial',
    DATA_KEY_EMAIL_ADDRESS_TO_USE: 'inin_emailtoaddress',
  };

  function init() {
    startParsingPage();
  }

  function startParsingPage() {
    var populateData = function (items) {
      var isClickToDialEnabled = items.clickToDial;
      if (isClickToDialEnabled) {
        convertTelLinks();
        convertMailtoLinks();
      }
    };

    settingsHelper.getSettings(function (settings) {
      populateData(settings);
    });
  }

  function convertTelLinks() {
    $('a').each(function () {
      var $a = $(this);
      var href = $a.attr('href') || '';
      if (href.indexOf('tel:') == 0) {
        var number = href.substr(4);
        $a.attr('title', 'Dial ' + number);
        $a.attr('data-' + dataKeys.DATA_KEY_NUMBER_TO_DIAL, number);
        $a.click(onClickToDial);
      }
    });
  }

  function convertMailtoLinks() {
    $('a').each(function () {
      var $a = $(this);
      var href = $a.attr('href') || '';
      if (href.indexOf('mailto:') == 0) {
        var email = href.substr(7);
        $a.attr('title', 'Email ' + email);
        $a.attr('data-' + dataKeys.DATA_KEY_EMAIL_ADDRESS_TO_USE, email);
        $a.click(onClickToDial);
      }
    });
  }

  function onClickToDial(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var elem = e.target;
    var number = elem.dataset[dataKeys.DATA_KEY_NUMBER_TO_DIAL];
    var email = elem.dataset[dataKeys.DATA_KEY_EMAIL_ADDRESS_TO_USE];
    if (number || email) {
      try {
        if (!pendingClickToDial) {
          pendingClickToDial = true;

          var data = { type: 'clickToCall' };
          if (number) {
            data.number = number;
          } else if (email) {
            data.address = email;
          }

          sendMessageToPopup(data);
          setTimeout(function () {
            pendingClickToDial = false;
          }, 1000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function sendMessageToPopup(message) {
    console.log('Sending a message to popup window: ' + JSON.stringify(message));
    if (browserHelperService.isFirefox()) {
      chrome.runtime.sendMessage(FIREFOX_EXTENSION_ID, message);
    } else {
      chrome.runtime.sendMessage(message);
    }
  }

  init();
})();
