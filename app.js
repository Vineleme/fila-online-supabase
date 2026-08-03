const STORAGE_KEY = "fila-online-state-v2";
const MY_TICKET_KEY = "fila-online-my-ticket-v2";
const ASSETS_BUCKET = "fila-ai-assets";
const OWNER_PIN_KEY = "fila-ai-owner-pin";
const DEFAULT_OWNER_PIN = "7890";

const params = new URLSearchParams(window.location.search);
const COMPANY_SLUG = slugify(params.get("empresa") || "restaurante-demo");
const TRIAL_TOKEN = (params.get("token") || "").trim();
const ACCESS_MODE = normalizeAccessMode(params.get("modo") || params.get("tela") || params.get("view") || (TRIAL_TOKEN ? "ativar" : ""));

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
  trialEndsAt: null,
  menuEnabled: false,
  menuTitle: "Cardápio do restaurante",
  menuPdfUrl: ""
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
  activationShell: document.querySelector("#activationShell"),
  activationForm: document.querySelector("#activationForm"),
  activationRestaurantInput: document.querySelector("#activationRestaurantInput"),
  activationOwnerInput: document.querySelector("#activationOwnerInput"),
  activationPhoneInput: document.querySelector("#activationPhoneInput"),
  activationMessage: document.querySelector("#activationMessage"),
  activationResult: document.querySelector("#activationResult"),
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
  ownerTrialDaysInput: document.querySelector("#ownerTrialDaysInput"),
  ownerCurrentPinInput: document.querySelector("#ownerCurrentPinInput"),
  ownerNewPinInput: document.querySelector("#ownerNewPinInput"),
  ownerChangePinButton: document.querySelector("#ownerChangePinButton"),
  ownerPinMessage: document.querySelector("#ownerPinMessage"),
  ownerRequestsList: document.querySelector("#ownerRequestsList"),
  ownerCompaniesList: document.querySelector("#ownerCompaniesList"),
  ownerTokensList: document.querySelector("#ownerTokensList"),
  ownerBillingList: document.querySelector("#ownerBillingList"),
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
  billingTitle: document.querySelector("#billingTitle"),
  billingStatusText: document.querySelector("#billingStatusText"),
  billingRequestForm: document.querySelector("#billingRequestForm"),
  billingPlanInput: document.querySelector("#billingPlanInput"),
  billingRequestMessage: document.querySelector("#billingRequestMessage"),
  logoutButton: document.querySelector("#logoutButton"),
  companyNameInput: document.querySelector("#companyNameInput"),
  companyLogoUrlInput: document.querySelector("#companyLogoUrlInput"),
  companyCoverUrlInput: document.querySelector("#companyCoverUrlInput"),
  companyLogoFileInput: document.querySelector("#companyLogoFileInput"),
  companyCoverFileInput: document.querySelector("#companyCoverFileInput"),
  brandUploadStatus: document.querySelector("#brandUploadStatus"),
  adminCurrentPinInput: document.querySelector("#adminCurrentPinInput"),
  adminNewPinInput: document.querySelector("#adminNewPinInput"),
  changeAdminPinButton: document.querySelector("#changeAdminPinButton"),
  adminPinMessage: document.querySelector("#adminPinMessage"),
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
  menuEnabledInput: document.querySelector("#menuEnabledInput"),
  menuTitleInput: document.querySelector("#menuTitleInput"),
  menuPdfUrlInput: document.querySelector("#menuPdfUrlInput"),
  menuPdfFileInput: document.querySelector("#menuPdfFileInput"),
  menuUploadStatus: document.querySelector("#menuUploadStatus"),
  clientMenuPanel: document.querySelector("#clientMenuPanel"),
  clientMenuLink: document.querySelector("#clientMenuLink"),
  clientMenuTitle: document.querySelector("#clientMenuTitle"),
  queueQrImage: document.querySelector("#queueQrImage"),
  copyQueueLinkButton: document.querySelector("#copyQueueLinkButton"),
  openQueueLinkButton: document.querySelector("#openQueueLinkButton"),
  saveMenuSettingsButton: document.querySelector("#saveMenuSettingsButton"),
  adminSupportLink: document.querySelector("#adminSupportLink"),
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

  if (ACCESS_MODE === "ativar") {
    elements.landingPage.hidden = true;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = true;
    elements.activationShell.hidden = false;
    document.documentElement.dataset.theme = "landing";
    bindActivationEvents();
    loadActivationToken();
    return;
  }

  if (ACCESS_MODE === "dono") {
    elements.landingPage.hidden = true;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = false;
    elements.activationShell.hidden = true;
    document.documentElement.dataset.theme = "landing";
    bindOwnerEvents();
    return;
  }

  if (!ACCESS_MODE) {
    elements.landingPage.hidden = false;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = true;
    elements.activationShell.hidden = true;
    document.documentElement.dataset.theme = "landing";
    return;
  }

  elements.landingPage.hidden = true;
  elements.ownerShell.hidden = true;
  elements.activationShell.hidden = true;
  elements.appShell.hidden = false;
  bindEvents();
  applyAccessMode();
  render();

  if (db) {
    refreshFromSupabase();
    subscribeToRealtime();
  }
}

