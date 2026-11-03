/* =============================================================================
   Google Analytics 4
   -----------------------------------------------------------------------------
   Paste the measurement ID from Admin → Data streams → your web stream.
   Replace ONLY the placeholder below:

       var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

   A real ID looks like G-1A2BCD3EFG. Until you replace the placeholder, this
   file does not load Google and does not throw. After you paste a real ID,
   also allow these hosts if you use the Content-Security-Policy in vercel.json:
   script-src  https://www.googletagmanager.com
   connect-src https://www.google-analytics.com https://www.googletagmanager.com
   ============================================================================= */
(function () {
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
  var placeholder = GA_MEASUREMENT_ID === 'G-XXXXXXXXXX';
  var valid = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);
  if (placeholder || !valid) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);
})();
