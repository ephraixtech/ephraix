(function () {
  'use strict';

  // 1. Hero image fallback chain
  window.__svFallback = function (img) {
    var fallbacks = [];
    try { fallbacks = JSON.parse(img.getAttribute('data-fallbacks') || '[]'); } catch (e) { fallbacks = []; }
    if (!fallbacks.length) {
      img.onerror = null;
      var shell = img.closest('.service-visual-shell');
      if (shell) {
        shell.innerHTML = '<div class="service-visual-fallback"><div class="service-visual-fallback-copy">Premium CGI illustration placeholder</div></div>';
      }
      return;
    }
    var next = fallbacks.shift();
    img.setAttribute('data-fallbacks', JSON.stringify(fallbacks));
    img.src = next;
  };

  // 2. FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // 3. Count-up numbers
  function animateCountUp(el) {
    if (!el.dataset.val) el.dataset.val = el.textContent.trim();
    var raw = el.dataset.val;
    var match = raw.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!match) return;
    var prefix = match[1] || '';
    var numStr = match[2];
    var suffix = match[3] || '';
    var target = parseFloat(numStr);
    var decimals = numStr.indexOf('.') > -1 ? numStr.split('.')[1].length : 0;
    var duration = 1500;
    var startTime = null;
    var runToken = (el.__countRunToken = (el.__countRunToken || 0) + 1);
    function step(ts) {
      if (el.__countRunToken !== runToken) return;
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll('.achievement-value, .why-proof-number');
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(function (el) {
    countObs.observe(el);
    var host = el.closest('.achievement-card, .why-proof-card') || el;
    host.addEventListener('mouseenter', function () { animateCountUp(el); });
  });

  // 4. Sticky app-stack on scroll
  var stack = document.querySelector('.service-page-wrapper .app-stack');
  if (stack) {
    var onScroll = function () {
      if (window.scrollY > 240) stack.classList.add('app-stack--stuck');
      else stack.classList.remove('app-stack--stuck');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 5. Inline forms (hero + contact section) fake submit
  document.querySelectorAll('.service-inline-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.submit-btn');
      if (!btn || btn.disabled) return;
      var c1 = form.getAttribute('data-color1');
      var c2 = form.getAttribute('data-color2');
      btn.textContent = '✓ Request Sent Successfully!';
      btn.style.background = 'linear-gradient(135deg,#7CFF6B,#00D4FF)';
      btn.style.backgroundImage = 'none';
      btn.style.color = '#0a0520';
      btn.disabled = true;
      setTimeout(function () {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send Request →';
        btn.style.color = '';
        btn.style.background = '';
        if (c1 && c2) btn.style.backgroundImage = 'linear-gradient(135deg, ' + c1 + ' 0%, ' + c2 + ' 100%)';
      }, 2200);
    });
  });

  // 6. Portfolio page — category filter bar
  var filterBar = document.querySelector('.pf-filter-bar');
  if (filterBar) {
    var filterPills = filterBar.querySelectorAll('.pf-filter-pill');
    var caseCards = document.querySelectorAll('#pf-case-grid .case-card');
    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');
        caseCards.forEach(function (card) {
          var show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.hidden = !show;
        });
      });
    });
  }
})();




document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cm-form");
    const submitBtn = form.querySelector(".cm-submit");
    const originalText = submitBtn.textContent;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const formData = new FormData(form);

        try {
            // Send to Web3Forms (Email) — this is the one we actually check
            const web3Response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: formData
            });

            let web3Result;
            try {
                web3Result = await web3Response.json();
            } catch {
                throw new Error(`Web3Forms returned a non-JSON response (status ${web3Response.status}).`);
            }

            if (!web3Response.ok || !web3Result.success) {
                throw new Error(web3Result.message || `Web3Forms submission failed (status ${web3Response.status}).`);
            }

            // Send to Google Sheets — fire-and-forget, don't let this block success
            try {
                await fetch("https://script.google.com/macros/s/AKfycbywx5naLzbF9A003QlyecWjfst_jRCDSh6KJJUy7trNk8anrC-Im1TZ4DxAKAKeBBYrKA/exec", {
                    method: "POST",
                    mode: "no-cors", // Apps Script won't return CORS headers; we don't need to read the response
                    headers: {
                        "Content-Type": "text/plain" // avoids a CORS preflight that Apps Script can't handle
                    },
                    body: JSON.stringify({
                        name: formData.get("name"),
                        email: formData.get("email"),
                        service: formData.get("service"),
                        message: formData.get("message")
                    })
                });
            } catch (sheetsError) {
                console.warn("Google Sheets logging failed:", sheetsError);
            }

            submitBtn.textContent = "✓ Sent! We'll reach out within 24 hours.";
            form.reset();

        } catch (error) {
            console.error(error);
            submitBtn.textContent = "❌ Error! Please try again.";

        } finally {
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});






