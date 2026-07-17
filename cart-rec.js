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
  function fmt(d){ return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }); }
  var ship = nextBiz(new Date());
  var arriveTxt = fmt(addDays(ship, 2)) + ' – ' + fmt(addDays(ship, 4));

  var truck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h13v9H1z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="5.5" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>';
  var cal = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="1.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></svg>';
  var star = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.98l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z"/></svg>';

  /* styles (scoped, injected once) */
  var css = ''
    + '#shipNote{ display:none !important; }'   /* replaces the static delivery banner */
    + '.cart-shipping{ border-top:1px solid var(--line); }'
    + '.cart-ship{ margin:14px 22px; padding-bottom:15px; border-bottom:1px solid var(--line); }'   /* top banner */
    + '.cart-ship[hidden]{ display:none; }'
    + '.cart-ship-msg{ display:flex; align-items:center; gap:8px; font-size:.78rem; color:var(--ink); margin-bottom:8px; }'
    + '.cart-ship-msg svg{ width:18px; height:18px; flex-shrink:0; }'
    + '.cart-ship-msg b{ font-weight:700; }'
    + '.cart-ship-track{ height:5px; background:var(--sand); overflow:hidden; }'
    + '.cart-ship-fill{ height:100%; width:0; background:var(--ink); transition:width .45s var(--ease-out); }'
    + '.cart-eta{ margin:14px 22px 4px; text-align:left; }'
    + '.cart-eta[hidden]{ display:none; }'
    + '.cart-eta-line{ display:inline-flex; align-items:center; gap:7px; font-size:clamp(.72rem, 3vw, .82rem); color:var(--ink); white-space:nowrap; }'
    + '.cart-eta-line svg{ width:15px; height:15px; color:var(--slate); flex-shrink:0; }'
    + '.cart-eta-line b{ font-weight:700; white-space:nowrap; }'
    + '#cartFoot{ border-top:0 !important; padding-top:6px; }'   /* no hairline; delivery line sits close to the points line */
    + '#cartItems .ci:last-child{ border-bottom:0; }'   /* last row in the list has no trailing rule */
    + '.cart-rec{ padding-top:12px; }'   /* lives inside the items list; the last item’s rule is the divider */
    + '.cart-rec[hidden]{ display:none; }'
    + '.cart-rec-lead{ margin-bottom:4px; font-size:.75rem; color:var(--muted); }'
    + '.cart-rec .ci{ border-bottom:0; padding-top:8px; }'
    + '.cart-rec .cimg{ display:block; }'
    + '.cart-rec .cinfo{ display:flex; flex-direction:row; align-items:center; justify-content:space-between; gap:12px; }'
    + '.cart-rec-namelink{ color:inherit; }'
    + '.cart-rec-namelink:hover .cn{ text-decoration:underline; text-underline-offset:2px; }'
    + '.cart-rec-add{ flex-shrink:0; background:none; border:1px solid var(--line); color:var(--ink); padding:.55em 1em; font-size:.74rem; font-weight:600; cursor:pointer; white-space:nowrap; transition:border-color .2s ease, background-color .2s ease; }'
    + '.cart-rec-add:hover{ border-color:var(--ink); background:var(--sand); }'
    /* compact cart items — fit more on screen without scrolling */
    + '.drawer .dhead{ padding:16px 22px; }'
    + '.drawer .items{ padding:2px 22px; }'
    + '.ci{ position:relative; gap:12px; padding:13px 0; }'
    + '.ci .cimg{ width:62px; height:72px; }'   /* larger vial, still within the row content height */
    + '.ci .cn{ font-size:1.02rem; line-height:1.15; padding-right:22px; }'   /* room for the corner × */
    + '.ci .cd{ margin-top:2px; font-size:.63rem; }'
    + '.ci .crow{ margin-top:7px; }'
    + '.ci .qty button{ width:25px; height:25px; font-size:.95rem; }'
    + '.ci .qty .qv{ min-width:24px; }'
    + '.ci .cp{ font-size:1.02rem; }'
    /* corner × removes the whole line (reuses the existing data-rm handler) */
    + '.ci .rm{ display:block; position:absolute; top:8px; right:0; margin:0; padding:2px 0 4px 10px; background:none; border:0; font-size:0; line-height:1; text-decoration:none; cursor:pointer; }'
    + '.ci .rm::before{ content:"\\00D7"; font-size:1.3rem; font-weight:400; color:var(--muted); transition:color .2s ease; }'
    + '.ci .rm:hover::before{ color:var(--ink); }'
    + '.cart-rec .cn{ padding-right:0; }'   /* the suggestion row has no × */
    /* per-SKU quantity discount */
    + '.ci .cp.cp-disc{ display:flex; flex-direction:column; align-items:flex-end; line-height:1.15; }'
    + '.ci .cp .cp-was{ font-weight:400; font-size:.8rem; color:var(--muted); text-decoration:line-through; margin-right:5px; }'
    + '.ci .cp .cp-tag{ margin-top:1px; font-size:.58rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--clay); }'
    + '.cart-savings{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:3px; }'
    + '.cart-savings[hidden]{ display:none; }'
    + '.cart-savings .cs-l{ font-size:.72rem; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); font-weight:600; }'
    + '.cart-savings .cs-v{ font-size:.95rem; color:var(--clay); font-weight:700; }'
    /* points earned */
    + '.cart-points{ display:flex; align-items:center; gap:7px; margin-bottom:10px; font-size:.75rem; color:var(--muted); }'
    + '.cart-points[hidden]{ display:none; }'
    + '.cart-points svg{ width:14px; height:14px; flex-shrink:0; color:var(--amber); }'
    + '.cart-points b{ color:var(--ink); font-weight:700; }';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  /* free-shipping bar, at the top of the drawer */
  var shipBar = document.createElement('div');
  shipBar.className = 'cart-ship'; shipBar.hidden = true;
  shipBar.innerHTML = '<div class="cart-ship-msg">' + truck + '<span class="cart-ship-txt"></span></div>'
    + '<div class="cart-ship-track"><div class="cart-ship-fill"></div></div>';
  var txtEl = shipBar.querySelector('.cart-ship-txt');
  var fillEl = shipBar.querySelector('.cart-ship-fill');

  /* dynamic delivery estimate (replaces the old banner) */
  var eta = document.createElement('div');
  eta.className = 'cart-eta'; eta.hidden = true;
  eta.innerHTML = '<span class="cart-eta-line">' + cal + '<span>Check out now to receive your order <b>' + arriveTxt + '</b></span></span>';

  /* recommendation, above the cart footer */
  var rec = document.createElement('div');
  rec.className = 'cart-rec'; rec.hidden = true;
  if(water){
    rec.innerHTML = '<div class="cart-rec-lead">You might want to add this</div>'
      + '<div class="ci" style="--ph:' + (water.ph || '#b4bcc0') + '">'
      + '<a class="cimg" href="product.html?id=' + REC_ID + '"><img src="' + water.img + '" alt="' + water.name + '"></a>'
      + '<div class="cinfo">'
      + '<div class="cart-rec-text">'
      + '<a class="cart-rec-namelink" href="product.html?id=' + REC_ID + '"><div class="cn">' + water.name + '</div></a>'
      + '<div class="cd">' + water.cat + ' &middot; ' + water.dose + '</div>'
      + '</div>'
      + '<button type="button" class="cart-rec-add">Add &middot; ' + money(water.price) + '</button>'
      + '</div></div>';
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

  /* free-shipping progress bar sits at the very top of the cart, above the items */
  items.parentNode.insertBefore(shipBar, items);

  /* delivery estimate stays just above the subtotal footer */
  var shipWrap = document.createElement('div');
  shipWrap.className = 'cart-shipping';
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
  function discRate(q){ return (typeof qtyDiscountRate === 'function') ? qtyDiscountRate(q) : (q >= 6 ? 0.10 : q >= 3 ? 0.05 : 0); }
  function lineDisc(orig, q){ return Math.round(orig * (1 - discRate(q))); }   /* discounted line total */
  function cartTotals(){
    var c = readCart(), orig = 0, disc = 0;
    Object.keys(c).forEach(function(k){ var q = c[k]; if(q <= 0) return; var lo = priceOf(k) * q; orig += lo; disc += lineDisc(lo, q); });
    return { orig: orig, disc: disc, savings: orig - disc };
  }

  function renderShip(sub){
    if(sub <= 0){ shipBar.hidden = true; return; }
    shipBar.hidden = false;
    fillEl.style.width = Math.min(100, Math.round(sub / FREE * 100)) + '%';
    if(sub >= FREE){ shipBar.classList.add('done'); txtEl.innerHTML = 'You’ve unlocked <b>free shipping</b>'; }
    else { shipBar.classList.remove('done'); txtEl.innerHTML = 'Add <b>' + money(FREE - sub) + '</b> more for free shipping'; }
  }

  /* keep the suggestion as the last row inside the items list (survives re-renders) */
  function placeRec(){
    if(!water) return;
    if(rec.hidden){ if(rec.parentNode) rec.parentNode.removeChild(rec); }
    else if(items.lastElementChild !== rec){ items.appendChild(rec); }
  }

  /* write only when different, so re-rendering .cp doesn't retrigger the observer forever */
  function setHTML(el, html){ if(el && el.innerHTML !== html){ el.innerHTML = html; } }

  var savingsEl = null;
  function renderSavings(sav){
    if(!savingsEl){
      savingsEl = document.createElement('div');
      savingsEl.className = 'cart-savings';
      foot.insertBefore(savingsEl, foot.firstChild);   /* footer is outside #cartItems, so no observer loop */
    }
    if(sav > 0){ setHTML(savingsEl, '<span class="cs-l">Total savings</span><span class="cs-v">&minus;' + money(sav) + '</span>'); savingsEl.hidden = false; }
    else { savingsEl.hidden = true; }
  }

  var pointsEl = null;
  function renderPoints(amount){
    if(!pointsEl){
      pointsEl = document.createElement('div');
      pointsEl.className = 'cart-points';
      foot.insertBefore(pointsEl, foot.firstChild);   /* above the savings line (savings is inserted first) */
    }
    var pts = Math.floor(amount);   /* $1 = 1 point */
    if(pts > 0){ setHTML(pointsEl, star + '<span>Earn <b>' + pts.toLocaleString('en-US') + '</b> points with this order</span>'); pointsEl.hidden = false; }
    else { pointsEl.hidden = true; }
  }

  function applyLineDiscounts(){
    var c = readCart();
    var rows = items.querySelectorAll(':scope > .ci');
    for(var i = 0; i < rows.length; i++){
      var inc = rows[i].querySelector('[data-inc]'); if(!inc) continue;
      var key = inc.getAttribute('data-inc');
      var q = c[key] || 0, orig = priceOf(key) * q, rate = discRate(q);
      var cp = rows[i].querySelector('.cp'); if(!cp) continue;
      if(rate > 0){
        setHTML(cp, '<span class="cp-line"><s class="cp-was">' + money(orig) + '</s> ' + money(lineDisc(orig, q)) + '</span><span class="cp-tag">' + Math.round(rate * 100) + '% off</span>');
        cp.classList.add('cp-disc');
      } else {
        setHTML(cp, money(orig));
        cp.classList.remove('cp-disc');
      }
    }
    var totals = cartTotals();
    var subEl = document.getElementById('subtotal');
    if(subEl){ var want = money(totals.disc); if(subEl.textContent !== want) subEl.textContent = want; }
    renderSavings(totals.savings);
    renderPoints(totals.disc);
  }

  function update(){
    var totals = cartTotals();
    var has = totals.orig > 0;
    renderShip(totals.disc);
    eta.hidden = !has;
    if(water) rec.hidden = !has || hasWater();
    placeRec();
    applyLineDiscounts();
  }

  /* re-evaluate whenever the drawer's item list re-renders (add / remove / qty) */
  try { new MutationObserver(update).observe(items, { childList:true, subtree:true }); } catch(e){}
  update();
})();