function bindActivationEvents() {
  elements.activationForm.addEventListener("submit", activateTrialToken);
}

function bindLandingEvents() {
  if (!elements.trialRequestForm) return;

  elements.trialRequestForm.addEventListener("submit", submitTrialRequest);
}

function getOwnerPin() {
  return localStorage.getItem(OWNER_PIN_KEY) || DEFAULT_OWNER_PIN;
}

function changeOwnerPin() {
  const current = elements.ownerCurrentPinInput.value.trim();
  const next = elements.ownerNewPinInput.value.trim();
  if (current !== getOwnerPin()) {
    elements.ownerPinMessage.textContent = "PIN atual incorreto.";
    return;
  }
  if (!/^\d{4,8}$/.test(next)) {
    elements.ownerPinMessage.textContent = "Use um PIN de 4 a 8 números.";
    return;
  }
  localStorage.setItem(OWNER_PIN_KEY, next);
  elements.ownerCurrentPinInput.value = "";
  elements.ownerNewPinInput.value = "";
  elements.ownerPinMessage.textContent = "PIN do dono alterado neste navegador.";
}

function bindOwnerEvents() {
  elements.ownerLoginButton.addEventListener("click", () => {
    if (elements.ownerPinInput.value.trim() !== getOwnerPin()) {
      alert("PIN do dono incorreto.");
      return;
    }
    elements.ownerLoginPanel.hidden = true;
    elements.ownerPanel.hidden = false;
    refreshOwnerDashboard();
  });

  elements.ownerRefreshButton.addEventListener("click", refreshOwnerDashboard);
  elements.ownerChangePinButton?.addEventListener("click", changeOwnerPin);
  elements.ownerCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await createTrialToken({
      restaurantName: elements.ownerCompanyNameInput.value.trim(),
      phone: elements.ownerCompanyPhoneInput.value.trim(),
      trialDays: elements.ownerTrialDaysInput.value.trim()
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
    elements.trialRequestMessage.textContent = "Banco indisponível agora. Me chame no WhatsApp para liberar o teste.";
    return;
  }

  const { error } = await db.from("trial_requests").insert(request);
  if (error) {
    elements.trialRequestMessage.textContent = `Não consegui enviar: ${error.message}`;
    return;
  }

  elements.trialRequestForm.reset();
  elements.trialRequestMessage.textContent = "Pedido recebido. Você vai liberar o teste pela central do dono.";
}

async function refreshOwnerDashboard() {
  if (!db) {
    elements.ownerRequestsList.innerHTML = `<p class="muted">Supabase não configurado.</p>`;
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Supabase não configurado.</p>`;
    return;
  }

  const [
    { data: requests, error: requestsError },
    { data: companies, error: companiesError },
    { data: tokens, error: tokensError },
    { data: billing, error: billingError }
  ] = await Promise.all([
    db.from("trial_requests").select("*").order("created_at", { ascending: false }),
    db.from("queue_companies").select("*").order("created_at", { ascending: false }),
    db.from("trial_tokens").select("*").order("created_at", { ascending: false }),
    db.from("subscription_requests").select("*").order("created_at", { ascending: false })
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

  if (tokensError) {
    elements.ownerTokensList.innerHTML = `<p class="muted">Erro: ${escapeHtml(tokensError.message)}</p>`;
  } else {
    renderOwnerTokens(tokens || []);
  }

  if (billingError) {
    elements.ownerBillingList.innerHTML = `<p class="muted">Erro: ${escapeHtml(billingError.message)}</p>`;
  } else {
    renderOwnerBilling(billing || []);
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
        <small>${escapeHtml(request.city || "cidade não informada")} - ${formatDate(request.created_at)}</small>
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
    const contactDigits = whatsappPhone(company.contact_phone);
    const notifyMessage = encodeURIComponent(`Sua página do FILA AÍ está funcionando.\n\nAdministrador: ${adminUrl}\nFila do cliente: ${filaUrl}\nPIN do administrador: ${company.admin_pin || "1234"}`);
    const notifyUrl = contactDigits ? `https://api.whatsapp.com/send?phone=${contactDigits}&text=${notifyMessage}` : "";
    return `
      <article class="owner-company owner-item">
        <div>
          <strong>${escapeHtml(company.name)}</strong>
          <span>${escapeHtml(company.owner_status || "teste")} - ${escapeHtml(company.payment_status || "pagamento pendente")} - ${trial}</span>
          <small>PIN do administrador: ${escapeHtml(company.admin_pin || "1234")} - identificador do link: ${escapeHtml(company.slug)}</small>
        </div>
        <div class="link-stack">
          <a href="${adminUrl}" target="_blank" rel="noreferrer">Administrador</a>
          <a href="${filaUrl}" target="_blank" rel="noreferrer">Fila do cliente</a>
          ${notifyUrl ? `<a href="${notifyUrl}" target="_blank" rel="noreferrer">Avisar cliente</a>` : ""}
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

function renderOwnerTokens(tokens) {
  if (!tokens.length) {
    elements.ownerTokensList.innerHTML = `<p class="muted">Nenhum token gerado ainda.</p>`;
    return;
  }

  const origin = window.location.origin + window.location.pathname;
  elements.ownerTokensList.innerHTML = tokens.map((token) => {
    const activationUrl = `${origin}?token=${encodeURIComponent(token.token)}`;
    const status = token.used_at ? `usado em ${formatDate(token.used_at)}` : "ainda não usado";
    const countdown = token.trial_ends_at ? trialStatus({ trial_ends_at: token.trial_ends_at }) : `${token.trial_days || 7} dias após ativar`;
    return `
      <article class="owner-item">
        <div>
          <strong>${escapeHtml(token.restaurant_name || "Token livre")}</strong>
          <span>${escapeHtml(status)} - ${escapeHtml(countdown)}</span>
          <small>${escapeHtml(token.token)} ${token.activated_slug ? `- restaurante ativado: ${escapeHtml(token.activated_slug)}` : ""}</small>
        </div>
        <div class="link-stack">
          <a href="${activationUrl}" target="_blank" rel="noreferrer">Abrir token</a>
          <button type="button" data-token-copy="${activationUrl}">Copiar link</button>
          ${token.used_at ? "" : `<button type="button" data-token-action="cancel" data-token="${escapeHtml(token.token)}">Cancelar</button>`}
        </div>
      </article>
    `;
  }).join("");

  elements.ownerTokensList.querySelectorAll("[data-token-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.tokenCopy);
      button.textContent = "Copiado";
    });
  });

  elements.ownerTokensList.querySelectorAll("[data-token-action]").forEach((button) => {
    button.addEventListener("click", () => handleOwnerTokenAction(button));
  });
}

function renderOwnerBilling(requests) {
  if (!requests.length) {
    elements.ownerBillingList.innerHTML = `<p class="muted">Nenhum pedido de plano ainda.</p>`;
    return;
  }

  elements.ownerBillingList.innerHTML = requests.map((request) => `
    <article class="owner-item">
      <div>
        <strong>${escapeHtml(request.company_name || request.company_slug)}</strong>
        <span>Plano ${escapeHtml(planLabel(request.plan))} - ${escapeHtml(statusLabel(request.status || "novo"))}</span>
        <small>${escapeHtml(request.contact_phone || "sem telefone")} - ${formatDate(request.created_at)}</small>
      </div>
      <div class="owner-actions">
        <button type="button" data-billing-action="paid" data-billing-id="${request.id}" data-billing-slug="${escapeHtml(request.company_slug)}">Marcar pago</button>
        <button type="button" data-billing-action="contacted" data-billing-id="${request.id}">Contatado</button>
      </div>
    </article>
  `).join("");

  elements.ownerBillingList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleOwnerBillingAction(button));
  });
}

async function handleOwnerRequestAction(button) {
  const action = button.dataset.ownerAction;
  if (action === "contact") {
    const digits = whatsappPhone(button.dataset.phone);
    if (!digits) return alert("Esse pedido não tem telefone.");
    window.open(`https://api.whatsapp.com/send?phone=${digits}`, "_blank", "noopener");
    return;
  }

  const requestId = button.dataset.requestId;
  const { data: request, error } = await db.from("trial_requests").select("*").eq("id", requestId).single();
  if (error) {
    alert(`Não consegui abrir pedido: ${error.message}`);
    return;
  }

  await createTrialToken({
    restaurantName: request.restaurant_name,
    phone: request.phone,
    trialDays: 7
  });

  await db.from("trial_requests").update({ status: "token gerado" }).eq("id", requestId);
  await refreshOwnerDashboard();
}

async function handleOwnerTokenAction(button) {
  if (button.dataset.tokenAction !== "cancel") return;
  const { error } = await db
    .from("trial_tokens")
    .update({ status: "cancelado", updated_at: new Date().toISOString() })
    .eq("token", button.dataset.token)
    .is("used_at", null);

  if (error) {
    alert(`Não consegui cancelar token: ${error.message}`);
    return;
  }

  await refreshOwnerDashboard();
}

async function handleOwnerBillingAction(button) {
  const id = button.dataset.billingId;
  const action = button.dataset.billingAction;
  const status = action === "paid" ? "pago" : "contatado";
  const { error } = await db
    .from("subscription_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    alert(`Não consegui atualizar pedido: ${error.message}`);
    return;
  }

  if (action === "paid") {
    await db
      .from("queue_companies")
      .update({ owner_status: "ativo", payment_status: "pago", updated_at: new Date().toISOString() })
      .eq("slug", button.dataset.billingSlug);
  }

  await refreshOwnerDashboard();
}

async function createTrialToken({ restaurantName, phone, trialDays }) {
  if (!db) return alert("Supabase não configurado.");

  const days = clamp(Number(trialDays || 7), 1, 30);
  const token = generateToken();
  const { error } = await db.from("trial_tokens").insert({
    token,
    restaurant_name: restaurantName || "",
    phone: phone || "",
    trial_days: days,
    status: "novo"
  });

  if (error) {
    alert(`Não consegui gerar token: ${error.message}`);
    return;
  }

  const link = `${window.location.origin + window.location.pathname}?token=${encodeURIComponent(token)}`;
  await navigator.clipboard.writeText(link).catch(() => {});
  alert(`Token gerado e link copiado: ${link}`);
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
    alert(`Não consegui atualizar restaurante: ${error.message}`);
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
    alert(`Não consegui criar restaurante: ${error.message}`);
    return;
  }

  alert(`Teste criado para ${restaurantName}. PIN do administrador: ${adminPin}`);
}

