(function () {
  var settings = {};

  var urlLabel = document.getElementById('urlLabel'),
    urlInput = document.getElementById('url'),
    clickToDialLabel = document.getElementById('clickToDialLabel'),
    clickToDialCheckbox = document.getElementById('clickToDial'),
    enableServerSideLoggingLabel = document.getElementById('enableServerSideLoggingLabel'),
    enableServerSideLoggingCheckbox = document.getElementById('enableServerSideLogging'),
    enableConfigurableCallerIDLabel = document.getElementById('enableConfigurableCallerIDLabel'),
    enableConfigurableCallerIDCheckbox = document.getElementById('enableConfigurableCallerID'),
    enableSSOCheckBox = document.getElementById('enableSsoSettings'),
    ssoProvider = document.getElementById('ssoProvider'),
    ssoOrganization = document.getElementById('ssoOrganization'),
    ssoError = document.getElementById('ssoError'),
    dedicatedLoginWindowCheckbox = document.getElementById('dedicatedLoginWindowCheckbox'),
    dedicatedLoginWindowLabel = document.getElementById('dedicatedLoginWindowLabel'),
    enableCallHistoryCheckbox = document.getElementById('enableCallHistory'),
    enableCallHistoryLabel = document.getElementById('enableCallHistoryLabel'),
    searchExternalContactsCheckbox = document.getElementById('searchExternalContacts'),
    searchExternalContactsLabel = document.getElementById('searchExternalContactsLabel'),
    defaultOutboundSMSCountryCodeDropdown = document.getElementById('defaultOutboundSMSCountryCode'),
    defaultOutboundSMSCountryCodeLabel = document.getElementById('defaultOutboundSMSCountryCodeLabel'),
    selectCountryCodeOption = document.getElementById('selectCountryCodeOption'),
    saveButton = document.getElementById('save'),
    cancelButton = document.getElementById('cancel');

  function init() {
    registerEventListeners();
    translateContents();
  }

  function registerEventListeners() {
    document.addEventListener('DOMContentLoaded', restoreOptions);
    urlInput.addEventListener('keyup', onOptionsChanged);
    clickToDialCheckbox.addEventListener('change', onOptionsChanged);
    enableServerSideLoggingCheckbox.addEventListener('change', onOptionsChanged);
    enableConfigurableCallerIDCheckbox.addEventListener('change', onOptionsChanged);
    enableSSOCheckBox.addEventListener('change', onOptionsChanged);
    enableSSOCheckBox.addEventListener('click', showSSOInputs);
    ssoProvider.addEventListener('keyup', onOptionsChanged);
    ssoOrganization.addEventListener('keyup', onOptionsChanged);
    dedicatedLoginWindowCheckbox.addEventListener('change', onOptionsChanged);
    enableCallHistoryCheckbox.addEventListener('change', onOptionsChanged);
    searchExternalContactsCheckbox.addEventListener('change', onOptionsChanged);
    defaultOutboundSMSCountryCodeDropdown.addEventListener('change', onOptionsChanged);
    saveButton.addEventListener('click', saveOptions);
    cancelButton.addEventListener('click', cancelOptions);
  }

  function translateContents() {
    urlLabel.textContent = chrome.i18n.getMessage('optionsUrl');
    dedicatedLoginWindowLabel.textContent = chrome.i18n.getMessage('optionsDedicatedLoginWindow');
    clickToDialLabel.textContent = chrome.i18n.getMessage('optionsClickToDial');
    enableServerSideLoggingLabel.textContent = chrome.i18n.getMessage('optionsEnableServerSideLogging');
    enableConfigurableCallerIDLabel.textContent = chrome.i18n.getMessage('optionsEnableConfigurableCallerID');
    enableCallHistoryLabel.textContent = chrome.i18n.getMessage('optionsEnableCallHistory');
    searchExternalContactsLabel.textContent = chrome.i18n.getMessage('optionsSearchExternalContacts');
    defaultOutboundSMSCountryCodeLabel.textContent = chrome.i18n.getMessage('optionsDefaultOutboundSMSCountryCode');
    selectCountryCodeOption.textContent = chrome.i18n.getMessage('optionsSelectCountryCode');
    saveButton.textContent = chrome.i18n.getMessage('optionsSave');
    cancelButton.textContent = chrome.i18n.getMessage('optionsCancel');
  }

  // Restores select box and checkbox state using the preferences stored in chrome.storage.
  function restoreOptions() {
    settingsHelper.getSettings(function (data) {
      settings = data;
      if (!settings.enableAgentConfiguration) {
        disableOptionsForm();
      }
      populateOptionsForm(settings);
      showSSOInputs();
    });
  }

  function populateOptionsForm(data) {
    urlInput.value = data.url;
    clickToDialCheckbox.checked = data.clickToDial;
    enableServerSideLoggingCheckbox.checked = data.enableServerSideLogging;
    enableConfigurableCallerIDCheckbox.checked = data.enableConfigurableCallerID;
    enableSSOCheckBox.checked = data.useSSO;
    enableCallHistoryCheckbox.checked = data.enableCallHistory;
    searchExternalContactsCheckbox.checked = data.searchExternalContacts;
    ssoOrganization.value = data.orgName;
    ssoProvider.value = data.providerName;
    dedicatedLoginWindowCheckbox.checked = data.dedicatedLoginWindow;

    var selectedCountryCode = data.defaultOutboundSMSCountryCode;
    var options = window.intlTelInputGlobals
      .getCountryData()
      .map(function (country) {
        return '<option value="' + country.iso2 + '" ' + (selectedCountryCode === country.iso2 ? 'selected' : '') + '>' + country.name + ' +' + country.dialCode + '</option>';
      })
      .join('');
    $('#defaultOutboundSMSCountryCode').append(options);
  }

  function getOptionsFormValues() {
    return {
      url: urlInput.value,
      clickToDial: clickToDialCheckbox.checked,
      enableServerSideLogging: enableServerSideLoggingCheckbox.checked,
      enableConfigurableCallerID: enableConfigurableCallerIDCheckbox.checked,
      enableCallHistory: enableCallHistoryCheckbox.checked,
      searchExternalContacts: searchExternalContactsCheckbox.checked,
      defaultOutboundSMSCountryCode: defaultOutboundSMSCountryCodeDropdown.value,
      useSSO: enableSSOCheckBox.checked,
      providerName: ssoProvider.value,
      orgName: ssoOrganization.value,
      dedicatedLoginWindow: dedicatedLoginWindowCheckbox.checked,
    };
  }

  function disableOptionsForm() {
    urlInput.disabled = true;
    clickToDialCheckbox.disabled = true;
    enableServerSideLoggingCheckbox.disabled = true;
    enableConfigurableCallerIDCheckbox.disabled = true;
    dedicatedLoginWindowCheckbox.disabled = true;
    enableCallHistoryCheckbox.disabled = true;
    searchExternalContactsCheckbox.disabled = true;
    saveButton.disabled = true;
  }

  // Saves options to chrome.storage
  function saveOptions() {
    if (settings.enableAgentConfiguration && isSSOValid()) {
      var newSettings = getOptionsFormValues();
      saveButton.textContent = chrome.i18n.getMessage('optionsSaving');

      settingsHelper.saveSettings(newSettings, function () {
        settings = Object.assign(settings, newSettings);
        setTimeout(function () {
          // Update status to let user know options were saved.
          saveButton.disabled = true;
          saveButton.textContent = chrome.i18n.getMessage('optionsSave');
          ssoError.innerHTML = '';
        }, 500);
      });
    }
  }

  function cancelOptions() {
    window.close();
  }

  function onOptionsChanged() {
    if (settings.enableAgentConfiguration) {
      var newSettings = getOptionsFormValues();
      var changed = false;
      Object.keys(newSettings).forEach(function (key) {
        if (newSettings[key] != settings[key]) {
          changed = true;
        }
      });
      saveButton.disabled = !changed;
    }
  }

  function showSSOInputs() {
    if (enableSSOCheckBox.checked) {
      document.getElementById('ssoTextBoxes').style.display = 'block';
    } else {
      document.getElementById('ssoTextBoxes').style.display = 'none';
      ssoError.innerHTML = '';
      ssoOrganization.value = '';
      ssoProvider.value = '';
    }
  }

  function isSSOValid() {
    if (enableSSOCheckBox.checked && !ssoOrganization.value) {
      ssoError.innerHTML = 'If enabling Auto Redirect to SSO, Genesys Cloud Organization Name is required.';
      return false;
    }

    return true;
  }

  // initialize
  init();
})();
