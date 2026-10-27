
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  /*
   * CareBridge Healthcare
   * Website interaction tracking for GTM practice.
   *
   * Never send names, email addresses, phone numbers,
   * form messages or medical information to analytics.
   */

  function trackEvent(eventName, extraData) {
    var eventData = {
      event: eventName
    };

    if (extraData && typeof extraData === 'object') {
      [
        'button_text',
        'link_url',
        'service_name',
        'link_type'
      ].forEach(function (key) {
        if (
          Object.prototype.hasOwnProperty.call(extraData, key) &&
          typeof extraData[key] === 'string'
        ) {
          eventData[key] = extraData[key];
        }
      });
    }

    window.dataLayer.push(eventData);
  }

  function getSafeLinkType(element) {
    var href = element.getAttribute('href') || '';

    if (href.indexOf('tel:') === 0) {
      return 'phone';
    }

    if (
      href.indexOf('wa.me/') !== -1 ||
      href.indexOf('whatsapp.com/') !== -1
    ) {
      return 'whatsapp';
    }

    return 'website';
  }

  document.addEventListener('click', function (event) {
    var target = event.target;

    if (!target || typeof target.closest !== 'function') {
      return;
    }

    var element = target.closest(
      'a[data-track], button[data-track]'
    );

    if (!element) {
      return;
    }

    var eventName = element.getAttribute('data-track');

    if (!eventName) {
      return;
    }

    var extraData = {
      button_text: (element.textContent || '').trim().slice(0, 80),
      link_type: getSafeLinkType(element)
    };

    var serviceName = element.getAttribute('data-service');

    if (serviceName) {
      extraData.service_name = serviceName;
    }

    var href = element.getAttribute('href') || '';

    // Record only a safe local path, not query parameters.
    if (
      href &&
      href.indexOf('tel:') !== 0 &&
      href.indexOf('mailto:') !== 0 &&
      href.indexOf('wa.me/') === -1 &&
      href.indexOf('whatsapp.com/') === -1
    ) {
      extraData.link_url = href.split('?')[0].slice(0, 200);
    }

    trackEvent(eventName, extraData);
  });

  /*
   * Page readiness event for practice and debugging.
   * This event does not represent a conversion.
   */
  window.addEventListener('pageshow', function () {
    trackEvent('carebridge_page_ready');
  });
})();