// document.addEventListener("DOMContentLoaded", () => {
//     const forms = document.querySelectorAll(".js-lead-form");

//     forms.forEach((form) => {
//         const submitBtn = form.querySelector('button[type="submit"]');
//         const originalText = submitBtn.textContent;

//         form.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             submitBtn.disabled = true;
//             submitBtn.textContent = "Sending...";

//             const formData = new FormData(form);

//             try {
//                 const web3Response = await fetch("https://api.web3forms.com/submit", {
//                     method: "POST",
//                     headers: { "Accept": "application/json" },
//                     body: formData
//                 });

//                 let web3Result;
//                 try {
//                     web3Result = await web3Response.json();
//                 } catch {
//                     throw new Error(`Non-JSON response (status ${web3Response.status}).`);
//                 }

//                 if (!web3Response.ok || !web3Result.success) {
//                     throw new Error(web3Result.message || "Web3Forms submission failed.");
//                 }

//                 try {
//                     await fetch("https://script.google.com/macros/s/AKfycbywx5naLzbF9A003QlyecWjfst_jRCDSh6KJJUy7trNk8anrC-Im1TZ4DxAKAKeBBYrKA/exec", {
//                         method: "POST",
//                         mode: "no-cors",
//                         headers: { "Content-Type": "text/plain" },
//                         body: JSON.stringify({
//                             name: formData.get("name"),
//                             email: formData.get("email"),
//                             phone: formData.get("phone") || "",
//                             service: formData.get("service"),
//                             message: formData.get("message"),
//                             page: window.location.pathname
//                         })
//                     });
//                 } catch (sheetsError) {
//                     console.warn("Sheets logging failed:", sheetsError);
//                 }

//                 submitBtn.textContent = "✓ Sent! We'll reach out within 24 hours.";
//                 form.reset();

//             } catch (error) {
//                 console.error(error);
//                 submitBtn.textContent = "❌ Error! Please try again.";
//             } finally {
//                 setTimeout(() => {
//                     submitBtn.textContent = originalText;
//                     submitBtn.disabled = false;
//                 }, 3000);
//             }
//         });
//     });
// }); 



document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".js-lead-form");

    forms.forEach((form) => {
        // Prevent double-binding if this script ever runs twice on the page
        if (form.dataset.leadFormBound === "true") return;
        form.dataset.leadFormBound = "true";

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        let isSubmitting = false;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Prevent double-fire from rapid double-click / double Enter
            if (isSubmitting) return;
            isSubmitting = true;

            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const formData = new FormData(form);

            try {
                const web3Response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Accept": "application/json" },
                    body: formData
                });

                let web3Result;
                try {
                    web3Result = await web3Response.json();
                } catch {
                    throw new Error(`Non-JSON response (status ${web3Response.status}).`);
                }

                if (!web3Response.ok || !web3Result.success) {
                    throw new Error(web3Result.message || "Web3Forms submission failed.");
                }

                try {
                    await fetch("https://script.google.com/macros/s/AKfycbywx5naLzbF9A003QlyecWjfst_jRCDSh6KJJUy7trNk8anrC-Im1TZ4DxAKAKeBBYrKA/exec", {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify({
                            name: formData.get("name"),
                            email: formData.get("email"),
                            phone: formData.get("phone") || "",
                            service: formData.get("service"),
                            message: formData.get("message"),
                            page: window.location.pathname
                        })
                    });
                } catch (sheetsError) {
                    console.warn("Sheets logging failed:", sheetsError);
                }

                submitBtn.textContent = "Sent Successfully! We'll reach you within 24 hours.";
                form.reset();

            } catch (error) {
                console.error(error);
                submitBtn.textContent = "❌ Error! Please try again.";
            } finally {
                isSubmitting = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
});