async function loadActivationToken() {
  if (!TRIAL_TOKEN) {
    elements.activationForm.hidden = true;
    elements.activationMessage.textContent = "Token não informado.";
    return;
  }

  if (!db) {
    elements.activationForm.hidden = true;
    elements.activationMessage.textContent = "Banco indisponível. Fale com o FILA AÍ para ativar seu teste.";
    return;
  }

  const { data: token, error } = await db.from("trial_tokens").select("*").eq("token", TRIAL_TOKEN).maybeSingle();
  if (error || !token) {
    elements.activationForm.hidden = true;
    elements.activationMessage.textContent = "Token inválido ou não encontrado.";
    return;
  }

  if (token.status === "cancelado") {
    elements.activationForm.hidden = true;
    elements.activationMessage.textContent = "Este token foi cancelado.";
    return;
  }

  if (token.used_at && token.activated_slug) {
    elements.activationForm.hidden = true;
    renderActivationLinks(token.activated_slug, token.admin_pin, token.trial_ends_at);
    return;
  }

  elements.activationRestaurantInput.value = token.restaurant_name || "";
  elements.activationPhoneInput.value = token.phone || "";
  elements.activationMessage.textContent = `Token pronto. O teste de ${token.trial_days || 7} dias começa ao ativar.`;
}

