/* ============================================================
   VIVO — cart enhancements (shared across every page)
   1) Free-shipping progress bar toward the $200 threshold.
   2) Dynamic delivery estimate (ships next business day +
      arrival window), replacing the static delivery banner.
   3) "Research Water" add-on suggestion when the cart has
      items but no bacteriostatic water.
   Loaded after each page's inline cart script so it can reuse
   the global addToCart()/renderCart().
   ============================================================ */
(function(){
  var REC_ID = 'research-water';
  var FREE = 200;                     /* free-shipping threshold */
  var water = null;
  try { water = PRODUCTS.find(function(p){ return p.id === REC_ID; }); } catch(e){ return; }
  var drawer = document.getElementById('drawer');
  var items  = document.getElementById('cartItems');
  var foot   = document.getElementById('cartFoot');
  if(!drawer || !items || !foot) return;

  var money = function(n){ return '$' + Number(n).toLocaleString('en-US'); };
  var byId  = function(id){ try { return PRODUCTS.find(function(p){ return p.id === id; }); } catch(e){ return null; } };

  /* ---- dynamic delivery estimate (computed once from today) ---- */
  function addDays(d, n){ var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function nextBiz(d){ var x = addDays(d, 1), g = x.getDay(); if(g === 6) x = addDays(x, 2); else if(g === 0) x = addDays(x, 1); return x; }
  function fmt(d){ return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }); }
  var ship = nextBiz(new Date());
  var arriveTxt = fmt(addDays(ship, 2)) + ' – ' + fmt(addDays(ship, 4));

  var truck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h13v9H1z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="5.5" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>';
  var clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.7"/></svg>';
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

  /* styles (scoped, injected once) */
  var css = ''
    + '#shipNote{ display:none !important; }'   /* replaces the static delivery banner */
    + '.cart-shipping{ border-top:1px solid var(--line); }'
    + '.cart-ship{ margin:16px 22px 4px; }'
    + '.cart-ship[hidden]{ display:none; }'
    + '.cart-ship-msg{ display:flex; align-items:center; gap:8px; font-size:.78rem; color:var(--ink); margin-bottom:8px; }'
    + '.cart-ship-msg svg{ width:18px; height:18px; flex-shrink:0; }'
    + '.cart-ship-msg b{ font-weight:700; }'
    + '.cart-ship-track{ height:5px; background:var(--sand); overflow:hidden; }'
    + '.cart-ship-fill{ height:100%; width:0; background:var(--ink); transition:width .45s var(--ease-out); }'
    + '.cart-ship-label{ margin-top:6px; text-align:right; font-size:.72rem; color:var(--muted); }'
    + '.cart-eta{ margin:12px 22px 18px; text-align:center; }'
    + '.cart-eta[hidden]{ display:none; }'
    + '.cart-eta-pill{ display:inline-flex; align-items:center; gap:7px; background:var(--sage-tint); color:var(--sage-deep); padding:7px 15px; border-radius:999px; font-size:.8rem; font-weight:600; }'
    + '.cart-eta-pill svg{ width:15px; height:15px; flex-shrink:0; }'
    + '.cart-eta-arrive{ display:flex; align-items:center; justify-content:center; gap:7px; margin-top:9px; font-size:.82rem; color:var(--ink); }'
    + '.cart-eta-arrive svg{ width:15px; height:15px; color:var(--sage-deep); flex-shrink:0; }'
    + '.cart-rec{ display:flex; align-items:center; gap:11px; margin:0 22px; padding:13px 0; border-top:1px solid var(--line); }'
    + '.cart-rec[hidden]{ display:none; }'
    + '.cart-rec-link{ display:flex; align-items:center; gap:11px; flex:1; min-width:0; color:inherit; }'
    + '.cart-rec-link img{ width:30px; height:38px; object-fit:contain; flex-shrink:0; opacity:.9; }'
    + '.cart-rec-body{ min-width:0; }'
    + '.cart-rec-name{ display:block; font-size:.85rem; font-weight:600; color:var(--ink); }'
    + '.cart-rec-link:hover .cart-rec-name{ text-decoration:underline; text-underline-offset:2px; }'
    + '.cart-rec-desc{ display:block; font-size:.72rem; color:var(--muted); margin-top:1px; }'
    + '.cart-rec-add{ flex-shrink:0; align-self:center; background:none; border:1px solid var(--line); color:var(--ink); padding:.5em .95em; font-size:.72rem; font-weight:600; cursor:pointer; white-space:nowrap; transition:border-color .2s ease, background-color .2s ease; }'
    + '.cart-rec-add:hover{ border-color:var(--ink); background:var(--sand); }';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  /* free-shipping bar, at the top of the drawer */
  var shipBar = document.createElement('div');
  shipBar.className = 'cart-ship'; shipBar.hidden = true;
  shipBar.innerHTML = '<div class="cart-ship-msg">' + truck + '<span class="cart-ship-txt"></span></div>'
    + '<div class="cart-ship-track"><div class="cart-ship-fill"></div></div>'
    + '<div class="cart-ship-label">Free shipping &middot; ' + money(FREE) + '</div>';
  var txtEl = shipBar.querySelector('.cart-ship-txt');
  var fillEl = shipBar.querySelector('.cart-ship-fill');

  /* dynamic delivery estimate (replaces the old banner) */
  var eta = document.createElement('div');
  eta.className = 'cart-eta'; eta.hidden = true;
  eta.innerHTML = '<span class="cart-eta-pill">' + clock + 'Order now, ships next business day</span>'
    + '<div class="cart-eta-arrive">' + check + '<span>Arrives ' + arriveTxt + '</span></div>';

  /* recommendation, above the cart footer */
  var rec = document.createElement('div');
  rec.className = 'cart-rec'; rec.hidden = true;
  if(water){
    rec.innerHTML = '<a class="cart-rec-link" href="product.html?id=' + REC_ID + '">'
      + '<img src="' + water.img + '" alt="' + water.name + '">'
      + '<span class="cart-rec-body"><span class="cart-rec-name">' + water.name + '</span>'
      + '<span class="cart-rec-desc">Reconstitutes your compounds &middot; ' + money(water.price) + '</span></span></a>'
      + '<button type="button" class="cart-rec-add">Add</button>';
    foot.parentNode.insertBefore(rec, foot);
    rec.querySelector('.cart-rec-add').addEventListener('click', function(){
      if(typeof addToCart === 'function'){ addToCart(REC_ID); }
      else {
        var c = readCart(); c[REC_ID] = (c[REC_ID] || 0) + 1;
        try { localStorage.setItem('vivo_cart', JSON.stringify(c)); } catch(e){}
        if(typeof renderCart === 'function') renderCart();
      }
      update();
    });
  }

  /* group the shipping bar + delivery estimate directly above the subtotal footer */
  var shipWrap = document.createElement('div');
  shipWrap.className = 'cart-shipping';
  shipWrap.appendChild(shipBar);
  shipWrap.appendChild(eta);
  foot.parentNode.insertBefore(shipWrap, foot);

  function readCart(){ try { return JSON.parse(localStorage.getItem('vivo_cart')) || {}; } catch(e){ return {}; } }
  function priceOf(key){
    var parts = String(key).split('::');
    if(parts.length > 2 && parts[2] !== '' && !isNaN(+parts[2])) return +parts[2];
    var p = byId(parts[0]); return p ? p.price : 0;
  }
  function subtotal(){ var c = readCart(), s = 0; Object.keys(c).forEach(function(k){ if(c[k] > 0) s += priceOf(k) * c[k]; }); return s; }
  function hasWater(){ var c = readCart(); return Object.keys(c).some(function(k){ return k.split('::')[0] === REC_ID && c[k] > 0; }); }

  function renderShip(sub){
    if(sub <= 0){ shipBar.hidden = true; return; }
    shipBar.hidden = false;
    fillEl.style.width = Math.min(100, Math.round(sub / FREE * 100)) + '%';
    if(sub >= FREE){ shipBar.classList.add('done'); txtEl.innerHTML = 'You’ve unlocked <b>free shipping</b>'; }
    else { shipBar.classList.remove('done'); txtEl.innerHTML = 'Add <b>' + money(FREE - sub) + '</b> more for free shipping'; }
  }

  function update(){
    var sub = subtotal();
    renderShip(sub);
    eta.hidden = (sub <= 0);
    if(water) rec.hidden = (sub <= 0) || hasWater();
  }

  /* re-evaluate whenever the drawer's item list re-renders (add / remove / qty) */
  try { new MutationObserver(update).observe(items, { childList:true, subtree:true }); } catch(e){}
  update();
})();
