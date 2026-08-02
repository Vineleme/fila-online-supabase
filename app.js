const STORAGE_KEY = "fila-online-state-v2";
const MY_TICKET_KEY = "fila-online-my-ticket-v2";

const params = new URLSearchParams(window.location.search);
const COMPANY_SLUG = slugify(params.get("empresa") || "restaurante-demo");
const ACCESS_MODE = normalizeAccessMode(params.get("modo") || params.get("tela") || params.get("view") || "");

const defaultCompany = {
  slug: COMPANY_SLUG,
  name: "Restaurante Demo",
  adminPin: "1234",
  tables2: 4,
  tables4: 4,
  tables6: 1,
  used2: 0,
  used4: 0,
  used6: 0,
  dwell2: 50,
  dwell4: 70,
  dwell6: 90,
  themeMode: "light",
  accentColor: "#0d6efd"
};

const defaultState = {
  company: defaultCompany,
  avgMinutes: 70,
  currentTicketId: null,
  myTicketId: localStorage.getItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`),
  queue: []
};

const supabaseConfig = window.FILA_SUPABASE || {};
const hasSupabaseConfig =
  supabaseConfig.url &&
  supabaseConfig.anonKey &&
  !supabaseConfig.url.includes("COLE_AQUI") &&
  !supabaseConfig.anonKey.includes("COLE_AQUI");

const db = hasSupabaseConfig
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

let state = loadLocalState();
let audioContext;

const elements = {
  tabs: document.querySelectorAll(".tab"),
  tabsNav: document.querySelector(".tabs"),
  views: document.querySelectorAll(".view"),
  topLabel: document.querySelector("#topLabel"),
  companyTitle: document.querySelector("#companyTitle"),
  joinForm: document.querySelector("#joinForm"),
  nameInput: document.querySelector("#nameInput"),
  partySizeInput: document.querySelector("#partySizeInput"),
  myTicket: document.querySelector("#myTicket"),
  publicQueue: document.querySelector("#publicQueue"),
  adminQueue: document.querySelector("#adminQueue"),
  calledBanner: document.querySelector("#calledBanner"),
  calledName: document.querySelector("#calledName"),
  calledService: document.querySelector("#calledService"),
  statWaiting: document.querySelector("#statWaiting"),
  statAvg: document.querySelector("#statAvg"),
  pinInput: document.querySelector("#pinInput"),
  loginButton: document.querySelector("#loginButton"),
  loginPanel: document.querySelector("#loginPanel"),
  adminPanel: document.querySelector("#adminPanel"),
  adminTabs: document.querySelectorAll(".admin-tab"),
  adminTabPanels: document.querySelectorAll(".admin-tab-panel"),
  logoutButton: document.querySelector("#logoutButton"),
  companyNameInput: document.querySelector("#companyNameInput"),
  themeModeInput: document.querySelector("#themeModeInput"),
  tables2Input: document.querySelector("#tables2Input"),
  tables4Input: document.querySelector("#tables4Input"),
  tables6Input: document.querySelector("#tables6Input"),
  dwell2Input: document.querySelector("#dwell2Input"),
  dwell4Input: document.querySelector("#dwell4Input"),
  dwell6Input: document.querySelector("#dwell6Input"),
  saveCompanyButton: document.querySelector("#saveCompanyButton"),
  tableStatus: document.querySelector("#tableStatus"),
  tableHint: document.querySelector("#tableHint"),
  adminAddForm: document.querySelector("#adminAddForm"),
  adminNameInput: document.querySelector("#adminNameInput"),
  adminPartySizeInput: document.querySelector("#adminPartySizeInput"),
  callNextButton: document.querySelector("#callNextButton"),
  finishCalledButton: document.querySelector("#finishCalledButton"),
  resetButton: document.querySelector("#resetButton")
};

boot();

function boot() {
  bindEvents();
  applyAccessMode();
  render();

  if (db) {
    refreshFromSupabase();
    subscribeToRealtime();
  }
}

function bindEvents() {
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });

  elements.adminTabs.forEach((tab) => {
    tab.addEventListener("click", () => showAdminPanel(tab.dataset.adminTab));
  });

  elements.joinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = elements.nameInput.value.trim();
    if (!name) return;
    if (!hasFullName(name)) {
      alert("Digite nome e sobrenome para entrar na fila.");
      elements.nameInput.focus();
      return;
    }
    if (getMyTicket()) {
      alert("Este aparelho ja tem uma senha ativa na fila.");
      render();
      return;
    }

    const partySize = Number(elements.partySizeInput.value);
    const ticket = {
      company_slug: COMPANY_SLUG,
      number: nextNumber(),
      name,
      service: partyLabel(partySize),
      party_size: partySize,
      status: "waiting"
    };

    if (db) {
      const { data, error } = await db
        .from("queue_tickets")
        .insert(ticket)
        .select()
        .single();

      if (error) {
        alert(`Nao consegui cadastrar: ${error.message}`);
        return;
      }

      state.myTicketId = data.id;
      localStorage.setItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`, data.id);
      await refreshFromSupabase();
    } else {
      const localTicket = {
        ...ticket,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        calledAt: null
      };
      state.queue.push(localTicket);
      state.myTicketId = localTicket.id;
      persistLocalState();
    }

    elements.joinForm.reset();
    render();
    elements.myTicket.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.loginButton.addEventListener("click", () => {
    if (elements.pinInput.value.trim() !== state.company.adminPin) {
      alert("PIN incorreto. PIN inicial: 1234");
      return;
    }
    elements.loginPanel.hidden = true;
    elements.adminPanel.hidden = false;
    fillCompanyForm();
  });

  elements.logoutButton.addEventListener("click", () => {
    elements.pinInput.value = "";
    elements.loginPanel.hidden = false;
    elements.adminPanel.hidden = true;
  });

  elements.saveCompanyButton.addEventListener("click", saveCompanySettings);
  elements.adminAddForm.addEventListener("submit", addTicketFromAdmin);

  elements.callNextButton.addEventListener("click", callNextTicket);
  elements.finishCalledButton.addEventListener("click", finishCalledTicket);
  elements.resetButton.addEventListener("click", resetQueue);

  window.addEventListener("storage", () => {
    if (db) return;
    state = loadLocalState();
    render();
  });
}

