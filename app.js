const STORAGE_KEY = "fila-online-state-v1";
const MY_TICKET_KEY = "fila-online-my-ticket-v1";
const ADMIN_PIN = "1234";

const defaultState = {
  avgMinutes: 5,
  currentTicketId: null,
  myTicketId: localStorage.getItem(MY_TICKET_KEY),
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
  views: document.querySelectorAll(".view"),
  joinForm: document.querySelector("#joinForm"),
  nameInput: document.querySelector("#nameInput"),
  serviceInput: document.querySelector("#serviceInput"),
  myTicket: document.querySelector("#myTicket"),
  publicQueue: document.querySelector("#publicQueue"),
  adminQueue: document.querySelector("#adminQueue"),
  calledBanner: document.querySelector("#calledBanner"),
  calledName: document.querySelector("#calledName"),
  calledService: document.querySelector("#calledService"),
  statWaiting: document.querySelector("#statWaiting"),
  statAvg: document.querySelector("#statAvg"),
  notifyButton: document.querySelector("#notifyButton"),
  pinInput: document.querySelector("#pinInput"),
  loginButton: document.querySelector("#loginButton"),
  loginPanel: document.querySelector("#loginPanel"),
  adminPanel: document.querySelector("#adminPanel"),
  logoutButton: document.querySelector("#logoutButton"),
  avgInput: document.querySelector("#avgInput"),
  callNextButton: document.querySelector("#callNextButton"),
  finishCalledButton: document.querySelector("#finishCalledButton"),
  resetButton: document.querySelector("#resetButton")
};

boot();

function boot() {
  bindEvents();
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

  elements.joinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = elements.nameInput.value.trim();
    if (!name) return;

    const ticket = {
      number: nextNumber(),
      name,
      service: elements.serviceInput.value,
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
      localStorage.setItem(MY_TICKET_KEY, data.id);
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
  });

  elements.notifyButton.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      alert("Este navegador nao suporta notificacoes.");
      return;
    }

    const result = await Notification.requestPermission();
    elements.notifyButton.textContent = result === "granted" ? "Notificacoes ativas" : "Ativar notificacoes";
  });

  elements.loginButton.addEventListener("click", () => {
    if (elements.pinInput.value.trim() !== ADMIN_PIN) {
      alert("PIN incorreto. PIN inicial: 1234");
      return;
    }
    elements.loginPanel.hidden = true;
    elements.adminPanel.hidden = false;
    elements.avgInput.value = state.avgMinutes;
  });

  elements.logoutButton.addEventListener("click", () => {
    elements.pinInput.value = "";
    elements.loginPanel.hidden = false;
    elements.adminPanel.hidden = true;
  });

  elements.avgInput.addEventListener("change", async () => {
    state.avgMinutes = clamp(Number(elements.avgInput.value), 1, 60);

    if (db) {
      const { error } = await db
        .from("queue_settings")
        .update({ avg_minutes: state.avgMinutes, updated_at: new Date().toISOString() })
        .eq("id", 1);

      if (error) alert(`Nao consegui salvar o tempo: ${error.message}`);
    } else {
      persistLocalState();
    }

    render();
  });

  elements.callNextButton.addEventListener("click", callNextTicket);
  elements.finishCalledButton.addEventListener("click", finishCalledTicket);
  elements.resetButton.addEventListener("click", resetQueue);

  window.addEventListener("storage", () => {
    if (db) return;
    state = loadLocalState();
    render();
  });
}

async function refreshFromSupabase() {
  const [{ data: settings, error: settingsError }, { data: tickets, error: ticketsError }] = await Promise.all([
    db.from("queue_settings").select("avg_minutes").eq("id", 1).single(),
    db.from("queue_tickets").select("*").order("created_at", { ascending: true })
  ]);

  if (settingsError || ticketsError) {
    const message = settingsError?.message || ticketsError?.message;
    elements.publicQueue.innerHTML = `<li class="panel muted">Erro ao carregar Supabase: ${escapeHtml(message)}</li>`;
    return;
  }

  state.avgMinutes = settings?.avg_minutes || 5;
  state.queue = (tickets || []).map(fromSupabaseTicket);
  state.currentTicketId = state.queue.find((ticket) => ticket.status === "called")?.id || null;
  render();
}

