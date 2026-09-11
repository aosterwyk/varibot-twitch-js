function filterSoundboard(query) {
  var value = (query || '').trim().toLowerCase();
  document.querySelectorAll('#soundboard .btn').forEach(function (btn) {
    btn.style.display = btn.textContent.toLowerCase().includes(value) ? '' : 'none';
  });
}

function clearSoundboardSearch() {
  var input = document.getElementById('soundboardSearch');
  input.value = '';
  filterSoundboard('');
  input.focus();
}

(function () {
  function closeAllDropdowns(except) {
    document.querySelectorAll('.hud-dropdown.open').forEach(function (d) {
      if (d !== except) d.classList.remove('open');
    });
  }

  document.querySelectorAll('.hud-dropdown').forEach(function (dropdown) {
    var toggle = dropdown.querySelector('.hud-icon-btn');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('open');
      closeAllDropdowns();
      dropdown.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
    var menu = dropdown.querySelector('.hud-menu');
    if (menu) menu.addEventListener('click', function (e) { e.stopPropagation(); });
  });

  document.addEventListener('click', function () { closeAllDropdowns(); });

  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }
})();
