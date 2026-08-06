/* =========================================================================
   Ephraix — homepage script.js
   Plain JS port of: App.tsx (nav / footer / contact modal) + siteScript.js
   ========================================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     1. Services mega-menu data (nav only — mirrors AppNav's servicesData)
     ----------------------------------------------------------------------- */
  var navServicesData = {
    ai: {
      label: "AI",
      subcats: [
        {
          id: "ai-main",
          label: "Artificial Intelligence",
          items: [
            "AI Agent Development",
            "AI Chatbot Development",
            "AI Copilot Development",
            "AI Crypto Coin Development",
            "AI Ecommerce Platform Development",
            "AI Token Development",
            "Generative AI Development",
            "Machine Learning Consulting",
          ],
        },
      ],
    },
    blockchain: {
      label: "Blockchain",
      subcats: [
        {
          id: "bc-main",
          label: "Blockchain",
          items: [
            "Enterprise Blockchain Development",
            "Private Blockchain Development",
            "Cardano Blockchain Development",
            "dApp Development",
            "Smart Contract Audit",
            "Carbon Credit Platform Development",
            "Real Estate Tokenization",
          ],
        },
      ],
    },
    crypto: {
      label: "Crypto",
      subcats: [
        {
          id: "cr-tokens",
          label: "Tokens",
          items: [
            "BEP20 Token Development",
            "Polygon Token Development",
            "Solana Token Development",
            "Solana Token Development (Basic)",
            "Cardano Token Development",
            "Avalanche Token Development",
            "Tron Token Development",
            "Utility Token Development",
            "TRC10/TRC20/TRC721 Development",
            "Token Generator Platform Development",
            "Meme Coin Development",
            "BEP-721 Token Development",
          ],
        },
        {
          id: "cr-nft",
          label: "NFT",
          items: [
            "NFT Token Development",
            "Basic NFT Token Development",
            "NFT Marketplace Development",
            "ERC-721 Token Development",
            "ERC-721x Token Development",
            "ERC-1155 Token Development",
          ],
        },
        {
          id: "cr-defi",
          label: "DeFi",
          items: ["DeFi Token Development", "DeFi Token Menu Listing", "Flashloan Arbitrage Bot Development"],
        },
        {
          id: "cr-trading",
          label: "Trading Bots",
          items: [
            "Arbitrage Trading Bot Development",
            "Crypto Trading Bot Development",
            "Market Making Bot Development",
            "Stock Trading Development",
          ],
        },
        {
          id: "cr-exchange",
          label: "Exchange / Banking",
          items: [
            "Crypto Exchange Development",
            "Crypto Exchange Like Binance",
            "Centralized Exchange Development",
            "Crypto Banking Solution",
            "Crypto Launchpad Development",
          ],
        },
        {
          id: "cr-compliance",
          label: "Compliance",
          items: ["VARA License Consultant", "AI Crypto Coin Development"],
        },
      ],
    },
  };

  var activeCat = "ai";

  function getSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
  var activeSubcat = "ai-main";

  function renderMegaMenu() {
    var catList = document.getElementById("svc-cat-list");
    var subcatList = document.getElementById("svc-subcat-list");
    var itemsCol = document.getElementById("svc-items-col");
    if (!catList || !subcatList || !itemsCol) return;

    catList.innerHTML = "";
    Object.keys(navServicesData).forEach(function (key) {
      var li = document.createElement("li");
      li.className = "svc-cat-item" + (activeCat === key ? " active" : "");
      li.innerHTML = "<span>" + navServicesData[key].label + "</span><i class=\"svc-arr\">\u203a</i>";
      li.addEventListener("mouseenter", function () {
        activeCat = key;
        activeSubcat = navServicesData[key].subcats[0].id;
        renderMegaMenu();
      });
      catList.appendChild(li);
    });

    subcatList.innerHTML = "";
    navServicesData[activeCat].subcats.forEach(function (subcat) {
      var li = document.createElement("li");
      li.className = "svc-subcat-item" + (activeSubcat === subcat.id ? " active" : "");
      li.innerHTML = "<span>" + subcat.label + "</span><i class=\"svc-arr\">\u203a</i>";
      li.addEventListener("mouseenter", function () {
        activeSubcat = subcat.id;
        renderMegaMenu();
      });
      subcatList.appendChild(li);
    });

    itemsCol.innerHTML = "";
    navServicesData[activeCat].subcats.forEach(function (subcat) {
      if (subcat.id !== activeSubcat) return;
      var panel = document.createElement("div");
      panel.className = "svc-items-panel active";
      var itemsHtml = subcat.items
        .map(function (item) {
          return '<li><a href="services/' + getSlug(item) + '.html">' + item + "</a></li>";
        })
        .join("");
      panel.innerHTML =
        '<div class="svc-panel-title">' +
        subcat.label +
        ' <span class="svc-arr-title">\u2192</span></div><ul class="svc-items-grid">' +
        itemsHtml +
        "</ul>";
      itemsCol.appendChild(panel);
    });
  }

  /* -----------------------------------------------------------------------
     2. Nav: mega-menu open/close, mobile menu, escape key
     ----------------------------------------------------------------------- */
  var nav = document.getElementById("global-nav");
  var mobileToggleBtn = document.getElementById("mobile-toggle-btn");
  var mobileDrawer = document.getElementById("mobile-nav-drawer");
  var iconMenu = document.getElementById("icon-menu");
  var iconClose = document.getElementById("icon-close");

  function closeAllMega() {
    document.querySelectorAll(".has-mega").forEach(function (li) {
      li.classList.remove("open");
    });
    document.querySelectorAll(".mega-panel").forEach(function (panel) {
      panel.classList.remove("open");
    });
  }

  function toggleMega(name) {
    var li = document.querySelector('.has-mega[data-mega="' + name + '"]');
    var panel = document.querySelector('.mega-panel[data-mega-panel="' + name + '"]');
    var willOpen = li && !li.classList.contains("open");
    closeAllMega();
    if (willOpen && li && panel) {
      li.classList.add("open");
      panel.classList.add("open");
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (iconMenu) iconMenu.style.display = "";
    if (iconClose) iconClose.style.display = "none";
  }

  document.querySelectorAll(".has-mega").forEach(function (li) {
    var name = li.getAttribute("data-mega");
    var link = li.querySelector("[data-mega-toggle]");
    if (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        toggleMega(name);
      });
    }
    li.addEventListener("mouseenter", function () {
      closeAllMega();
      li.classList.add("open");
      var panel = document.querySelector('.mega-panel[data-mega-panel="' + name + '"]');
      if (panel) panel.classList.add("open");
    });
  });

  if (nav) {
    nav.addEventListener("mouseleave", closeAllMega);
  }

  document.querySelectorAll("[data-close-mega]").forEach(function (a) {
    a.addEventListener("click", closeAllMega);
  });

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener("click", function () {
      var isOpen = mobileDrawer && mobileDrawer.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        if (mobileDrawer) mobileDrawer.classList.add("open");
        if (iconMenu) iconMenu.style.display = "none";
        if (iconClose) iconClose.style.display = "";
      }
    });
  }

  document.querySelectorAll("[data-close-mobile]").forEach(function (a) {
    a.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("hashchange", function () {
    closeMobileMenu();
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllMega();
      closeMobileMenu();
      closeContactModal();
    }
  });

  /* -----------------------------------------------------------------------
     3. Contact modal
     ----------------------------------------------------------------------- */
  var cmOverlay = document.getElementById("cm-overlay");
  var cmClose = document.getElementById("cm-close");
  var cmForm = document.getElementById("cm-form");
  var cmSubmitBtn = document.getElementById("cm-submit-btn");
  var cmServiceSelect = document.getElementById("cm-service");

  function openContactModal(presetService) {
    if (!cmOverlay) return;
    cmOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeAllMega();
    closeMobileMenu();
    if (presetService && cmServiceSelect) {
      var hasOption = Array.prototype.some.call(cmServiceSelect.options, function (opt) {
        return opt.value === presetService || opt.textContent === presetService;
      });
      if (!hasOption) {
        var opt = document.createElement("option");
        opt.textContent = presetService;
        cmServiceSelect.appendChild(opt);
      }
      cmServiceSelect.value = presetService;
    }
  }

  function closeContactModal() {
    if (!cmOverlay) return;
    cmOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-open-contact]");
    if (trigger) {
      e.preventDefault();
      openContactModal(trigger.getAttribute("data-service"));
    }
  });

  if (cmClose) cmClose.addEventListener("click", closeContactModal);
  if (cmOverlay) {
    cmOverlay.addEventListener("click", function (e) {
      if (e.target === cmOverlay) closeContactModal();
    });
  }

  if (cmForm) {
    cmForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cmSubmitBtn) cmSubmitBtn.textContent = "\u2713 Sent! We'll reply within 24 hours.";
      window.setTimeout(function () {
        closeContactModal();
        cmForm.reset();
        if (cmSubmitBtn) cmSubmitBtn.textContent = "Submit Request \u2192";
      }, 1400);
    });
  }

  /* -----------------------------------------------------------------------
     4. Homepage contact form submit (id="contact" form, content.html)
     ----------------------------------------------------------------------- */
  window.handleSubmit = function (e) {
    e.preventDefault();
    var btn = e.target.querySelector(".submit-btn");
    if (btn) {
      btn.textContent = "\u2713 Sent! We'll reply within 24 hours.";
      btn.style.background = "linear-gradient(135deg,#7CFF6B,#00D4FF)";
      btn.style.color = "#0a0520";
      btn.disabled = true;
    }
  };

  /* -----------------------------------------------------------------------
     5. Glow tracker helper (mouse-follow glow on bento / market cards)
     ----------------------------------------------------------------------- */
  function track(sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.dataset.glowTracked) return;
      el.dataset.glowTracked = "true";
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* -----------------------------------------------------------------------
     6. Count-up animation helper
     ----------------------------------------------------------------------- */
  function animateCountUp(el) {
    // Cache the original target text once so repeated (hover-triggered)
    // runs always animate from the same source value, never from
    // whatever partially-animated text is currently on screen.
    if (!el.dataset.val) el.dataset.val = el.textContent.trim();
    var raw = el.dataset.val;

    var match = raw.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!match) return;

    var prefix = match[1] || "";
    var numStr = match[2];
    var suffix = match[3] || "";
    var target = parseFloat(numStr);

    var decParts = numStr.split(".");
    var decimals = decParts.length > 1 ? decParts[1].length : 0;

    var duration = 1500;
    var startTime = null;

    // Each call gets its own token; a stale in-flight animation from a
    // previous hover checks this before writing/continuing, so rapid
    // re-hovers restart cleanly instead of racing each other.
    var runToken = (el.__countRunToken = (el.__countRunToken || 0) + 1);

    function step(ts) {
      if (el.__countRunToken !== runToken) return; // superseded by a newer run
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------------------------------
     7. Homepage init — sticky hero app-stack, glow trackers, count-up,
        scroll-reveal, contact link binding
     ----------------------------------------------------------------------- */
  function initHeroFaceParallax(){
    var visual = document.querySelector("#hero .hero-visual");
    if (!visual) return;

    // Skip entirely on touch devices — avoids jank / accidental scroll capture
    var isTouch =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    if (isTouch) return;

    var MAX_SHIFT = 8; // px — very light tilt as spec'd
    var targetX = 0, targetY = 0;
    var curX = 0, curY = 0;
    var rafId = null;
    var attached = false;

    function tick(){
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;
      visual.style.setProperty("--hf-px", curX.toFixed(2) + "px");
      visual.style.setProperty("--hf-py", curY.toFixed(2) + "px");
      if (Math.abs(targetX - curX) > 0.08 || Math.abs(targetY - curY) > 0.08){
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
    function schedule(){ if (!rafId) rafId = requestAnimationFrame(tick); }

    function onMove(e){
      var rect = visual.getBoundingClientRect();
      var nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // -1..1
      var ny = ((e.clientY - rect.top ) / rect.height - 0.5) * 2;
      // clamp — cursor may briefly be outside during rapid moves
      if (nx > 1) nx = 1; else if (nx < -1) nx = -1;
      if (ny > 1) ny = 1; else if (ny < -1) ny = -1;
      targetX = nx * MAX_SHIFT;
      targetY = ny * MAX_SHIFT;
      schedule();
    }
    function onLeave(){
      targetX = 0; targetY = 0;
      schedule();
    }

    var mq = window.matchMedia("(max-width: 980px)");
    function applyMQ(){
      if (mq.matches){
        if (attached){
          visual.removeEventListener("mousemove", onMove);
          visual.removeEventListener("mouseleave", onLeave);
          attached = false;
        }
        targetX = 0; targetY = 0;
        curX = 0; curY = 0;
        visual.style.setProperty("--hf-px", "0px");
        visual.style.setProperty("--hf-py", "0px");
      } else if (!attached){
        visual.addEventListener("mousemove", onMove);
        visual.addEventListener("mouseleave", onLeave);
        attached = true;
      }
    }
    if (mq.addEventListener) mq.addEventListener("change", applyMQ);
    else if (mq.addListener)  mq.addListener(applyMQ);
    applyMQ();
  }

  function initEphraixHome() {
    var stack = document.querySelector("#hero .app-stack");
    var hero = document.getElementById("hero");
    var contact = document.getElementById("contact");

    if (stack && hero) {
      var onScroll = function () {
        var y = window.scrollY || window.pageYOffset;
        var heroBottom = hero.offsetTop + hero.offsetHeight - 200;
        var contactTop = contact ? contact.offsetTop - 120 : Infinity;
        var viewportBottom = y + window.innerHeight;
        if (y > heroBottom && viewportBottom < contactTop) {
          stack.classList.add("app-stack--stuck");
          stack.classList.remove("app-stack--hidden");
        } else if (viewportBottom >= contactTop) {
          stack.classList.add("app-stack--stuck");
          stack.classList.add("app-stack--hidden");
        } else {
          stack.classList.remove("app-stack--stuck");
          stack.classList.remove("app-stack--hidden");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }

    track(".bento");
    track(".market-card");

    document.querySelectorAll(".market-card").forEach(function (card) {
      var marketVal = card.querySelector(".market-v");
      if (!marketVal) return;
      card.addEventListener("mouseenter", function () {
        animateCountUp(marketVal);
      });
    });

    var statSection = document.getElementById("stats");
    if (statSection) {
      statSection.addEventListener("mouseenter", function () {
        document.querySelectorAll("#stats .stat-num").forEach(animateCountUp);
      });
    }

    var revEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var rObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              setTimeout(function () {
                entry.target.classList.add("visible");
                var statNum = entry.target.querySelector(".stat-num");
                if (statNum) animateCountUp(statNum);
              }, i * 40);
              rObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      revEls.forEach(function (el) {
        rObs.observe(el);
      });
    } else {
      revEls.forEach(function (el) {
        el.classList.add("visible");
      });
    }
  }

  /* -----------------------------------------------------------------------
     Boot
     ----------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderMegaMenu();
    initEphraixHome();
    initHeroFaceParallax();
  });
})();



// const form = document.getElementById('form');
// const submitBtn = form.querySelector('button[type="submit"]');

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData(form);
//     const originalText = submitBtn.textContent;

//     submitBtn.textContent = "Sending...";
//     submitBtn.disabled = true;

//     try {
//         const response = await fetch("https://api.web3forms.com/submit", {
//             method: "POST",
//             body: formData
//         });

//         const data = await response.json();

//         if (response.ok) {
//             form.reset();

//             submitBtn.textContent = "✓ Sent! We'll reply within 24 hours.";
//             submitBtn.style.background = "linear-gradient(135deg,#7CFF6B,#00D4FF)";
//             submitBtn.style.color = "#111";

//             // Restore the button after 5 seconds
//             setTimeout(() => {
//                 submitBtn.textContent = originalText;
//                 submitBtn.style.background = "";
//                 submitBtn.style.color = "";
//                 submitBtn.disabled = false;
//             }, 5000);

//         } else {
//             submitBtn.textContent = "Failed! Try Again";

//             setTimeout(() => {
//                 submitBtn.textContent = originalText;
//                 submitBtn.disabled = false;
//             }, 3000);
//         }

//     } catch (error) {
//         submitBtn.textContent = "Network Error";

//         setTimeout(() => {
//             submitBtn.textContent = originalText;
//             submitBtn.disabled = false;
//         }, 3000);
//     }
// });




// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("form");
//     const submitBtn = form.querySelector(".submit-btn");

//     const originalText = submitBtn.textContent;

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         submitBtn.disabled = true;
//         submitBtn.textContent = "Sending...";

//         const formData = new FormData(form);

//         try {
//             const response = await fetch(form.action, {
//                 method: "POST",
//                 body: formData
//             });

//             const result = await response.json();

//             if (result.success) {
//                 submitBtn.textContent = "✓ Sent! We'll reach out within 24 hours.";
//                 form.reset();

//                 setTimeout(() => {
//                     submitBtn.textContent = originalText;
//                     submitBtn.disabled = false;
//                 }, 3000);

//             } else {
//                 throw new Error(result.message || "Submission failed");
//             }

//         } catch (error) {
//             submitBtn.textContent = "❌ Error! Please try again.";

//             setTimeout(() => {
//                 submitBtn.textContent = originalText;
//                 submitBtn.disabled = false;
//             }, 3000);
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const submitBtn = form.querySelector(".submit-btn");
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
                body: formData
            });

            const web3Result = await web3Response.json();

            if (!web3Result.success) {
                throw new Error("Web3Forms submission failed.");
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
                        first_name: formData.get("first_name"),
                        last_name: formData.get("last_name"),
                        email: formData.get("email"),
                        phone: formData.get("phone"),
                        service: formData.get("service"),
                        budget: formData.get("budget"),
                        timeline: formData.get("timeline"),
                        message: formData.get("message")
                    })
                });
            } catch (sheetsError) {
                // Log it, but don't fail the whole submission over this
                console.warn("Google Sheets logging failed:", sheetsError);
            }

            submitBtn.textContent = "✓ Sent! We'll reach out within 24 hours.";
            form.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error(error);

            submitBtn.textContent = "❌ Error! Please try again.";

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});