async function activateTrialToken(event) {
  event.preventDefault();

  const restaurantName = elements.activationRestaurantInput.value.trim();
  const ownerName = elements.activationOwnerInput.value.trim();
  const phone = elements.activationPhoneInput.value.trim();
  if (!restaurantName || !hasFullName(ownerName) || phone.length < 8) {
    elements.activationMessage.textContent = "Preencha restaurante, responsável e WhatsApp.";
    return;
  }

  const { data: token, error } = await db.from("trial_tokens").select("*").eq("token", TRIAL_TOKEN).maybeSingle();
  if (error || !token || token.status === "cancelado") {
    elements.activationMessage.textContent = "Token inválido, cancelado ou indisponível.";
    return;
  }

  if (token.used_at && token.activated_slug) {
    renderActivationLinks(token.activated_slug, token.admin_pin, token.trial_ends_at);
    return;
  }

  const slug = await uniqueCompanySlug(restaurantName);
  const now = new Date();
  const days = clamp(Number(token.trial_days || 7), 1, 30);
  const trialEnds = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const adminPin = randomPin();
  const company = {
    ...defaultCompany,
    slug,
    name: restaurantName,
    adminPin,
    ownerStatus: "teste",
    paymentStatus: "pendente",
    contactName: ownerName,
    contactPhone: phone,
    monthlyPrice: "",
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnds.toISOString()
  };

  const { error: companyError } = await db.from("queue_companies").insert(toSupabaseCompany(company));
  if (companyError) {
    elements.activationMessage.textContent = `Não consegui criar restaurante: ${companyError.message}`;
    return;
  }

  const { error: tokenError } = await db
    .from("trial_tokens")
    .update({
      status: "usado",
      used_at: now.toISOString(),
      trial_started_at: now.toISOString(),
      trial_ends_at: trialEnds.toISOString(),
      activated_slug: slug,
      admin_pin: adminPin,
      restaurant_name: restaurantName,
      owner_name: ownerName,
      phone,
      updated_at: now.toISOString()
    })
    .eq("token", TRIAL_TOKEN)
    .is("used_at", null);

  if (tokenError) {
    elements.activationMessage.textContent = `Restaurante criado, mas o token não atualizou: ${tokenError.message}`;
    return;
  }

  elements.activationForm.hidden = true;
  renderActivationLinks(slug, adminPin, trialEnds.toISOString());
}

