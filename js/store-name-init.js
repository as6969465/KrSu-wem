(function(){
  var n = localStorage.getItem('krsu_store_name');
  if (!n) return;
  function apply() {
    document.querySelectorAll('.store-name-el').forEach(function(el){ el.textContent = n; });
    document.title = document.title.replace(/KrSu-wem/g, n);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
