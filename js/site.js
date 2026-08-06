(function () {
  'use strict';

  var nav = document.getElementById('global-nav');
  if (!nav) return;

  var toggleBtn = document.getElementById('mobile-toggle-btn');
  var drawer = document.getElementById('mobile-nav-drawer');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');

  function closeMega() {
    nav.querySelectorAll('.has-mega').forEach(function (li) { li.classList.remove('open'); });
    nav.querySelectorAll('.mega-panel').forEach(function (p) { p.classList.remove('open'); });
  }

  function openMega(name) {
    closeMega();
    var li = nav.querySelector('.has-mega[data-mega="' + name + '"]');
    var panel = nav.querySelector('.mega-panel[data-mega-panel="' + name + '"]');
    if (li) li.classList.add('open');
    if (panel) panel.classList.add('open');
  }

  nav.querySelectorAll('[data-mega-toggle]').forEach(function (a) {
    var name = a.getAttribute('data-mega-toggle');
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var li = a.closest('.has-mega');
      if (li && li.classList.contains('open')) {
        closeMega();
      } else {
        openMega(name);
      }
    });
    a.addEventListener('mouseenter', function () { openMega(name); });
  });

  nav.addEventListener('mouseleave', closeMega);

  // Services mega-panel: category / subcategory hover switching
  nav.querySelectorAll('.svc-cat-item').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      var cat = item.getAttribute('data-cat');
      nav.querySelectorAll('.svc-cat-item').forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      nav.querySelectorAll('.svc-subcat-list').forEach(function (l) { l.classList.remove('active'); });
      var list = nav.querySelector('.svc-subcat-list[data-cat="' + cat + '"]');
      if (list) list.classList.add('active');
      var firstSub = list ? list.querySelector('.svc-subcat-item') : null;
      if (firstSub) {
        var subId = firstSub.getAttribute('data-subcat');
        nav.querySelectorAll('.svc-subcat-item').forEach(function (s) { s.classList.remove('active'); });
        firstSub.classList.add('active');
        nav.querySelectorAll('.svc-items-panel').forEach(function (p) { p.classList.remove('active'); });
        var panel = nav.querySelector('.svc-items-panel[data-cat="' + cat + '"][data-subcat="' + subId + '"]');
        if (panel) panel.classList.add('active');
      }
    });
  });

  nav.querySelectorAll('.svc-subcat-item').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      var cat = item.getAttribute('data-cat');
      var subId = item.getAttribute('data-subcat');
      nav.querySelectorAll('.svc-subcat-item[data-cat="' + cat + '"]').forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      nav.querySelectorAll('.svc-items-panel[data-cat="' + cat + '"]').forEach(function (p) { p.classList.remove('active'); });
      var panel = nav.querySelector('.svc-items-panel[data-cat="' + cat + '"][data-subcat="' + subId + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', function () {
      var isOpen = drawer.classList.toggle('open');
      if (iconMenu && iconClose) {
        iconMenu.style.display = isOpen ? 'none' : '';
        iconClose.style.display = isOpen ? '' : 'none';
      }
    });
  }

  window.addEventListener('hashchange', function () {
    if (drawer) drawer.classList.remove('open');
    if (iconMenu && iconClose) { iconMenu.style.display = ''; iconClose.style.display = 'none'; }
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMega();
      if (drawer) drawer.classList.remove('open');
      closeContactModal();
    }
  });

  // Contact modal
  var overlay = document.getElementById('cm-overlay');
  var closeBtn = document.getElementById('cm-close');
  var cmForm = document.getElementById('cm-form');

  function openContactModal(service) {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (service) {
      var svcSelect = document.getElementById('cm-service');
      if (svcSelect) {
        var found = Array.from(svcSelect.options).some(function (o) {
          if (o.value === service || o.textContent.trim() === service) { svcSelect.value = o.value || o.textContent; return true; }
          return false;
        });
        if (!found) { /* leave default */ }
      }
    }
  }

  function closeContactModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-contact').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openContactModal();
      if (drawer) drawer.classList.remove('open');
      closeMega();
    });
  });

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeContactModal();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeContactModal);

  if (cmForm) {
    cmForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = cmForm.querySelector('.cm-submit');
      if (btn) {
        btn.textContent = "✓ Sent! We'll reply within 24 hours.";
        btn.disabled = true;
      }
      setTimeout(function () {
        closeContactModal();
        cmForm.reset();
        if (btn) { btn.textContent = 'Submit Request →'; btn.disabled = false; }
      }, 1400);
    });
  }

  window.__openEphraixContact = openContactModal;
})();
