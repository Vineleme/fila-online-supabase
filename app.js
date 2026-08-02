const STORAGE_KEY = "fila-online-state-v2";
const MY_TICKET_KEY = "fila-online-my-ticket-v2";
const ASSETS_BUCKET = "fila-ai-assets";
const OWNER_PIN = "7890";

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
  queueOpen: true,
  openTime: "16:00",
  closeTime: "19:00",
  logoUrl: "assets/fila-ai-logo-white.png",
  coverUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80",
  dwell2: 50,
  dwell4: 70,
  dwell6: 90,
  themeMode: "light",
  accentColor: "#0d6efd",
  ownerStatus: "demo",
  paymentStatus: "sem cobranca",
  contactName: "",
  contactPhone: "",
  monthlyPrice: "",
  trialStartedAt: null,
  trialEndsAt: null
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
  landingPage: document.querySelector("#landingPage"),
  appShell: document.querySelector("#appShell"),
  ownerShell: document.querySelector("#ownerShell"),
  trialRequestForm: document.querySelector("#trialRequestForm"),
  trialRestaurantInput: document.querySelector("#trialRestaurantInput"),
  trialOwnerInput: document.querySelector("#trialOwnerInput"),
  trialPhoneInput: document.querySelector("#trialPhoneInput"),
  trialCityInput: document.querySelector("#trialCityInput"),
  trialRequestMessage: document.querySelector("#trialRequestMessage"),
  ownerLoginPanel: document.querySelector("#ownerLoginPanel"),
  ownerPanel: document.querySelector("#ownerPanel"),
  ownerPinInput: document.querySelector("#ownerPinInput"),
  ownerLoginButton: document.querySelector("#ownerLoginButton"),
  ownerRefreshButton: document.querySelector("#ownerRefreshButton"),
  ownerCreateForm: document.querySelector("#ownerCreateForm"),
  ownerCompanyNameInput: document.querySelector("#ownerCompanyNameInput"),
  ownerCompanyPhoneInput: document.querySelector("#ownerCompanyPhoneInput"),
  ownerMonthlyPriceInput: document.querySelector("#ownerMonthlyPriceInput"),
  ownerRequestsList: document.querySelector("#ownerRequestsList"),
  ownerCompaniesList: document.querySelector("#ownerCompaniesList"),
  tabs: document.querySelectorAll(".tab"),
  tabsNav: document.querySelector(".tabs"),
  views: document.querySelectorAll(".view"),
  topLabel: document.querySelector("#topLabel"),
  companyTitle: document.querySelector("#companyTitle"),
  companyLogo: document.querySelector("#companyLogo"),
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
  companyLogoUrlInput: document.querySelector("#companyLogoUrlInput"),
  companyCoverUrlInput: document.querySelector("#companyCoverUrlInput"),
  companyLogoFileInput: document.querySelector("#companyLogoFileInput"),
  companyCoverFileInput: document.querySelector("#companyCoverFileInput"),
  brandUploadStatus: document.querySelector("#brandUploadStatus"),
  themeModeInput: document.querySelector("#themeModeInput"),
  queueOpenInput: document.querySelector("#queueOpenInput"),
  openTimeInput: document.querySelector("#openTimeInput"),
  closeTimeInput: document.querySelector("#closeTimeInput"),
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
  bindLandingEvents();

  if (ACCESS_MODE === "dono") {
    elements.landingPage.hidden = true;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = false;
    document.documentElement.dataset.theme = "landing";
    bindOwnerEvents();
    return;
  }

  if (!ACCESS_MODE) {
    elements.landingPage.hidden = false;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = true;
    document.documentElement.dataset.theme = "landing";
    return;
  }

  elements.landingPage.hidden = true;
  elements.ownerShell.hidden = true;
  elements.appShell.hidden = false;
  bindEvents();
  applyAccessMode();
  render();

  if (db) {
    refreshFromSupabase();
    subscribeToRealtime();
  }
}

function bindLandingEvents() {
  if (!elements.trialRequestForm) return;

  elements.trialRequestForm.addEventListener("submit", submitTrialRequest);
}

