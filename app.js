// ==========================================================================
// Ledgerline Enterprise App Interactive Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check auth simulation
  checkAuth();

  // Navigation tab switching
  initTabs();

  // Feature interactions
  initCopilotChat();
  initScenarioModeler();
  initCloseChecklist();
  initSpendApprovals();
  initDeskTickets();
  initExcelLiveModeler();
  initSimulateSync();
});

function checkAuth() {
  const user = localStorage.getItem('ll_auth_user') || 'admin@ledgerline.internal';
  const nameEl = document.getElementById('userDisplayName');
  if (nameEl) nameEl.textContent = user;

  const btnLogout = document.getElementById('btnLogout');
  btnLogout?.addEventListener('click', () => {
    localStorage.removeItem('ll_auth_user');
    window.location.href = 'index.html';
  });
}

function showToast(msg) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-show');
  setTimeout(() => {
    toast.classList.remove('is-show');
  }, 2800);
}

function initTabs() {
  const navItems = document.querySelectorAll('.nav-links li');
  const panels = document.querySelectorAll('.tab-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      navItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');

      panels.forEach(panel => {
        if (panel.id === `panel-${tabId}`) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });
    });
  });
}

function initCopilotChat() {
  const form = document.getElementById('copilotForm');
  const input = document.getElementById('copilotPrompt');
  const history = document.getElementById('copilotHistory');
  const sideAiBtn = document.getElementById('btnSideAiQuery');

  const executeAiQuery = (promptText) => {
    if (!promptText) return;

    // Append User Msg
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg chat-msg--user';
    userMsg.textContent = promptText;
    history.appendChild(userMsg);

    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg chat-msg--assistant';

      let reply = `<strong>Ledgerline AI:</strong> Analysis complete for <em>"${promptText}"</em>. Across 14 legal entities, gross variance is within +1.8% of target. Journal entries #GL-4011 and #GL-4098 were audited with 100% reconciliation match.`;
      if (promptText.toLowerCase().includes('cash')) {
        reply = `<strong>Ledgerline AI:</strong> Net available liquidity stands at <strong>$24,850,000</strong>. Automated cash burn rate is tracking 8.2% lower than Q2, giving an estimated 18.4 months of unencumbered runway.`;
      } else if (promptText.toLowerCase().includes('margin') || promptText.toLowerCase().includes('gross')) {
        reply = `<strong>Ledgerline AI:</strong> Gross margin is currently <strong>64.8%</strong> (+2.4 pt gain), driven by software contract renewals in the US East entity and reduced cloud hosting costs.`;
      }

      aiMsg.innerHTML = reply;
      history.appendChild(aiMsg);
      history.scrollTop = history.scrollHeight;
    }, 450);
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeAiQuery(input.value.trim());
  });

  sideAiBtn?.addEventListener('click', () => {
    executeAiQuery('Interrogate Q3 operating margin variance and flag anomalies.');
  });
}

function initScenarioModeler() {
  const sliderHeadcount = document.getElementById('sliderHeadcount');
  const sliderChurn = document.getElementById('sliderChurn');
  const sliderCac = document.getElementById('sliderCac');

  const valHeadcount = document.getElementById('valHeadcount');
  const valChurn = document.getElementById('valChurn');
  const valCac = document.getElementById('valCac');

  const resArr = document.getElementById('resArr');
  const resCash = document.getElementById('resCash');
  const resEbitda = document.getElementById('resEbitda');

  const recalculate = () => {
    const hc = parseFloat(sliderHeadcount.value);
    const churn = parseFloat(sliderChurn.value);
    const cac = parseFloat(sliderCac.value);

    valHeadcount.textContent = `${hc}%`;
    valChurn.textContent = `${churn}%`;
    valCac.textContent = `${cac} Mo`;

    const baseArr = 48.2;
    const projectedArr = (baseArr * (1 + (hc * 0.012) - (churn * 0.015))).toFixed(1);
    const projectedCash = (24.8 + (projectedArr * 0.22) - (cac * 0.5)).toFixed(1);
    const projectedEbitda = (24.0 + (hc * 0.2) - (churn * 0.4)).toFixed(1);

    resArr.textContent = `$${projectedArr}M`;
    resCash.textContent = `$${projectedCash}M`;
    resEbitda.textContent = `${projectedEbitda}%`;
  };

  sliderHeadcount?.addEventListener('input', recalculate);
  sliderChurn?.addEventListener('input', recalculate);
  sliderCac?.addEventListener('input', recalculate);

  const btnScenario = document.getElementById('btnRunScenario');
  btnScenario?.addEventListener('click', () => {
    sliderHeadcount.value = 25;
    sliderChurn.value = 3.0;
    sliderCac.value = 6;
    recalculate();
    showToast('Applied Optimized Enterprise Growth Scenario');
  });
}