function applyAccessMode() {
  if (!ACCESS_MODE) return;

  elements.tabsNav.hidden = true;
  showView(ACCESS_MODE === "admin" ? "adminView" : "clientView");
}

async function ensureCompany() {
  if (!db) return;

  const { data, error } = await db
    .from("queue_companies")
    .select("*")
    .eq("slug", COMPANY_SLUG)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    state.company = fromSupabaseCompany(data);
    return;
  }

  const { data: created, error: createError } = await db
    .from("queue_companies")
    .insert(toSupabaseCompany(defaultCompany))
    .select()
    .single();

  if (createError) throw createError;
  state.company = fromSupabaseCompany(created);
}

async function refreshFromSupabase() {
  try {
    await ensureCompany();
  } catch (error) {
    elements.publicQueue.innerHTML = `<li class="panel muted">Erro ao carregar empresa: ${escapeHtml(error.message)}</li>`;
    return;
  }

  const { data: tickets, error: ticketsError } = await db
    .from("queue_tickets")
    .select("*")
    .eq("company_slug", COMPANY_SLUG)
    .order("created_at", { ascending: true });

  if (ticketsError) {
    elements.publicQueue.innerHTML = `<li class="panel muted">Erro ao carregar fila: ${escapeHtml(ticketsError.message)}</li>`;
    return;
  }

  state.queue = (tickets || []).map(fromSupabaseTicket);
  if (state.myTicketId && !state.queue.some((ticket) => ticket.id === state.myTicketId)) {
    state.myTicketId = null;
    localStorage.removeItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`);
  }
  state.currentTicketId = state.queue.find((ticket) => ticket.status === "called")?.id || null;
  fillCompanyForm();
  render();
}

function subscribeToRealtime() {
  db.channel(`queue-${COMPANY_SLUG}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_tickets" }, refreshFromSupabase)
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_companies" }, refreshFromSupabase)
    .subscribe();
}

async function saveCompanySettings() {
  const company = {
    ...state.company,
    name: elements.companyNameInput.value.trim() || state.company.name,
    tables2: clamp(Number(elements.tables2Input.value), 0, 99),
    tables4: clamp(Number(elements.tables4Input.value), 0, 99),
    tables6: clamp(Number(elements.tables6Input.value), 0, 99),
    used2: Math.min(usedCountFor(2), clamp(Number(elements.tables2Input.value), 0, 99)),
    used4: Math.min(usedCountFor(4), clamp(Number(elements.tables4Input.value), 0, 99)),
    used6: Math.min(usedCountFor(6), clamp(Number(elements.tables6Input.value), 0, 99)),
    dwell2: clamp(Number(elements.dwell2Input.value), 15, 240),
    dwell4: clamp(Number(elements.dwell4Input.value), 15, 240),
    dwell6: clamp(Number(elements.dwell6Input.value), 15, 240),
    themeMode: elements.themeModeInput.value === "dark" ? "dark" : "light",
    accentColor: "#0d6efd"
  };

  state.company = company;
  state.avgMinutes = Math.round((company.dwell2 + company.dwell4 + company.dwell6) / 3);

  if (db) {
    const { error } = await db
      .from("queue_companies")
      .update({ ...toSupabaseCompany(company), updated_at: new Date().toISOString() })
      .eq("slug", COMPANY_SLUG);

    if (error) {
      alert(`Nao consegui salvar: ${error.message}`);
      return;
    }
    await refreshFromSupabase();
  } else {
    persistLocalState();
  }

  render();
}

async function addTicketFromAdmin(event) {
  event.preventDefault();

  const name = elements.adminNameInput.value.trim();
  if (!hasFullName(name)) {
    alert("Digite nome e sobrenome para adicionar a fila.");
    elements.adminNameInput.focus();
    return;
  }

  const partySize = Number(elements.adminPartySizeInput.value);
  const ticket = {
    company_slug: COMPANY_SLUG,
    number: nextNumber(),
    name,
    service: partyLabel(partySize),
    party_size: partySize,
    status: "waiting"
  };

  if (db) {
    const { error } = await db.from("queue_tickets").insert(ticket);
    if (error) {
      alert(`Nao consegui adicionar: ${error.message}`);
      return;
    }
    await refreshFromSupabase();
  } else {
    state.queue.push({
      ...ticket,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      calledAt: null
    });
    persistLocalState();
  }

  elements.adminAddForm.reset();
  render();
}

async function callNextTicket() {
  const waiting = getWaitingTickets().find((ticket) => tableAvailabilityFor(partyBucket(ticket.partySize)).available > 0);
  if (!waiting) return;

  if (db) {
    const { error } = await db
      .from("queue_tickets")
      .update({ status: "called", called_at: new Date().toISOString() })
      .eq("id", waiting.id);

    if (error) {
      alert(`Nao consegui chamar: ${error.message}`);
      return;
    }
    await changeUsedTables(partyBucket(waiting.partySize), 1);
    await refreshFromSupabase();
  } else {
    waiting.status = "called";
    waiting.calledAt = Date.now();
    state.currentTicketId = waiting.id;
    changeUsedTablesLocal(partyBucket(waiting.partySize), 1);
    persistLocalState();
  }

  playCallSound();
  notifyCalled(waiting);
  render();
}

async function finishCalledTicket() {
  const current = getCurrentTicket();
  if (!current) return;

  if (db) {
    const { error } = await db.from("queue_tickets").update({ status: "done" }).eq("id", current.id);
    if (error) {
      alert(`Nao consegui finalizar: ${error.message}`);
      return;
    }
    await changeUsedTables(partyBucket(current.partySize), -1);
    await refreshFromSupabase();
  } else {
    current.status = "done";
    state.currentTicketId = null;
    changeUsedTablesLocal(partyBucket(current.partySize), -1);
    persistLocalState();
  }

  render();
}

async function resetQueue() {
  if (!confirm("Limpar toda a fila desta empresa?")) return;

  if (db) {
    const { error } = await db.from("queue_tickets").delete().eq("company_slug", COMPANY_SLUG);
    if (error) {
      alert(`Nao consegui limpar: ${error.message}`);
      return;
    }
    localStorage.removeItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`);
    await refreshFromSupabase();
  } else {
    state.queue = [];
    state.currentTicketId = null;
    state.myTicketId = null;
    persistLocalState();
  }

  render();
}

async function handleTicketAction(action, id) {
  const ticket = state.queue.find((item) => item.id === id);
  if (!ticket) return;

  if (db) {
    if (action === "call") {
      if (tableAvailabilityFor(partyBucket(ticket.partySize)).available <= 0) {
        alert("Nao ha mesa livre para esse tamanho de grupo.");
        return;
      }

      const { error } = await db
        .from("queue_tickets")
        .update({ status: "called", called_at: new Date().toISOString() })
        .eq("id", id);
      if (error) {
        alert(`Nao consegui chamar: ${error.message}`);
        return;
      }
      await changeUsedTables(partyBucket(ticket.partySize), 1);
      playCallSound();
      notifyCalled(ticket);
    }

    if (action === "done") {
      const { error } = await db.from("queue_tickets").update({ status: "done" }).eq("id", id);
      if (error) {
        alert(`Nao consegui finalizar: ${error.message}`);
        return;
      }
      await changeUsedTables(partyBucket(ticket.partySize), -1);
      if (state.myTicketId === id) {
        state.myTicketId = null;
        localStorage.removeItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`);
      }
    }

    if (action === "remove") {
      const { error } = await db.from("queue_tickets").delete().eq("id", id);
      if (error) alert(`Nao consegui remover: ${error.message}`);
      if (state.myTicketId === id) {
        state.myTicketId = null;
        localStorage.removeItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`);
      }
    }

    await refreshFromSupabase();
    return;
  }

  if (action === "call") {
    if (tableAvailabilityFor(partyBucket(ticket.partySize)).available <= 0) {
      alert("Nao ha mesa livre para esse tamanho de grupo.");
      return;
    }

    ticket.status = "called";
    ticket.calledAt = Date.now();
    state.currentTicketId = ticket.id;
    changeUsedTablesLocal(partyBucket(ticket.partySize), 1);
    playCallSound();
    notifyCalled(ticket);
  }

  if (action === "done") {
    ticket.status = "done";
    changeUsedTablesLocal(partyBucket(ticket.partySize), -1);
    if (state.currentTicketId === ticket.id) state.currentTicketId = null;
    if (state.myTicketId === id) state.myTicketId = null;
  }

  if (action === "remove") {
    state.queue = state.queue.filter((item) => item.id !== id);
    if (state.currentTicketId === id) state.currentTicketId = null;
    if (state.myTicketId === id) state.myTicketId = null;
  }

  persistLocalState();
  render();
}

function showView(viewId) {
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewId));
  elements.views.forEach((view) => view.classList.toggle("is-active", view.id === viewId));
  updateTopLabel();
}

function showAdminPanel(panelId) {
  elements.adminTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.adminTab === panelId));
  elements.adminTabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === panelId));
}

function render() {
  const waitingTickets = getWaitingTickets();
  const current = getCurrentTicket();
  elements.companyTitle.textContent = state.company.name;
  elements.statWaiting.textContent = waitingTickets.length;
  elements.statAvg.textContent = formatDuration(state.avgMinutes);
  const canCallNext = waitingTickets.some((ticket) => tableAvailabilityFor(partyBucket(ticket.partySize)).available > 0);
  elements.callNextButton.disabled = !canCallNext;
  elements.callNextButton.classList.toggle("is-ready", canCallNext);
  elements.finishCalledButton.disabled = !current;
  applyTheme();
  updateTopLabel();

  renderCalledBanner();
  renderMyTicket();
  renderPublicQueue();
  renderAdminQueue();
  renderTableStatus();
}

function fillCompanyForm() {
  elements.companyNameInput.value = state.company.name;
  elements.tables2Input.value = state.company.tables2;
  elements.tables4Input.value = state.company.tables4;
  elements.tables6Input.value = state.company.tables6;
  elements.dwell2Input.value = state.company.dwell2;
  elements.dwell4Input.value = state.company.dwell4;
  elements.dwell6Input.value = state.company.dwell6;
  elements.themeModeInput.value = state.company.themeMode;
}

function renderCalledBanner() {
  const myTicket = state.queue.find((item) => item.id === state.myTicketId);
  const shouldShow = myTicket?.status === "called";
  elements.calledBanner.hidden = !shouldShow;
  if (!shouldShow) return;
  elements.calledName.textContent = `${formatNumber(myTicket.number)} - ${myTicket.name}`;
  elements.calledService.textContent = `Voce foi chamado. Procure a recepcao.`;
}

function renderMyTicket() {
  const ticket = getMyTicket();
  elements.myTicket.classList.toggle("is-called", ticket?.status === "called");
  elements.myTicket.classList.toggle("is-waiting", ticket?.status === "waiting");
  elements.joinForm.hidden = Boolean(ticket);

  if (!ticket) {
    elements.myTicket.innerHTML = `
      <h2>Minha senha</h2>
      <p class="muted">Entre na lista para acompanhar a previsao.</p>
    `;
    return;
  }

  const ahead = countAhead(ticket);
  const wait = estimateWait(ticket);
  const statusText = ticket.status === "called" ? "Chamado agora" : ticket.status === "done" ? "Finalizado" : "Aguardando";

  elements.myTicket.innerHTML = `
    <h2>Minha senha</h2>
    <div class="ticket-number">${formatNumber(ticket.number)}</div>
    <div class="ticket-grid">
      <div class="metric"><strong>${ahead}</strong><span>grupos na frente</span></div>
      <div class="metric wait-metric"><strong>${formatDuration(wait)}</strong><span>espera estimada</span></div>
      <div class="metric"><strong>${statusText}</strong><span>status</span></div>
    </div>
  `;
}

function renderPublicQueue() {
  const ticket = getMyTicket();

  if (!ticket) {
    elements.publicQueue.innerHTML = `<li class="panel muted">Depois do cadastro, esta tela mostra apenas a sua senha e sua previsao.</li>`;
    return;
  }
  elements.publicQueue.innerHTML = "";
}

function renderAdminQueue() {
  const visibleTickets = state.queue.filter((ticket) => ticket.status !== "done");

  if (visibleTickets.length === 0) {
    elements.adminQueue.innerHTML = `<p class="muted">Lista vazia.</p>`;
    return;
  }

  elements.adminQueue.innerHTML = visibleTickets.map((ticket) => {
    const calledClass = ticket.status === "called" ? " is-called" : "";
    const canCall = ticket.status === "waiting" && tableAvailabilityFor(partyBucket(ticket.partySize)).available > 0;
    return `
      <div class="admin-item${calledClass}">
        <span class="place">${formatNumber(ticket.number)}</span>
        <span class="person">
          <strong>${escapeHtml(ticket.name)}</strong>
          <span>${partyLabel(ticket.partySize)} - ${ticket.status} - ${formatDuration(estimateWait(ticket))}</span>
        </span>
        <span class="mini-actions">
          <button type="button" data-action="call" data-id="${ticket.id}" ${canCall ? "" : "disabled"}>Chamar</button>
          <button type="button" data-action="done" data-id="${ticket.id}">Finalizar</button>
          <button type="button" data-action="remove" data-id="${ticket.id}">Remover</button>
        </span>
      </div>
    `;
  }).join("");

  elements.adminQueue.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleTicketAction(button.dataset.action, button.dataset.id));
  });
}

function renderTableStatus() {
  const rows = [2, 4, 6].map((bucket) => {
    const status = tableAvailabilityFor(bucket);
    const waiting = getWaitingTickets().filter((ticket) => partyBucket(ticket.partySize) === bucket).length;
    const canCall = status.available > 0 && waiting > 0;
    return `
      <div class="table-card${canCall ? " is-ready" : ""}">
        <div class="table-people" aria-hidden="true">${seatDots(bucket)}</div>
        <strong>${tableLabel(bucket)}</strong>
        <span class="availability">${status.available} de ${status.total} livres</span>
        <small>${status.used} ocupadas - ${waiting} aguardando</small>
        <div class="table-stepper">
          <button type="button" data-table-action="free" data-bucket="${bucket}" ${status.used <= 0 ? "disabled" : ""}>-</button>
          <span>ocupadas</span>
          <button type="button" data-table-action="occupy" data-bucket="${bucket}" ${status.used >= status.total ? "disabled" : ""}>+</button>
        </div>
        ${canCall ? `<em>Pode chamar agora</em>` : ""}
      </div>
    `;
  });

  elements.tableStatus.innerHTML = rows.join("");
  elements.tableHint.hidden = !getWaitingTickets().some((ticket) => tableAvailabilityFor(partyBucket(ticket.partySize)).available > 0);
  elements.tableStatus.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleTableButton(button.dataset.tableAction, Number(button.dataset.bucket)));
  });
}

function applyTheme() {
  const isCustomerLink = ACCESS_MODE === "fila";
  const themeMode = isCustomerLink || state.company.themeMode === "dark" ? "dark" : "light";
  const brand = isCustomerLink ? "#22c55e" : "#0d6efd";
  const brandDark = isCustomerLink ? "#15803d" : "#084298";
  const brandSoft = isCustomerLink ? "#0f2f1d" : themeMode === "dark" ? "#0b2f6b" : "#e7f0ff";
  const heroAccent = isCustomerLink ? "rgba(34, 197, 94, 0.62)" : "rgba(13, 110, 253, 0.62)";

  document.documentElement.dataset.theme = themeMode;
  document.documentElement.style.setProperty("--brand", brand);
  document.documentElement.style.setProperty("--brand-dark", brandDark);
  document.documentElement.style.setProperty("--brand-soft", brandSoft);
  document.documentElement.style.setProperty("--hero-accent", heroAccent);
}

function updateTopLabel() {
  const isAdmin = document.querySelector("#adminView")?.classList.contains("is-active");
  elements.topLabel.textContent = isAdmin ? "Administrador" : "Fila de espera";
}

function estimateWait(ticket) {
  if (ticket.status === "called" || ticket.status === "done") return 0;
  const bucket = partyBucket(ticket.partySize);
  const sameBucketOpen = state.queue
    .filter((item) => item.status !== "done" && partyBucket(item.partySize) === bucket)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const index = Math.max(0, sameBucketOpen.findIndex((item) => item.id === ticket.id));
  const tables = Math.max(1, tableCountFor(bucket));
  return Math.floor(index / tables) * dwellFor(bucket);
}

function countAhead(ticket) {
  if (ticket.status !== "waiting") return 0;
  const bucket = partyBucket(ticket.partySize);
  const createdAt = new Date(ticket.createdAt).getTime();
  return state.queue.filter((item) => {
    const itemCreatedAt = new Date(item.createdAt).getTime();
    return item.status !== "done" && partyBucket(item.partySize) === bucket && itemCreatedAt < createdAt;
  }).length;
}

function notifyCalled(ticket) {
  if (state.myTicketId !== ticket.id) return;
  renderCalledBanner();
}

function playCallSound() {
  audioContext = audioContext || new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.16);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.45);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.46);
}

function getWaitingTickets() {
  return state.queue.filter((ticket) => ticket.status === "waiting");
}

function getCurrentTicket() {
  return state.queue.find((ticket) => ticket.id === state.currentTicketId && ticket.status === "called");
}

function getMyTicket() {
  return state.queue.find((item) => item.id === state.myTicketId);
}

function nextNumber() {
  const max = state.queue.reduce((highest, ticket) => Math.max(highest, Number(ticket.number)), 0);
  return max + 1;
}

function partyBucket(size) {
  if (Number(size) <= 2) return 2;
  if (Number(size) <= 4) return 4;
  return 6;
}

function partyLabel(size) {
  const bucket = partyBucket(size);
  if (bucket === 2) return "1-2 pessoas";
  if (bucket === 4) return "3-4 pessoas";
  return "5-6+ pessoas";
}

function tableCountFor(bucket) {
  if (bucket === 2) return state.company.tables2;
  if (bucket === 4) return state.company.tables4;
  return state.company.tables6;
}

function dwellFor(bucket) {
  if (bucket === 2) return state.company.dwell2;
  if (bucket === 4) return state.company.dwell4;
  return state.company.dwell6;
}

function tableAvailabilityFor(bucket) {
  const total = Math.max(0, tableCountFor(bucket));
  const used = Math.min(total, Math.max(0, usedCountFor(bucket)));
  return {
    total,
    used,
    available: Math.max(0, total - used)
  };
}

function usedCountFor(bucket) {
  if (bucket === 2) return state.company.used2 || 0;
  if (bucket === 4) return state.company.used4 || 0;
  return state.company.used6 || 0;
}

function setUsedCountFor(bucket, value) {
  const total = tableCountFor(bucket);
  const used = clamp(Number(value), 0, total);
  if (bucket === 2) state.company.used2 = used;
  if (bucket === 4) state.company.used4 = used;
  if (bucket === 6) state.company.used6 = used;
}

async function handleTableButton(action, bucket) {
  const delta = action === "occupy" ? 1 : -1;
  if (db) {
    await changeUsedTables(bucket, delta);
    await refreshFromSupabase();
    return;
  }

  changeUsedTablesLocal(bucket, delta);
  persistLocalState();
  render();
}

function changeUsedTablesLocal(bucket, delta) {
  setUsedCountFor(bucket, usedCountFor(bucket) + delta);
}

async function changeUsedTables(bucket, delta) {
  const nextUsed = clamp(usedCountFor(bucket) + delta, 0, tableCountFor(bucket));
  setUsedCountFor(bucket, nextUsed);

  const { error } = await db
    .from("queue_companies")
    .update({
      used_2: state.company.used2,
      used_4: state.company.used4,
      used_6: state.company.used6,
      updated_at: new Date().toISOString()
    })
    .eq("slug", COMPANY_SLUG);

  if (error) {
    alert(`Nao consegui atualizar mesas: ${error.message}`);
  }
}

function fromSupabaseTicket(ticket) {
  return {
    id: ticket.id,
    companySlug: ticket.company_slug || COMPANY_SLUG,
    number: ticket.number,
    name: ticket.name,
    service: ticket.service,
    partySize: ticket.party_size || 2,
    status: ticket.status,
    createdAt: ticket.created_at,
    calledAt: ticket.called_at
  };
}

function fromSupabaseCompany(company) {
  return {
    slug: company.slug,
    name: company.name,
    adminPin: company.admin_pin || "1234",
    tables2: company.tables_2,
    tables4: company.tables_4,
    tables6: company.tables_6,
    used2: company.used_2 || 0,
    used4: company.used_4 || 0,
    used6: company.used_6 || 0,
    dwell2: company.dwell_2,
    dwell4: company.dwell_4,
    dwell6: company.dwell_6,
    themeMode: company.theme_mode || "light",
    accentColor: company.accent_color || "#0d6efd"
  };
}

function toSupabaseCompany(company) {
  return {
    slug: company.slug,
    name: company.name,
    admin_pin: company.adminPin,
    tables_2: company.tables2,
    tables_4: company.tables4,
    tables_6: company.tables6,
    used_2: company.used2 || 0,
    used_4: company.used4 || 0,
    used_6: company.used6 || 0,
    dwell_2: company.dwell2,
    dwell_4: company.dwell4,
    dwell_6: company.dwell6,
    theme_mode: company.themeMode,
    accent_color: company.accentColor
  };
}

function loadLocalState() {
  try {
    const stored = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-${COMPANY_SLUG}`));
    return { ...defaultState, ...stored, queue: stored?.queue || [] };
  } catch {
    return { ...defaultState };
  }
}

