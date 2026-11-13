/* Count booking intent. Never calls preventDefault, so navigation is not delayed.
   Hits use transport_type beacon so they can leave with the page. */
(function (root) {
  "use strict";

  var BASE = "https://deliveryedge.co/";

  function pageBase() {
    try {
      if (typeof location !== "undefined" && location.href) return location.href;
    } catch (err) {}
    return BASE;
  }

  function rawHref(el) {
    try {
      var attr = el.getAttribute && el.getAttribute("href");
      return typeof attr === "string" ? attr : "";
    } catch (err) {
      return "";
    }
  }

  function absHref(el) {
    if (!el || el.tagName !== "A") return "";
    var prop = typeof el.href === "string" ? el.href : "";
    if (prop && /^[a-z][a-z0-9+.-]*:/i.test(prop)) return prop;
    var raw = rawHref(el);
    if (!raw) return "";
    try {
      return new URL(raw, pageBase()).href;
    } catch (err) {
      return raw;
    }
  }

  function hostOf(url) {
    try {
      return new URL(url, pageBase()).hostname.toLowerCase();
    } catch (err) {
      return "";
    }
  }

  function protocolOf(el, raw) {
    var proto = "";
    try {
      proto = (el.protocol || "").toLowerCase();
    } catch (err) {
      proto = "";
    }
    if (proto) return proto;
    var m = /^(mailto:|tel:)/i.exec(raw);
    return m ? m[1].toLowerCase() : "";
  }

  function className(el) {
    return typeof el.className === "string" ? el.className : "";
  }

  function isBookingLabel(el) {
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    return /\b(book|reservar|audit)\b/i.test(text) || /pick a time/i.test(text);
  }

  function isBookingPath(raw) {
    return /(?:^|\/)(?:questionnaire|contact)(?:\.html)?(?:[?#]|$)/i.test(raw);
  }

  function isStartLink(el, raw) {
    var abs = absHref(el);
    if (abs) {
      try {
        if (new URL(abs, pageBase()).hash === "#start") return true;
      } catch (err) {}
    }
    return /#start(?:$|[^A-Za-z0-9_-])/i.test(raw);
  }

  function isBookingCta(el, raw) {
    if (el.id === "f-submit" || el.id === "submitBtn") return true;
    if (/(?:^|\s)(?:nav-cta|mn-cta|ac-btn|success-btn|btn-submit|sk-cta|us-cta)(?:\s|$)/.test(className(el))) {
      return true;
    }
    if (el.tagName === "A" && isStartLink(el, raw)) return true;
    if (el.tagName === "A" && isBookingLabel(el) && isBookingPath(raw)) return true;
    return false;
  }

  function classify(el) {
    if (!el || (el.tagName !== "A" && el.tagName !== "BUTTON")) return null;
    var raw = rawHref(el);
    var abs = absHref(el);
    var proto = protocolOf(el, raw);
    if (proto === "mailto:") return { method: "email", link_url: abs || raw };
    if (proto === "tel:") return { method: "phone", link_url: abs || raw };
    var host = abs ? hostOf(abs) : "";
    if (host === "calendly.com" || (host.length > 13 && host.endsWith(".calendly.com"))) {
      return { method: "calendly", link_url: abs };
    }
    if (isBookingCta(el, raw)) {
      return { method: "cta", link_url: abs || raw || pageBase() };
    }
    return null;
  }

  function hitFrom(node) {
    var el = node;
    if (el && el.nodeType !== 1) el = el.parentElement;
    while (el && el.tagName !== "HTML") {
      var hit = classify(el);
      if (hit) return hit;
      el = el.parentElement;
    }
    return null;
  }

  function send(hit) {
    if (typeof root.gtag !== "function") return;
    try {
      root.gtag("event", "generate_lead", {
        method: hit.method,
        link_url: hit.link_url,
        transport_type: "beacon"
      });
    } catch (err) {}
  }

  function onClick(e) {
    if (!e) return;
    if (e.type === "auxclick" && e.button !== 1) return;
    var hit = hitFrom(e.target);
    if (hit) send(hit);
  }

  function install(doc) {
    var target = doc || (typeof document !== "undefined" ? document : null);
    if (!target || !target.addEventListener || target.__deGaLead) return;
    target.__deGaLead = true;
    target.addEventListener("click", onClick, true);
    target.addEventListener("auxclick", onClick, true);
  }

  if (typeof document !== "undefined") install(document);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { classify: classify, hitFrom: hitFrom, install: install, send: send };
  }
})(typeof window !== "undefined" ? window : globalThis);