function renderActivationLinks(slug, adminPin, trialEndsAt) {
  const origin = window.location.origin + window.location.pathname;
  const adminUrl = `${origin}?empresa=${encodeURIComponent(slug)}&modo=admin`;
  const filaUrl = `${origin}?empresa=${encodeURIComponent(slug)}&modo=fila`;
  elements.activationResult.hidden = false;
  elements.activationResult.innerHTML = `
    <strong>Teste ativado</strong>
    <span>${trialStatus({ trial_ends_at: trialEndsAt })}</span>
    <small>PIN do administrador: ${escapeHtml(adminPin || "1234")}</small>
    <a href="${adminUrl}">Abrir painel administrador</a>
    <a href="${filaUrl}">Abrir fila do cliente</a>
  `;
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
      alert(`A fila está fechada. Horário: ${state.company.openTime} às ${state.company.closeTime}.`);
      render();
      return;
    }
    if (!hasFullName(name)) {
      alert("Digite nome e sobrenome para entrar na fila.");
      elements.nameInput.focus();
      return;
    }
    if (getMyTicket()) {
      alert("Este aparelho já tem uma senha ativa na fila.");
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
        alert(`Não consegui cadastrar: ${error.message}`);
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
  elements.billingRequestForm.addEventListener("submit", submitBillingRequest);
  elements.companyLogoFileInput.addEventListener("change", () => handleBrandFileUpload("logo"));
  elements.companyCoverFileInput.addEventListener("change", () => handleBrandFileUpload("cover"));
  elements.menuPdfFileInput?.addEventListener("change", handleMenuPdfUpload);
  elements.saveMenuSettingsButton?.addEventListener("click", saveMenuSettings);
  elements.copyQueueLinkButton?.addEventListener("click", copyQueueLink);
  elements.changeAdminPinButton?.addEventListener("click", changeAdminPin);

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

  document.documentElement.dataset.accessMode = ACCESS_MODE;
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
    accentColor: "#0d6efd",
    menuEnabled: elements.menuEnabledInput?.checked || false,
    menuTitle: elements.menuTitleInput?.value.trim() || state.company.menuTitle || "Cardápio do restaurante",
    menuPdfUrl: normalizeUrl(elements.menuPdfUrlInput?.value, state.company.menuPdfUrl)
  };

  state.company = company;
  state.avgMinutes = Math.round((company.dwell2 + company.dwell4 + company.dwell6) / 3);

  if (db) {
    const { error } = await db
      .from("queue_companies")
      .update({ ...toSupabaseCompany(company), updated_at: new Date().toISOString() })
      .eq("slug", COMPANY_SLUG);

    if (error) {
      alert(`Não consegui salvar: ${error.message}`);
      return;
    }
    await refreshFromSupabase();
  } else {
    persistLocalState();
  }

  render();
}

