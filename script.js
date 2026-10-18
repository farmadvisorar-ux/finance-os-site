// ==========================================================================
// Ledgerline — Interactive behavior matching reference Datarails homepage
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroInteractive();
  initLogosMarquee();
  initExcelSheet();
  initSolutionTabs();
  initTestimonialsCarousel();
  initIntegrationsMarquee();
  initClaudeVsModal();
  initWhyTabs();
  initIndustryTabs();
  initDemoModal();
  initScrollTop();
  initScrollReveal();
  setCopyrightYear();
});

// --------------------------------------------------------------------------
// Navigation & Mega Menus
// --------------------------------------------------------------------------
function initNav() {
  const menuData = [
    {
      title: 'Solutions',
      cols: [
        {
          heading: 'Use Cases',
          items: [
            { icon: '#i-layers', label: 'Consolidation', desc: 'Eliminate manual aggregation and reconcile entities instantly' },
            { icon: '#i-trend', label: 'Planning, Budgeting & Forecasting', desc: 'Driver-based models connected to real-time GL and CRM' },
            { icon: '#i-file', label: 'Financial Reporting', desc: 'Automate board packs, management reports, and P&L statements' },
            { icon: '#i-pie', label: 'Data Visualization', desc: 'Self-serve interactive dashboards with drill-downs' }
          ]
        },
        {
          heading: 'Industries',
          wide: true,
          items: [
            { icon: '#i-store', label: 'Retail', desc: 'Omnichannel inventory & margin visibility' },
            { icon: '#i-building', label: 'Construction & Real Estate', desc: 'Project-level job costing & cash flows' },
            { icon: '#i-briefcase', label: 'Professional Services', desc: 'Utilization rates & project billing' },
            { icon: '#i-heart', label: 'Healthcare', desc: 'Multi-clinic departmental budgeting' },
            { icon: '#i-factory', label: 'Manufacturing', desc: 'Standard vs actual cost variance analysis' },
            { icon: '#i-people', label: 'Non-Profit', desc: 'Fund accounting & grant tracking' },
            { icon: '#i-bank', label: 'Financial Services', desc: 'Multi-entity regulatory compliance' },
            { icon: '#i-ticket', label: 'Hospitality & Entertainment', desc: 'Venue level RevPAR & operational metrics' },
            { icon: '#i-cpu', label: 'Technology & Software', desc: 'SaaS metrics, ARR waterfalls & CAC' },
            { icon: '#i-truck', label: 'Transportation & Logistics', desc: 'Fuel, fleet & route profitability' }
          ]
        }
      ]
    },
    {
      title: 'Product',
      cols: [
        {
          heading: 'The Platform',
          items: [
            { icon: '#i-layers', label: 'FinanceOS', desc: 'The unified operating layer for finance data' },
            { icon: '#i-spark', label: 'Ledgerline AI', desc: 'Governed LLM workflows with audit-grade grounding' },
            { icon: '#i-plug', label: 'Integrations', desc: 'Pre-built connectors to 600+ ERP, CRM & HR systems' },
            { icon: '#i-phone', label: 'Ledgerline Mobile', desc: 'KPI monitoring and executive approvals on the go' }
          ]
        },
        {
          heading: 'The Products',
          items: [
            { icon: '#i-trend', label: 'Ledgerline FP&A', desc: 'Plan, budget, forecast and report with real-time insights' },
            { icon: '#i-checklist', label: 'Ledgerline Month-End Close', desc: 'Plan, track, and execute every close task start to finish' },
            { icon: '#i-wallet', label: 'Ledgerline Cash', desc: 'Real-time visibility into cash positions & 13-week forecasting' },
            { icon: '#i-card', label: 'Ledgerline Spend', desc: 'Full control over spend before, during, and after commitments' },
            { icon: '#i-inbox', label: 'Ledgerline Desk', desc: 'Resolve finance queries with AI-drafted responses' },
            { icon: '#i-link', label: 'FinanceOS AI Connector', desc: 'Connect leading AI tools directly to governed numbers' }
          ]
        }
      ]
    },
    { title: 'Pricing', href: '#pricing' },
    {
      title: 'Resources',
      cols: [
        {
          heading: 'Resource Center',
          items: [
            { icon: '#i-book', label: 'Blog', desc: 'Insights, analysis and best practices from CFOs' },
            { icon: '#i-mic', label: 'Podcast', desc: 'Interviews with leading finance visionaries' },
            { icon: '#i-flask', label: 'Research & Reports', desc: 'Annual benchmarks on FP&A automation & metrics' },
            { icon: '#i-table', label: 'Free Excel Templates', desc: '30+ free financial models and budget templates' },
            { icon: '#i-calendar', label: 'Events & Webinars', desc: 'Live roundtables and product demonstrations' },
            { icon: '#i-cap', label: 'FinanceOS Academy', desc: 'Certifications and interactive video courses' }
          ]
        }
      ]
    },
    { title: 'Customer Stories', href: '#stories' },
    {
      title: 'About',
      cols: [
        {
          heading: 'About Us',
          items: [
            { icon: '#i-building', label: 'Company', desc: 'Our mission to liberate finance professionals' },
            { icon: '#i-users', label: 'Careers', desc: 'Join our globally distributed, fast-growing team' },
            { icon: '#i-link', label: 'Affiliates', desc: 'Earn referral rewards sharing Ledgerline' },
            { icon: '#i-briefcase', label: 'Partners', desc: 'Consulting, implementation, and technology alliances' },
            { icon: '#i-mail', label: 'Contact Us', desc: 'Get in touch with support, sales, or press' }
          ]
        }
      ]
    }
  ];

  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  menuData.forEach(item => {
    const li = document.createElement('li');
    li.className = 'nav-item';

    if (!item.cols) {
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = item.href || '#';
      a.textContent = item.title;
      li.appendChild(a);
    } else {
      const btn = document.createElement('button');
      btn.className = 'nav-link';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = `${item.title} <svg class="ico"><use href="#i-chev"/></svg>`;
      li.appendChild(btn);

      const mega = document.createElement('div');
      mega.className = 'mega';
      item.cols.forEach(col => {
        const colDiv = document.createElement('div');
        colDiv.className = `mega__col ${col.wide ? 'mega__col--wide' : ''}`;
        colDiv.innerHTML = `<div class="mega__title">${col.heading}</div>`;
        const ul = document.createElement('ul');
        col.items.forEach(sub => {
          const mLi = document.createElement('li');
          mLi.innerHTML = `
            <a href="#">
              <span class="mega__ico"><svg class="ico"><use href="${sub.icon}"/></svg></span>
              <span class="mega__txt">
                <b>${sub.label}</b>
                ${sub.desc ? `<small>${sub.desc}</small>` : ''}
              </span>
            </a>
          `;
          ul.appendChild(mLi);
        });
        colDiv.appendChild(ul);
        mega.appendChild(colDiv);
      });
      li.appendChild(mega);

      // Mobile click toggle
      btn.addEventListener('click', (e) => {
        if (window.innerWidth <= 1023) {
          e.preventDefault();
          const isOpen = li.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    }

    navMenu.appendChild(li);
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Sticky header shadow
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // Search input expander
  const search = document.getElementById('search');
  const searchToggle = document.getElementById('searchToggle');
  if (search && searchToggle) {
    searchToggle.addEventListener('click', () => {
      search.classList.toggle('is-open');
      if (search.classList.contains('is-open')) {
        search.querySelector('input')?.focus();
      }
    });
  }
}

// --------------------------------------------------------------------------
// Hero Interactive: Mouse Glow, Stars, Animated Bar Chart
// --------------------------------------------------------------------------
function initHeroInteractive() {
  const heroDark = document.getElementById('heroDark');
  if (heroDark) {
    heroDark.addEventListener('mousemove', (e) => {
      const rect = heroDark.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroDark.style.setProperty('--mx', `${x}px`);
      heroDark.style.setProperty('--my', `${y}px`);
      heroDark.style.setProperty('--glow', '1');
    });
    heroDark.addEventListener('mouseleave', () => {
      heroDark.style.setProperty('--glow', '0');
    });
  }

  // Render SVG star ratings for elements with data-stars
  document.querySelectorAll('[data-stars]').forEach(el => {
    const val = parseFloat(el.getAttribute('data-stars') || '5');
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(val)) {
        html += `<svg class="ico"><use href="#i-star"/></svg>`;
      } else if (i - val < 1) {
        html += `<svg class="ico half"><use href="#i-star"/></svg>`;
      } else {
        html += `<svg class="ico half"><use href="#i-star"/></svg>`;
      }
    }
    el.innerHTML = html;
  });

  // Hero Bars
  const heroBars = document.getElementById('heroBars');
  if (heroBars) {
    const months = [
      { m: 'Jan', a: 65, b: 60 },
      { m: 'Feb', a: 72, b: 68 },
      { m: 'Mar', a: 80, b: 74 },
      { m: 'Apr', a: 78, b: 80 },
      { m: 'May', a: 88, b: 82 },
      { m: 'Jun', a: 95, b: 88 },
      { m: 'Jul', a: 92, b: 90 },
      { m: 'Aug', a: 104, b: 94 },
      { m: 'Sep', a: 115, b: 100 }
    ];
    months.forEach((d, idx) => {
      const g = document.createElement('div');
      g.className = 'bar-g';
      g.innerHTML = `
        <div class="bar-pair">
          <i style="height: ${(d.a / 120) * 100}%; animation-delay: ${idx * 60}ms"></i>
          <i class="b" style="height: ${(d.b / 120) * 100}%; animation-delay: ${idx * 60 + 30}ms"></i>
        </div>
        <span>${d.m}</span>
      `;
      heroBars.appendChild(g);
    });
  }
}

// --------------------------------------------------------------------------
// Logo Marquee
// --------------------------------------------------------------------------
function initLogosMarquee() {
  const track = document.getElementById('logoTrack');
  if (!track) return;

  const names = [
    'SoftBank', 'BitcoinDepot', 'PureRed', 'BusinessWire', 'MHRA', 'Ceragon',
    'MyHeritage', 'IllusionMuseum', 'LaFosse', 'UnitedElectric', 'NavajoPower'
  ];

  const buildSet = () => {
    const div = document.createElement('div');
    div.className = 'marquee__set';
    names.forEach(name => {
      const span = document.createElement('span');
      span.className = 'wordmark';
      span.innerHTML = `<span class="wm-ring"></span> <b>${name}</b>`;
      div.appendChild(span);
    });
    return div;
  };

  // Add twice for continuous seamless loop
  track.appendChild(buildSet());
  track.appendChild(buildSet());
}

// --------------------------------------------------------------------------
// Excel Interactive Mock
// --------------------------------------------------------------------------
function initExcelSheet() {
  const sheet = document.getElementById('xlSheet');
  if (!sheet) return;

  const cols = ['', 'A', 'B', 'C', 'D', 'E'];
  cols.forEach(c => {
    const div = document.createElement('div');
    div.className = 'h';
    div.textContent = c;
    sheet.appendChild(div);
  });

  const rows = [
    { num: 1, cells: ['Revenue (Gross)', '$14.2M', '$15.8M', '$16.9M', '$46.9M'], bold: true, live: true },
    { num: 2, cells: ['Enterprise Subs', '$9.8M', '$10.4M', '$11.8M', '$32.0M'] },
    { num: 3, cells: ['Mid-Market Subs', '$3.2M', '$3.9M', '$4.1M', '$11.2M'] },
    { num: 4, cells: ['Services & Support', '$1.2M', '$1.5M', '$1.0M', '$3.7M'] },
    { num: 5, cells: ['Cost of Goods (COGS)', '$5.2M', '$5.8M', '$6.3M', '$17.3M'], bold: true },
    { num: 6, cells: ['Gross Profit', '$9.0M', '$10.0M', '$10.6M', '$29.6M'], bold: true },
    { num: 7, cells: ['Operating Expenses', '$5.8M', '$6.1M', '$6.2M', '$18.1M'] },
    { num: 8, cells: ['EBITDA', '$3.2M', '$3.9M', '$4.4M', '$11.5M'], bold: true, selected: true }
  ];

  rows.forEach(r => {
    const rowNum = document.createElement('div');
    rowNum.className = 'h';
    rowNum.textContent = r.num;
    sheet.appendChild(rowNum);

    r.cells.forEach((cell, idx) => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell;
      if (idx > 0) cellDiv.classList.add('n');
      if (r.bold) cellDiv.classList.add('b');
      if (r.live && idx === 3) cellDiv.classList.add('live');
      if (r.selected && idx === 3) cellDiv.classList.add('sel');
      sheet.appendChild(cellDiv);
    });
  });

  // Refresh animation button in addin
  const refreshBtn = document.querySelector('.xl__refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spin');
      const live = sheet.querySelector('.live');
      if (live) {
        live.style.background = '#ffe3ec';
        setTimeout(() => { live.style.background = ''; }, 600);
      }
      setTimeout(() => { refreshBtn.classList.remove('spin'); }, 800);
    });
  }
}

