/**
 * DeliveryEdge Meta event helpers — READY, but not loaded on the live site yet.
 * Do not include this file in HTML until a real PIXEL_ID exists in the
 * DeliveryEdge Meta Business portfolio. Shipping fbq('init','PIXEL_ID')
 * placeholders would measure nothing and leak a dummy ID.
 *
 * When the ID is ready: paste the pixel snippet in every <head>, then add
 *   <script src="js/meta_events.js" defer></script>
 * after the other deferred scripts. On the home form, call DEPixel.lead(go)
 * (and set skipAutoLead = true before the Formspree fetch). The ~400 ms
 * redirect delay on the home form is already in place.
 *
 */
(function () {
  "use strict";

  var FORMSPREE_HOST = /(?:^|\.)formspree\.io$/i;
  var CALENDLY_ORIGIN = "https://calendly.com";
  var DEDUPE_MS = 2000;
  var last = { Lead: 0, Schedule: 0 };

  function track(event, callback) {
    var now = Date.now();
    if (now - last[event] < DEDUPE_MS) return false;
    if (typeof fbq !== "function") return false;
    last[event] = now;
    if (typeof callback === "function") {
      fbq("track", event, {}, { eventCallback: callback });
    } else {
      fbq("track", event);
    }
    return true;
  }

  function trackLead(callback) {
    track("Lead", callback);
  }

  function trackSchedule() {
    track("Schedule");
  }

  function toUrl(input) {
    try {
      if (typeof input === "string") return new URL(input, window.location.href);
      if (input && typeof input.url === "string") {
        return new URL(input.url, window.location.href);
      }
    } catch (err) {
      return null;
    }
    return null;
  }

  function isFormspree(input) {
    var url = toUrl(input);
    return !!(url && FORMSPREE_HOST.test(url.hostname));
  }

  if (typeof window.fetch === "function") {
    var origFetch = window.fetch;
    window.fetch = function (input) {
      var watch = isFormspree(input);
      return origFetch.apply(this, arguments).then(function (res) {
        if (watch && res.ok && !api.skipAutoLead) trackLead();
        return res;
      });
    };
  }

  function eventName(data) {
    if (data == null) return "";
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        return "";
      }
    }
    return data && typeof data.event === "string" ? data.event : "";
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== CALENDLY_ORIGIN) return;
    if (eventName(e.data) === "calendly.event_scheduled") trackSchedule();
  });

  var api = {
    skipAutoLead: false,
    lead: trackLead,
    schedule: trackSchedule
  };
  window.DEPixel = api;
})();
