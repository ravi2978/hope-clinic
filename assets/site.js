/* Hope Homeo Clinic — interactions. No framework, no CDN. */
(function () {
  'use strict';
  var CFG = window.HHC_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  // Pages are served from their own directory (/about, /contact), so the path
  // back to the home page is whatever the header logo already points at.
  var HOME = (document.getElementById('home-link') || {}).getAttribute
    ? document.getElementById('home-link').getAttribute('href') : '../';

  /* ---------------- mobile navigation ---------------- */
  var toggle = $('.nav-toggle'), nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------------- shared helpers ---------------- */
  function digits(v) { return String(v || '').replace(/\D/g, ''); }

  function showAlert(form, title, body) {
    var box = form.querySelector('.form-alert');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-alert';
      box.innerHTML = '<div class="form-alert-title"></div><div class="form-alert-body"></div>';
      form.insertBefore(box, form.firstChild);
    }
    box.querySelector('.form-alert-title').textContent = title;
    box.querySelector('.form-alert-body').textContent = body;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function clearAlert(form) {
    var box = form.querySelector('.form-alert');
    if (box) box.remove();
  }
  function markBad(input, message) {
    input.setAttribute('aria-invalid', 'true');
    var next = input.parentNode.querySelector('.field-error');
    if (!next) {
      next = document.createElement('div');
      next.className = 'field-error';
      input.parentNode.appendChild(next);
    }
    next.textContent = message;
  }
  function clearBad(input) {
    input.removeAttribute('aria-invalid');
    var e = input.parentNode.querySelector('.field-error');
    if (e) e.remove();
  }

  /* Deliver to Web3Forms (email) and, if configured, a Google Sheet.
     Returns true only when the email actually went through. */
  function deliver(subject, fields) {
    if (CFG.sheetEndpoint) {
      try {
        fetch(CFG.sheetEndpoint, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(fields),
        }).catch(function () {});
      } catch (e) {}
    }
    if (!CFG.web3formsKey) return Promise.resolve(false);
    var payload = Object.assign({
      access_key: CFG.web3formsKey,
      subject: subject,
      from_name: 'Hope Homeo Clinic website',
    }, fields);
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json(); })
      .then(function (j) { return !!j.success; })
      .catch(function () { return false; });
  }

  function waLink(text) {
    return 'https://wa.me/' + (CFG.whatsapp || '917481908030') + '?text=' + encodeURIComponent(text);
  }

  /* ---------------- booking form ---------------- */
  var bookForm = $('#book-form');
  if (bookForm) {
    var slot = 'Morning';
    var slotBtns = bookForm.querySelectorAll('[data-slot]');
    function paintSlots() {
      slotBtns.forEach(function (b) {
        var on = b.getAttribute('data-slot') === slot;
        b.style.background = on ? '#2F3E64' : '#fff';
        b.style.borderColor = on ? '#2F3E64' : 'rgba(47,62,100,.24)';
        b.setAttribute('aria-pressed', String(on));
        b.children[0].style.color = on ? '#F8F4EB' : '#23231F';
        b.children[1].style.color = on ? 'rgba(248,244,235,.65)' : 'rgba(35,35,31,.5)';
      });
    }
    slotBtns.forEach(function (b) {
      b.addEventListener('click', function () { slot = b.getAttribute('data-slot'); paintSlots(); });
    });
    paintSlots();

    // Don't offer dates in the past, or Sundays (clinic closed).
    var dateEl = bookForm.elements.date;
    if (dateEl) dateEl.min = new Date().toISOString().slice(0, 10);

    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = bookForm.elements;
      var v = function (k) { return f[k] && f[k].value ? String(f[k].value).trim() : ''; };
      var ok = true;

      clearBad(f.name); clearBad(f.phone); clearAlert(bookForm);
      if (!v('name')) { markBad(f.name, 'Please tell us your name.'); ok = false; }
      var d = digits(v('phone'));
      if (d.length < 10) { markBad(f.phone, 'Please add a 10-digit number we can reach you on.'); ok = false; }
      if (!ok) {
        showAlert(bookForm, 'We need a little more before sending this',
          'A name and a phone number, so the clinic can call you back to confirm.');
        return;
      }

      var phone = '+91 ' + d.slice(-10);
      var when = (v('date') || 'Any day this week') + ' · ' + slot;
      var data = {
        Name: v('name'), Phone: phone, Age: v('age') || '—',
        City: v('city') || '—', Concern: v('concern') || '—',
        Preferred: when, Notes: v('notes') || '—',
      };

      var msg = 'Namaste, I would like to book an appointment at Hope Homeo Clinic.\n\n'
        + 'Name: ' + data.Name + '\n'
        + 'Phone: ' + data.Phone + '\n'
        + 'Age: ' + data.Age + '\n'
        + 'Coming from: ' + data.City + '\n'
        + 'Concern: ' + data.Concern + '\n'
        + 'Preferred: ' + data.Preferred
        + (v('notes') ? '\n\nNotes: ' + v('notes') : '');

      var btn = bookForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      var label = btn.innerHTML;
      btn.innerHTML = 'Sending…';

      deliver('New appointment request — ' + data.Name + ' (' + data.Concern + ')', data)
        .then(function (emailed) { showSent(data, msg, emailed); })
        .catch(function () { showSent(data, msg, false); })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });

    function showSent(data, msg, emailed) {
      var host = $('#book-panel');
      var rows = ['Name', 'Phone', 'Concern', 'Age', 'Preferred', 'City']
        .map(function (k) {
          return '<div class="sent-row"><span>' + (k === 'City' ? 'Coming from' : k) + '</span><span></span></div>';
        }).join('');
      host.innerHTML =
        '<div class="sent-card">' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0E6B54" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>' +
            '<h2 class="sr" style="font-weight:400;font-size:clamp(23px,3.2vw,34px);color:#2F3E64;margin:0">Request noted</h2>' +
          '</div>' +
          '<p style="font-size:15px;line-height:1.75;color:rgba(35,35,31,.8);margin:14px 0 0;max-width:44em" id="sent-note"></p>' +
          '<div class="sent-rows">' + rows + '</div>' +
          '<a class="wa-send" id="wa-send" href="#">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="#0b3d1f"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2m5.8 14.16c-.25.69-1.44 1.32-1.99 1.4-.53.08-1.19.11-1.92-.12-.44-.14-1.01-.33-1.74-.64-3.06-1.32-5.06-4.4-5.21-4.6-.15-.2-1.25-1.66-1.25-3.17s.79-2.25 1.07-2.56c.28-.31.61-.38.81-.38.2 0 .41 0 .58.01.19.01.44-.07.69.53.25.61.86 2.11.94 2.26.08.15.13.33.02.53-.1.2-.16.33-.31.5-.15.18-.32.39-.46.53-.15.15-.31.32-.13.62.18.31.79 1.31 1.7 2.12 1.17 1.04 2.16 1.37 2.47 1.52.31.15.49.13.67-.08.18-.2.77-.9.98-1.21.2-.31.41-.25.69-.15.28.1 1.78.84 2.09.99.31.15.51.23.58.35.08.13.08.72-.17 1.41"/></svg>' +
            'Also send it on WhatsApp' +
          '</a>' +
          '<a class="btn-ghost" href="' + HOME + '">Back to home</a>' +
        '</div>';

      var vals = [data.Name, data.Phone, data.Concern, data.Age, data.Preferred, data.City];
      host.querySelectorAll('.sent-row').forEach(function (r, i) { r.children[1].textContent = vals[i]; });
      $('#wa-send').href = waLink(msg);
      $('#sent-note').textContent = emailed
        ? 'The clinic has your request and will call ' + data.Phone + ' to confirm the time. If you would like it to reach Dr. Kumari straight away, send it on WhatsApp as well.'
        : 'Please tap the WhatsApp button below to send this to the clinic — that is what reaches Dr. Kumari. You can also call ' + (CFG.phone || '+917481908030').replace('+91', '+91 ') + ' directly.';
      host.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------------- enquiry form ---------------- */
  var askForm = $('#enquiry-form');
  if (askForm) {
    askForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = askForm.elements;
      var v = function (k) { return f[k] && f[k].value ? String(f[k].value).trim() : ''; };
      clearBad(f.name); clearBad(f.phone); clearAlert(askForm);
      var ok = true;
      if (!v('name')) { markBad(f.name, 'Please tell us your name.'); ok = false; }
      var d = digits(v('phone'));
      if (d.length < 10) { markBad(f.phone, 'Please add a 10-digit number we can reach you on.'); ok = false; }
      if (!ok) { showAlert(askForm, 'We need a little more before sending this', 'A name and a phone number, so the clinic can reply.'); return; }

      var data = { Name: v('name'), Phone: '+91 ' + d.slice(-10), Message: v('message') || '—' };
      var msg = 'Namaste, I have a question for Hope Homeo Clinic.\n\nName: ' + data.Name
        + '\nPhone: ' + data.Phone + '\n\n' + (v('message') || '');

      var btn = askForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      var label = btn.innerHTML;
      btn.innerHTML = 'Sending…';

      deliver('Website enquiry — ' + data.Name, data)
        .then(function (emailed) {
          var host = $('#enquiry-panel');
          host.innerHTML =
            '<div class="sent-card">' +
              '<h2 class="sr" style="font-weight:400;font-size:clamp(22px,3vw,30px);color:#2F3E64;margin:0">Thank you</h2>' +
              '<p style="font-size:15px;line-height:1.75;color:rgba(35,35,31,.8);margin:12px 0 0"></p>' +
              '<a class="wa-send" href="' + waLink(msg) + '">Also send it on WhatsApp</a>' +
            '</div>';
          host.querySelector('p').textContent = emailed
            ? 'Your message has reached the clinic. Dr. Kumari will call ' + data.Phone + ' back.'
            : 'Please tap the WhatsApp button below to send this to the clinic — that is what reaches Dr. Kumari.';
          host.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  }
})();