// --------------------------------------------------------------------------
// Solutions Tabs (FP&A, Month-End Close, Cash, Spend, Desk)
// --------------------------------------------------------------------------
function initSolutionTabs() {
  const tabs = document.querySelectorAll('.sx__tab');
  const panels = document.querySelectorAll('.sx__panel');
  const sxPanelsContainer = document.getElementById('sxPanels');

  // Populate pills
  panels.forEach(p => {
    const pillWrap = p.querySelector('.sx__pills');
    if (pillWrap && pillWrap.hasAttribute('data-pills')) {
      const items = pillWrap.getAttribute('data-pills').split('|');
      pillWrap.innerHTML = items.map(t => `<span class="sx__pill">${t}</span>`).join('');
    }

    // Panel cursor tracker
    p.addEventListener('mousemove', (e) => {
      const rect = p.getBoundingClientRect();
      p.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      p.style.setProperty('--my', `${e.clientY - rect.top}px`);
      p.style.setProperty('--cursor', '1');
    });
    p.addEventListener('mouseleave', () => {
      p.style.setProperty('--cursor', '0');
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-panel');
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      panels.forEach(panel => {
        if (panel.getAttribute('data-panel') === target) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// Testimonials Carousel
// --------------------------------------------------------------------------
function initTestimonialsCarousel() {
  const track = document.getElementById('ftTrack');
  const prev = document.getElementById('ftPrev');
  const next = document.getElementById('ftNext');
  if (!track || !prev || !next) return;

  const data = [
    {
      quote: 'It’s not just efficiency, it’s higher-quality, world-class output. Now it means people can do much richer work.',
      name: 'Urvesh Patel',
      title: 'CFO',
      company: 'La Fosse',
      meta: 'Services · 201–500 employees',
      color: '#f93576'
    },
    {
      quote: 'Datarails gave us visibility we’d never had before. One insight alone saved us about $2 million a year.',
      name: 'Zach Morgan',
      title: 'CFO',
      company: 'United Electric',
      meta: 'Energy · 51–200 employees',
      color: '#ffa310'
    },
    {
      quote: 'Datarails saved us at least a week every month during our reconciliation and consolidated reporting cycle.',
      name: 'Andrew Polito',
      title: 'VP Controller',
      company: 'PureRed',
      meta: 'Logistics & transportation · 51–200 employees',
      color: '#578aff'
    },
    {
      quote: 'Datarails is efficient, but more importantly, it makes our lives easier. It gives us control over our data.',
      name: 'Javier Aguayo',
      title: 'Director of Finance',
      company: 'Museum of Illusions',
      meta: 'Entertainment · 51–200 employees',
      color: '#00b386'
    },
    {
      quote: 'One report used to take us three hours. Now it takes five minutes, and manual input errors are basically gone.',
      name: 'Darcie Nguyen',
      title: 'Director of Accounting',
      company: 'Telecom Co.',
      meta: 'Telecommunications · 51–200 employees',
      color: '#6969ff'
    },
    {
      quote: 'Having everything automatically uploaded and updated means we don’t have to babysit the data to know it’s right.',
      name: 'Cassie Conner',
      title: 'Manager of Financial Systems',
      company: 'Navajo Power',
      meta: 'Energy · 1,000–5,000 employees',
      color: '#f93576'
    },
    {
      quote: 'We shortened our monthly consolidation process from seven days to one, maybe two days.',
      name: 'Igor Baglyk',
      title: 'Group CFO',
      company: 'ATN Mfg',
      meta: 'Manufacturing · 201–500 employees',
      color: '#ffa310'
    },
    {
      quote: 'We’re able to do the full analysis in real time. If we want to look at trends or drill into an account, we do it instantly.',
      name: 'Mike Devendorf',
      title: 'CFO',
      company: 'TCC Services',
      meta: 'Services · 501–1,000 employees',
      color: '#00c0c4'
    },
    {
      quote: 'I feel super calm heading into tight deadlines. Everything updates quickly, and I know it’s accurate.',
      name: 'Corine Fischer',
      title: 'Controller',
      company: 'Rivas Capital',
      meta: 'Financial services · 2–10 employees',
      color: '#578aff'
    }
  ];

  data.forEach(item => {
    const card = document.createElement('a');
    card.className = 'ftest__card';
    card.href = '#';
    card.innerHTML = `
      <svg class="ftest__mark"><use href="#i-quote"/></svg>
      <p class="ftest__quote">“${item.quote}”</p>
      <div class="ftest__foot">
        <div class="ftest__foot-row">
          <div class="ftest__person">
            <span class="ftest__avatar" style="background:${item.color}">${item.name.split(' ').map(n=>n[0]).join('')}</span>
            <div class="ftest__who">
              <span class="ftest__name">${item.name}</span>
              <span class="ftest__title">${item.title}</span>
            </div>
          </div>
          <span class="ftest__logo">${item.company}</span>
        </div>
        <span class="ftest__meta">${item.meta}</span>
      </div>
      <span class="ftest__read">
        <span class="ftest__read-label">Read story →</span>
      </span>
    `;
    track.appendChild(card);
  });

  const updateArrows = () => {
    prev.disabled = track.scrollLeft <= 5;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateArrows, { passive: true });
  setTimeout(updateArrows, 100);
}

// --------------------------------------------------------------------------
// Integrations Marquee
// --------------------------------------------------------------------------
function initIntegrationsMarquee() {
  const track = document.getElementById('intTrack');
  if (!track) return;

  const integrations = [
    { name: 'NetSuite', bg: '#10529d' },
    { name: 'Salesforce', bg: '#00a1e0' },
    { name: 'QuickBooks', bg: '#2ca01c' },
    { name: 'Sage Intacct', bg: '#00dc00' },
    { name: 'Microsoft Dynamics', bg: '#0078d4' },
    { name: 'Snowflake', bg: '#29b5e8' },
    { name: 'Xero', bg: '#13b5ea' },
    { name: 'SAP S/4HANA', bg: '#003366' },
    { name: 'HubSpot', bg: '#ff7a59' },
    { name: 'Workday', bg: '#f58220' },
    { name: 'ADP', bg: '#d0271d' },
    { name: 'Power BI', bg: '#f2c811' },
    { name: 'Paychex', bg: '#002f6c' },
    { name: 'Yardi', bg: '#0c2340' }
  ];

  const buildSet = () => {
    const div = document.createElement('div');
    div.className = 'aid__set';
    integrations.forEach(it => {
      const span = document.createElement('span');
      span.className = 'int-logo';
      span.innerHTML = `<i style="background:${it.bg}">${it.name[0]}</i> <span>${it.name}</span>`;
      div.appendChild(span);
    });
    return div;
  };

  track.appendChild(buildSet());
  track.appendChild(buildSet());
}

// --------------------------------------------------------------------------
// Claude vs Claude + LedgerOS Video/Interactive Modal
// --------------------------------------------------------------------------
function initClaudeVsModal() {
  const modal = document.getElementById('cvsModal');
  const openBtn = document.getElementById('cvsOpen');
  const closeBtn = document.getElementById('cvsClose');
  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.showModal();
    startTypingDemo(modal);
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  function startTypingDemo(parent) {
    const targets = parent.querySelectorAll('[data-type]');
    targets.forEach(t => {
      const text = t.getAttribute('data-type');
      t.textContent = '';
      t.classList.add('typing');
      let i = 0;
      const step = () => {
        if (i < text.length) {
          t.textContent += text.charAt(i);
          i++;
          setTimeout(step, 14);
        } else {
          t.classList.remove('typing');
        }
      };
      step();
    });
  }
}

// --------------------------------------------------------------------------
// Why Ledgerline (FW: 5 C's)
// --------------------------------------------------------------------------
function initWhyTabs() {
  const fwData = [
    {
      num: '01',
      cap: 'C',
      rest: 'onsolidation',
      desc: 'Finance works with data scattered across disconnected systems like ERP, CRM, and HRIS. Add multiple entities, currencies, intercompany eliminations, and different charts of accounts, and AI ends up with fragmented, unmapped data. FinanceOS consolidates and maps everything first, so AI works with finance-adjusted numbers, not raw output.',
      icon: '#i-layers'
    },
    {
      num: '02',
      cap: 'C',
      rest: 'ontext',
      desc: 'Numbers mean nothing without business logic. FinanceOS preserves your organization’s hierarchy, roll-ups, seasonal pacing, and custom reporting formulas so that any AI query inherently respects the context of how your company measures performance.',
      icon: '#i-compass'
    },
    {
      num: '03',
      cap: 'C',
      rest: 'onsistency',
      desc: 'Eliminate version drift. When every member of the finance organization queries metrics from the same single source of truth, there are no contradictory slides in the board meeting and no conflicting margin numbers between sales and ops.',
      icon: '#i-repeat'
    },
    {
      num: '04',
      cap: 'C',
      rest: 'ontrol',
      desc: 'Enterprise-grade security meets auditability. Role-based permissions ensure non-finance teams only see what they are entitled to view, while comprehensive change-logs trace every generated figure back to the exact source journal entries.',
      icon: '#i-shield'
    },
    {
      num: '05',
      cap: 'C',
      rest: 'ost',
      desc: 'Avoid ripping and replacing Excel or paying for multimillion-dollar legacy enterprise software implementations. FinanceOS deploys in weeks, lets your team remain in Excel, and scales predictably without custom engineering overhead.',
      icon: '#i-coin'
    }
  ];

  const rail = document.getElementById('fwRail');
  const card = document.getElementById('fwCard');
  const numEl = document.getElementById('fwNum');
  const nameEl = document.getElementById('fwName');
  const descEl = document.getElementById('fwDesc');
  const artEl = document.getElementById('fwArt');
  if (!rail || !card) return;

  const renderActive = (idx) => {
    const item = fwData[idx];
    card.classList.add('is-switching');
    setTimeout(() => {
      numEl.textContent = item.num;
      nameEl.innerHTML = `<span class="cap">${item.cap}</span>${item.rest}`;
      descEl.textContent = item.desc;
      artEl.innerHTML = `
        <div class="core"><svg class="ico"><use href="${item.icon}"/></svg></div>
        <div class="orb"><svg class="ico"><use href="#i-table"/></svg></div>
        <div class="orb"><svg class="ico"><use href="#i-spark"/></svg></div>
        <div class="orb"><svg class="ico"><use href="#i-shield"/></svg></div>
      `;
      card.classList.remove('is-switching');
    }, 180);
  };

  fwData.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = `fw__tab ${idx === 0 ? 'is-active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.textContent = `${item.cap}${item.rest}`;
    btn.addEventListener('click', () => {
      rail.querySelectorAll('.fw__tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderActive(idx);
    });
    rail.appendChild(btn);
  });

  renderActive(0);
}

// --------------------------------------------------------------------------
// Industry Tabs
// --------------------------------------------------------------------------
function initIndustryTabs() {
  const industries = [
    {
      title: 'Manufacturing',
      icon: '#i-factory',
      logo: '100% LIFE SAFETY',
      quote: '“Without Datarails, I would’ve needed to double my current team of three just to produce what we’re delivering today.”',
      author: 'Steven Carkey',
      role: 'VP Finance Operations'
    },
    {
      title: 'Healthcare',
      icon: '#i-heart',
      logo: 'CLINICAL CARE CO.',
      quote: '“Reconciling clinic-level patient metrics and insurance adjustments used to take weeks. Now monthly statements are published in two days.”',
      author: 'Sarah Jenkins',
      role: 'CFO'
    },
    {
      title: 'Hospitality/Entertainment',
      icon: '#i-ticket',
      logo: 'MUSEUM OF ILLUSIONS',
      quote: '“Real-time visibility into per-visitor spend and seasonal revenue patterns changed how we budget our international expansion.”',
      author: 'Javier Aguayo',
      role: 'Director of Finance'
    },
    {
      title: 'Logistics & Transportation',
      icon: '#i-truck',
      logo: 'FREIGHTWAY GLOBAL',
      quote: '“Having route profitability and fuel variance modeled live across 4,000 trucks saved us more than $3.5M in unbilled surcharges.”',
      author: 'Marc Beller',
      role: 'VP of FP&A'
    },
    {
      title: 'Property Management',
      icon: '#i-home',
      logo: 'TERRA REALTY PARTNERS',
      quote: '“We manage 120 legal entities across three funds. Eliminating manual intercompany journals cut our quarterly audit time in half.”',
      author: 'Elena Gomez',
      role: 'Group Controller'
    },
    {
      title: 'Retail',
      icon: '#i-store',
      logo: 'ACTIVE GEAR CO.',
      quote: '“Consolidating POS actuals with warehouse inventory models gave our buyers daily visibility into gross margins by SKU.”',
      author: 'David Chen',
      role: 'Head of Strategic Finance'
    }
  ];

  const tabsWrap = document.getElementById('indTabs');
  const card = document.getElementById('indCard');
  const logoEl = document.getElementById('indLogo');
  const quoteEl = document.getElementById('indQuote');
  const nameEl = document.getElementById('indName');
  const wmEl = document.getElementById('indWm');
  if (!tabsWrap || !card) return;

  const setIndustry = (idx) => {
    const item = industries[idx];
    card.classList.add('is-switching');
    setTimeout(() => {
      logoEl.textContent = item.logo;
      quoteEl.textContent = item.quote;
      nameEl.innerHTML = `<strong>${item.author}</strong> · ${item.role}`;
      wmEl.setAttribute('href', item.icon);
      card.classList.remove('is-switching');
    }, 180);
  };

  industries.forEach((ind, idx) => {
    const btn = document.createElement('button');
    btn.className = `ind__tab ${idx === 0 ? 'is-active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.innerHTML = `
      <span class="ind__icon"><svg class="ico"><use href="${ind.icon}"/></svg></span>
      <span>${ind.title}</span>
    `;
    btn.addEventListener('click', () => {
      tabsWrap.querySelectorAll('.ind__tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      setIndustry(idx);
    });
    tabsWrap.appendChild(btn);
  });

  setIndustry(0);
}

// --------------------------------------------------------------------------
// Request Demo Modal & Form
// --------------------------------------------------------------------------
function initDemoModal() {
  const modal = document.getElementById('demoModal');
  const closeBtn = document.getElementById('demoClose');
  const form = document.getElementById('demoForm');
  const success = document.getElementById('demoSuccess');
  if (!modal) return;

  document.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
      if (form) form.hidden = false;
      if (success) success.hidden = true;
    });
  });

  closeBtn?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.hidden = true;
    if (success) success.hidden = false;
  });
}

// --------------------------------------------------------------------------
// Scroll to Top Button
// --------------------------------------------------------------------------
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --------------------------------------------------------------------------
// Intersection Observer Scroll Reveals
// --------------------------------------------------------------------------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

// --------------------------------------------------------------------------
// Dynamic Year
// --------------------------------------------------------------------------
function setCopyrightYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