function bindOwnerEvents() {
  elements.ownerLoginButton.addEventListener("click", () => {
    if (elements.ownerPinInput.value.trim() !== OWNER_PIN) {
      alert("PIN do dono incorreto.");
      return;
    }
    elements.ownerLoginPanel.hidden = true;
    elements.ownerPanel.hidden = false;
    refreshOwnerDashboard();
  });

  elements.ownerRefreshButton.addEventListener("click", refreshOwnerDashboard);
  elements.ownerCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await createTrialCompany({
      restaurantName: elements.ownerCompanyNameInput.value.trim(),
      ownerName: "",
      phone: elements.ownerCompanyPhoneInput.value.trim(),
      monthlyPrice: elements.ownerMonthlyPriceInput.value.trim()
    });
    elements.ownerCreateForm.reset();
    await refreshOwnerDashboard();
  });
}

async function submitTrialRequest(event) {
  event.preventDefault();

  const request = {
    restaurant_name: elements.trialRestaurantInput.value.trim(),
    owner_name: elements.trialOwnerInput.value.trim(),
    phone: elements.trialPhoneInput.value.trim(),
    city: elements.trialCityInput.value.trim(),
    status: "novo"
  };

  if (!request.restaurant_name || !hasFullName(request.owner_name) || request.phone.length < 8) {
    elements.trialRequestMessage.textContent = "Preencha restaurante, nome completo e WhatsApp.";
    return;
  }

  if (!db) {
    elements.trialRequestMessage.textContent = "Banco indisponivel agora. Me chame no WhatsApp para liberar o teste.";
    return;
  }

  const { error } = await db.from("trial_requests").insert(request);
  if (error) {
    elements.trialRequestMessage.textContent = `Nao consegui enviar: ${error.message}`;
    return;
  }

  elements.trialRequestForm.reset();
  elements.trialRequestMessage.textContent = "Pedido recebido. Voce vai liberar o teste pela central do dono.";
}

async function refreshOwnerDashboard() {
  if (!db) {
    elements.ownerRequestsList.innerHTML = `<p class="muted">Supabase nao configurado.</p>`;
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Supabase nao configurado.</p>`;
    return;
  }

  const [{ data: requests, error: requestsError }, { data: companies, error: companiesError }] = await Promise.all([
    db.from("trial_requests").select("*").order("created_at", { ascending: false }),
    db.from("queue_companies").select("*").order("created_at", { ascending: false })
  ]);

  if (requestsError) {
    elements.ownerRequestsList.innerHTML = `<p class="muted">Erro: ${escapeHtml(requestsError.message)}</p>`;
  } else {
    renderOwnerRequests(requests || []);
  }

  if (companiesError) {
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Erro: ${escapeHtml(companiesError.message)}</p>`;
  } else {
    renderOwnerCompanies(companies || []);
  }
}

function renderOwnerRequests(requests) {
  if (!requests.length) {
    elements.ownerRequestsList.innerHTML = `<p class="muted">Nenhum pedido ainda.</p>`;
    return;
  }

  elements.ownerRequestsList.innerHTML = requests.map((request) => `
    <article class="owner-item">
      <div>
        <strong>${escapeHtml(request.restaurant_name)}</strong>
        <span>${escapeHtml(request.owner_name)} - ${escapeHtml(request.phone || "sem telefone")}</span>
        <small>${escapeHtml(request.city || "cidade nao informada")} - ${formatDate(request.created_at)}</small>
      </div>
      <div class="owner-actions">
        <button type="button" data-owner-action="create" data-request-id="${request.id}">Liberar 7 dias</button>
        <button type="button" data-owner-action="contact" data-phone="${escapeHtml(request.phone || "")}">WhatsApp</button>
      </div>
    </article>
  `).join("");

  elements.ownerRequestsList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleOwnerRequestAction(button));
  });
}