function subscribeToRealtime() {
  db.channel("queue-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_tickets" }, refreshFromSupabase)
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_settings" }, refreshFromSupabase)
    .subscribe();
}

async function callNextTicket() {
  const waiting = state.queue.find((ticket) => ticket.status === "waiting");
  if (!waiting) return;

  if (db) {
    await db.from("queue_tickets").update({ status: "done" }).eq("status", "called");
    const { error } = await db
      .from("queue_tickets")
      .update({ status: "called", called_at: new Date().toISOString() })
      .eq("id", waiting.id);

    if (error) {
      alert(`Nao consegui chamar: ${error.message}`);
      return;
    }

    await refreshFromSupabase();
  } else {
    state.queue.forEach((ticket) => {
      if (ticket.status === "called") ticket.status = "done";
    });
    waiting.status = "called";
    waiting.calledAt = Date.now();
    state.currentTicketId = waiting.id;
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
    await refreshFromSupabase();
  } else {
    current.status = "done";
    state.currentTicketId = null;
    persistLocalState();
  }

  render();
}

async function resetQueue() {
  if (!confirm("Limpar toda a fila?")) return;

  if (db) {
    const { error } = await db.from("queue_tickets").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      alert(`Nao consegui limpar: ${error.message}`);
      return;
    }
    localStorage.removeItem(MY_TICKET_KEY);
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
      await db.from("queue_tickets").update({ status: "done" }).eq("status", "called");
      const { error } = await db
        .from("queue_tickets")
        .update({ status: "called", called_at: new Date().toISOString() })
        .eq("id", id);
      if (error) alert(`Nao consegui chamar: ${error.message}`);
      playCallSound();
      notifyCalled(ticket);
    }

    if (action === "done") {
      const { error } = await db.from("queue_tickets").update({ status: "done" }).eq("id", id);
      if (error) alert(`Nao consegui finalizar: ${error.message}`);
    }

    if (action === "remove") {
      const { error } = await db.from("queue_tickets").delete().eq("id", id);
      if (error) alert(`Nao consegui remover: ${error.message}`);
    }

    await refreshFromSupabase();
    return;
  }

  if (action === "call") {
    state.queue.forEach((item) => {
      if (item.status === "called") item.status = "done";
    });
    ticket.status = "called";
    ticket.calledAt = Date.now();
    state.currentTicketId = ticket.id;
    playCallSound();
    notifyCalled(ticket);
  }

  if (action === "done") {
    ticket.status = "done";
    if (state.currentTicketId === ticket.id) state.currentTicketId = null;
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
}

function render() {
  const waitingTickets = getWaitingTickets();
  const current = getCurrentTicket();
  elements.statWaiting.textContent = waitingTickets.length;
  elements.statAvg.textContent = `${state.avgMinutes} min`;
  elements.callNextButton.disabled = waitingTickets.length === 0;
  elements.finishCalledButton.disabled = !current;

  renderCalledBanner(current);
  renderMyTicket();
  renderPublicQueue();
  renderAdminQueue();
}

function renderCalledBanner(current) {
  elements.calledBanner.hidden = !current;
  if (!current) return;
  elements.calledName.textContent = `${current.number} - ${current.name}`;
  elements.calledService.textContent = current.service;
}

