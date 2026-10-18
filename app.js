// ==========================================================================
// Ledgerline Custom Data Studio — Browser-Persisted Storage & Live Recalc
// ==========================================================================

const DEFAULT_FINANCIALS = {
  companyName: 'Acme Corporation',
  industry: 'Software & SaaS',
  currency: 'USD',
  revenue: 12500000,
  cogs: 4375000,
  opex: 4800000,
  cash: 5200000,
  segments: [
    { name: 'Core Product / Subscriptions', value: 7500000 },
    { name: 'Enterprise Add-ons', value: 3500000 },
    { name: 'Professional Services', value: 1500000 }
  ],
  banks: [
    { name: 'JPMorgan Chase Operating', balance: 3800000 },
    { name: 'Barclays Treasury', balance: 1400000 }
  ]
};

// State stored in browser LocalStorage
let currentData = loadFinancialData();

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  syncAllViews();
  initCustomForm();
  initExcelGrid();
  initFileUpload();
  initCopilotChat();
  initScenarioModeler();
  initCloseChecklist();
  initSpendApprovals();
  initDeskTickets();
  initReportsExport();
});

// Load / Save Data
function loadFinancialData() {
  const saved = localStorage.getItem('ll_user_financials');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  return JSON.parse(JSON.stringify(DEFAULT_FINANCIALS));
}

function saveFinancialData(data) {
  currentData = data;
  localStorage.setItem('ll_user_financials', JSON.stringify(data));
  syncAllViews();
  showToast('✓ Custom Company Info Saved & Applied Everywhere!');
}