function renderOwnerCompanies(companies) {
  if (!companies.length) {
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Nenhum restaurante criado.</p>`;
    return;
  }

  const origin = window.location.origin + window.location.pathname;
  elements.ownerCompaniesList.innerHTML = companies.map((company) => {
    const trial = trialStatus(company);
    const adminUrl = `${origin}?empresa=${encodeURIComponent(company.slug)}&modo=admin`;
    const filaUrl = `${origin}?empresa=${encodeURIComponent(company.slug)}&modo=fila`;
    return `
      <article class="owner-company owner-item">
        <div>
          <strong>${escapeHtml(company.name)}</strong>
          <span>${escapeHtml(company.owner_status || "teste")} - ${escapeHtml(company.payment_status || "pagamento pendente")} - ${trial}</span>
          <small>PIN admin: ${escapeHtml(company.admin_pin || "1234")} - slug: ${escapeHtml(company.slug)}</small>
        </div>
        <div class="link-stack">
          <a href="${adminUrl}" target="_blank" rel="noreferrer">Admin</a>
          <a href="${filaUrl}" target="_blank" rel="noreferrer">Fila cliente</a>
          <button type="button" data-company-action="paid" data-slug="${escapeHtml(company.slug)}">Pago</button>
          <button type="button" data-company-action="pending" data-slug="${escapeHtml(company.slug)}">Pendente</button>
          <button type="button" data-company-action="blocked" data-slug="${escapeHtml(company.slug)}">Bloquear</button>
        </div>
      </article>
    `;
  }).join("");

  elements.ownerCompaniesList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleOwnerCompanyAction(button));
  });
}

async function handleOwnerRequestAction(button) {
  const action = button.dataset.ownerAction;
  if (action === "contact") {
    const digits = (button.dataset.phone || "").replace(/\D/g, "");
    if (!digits) return alert("Esse pedido nao tem telefone.");
    window.open(`https://wa.me/55${digits}`, "_blank", "noopener");
    return;
  }

  const requestId = button.dataset.requestId;
  const { data: request, error } = await db.from("trial_requests").select("*").eq("id", requestId).single();
  if (error) {
    alert(`Nao consegui abrir pedido: ${error.message}`);
    return;
  }

  await createTrialCompany({
    restaurantName: request.restaurant_name,
    ownerName: request.owner_name,
    phone: request.phone,
    monthlyPrice: ""
  });

  await db.from("trial_requests").update({ status: "liberado" }).eq("id", requestId);
  await refreshOwnerDashboard();
}

async function handleOwnerCompanyAction(button) {
  const slug = button.dataset.slug;
  const action = button.dataset.companyAction;
  const updates = {
    paid: { owner_status: "ativo", payment_status: "pago" },
    pending: { owner_status: "teste", payment_status: "pendente" },
    blocked: { owner_status: "bloqueado", payment_status: "bloqueado", queue_open: false }
  }[action];

  if (!updates) return;

  const { error } = await db
    .from("queue_companies")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    alert(`Nao consegui atualizar restaurante: ${error.message}`);
    return;
  }

  await refreshOwnerDashboard();
}

