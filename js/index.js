/* Accueil : mots qui defilent, onglets "comment ca marche", FAQ */
document.addEventListener('DOMContentLoaded', function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mots qui defilent dans le titre
  var rotator = document.getElementById('rotator');
  var words = ['plombier', 'électricien', 'menuisier', 'peintre', 'coiffeur', 'livreur', 'professeur', 'mécanicien'];
  if (rotator && !reduce) {
    var i = 0;
    setInterval(function () {
      rotator.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        rotator.textContent = words[i];
        rotator.classList.remove('out');
      }, 380);
    }, 2400);
  }

  // Onglets clients / prestataires
  var tabs = document.querySelectorAll('.tab');
  var indicator = document.querySelector('.tab-indicator');
  function moveIndicator(tab) {
    if (!indicator || !tab) return;
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      document.querySelectorAll('.steps').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === name); });
      document.querySelectorAll('[data-panel-img]').forEach(function (img) { img.classList.toggle('active', img.getAttribute('data-panel-img') === name); });
      moveIndicator(tab);
    });
  });
  moveIndicator(document.querySelector('.tab.active'));
  window.addEventListener('resize', function () { moveIndicator(document.querySelector('.tab.active')); });

  // FAQ : une seule question ouverte a la fois
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) items.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });
});
