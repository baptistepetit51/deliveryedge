/* Google Analytics 4.
   Replace G-XXXXXXXXXX with the measurement ID. Until then this file does nothing. */
(function () {
  var id = "G-XXXXXXXXXX";
  if (!id || id.indexOf("XXXX") !== -1) return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id);
})();