async function createTrialCompany({ restaurantName, ownerName, phone, monthlyPrice }) {
  if (!restaurantName) {
    alert("Informe o nome do restaurante.");
    return;
  }

  const slug = await uniqueCompanySlug(restaurantName);
  const now = new Date();
  const trialEnds = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const adminPin = randomPin();
  const company = {
    ...defaultCompany,
    slug,
    name: restaurantName,
    adminPin,
    ownerStatus: "teste",
    paymentStatus: "pendente",
    contactName: ownerName || "",
    contactPhone: phone || "",
    monthlyPrice: monthlyPrice || "",
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnds.toISOString()
  };

  const { error } = await db.from("queue_companies").insert(toSupabaseCompany(company));
  if (error) {
    alert(`Nao consegui criar restaurante: ${error.message}`);
    return;
  }

  alert(`Teste criado para ${restaurantName}. PIN admin: ${adminPin}`);
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
    if (!isQueueAcceptingEntries()) {
      alert(`A fila esta fechada. Horario: ${state.company.openTime} as ${state.company.closeTime}.`);
      render();
      return;
    }
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
  elements.companyLogoFileInput.addEventListener("change", () => handleBrandFileUpload("logo"));
  elements.companyCoverFileInput.addEventListener("change", () => handleBrandFileUpload("cover"));

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
    queueOpen: elements.queueOpenInput.value === "true",
    openTime: normalizeTime(elements.openTimeInput.value, state.company.openTime),
    closeTime: normalizeTime(elements.closeTimeInput.value, state.company.closeTime),
    logoUrl: normalizeUrl(elements.companyLogoUrlInput.value, state.company.logoUrl),
    coverUrl: normalizeUrl(elements.companyCoverUrlInput.value, state.company.coverUrl),
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

async function handleBrandFileUpload(type) {
  const fileInput = type === "logo" ? elements.companyLogoFileInput : elements.companyCoverFileInput;
  const urlInput = type === "logo" ? elements.companyLogoUrlInput : elements.companyCoverUrlInput;
  const file = fileInput.files?.[0];
  if (!file) return;

  if (!db) {
    alert("Upload precisa do Supabase configurado.");
    fileInput.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Escolha uma imagem.");
    fileInput.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Use uma imagem de ate 5 MB.");
    fileInput.value = "";
    return;
  }

  const previousStatus = elements.brandUploadStatus.textContent;
  elements.brandUploadStatus.textContent = `Enviando ${type === "logo" ? "logo" : "capa"}...`;
  fileInput.disabled = true;

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const path = `${COMPANY_SLUG}/${type}-${Date.now()}-${slugify(file.name)}.${extension}`;
  const { error } = await db.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type
  });

  fileInput.disabled = false;
  fileInput.value = "";

  if (error) {
    elements.brandUploadStatus.textContent = previousStatus;
    alert(`Nao consegui enviar imagem: ${error.message}`);
    return;
  }

  const { data } = db.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  urlInput.value = data.publicUrl;
  elements.brandUploadStatus.textContent = "Imagem enviada. Clique em Salvar configuracao para aplicar no restaurante.";
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
  renderCompanyBrand();
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
  elements.queueOpenInput.value = String(state.company.queueOpen);
  elements.openTimeInput.value = state.company.openTime;
  elements.closeTimeInput.value = state.company.closeTime;
  elements.companyLogoUrlInput.value = state.company.logoUrl || "";
  elements.companyCoverUrlInput.value = state.company.coverUrl || "";
}

function renderCompanyBrand() {
  const coverUrl = normalizeUrl(state.company.coverUrl, defaultCompany.coverUrl);
  const logoUrl = normalizeUrl(state.company.logoUrl, "");
  document.documentElement.style.setProperty("--company-cover", `url("${coverUrl.replace(/"/g, "%22")}")`);

  if (logoUrl) {
    elements.companyLogo.src = logoUrl;
    elements.companyLogo.hidden = false;
  } else {
    elements.companyLogo.removeAttribute("src");
    elements.companyLogo.hidden = true;
  }
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
  const acceptingEntries = isQueueAcceptingEntries();
  elements.myTicket.classList.toggle("is-called", ticket?.status === "called");
  elements.myTicket.classList.toggle("is-waiting", ticket?.status === "waiting");
  elements.joinForm.hidden = Boolean(ticket);
  elements.joinForm.classList.toggle("is-closed", !ticket && !acceptingEntries);
  elements.joinForm.querySelectorAll("input, select, button").forEach((control) => {
    control.disabled = !ticket && !acceptingEntries;
  });

  if (!ticket) {
    elements.myTicket.innerHTML = `
      <h2>Minha senha</h2>
      <p class="muted">${queueStatusText()}</p>
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
    elements.publicQueue.innerHTML = `<li class="panel muted">${queueStatusText()}</li>`;
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
    queueOpen: company.queue_open ?? true,
    openTime: company.open_time || "16:00",
    closeTime: company.close_time || "19:00",
    logoUrl: company.logo_url || defaultCompany.logoUrl,
    coverUrl: company.cover_url || defaultCompany.coverUrl,
    dwell2: company.dwell_2,
    dwell4: company.dwell_4,
    dwell6: company.dwell_6,
    themeMode: company.theme_mode || "light",
    accentColor: company.accent_color || "#0d6efd",
    ownerStatus: company.owner_status || "teste",
    paymentStatus: company.payment_status || "pendente",
    contactName: company.contact_name || "",
    contactPhone: company.contact_phone || "",
    monthlyPrice: company.monthly_price || "",
    trialStartedAt: company.trial_started_at || null,
    trialEndsAt: company.trial_ends_at || null
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
    queue_open: company.queueOpen,
    open_time: company.openTime,
    close_time: company.closeTime,
    logo_url: company.logoUrl,
    cover_url: company.coverUrl,
    dwell_2: company.dwell2,
    dwell_4: company.dwell4,
    dwell_6: company.dwell6,
    theme_mode: company.themeMode,
    accent_color: company.accentColor,
    owner_status: company.ownerStatus,
    payment_status: company.paymentStatus,
    contact_name: company.contactName,
    contact_phone: company.contactPhone,
    monthly_price: company.monthlyPrice,
    trial_started_at: company.trialStartedAt,
    trial_ends_at: company.trialEndsAt
  };
}

function loadLocalState() {
  try {
    const stored = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-${COMPANY_SLUG}`));
    return {
      ...defaultState,
      ...stored,
      company: { ...defaultCompany, ...(stored?.company || {}) },
      queue: stored?.queue || []
    };
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

