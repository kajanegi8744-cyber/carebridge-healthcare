
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  /*
   * CareBridge Healthcare
   * Website interaction tracking for GTM practice.
   *
   * Do not send names, email addresses, phone numbers,
   * messages, or medical information to analytics.
   */

  function trackEvent(eventName, extraData) {
    var eventData = {
      event: eventName
    };

    if (extraData && typeof extraData === 'object') {
      Object.keys(extraData).forEach(function (key) {
        // Only permit explicitly approved, non-personal parameters.
        if (
          key === 'button_text' ||
          key === 'link_url' ||
          key === 'service_name' ||
          key === 'link_type'
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
    var element = event.target.closest(
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

    // Only record internal page paths or link type, not arbitrary
    // URLs that might contain personal information.
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
   * Inform GTM when a page is ready.
   * The HTML pages also contain their own specific dataLayer events.
   */
  window.addEventListener('pageshow', function () {
    trackEvent('carebridge_page_ready');
  });
})();