async function saveMenuSettings() {
  const company = {
    ...state.company,
    menuEnabled: Boolean(elements.menuEnabledInput.checked),
    menuTitle: elements.menuTitleInput.value.trim() || "Cardápio do restaurante",
    menuPdfUrl: normalizeUrl(elements.menuPdfUrlInput.value, "")
  };

  state.company = company;

  if (db) {
    const { error } = await db
      .from("queue_companies")
      .update({
        menu_enabled: company.menuEnabled,
        menu_title: company.menuTitle,
        menu_pdf_url: company.menuPdfUrl,
        updated_at: new Date().toISOString()
      })
      .eq("slug", COMPANY_SLUG);

    if (error) {
      elements.menuUploadStatus.textContent = `Não consegui salvar: ${error.message}`;
      return;
    }
    await refreshFromSupabase();
  } else {
    persistLocalState();
    render();
  }

  elements.menuUploadStatus.textContent = "Menu salvo. O botão aparece na fila quando estiver ativo e com PDF cadastrado.";
}

async function handleMenuPdfUpload() {
  const file = elements.menuPdfFileInput.files?.[0];
  if (!file) return;

  if (!db) {
    alert("Upload precisa do Supabase configurado.");
    elements.menuPdfFileInput.value = "";
    return;
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    alert("Escolha um arquivo PDF.");
    elements.menuPdfFileInput.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Use um PDF de até 10 MB.");
    elements.menuPdfFileInput.value = "";
    return;
  }

  elements.menuUploadStatus.textContent = "Enviando PDF...";
  elements.menuPdfFileInput.disabled = true;

  const path = `${COMPANY_SLUG}/menu-${Date.now()}-${slugify(file.name)}.pdf`;
  const { error } = await db.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: "application/pdf"
  });

  elements.menuPdfFileInput.disabled = false;
  elements.menuPdfFileInput.value = "";

  if (error) {
    elements.menuUploadStatus.textContent = `Não consegui enviar PDF: ${error.message}`;
    return;
  }

  const { data } = db.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  elements.menuPdfUrlInput.value = data.publicUrl;
  elements.menuUploadStatus.textContent = "PDF enviado. Clique em Salvar menu para publicar.";
}

async function copyQueueLink() {
  await navigator.clipboard.writeText(queueLink()).catch(() => {});
  elements.copyQueueLinkButton.textContent = "Link copiado";
  setTimeout(() => {
    elements.copyQueueLinkButton.textContent = "Copiar link da fila";
  }, 1800);
}