function renderMyTicket() {
  const ticket = state.queue.find((item) => item.id === state.myTicketId);
  elements.myTicket.classList.toggle("is-called", ticket?.status === "called");

  if (!ticket) {
    elements.myTicket.innerHTML = `
      <h2>Minha posicao</h2>
      <p class="muted">Cadastre seu nome para acompanhar a fila.</p>
    `;
    return;
  }

  const ahead = countAhead(ticket);
  const wait = ahead * state.avgMinutes;
  const statusText = ticket.status === "called" ? "Chamado agora" : ticket.status === "done" ? "Finalizado" : "Aguardando";

  elements.myTicket.innerHTML = `
    <h2>Minha posicao</h2>
    <div class="ticket-number">${ticket.number}</div>
    <p><strong>${escapeHtml(ticket.name)}</strong> - ${escapeHtml(ticket.service)}</p>
    <div class="ticket-grid">
      <div class="metric"><strong>${ahead}</strong><span>na frente</span></div>
      <div class="metric"><strong>${wait} min</strong><span>espera estimada</span></div>
      <div class="metric"><strong>${statusText}</strong><span>status</span></div>
    </div>
  `;
}

function renderPublicQueue() {
  const visibleTickets = state.queue.filter((ticket) => ticket.status !== "done");

  if (visibleTickets.length === 0) {
    elements.publicQueue.innerHTML = `<li class="panel muted">Nenhuma pessoa na fila.</li>`;
    return;
  }

  elements.publicQueue.innerHTML = visibleTickets.map((ticket) => {
    const place = ticket.status === "called" ? "OK" : countAhead(ticket) + 1;
    const wait = countAhead(ticket) * state.avgMinutes;
    const calledClass = ticket.status === "called" ? " is-called" : "";
    const status = ticket.status === "called" ? "Chamado" : `${wait} min`;
    return `
      <li class="queue-item${calledClass}">
        <span class="place">${place}</span>
        <span class="person">
          <strong>${formatNumber(ticket.number)} - ${escapeHtml(ticket.name)}</strong>
          <span>${escapeHtml(ticket.service)}</span>
        </span>
        <span class="time-chip">${status}</span>
      </li>
    `;
  }).join("");
}

function renderAdminQueue() {
  const visibleTickets = state.queue.filter((ticket) => ticket.status !== "done");

  if (visibleTickets.length === 0) {
    elements.adminQueue.innerHTML = `<p class="muted">Fila vazia.</p>`;
    return;
  }

  elements.adminQueue.innerHTML = visibleTickets.map((ticket) => {
    const calledClass = ticket.status === "called" ? " is-called" : "";
    return `
      <div class="admin-item${calledClass}">
        <span class="place">${formatNumber(ticket.number)}</span>
        <span class="person">
          <strong>${escapeHtml(ticket.name)}</strong>
          <span>${escapeHtml(ticket.service)} - ${ticket.status}</span>
        </span>
        <span class="mini-actions">
          <button type="button" data-action="call" data-id="${ticket.id}">Chamar</button>
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

function notifyCalled(ticket) {
  if (state.myTicketId !== ticket.id) return;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Sua vez chegou", {
      body: `${formatNumber(ticket.number)} - ${ticket.name}, dirija-se ao atendimento ${ticket.service}.`
    });
  }
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

function countAhead(ticket) {
  const createdAt = new Date(ticket.createdAt).getTime();
  return state.queue.filter((item) => item.status === "waiting" && new Date(item.createdAt).getTime() < createdAt).length;
}

function nextNumber() {
  const max = state.queue.reduce((highest, ticket) => Math.max(highest, Number(ticket.number)), 0);
  return max + 1;
}

function fromSupabaseTicket(ticket) {
  return {
    id: ticket.id,
    number: ticket.number,
    name: ticket.name,
    service: ticket.service,
    status: ticket.status,
    createdAt: ticket.created_at,
    calledAt: ticket.called_at
  };
}

function loadLocalState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState, ...stored, queue: stored?.queue || [] };
  } catch {
    return { ...defaultState };
  }
}

function persistLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (state.myTicketId) {
    localStorage.setItem(MY_TICKET_KEY, state.myTicketId);
  } else {
    localStorage.removeItem(MY_TICKET_KEY);
  }
}

function formatNumber(number) {
  return String(number).padStart(3, "0");
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
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