function isQueueAcceptingEntries() {
  if (!isCompanyCommerciallyActive()) return false;
  if (!state.company.queueOpen) return false;
  return isNowWithinWindow(state.company.openTime, state.company.closeTime);
}

function isNowWithinWindow(openTime, closeTime) {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const open = timeToMinutes(openTime);
  const close = timeToMinutes(closeTime);
  if (open === close) return true;
  if (open < close) return current >= open && current < close;
  return current >= open || current < close;
}

function queueStatusText() {
  if (!isCompanyCommerciallyActive()) {
    return "Fila indisponivel no momento. Procure a recepcao do restaurante.";
  }
  if (isQueueAcceptingEntries()) {
    return `Fila aberta das ${state.company.openTime} as ${state.company.closeTime}. Entre na lista para acompanhar a previsao.`;
  }
  return `Fila fechada agora. Atendimento da fila das ${state.company.openTime} as ${state.company.closeTime}.`;
}

function isCompanyCommerciallyActive() {
  if (state.company.ownerStatus === "bloqueado") return false;
  if (state.company.paymentStatus === "pago") return true;
  if (!state.company.trialEndsAt) return true;
  return new Date(state.company.trialEndsAt).getTime() >= Date.now();
}

function normalizeUrl(value, fallback) {
  const candidate = String(value || "").trim();
  if (!candidate) return fallback || "";

  try {
    const url = new URL(candidate, window.location.href);
    if (!["http:", "https:"].includes(url.protocol) && !candidate.startsWith("assets/")) {
      return fallback || "";
    }
    return candidate;
  } catch {
    return fallback || "";
  }
}

function normalizeTime(value, fallback) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || "") ? value : fallback;
}

async function uniqueCompanySlug(name) {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;

  while (db) {
    const { data, error } = await db.from("queue_companies").select("slug").eq("slug", candidate).maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function trialStatus(company) {
  if (!company.trial_ends_at) return "sem data de teste";
  const diff = new Date(company.trial_ends_at).getTime() - Date.now();
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days < 0) return `teste vencido ha ${Math.abs(days)} dia(s)`;
  if (days === 0) return "teste vence hoje";
  return `teste vence em ${days} dia(s)`;
}

function formatDate(value) {
  if (!value) return "sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function timeToMinutes(value) {
  const [hours, minutes] = normalizeTime(value, "00:00").split(":").map(Number);
  return hours * 60 + minutes;
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
  if (["dono", "owner", "master", "central"].includes(mode)) return "dono";
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