function persistLocalState() {
  localStorage.setItem(`${STORAGE_KEY}-${COMPANY_SLUG}`, JSON.stringify(state));
  if (state.myTicketId) {
    localStorage.setItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`, state.myTicketId);
  } else {
    localStorage.removeItem(`${MY_TICKET_KEY}-${COMPANY_SLUG}`);
  }
}

function formatNumber(number) {
  return String(number).padStart(3, "0");
}

function formatDuration(minutes) {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  if (total < 60) return `${total} min`;

  const hours = Math.floor(total / 60);
  const rest = total % 60;
  const hourLabel = hours === 1 ? "1h" : `${hours}h`;
  return rest === 0 ? hourLabel : `${hourLabel} ${rest}min`;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function hasFullName(value) {
  return value.trim().split(/\s+/).filter((part) => part.length >= 2).length >= 2;
}

function tableLabel(bucket) {
  if (bucket === 2) return "Mesa para 2";
  if (bucket === 4) return "Mesa para 4";
  return "Mesa para 6+";
}

function seatDots(bucket) {
  const count = bucket === 6 ? 6 : bucket;
  return Array.from({ length: count }, () => `<span></span>`).join("") + (bucket === 6 ? `<b>+</b>` : "");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "restaurante-demo";
}

function normalizeAccessMode(value) {
  const mode = slugify(value);
  if (["admin", "administrativo", "gestao", "gestor"].includes(mode)) return "admin";
  if (["fila", "cliente", "qr", "publico"].includes(mode)) return "fila";
  return "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
