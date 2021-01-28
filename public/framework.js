// https://developer.mypurecloud.com/api/embeddable-framework/configMethods/
window.Framework = {
  config: {
    name: 'PEF in Chrome Extension w/ Auto Answer',
    clientIds: {
      'mypurecloud.ie': 'ad061ce9-24c5-4022-8620-015f4e181054',
    },
    settings: {
      embedWebRTCByDefault: true,
      hideWebRTCPopUpOption: false,
      enableCallLogs: true,
      hideCallLogSubject: false,
      hideCallLogContact: false,
      hideCallLogRelation: false,
      enableTransferContext: true,
      dedicatedLoginWindow: false,
      embeddedInteractionWindow: true,
      enableConfigurableCallerId: false,
      enableServerSideLogging: false,
      enableCallHistory: false,
      defaultOutboundSMSCountryCode: '+1',
      searchTargets: ['people', 'queues', 'frameworkContacts', 'externalContacts'],
      callControls: [], // ['pickup', 'transfer', 'mute', 'disconnect']
    },
    helpLinks: {},
    customInteractionAttributes: [],
    getUserLanguage: function (callback) {
      console.log('Not implemented');
    },
  },
  initialSetup: function () {
    console.log('Framework loaded, v3');
  },
  screenPop: function (searchString, interaction) {
    console.log('screenPop called with interaction:', interaction);
    window.PureCloud.Interaction.updateState({
      action: 'pickup',
      id: interaction.id,
    });
  },
};