async function changeAdminPin() {
  const current = elements.adminCurrentPinInput.value.trim();
  const next = elements.adminNewPinInput.value.trim();
  if (current !== state.company.adminPin) {
    elements.adminPinMessage.textContent = "PIN atual incorreto.";
    return;
  }
  if (!/^\d{4,8}$/.test(next)) {
    elements.adminPinMessage.textContent = "Use um PIN de 4 a 8 números.";
    return;
  }

  state.company.adminPin = next;
  if (db) {
    const { error } = await db
      .from("queue_companies")
      .update({ admin_pin: next, updated_at: new Date().toISOString() })
      .eq("slug", COMPANY_SLUG);
    if (error) {
      elements.adminPinMessage.textContent = `Não consegui alterar: ${error.message}`;
      return;
    }
    await refreshFromSupabase();
  } else {
    persistLocalState();
  }

  elements.adminCurrentPinInput.value = "";
  elements.adminNewPinInput.value = "";
  elements.pinInput.value = next;
  elements.adminPinMessage.textContent = "PIN administrativo alterado.";
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
    alert("Use uma imagem de até 5 MB.");
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
    alert(`Não consegui enviar imagem: ${error.message}`);
    return;
  }

  const { data } = db.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  urlInput.value = data.publicUrl;
  elements.brandUploadStatus.textContent = "Imagem enviada. Clique em Salvar configuração para aplicar no restaurante.";
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
      alert(`Não consegui adicionar: ${error.message}`);
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
      alert(`Não consegui chamar: ${error.message}`);
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
      alert(`Não consegui finalizar: ${error.message}`);
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
      alert(`Não consegui limpar: ${error.message}`);
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
        alert("Não há mesa livre para esse tamanho de grupo.");
        return;
      }

      const { error } = await db
        .from("queue_tickets")
        .update({ status: "called", called_at: new Date().toISOString() })
        .eq("id", id);
      if (error) {
        alert(`Não consegui chamar: ${error.message}`);
        return;
      }
      await changeUsedTables(partyBucket(ticket.partySize), 1);
      playCallSound();
      notifyCalled(ticket);
    }

    if (action === "done") {
      const { error } = await db.from("queue_tickets").update({ status: "done" }).eq("id", id);
      if (error) {
        alert(`Não consegui finalizar: ${error.message}`);
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
      if (error) alert(`Não consegui remover: ${error.message}`);
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
      alert("Não há mesa livre para esse tamanho de grupo.");
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
  document.documentElement.dataset.accessMode = ACCESS_MODE || "";
  renderCompanyBrand();
  const canCallNext = waitingTickets.some((ticket) => tableAvailabilityFor(partyBucket(ticket.partySize)).available > 0);
  elements.callNextButton.disabled = !canCallNext;
  elements.callNextButton.classList.toggle("is-ready", canCallNext);
  elements.finishCalledButton.disabled = !current;
  applyTheme();
  updateTopLabel();

  renderCalledBanner();
  renderBillingStatus();
  renderClientMenu();
  renderQueueQr();
  renderMyTicket();
  renderPublicQueue();
  renderAdminQueue();
  renderTableStatus();
}

function renderBillingStatus() {
  if (!elements.billingStatusText) return;

  const trialText = state.company.trialEndsAt
    ? trialStatus({ trial_ends_at: state.company.trialEndsAt })
    : "sem periodo de teste definido";
  const payment = state.company.paymentStatus || "pendente";
  const ownerStatus = state.company.ownerStatus || "teste";

  elements.billingStatusText.textContent = `Status: ${ownerStatus}. Pagamento: ${payment}. ${trialText}.`;
  elements.billingRequestForm.hidden = payment === "pago" || ownerStatus === "ativo";
  elements.billingRequestMessage.textContent = payment === "pago"
    ? "Plano ativo. Obrigado por continuar usando o FILA AÍ."
    : "";
}

async function submitBillingRequest(event) {
  event.preventDefault();

  if (!db) {
    elements.billingRequestMessage.textContent = "Supabase indisponível. Fale com o FILA AÍ pelo WhatsApp.";
    return;
  }

  const payload = {
    company_slug: state.company.slug,
    company_name: state.company.name,
    contact_phone: state.company.contactPhone || "",
    plan: elements.billingPlanInput.value,
    status: "novo"
  };

  const { error } = await db.from("subscription_requests").insert(payload);
  if (error) {
    elements.billingRequestMessage.textContent = `Não consegui enviar: ${error.message}`;
    return;
  }

  await db
    .from("queue_companies")
    .update({ payment_status: "solicitado", updated_at: new Date().toISOString() })
    .eq("slug", state.company.slug);

  elements.billingRequestMessage.textContent = "Pedido enviado. O FILA AÍ vai chamar você para finalizar o pagamento.";
  await refreshFromSupabase();
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
  if (elements.menuEnabledInput) elements.menuEnabledInput.checked = Boolean(state.company.menuEnabled);
  if (elements.menuTitleInput) elements.menuTitleInput.value = state.company.menuTitle || "Cardápio do restaurante";
  if (elements.menuPdfUrlInput) elements.menuPdfUrlInput.value = state.company.menuPdfUrl || "";
}

function renderClientMenu() {
  if (!elements.clientMenuPanel) return;
  const menuUrl = normalizeUrl(state.company.menuPdfUrl, "");
  const showMenu = Boolean(state.company.menuEnabled && menuUrl);
  elements.clientMenuPanel.hidden = !showMenu;
  if (!showMenu) return;
  elements.clientMenuLink.href = menuUrl;
  elements.clientMenuTitle.textContent = state.company.menuTitle || "Cardápio do restaurante";
}

function renderQueueQr() {
  if (!elements.queueQrImage || !elements.openQueueLinkButton) return;
  const filaUrl = queueLink();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(filaUrl)}`;
  elements.queueQrImage.src = qrUrl;
  elements.openQueueLinkButton.href = filaUrl;
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
  elements.calledService.textContent = "Você tem 10 minutos para comparecer à recepção. Fique atento.";
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
  const statusText = ticket.status === "called" ? "Sua vez chegou" : ticket.status === "done" ? "Finalizado" : "Aguardando";
  const calledNotice = ticket.status === "called"
    ? `<p class="called-note">Sua vez chegou. Você tem 10 minutos para comparecer à recepção.</p>`
    : "";

  elements.myTicket.innerHTML = `
    <h2>Minha senha</h2>
    <div class="ticket-number">${formatNumber(ticket.number)}</div>
    ${calledNotice}
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
          <span>${partyLabel(ticket.partySize)} - ${statusLabel(ticket.status)} - ${formatDuration(estimateWait(ticket))}</span>
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
    alert(`Não consegui atualizar mesas: ${error.message}`);
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
    trialEndsAt: company.trial_ends_at || null,
    menuEnabled: company.menu_enabled || false,
    menuTitle: company.menu_title || "Cardápio do restaurante",
    menuPdfUrl: company.menu_pdf_url || ""
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
    trial_ends_at: company.trialEndsAt,
    menu_enabled: company.menuEnabled || false,
    menu_title: company.menuTitle || "Cardápio do restaurante",
    menu_pdf_url: company.menuPdfUrl || ""
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
    return "Fila indisponível no momento. Procure a recepção do restaurante.";
  }
  if (isQueueAcceptingEntries()) {
    return `Fila aberta das ${state.company.openTime} às ${state.company.closeTime}. Entre na lista para acompanhar a previsão.`;
  }
  return `Reservas indisponíveis no momento. Tente novamente no próximo horário de atendimento, das ${state.company.openTime} às ${state.company.closeTime}. Obrigado.`;
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

function whatsappPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function queueLink() {
  return `${window.location.origin + window.location.pathname}?empresa=${encodeURIComponent(COMPANY_SLUG)}&modo=fila`;
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

function generateToken() {
  const random = crypto.getRandomValues(new Uint32Array(2));
  return `fila-${Date.now().toString(36)}-${Array.from(random, (part) => part.toString(36)).join("")}`;
}

function trialStatus(company) {
  if (!company.trial_ends_at) return "sem data de teste";
  const diff = new Date(company.trial_ends_at).getTime() - Date.now();
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days < 0) return `teste vencido há ${Math.abs(days)} dia(s)`;
  if (days === 0) return "teste vence hoje";
  return `teste vence em ${days} dia(s)`;
}

function statusLabel(status) {
  const labels = {
    active: "ativo",
    blocked: "bloqueado",
    called: "Chamado",
    contacted: "contatado",
    done: "Finalizado",
    new: "novo",
    novo: "novo",
    paid: "pago",
    pending: "pendente",
    teste: "teste",
    waiting: "Aguardando"
  };
  return labels[status] || status || "novo";
}

function planLabel(plan) {
  const labels = {
    anual: "anual",
    mensal: "mensal",
    yearly: "anual",
    monthly: "mensal"
  };
  return labels[plan] || plan || "mensal";
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
  if (["ativar", "activate", "token", "teste"].includes(mode)) return "ativar";
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
