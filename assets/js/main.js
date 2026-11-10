/* ООО «Морской вектор» — скрипты сайта */
(function () {
  'use strict';

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Мобильное меню ---------- */
  var burger = document.querySelector('[data-burger]');
  var mnav = document.querySelector('[data-mobile-nav]');
  if (burger && mnav) {
    var closeBtn = mnav.querySelector('[data-close-nav]');
    var open = function () {
      mnav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded', 'true');
    };
    var close = function () {
      mnav.classList.remove('is-open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    mnav.addEventListener('click', function (e) {
      if (e.target === mnav) close();
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Аккордеоны ---------- */
  document.querySelectorAll('[data-acc]').forEach(function (acc) {
    var head = acc.querySelector('.acc__head');
    if (!head) return;
    head.addEventListener('click', function () {
      var group = acc.getAttribute('data-acc-group');
      if (group) {
        document.querySelectorAll('[data-acc-group="' + group + '"]').forEach(function (other) {
          if (other !== acc) other.classList.remove('is-open');
        });
      }
      var isOpen = acc.classList.toggle('is-open');
      head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Фильтр вакансий ---------- */
  var filterWrap = document.querySelector('[data-filters]');
  if (filterWrap) {
    var allAccs = document.querySelectorAll('[data-vacancy]');
    filterWrap.querySelectorAll('.filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterWrap.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var key = btn.getAttribute('data-filter');
        var shown = 0;
        allAccs.forEach(function (item) {
          var match = key === 'all' || item.getAttribute('data-dept') === key;
          item.style.display = match ? '' : 'none';
          if (!match) item.classList.remove('is-open');
          if (match) shown++;
        });
        var empty = document.querySelector('[data-vacancy-empty]');
        if (empty) empty.style.display = shown ? 'none' : 'block';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Кнопка «вверх» ---------- */
  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 520);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Модальное окно отклика на вакансию ---------- */
  var modal = document.querySelector('[data-modal="response"]');
  if (modal) {
    var modalVac = modal.querySelector('[data-modal-vacancy]');
    var lastFocus = null;

    var openModal = function (title) {
      lastFocus = document.activeElement;
      if (modalVac) modalVac.textContent = title || 'Открытая вакансия';
      var sel = modal.querySelector('#resp_position');
      if (sel && title) {
        var matched = false;
        Array.prototype.forEach.call(sel.options, function (o) {
          if (o.value === title.trim()) { o.selected = true; matched = true; }
        });
        if (!matched) sel.value = 'Другое';
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      var first = modal.querySelector('input, select, textarea');
      if (first) setTimeout(function () { first.focus(); }, 120);
    };

    var closeModal = function () {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    document.querySelectorAll('[data-open-response]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn.getAttribute('data-vacancy-title'));
      });
    });

    modal.querySelectorAll('[data-close-modal]').forEach(function (b) {
      b.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    var responseForm = modal.querySelector('form');
    if (responseForm) {
      responseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = responseForm.querySelector('.form__ok');
        if (ok) ok.classList.add('is-visible');
        responseForm.querySelectorAll('input, textarea, select, button').forEach(function (f) { f.disabled = true; });
      });
    }
  }

  /* ---------- Формы на страницах ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form__ok');
      if (ok) {
        ok.classList.add('is-visible');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.querySelectorAll('input, textarea, select, button').forEach(function (f) { f.disabled = true; });
    });
  });

  /* ---------- Год в футере ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Подсветка активного пункта меню ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    if (href && href === path && href !== '') {
      var li = a.closest('.nav__item');
      if (li) li.classList.add('is-active');
    }
  });
})();

/* ---------- подбор перевозки и температурная шкала ---------- */
var WA = 'https://wa.me/375296098025';
(function () {
  function $(s,r){return (r||document).querySelector(s);}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
  function initCalc() {
    var out = $('#cOutVehicle');
    if (!out) return;
    var state = { dir: 'by', dirName: 'Беларусь', cargo: 'dry', cargoName: 'Сухой', weight: 12, extras: [] };
    var TEMPS = { dry: '—', chill: '0…+4 °C', frozen: '−18 °C', deep: '−25 °C' };
    var CARGO = { dry: 'Сухой', chill: 'Охлаждённый', frozen: 'Замороженный', deep: 'Глубокой заморозки' };
    var DIRS = { by: 'Беларусь', eaeu: 'ЕАЭС · Россия', eu: 'ЕС', multi: 'Мультимодально' };
    var REF = { chill: 1, frozen: 1, deep: 1 };

    function compute() {
      var ref = !!REF[state.cargo];
      var w = state.weight;
      var vehicle, mon, time, docs, note;

      if (w <= 5) {
        vehicle = (ref ? 'Малотоннажный реф' : 'Малотоннажный тент') + ' до 5 т';
      } else if (state.dir === 'multi' || (state.dir === 'eu' && w > 20)) {
        vehicle = (ref ? 'Реф-контейнер 40′' : 'Контейнер 40′') + ' + авто';
      } else {
        vehicle = ref ? 'Тягач + реф-полуприцеп, до 22 т' : 'Тягач + тент, до 22 т';
      }

      mon = ref ? 'Датчик в кузове + онлайн-лог' : 'GPS-статус рейса';

      time = { by: '1 день', eaeu: '2–3 дня', eu: '4–6 дней', multi: '5–8 дней' }[state.dir];

      if (state.dir === 'by') {
        docs = 'ТТН и акт приёма-передачи. Для продукции — ветеринарные документы.';
      } else if (state.dir === 'eaeu') {
        docs = 'ТТН/CMR, ветеринарный сертификат для продукции, документы по ЕАЭС.';
      } else if (state.dir === 'eu') {
        docs = 'CMR, TIR, таможенное оформление и ветеринарный сертификат для продукции.';
      } else {
        docs = 'CMR и железнодорожная накладная, перегрузка на контейнерной площадке в Колядичах.';
      }

      note = 'Перевозка из Колядичей: ';
      if (ref) note += 'температурный режим ' + TEMPS[state.cargo] + ' держится на всём пути, протокол температуры отдаём при сдаче. ';
      else note += 'груз сухой, температурный режим не требуется. ';
      if (state.extras.indexOf('store') > -1) note += 'Добавим ответственное хранение на терминале. ';
      if (state.extras.indexOf('load') > -1) note += 'Погрузку и разгрузку организуем. ';
      if (state.extras.indexOf('docs') > -1) note += 'Таможенное оформление берём на себя. ';
      note += 'Документы: ' + docs;

      $('#cOutVehicle').textContent = vehicle;
      $('#cOutTemp').textContent = REF[state.cargo] ? TEMPS[state.cargo] : 'без режима';
      $('#cOutMon').textContent = mon;
      $('#cOutTime').textContent = time;
      $('#cOutText').textContent = note;
      $('#cDirL').textContent = DIRS[state.dir];
      $('#cCargoL').textContent = CARGO[state.cargo];
      $('#cWeightL').textContent = w + ' т';

      var txt = 'Заявка с сайта «Морской вектор»\nНаправление: ' + DIRS[state.dir] +
        '\nГруз: ' + CARGO[state.cargo] + (REF[state.cargo] ? ' (' + TEMPS[state.cargo] + ')' : '') +
        '\nВес партии: ' + w + ' т' +
        (state.extras.length ? '\nДополнительно: ' + state.extras.map(function (k) { return ({ store: 'хранение', load: 'погрузка/разгрузка', docs: 'таможня' })[k]; }).join(', ') : '') +
        '\nРекомендация: ' + vehicle + ', ' + time;
      var send = $('#cSend');
      if (send) send.href = WA + '?text=' + encodeURIComponent(txt);
    }

    function group(id, key, map) {
      var box = $(id);
      if (!box) return;
      box.addEventListener('click', function (e) {
        var t = e.target.closest('.chip'); if (!t) return;
        $$('.chip', box).forEach(function (c) { c.classList.toggle('is-on', c === t); });
        state[key] = t.getAttribute('data-v');
        compute();
      });
    }
    group('#cDir', 'dir');
    group('#cCargo', 'cargo');

    var ex = $('#cExtra');
    if (ex) ex.addEventListener('click', function (e) {
      var t = e.target.closest('.chip'); if (!t) return;
      var v = t.getAttribute('data-v');
      var i = state.extras.indexOf(v);
      if (i > -1) { state.extras.splice(i, 1); t.classList.remove('is-on'); }
      else { state.extras.push(v); t.classList.add('is-on'); }
      compute();
    });

    var w = $('#cWeight');
    if (w) w.addEventListener('input', function () { state.weight = parseInt(w.value, 10); compute(); });
    compute();
  }

  /* температура */
  function initTemp() {
    var box = $('#tModes');
    if (!box) return;
    var DATA = {
      '-18': { lbl: '−18 °C', name: 'Замороженный груз', equip: 'Реф-контейнер 40′', pos: 14, txt: 'Для замороженной продукции держим −18 °C и ниже: датчики пишут температуру в облако, а в терминале Колядичи контейнер получает питание с первого дня.' },
      '2': { lbl: '0…+4 °C', name: 'Охлаждённый груз', equip: 'Реф-фура 0…+4 °C', pos: 52, txt: 'Охлаждённый груз — самый чувствительный: держим 0…+4 °C и контролируем режим на стоянках и границе, чтобы продукция не ушла в тепло.' },
      '10': { lbl: '+8…+12 °C', name: 'Прохладный режим', equip: 'Реф + климат-контроль', pos: 70, txt: 'Для грузов, которым вреден и холод, и жара: +8…+12 °C, мягкий режим без риска подморозить продукцию.' },
      '20': { lbl: 'без режима', name: 'Сухой груз', equip: 'Тент / шторный полуприцеп', pos: 90, txt: 'Сухим грузам нужен не холод, а сухость и сохранность упаковки. Контролируем статус рейса и состояние груза при приёмке и выдаче.' }
    };
    function set(t) {
      var d = DATA[String(t)]; if (!d) return;
      $$('.chip', box).forEach(function (c) { c.classList.toggle('is-on', c.getAttribute('data-t') === String(t)); });
      var mark = $('#tMark');
      if (mark) { mark.style.left = d.pos + '%'; mark.setAttribute('data-l', d.lbl); }
      $('#tName').textContent = d.name;
      $('#tEquip').textContent = d.equip;
      $('#tText').textContent = d.txt;
    }
    box.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (c) set(c.getAttribute('data-t'));
    });
    set('-18');
  }

  /* вакансии */

  document.addEventListener('DOMContentLoaded', function(){ initCalc(); initTemp(); });
})();