function initCloseChecklist() {
  const buttons = document.querySelectorAll('.btn-approve-task');
  const closeBar = document.getElementById('closeBarFill');
  const closeText = document.getElementById('closeStatusText');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const badge = row.querySelector('.badge-status');
      badge.className = 'badge-status badge-status--done';
      badge.textContent = 'Reconciled & Signed';
      btn.disabled = true;
      btn.textContent = 'Completed';
      showToast('Task approved and logged in immutable audit trail');
    });
  });

  const btnMarkAll = document.getElementById('btnMarkAllClose');
  btnMarkAll?.addEventListener('click', () => {
    buttons.forEach(b => {
      const row = b.closest('tr');
      const badge = row.querySelector('.badge-status');
      badge.className = 'badge-status badge-status--done';
      badge.textContent = 'Reconciled & Signed';
      b.disabled = true;
      b.textContent = 'Completed';
    });
    if (closeBar) closeBar.style.width = '100%';
    if (closeText) closeText.innerHTML = '<strong>100% Completed</strong> — Month-End Books Closed Successfully';
    showToast('All 50 Close Activities Signed & Certified!');
  });
}

function initSpendApprovals() {
  const approveBtns = document.querySelectorAll('.btn-po-approve');
  approveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = 'Approved ✓';
      btn.style.background = '#00936c';
      btn.disabled = true;
      showToast('Purchase Order Approved & Routed to NetSuite Accounts Payable');
    });
  });

  const btnCreatePO = document.getElementById('btnCreatePO');
  btnCreatePO?.addEventListener('click', () => {
    const table = document.getElementById('tableSpend')?.querySelector('tbody');
    if (!table) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Data Warehouse Snowflake Query Credits</td>
      <td>Engineering</td>
      <td>$12,000</td>
      <td>35% of Q4 Allocation</td>
      <td><button class="action-btn action-btn--sm btn-po-approve" style="background:#00936c; color:#fff;" disabled>Pre-Approved</button></td>
    `;
    table.prepend(tr);
    showToast('New Purchase Order Created with Instant Budget Clearance');
  });
}

function initDeskTickets() {
  const tickets = document.querySelectorAll('.ticket-item');
  const detailArea = document.getElementById('ticketDetailArea');
  const btnSend = document.getElementById('btnSendTicket');

  const ticketData = {
    '1': {
      title: '#T-1082: Travel Budget for Sales EMEA',
      query: '"Hey finance team, can I get a breakdown of our EMEA sales travel burn through Q3 so far?"',
      draft: 'Hi Maya, your EMEA Sales travel expenditure through Q3 is <strong>$142,380</strong>, which represents <strong>94% of planned pacing</strong>. The largest drivers were the London executive retreat ($38K) and Munich conference attendance ($27K). Your remaining budget balance through year-end is <strong>$57,620</strong>.'
    },
    '2': {
      title: '#T-1083: Vendor Payment Confirmation #8821',
      query: '"Can you confirm if wire confirmation for invoice INV-8821 has been sent to CloudScale?"',
      draft: 'Payment reference <strong>#WIRE-2026-9912</strong> was executed on Thursday via JPMorgan Chase Treasury for <strong>$44,200.00</strong>. Remittance advice has been dispatched to receivables@cloudscale.com.'
    },
    '3': {
      title: '#T-1084: Q4 Headcount Quota Status',
      query: '"Do we have approved headcount allotment for 2 Senior SRE roles in Q4?"',
      draft: 'Yes. Headcount requisition IDs <strong>#HC-401</strong> and <strong>#HC-402</strong> are fully budgeted in the approved FY26 Plan at a blended fully-loaded base of <strong>$185,000</strong> per role.'
    }
  };

  tickets.forEach(t => {
    t.addEventListener('click', () => {
      tickets.forEach(item => item.classList.remove('is-selected'));
      t.classList.add('is-selected');

      const data = ticketData[t.getAttribute('data-ticket')];
      if (data && detailArea) {
        detailArea.innerHTML = `
          <h3>${data.title}</h3>
          <p><strong>Query:</strong> ${data.query}</p>
          <div class="ai-draft-box">
            <span class="ai-draft-badge"><svg class="ico"><use href="#i-spark"/></svg> AI-Drafted Response (Grounded in NetSuite GL)</span>
            <p>${data.draft}</p>
            <button class="btn btn--primary btn--sm" id="btnSendTicket">Approve & Send to Slack/Email</button>
          </div>
        `;
        document.getElementById('btnSendTicket')?.addEventListener('click', () => {
          showToast('AI response approved & dispatched to user!');
        });
      }
    });
  });

  btnSend?.addEventListener('click', () => {
    showToast('AI response approved & dispatched to user!');
  });
}

function initExcelLiveModeler() {
  const btnSave = document.getElementById('btnSimulateExcelSave');
  btnSave?.addEventListener('click', () => {
    showToast('Synchronized with Cloud General Ledger! All formulas recalculated.');
  });
}

function initSimulateSync() {
  const btnSync = document.getElementById('btnSimulateSync');
  btnSync?.addEventListener('click', () => {
    btnSync.textContent = 'Syncing ERP...';
    setTimeout(() => {
      btnSync.textContent = '↻ Sync 600+ ERP Feeds';
      showToast('All 600+ ERP, CRM, & Bank Feeds Refreshed');
    }, 600);
  });

  const btnExport = document.getElementById('btnExportBoardPack');
  btnExport?.addEventListener('click', () => {
    showToast('Exporting Q3 Consolidated Board Pack to Excel (XLSX)...');
  });

  const btnSyncBanks = document.getElementById('btnSyncBanks');
  btnSyncBanks?.addEventListener('click', () => {
    showToast('Bank Feeds Re-queried: Open Banking API reporting all balances current.');
  });
}