function formatMoney(num, curr = '$') {
  if (isNaN(num)) return '$0';
  return `${curr}${Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// Update all components when data changes
function syncAllViews() {
  // Topbar and titles
  const userDisp = document.getElementById('userDisplayName');
  const userAv = document.getElementById('userAvatar');
  const headName = document.getElementById('headerCompanyName');
  const headSub = document.getElementById('headerCompanySub');

  if (userDisp) userDisp.textContent = currentData.companyName;
  if (userAv) userAv.textContent = currentData.companyName.substring(0, 2).toUpperCase();
  if (headName) headName.textContent = `${currentData.companyName} — Financial Dashboard`;
  if (headSub) headSub.textContent = `Industry: ${currentData.industry} · Base Currency: ${currentData.currency}`;

  // Calculated values
  const rev = Number(currentData.revenue) || 0;
  const cogs = Number(currentData.cogs) || 0;
  const opex = Number(currentData.opex) || 0;
  const cash = Number(currentData.cash) || 0;

  const grossProfit = rev - cogs;
  const marginPct = rev > 0 ? ((grossProfit / rev) * 100).toFixed(1) : '0.0';
  const ebitda = grossProfit - opex;
  const monthlyBurn = opex > 0 ? (opex / 12) : 1;
  const runwayMonths = (cash / monthlyBurn).toFixed(1);

  // KPIs
  const dispRev = document.getElementById('dispRevenue');
  const dispMargin = document.getElementById('dispMargin');
  const dispCash = document.getElementById('dispCash');
  const dispOpex = document.getElementById('dispOpex');
  const dispRunway = document.getElementById('dispRunway');

  if (dispRev) dispRev.textContent = formatMoney(rev);
  if (dispMargin) dispMargin.textContent = `${marginPct}%`;
  if (dispCash) dispCash.textContent = formatMoney(cash);
  if (dispOpex) dispOpex.textContent = formatMoney(opex);
  if (dispRunway) dispRunway.textContent = `▲ ${runwayMonths} Months Runway`;

  // Dynamic Bar Chart
  const barChart = document.getElementById('customBarChart');
  if (barChart && currentData.segments) {
    barChart.innerHTML = '';
    const maxVal = Math.max(...currentData.segments.map(s => Number(s.value) || 1));
    currentData.segments.forEach(seg => {
      const pct = Math.min(100, Math.max(10, Math.round(((Number(seg.value) || 0) / maxVal) * 100)));
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <span>${seg.name}</span>
        <div class="track"><div class="fill" style="width: ${pct}%;"></div></div>
        <b>${formatMoney(seg.value)}</b>
      `;
      barChart.appendChild(row);
    });
  }

  // Update 13-Week Cash Table
  const tbodyCash = document.getElementById('tbodyCash');
  if (tbodyCash && currentData.banks) {
    tbodyCash.innerHTML = '';
    let totalCash = 0;
    currentData.banks.forEach(b => {
      const bal = Number(b.balance) || 0;
      totalCash += bal;
      const w4 = bal * 1.05;
      const w13 = bal * 1.15;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${b.name}</td>
        <td><strong>${formatMoney(bal)}</strong></td>
        <td>${formatMoney(w4)}</td>
        <td>${formatMoney(w13)}</td>
      `;
      tbodyCash.appendChild(tr);
    });

    const summaryRow = document.createElement('tr');
    summaryRow.className = 'highlight-row';
    summaryRow.innerHTML = `
      <td><strong>Total Consolidated Cash</strong></td>
      <td><strong>${formatMoney(totalCash)}</strong></td>
      <td><strong>${formatMoney(totalCash * 1.05)}</strong></td>
      <td><strong>${formatMoney(totalCash * 1.15)}</strong></td>
    `;
    tbodyCash.appendChild(summaryRow);
  }

  // Populate Form Fields
  populateFormFields();
}

function populateFormFields() {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('inpCompName', currentData.companyName);
  setVal('inpIndustry', currentData.industry);
  setVal('inpCurrency', currentData.currency);
  setVal('inpRevenue', currentData.revenue);
  setVal('inpCogs', currentData.cogs);
  setVal('inpOpex', currentData.opex);
  setVal('inpCash', currentData.cash);

  if (currentData.segments && currentData.segments[0]) {
    setVal('inpSeg1Name', currentData.segments[0].name);
    setVal('inpSeg1Val', currentData.segments[0].value);
  }
  if (currentData.segments && currentData.segments[1]) {
    setVal('inpSeg2Name', currentData.segments[1].name);
    setVal('inpSeg2Val', currentData.segments[1].value);
  }
  if (currentData.segments && currentData.segments[2]) {
    setVal('inpSeg3Name', currentData.segments[2].name);
    setVal('inpSeg3Val', currentData.segments[2].value);
  }

  if (currentData.banks && currentData.banks[0]) {
    setVal('inpBank1Name', currentData.banks[0].name);
    setVal('inpBank1Val', currentData.banks[0].balance);
  }
  if (currentData.banks && currentData.banks[1]) {
    setVal('inpBank2Name', currentData.banks[1].name);
    setVal('inpBank2Val', currentData.banks[1].balance);
  }

  updateLiveFormPreviews();
}

function updateLiveFormPreviews() {
  const rev = Number(document.getElementById('inpRevenue')?.value) || 0;
  const cogs = Number(document.getElementById('inpCogs')?.value) || 0;
  const opex = Number(document.getElementById('inpOpex')?.value) || 0;
  const cash = Number(document.getElementById('inpCash')?.value) || 0;

  const gross = rev - cogs;
  const margin = rev > 0 ? ((gross / rev) * 100).toFixed(1) : '0.0';
  const ebitda = gross - opex;
  const runway = opex > 0 ? (cash / (opex / 12)).toFixed(1) : '12';

  const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setTxt('previewGrossProfit', formatMoney(gross));
  setTxt('previewMargin', `${margin}%`);
  setTxt('previewEbitda', formatMoney(ebitda));
  setTxt('previewRunway', `${runway} Months`);
}

function initCustomForm() {
  const form = document.getElementById('formCustomInfo');
  if (form) {
    form.addEventListener('input', updateLiveFormPreviews);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        companyName: document.getElementById('inpCompName').value.trim() || 'My Company',
        industry: document.getElementById('inpIndustry').value,
        currency: document.getElementById('inpCurrency').value,
        revenue: Number(document.getElementById('inpRevenue').value) || 0,
        cogs: Number(document.getElementById('inpCogs').value) || 0,
        opex: Number(document.getElementById('inpOpex').value) || 0,
        cash: Number(document.getElementById('inpCash').value) || 0,
        segments: [
          { name: document.getElementById('inpSeg1Name').value || 'Segment 1', value: Number(document.getElementById('inpSeg1Val').value) || 0 },
          { name: document.getElementById('inpSeg2Name').value || 'Segment 2', value: Number(document.getElementById('inpSeg2Val').value) || 0 },
          { name: document.getElementById('inpSeg3Name').value || 'Segment 3', value: Number(document.getElementById('inpSeg3Val').value) || 0 }
        ],
        banks: [
          { name: document.getElementById('inpBank1Name').value || 'Primary Bank', balance: Number(document.getElementById('inpBank1Val').value) || 0 },
          { name: document.getElementById('inpBank2Name').value || 'Treasury Bank', balance: Number(document.getElementById('inpBank2Val').value) || 0 }
        ]
      };
      saveFinancialData(updated);
      switchTab('overview');
    });
  }

  document.getElementById('btnSaveCompanyInfoTop')?.addEventListener('click', () => {
    form?.requestSubmit();
  });

  document.getElementById('btnQuickEnterData')?.addEventListener('click', () => switchTab('mydata'));
  document.getElementById('btnHeaderEditData')?.addEventListener('click', () => switchTab('mydata'));
  document.getElementById('btnCancelEdit')?.addEventListener('click', () => switchTab('overview'));

  document.getElementById('btnResetDefaults')?.addEventListener('click', () => {
    if (confirm('Reset custom numbers back to demo defaults?')) {
      saveFinancialData(JSON.parse(JSON.stringify(DEFAULT_FINANCIALS)));
    }
  });
}

function initTabs() {
  const navItems = document.querySelectorAll('.nav-links li');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-tab'));
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-links li').forEach(i => {
    i.classList.toggle('is-active', i.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('is-active', p.id === `panel-${tabId}`);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// Excel Direct Spreadsheet Grid Editing
// --------------------------------------------------------------------------
function initExcelGrid() {
  const grid = document.getElementById('excelGrid');
  if (!grid) return;

  const recalcRows = () => {
    const rows = grid.querySelectorAll('.grid-row:not(.grid-row--header)');
    rows.forEach(r => {
      const inputs = r.querySelectorAll('.xl-calc');
      let sum = 0;
      inputs.forEach(inp => sum += Number(inp.value) || 0);
      const tot = r.querySelector('.xl-total');
      if (tot) tot.textContent = formatMoney(sum);
    });
  };

  grid.addEventListener('input', (e) => {
    if (e.target.classList.contains('xl-calc')) recalcRows();
  });

  document.getElementById('btnAddGridRow')?.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.className = 'grid-row';
    newRow.innerHTML = `
      <div><input type="text" class="xl-cell-desc" value="New Custom Account" /></div>
      <div><input type="number" class="xl-cell xl-calc" value="100000" /></div>
      <div><input type="number" class="xl-cell xl-calc" value="120000" /></div>
      <div><input type="number" class="xl-cell xl-calc" value="130000" /></div>
      <div><input type="number" class="xl-cell xl-calc" value="140000" /></div>
      <div class="xl-total b">$490,000</div>
    `;
    grid.appendChild(newRow);
    recalcRows();
    showToast('Custom spreadsheet row added');
  });

  document.getElementById('btnSimulateExcelSave')?.addEventListener('click', () => {
    // If first row is gross revenue, update model
    const firstRowInputs = grid.querySelectorAll('.grid-row:not(.grid-row--header):first-of-type .xl-calc');
    let totalRev = 0;
    firstRowInputs.forEach(i => totalRev += Number(i.value) || 0);
    if (totalRev > 0) {
      currentData.revenue = totalRev;
      saveFinancialData(currentData);
    }
    showToast('Spreadsheet grid saved and synced to model');
  });
}

// --------------------------------------------------------------------------
// CSV / File Upload Parsing
// --------------------------------------------------------------------------
function initFileUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('uploadPreview');
  const tableContainer = document.getElementById('parsedTableContainer');
  const btnImport = document.getElementById('btnImportParsed');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) parseFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) parseFile(fileInput.files[0]);
  });

  function parseFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length === 0) return;

      let html = '<table class="data-table"><thead><tr>';
      const headers = lines[0].split(',');
      headers.forEach(h => html += `<th>${h.replace(/["']/g, '')}</th>`);
      html += '</tr></thead><tbody>';

      let parsedRevenue = 0;
      let parsedCash = 0;

      lines.slice(1, 10).forEach(line => {
        const cols = line.split(',');
        html += '<tr>';
        cols.forEach(c => html += `<td>${c.replace(/["']/g, '')}</td>`);
        html += '</tr>';

        // simple heuristics
        const val = parseFloat(cols[1]);
        if (!isNaN(val)) {
          if (line.toLowerCase().includes('revenue') || line.toLowerCase().includes('sales')) parsedRevenue += val;
          if (line.toLowerCase().includes('cash') || line.toLowerCase().includes('bank')) parsedCash += val;
        }
      });
      html += '</tbody></table>';

      tableContainer.innerHTML = html;
      preview.hidden = false;
      showToast(`File "${file.name}" parsed (${lines.length} rows)`);

      btnImport.onclick = () => {
        if (parsedRevenue > 0) currentData.revenue = parsedRevenue;
        if (parsedCash > 0) currentData.cash = parsedCash;
        saveFinancialData(currentData);
        switchTab('overview');
      };
    };
    reader.readAsText(file);
  }
}

// --------------------------------------------------------------------------
// Copilot AI Interrogation Grounded in User Numbers
// --------------------------------------------------------------------------
function initCopilotChat() {
  const form = document.getElementById('copilotForm');
  const input = document.getElementById('copilotPrompt');
  const history = document.getElementById('copilotHistory');

  const answer = (prompt) => {
    if (!prompt) return;
    const uMsg = document.createElement('div');
    uMsg.className = 'chat-msg chat-msg--user';
    uMsg.textContent = prompt;
    history.appendChild(uMsg);
    input.value = '';

    setTimeout(() => {
      const ai = document.createElement('div');
      ai.className = 'chat-msg chat-msg--assistant';

      const pLower = prompt.toLowerCase();
      const rev = Number(currentData.revenue) || 0;
      const cash = Number(currentData.cash) || 0;
      const opex = Number(currentData.opex) || 0;
      const cogs = Number(currentData.cogs) || 0;
      const gross = rev - cogs;
      const margin = rev > 0 ? ((gross / rev) * 100).toFixed(1) : 0;
      const runway = opex > 0 ? (cash / (opex / 12)).toFixed(1) : 12;

      let reply = `<strong>FinanceOS Genius:</strong> Based on <strong>${currentData.companyName}</strong>'s current entered financials, annual revenue is <strong>${formatMoney(rev)}</strong> with a gross margin of <strong>${margin}%</strong> (${formatMoney(gross)} gross profit).`;
      if (pLower.includes('cash') || pLower.includes('runway') || pLower.includes('burn')) {
        reply = `<strong>FinanceOS Genius:</strong> You currently have <strong>${formatMoney(cash)}</strong> in liquid cash across your accounts. With an annual OpEx of ${formatMoney(opex)}, your estimated runway is <strong>${runway} months</strong>.`;
      } else if (pLower.includes('segment') || pLower.includes('product')) {
        reply = `<strong>FinanceOS Genius:</strong> Your top segment is <strong>${currentData.segments[0]?.name}</strong> accounting for <strong>${formatMoney(currentData.segments[0]?.value)}</strong>.`;
      }

      ai.innerHTML = reply;
      history.appendChild(ai);
      history.scrollTop = history.scrollHeight;
    }, 400);
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    answer(input.value.trim());
  });

  document.getElementById('btnSideAiQuery')?.addEventListener('click', () => {
    answer(`What is my current cash burn and runway for ${currentData.companyName}?`);
  });
}

// --------------------------------------------------------------------------
// Other Modules (Close, Spend, FP&A, Reports)
// --------------------------------------------------------------------------
function initScenarioModeler() {
  const sliderHeadcount = document.getElementById('sliderHeadcount');
  const sliderChurn = document.getElementById('sliderChurn');
  const sliderCac = document.getElementById('sliderCac');

  const recalculate = () => {
    const hc = parseFloat(sliderHeadcount.value);
    const churn = parseFloat(sliderChurn.value);
    const baseRev = Number(currentData.revenue) || 10000000;
    const projectedRev = (baseRev * (1 + (hc * 0.01) - (churn * 0.015))).toFixed(0);

    const resArr = document.getElementById('resArr');
    const resCash = document.getElementById('resCash');
    if (resArr) resArr.textContent = formatMoney(projectedRev);
    if (resCash) resCash.textContent = formatMoney(projectedRev * 0.45);
  };

  sliderHeadcount?.addEventListener('input', recalculate);
  sliderChurn?.addEventListener('input', recalculate);
  sliderCac?.addEventListener('input', recalculate);

  document.getElementById('btnRunScenario')?.addEventListener('click', () => {
    sliderHeadcount.value = 25;
    sliderChurn.value = 2.5;
    recalculate();
    showToast('Applied High-Growth Scenario to your data');
  });
}

function initCloseChecklist() {
  const tbody = document.getElementById('tbodyCloseTasks');
  document.getElementById('btnAddNewCloseTask')?.addEventListener('click', () => {
    const taskName = prompt('Enter your task description:', 'Review Sales Commissions');
    if (!taskName) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${taskName}</td>
      <td>Finance Lead</td>
      <td><span class="badge-status badge-status--pending">Pending Signoff</span></td>
      <td><button class="btn-tbl-action btn-approve-task">Sign Off</button></td>
    `;
    tbody.appendChild(tr);
    tr.querySelector('.btn-approve-task').addEventListener('click', (e) => {
      tr.querySelector('.badge-status').className = 'badge-status badge-status--done';
      tr.querySelector('.badge-status').textContent = 'Reconciled';
      e.target.disabled = true;
      e.target.textContent = 'Completed';
      showToast('Task approved');
    });
    showToast('Custom close activity added');
  });

  document.querySelectorAll('.btn-approve-task').forEach(b => {
    b.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      row.querySelector('.badge-status').className = 'badge-status badge-status--done';
      row.querySelector('.badge-status').textContent = 'Reconciled';
      e.target.disabled = true;
      e.target.textContent = 'Completed';
      showToast('Task approved');
    });
  });

  document.getElementById('btnMarkAllClose')?.addEventListener('click', () => {
    document.querySelectorAll('.btn-approve-task').forEach(b => b.click());
    const bar = document.getElementById('closeBarFill');
    const txt = document.getElementById('closeStatusText');
    if (bar) bar.style.width = '100%';
    if (txt) txt.innerHTML = '<strong>100% Completed</strong> — All Custom Tasks Certified';
    showToast('All Tasks Certified');
  });
}

function initSpendApprovals() {
  document.querySelectorAll('.btn-po-approve').forEach(b => {
    b.addEventListener('click', (e) => {
      e.target.textContent = 'Approved ✓';
      e.target.disabled = true;
      showToast('PO Approved');
    });
  });

  document.getElementById('btnCreatePO')?.addEventListener('click', () => {
    const desc = prompt('Enter PO Description & Vendor:', 'Google Ads Campaign Spend');
    const amt = prompt('Enter Amount ($):', '5000');
    if (!desc) return;
    const tbody = document.getElementById('tbodySpend');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${desc}</td>
      <td>Marketing</td>
      <td>${formatMoney(amt)}</td>
      <td><button class="action-btn action-btn--sm btn-po-approve">Approve</button></td>
    `;
    tbody.prepend(tr);
    tr.querySelector('.btn-po-approve').addEventListener('click', (e) => {
      e.target.textContent = 'Approved ✓';
      e.target.disabled = true;
    });
    showToast('New Purchase Order Created');
  });
}

function initDeskTickets() {
  const detail = document.getElementById('ticketDetailArea');
  const renderTicket = (title, q, a) => {
    if (!detail) return;
    detail.innerHTML = `
      <h3>${title}</h3>
      <p><strong>Query:</strong> "${q}"</p>
      <div class="ai-draft-box">
        <span class="ai-draft-badge"><svg class="ico"><use href="#i-spark"/></svg> AI-Drafted Response (Grounded in ${currentData.companyName} Data)</span>
        <p>${a}</p>
        <button class="btn btn--primary btn--sm" onclick="showToast('Dispatched to stakeholder!')">Send Response</button>
      </div>
    `;
  };

  renderTicket(
    '#T-101: Current Available Cash & Runway',
    'What is our current cash balance and runway?',
    `Our current cash on hand is <strong>${formatMoney(currentData.cash)}</strong>, with an annual OpEx of <strong>${formatMoney(currentData.opex)}</strong>. This provides approximately <strong>${(currentData.cash / (currentData.opex / 12)).toFixed(1)} months of runway</strong>.`
  );
}

function initReportsExport() {
  document.querySelectorAll('.btn-dl-custom').forEach(b => {
    b.addEventListener('click', (e) => {
      const type = e.target.getAttribute('data-type');
      let csvContent = `data:text/csv;charset=utf-8,Company,${currentData.companyName}\nRevenue,${currentData.revenue}\nCOGS,${currentData.cogs}\nOpEx,${currentData.opex}\nCash,${currentData.cash}\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${currentData.companyName.toLowerCase().replace(/\s+/g, '_')}_${type}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV Report Downloaded');
    });
  });

  document.getElementById('btnExportFullDataJson')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${currentData.companyName}_financial_model.json`);
    dlAnchorElem.click();
    showToast('JSON Model Exported');
  });
}

function showToast(msg) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-show');
  setTimeout(() => toast.classList.remove('is-show'), 2800);
}
