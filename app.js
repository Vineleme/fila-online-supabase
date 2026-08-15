const STORAGE_KEY = "fila-online-state-v2";
const MY_TICKET_KEY = "fila-online-my-ticket-v2";
const ASSETS_BUCKET = "fila-ai-assets";
const ADMIN_AUTH_PREFIX = "fila-ai-admin-auth";
const ADMIN_SAVED_PREFIX = "fila-ai-admin-saved";
const SAVED_ACCESS_KEY = "fila-ai-saved-access";
const OWNER_EMAIL_KEY = "fila-ai-owner-email";
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const IMAGE_UPLOAD_RULES = "Use JPG, PNG ou WebP com ate 5 MB.";
const BRAND_IMAGE_RULES = {
  logo: { minWidth: 400, minHeight: 400, label: "logo", hint: "Use uma imagem quadrada com minimo 400x400 px." },
  cover: { minWidth: 1200, minHeight: 675, label: "capa", hint: "Use uma imagem horizontal com minimo 1200x675 px." }
};
const PROSPECT_STATUS_KEY = "fila-ai-owner-prospect-status";
const OWNER_CUSTOM_PROSPECTS_KEY = "fila-ai-owner-custom-prospects";
const OWNER_PROSPECT_PANEL_KEY = "fila-ai-owner-prospect-panel";
const DEFAULT_BILLING_SETTINGS = {
  pixKey: "48.968.488/0001-71",
  pixName: "Fila Ai",
  bankLink: "https://api.whatsapp.com/send?phone=5511943678179&text=Quero%20receber%20o%20link%20de%20pagamento%20do%20FILA%20AI",
  contractLink: "assets/contracts/Contrato_Anual_FILA_AI.docx"
};
const LEGACY_CONTRACT_LINK = "https://api.whatsapp.com/send?phone=5511943678179&text=Quero%20assinar%20o%20contrato%20anual%20do%20FILA%20AI";
const PLAN_CATALOG = {
  essencial: {
    label: "Essencial",
    monthly: 147,
    yearly: 1470,
    features: "Fila digital, QR Code, painel administrativo e suporte."
  },
  pro: {
    label: "Pro beta",
    monthly: 247,
    yearly: 2470,
    features: "Fila, mesas, cardapio, pedidos, cozinha e comanda simples."
  }
};

const ORDER_STATUS_FLOW = ["new", "preparing", "ready", "delivered"];
const ORDER_STATUS_LABELS = {
  new: "Novo",
  preparing: "Em preparo",
  ready: "Pronto",
  delivered: "Entregue"
};

const LANDING_DEMO_STEPS = [
  {
    kicker: "Entrada digital",
    title: "Cliente escaneia o QR Code",
    badge: "Passo 01",
    metrics: [["QR", "na recepcao"], ["10s", "para entrar"], ["0", "papel"]],
    rows: [
      ["QR", "Mesa da recepcao", "escaneado"],
      ["023", "Marina Costa", "na fila"],
      ["024", "Rafael Lima", "cadastro recebido"]
    ],
    phone: ["Fila aberta", "QR", "toque para entrar", "Entrar na fila"]
  },
  {
    kicker: "Acompanhamento",
    title: "Fila em tempo real",
    badge: "Aberta",
    metrics: [["18", "aguardando"], ["12 min", "estimativa"], ["04", "mesas livres"]],
    rows: [
      ["023", "Marina Costa", "2 pessoas"],
      ["024", "Rafael Lima", "sua vez em breve"],
      ["025", "Bianca Alves", "4 pessoas"]
    ],
    phone: ["Sua vez esta chegando", "05", "grupos na frente", "Detalhes da fila"]
  },
  {
    kicker: "Chamada",
    title: "Cliente chamado e comanda aberta",
    badge: "Passo 03",
    metrics: [["024", "senha chamada"], ["Fila 024", "comanda"], ["novo", "pedido"]],
    rows: [
      ["024", "Rafael Lima", "comanda aberta"],
      ["1x", "Burger da casa", "cozinha"],
      ["1x", "Limonada", "preparo"]
    ],
    phone: ["Atendimento iniciado", "024", "comanda aberta", "Ver cardapio"]
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: "burger-casa",
    name: "Burger da casa",
    category: "Lanches",
    price: 39.9,
    prepMinutes: 18,
    description: "Pao brioche, blend artesanal, queijo e molho da casa.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    active: true
  },
  {
    id: "parmegiana",
    name: "Parmegiana individual",
    category: "Pratos",
    price: 54.9,
    prepMinutes: 24,
    description: "File crocante, molho de tomate, queijo e acompanhamento.",
    imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=900&q=80",
    active: true
  },
  {
    id: "limonada",
    name: "Limonada da casa",
    category: "Bebidas",
    price: 14.9,
    prepMinutes: 5,
    description: "Limao, hortela e gelo batido.",
    imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
    active: true
  }
];

const OWNER_PROSPECTS = [
  ["sp-pecatto", "Pecatto Bar e Restaurante", "SP", "Sao Paulo", "(11) 99772-7738", "Alta", "Reclamacao direta sobre sistema de espera e acomodacao de mesas."],
  ["sp-hannover", "Hannover Fondue", "SP", "Sao Paulo", "(11) 5561-5411", "Alta", "Fila grande, espera longa e falta de previsao em horarios fortes."],
  ["sp-mata-citta", "Mata Citta", "SP", "Sao Paulo", "(11) 99128-0000", "Alta", "Restaurante muito concorrido, com relatos de 1h a 2h de fila."],
  ["sp-aska", "Aska Lamen", "SP", "Sao Paulo", "(11) 3277-9682 / (11) 91600-9682", "Alta", "Fila recorrente na Liberdade, com relatos de espera longa."],
  ["sp-chi-fu", "Chi Fu", "SP", "Sao Paulo", "(11) 3101-8888 / (11) 3112-1698", "Media", "Casa tradicional com alto fluxo e fila recorrente."],
  ["sp-piccini", "Piccini Cucina", "SP", "Sao Paulo", "(11) 92102-8764 / (11) 96481-7877", "Alta", "Reclamacao com fila de espera de aproximadamente 1h."],
  ["sp-mocoto", "Mocoto", "SP", "Sao Paulo", "(11) 2951-3056", "Media", "Casa muito conhecida, com relatos de espera acima de 2h."],
  ["sp-famiglia-mancini", "Famiglia Mancini", "SP", "Sao Paulo", "(11) 3255-6599 / (11) 3256-4320", "Media", "Fila em casa tradicional e turistica, principalmente em pico."],
  ["sp-yono", "Yono Sushi Aclimacao", "SP", "Sao Paulo", "(11) 5539-0022 / (11) 91988-2900", "Media", "Reclamacoes mencionam muita fila de espera na unidade."],
  ["sp-bob-esponja", "Bob Esponja Burguer & Restaurante", "SP", "Sao Paulo", "contato@fanfoodtematicos.com.br", "Alta", "Restaurante tematico oficial, 2 andares, capacidade alta e avaliacoes citam grande fila de espera sem agendamento."],
  ["sp-kuromoon", "KuroMoon", "SP", "Sao Paulo", "(11) 98915-2678", "Alta", "Boteco japones-coreano pequeno e hypado; avaliacoes citam fila grande, 2h de espera e desorganizacao para grupos."],
  ["sp-caco", "Caco", "SP", "Sao Paulo", "(11) 97052-9007", "Alta", "Restaurante do momento em Pinheiros; conteudos citam mesas reservadas, fila de espera e muita exposicao no Instagram."],
  ["sp-mundo-animal", "Mundo Animal Freguesia do O", "SP", "Sao Paulo", "(11) 99999-7725", "Media", "Rede de lanchonete tematica de grande apelo familiar; unidade SP com reservas e alto fluxo em fim de semana."],
  ["rj-lagostinne", "Lagostinne", "RJ", "Rio de Janeiro", "(21) 2466-1617", "Alta", "Reclamacao sobre demora excessiva na fila para conseguir mesa."],
  ["rj-pineapple", "Pineapple Drinkeria", "RJ", "Rio de Janeiro", "(21) 3148-2668 / (21) 97722-1261", "Alta", "Avaliacoes citam fila nominal, espera e revisao do sistema de fila."],
  ["rj-gurume", "Gurume Ipanema", "RJ", "Rio de Janeiro", "(21) 2540-7065 / (21) 99708-9865", "Alta", "Reclamacao sobre quase 1h de espera na fila."],
  ["rj-santa-brasa", "Santa Brasa Pepe", "RJ", "Rio de Janeiro", "(21) 3649-8007", "Media", "Reclamacao de longa fila de espera em operacao de alto volume."],
  ["rj-tower", "Tower Gourmet", "RJ", "Rio de Janeiro", "(21) 3153-7085 / (21) 95935-7710", "Media", "Relatos de fila enorme do lado de fora."],
  ["rj-romanella", "Romanella Grill", "RJ", "Rio de Janeiro", "(21) 2432-5277 / (21) 98548-5886", "Media", "Reclamacao sobre desrespeito a fila de espera."],
  ["rj-agridoce", "Casa Agridoce", "RJ", "Teresopolis", "(21) 99317-0608", "Media", "Conteudos sociais indicam fila frequente e alto fluxo."],
  ["rj-fantastico", "Fantastico Restaurante", "RJ", "Rio de Janeiro", "(21) 99820-5930 / (21) 99735-3154", "Media", "Maior restaurante tematico do RJ, varias unidades e ate 500 pessoas por operacao; ja usa reserva/fila online, bom para abordagem de melhoria ou parceria."],
  ["mg-paladino", "Paladino", "MG", "Belo Horizonte", "(31) 99918-4169 / (31) 99854-7055", "Alta", "Reclamacao sobre fila de espera manipulada."],
  ["mg-xapuri", "Xapuri", "MG", "Belo Horizonte", "(31) 3496-6198", "Alta", "Reclamacoes sobre fila preferencial e desorganizacao."],
  ["mg-porto", "Restaurante do Porto", "MG", "Belo Horizonte", "(31) 3482-9870 / (31) 99773-0550", "Media", "Reclamacao cita fila de espera enorme em feriado."],
  ["mg-popolare", "Popolare Pizza", "MG", "Belo Horizonte", "(31) 99681-9163 / (31) 2180-2727", "Alta", "Reclamacao sobre falta de organizacao na fila de espera."],
  ["mg-porcao", "Porcao BH", "MG", "Belo Horizonte", "(31) 3293-8787", "Media", "Reclamacao de longa espera mesmo com reserva."],
  ["mg-verdemar", "Verdemar Pampulha Cafe", "MG", "Belo Horizonte", "(31) 2391-0010 / (31) 4040-4455", "Media", "Reclamacao sobre demora excessiva no restaurante."],
  ["mg-cae", "Cae Restaurante Bar", "MG", "Belo Horizonte", "(31) 2528-2244", "Media", "Avaliacoes mencionam fila de espera."],
  ["mg-the-house", "The House Food & Fun", "MG", "Belo Horizonte", "(31) 98514-0576", "Media", "Gastrobar tematico geek na Savassi, mais de 180 mil seguidores e avaliacoes recomendam reserva por ficar cheio."],
  ["mg-baby-beef", "Baby Beef BH", "MG", "Belo Horizonte", "(31) 3426-1100", "Media", "Reclamacao menciona grande demanda e fila de espera grande."],
  ["mg-celsinho", "Celsinho Grill", "MG", "Belo Horizonte", "(31) 2515-6762", "Media", "Casa de alto volume com sinais de fila em horarios de pico."]
].map(([id, name, state, city, phone, priority, pain]) => ({ id, name, state, city, phone, priority, pain }));

const params = new URLSearchParams(window.location.search);
const COMPANY_ALIASES = {
  "adriana-turri": "restaurante-demo"
};
const REQUESTED_COMPANY_SLUG = slugify(params.get("empresa") || "restaurante-demo");
const COMPANY_SLUG = COMPANY_ALIASES[REQUESTED_COMPANY_SLUG] || REQUESTED_COMPANY_SLUG;
const TICKET_STORAGE_KEYS = [...new Set([
  `${MY_TICKET_KEY}-${COMPANY_SLUG}`,
  `${MY_TICKET_KEY}-${REQUESTED_COMPANY_SLUG}`
])];
const TICKET_SNAPSHOT_KEYS = TICKET_STORAGE_KEYS.map((key) => `${key}-snapshot`);
const TRIAL_TOKEN = (params.get("token") || "").trim();
const ACCESS_MODE = normalizeAccessMode(params.get("modo") || params.get("tela") || params.get("view") || (TRIAL_TOKEN ? "ativar" : ""));
const ADMIN_TAB = normalizeAdminTab(params.get("aba") || params.get("tab") || params.get("painel") || "");
let companyAvailable = true;

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
  accentColor: "#F97316",
  ownerStatus: "demo",
  paymentStatus: "sem cobranca",
  legalName: "",
  companyDocument: "",
  fiscalAddress: "",
  fiscalCity: "",
  fiscalState: "",
  billingEmail: "",
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
  myTicketId: loadSavedTicketId(),
  queue: [],
  products: DEFAULT_PRODUCTS.map((product) => ({ ...product })),
  orders: [],
  billingSettings: { ...DEFAULT_BILLING_SETTINGS }
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
let cart = [];
let realtimeChannel;
let refreshInFlight = false;
let queuedRefresh = false;
let realtimeFallbackTimer;
let lastClientStage = "";

function loadSavedTicketId() {
  for (const key of TICKET_STORAGE_KEYS) {
    const ticketId = localStorage.getItem(key);
    if (ticketId) return ticketId;
  }
  return null;
}

function loadSavedTicketSnapshot() {
  for (const key of TICKET_SNAPSHOT_KEYS) {
    try {
      const snapshot = JSON.parse(localStorage.getItem(key) || "null");
      if (snapshot?.id) return snapshot;
    } catch {}
  }
  return null;
}

function normalizeSavedTicket(ticket) {
  if (!ticket) return null;
  return {
    id: ticket.id,
    companySlug: ticket.companySlug || ticket.company_slug || COMPANY_SLUG,
    number: Number(ticket.number) || 0,
    name: ticket.name || "",
    service: ticket.service || partyLabel(ticket.partySize || ticket.party_size || 2),
    partySize: Number(ticket.partySize || ticket.party_size) || 2,
    status: ticket.status || "waiting",
    checkRequested: Boolean(ticket.checkRequested || ticket.check_requested),
    createdAt: ticket.createdAt || ticket.created_at || new Date().toISOString(),
    calledAt: ticket.calledAt || ticket.called_at || null,
    savedAt: new Date().toISOString()
  };
}

function saveMyTicketId(ticketId, ticket = null) {
  state.myTicketId = ticketId;
  TICKET_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, ticketId));
  const snapshot = normalizeSavedTicket(ticket || state.queue.find((item) => item.id === ticketId));
  if (snapshot) {
    TICKET_SNAPSHOT_KEYS.forEach((key) => localStorage.setItem(key, JSON.stringify(snapshot)));
  }
}

function clearMyTicketId() {
  state.myTicketId = null;
  TICKET_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  TICKET_SNAPSHOT_KEYS.forEach((key) => localStorage.removeItem(key));
}

const elements = {
  landingPage: document.querySelector("#landingPage"),
  accessShell: document.querySelector("#accessShell"),
  appShell: document.querySelector("#appShell"),
  ownerShell: document.querySelector("#ownerShell"),
  activationShell: document.querySelector("#activationShell"),
  accessForm: document.querySelector("#accessForm"),
  accessUserInput: document.querySelector("#accessUserInput"),
  accessPasswordInput: document.querySelector("#accessPasswordInput"),
  toggleAccessPasswordButton: document.querySelector("#toggleAccessPasswordButton"),
  accessRememberInput: document.querySelector("#accessRememberInput"),
  accessForgotButton: document.querySelector("#accessForgotButton"),
  accessMessage: document.querySelector("#accessMessage"),
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
  ownerEmailInput: document.querySelector("#ownerEmailInput"),
  ownerPasswordInput: document.querySelector("#ownerPasswordInput"),
  ownerRememberInput: document.querySelector("#ownerRememberInput"),
  ownerLoginButton: document.querySelector("#ownerLoginButton"),
  ownerSignupButton: document.querySelector("#ownerSignupButton"),
  ownerForgotButton: document.querySelector("#ownerForgotButton"),
  ownerAiShortcutButton: document.querySelector("#ownerAiShortcutButton"),
  ownerLogoutButton: document.querySelector("#ownerLogoutButton"),
  ownerRefreshButton: document.querySelector("#ownerRefreshButton"),
  ownerCreateForm: document.querySelector("#ownerCreateForm"),
  ownerCompanyNameInput: document.querySelector("#ownerCompanyNameInput"),
  ownerCompanyPhoneInput: document.querySelector("#ownerCompanyPhoneInput"),
  ownerTrialDaysInput: document.querySelector("#ownerTrialDaysInput"),
  ownerAccountForm: document.querySelector("#ownerAccountForm"),
  ownerAccountUserInput: document.querySelector("#ownerAccountUserInput"),
  ownerAccountPasswordInput: document.querySelector("#ownerAccountPasswordInput"),
  ownerAccountNameInput: document.querySelector("#ownerAccountNameInput"),
  ownerAccountLegalNameInput: document.querySelector("#ownerAccountLegalNameInput"),
  ownerAccountDocumentInput: document.querySelector("#ownerAccountDocumentInput"),
  ownerAccountAddressInput: document.querySelector("#ownerAccountAddressInput"),
  ownerAccountCityInput: document.querySelector("#ownerAccountCityInput"),
  ownerAccountStateInput: document.querySelector("#ownerAccountStateInput"),
  ownerAccountContactNameInput: document.querySelector("#ownerAccountContactNameInput"),
  ownerAccountContactPhoneInput: document.querySelector("#ownerAccountContactPhoneInput"),
  ownerAccountBillingEmailInput: document.querySelector("#ownerAccountBillingEmailInput"),
  ownerAccountMessage: document.querySelector("#ownerAccountMessage"),
  ownerAuthMessage: document.querySelector("#ownerAuthMessage"),
  ownerRequestsList: document.querySelector("#ownerRequestsList"),
  ownerRecoveryList: document.querySelector("#ownerRecoveryList"),
  ownerCompaniesList: document.querySelector("#ownerCompaniesList"),
  ownerTokensList: document.querySelector("#ownerTokensList"),
  ownerBillingList: document.querySelector("#ownerBillingList"),
  ownerBillingSettingsForm: document.querySelector("#ownerBillingSettingsForm"),
  ownerPixKeyInput: document.querySelector("#ownerPixKeyInput"),
  ownerPixNameInput: document.querySelector("#ownerPixNameInput"),
  ownerPaymentLinkInput: document.querySelector("#ownerPaymentLinkInput"),
  ownerContractLinkInput: document.querySelector("#ownerContractLinkInput"),
  ownerBillingSettingsMessage: document.querySelector("#ownerBillingSettingsMessage"),
  ownerRequestsBadge: document.querySelector("#ownerRequestsBadge"),
  ownerRecoveryBadge: document.querySelector("#ownerRecoveryBadge"),
  ownerTokensBadge: document.querySelector("#ownerTokensBadge"),
  ownerBillingBadge: document.querySelector("#ownerBillingBadge"),
  ownerAiBadge: document.querySelector("#ownerAiBadge"),
  ownerAiIncidentForm: document.querySelector("#ownerAiIncidentForm"),
  ownerAiTitleInput: document.querySelector("#ownerAiTitleInput"),
  ownerAiModuleInput: document.querySelector("#ownerAiModuleInput"),
  ownerAiSeverityInput: document.querySelector("#ownerAiSeverityInput"),
  ownerAiEnvironmentInput: document.querySelector("#ownerAiEnvironmentInput"),
  ownerAiDescriptionInput: document.querySelector("#ownerAiDescriptionInput"),
  ownerAiExpectedInput: document.querySelector("#ownerAiExpectedInput"),
  ownerAiObservedInput: document.querySelector("#ownerAiObservedInput"),
  ownerAiMessage: document.querySelector("#ownerAiMessage"),
  ownerAiList: document.querySelector("#ownerAiList"),
  ownerCrmTabs: document.querySelectorAll(".owner-crm-tab"),
  ownerTabPanels: document.querySelectorAll(".owner-tab-panel"),
  prospectStateFilter: document.querySelector("#prospectStateFilter"),
  prospectStatusFilter: document.querySelector("#prospectStatusFilter"),
  prospectSearchInput: document.querySelector("#prospectSearchInput"),
  prospectTableBody: document.querySelector("#prospectTableBody"),
  prospectTotalCount: document.querySelector("#prospectTotalCount"),
  prospectHotCount: document.querySelector("#prospectHotCount"),
  prospectContactedCount: document.querySelector("#prospectContactedCount"),
  prospectWonCount: document.querySelector("#prospectWonCount"),
  ownerProspectPanel: document.querySelector("#ownerProspectPanel"),
  ownerProspectToggleButton: document.querySelector("#ownerProspectToggleButton"),
  ownerProspectContent: document.querySelector("#ownerProspectContent"),
  saveProspectsButton: document.querySelector("#saveProspectsButton"),
  prospectSaveMessage: document.querySelector("#prospectSaveMessage"),
  exportProspectsButton: document.querySelector("#exportProspectsButton"),
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
  adminRememberInput: document.querySelector("#adminRememberInput"),
  adminForgotButton: document.querySelector("#adminForgotButton"),
  adminLoginMessage: document.querySelector("#adminLoginMessage"),
  loginButton: document.querySelector("#loginButton"),
  loginPanel: document.querySelector("#loginPanel"),
  adminPanel: document.querySelector("#adminPanel"),
  logoutTopButton: document.querySelector("#logoutTopButton"),
  adminTabs: document.querySelectorAll(".admin-tab"),
  adminTabPanels: document.querySelectorAll(".admin-tab-panel"),
  billingTitle: document.querySelector("#billingTitle"),
  billingStatusText: document.querySelector("#billingStatusText"),
  billingRequestForm: document.querySelector("#billingRequestForm"),
  billingPlanInput: document.querySelector("#billingPlanInput"),
  billingPaymentPanel: document.querySelector("#billingPaymentPanel"),
  billingRequestMessage: document.querySelector("#billingRequestMessage"),
  logoutButton: document.querySelector("#logoutButton"),
  companyNameInput: document.querySelector("#companyNameInput"),
  companyLogoUrlInput: document.querySelector("#companyLogoUrlInput"),
  companyCoverUrlInput: document.querySelector("#companyCoverUrlInput"),
  companyLogoFileInput: document.querySelector("#companyLogoFileInput"),
  companyCoverFileInput: document.querySelector("#companyCoverFileInput"),
  brandUploadStatus: document.querySelector("#brandUploadStatus"),
  companyLegalNameInput: document.querySelector("#companyLegalNameInput"),
  companyDocumentInput: document.querySelector("#companyDocumentInput"),
  companyFiscalAddressInput: document.querySelector("#companyFiscalAddressInput"),
  companyFiscalCityInput: document.querySelector("#companyFiscalCityInput"),
  companyFiscalStateInput: document.querySelector("#companyFiscalStateInput"),
  companyContactNameInput: document.querySelector("#companyContactNameInput"),
  companyContactPhoneInput: document.querySelector("#companyContactPhoneInput"),
  companyBillingEmailInput: document.querySelector("#companyBillingEmailInput"),
  legalConfigMessage: document.querySelector("#legalConfigMessage"),
  adminCurrentPinInput: document.querySelector("#adminCurrentPinInput"),
  adminNewPinInput: document.querySelector("#adminNewPinInput"),
  changeAdminPinButton: document.querySelector("#changeAdminPinButton"),
  suggestAdminPinButton: document.querySelector("#suggestAdminPinButton"),
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
  clientOrderPanel: document.querySelector("#clientOrderPanel"),
  clientProductList: document.querySelector("#clientProductList"),
  orderTableInput: document.querySelector("#orderTableInput"),
  orderCustomerInput: document.querySelector("#orderCustomerInput"),
  cartItems: document.querySelector("#cartItems"),
  cartTotal: document.querySelector("#cartTotal"),
  cartCount: document.querySelector("#cartCount"),
  cartFabTotal: document.querySelector("#cartFabTotal"),
  cartDrawer: document.querySelector("#cartDrawer"),
  cartDrawerToggle: document.querySelector("#cartDrawerToggle"),
  cartDrawerOverlay: document.querySelector("#cartDrawerOverlay"),
  closeCartButton: document.querySelector("#closeCartButton"),
  sendOrderButton: document.querySelector("#sendOrderButton"),
  orderMessage: document.querySelector("#orderMessage"),
  clientOrderStatus: document.querySelector("#clientOrderStatus"),
  productForm: document.querySelector("#productForm"),
  productNameInput: document.querySelector("#productNameInput"),
  productCategoryInput: document.querySelector("#productCategoryInput"),
  productPriceInput: document.querySelector("#productPriceInput"),
  productPrepInput: document.querySelector("#productPrepInput"),
  productDescriptionInput: document.querySelector("#productDescriptionInput"),
  productImageUrlInput: document.querySelector("#productImageUrlInput"),
  productImageFileInput: document.querySelector("#productImageFileInput"),
  adminProductList: document.querySelector("#adminProductList"),
  adminOrdersList: document.querySelector("#adminOrdersList"),
  kitchenBoard: document.querySelector("#kitchenBoard"),
  checksList: document.querySelector("#checksList"),
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

  if (ACCESS_MODE === "acesso") {
    elements.landingPage.hidden = true;
    elements.accessShell.hidden = false;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = true;
    elements.activationShell.hidden = true;
    document.documentElement.dataset.theme = "landing";
    bindAccessEvents();
    return;
  }

  if (ACCESS_MODE === "ativar") {
    elements.landingPage.hidden = true;
    elements.accessShell.hidden = true;
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
    elements.accessShell.hidden = true;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = false;
    elements.activationShell.hidden = true;
    document.documentElement.dataset.theme = "landing";
    bindOwnerEvents();
    return;
  }

  if (!ACCESS_MODE) {
    elements.landingPage.hidden = false;
    elements.accessShell.hidden = true;
    elements.appShell.hidden = true;
    elements.ownerShell.hidden = true;
    elements.activationShell.hidden = true;
    document.documentElement.dataset.theme = "landing";
    return;
  }

  elements.landingPage.hidden = true;
  elements.accessShell.hidden = true;
  elements.ownerShell.hidden = true;
  elements.activationShell.hidden = true;
  elements.appShell.hidden = false;
  bindEvents();
  applyAccessMode();
  render();
  restoreAdminAccess();
  if (ACCESS_MODE === "admin" && ADMIN_TAB) showAdminPanel(ADMIN_TAB, { replaceUrl: true });

  if (db) {
    refreshFromSupabase();
    subscribeToRealtime();
  }
}

function bindActivationEvents() {
  elements.activationForm.addEventListener("submit", activateTrialToken);
}

function bindLandingEvents() {
  setupLandingMockupDemo();
  if (!elements.trialRequestForm) return;

  elements.trialRequestForm.addEventListener("submit", submitTrialRequest);
}

function setupLandingMockupDemo() {
  const mockup = document.querySelector(".hero-product-mockup");
  if (!mockup) return;

  const buttons = [...mockup.querySelectorAll("[data-demo-step]")];
  if (!buttons.length) return;

  let activeStep = 0;
  let timer;

  const showStep = (index) => {
    activeStep = (index + LANDING_DEMO_STEPS.length) % LANDING_DEMO_STEPS.length;
    const step = LANDING_DEMO_STEPS[activeStep];

    mockup.classList.add("is-step-changing");
    window.setTimeout(() => mockup.classList.remove("is-step-changing"), 180);

    setText("[data-demo-kicker]", step.kicker);
    setText("[data-demo-title]", step.title);
    setText("[data-demo-badge]", step.badge);
    setText("[data-demo-metric-one]", step.metrics[0][0]);
    setText("[data-demo-label-one]", step.metrics[0][1]);
    setText("[data-demo-metric-two]", step.metrics[1][0]);
    setText("[data-demo-label-two]", step.metrics[1][1]);
    setText("[data-demo-metric-three]", step.metrics[2][0]);
    setText("[data-demo-label-three]", step.metrics[2][1]);
    setText("[data-demo-phone-kicker]", step.phone[0]);
    setText("[data-demo-phone-number]", step.phone[1]);
    setText("[data-demo-phone-label]", step.phone[2]);
    setText("[data-demo-phone-button]", step.phone[3]);

    const list = mockup.querySelector("[data-demo-list]");
    if (list) {
      list.innerHTML = step.rows.map((row, rowIndex) => `
        <div class="${rowIndex === 1 ? "is-called" : ""}">
          <span>${escapeHtml(row[0])}</span>
          <strong>${escapeHtml(row[1])}</strong>
          <small>${escapeHtml(row[2])}</small>
        </div>
      `).join("");
    }

    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === activeStep);
      button.setAttribute("aria-pressed", String(buttonIndex === activeStep));
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showStep(activeStep + 1), 3600);
  };

  const setText = (selector, value) => {
    const node = mockup.querySelector(selector);
    if (node) node.textContent = value;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showStep(Number(button.dataset.demoStep) || 0);
      restart();
    });
  });

  showStep(0);
  restart();
}

function bindAccessEvents() {
  elements.accessForm?.addEventListener("submit", handleAccessLogin);
  elements.toggleAccessPasswordButton?.addEventListener("click", toggleAccessPassword);
  elements.accessForgotButton?.addEventListener("click", handleAccessForgotPassword);
  fillSavedAccess();
}

function toggleAccessPassword() {
  const isHidden = elements.accessPasswordInput.type === "password";
  elements.accessPasswordInput.type = isHidden ? "text" : "password";
  elements.toggleAccessPasswordButton.textContent = isHidden ? "Esconder" : "Mostrar";
}

function bindOwnerEvents() {
  bindOwnerTabs();
  bindProspectEvents();
  renderProspectTable();
  restoreProspectPanelState();

  restoreOwnerSession();

  elements.ownerLoginButton.addEventListener("click", handleOwnerLogin);
  elements.ownerSignupButton?.addEventListener("click", handleOwnerSignup);
  elements.ownerForgotButton?.addEventListener("click", handleOwnerForgotPassword);
  fillOwnerRememberedEmail();

  elements.ownerLogoutButton?.addEventListener("click", async () => {
    if (db) await db.auth.signOut();
    clearStoredAccessSessions();
    elements.ownerPasswordInput.value = "";
    window.location.href = window.location.pathname;
  });

  elements.ownerAiShortcutButton?.addEventListener("click", () => {
    showOwnerTab("ownerAiPanel");
    document.querySelector("#ownerAiPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.ownerRefreshButton.addEventListener("click", refreshOwnerDashboard);
  elements.ownerBillingSettingsForm?.addEventListener("submit", saveOwnerBillingSettings);
  elements.ownerAiIncidentForm?.addEventListener("submit", createAiIncident);
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
  elements.ownerAccountForm?.addEventListener("submit", createRestaurantAccount);
}

async function restoreOwnerSession() {
  if (!db) {
    setOwnerAuthMessage("Supabase Auth e necessario para acessar o painel CEO.");
    return;
  }

  const { data, error } = await db.auth.getSession();
  if (error || !data.session) return;

  const isCeo = await verifyCeoSession();
  if (!isCeo) {
    await db.auth.signOut();
    setOwnerAuthMessage("Este usuario nao esta liberado como CEO.");
    return;
  }

  showOwnerDashboard();
}

async function handleOwnerLogin() {
  if (!db) {
    setOwnerAuthMessage("Supabase Auth e necessario para acessar o painel CEO.");
    return;
  }

  const email = elements.ownerEmailInput.value.trim();
  const password = elements.ownerPasswordInput.value;
  if (!email || !password) {
    setOwnerAuthMessage("Informe e-mail e senha do CEO.");
    return;
  }

  setOwnerAuthMessage("Validando acesso seguro...");
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    setOwnerAuthMessage("E-mail ou senha incorretos.");
    return;
  }

  const isCeo = await verifyCeoSession();
  if (!isCeo) {
    await db.auth.signOut();
    setOwnerAuthMessage("Login valido, mas este usuario nao esta marcado como CEO.");
    return;
  }

  rememberOwnerEmail(email);
  elements.ownerPasswordInput.value = "";
  showOwnerDashboard();
}

async function handleOwnerForgotPassword() {
  const email = elements.ownerEmailInput.value.trim();
  if (!email) {
    setOwnerAuthMessage("Informe o e-mail do CEO antes de recuperar a senha.");
    elements.ownerEmailInput.focus();
    return;
  }

  await sendOwnerPasswordReset(email, elements.ownerAuthMessage);
}

async function handleOwnerSignup() {
  if (!db) {
    setOwnerAuthMessage("Supabase Auth e necessario para criar o acesso CEO.");
    return;
  }

  const email = elements.ownerEmailInput.value.trim();
  const password = elements.ownerPasswordInput.value;
  if (!email || password.length < 6) {
    setOwnerAuthMessage("Informe o e-mail CEO e uma senha com pelo menos 6 caracteres.");
    return;
  }

  setOwnerAuthMessage("Criando acesso CEO...");
  const { data, error } = await db.auth.signUp({ email, password });
  if (error) {
    setOwnerAuthMessage(`Nao consegui criar acesso: ${error.message}`);
    return;
  }

  if (!data.session) {
    setOwnerAuthMessage("Acesso criado. Confirme o e-mail e depois entre como CEO.");
    elements.ownerPasswordInput.value = "";
    return;
  }

  const isCeo = await verifyCeoSession();
  if (!isCeo) {
    await db.auth.signOut();
    setOwnerAuthMessage("Acesso criado, mas o e-mail ainda nao esta autorizado como CEO.");
    return;
  }

  elements.ownerPasswordInput.value = "";
  showOwnerDashboard();
}

async function verifyCeoSession() {
  const { data, error } = await db.rpc("fila_is_ceo");
  if (error) {
    setOwnerAuthMessage(`Nao consegui verificar permissao de CEO: ${error.message}`);
    return false;
  }
  return Boolean(data);
}

function showOwnerDashboard() {
  elements.ownerLoginPanel.hidden = true;
  elements.ownerPanel.hidden = false;
  setOwnerAuthMessage("");
  refreshOwnerDashboard();
}

function setOwnerAuthMessage(message) {
  if (elements.ownerAuthMessage) elements.ownerAuthMessage.textContent = message;
}

function setAccessMessage(message, type = "info") {
  if (!elements.accessMessage) return;
  elements.accessMessage.textContent = message;
  elements.accessMessage.classList.toggle("is-error", type === "error");
  elements.accessMessage.classList.toggle("is-success", type === "success");
}

function rememberOwnerEmail(email) {
  if (!elements.ownerRememberInput?.checked) {
    localStorage.removeItem(OWNER_EMAIL_KEY);
    return;
  }

  localStorage.setItem(OWNER_EMAIL_KEY, email);
}

function fillOwnerRememberedEmail() {
  const email = localStorage.getItem(OWNER_EMAIL_KEY);
  if (!email) return;
  elements.ownerEmailInput.value = email;
  elements.ownerRememberInput.checked = true;
}

async function sendOwnerPasswordReset(email, targetElement) {
  if (!db) {
    if (targetElement === elements.accessMessage) {
      setAccessMessage("Supabase Auth e necessario para recuperar senha por e-mail.", "error");
    } else {
      targetElement.textContent = "Supabase Auth e necessario para recuperar senha por e-mail.";
    }
    return;
  }

  const redirectTo = `${window.location.origin + window.location.pathname}?modo=acesso`;
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
  if (targetElement === elements.accessMessage) {
    setAccessMessage(
      error ? `Nao consegui enviar recuperacao: ${error.message}` : "Enviamos um link de recuperacao para o e-mail informado.",
      error ? "error" : "success"
    );
    return;
  }
  targetElement.textContent = error
    ? `Nao consegui enviar recuperacao: ${error.message}`
    : "Enviamos um link de recuperacao para o e-mail informado.";
}

function bindOwnerTabs() {
  elements.ownerCrmTabs.forEach((tab) => {
    tab.addEventListener("click", () => showOwnerTab(tab.dataset.ownerTab));
  });
}

function showOwnerTab(panelId) {
  elements.ownerCrmTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.ownerTab === panelId);
  });
  elements.ownerTabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === panelId);
  });
}

async function handleAccessLogin(event) {
  event.preventDefault();
  const rawUser = elements.accessUserInput.value.trim();
  const user = slugify(rawUser);
  const password = elements.accessPasswordInput.value.trim();

  if (!user || !password) {
    setAccessMessage("Informe usuario e senha.", "error");
    return;
  }

  const passwordHash = await sha256(password);
  const isLocalOwnerUser = ["dono", "owner", "fila-ai"].includes(user);
  if (isLocalOwnerUser) {
    window.location.href = `${window.location.pathname}?modo=dono`;
    return;
  }

  if (rawUser.includes("@")) {
    await handleAccessCeoLogin(rawUser, password);
    return;
  }

  await handleRestaurantAccessSecure(user, password, passwordHash);
}

async function handleAccessCeoLogin(email, password) {
  if (!db) {
    setAccessMessage("Supabase Auth e necessario para acessar o CEO.", "error");
    return;
  }

  setAccessMessage("Validando acesso CEO...");
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    setAccessMessage("E-mail ou senha do CEO incorretos.", "error");
    return;
  }

  const { data: isCeo, error: ceoError } = await db.rpc("fila_is_ceo");
  if (ceoError || !isCeo) {
    await db.auth.signOut();
    setAccessMessage("Este e-mail nao esta liberado como CEO.", "error");
    return;
  }

  window.location.href = `${window.location.pathname}?modo=dono`;
}

async function handleAccessForgotPassword() {
  const rawUser = elements.accessUserInput.value.trim();
  if (rawUser && !rawUser.includes("@")) {
    await requestRestaurantAccessRecovery(rawUser);
    return;
  }
  if (!rawUser) {
    setAccessMessage("Informe o usuario ou e-mail antes de recuperar a senha.", "error");
    elements.accessUserInput.focus();
    return;
  }

  if (!rawUser.includes("@")) {
    setAccessMessage("Para restaurante, peca ao dono do Fila Ai para gerar um novo PIN na Central do Dono.", "error");
    return;
  }

  await sendOwnerPasswordReset(rawUser, elements.accessMessage);
}

async function requestRestaurantAccessRecovery(rawUser) {
  const slug = slugify(rawUser);
  if (!slug) {
    setAccessMessage("Informe o usuario do restaurante para solicitar recuperacao.", "error");
    return;
  }

  if (!db) {
    setAccessMessage("Banco indisponivel. Peca ao dono do Fila Ai para gerar um novo PIN.", "error");
    return;
  }

  const { error } = await db.from("subscription_requests").insert({
    company_slug: slug,
    company_name: titleFromSlug(slug),
    contact_phone: "",
    plan: "recuperacao-acesso",
    status: "novo"
  });

  setAccessMessage(
    error ? `Nao consegui solicitar recuperacao: ${error.message}` : "Solicitacao enviada. O dono do Fila Ai vai gerar um novo acesso para o restaurante.",
    error ? "error" : "success"
  );
}

async function handleRestaurantAccessSecure(slug, password, passwordHash) {
  setAccessMessage("Validando acesso...");

  try {
    let adminPin = defaultCompany.adminPin;
    if (db) {
      const { data: hashOk, error: hashError } = await db.rpc("fila_admin_authorized", {
        p_company_slug: slug,
        p_admin_pin: passwordHash
      });
      if (hashError) throw hashError;

      let plainOk = false;
      if (!hashOk) {
        const { data, error } = await db.rpc("fila_admin_authorized", {
          p_company_slug: slug,
          p_admin_pin: password
        });
        if (error) throw error;
        plainOk = Boolean(data);
      }

      if (!hashOk && !plainOk) {
        setAccessMessage("Usuario ou senha incorretos.", "error");
        return;
      }
      adminPin = hashOk ? passwordHash : password;
    } else if (slug !== defaultCompany.slug) {
      setAccessMessage("Supabase indisponivel. Teste apenas com restaurante-demo.", "error");
      return;
    }

    if (!db && password !== adminPin && passwordHash !== adminPin) {
      setAccessMessage("Usuario ou senha incorretos.", "error");
      return;
    }

    saveAccessChoice("restaurant", slug, adminPin);
    sessionStorage.setItem(adminAuthKey(slug), adminPin);
    window.location.href = `${window.location.pathname}?empresa=${encodeURIComponent(slug)}&modo=admin`;
  } catch (error) {
    setAccessMessage(`Nao consegui validar: ${error.message}`, "error");
  }
}

async function createRestaurantAccount(event) {
  event.preventDefault();
  const slug = slugify(elements.ownerAccountUserInput.value);
  const password = elements.ownerAccountPasswordInput.value.trim();
  const restaurantName = elements.ownerAccountNameInput.value.trim();
  const legalName = elements.ownerAccountLegalNameInput.value.trim();
  const companyDocument = elements.ownerAccountDocumentInput.value.trim();
  const fiscalAddress = elements.ownerAccountAddressInput.value.trim();
  const fiscalCity = elements.ownerAccountCityInput.value.trim();
  const fiscalState = elements.ownerAccountStateInput.value.trim().toUpperCase();
  const contactName = elements.ownerAccountContactNameInput.value.trim();
  const contactPhone = elements.ownerAccountContactPhoneInput.value.trim();
  const billingEmail = elements.ownerAccountBillingEmailInput.value.trim();

  if (!slug || password.length < 4) {
    elements.ownerAccountMessage.textContent = "Informe usuario e senha com pelo menos 4 caracteres.";
    return;
  }
  if (!restaurantName || !legalName || !companyDocument || !fiscalAddress || !fiscalCity || !fiscalState || !contactName || !contactPhone || !billingEmail) {
    elements.ownerAccountMessage.textContent = "Preencha todos os dados da empresa para liberar contrato e cobranca.";
    return;
  }
  if (!isValidCnpj(companyDocument)) {
    elements.ownerAccountMessage.textContent = "Informe um CNPJ valido para emitir contrato e cobranca.";
    elements.ownerAccountDocumentInput.focus();
    return;
  }
  if (!/^[A-Z]{2}$/.test(fiscalState)) {
    elements.ownerAccountMessage.textContent = "Informe a UF com 2 letras. Ex: SP.";
    elements.ownerAccountStateInput.focus();
    return;
  }
  if (!whatsappPhone(contactPhone)) {
    elements.ownerAccountMessage.textContent = "Informe um WhatsApp financeiro valido.";
    elements.ownerAccountContactPhoneInput.focus();
    return;
  }

  const passwordHash = await sha256(password);
  const company = {
    ...defaultCompany,
    slug,
    name: restaurantName,
    adminPin: passwordHash,
    legalName,
    companyDocument,
    fiscalAddress,
    fiscalCity,
    fiscalState,
    billingEmail,
    contactName,
    contactPhone,
    ownerStatus: "teste",
    paymentStatus: "pendente",
    trialStartedAt: new Date().toISOString(),
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  if (!db) {
    elements.ownerAccountMessage.textContent = "Supabase indisponível agora.";
    return;
  }

  const { error } = await db
    .from("queue_companies")
    .upsert(toSupabaseCompany(company), { onConflict: "slug" });

  if (error) {
    elements.ownerAccountMessage.textContent = `Não consegui criar: ${error.message}`;
    return;
  }

  elements.ownerAccountForm.reset();
  elements.ownerAccountMessage.textContent = `Conta criada. Usuário: ${slug}`;
  await refreshOwnerDashboard();
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
  elements.trialRequestMessage.textContent = "Pedido recebido. Voce vai liberar o teste pelo painel CEO.";
}

async function refreshOwnerDashboard() {
  if (!db) {
    if (elements.ownerRecoveryList) elements.ownerRecoveryList.innerHTML = `<p class="muted">Supabase nao configurado.</p>`;
    elements.ownerRequestsList.innerHTML = `<p class="muted">Supabase não configurado.</p>`;
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Supabase não configurado.</p>`;
    if (elements.ownerAiList) elements.ownerAiList.innerHTML = `<p class="muted">Supabase não configurado.</p>`;
    return;
  }

  await loadBillingSettings();
  fillOwnerBillingSettingsForm();

  const [
    { data: requests, error: requestsError },
    { data: companies, error: companiesError },
    { data: tokens, error: tokensError },
    { data: billing, error: billingError },
    { data: incidents, error: incidentsError }
  ] = await Promise.all([
    db.from("trial_requests").select("*").order("created_at", { ascending: false }),
    db.from("queue_companies").select("*").order("created_at", { ascending: false }),
    db.from("trial_tokens").select("*").order("created_at", { ascending: false }),
    db.from("subscription_requests").select("*").order("created_at", { ascending: false }),
    db.from("ai_incidents").select("*").order("created_at", { ascending: false }).limit(30)
  ]);

  const safeRequests = requests || [];
  const safeCompanies = companies || [];
  const safeTokens = tokens || [];
  const safeBilling = billing || [];
  const safeIncidents = incidents || [];
  const recoveryRequests = safeBilling.filter((request) => request.plan === "recuperacao-acesso");
  const planRequests = safeBilling.filter((request) => request.plan !== "recuperacao-acesso");

  setOwnerBadge(elements.ownerRequestsBadge, safeRequests.filter((request) => request.status !== "token gerado").length);
  setOwnerBadge(elements.ownerRecoveryBadge, recoveryRequests.filter((request) => request.status !== "contatado").length);
  setOwnerBadge(elements.ownerTokensBadge, safeTokens.filter((token) => !token.used_at && token.status !== "cancelado").length);
  setOwnerBadge(elements.ownerBillingBadge, planRequests.filter((request) => request.status !== "pago").length);
  setOwnerBadge(elements.ownerAiBadge, safeIncidents.filter((incident) => !["resolvido", "rejeitado"].includes(incident.status)).length);

  if (requestsError) {
    elements.ownerRequestsList.innerHTML = `<p class="muted">Erro: ${escapeHtml(requestsError.message)}</p>`;
  } else {
    renderOwnerRequests(safeRequests);
  }

  if (companiesError) {
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Erro: ${escapeHtml(companiesError.message)}</p>`;
  } else {
    renderOwnerCompanies(safeCompanies);
  }

  if (tokensError) {
    elements.ownerTokensList.innerHTML = `<p class="muted">Erro: ${escapeHtml(tokensError.message)}</p>`;
  } else {
    renderOwnerTokens(safeTokens);
  }

  if (billingError) {
    elements.ownerBillingList.innerHTML = `<p class="muted">Erro: ${escapeHtml(billingError.message)}</p>`;
    if (elements.ownerRecoveryList) elements.ownerRecoveryList.innerHTML = `<p class="muted">Erro: ${escapeHtml(billingError.message)}</p>`;
  } else {
    renderOwnerRecovery(recoveryRequests, safeCompanies);
    renderOwnerBilling(planRequests, safeCompanies);
  }

  if (incidentsError) {
    if (elements.ownerAiList) elements.ownerAiList.innerHTML = `<p class="muted">Erro na Equipe IA: ${escapeHtml(incidentsError.message)}</p>`;
  } else {
    renderOwnerAiIncidents(safeIncidents);
  }
}

async function loadBillingSettings() {
  if (!db) return;

  const { data, error } = await db
    .from("queue_settings")
    .select("billing_pix_key, billing_pix_name, billing_bank_link, billing_contract_link")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return;

  state.billingSettings = {
    pixKey: data.billing_pix_key || DEFAULT_BILLING_SETTINGS.pixKey,
    pixName: data.billing_pix_name || DEFAULT_BILLING_SETTINGS.pixName,
    bankLink: data.billing_bank_link || DEFAULT_BILLING_SETTINGS.bankLink,
    contractLink: normalizeContractLink(data.billing_contract_link)
  };
}

function fillOwnerBillingSettingsForm() {
  if (!elements.ownerBillingSettingsForm) return;

  elements.ownerPixKeyInput.value = state.billingSettings.pixKey;
  elements.ownerPixNameInput.value = state.billingSettings.pixName;
  elements.ownerPaymentLinkInput.value = state.billingSettings.bankLink;
  elements.ownerContractLinkInput.value = state.billingSettings.contractLink;
}

async function saveOwnerBillingSettings(event) {
  event.preventDefault();

  if (!db) {
    elements.ownerBillingSettingsMessage.textContent = "Supabase indisponivel agora.";
    return;
  }

  const billingSettings = {
    pixKey: elements.ownerPixKeyInput.value.trim() || DEFAULT_BILLING_SETTINGS.pixKey,
    pixName: elements.ownerPixNameInput.value.trim() || DEFAULT_BILLING_SETTINGS.pixName,
    bankLink: normalizeUrl(elements.ownerPaymentLinkInput.value, DEFAULT_BILLING_SETTINGS.bankLink),
    contractLink: normalizeContractLink(elements.ownerContractLinkInput.value)
  };

  const { error } = await db
    .from("queue_settings")
    .update({
      billing_pix_key: billingSettings.pixKey,
      billing_pix_name: billingSettings.pixName,
      billing_bank_link: billingSettings.bankLink,
      billing_contract_link: billingSettings.contractLink,
      updated_at: new Date().toISOString()
    })
    .eq("id", 1);

  if (error) {
    elements.ownerBillingSettingsMessage.textContent = `Nao consegui salvar: ${error.message}`;
    return;
  }

  state.billingSettings = billingSettings;
  elements.ownerBillingSettingsMessage.textContent = "Configuração de pagamento salva.";
}

function setOwnerBadge(element, count) {
  if (!element) return;
  element.textContent = String(count);
  element.hidden = count <= 0;
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
  companies = companies.filter((company) => company.owner_status !== "dono");
  if (!companies.length) {
    elements.ownerCompaniesList.innerHTML = `<p class="muted">Nenhum restaurante criado.</p>`;
    return;
  }

  const origin = window.location.origin + window.location.pathname;
  elements.ownerCompaniesList.innerHTML = companies.map((company) => {
    const trial = trialStatus(company);
    const expired = isTrialExpired(company);
    const adminUrl = `${origin}?empresa=${encodeURIComponent(company.slug)}&modo=admin`;
    const legalUrl = `${origin}?empresa=${encodeURIComponent(company.slug)}&modo=admin&aba=configurar#legalConfigBox`;
    const filaUrl = `${origin}?empresa=${encodeURIComponent(company.slug)}&modo=fila`;
    const contactDigits = whatsappPhone(company.contact_phone);
    const notifyMessage = encodeURIComponent(`Sua pagina do Fila Ai esta funcionando.\n\nAdministrador: ${adminUrl}\nFila do cliente: ${filaUrl}\nUsuario: ${company.slug}`);
    const notifyUrl = contactDigits ? `https://api.whatsapp.com/send?phone=${contactDigits}&text=${notifyMessage}` : "";
    const legalReady = Boolean(company.legal_name && company.company_document && company.fiscal_address && company.contact_name && company.contact_phone && company.billing_email);
    return `
      <article class="owner-company owner-item">
        <div>
          <strong>${escapeHtml(company.name)}</strong>
          <span>${escapeHtml(company.owner_status || "teste")} - ${escapeHtml(company.payment_status || "pagamento pendente")} - Plano ${escapeHtml(company.monthly_price === "pro" ? "Pro beta" : "Essencial")} - ${trial}</span>
          <small>${company.legal_name ? `Razao social: ${escapeHtml(company.legal_name)} - CNPJ: ${escapeHtml(company.company_document || "sem CNPJ")}` : "Dados de contrato pendentes: razao social, CNPJ e endereco fiscal."}</small>
          <small>${company.fiscal_address ? `Endereco: ${escapeHtml(company.fiscal_address)}${company.fiscal_city ? ` - ${escapeHtml(company.fiscal_city)}` : ""}${company.fiscal_state ? `/${escapeHtml(company.fiscal_state)}` : ""}` : "Endereco fiscal ainda nao cadastrado."}</small>
          ${legalReady ? "" : `<em class="owner-warning-note">Cadastro juridico incompleto. Nao marque pago sem completar contrato.</em>`}
          ${expired ? `<em class="owner-expired-note">Teste encerrado. Oriente o restaurante a efetuar o pagamento para continuar usando.</em>` : ""}
          <small>Usuario do restaurante: ${escapeHtml(company.slug)}. A senha nao e exibida por seguranca; gere um novo PIN se o cliente esquecer.</small>
        </div>
        <div class="link-stack">
          <a href="${adminUrl}" target="_blank" rel="noreferrer">Administrador</a>
          <a href="${filaUrl}" target="_blank" rel="noreferrer">Fila do cliente</a>
          ${legalReady ? "" : `<a href="${legalUrl}" target="_blank" rel="noreferrer">Completar cadastro</a>`}
          ${notifyUrl ? `<a href="${notifyUrl}" target="_blank" rel="noreferrer">Avisar cliente</a>` : ""}
          <button type="button" data-company-action="paid" data-slug="${escapeHtml(company.slug)}">Pago</button>
          <button type="button" data-company-action="pending" data-slug="${escapeHtml(company.slug)}">Pendente</button>
          <button type="button" data-company-action="essential" data-slug="${escapeHtml(company.slug)}">Essencial</button>
          <button type="button" data-company-action="pro" data-slug="${escapeHtml(company.slug)}">Pro beta</button>
          <button type="button" data-company-action="reset-pin" data-slug="${escapeHtml(company.slug)}" data-company-name="${escapeHtml(company.name)}" data-contact-phone="${escapeHtml(company.contact_phone || "")}">Gerar novo PIN</button>
          <button type="button" data-company-action="send-pin" data-slug="${escapeHtml(company.slug)}" data-company-name="${escapeHtml(company.name)}" data-contact-phone="${escapeHtml(company.contact_phone || "")}">Gerar e enviar PIN</button>
          <button type="button" data-company-action="blocked" data-slug="${escapeHtml(company.slug)}">Bloquear</button>
          <button type="button" data-company-action="lead" data-slug="${escapeHtml(company.slug)}" data-company-name="${escapeHtml(company.name)}" data-contact-phone="${escapeHtml(company.contact_phone || "")}">Transformar em lead</button>
          <button type="button" data-company-action="delete" data-slug="${escapeHtml(company.slug)}" data-company-name="${escapeHtml(company.name)}">Excluir</button>
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
    const phone = whatsappPhone(token.phone);
    const message = encodeURIComponent(`Ola! Aqui esta o link para ativar o teste gratis do FILA AI.\n\nRestaurante: ${token.restaurant_name || "seu restaurante"}\nLink de ativacao: ${activationUrl}\n\nDepois de ativar, o sistema vai mostrar o painel administrador e a fila do cliente separados para o restaurante.`);
    const whatsUrl = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${message}` : "";
    const contactMessage = encodeURIComponent(`Ola! Tudo bem? Estou falando sobre o teste do FILA AI para ${token.restaurant_name || "seu restaurante"}.\n\nConsigo te ajudar a ativar o acesso ou tirar alguma duvida?`);
    const contactUrl = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${contactMessage}` : "";
    return `
      <article class="owner-item">
        <div>
          <strong>${escapeHtml(token.restaurant_name || "Token livre")}</strong>
          <span>${escapeHtml(status)} - ${escapeHtml(countdown)}${token.phone ? ` - WhatsApp: ${escapeHtml(token.phone)}` : ""}</span>
          <small>${escapeHtml(token.token)} ${token.activated_slug ? `- restaurante ativado: ${escapeHtml(token.activated_slug)}` : ""}</small>
        </div>
        <div class="link-stack">
          <a href="${activationUrl}" target="_blank" rel="noreferrer">Abrir token</a>
          ${whatsUrl && !token.used_at ? `<a href="${whatsUrl}" target="_blank" rel="noreferrer">Enviar WhatsApp</a>` : ""}
          ${contactUrl ? `<a href="${contactUrl}" target="_blank" rel="noreferrer">Contato</a>` : ""}
          <button type="button" data-token-copy="${activationUrl}">Copiar link</button>
          <button type="button" data-token-action="lead" data-token="${escapeHtml(token.token)}" data-token-name="${escapeHtml(token.restaurant_name || "Token livre")}" data-token-phone="${escapeHtml(token.phone || "")}">Transformar em lead</button>
          ${token.used_at ? "" : `<button type="button" data-token-action="cancel" data-token="${escapeHtml(token.token)}">Cancelar</button>`}
          <button type="button" data-token-action="delete" data-token="${escapeHtml(token.token)}" data-token-name="${escapeHtml(token.restaurant_name || "Token livre")}">Excluir</button>
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

function renderOwnerRecovery(requests, companies) {
  if (!elements.ownerRecoveryList) return;
  if (!requests.length) {
    elements.ownerRecoveryList.innerHTML = `<p class="muted">Nenhuma solicitacao de recuperacao.</p>`;
    return;
  }

  elements.ownerRecoveryList.innerHTML = requests.map((request) => {
    const company = companies.find((item) => item.slug === request.company_slug) || {};
    const name = company.name || request.company_name || request.company_slug;
    const phone = company.contact_phone || request.contact_phone || "";
    return `
      <article class="owner-item">
        <div>
          <strong>${escapeHtml(name)}</strong>
          <span>Solicitou recuperacao de acesso - ${escapeHtml(statusLabel(request.status || "novo"))}</span>
          <small>Usuario: ${escapeHtml(request.company_slug)} - ${formatDate(request.created_at)}</small>
        </div>
        <div class="owner-actions">
          <button type="button" data-company-action="send-pin" data-slug="${escapeHtml(request.company_slug)}" data-company-name="${escapeHtml(name)}" data-contact-phone="${escapeHtml(phone)}">Gerar e enviar PIN</button>
          <button type="button" data-billing-action="contacted" data-billing-id="${request.id}">Marcar contatado</button>
        </div>
      </article>
    `;
  }).join("");

  elements.ownerRecoveryList.querySelectorAll("[data-company-action]").forEach((button) => {
    button.addEventListener("click", () => handleOwnerCompanyAction(button));
  });
  elements.ownerRecoveryList.querySelectorAll("[data-billing-action]").forEach((button) => {
    button.addEventListener("click", () => handleOwnerBillingAction(button));
  });
}

function renderOwnerBilling(requests, companies = []) {
  if (!requests.length) {
    elements.ownerBillingList.innerHTML = `<p class="muted">Nenhum pedido de plano ainda.</p>`;
    return;
  }

  elements.ownerBillingList.innerHTML = requests.map((request) => {
    const company = companies.find((item) => item.slug === request.company_slug) || {};
    const companyPlan = planFromValue(company.monthly_price);
    const plan = request.plan === "anual" ? "anual" : "mensal";
    const quote = billingQuote(companyPlan, plan);
    const phone = whatsappPhone(request.contact_phone);
    const hasAcceptedContract = plan === "anual" && (request.status || "").includes("contrato");
    const message = encodeURIComponent(`Ola! Recebi seu pedido para continuar com o FILA AI.\n\nRestaurante: ${request.company_name || request.company_slug}\nPlano: ${quote.planName} ${planLabel(plan)}\nValor: ${quote.totalText}\nContrato anual: ${plan === "anual" ? "necessario assinar antes da ativacao" : "nao obrigatorio no mensal"}\n\nVou te passar os proximos passos para pagamento e ativacao.`);
    const whatsUrl = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${message}` : "";
    const contractCompany = ownerContractCompany(request, company);
    return `
      <article class="owner-item owner-billing-item">
        <div>
          <strong>${escapeHtml(request.company_name || request.company_slug)}</strong>
          <span>${escapeHtml(quote.planName)} ${escapeHtml(planLabel(plan))} - ${escapeHtml(quote.totalText)} - ${escapeHtml(statusLabel(request.status || "novo"))}</span>
          <small>${escapeHtml(request.contact_phone || "sem telefone")} - pedido em ${formatDate(request.created_at)}</small>
          <em>${plan === "anual" ? (hasAcceptedContract ? "Contrato anual aceito pelo restaurante. Abra abaixo para conferir." : "Contrato anual ainda nao aparece como aceito.") : "Mensalidade pode ser liberada apos confirmacao do Pix/comprovante."}</em>
        </div>
        <div class="owner-actions">
          ${whatsUrl ? `<a href="${whatsUrl}" target="_blank" rel="noreferrer">Chamar no WhatsApp</a>` : ""}
          ${plan === "anual" ? `<button type="button" data-contract-preview="${escapeHtml(request.id)}">${hasAcceptedContract ? "Ver contrato" : "Ver minuta"}</button>` : ""}
          <button type="button" data-billing-action="paid" data-billing-id="${request.id}" data-billing-slug="${escapeHtml(request.company_slug)}">Marcar pago</button>
          <button type="button" data-billing-action="contacted" data-billing-id="${request.id}">Contatado</button>
        </div>
        ${plan === "anual" ? `<div class="owner-contract-preview" data-contract-preview-panel="${escapeHtml(request.id)}" hidden>${annualContractHtml(quote, contractCompany, request.created_at, hasAcceptedContract)}</div>` : ""}
      </article>
    `;
  }).join("");

  elements.ownerBillingList.querySelectorAll("button").forEach((button) => {
    if (button.dataset.contractPreview) {
      button.addEventListener("click", () => toggleOwnerContractPreview(button));
      return;
    }
    button.addEventListener("click", () => handleOwnerBillingAction(button));
  });
}

function renderOwnerAiIncidents(incidents) {
  if (!elements.ownerAiList) return;
  if (!incidents.length) {
    elements.ownerAiList.innerHTML = `
      <article class="owner-item owner-ai-empty">
        <div>
          <strong>Nenhum incidente registrado.</strong>
          <span>Quando voce encontrar um erro, registre acima para o Engenheiro IA iniciar a investigacao.</span>
          <small>O fluxo da fila continua sendo tratado como prioridade maxima.</small>
        </div>
      </article>
    `;
    return;
  }

  elements.ownerAiList.innerHTML = incidents.map((incident) => {
    const isAwaitingApproval = incident.status === "aguardando_aprovacao";
    const isClosed = ["resolvido", "rejeitado"].includes(incident.status);
    return `
      <article class="owner-item owner-ai-incident">
        <div>
          <div class="owner-ai-meta">
            <span class="owner-ai-pill owner-ai-severity-${escapeHtml(incident.severity)}">${escapeHtml(aiSeverityLabel(incident.severity))}</span>
            <span class="owner-ai-pill">${escapeHtml(aiStatusLabel(incident.status))}</span>
            <span class="owner-ai-pill">${escapeHtml(aiModuleLabel(incident.module))}</span>
          </div>
          <strong>${escapeHtml(incident.title)}</strong>
          <span><b>Problema:</b> ${escapeHtml(incident.business_summary || incident.description || "Aguardando descricao.")}</span>
          <small><b>Impacto:</b> ${escapeHtml(incident.impact || aiDefaultImpact(incident.severity))}</small>
          <small><b>Causa:</b> ${escapeHtml(incident.root_cause || "Causa ainda nao confirmada.")}</small>
          <small><b>Correcao:</b> ${escapeHtml(incident.proposed_fix || "Nenhuma correcao preparada ainda.")}</small>
          <small><b>Testes:</b> ${escapeHtml(incident.tests_summary || "Testes serao definidos durante a investigacao.")}</small>
          <small><b>Regressao:</b> ${escapeHtml(incident.regression_summary || "Ainda nao verificada.")}</small>
          <small><b>Risco:</b> ${escapeHtml(aiRiskLabel(incident.risk_level))} - ${escapeHtml(incident.recommendation || "Investigar antes de aprovar qualquer publicacao.")}</small>
          <small>Registrado em ${formatDate(incident.created_at)} - ultima atualizacao ${formatDate(incident.updated_at || incident.created_at)}</small>
        </div>
        <div class="owner-actions owner-ai-actions">
          ${isClosed ? "" : `<button type="button" data-ai-action="investigating" data-incident-id="${incident.id}">Marcar investigando</button>`}
          ${isClosed ? "" : `<button type="button" data-ai-action="approval" data-incident-id="${incident.id}">Pronto para aprovacao</button>`}
          ${isAwaitingApproval ? `<button type="button" data-ai-action="approve" data-incident-id="${incident.id}">Aprovar correcao</button>` : ""}
          ${isClosed ? "" : `<button type="button" data-ai-action="recheck" data-incident-id="${incident.id}">Pedir nova analise</button>`}
          ${isClosed ? "" : `<button type="button" data-ai-action="reject" data-incident-id="${incident.id}">Rejeitar</button>`}
          ${isClosed ? "" : `<button type="button" data-ai-action="resolve" data-incident-id="${incident.id}">Resolver</button>`}
        </div>
      </article>
    `;
  }).join("");

  elements.ownerAiList.querySelectorAll("[data-ai-action]").forEach((button) => {
    button.addEventListener("click", () => handleAiIncidentAction(button));
  });
}

function ownerContractCompany(request, company) {
  return {
    slug: request.company_slug,
    name: request.company_name || company.name || titleFromSlug(request.company_slug),
    legalName: company.legal_name || company.legalName || request.company_name || company.name || titleFromSlug(request.company_slug),
    companyDocument: company.company_document || company.companyDocument || "CNPJ nao informado",
    fiscalAddress: company.fiscal_address || company.fiscalAddress || "Endereco fiscal nao informado",
    fiscalCity: company.fiscal_city || company.fiscalCity || "",
    fiscalState: company.fiscal_state || company.fiscalState || "",
    billingEmail: company.billing_email || company.billingEmail || "",
    contactName: company.contact_name || company.contactName || "Responsavel financeiro cadastrado",
    contactPhone: request.contact_phone || company.contact_phone || company.contactPhone || "WhatsApp financeiro cadastrado"
  };
}

function toggleOwnerContractPreview(button) {
  const id = button.dataset.contractPreview;
  const panel = Array.from(elements.ownerBillingList?.querySelectorAll("[data-contract-preview-panel]") || [])
    .find((item) => item.dataset.contractPreviewPanel === id);
  if (!panel) return;
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  button.textContent = willOpen ? "Fechar contrato" : "Ver contrato";
}

function bindProspectEvents() {
  elements.ownerProspectToggleButton?.addEventListener("click", () => {
    setProspectPanelOpen(elements.ownerProspectContent?.hidden);
  });
  elements.prospectStateFilter?.addEventListener("change", renderProspectTable);
  elements.prospectStatusFilter?.addEventListener("change", renderProspectTable);
  elements.prospectSearchInput?.addEventListener("input", renderProspectTable);
  elements.saveProspectsButton?.addEventListener("click", saveProspectOperation);
  elements.exportProspectsButton?.addEventListener("click", exportProspectsCsv);

  elements.prospectTableBody?.addEventListener("change", (event) => {
    const field = event.target.dataset.prospectField;
    const id = event.target.dataset.prospectId;
    if (!field || !id) return;
    updateProspect(id, field, event.target.value);
    renderProspectTable();
  });

  elements.prospectTableBody?.addEventListener("input", (event) => {
    const field = event.target.dataset.prospectField;
    const id = event.target.dataset.prospectId;
    if (!field || !id || field !== "notes") return;
    updateProspect(id, field, event.target.value);
  });

  elements.prospectTableBody?.addEventListener("click", async (event) => {
    if (event.target.dataset.prospectAction !== "copy") return;
    const prospect = getProspectRows().find((row) => row.id === event.target.dataset.prospectId);
    if (!prospect) return;
    await navigator.clipboard.writeText(prospectPitch(prospect));
    event.target.textContent = "Copiado";
    setTimeout(() => {
      event.target.textContent = "Copiar texto";
    }, 1400);
  });
}

function setProspectPanelOpen(isOpen) {
  if (!elements.ownerProspectPanel || !elements.ownerProspectContent || !elements.ownerProspectToggleButton) return;
  elements.ownerProspectPanel.classList.toggle("is-collapsed", !isOpen);
  elements.ownerProspectContent.hidden = !isOpen;
  elements.ownerProspectToggleButton.textContent = isOpen ? "Fechar prospeccao" : "Abrir prospeccao";
  elements.ownerProspectToggleButton.setAttribute("aria-expanded", String(isOpen));
  localStorage.setItem(OWNER_PROSPECT_PANEL_KEY, isOpen ? "open" : "closed");
}

function restoreProspectPanelState() {
  const saved = localStorage.getItem(OWNER_PROSPECT_PANEL_KEY);
  setProspectPanelOpen(saved === "open");
}

function renderProspectTable() {
  if (!elements.prospectTableBody) return;
  const rows = filteredProspectRows();
  renderProspectSummary();

  if (!rows.length) {
    elements.prospectTableBody.innerHTML = `<tr><td colspan="7" class="prospect-empty">Nenhum lead encontrado com estes filtros.</td></tr>`;
    return;
  }

  elements.prospectTableBody.innerHTML = rows.map((prospect) => {
    const whatsApp = whatsappPhone(firstPhone(prospect.phone));
    const phoneHref = telPhone(firstPhone(prospect.phone));
    const whatsUrl = whatsApp ? `https://api.whatsapp.com/send?phone=${whatsApp}&text=${encodeURIComponent(prospectPitch(prospect))}` : "";
    return `
      <tr>
        <td>
          <strong>${escapeHtml(prospect.name)}</strong>
          <span>${escapeHtml(prospect.city)}</span>
          <small class="priority-chip ${prospect.priority === "Alta" ? "is-hot" : ""}">${escapeHtml(prospect.priority)}</small>
        </td>
        <td>${escapeHtml(prospect.state)}</td>
        <td><strong>${escapeHtml(prospect.phone)}</strong></td>
        <td>${escapeHtml(prospect.pain)}</td>
        <td><select data-prospect-field="status" data-prospect-id="${escapeHtml(prospect.id)}">${prospectStatusOptions(prospect.status)}</select></td>
        <td>
          <input type="date" value="${escapeHtml(prospect.nextAction || "")}" data-prospect-field="nextAction" data-prospect-id="${escapeHtml(prospect.id)}" />
          <textarea rows="2" placeholder="Anotacao comercial" data-prospect-field="notes" data-prospect-id="${escapeHtml(prospect.id)}">${escapeHtml(prospect.notes || "")}</textarea>
        </td>
        <td>
          <div class="prospect-actions">
            ${whatsUrl ? `<a href="${whatsUrl}" target="_blank" rel="noreferrer">WhatsApp</a>` : ""}
            ${phoneHref ? `<a href="tel:${phoneHref}">Ligar</a>` : ""}
            <button type="button" data-prospect-action="copy" data-prospect-id="${escapeHtml(prospect.id)}">Copiar texto</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderProspectSummary() {
  const rows = getProspectRows();
  if (elements.prospectTotalCount) elements.prospectTotalCount.textContent = rows.length;
  if (elements.prospectHotCount) elements.prospectHotCount.textContent = rows.filter((row) => row.priority === "Alta").length;
  if (elements.prospectContactedCount) {
    elements.prospectContactedCount.textContent = rows.filter((row) => ["contatado", "retorno"].includes(row.status)).length;
  }
  if (elements.prospectWonCount) elements.prospectWonCount.textContent = rows.filter((row) => row.status === "cliente").length;
}

function filteredProspectRows() {
  const state = elements.prospectStateFilter?.value || "todos";
  const status = elements.prospectStatusFilter?.value || "todos";
  const search = normalizeSearchTerm(elements.prospectSearchInput?.value || "");

  return getProspectRows().filter((prospect) => {
    const matchesState = state === "todos" || prospect.state === state;
    const matchesStatus = status === "todos" || prospect.status === status;
    const haystack = normalizeSearchTerm(`${prospect.name} ${prospect.city} ${prospect.state} ${prospect.phone} ${prospect.pain}`);
    return matchesState && matchesStatus && (!search || haystack.includes(search));
  });
}

function getProspectRows() {
  const saved = loadProspectState();
  return [...OWNER_PROSPECTS, ...loadCustomProspects()].map((prospect) => ({
    ...prospect,
    status: saved[prospect.id]?.status || "novo",
    nextAction: saved[prospect.id]?.nextAction || "",
    notes: saved[prospect.id]?.notes || ""
  }));
}

function loadCustomProspects() {
  try {
    const rows = JSON.parse(localStorage.getItem(OWNER_CUSTOM_PROSPECTS_KEY) || "[]");
    return Array.isArray(rows) ? rows : [];
  } catch {
    localStorage.removeItem(OWNER_CUSTOM_PROSPECTS_KEY);
    return [];
  }
}

function addOwnerLeadFromCompany(company) {
  const id = `company-${slugify(company.slug || company.name)}`;
  const rows = loadCustomProspects().filter((row) => row.id !== id);
  rows.unshift({
    id,
    name: company.name || titleFromSlug(company.slug),
    state: "Lead",
    city: "Central do Dono",
    phone: company.phone || "",
    priority: "Alta",
    pain: "Teste encerrado ou pagamento pendente. Retomar contato comercial para ativar plano.",
    status: "retorno"
  });
  localStorage.setItem(OWNER_CUSTOM_PROSPECTS_KEY, JSON.stringify(rows));
}

function addOwnerLeadFromToken(button) {
  const token = button.dataset.token || "";
  const name = button.dataset.tokenName || "Token de teste";
  const phone = button.dataset.tokenPhone || "";
  const id = `token-${slugify(token || name)}`;
  const rows = loadCustomProspects().filter((row) => row.id !== id);
  rows.unshift({
    id,
    name,
    state: "Lead",
    city: "Token de teste",
    phone,
    priority: "Alta",
    pain: "Token gerado na Central do Dono. Acompanhar ativacao do teste e fechamento do plano.",
    status: "retorno"
  });
  localStorage.setItem(OWNER_CUSTOM_PROSPECTS_KEY, JSON.stringify(rows));
}

function loadProspectState() {
  try {
    return JSON.parse(localStorage.getItem(PROSPECT_STATUS_KEY) || "{}");
  } catch {
    localStorage.removeItem(PROSPECT_STATUS_KEY);
    return {};
  }
}

function updateProspect(id, field, value) {
  const saved = loadProspectState();
  saved[id] = { ...(saved[id] || {}), [field]: value };
  localStorage.setItem(PROSPECT_STATUS_KEY, JSON.stringify(saved));
  if (elements.prospectSaveMessage) {
    elements.prospectSaveMessage.textContent = "Alteracao salva automaticamente neste aparelho.";
  }
}

function saveProspectOperation() {
  localStorage.setItem(PROSPECT_STATUS_KEY, JSON.stringify(loadProspectState()));
  if (!elements.prospectSaveMessage) return;
  elements.prospectSaveMessage.textContent = `Operacao salva em ${new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date())}.`;
}

function prospectStatusOptions(selected) {
  return [
    ["novo", "Novo"],
    ["contatar", "Contatar hoje"],
    ["contatado", "Contatado"],
    ["retorno", "Retorno marcado"],
    ["cliente", "Cliente"],
    ["descartado", "Descartado"]
  ].map(([value, label]) => `<option value="${value}"${value === selected ? " selected" : ""}>${label}</option>`).join("");
}

function prospectPitch(prospect) {
  return `Oi, tudo bem? Vi que o ${prospect.name} tem bastante movimento e que a espera por mesa pode virar um ponto sensivel para os clientes.\n\nSou do FILA AI. A gente ajuda restaurantes a organizar fila de espera pelo WhatsApp, reduzir confusao na recepcao e avisar o cliente quando a mesa esta proxima.\n\nQuem cuida dessa parte de atendimento/fila ai na casa?`;
}

function exportProspectsCsv() {
  const header = ["nome", "estado", "cidade", "telefone", "prioridade", "status", "proxima_acao", "dor", "anotacoes"];
  const rows = getProspectRows().map((prospect) => [
    prospect.name,
    prospect.state,
    prospect.city,
    prospect.phone,
    prospect.priority,
    prospect.status,
    prospect.nextAction,
    prospect.pain,
    prospect.notes
  ]);
  const csv = [header, ...rows].map((line) => line.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "prospeccao-fila-ai-sp-rj-mg.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function firstPhone(value) {
  return String(value || "").split("/")[0].trim();
}

function telPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function normalizeSearchTerm(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
  const action = button.dataset.tokenAction;

  if (action === "lead") {
    addOwnerLeadFromToken(button);
    setProspectPanelOpen(true);
    renderProspectTable();
    alert(`${button.dataset.tokenName || "Token"} foi enviado para a prospeccao.`);
    return;
  }

  if (action === "delete") {
    const name = button.dataset.tokenName || button.dataset.token;
    const confirmed = window.confirm(`Excluir o token de ${name} da lista? Isso nao apaga restaurante ja ativado.`);
    if (!confirmed) return;

    const { error } = await db
      .from("trial_tokens")
      .delete()
      .eq("token", button.dataset.token);

    if (error) {
      alert(`Não consegui excluir token: ${error.message}`);
      return;
    }

    await refreshOwnerDashboard();
    return;
  }

  if (action !== "cancel") return;

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

async function createAiIncident(event) {
  event.preventDefault();
  if (!db) {
    elements.ownerAiMessage.textContent = "Supabase indisponivel agora.";
    return;
  }

  const title = elements.ownerAiTitleInput.value.trim();
  const description = elements.ownerAiDescriptionInput.value.trim();
  if (!title || !description) {
    elements.ownerAiMessage.textContent = "Informe o problema e o que aconteceu.";
    return;
  }

  elements.ownerAiMessage.textContent = "Registrando problema para investigacao...";
  const severity = elements.ownerAiSeverityInput.value;
  const payload = {
    title,
    description,
    status: "triagem",
    severity,
    module: elements.ownerAiModuleInput.value,
    environment: elements.ownerAiEnvironmentInput.value,
    source: "manual",
    expected_result: elements.ownerAiExpectedInput.value.trim(),
    observed_result: elements.ownerAiObservedInput.value.trim(),
    business_summary: description,
    impact: aiDefaultImpact(severity),
    risk_level: severity === "critica" || severity === "alta" ? "alto" : "medio",
    recommendation: "Investigar, reproduzir e preparar teste antes de qualquer correcao.",
    approval_status: "nao_solicitada",
    deploy_status: "nao_autorizado"
  };

  const { data, error } = await db
    .from("ai_incidents")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    elements.ownerAiMessage.textContent = `Nao consegui registrar: ${error.message}`;
    return;
  }

  await addAiIncidentEvent(data.id, "detectado", "Problema registrado", "Incidente manual criado na Central do Dono.");
  elements.ownerAiIncidentForm.reset();
  elements.ownerAiMessage.textContent = "Problema registrado. A investigacao pode comecar.";
  await refreshOwnerDashboard();
}

async function handleAiIncidentAction(button) {
  const incidentId = button.dataset.incidentId;
  const action = button.dataset.aiAction;
  const actionMap = {
    investigating: {
      status: "investigando",
      approval_status: "nao_solicitada",
      title: "Investigacao iniciada",
      details: "Engenheiro IA marcado para investigar o problema."
    },
    approval: {
      status: "aguardando_aprovacao",
      approval_status: "aguardando",
      title: "Correcao aguardando aprovacao",
      details: "A correcao deve ser revisada pelo dono antes de qualquer publicacao."
    },
    approve: {
      status: "aprovado",
      approval_status: "aprovada",
      approved_by: "Dono do FILA AI",
      approved_at: new Date().toISOString(),
      title: "Correcao aprovada",
      details: "Aprovacao registrada. Deploy continua dependendo do fluxo seguro de publicacao."
    },
    recheck: {
      status: "reaberto",
      approval_status: "nova_analise",
      title: "Nova analise solicitada",
      details: "O dono pediu nova investigacao antes de aprovar."
    },
    reject: {
      status: "rejeitado",
      approval_status: "rejeitada",
      title: "Correcao rejeitada",
      details: "O dono rejeitou a correcao proposta."
    },
    resolve: {
      status: "resolvido",
      title: "Incidente resolvido",
      details: "Incidente marcado como resolvido na Central do Dono."
    }
  };

  const next = actionMap[action];
  if (!next) return;

  const { title, details, ...updates } = next;
  const { error } = await db
    .from("ai_incidents")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", incidentId);

  if (error) {
    alert(`Nao consegui atualizar incidente: ${error.message}`);
    return;
  }

  await addAiIncidentEvent(incidentId, action, title, details);
  await refreshOwnerDashboard();
}

async function addAiIncidentEvent(incidentId, eventType, title, details) {
  if (!db || !incidentId) return;
  await db.from("ai_incident_events").insert({
    incident_id: incidentId,
    event_type: eventType,
    title,
    details,
    created_by: "Central do Dono"
  });
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
  const sendHint = phone ? "\n\nAgora abra a aba Tokens e clique em Enviar WhatsApp para mandar ao cliente." : "\n\nComo nao foi informado WhatsApp, copie este link e envie manualmente ao cliente.";
  alert(`Token gerado e link copiado: ${link}${sendHint}`);
}

async function handleOwnerCompanyAction(button) {
  const slug = button.dataset.slug;
  const action = button.dataset.companyAction;

  if (action === "reset-pin" || action === "send-pin") {
    await resetRestaurantPin(button, action === "send-pin");
    return;
  }

  if (action === "delete") {
    await deleteOwnerCompany(button);
    return;
  }

  if (action === "lead") {
    await convertCompanyToLead(button);
    return;
  }

  const updates = {
    paid: { owner_status: "ativo", payment_status: "pago" },
    pending: { owner_status: "teste", payment_status: "pendente" },
    blocked: { owner_status: "bloqueado", payment_status: "bloqueado", queue_open: false },
    essential: { monthly_price: "essencial" },
    pro: { monthly_price: "pro", menu_enabled: true }
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

async function deleteOwnerCompany(button) {
  const slug = button.dataset.slug;
  const name = button.dataset.companyName || slug;
  const confirmed = window.confirm(`Excluir ${name} permanentemente? Essa acao remove o acesso, fila, produtos, pedidos e pedidos financeiros deste restaurante.`);
  if (!confirmed) return;

  const { error } = await db.rpc("fila_delete_company_permanent", { p_company_slug: slug });
  if (error) {
    alert(`Nao consegui excluir restaurante: ${error.message}`);
    return;
  }

  await refreshOwnerDashboard();
}

async function convertCompanyToLead(button) {
  const slug = button.dataset.slug;
  const name = button.dataset.companyName || titleFromSlug(slug);
  const phone = button.dataset.contactPhone || "";
  addOwnerLeadFromCompany({ slug, name, phone });

  const { error } = await db
    .from("queue_companies")
    .update({ owner_status: "lead", payment_status: "pendente", queue_open: false, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    alert(`Lead salvo neste aparelho, mas nao consegui atualizar restaurante: ${error.message}`);
    return;
  }

  alert(`${name} foi transformado em lead no funil comercial.`);
  renderProspectTable();
  await refreshOwnerDashboard();
}

async function resetRestaurantPin(button, shouldOpenWhatsapp) {
  const slug = button.dataset.slug;
  const restaurantName = button.dataset.companyName || slug;
  const contactPhone = button.dataset.contactPhone || "";
  const nextPin = randomPin();
  const nextPinHash = await sha256(nextPin);
  const adminUrl = `${window.location.origin + window.location.pathname}?empresa=${encodeURIComponent(slug)}&modo=admin`;
  const message = `Ola! Conforme solicitado, gerei uma nova senha de acesso do Fila Ai.\n\nRestaurante: ${restaurantName}\nUsuario: ${slug}\nNovo PIN: ${nextPin}\nPainel administrador: ${adminUrl}\n\nGuarde esse PIN em local seguro. Se quiser, depois de entrar no painel, voce pode alterar em Configurar > Senha administrativa.`;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Gerando...";

  const { error } = await db.rpc("fila_ceo_reset_admin_pin", {
    p_company_slug: slug,
    p_next_admin_pin: nextPinHash
  });

  if (error) {
    button.disabled = false;
    button.textContent = originalText;
    alert(`Nao consegui gerar novo PIN: ${error.message}`);
    return;
  }

  await navigator.clipboard.writeText(message).catch(() => {});

  const digits = whatsappPhone(contactPhone);
  if (shouldOpenWhatsapp && digits) {
    window.open(`https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`, "_blank", "noopener");
  } else if (shouldOpenWhatsapp && !digits) {
    alert(`Novo PIN gerado e mensagem copiada.\n\nTelefone do cliente nao esta cadastrado.\n\n${message}`);
  } else {
    alert(`Novo PIN gerado e mensagem copiada:\n\n${message}`);
  }

  button.disabled = false;
  button.textContent = originalText;
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

  const { data, error } = await db.rpc("fila_trial_token_public", { p_token: TRIAL_TOKEN });
  const token = Array.isArray(data) ? data[0] : data;
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
    renderActivationLinks(token.activated_slug, "", token.trial_ends_at);
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

  const { data, error } = await db.rpc("fila_activate_trial_token", {
    p_token: TRIAL_TOKEN,
    p_restaurant_name: restaurantName,
    p_owner_name: ownerName,
    p_phone: phone
  });
  const activation = Array.isArray(data) ? data[0] : data;
  if (error || !activation) {
    elements.activationMessage.textContent = "Token inválido, cancelado ou indisponível.";
    return;
  }

  elements.activationForm.hidden = true;
  renderActivationLinks(activation.activated_slug, activation.admin_pin, activation.trial_ends_at);
}

function renderActivationLinks(slug, adminPin, trialEndsAt) {
  const origin = window.location.origin + window.location.pathname;
  const adminUrl = `${origin}?empresa=${encodeURIComponent(slug)}&modo=admin`;
  const filaUrl = `${origin}?empresa=${encodeURIComponent(slug)}&modo=fila`;
  elements.activationResult.hidden = false;
  elements.activationResult.innerHTML = `
    <strong>Teste ativado</strong>
    <span>${trialStatus({ trial_ends_at: trialEndsAt })}</span>
    ${adminPin ? `<small>PIN do administrador: ${escapeHtml(adminPin)}</small>` : `<small>Use a senha enviada pelo FILA AI para acessar o administrador.</small>`}
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
    if (state.myTicketId) {
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
      status: "waiting",
      check_requested: false
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

      saveMyTicketId(data.id, fromSupabaseTicket(data));
      await refreshFromSupabase();
    } else {
      const localTicket = {
        ...ticket,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        calledAt: null,
        checkRequested: false
      };
      state.queue.push(localTicket);
      saveMyTicketId(localTicket.id, localTicket);
      persistLocalState();
    }

    elements.joinForm.reset();
    render();
    elements.myTicket.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.loginButton.addEventListener("click", async () => {
    const pin = elements.pinInput.value.trim();
    const adminPin = await validateAdminPinForCurrentCompany(pin);
    if (!adminPin) {
      if (elements.adminLoginMessage) {
        elements.adminLoginMessage.textContent = "PIN incorreto. Se voce esqueceu a senha, solicite novo PIN na Central do Dono.";
      } else {
        alert("PIN incorreto. Se voce esqueceu a senha, solicite ao dono do Fila Ai a redefinicao pela Central do Dono.");
      }
      return;
    }

    if (elements.adminLoginMessage) elements.adminLoginMessage.textContent = "";
    sessionStorage.setItem(adminAuthKey(COMPANY_SLUG), adminPin);
    state.company.adminPin = adminPin;
    saveAdminPasswordChoice();
    if (db) await refreshFromSupabase();
    openAdminPanel();
  });

  elements.logoutButton.addEventListener("click", logoutAdminSession);
  elements.logoutTopButton?.addEventListener("click", logoutAdminSession);
  document.querySelectorAll(".app-home-link").forEach((link) => {
    link.addEventListener("click", clearStoredAccessSessions);
  });
  elements.adminForgotButton?.addEventListener("click", handleAdminForgotPassword);

  elements.saveCompanyButton.addEventListener("click", saveCompanySettings);
  elements.adminAddForm.addEventListener("submit", addTicketFromAdmin);
  elements.billingRequestForm.addEventListener("submit", submitBillingRequest);
  elements.billingPlanInput?.addEventListener("change", renderBillingPaymentPanel);
  elements.companyLogoFileInput.addEventListener("change", () => handleBrandFileUpload("logo"));
  elements.companyCoverFileInput.addEventListener("change", () => handleBrandFileUpload("cover"));
  elements.menuPdfFileInput?.addEventListener("change", handleMenuPdfUpload);
  elements.productImageFileInput?.addEventListener("change", handleProductImageUpload);
  elements.saveMenuSettingsButton?.addEventListener("click", saveMenuSettings);
  elements.productForm?.addEventListener("submit", addProduct);
  elements.sendOrderButton?.addEventListener("click", submitTableOrder);
  elements.orderTableInput?.addEventListener("input", renderClientOrderStatus);
  elements.cartDrawerToggle?.addEventListener("click", openCartDrawer);
  elements.closeCartButton?.addEventListener("click", closeCartDrawer);
  elements.cartDrawerOverlay?.addEventListener("click", closeCartDrawer);
  elements.copyQueueLinkButton?.addEventListener("click", copyQueueLink);
  elements.changeAdminPinButton?.addEventListener("click", changeAdminPin);
  elements.suggestAdminPinButton?.addEventListener("click", suggestAdminPin);

  elements.callNextButton.addEventListener("click", callNextTicket);
  elements.finishCalledButton.addEventListener("click", openCalledTicketCheck);
  elements.resetButton.addEventListener("click", resetQueue);

  window.addEventListener("storage", () => {
    if (db) return;
    state = loadLocalState();
    render();
  });
}

function logoutAdminSession() {
  clearStoredAccessSessions();
  elements.pinInput.value = "";
  window.location.href = window.location.pathname;
}

function clearStoredAccessSessions() {
  localStorage.removeItem(SAVED_ACCESS_KEY);

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(ADMIN_SAVED_PREFIX)) {
      localStorage.removeItem(key);
    }
  }

  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith(ADMIN_AUTH_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  }
}

function saveAdminPasswordChoice() {
  const key = savedAdminKey(COMPANY_SLUG);
  if (!elements.adminRememberInput?.checked) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify({
    companySlug: COMPANY_SLUG,
    adminPin: state.company.adminPin,
    savedAt: new Date().toISOString()
  }));
}

function restoreSavedAdminPassword() {
  try {
    const saved = JSON.parse(localStorage.getItem(savedAdminKey(COMPANY_SLUG)) || "null");
    if (!saved?.adminPin || saved.adminPin !== state.company.adminPin) return;
    elements.adminRememberInput.checked = true;
    sessionStorage.setItem(adminAuthKey(COMPANY_SLUG), saved.adminPin);
  } catch {
    localStorage.removeItem(savedAdminKey(COMPANY_SLUG));
  }
}

function handleAdminForgotPassword() {
  alert("Se esqueceu o PIN, peça ao dono do Fila Aí para gerar um novo PIN na Central do Dono. Isso não apaga a fila nem os pedidos.");
}

async function validateAdminPinForCurrentCompany(pin) {
  if (!pin) return "";
  const pinHash = await sha256(pin);

  if (!db) {
    return pin === state.company.adminPin || pinHash === state.company.adminPin ? state.company.adminPin : "";
  }

  try {
    const { data: hashOk, error: hashError } = await db.rpc("fila_admin_authorized", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: pinHash
    });
    if (hashError) throw hashError;
    if (hashOk) return pinHash;

    const { data: plainOk, error: plainError } = await db.rpc("fila_admin_authorized", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: pin
    });
    if (plainError) throw plainError;
    return plainOk ? pin : "";
  } catch (error) {
    if (elements.adminLoginMessage) {
      elements.adminLoginMessage.textContent = `Nao consegui validar agora: ${error.message}`;
    }
    return "";
  }
}

function applyAccessMode() {
  if (!ACCESS_MODE) return;

  document.documentElement.dataset.accessMode = ACCESS_MODE;
  elements.tabsNav.hidden = true;
  showView(ACCESS_MODE === "admin" ? "adminView" : "clientView");
}

async function ensureCompany() {
  if (!db) return true;

  let data = null;
  const storedAdminPin = sessionStorage.getItem(adminAuthKey(COMPANY_SLUG));
  if (storedAdminPin) {
    const { data: adminData, error: adminError } = await db.rpc("fila_admin_company", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: storedAdminPin
    });
    if (adminError) throw adminError;
    data = adminData;
    if (!data?.[0]) {
      sessionStorage.removeItem(adminAuthKey(COMPANY_SLUG));
    }
  }

  if (!data?.[0]) {
    const { data: publicData, error: publicError } = await db.rpc("fila_public_company", {
      p_company_slug: COMPANY_SLUG
    });
    if (publicError) throw publicError;
    data = publicData;
  }

  if (data?.[0]) {
    state.company = fromSupabaseCompany(data[0]);
    companyAvailable = true;
    return true;
  }

  companyAvailable = false;
  state.company = {
    ...defaultCompany,
    slug: COMPANY_SLUG,
    name: "Restaurante indisponivel",
    queueOpen: false,
    ownerStatus: "bloqueado",
    paymentStatus: "indisponivel"
  };
  state.queue = [];
  state.currentTicketId = null;
  clearMyTicketId();
  clearStoredAccessSessions();
  return false;
}

async function refreshFromSupabase() {
  if (refreshInFlight) {
    queuedRefresh = true;
    return;
  }

  refreshInFlight = true;
  try {
    await loadBillingSettings();
    const companyExists = await ensureCompany();
    if (!companyExists) {
      fillCompanyForm();
      render();
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
    const refreshedTicket = state.queue.find((ticket) => ticket.id === state.myTicketId);
    if (refreshedTicket) {
      saveMyTicketId(refreshedTicket.id, refreshedTicket);
    }
    state.currentTicketId = state.queue.find((ticket) => ticket.status === "called")?.id || null;
    await refreshProFromSupabase();
    fillCompanyForm();
    restoreAdminAccess();
    render();
  } catch (error) {
    elements.publicQueue.innerHTML = `<li class="panel muted">Erro ao carregar dados: ${escapeHtml(error.message)}</li>`;
  } finally {
    refreshInFlight = false;
    if (queuedRefresh) {
      queuedRefresh = false;
      refreshFromSupabase();
    }
  }
}

async function refreshProFromSupabase() {
  const { data: products, error: productsError } = await db
    .from("fila_products")
    .select("*")
    .eq("company_slug", COMPANY_SLUG)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (!productsError && products?.length) {
    state.products = products.map(fromSupabaseProduct);
  }

  const { data: orders, error: ordersError } = await db
    .from("fila_orders")
    .select("*, fila_order_items(*)")
    .eq("company_slug", COMPANY_SLUG)
    .order("created_at", { ascending: true });

  if (!ordersError) {
    state.orders = (orders || []).map(fromSupabaseOrder);
  }
}

function openAdminPanel() {
  elements.loginPanel.hidden = true;
  elements.adminPanel.hidden = false;
  fillCompanyForm();
}

function restoreAdminAccess() {
  if (ACCESS_MODE !== "admin") return;
  restoreSavedAdminPassword();
  if (sessionStorage.getItem(adminAuthKey(COMPANY_SLUG)) !== state.company.adminPin) return;
  openAdminPanel();
}

function subscribeToRealtime() {
  if (realtimeChannel) return;

  const handleRealtimeChange = () => refreshFromSupabase();
  realtimeChannel = db.channel(`queue-${COMPANY_SLUG}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_tickets" }, refreshFromSupabase)
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_companies" }, handleRealtimeChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "queue_settings" }, handleRealtimeChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "fila_products" }, handleRealtimeChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "fila_orders" }, handleRealtimeChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "fila_order_items" }, handleRealtimeChange)
    .subscribe();

  realtimeFallbackTimer = window.setInterval(() => {
    if (!document.hidden) refreshFromSupabase();
  }, 20000);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshFromSupabase();
  });
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
    accentColor: "#F97316",
    legalName: elements.companyLegalNameInput?.value.trim() || "",
    companyDocument: elements.companyDocumentInput?.value.trim() || "",
    fiscalAddress: elements.companyFiscalAddressInput?.value.trim() || "",
    fiscalCity: elements.companyFiscalCityInput?.value.trim() || "",
    fiscalState: elements.companyFiscalStateInput?.value.trim().toUpperCase() || "",
    billingEmail: elements.companyBillingEmailInput?.value.trim() || "",
    contactName: elements.companyContactNameInput?.value.trim() || "",
    contactPhone: elements.companyContactPhoneInput?.value.trim() || "",
    menuEnabled: elements.menuEnabledInput?.checked || false,
    menuTitle: elements.menuTitleInput?.value.trim() || state.company.menuTitle || "Cardápio do restaurante",
    menuPdfUrl: normalizeUrl(elements.menuPdfUrlInput?.value, state.company.menuPdfUrl)
  };

  const legalValidation = validateLegalCompanyFields(company);
  if (legalValidation) {
    if (elements.legalConfigMessage) elements.legalConfigMessage.textContent = legalValidation;
    document.querySelector("#legalConfigBox")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (elements.legalConfigMessage) elements.legalConfigMessage.textContent = "";

  state.company = company;
  state.avgMinutes = Math.round((company.dwell2 + company.dwell4 + company.dwell6) / 3);

  if (db) {
    const { error } = await db.rpc("fila_update_company", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: adminSessionPin(),
      p_name: company.name,
      p_tables_2: company.tables2,
      p_tables_4: company.tables4,
      p_tables_6: company.tables6,
      p_used_2: company.used2,
      p_used_4: company.used4,
      p_used_6: company.used6,
      p_queue_open: company.queueOpen,
      p_open_time: company.openTime,
      p_close_time: company.closeTime,
      p_logo_url: company.logoUrl,
      p_cover_url: company.coverUrl,
      p_dwell_2: company.dwell2,
      p_dwell_4: company.dwell4,
      p_dwell_6: company.dwell6,
      p_theme_mode: company.themeMode,
      p_legal_name: company.legalName,
      p_company_document: company.companyDocument,
      p_fiscal_address: company.fiscalAddress,
      p_fiscal_city: company.fiscalCity,
      p_fiscal_state: company.fiscalState,
      p_billing_email: company.billingEmail,
      p_contact_name: company.contactName,
      p_contact_phone: company.contactPhone,
      p_menu_enabled: company.menuEnabled,
      p_menu_title: company.menuTitle,
      p_menu_pdf_url: company.menuPdfUrl
    });

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

function validateLegalCompanyFields(company) {
  const fields = [
    company.legalName,
    company.companyDocument,
    company.fiscalAddress,
    company.fiscalCity,
    company.fiscalState,
    company.billingEmail,
    company.contactName,
    company.contactPhone
  ];
  const hasAny = fields.some(Boolean);
  if (!hasAny) return "";

  if (fields.some((value) => !value)) {
    return "Complete todos os dados jurídicos para liberar contrato e cobrança.";
  }
  if (!isValidCnpj(company.companyDocument)) {
    return "Informe um CNPJ valido para contrato e cobrança.";
  }
  if (!/^[A-Z]{2}$/.test(company.fiscalState)) {
    return "Informe a UF com 2 letras. Ex: SP.";
  }
  if (!whatsappPhone(company.contactPhone)) {
    return "Informe um WhatsApp financeiro valido.";
  }
  return "";
}

async function saveMenuSettings() {
  const company = {
    ...state.company,
    menuEnabled: Boolean(elements.menuEnabledInput.checked),
    menuTitle: elements.menuTitleInput?.value.trim() || "Cardápio do restaurante",
    menuPdfUrl: normalizeUrl(elements.menuPdfUrlInput?.value, "")
  };

  state.company = company;

  if (db) {
    const { error } = await db.rpc("fila_update_menu", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: adminSessionPin(),
      p_menu_enabled: company.menuEnabled,
      p_menu_title: company.menuTitle,
      p_menu_pdf_url: company.menuPdfUrl
    });

    if (error) {
      elements.menuUploadStatus.textContent = `Não consegui salvar: ${error.message}`;
      return;
    }
    await refreshFromSupabase();
  } else {
    persistLocalState();
    render();
  }

  persistLocalState();
  elements.menuUploadStatus.textContent = "Status do Pro salvo. Produtos e pedidos ficam ativos quando o Pro estiver ligado.";
  render();
}

async function handleMenuPdfUpload() {
  const file = elements.menuPdfFileInput?.files?.[0];
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
  const currentHash = await sha256(current);
  if (current !== state.company.adminPin && currentHash !== state.company.adminPin) {
    elements.adminPinMessage.textContent = "PIN atual incorreto.";
    return;
  }
  if (next.length < 4) {
    elements.adminPinMessage.textContent = "Use uma senha com pelo menos 4 caracteres.";
    return;
  }

  const nextHash = await sha256(next);
  const previousAdminPin = state.company.adminPin;
  if (db) {
    const { error } = await db.rpc("fila_change_admin_pin", {
      p_company_slug: COMPANY_SLUG,
      p_current_admin_pin: previousAdminPin,
      p_next_admin_pin: nextHash
    });
    if (error) {
      elements.adminPinMessage.textContent = `Nao consegui alterar: ${error.message}`;
      return;
    }
    state.company.adminPin = nextHash;
    sessionStorage.setItem(adminAuthKey(COMPANY_SLUG), nextHash);
    await refreshFromSupabase();
  } else {
    state.company.adminPin = nextHash;
    persistLocalState();
  }

  elements.adminCurrentPinInput.value = "";
  elements.adminNewPinInput.value = "";
  elements.pinInput.value = "";
  elements.adminPinMessage.textContent = "PIN administrativo alterado.";
}

function suggestAdminPin() {
  const nextPin = randomPin();
  elements.adminNewPinInput.value = nextPin;
  elements.adminPinMessage.textContent = `PIN sugerido: ${nextPin}. Clique em Alterar PIN para salvar.`;
  elements.adminNewPinInput.focus();
}

async function handleBrandFileUpload(type) {
  const fileInput = type === "logo" ? elements.companyLogoFileInput : elements.companyCoverFileInput;
  const urlInput = type === "logo" ? elements.companyLogoUrlInput : elements.companyCoverUrlInput;
  const file = fileInput.files?.[0];
  if (!file) return;

  if (!db) {
    elements.brandUploadStatus.textContent = "Nao consegui enviar agora: armazenamento de imagens indisponivel. Tente novamente em alguns instantes.";
    fileInput.value = "";
    return;
  }

  const validationMessage = validateImageFile(file);
  if (validationMessage) {
    elements.brandUploadStatus.textContent = validationMessage;
    fileInput.value = "";
    return;
  }

  let dimensions;
  try {
    dimensions = await readImageDimensions(file);
  } catch (error) {
    elements.brandUploadStatus.textContent = "Nao consegui ler essa imagem. Escolha um arquivo JPG, PNG ou WebP valido.";
    fileInput.value = "";
    return;
  }

  const brandValidationMessage = validateBrandImageDimensions(type, dimensions);
  if (brandValidationMessage) {
    elements.brandUploadStatus.textContent = brandValidationMessage;
    fileInput.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Use uma imagem de até 5 MB.");
    fileInput.value = "";
    return;
  }

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
    elements.brandUploadStatus.textContent = uploadImageErrorMessage(error);
    return;
  }

  const { data } = db.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  urlInput.value = data.publicUrl;
  elements.brandUploadStatus.textContent = "Imagem enviada. Clique em Salvar configuração para aplicar no restaurante.";
}

async function handleProductImageUpload() {
  const file = elements.productImageFileInput?.files?.[0];
  if (!file) return;

  if (!db) {
    elements.menuUploadStatus.textContent = "Nao consegui enviar: o armazenamento ainda nao esta configurado. Use um link de imagem por enquanto.";
    elements.productImageFileInput.value = "";
    return;
  }

  const validationMessage = validateImageFile(file);
  if (validationMessage) {
    elements.menuUploadStatus.textContent = validationMessage;
    elements.productImageFileInput.value = "";
    return;
  }

  let dimensions;
  try {
    dimensions = await readImageDimensions(file);
  } catch (error) {
    elements.menuUploadStatus.textContent = "Nao consegui ler essa imagem. Tente outro arquivo.";
    elements.productImageFileInput.value = "";
    return;
  }

  const ratio = dimensions.width / dimensions.height;
  if (dimensions.width < 800 || dimensions.height < 500 || ratio < 1.25 || ratio > 2.2) {
    elements.menuUploadStatus.textContent = "Use foto horizontal com minimo 800x500 px. O ideal e 1600x1000 ou 1200x750.";
    elements.productImageFileInput.value = "";
    return;
  }

  elements.menuUploadStatus.textContent = "Enviando imagem do produto...";
  elements.productImageFileInput.disabled = true;

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${COMPANY_SLUG}/products/${Date.now()}-${slugify(file.name)}.${extension}`;
  const { error } = await db.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: true,
    contentType: file.type
  });

  elements.productImageFileInput.disabled = false;
  elements.productImageFileInput.value = "";

  if (error) {
    elements.menuUploadStatus.textContent = uploadImageErrorMessage(error);
    return;
  }

  const { data } = db.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  elements.productImageUrlInput.value = data.publicUrl;
  elements.menuUploadStatus.textContent = "Imagem pronta. Agora clique em Adicionar produto.";
}

function validateImageFile(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `Formato nao aceito. ${IMAGE_UPLOAD_RULES}`;
  }

  if (file.size > IMAGE_MAX_SIZE) {
    return `Arquivo muito pesado (${formatFileSize(file.size)}). ${IMAGE_UPLOAD_RULES}`;
  }

  return "";
}

function validateBrandImageDimensions(type, dimensions) {
  const rules = BRAND_IMAGE_RULES[type];
  if (!rules) return "";

  if (dimensions.width < rules.minWidth || dimensions.height < rules.minHeight) {
    return `Imagem pequena para ${rules.label}. ${rules.hint} ${IMAGE_UPLOAD_RULES}`;
  }

  if (type === "cover") {
    const ratio = dimensions.width / dimensions.height;
    if (ratio < 1.45) {
      return `A capa precisa ser horizontal. ${rules.hint}`;
    }
  }

  return "";
}

function uploadImageErrorMessage(error) {
  const message = error?.message || "erro desconhecido";
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("mime") || lowerMessage.includes("type") || lowerMessage.includes("content")) {
    return `O servidor recusou o formato da imagem. ${IMAGE_UPLOAD_RULES}`;
  }

  if (lowerMessage.includes("size") || lowerMessage.includes("payload") || lowerMessage.includes("too large")) {
    return `O servidor recusou porque o arquivo esta grande demais. ${IMAGE_UPLOAD_RULES}`;
  }

  if (lowerMessage.includes("bucket") || lowerMessage.includes("storage")) {
    return "Nao consegui acessar o armazenamento de imagens. Tente novamente em alguns segundos. Se continuar, chame o suporte do Fila Ai.";
  }

  if (lowerMessage.includes("permission") || lowerMessage.includes("policy") || lowerMessage.includes("unauthorized") || lowerMessage.includes("forbidden")) {
    return "Nao consegui enviar por permissao do armazenamento. Chame o suporte do Fila Ai para liberar o envio.";
  }

  return `Nao consegui enviar a imagem. ${IMAGE_UPLOAD_RULES} Detalhe tecnico: ${message}`;
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return "tamanho desconhecido";
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1).replace(".", ",")} MB`;
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Invalid image"));
    };
    image.src = url;
  });
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
    status: "waiting",
    check_requested: false
  };

  if (db) {
    const { error } = await db.rpc("fila_admin_add_ticket", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: adminSessionPin(),
      p_number: ticket.number,
      p_name: ticket.name,
      p_party_size: ticket.party_size
    });
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
      calledAt: null,
      checkRequested: false
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
    const { error } = await db.rpc("fila_admin_update_ticket", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: adminSessionPin(),
      p_ticket_id: waiting.id,
      p_status: "called"
    });

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

async function openCalledTicketCheck() {
  const current = getCurrentTicket();
  if (!current) return;
  await openTicketCheck(current.id);
}

async function openTicketCheck(ticketId) {
  const ticket = state.queue.find((item) => item.id === ticketId);
  if (!ticket || ticket.status !== "called") return;

  if (db) {
    const { error } = await db.rpc("fila_admin_update_ticket", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: adminSessionPin(),
      p_ticket_id: ticket.id,
      p_status: "done"
    });
    if (error) {
      alert(`Nao consegui abrir comanda: ${error.message}`);
      return;
    }
    saveMyTicketId(ticket.id, { ...ticket, status: "done" });
    await refreshFromSupabase();
  } else {
    ticket.status = "done";
    state.currentTicketId = null;
    saveMyTicketId(ticket.id, ticket);
    persistLocalState();
  }

  render();
}

async function requestTicketCheck(ticketId) {
  const ticket = state.queue.find((item) => item.id === ticketId);
  if (!ticket || ticket.status !== "called") return;

  if (db) {
    const { error } = await db
      .from("queue_tickets")
      .update({ check_requested: true })
      .eq("id", ticket.id)
      .eq("company_slug", COMPANY_SLUG)
      .eq("status", "called");
    if (error) {
      alert(`Nao consegui solicitar comanda: ${error.message}`);
      return;
    }
    await refreshFromSupabase();
  } else {
    ticket.checkRequested = true;
    persistLocalState();
  }

  render();
}

async function leaveQueue(ticketId) {
  const ticket = state.queue.find((item) => item.id === ticketId) || getMyTicket();
  if (!ticket || ticket.status === "done") {
    clearMyTicketId();
    render();
    return;
  }
  if (!confirm("Sair da fila agora?")) return;

  if (db && state.queue.some((item) => item.id === ticket.id)) {
    const { error } = await db
      .from("queue_tickets")
      .delete()
      .eq("id", ticket.id)
      .eq("company_slug", COMPANY_SLUG);
    if (error) {
      alert(`Nao consegui sair da fila: ${error.message}`);
      return;
    }
    if (ticket.status === "called") {
      await changeUsedTables(partyBucket(ticket.partySize), -1);
    }
    clearMyTicketId();
    await refreshFromSupabase();
  } else if (db) {
    clearMyTicketId();
    await refreshFromSupabase();
  } else {
    state.queue = state.queue.filter((item) => item.id !== ticket.id);
    if (ticket.status === "called") {
      changeUsedTablesLocal(partyBucket(ticket.partySize), -1);
    }
    if (state.currentTicketId === ticket.id) state.currentTicketId = null;
    clearMyTicketId();
    persistLocalState();
  }

  render();
}

async function resetQueue() {
  if (!confirm("Limpar toda a fila desta empresa?")) return;

  if (db) {
    const { error } = await db.rpc("fila_admin_reset_queue", {
      p_company_slug: COMPANY_SLUG,
      p_admin_pin: adminSessionPin()
    });
    if (error) {
      alert(`Não consegui limpar: ${error.message}`);
      return;
    }
    clearMyTicketId();
    state.currentTicketId = null;
    await refreshFromSupabase();
  } else {
    state.queue = [];
    state.currentTicketId = null;
    clearMyTicketId();
    state.company.used2 = 0;
    state.company.used4 = 0;
    state.company.used6 = 0;
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

      const { error } = await db.rpc("fila_admin_update_ticket", {
        p_company_slug: COMPANY_SLUG,
        p_admin_pin: adminSessionPin(),
        p_ticket_id: id,
        p_status: "called"
      });
      if (error) {
        alert(`Não consegui chamar: ${error.message}`);
        return;
      }
      await changeUsedTables(partyBucket(ticket.partySize), 1);
      playCallSound();
      notifyCalled(ticket);
    }

    if (action === "done") {
      await openTicketCheck(id);
      return;
    }

    if (action === "remove") {
      const { error } = await db.rpc("fila_admin_remove_ticket", {
        p_company_slug: COMPANY_SLUG,
        p_admin_pin: adminSessionPin(),
        p_ticket_id: id
      });
      if (error) alert(`Não consegui remover: ${error.message}`);
      if (state.myTicketId === id) {
        clearMyTicketId();
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
    ticket.checkRequested = false;
    state.currentTicketId = ticket.id;
    changeUsedTablesLocal(partyBucket(ticket.partySize), 1);
    playCallSound();
    notifyCalled(ticket);
  }

  if (action === "done") {
    await openTicketCheck(id);
    return;
  }

  if (action === "remove") {
    state.queue = state.queue.filter((item) => item.id !== id);
    if (state.currentTicketId === id) state.currentTicketId = null;
    if (state.myTicketId === id) clearMyTicketId();
  }

  persistLocalState();
  render();
}

function showView(viewId) {
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewId));
  elements.views.forEach((view) => view.classList.toggle("is-active", view.id === viewId));
  updateTopLabel();
}

function showAdminPanel(panelId, options = {}) {
  const targetPanel = normalizeAdminTab(panelId);
  if (!targetPanel) return;

  elements.adminTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.adminTab === targetPanel));
  elements.adminTabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === targetPanel));
  updateAdminTabUrl(targetPanel, options);
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
  renderClientProducts();
  renderCart();
  renderClientOrderStatus();
  renderQueueQr();
  renderMyTicket();
  renderPublicQueue();
  renderAdminQueue();
  renderTableStatus();
  renderAdminProducts();
  renderAdminOrders();
  renderKitchenBoard();
  renderChecks();
}

function renderBillingStatus() {
  if (!elements.billingStatusText) return;

  const trialText = state.company.trialEndsAt
    ? trialStatus({ trial_ends_at: state.company.trialEndsAt })
    : "sem periodo de teste definido";
  const payment = state.company.paymentStatus || "pendente";
  const ownerStatus = state.company.ownerStatus || "teste";
  const trialExpired = isTrialExpired({ trial_ends_at: state.company.trialEndsAt });
  const companyPlan = planFromValue(state.company.monthlyPrice);
  const quote = billingQuote(companyPlan, "mensal");

  elements.billingStatusText.textContent = trialExpired
    ? `Teste encerrado. Plano ${quote.planName}: ${quote.monthlyText}/mes. Para continuar usando o FILA AI, regularize pagamento e contrato quando escolher anual.`
    : `Status: ${ownerStatus}. Pagamento: ${payment}. ${trialText}. Plano atual: ${quote.planName} (${quote.monthlyText}/mes).`;
  elements.billingRequestForm.hidden = payment === "pago" || ownerStatus === "ativo";
  renderBillingPaymentPanel();
  elements.billingRequestMessage.textContent = payment === "pago"
    ? "Plano ativo. Obrigado por continuar usando o FILA AÍ."
    : "";
}

function renderBillingPaymentPanel() {
  if (!elements.billingPaymentPanel || !elements.billingPlanInput) return;
  const plan = elements.billingPlanInput.value;
  const isAnnual = plan === "anual";
  const billing = state.billingSettings || DEFAULT_BILLING_SETTINGS;
  const companyPlan = planFromValue(state.company.monthlyPrice);
  const quote = billingQuote(companyPlan, plan);
  const dueDate = billingDueDate();
  const pixMessage = `Pix FILA AI\nChave: ${billing.pixKey}\nFavorecido: ${billing.pixName}\nRestaurante: ${state.company.name}\nPlano: ${quote.planName} ${isAnnual ? "Anual" : "Mensal"}\nValor: ${quote.totalText}`;

  elements.billingPaymentPanel.hidden = false;
  elements.billingPaymentPanel.innerHTML = isAnnual
    ? `
      <div class="billing-summary-card">
        <strong>${escapeHtml(quote.planName)} anual</strong>
        <span>${escapeHtml(quote.totalText)} por 12 meses</span>
        <small>Contrato preenchido + pagamento liberam a continuidade do acesso.</small>
      </div>
      ${annualContractHtml(quote)}
      <div class="billing-payment-actions">
        <label class="billing-contract-accept">
          <input type="checkbox" data-contract-accept />
          Li e aceito o contrato anual preenchido acima.
        </label>
        <a href="${escapeHtml(billing.contractLink)}" target="_blank" rel="noreferrer">Baixar contrato modelo</a>
        <button type="button" data-accept-contract>Assinar contrato e pagar agora</button>
      </div>
    `
    : `
      <div class="billing-summary-card">
        <strong>${escapeHtml(quote.planName)} mensal</strong>
        <span>${escapeHtml(quote.totalText)}</span>
        <small>Vencimento sugerido: ${escapeHtml(dueDate)}.</small>
      </div>
      <div>
        <p>Use a chave Pix abaixo e envie o comprovante para liberar ou renovar o acesso.</p>
        <code>${escapeHtml(billing.pixKey)}</code>
        <small>Favorecido: ${escapeHtml(billing.pixName)}</small>
      </div>
      <div class="billing-payment-actions">
        <button type="button" data-copy-pix="${escapeHtml(pixMessage)}">Copiar Pix</button>
        <a href="${escapeHtml(billing.bankLink)}" target="_blank" rel="noreferrer">Pagar mensal</a>
      </div>
    `;

  elements.billingPaymentPanel.querySelector("[data-copy-pix]")?.addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(event.currentTarget.dataset.copyPix).catch(() => {});
    event.currentTarget.textContent = "Pix copiado";
  });
  elements.billingPaymentPanel.querySelector("[data-accept-contract]")?.addEventListener("click", acceptAnnualContractAndPay);
}

async function submitBillingRequest(event) {
  event.preventDefault();

  if (elements.billingPlanInput.value === "anual") {
    await acceptAnnualContractAndPay();
    return;
  }

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

  elements.billingRequestMessage.textContent = "Pedido enviado. O FILA AÍ vai chamar você para finalizar o pagamento.";
  renderBillingPaymentPanel();
  await refreshFromSupabase();
}

function annualContractHtml(quote, contractCompany = state.company, acceptedAt = new Date(), isAccepted = true) {
  const billing = state.billingSettings || DEFAULT_BILLING_SETTINGS;
  const contractDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(acceptedAt || Date.now()));
  const contractNumber = `FILA-${contractCompany.slug || state.company.slug}-${new Date(acceptedAt || Date.now()).getFullYear()}`.toUpperCase();
  const companyName = contractCompany.name || state.company.name;
  const legalName = contractCompany.legalName || state.company.legalName || companyName;
  const companyDocument = contractCompany.companyDocument || state.company.companyDocument || "CNPJ nao informado";
  const fiscalAddress = contractCompany.fiscalAddress || state.company.fiscalAddress || "Endereco fiscal nao informado";
  const cityState = [contractCompany.fiscalCity || state.company.fiscalCity, contractCompany.fiscalState || state.company.fiscalState]
    .filter(Boolean)
    .join(" - ");
  const billingEmail = contractCompany.billingEmail || state.company.billingEmail || "";
  const responsible = contractCompany.contactName || "Responsavel financeiro cadastrado";
  const phone = contractCompany.contactPhone || "WhatsApp financeiro cadastrado";

  return `
    <article class="billing-contract-card">
      <div class="billing-contract-header">
        <strong>Contrato anual preenchido</strong>
        <span>${escapeHtml(contractNumber)}</span>
      </div>
      <dl>
        <div>
          <dt>Contratante</dt>
          <dd>${escapeHtml(legalName)} (${escapeHtml(companyName)})</dd>
        </div>
        <div>
          <dt>CNPJ</dt>
          <dd>${escapeHtml(companyDocument)}</dd>
        </div>
        <div>
          <dt>Endereco fiscal</dt>
          <dd>${escapeHtml(fiscalAddress)}${cityState ? ` - ${escapeHtml(cityState)}` : ""}</dd>
        </div>
        <div>
          <dt>Responsavel</dt>
          <dd>${escapeHtml(responsible)}</dd>
        </div>
        <div>
          <dt>Contato financeiro</dt>
          <dd>${escapeHtml(phone)}${billingEmail ? ` - ${escapeHtml(billingEmail)}` : ""}</dd>
        </div>
        <div>
          <dt>Plano</dt>
          <dd>${escapeHtml(quote.planName)} anual - ${escapeHtml(quote.totalText)} por 12 meses</dd>
        </div>
      </dl>
      <p>Ao aceitar, o restaurante contrata o FILA AI pelo periodo de 12 meses, com acesso ao sistema, suporte operacional e recursos do plano selecionado.</p>
      <div class="billing-signature-grid">
        <div>
          <small>Contratada</small>
          <strong>Fila Ai</strong>
          <span>CNPJ/CPF: ${escapeHtml(billing.pixKey)}</span>
          <em>Assinado digitalmente pela empresa em ${escapeHtml(contractDate)}</em>
        </div>
        <div>
          <small>Contratante</small>
          <strong>${escapeHtml(companyName)}</strong>
          <span>${escapeHtml(responsible)}</span>
          <em>${isAccepted ? `Assinatura registrada pelo aceite digital em ${escapeHtml(contractDate)}.` : "Minuta ainda sem aceite digital registrado."}</em>
        </div>
      </div>
    </article>
  `;
}

async function acceptAnnualContractAndPay() {
  const accepted = elements.billingPaymentPanel?.querySelector("[data-contract-accept]")?.checked;
  if (!accepted) {
    elements.billingRequestMessage.textContent = "Marque o aceite do contrato anual antes de pagar.";
    return;
  }

  const billing = state.billingSettings || DEFAULT_BILLING_SETTINGS;
  const companyPlan = planFromValue(state.company.monthlyPrice);
  const quote = billingQuote(companyPlan, "anual");
  const paymentWindow = window.open("", "_blank");
  const payload = {
    company_slug: state.company.slug,
    company_name: state.company.name,
    contact_phone: state.company.contactPhone || "",
    plan: "anual",
    status: "contrato aceito"
  };

  if (db) {
    const { error } = await db.from("subscription_requests").insert(payload);
    if (error) {
      paymentWindow?.close();
      elements.billingRequestMessage.textContent = `Nao consegui registrar o contrato: ${error.message}`;
      return;
    }
  }

  elements.billingRequestMessage.textContent = `Contrato anual aceito. Abrindo pagamento de ${quote.totalText}.`;
  if (paymentWindow) {
    paymentWindow.location.href = billing.bankLink;
  } else {
    window.open(billing.bankLink, "_blank", "noreferrer");
  }
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
  if (elements.companyLegalNameInput) elements.companyLegalNameInput.value = state.company.legalName || "";
  if (elements.companyDocumentInput) elements.companyDocumentInput.value = state.company.companyDocument || "";
  if (elements.companyFiscalAddressInput) elements.companyFiscalAddressInput.value = state.company.fiscalAddress || "";
  if (elements.companyFiscalCityInput) elements.companyFiscalCityInput.value = state.company.fiscalCity || "";
  if (elements.companyFiscalStateInput) elements.companyFiscalStateInput.value = state.company.fiscalState || "";
  if (elements.companyBillingEmailInput) elements.companyBillingEmailInput.value = state.company.billingEmail || "";
  if (elements.companyContactNameInput) elements.companyContactNameInput.value = state.company.contactName || "";
  if (elements.companyContactPhoneInput) elements.companyContactPhoneInput.value = state.company.contactPhone || "";
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

function renderClientProducts() {
  if (!elements.clientOrderPanel || !elements.clientProductList) return;
  const activeProducts = getActiveProducts();
  const checkTicket = getCheckTicket();
  const ticket = getMyTicket();
  const allowDirectOrder = ACCESS_MODE !== "fila";
  const canOrder = Boolean(allowDirectOrder || checkTicket);
  const showMenuProducts = Boolean(state.company.menuEnabled && activeProducts.length && (allowDirectOrder || ticket));
  elements.clientOrderPanel.hidden = !showMenuProducts;
  elements.clientOrderPanel.classList.toggle("is-browsing-menu", showMenuProducts && !canOrder);
  if (elements.cartDrawerToggle) elements.cartDrawerToggle.hidden = !canOrder;
  if (!canOrder) {
    closeCartDrawer();
  }
  if (!showMenuProducts) {
    lastClientStage = getClientStage();
  }
  if (!showMenuProducts) return;

  const title = elements.clientOrderPanel.querySelector(".section-title h2");
  const description = elements.clientOrderPanel.querySelector(".section-title .muted");
  if (title) title.textContent = canOrder ? "Cardápio da mesa" : "Menu do restaurante";
  if (description) {
    description.textContent = canOrder
      ? "Escolha os itens e envie seu pedido para a comanda."
      : "Consulte os produtos enquanto acompanha sua posição na fila.";
  }

  if (canOrder) {
    applyTicketCheckToOrderForm();
    maybeFocusOrderingStage();
  } else {
    lastClientStage = getClientStage();
  }

  elements.clientProductList.innerHTML = activeProducts.map((product) => `
    <article class="product-card">
      ${productImageMarkup(product)}
      <div class="product-card-body">
        <span>${escapeHtml(product.category || "Cardapio")}</span>
        <strong>${escapeHtml(product.name)}</strong>
        <p>${escapeHtml(product.description || "Produto disponivel para pedido na mesa.")}</p>
      </div>
      <div>
        <b>${formatCurrency(product.price)}</b>
      </div>
      <button type="button" ${canOrder ? `data-add-product="${escapeHtml(product.id)}"` : "disabled"}>${canOrder ? "Adicionar" : "Liberado na comanda"}</button>
    </article>
  `).join("");

  elements.clientProductList.querySelectorAll("[data-add-product]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addProduct));
  });
}

function applyTicketCheckToOrderForm() {
  if (!elements.orderTableInput || !elements.orderCustomerInput) return;

  const ticket = getCheckTicket();
  if (!ticket) {
    elements.orderTableInput.readOnly = false;
    elements.orderCustomerInput.readOnly = false;
    return;
  }

  const checkLabel = ticketCheckLabel(ticket);
  elements.orderTableInput.value = checkLabel;
  elements.orderCustomerInput.value = ticket.name || elements.orderCustomerInput.value;
  elements.orderTableInput.readOnly = true;
  elements.orderCustomerInput.readOnly = true;
}

function getClientStage() {
  const ticket = getMyTicket();
  if (!ticket) return "no-ticket";
  if (getCheckTicket()) return "ordering";
  if (ticket.status === "called") return ticket.checkRequested ? "check-requested" : "called";
  return "waiting";
}

function maybeFocusOrderingStage() {
  const stage = getClientStage();
  if (lastClientStage && lastClientStage !== "ordering" && stage === "ordering") {
    window.setTimeout(() => {
      elements.clientOrderPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  }
  lastClientStage = stage;
}

function openCartDrawer() {
  elements.cartDrawer?.classList.add("is-open");
  if (elements.cartDrawerOverlay) elements.cartDrawerOverlay.hidden = false;
}

function closeCartDrawer() {
  elements.cartDrawer?.classList.remove("is-open");
  if (elements.cartDrawerOverlay) elements.cartDrawerOverlay.hidden = true;
}

function renderCart() {
  if (!elements.cartItems || !elements.cartTotal) return;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal();
  if (elements.cartCount) elements.cartCount.textContent = String(itemCount);
  if (elements.cartFabTotal) elements.cartFabTotal.textContent = formatCurrency(total);
  elements.cartDrawerToggle?.classList.toggle("has-items", itemCount > 0);

  if (!cart.length) {
    elements.cartItems.innerHTML = `<p class="muted">Nenhum item selecionado.</p>`;
    elements.cartTotal.textContent = formatCurrency(0);
    return;
  }

  elements.cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <span>${item.quantity}x ${escapeHtml(item.name)}</span>
      <strong>${formatCurrency(item.price * item.quantity)}</strong>
      <button type="button" data-cart-remove="${escapeHtml(item.id)}">Remover</button>
    </div>
  `).join("");
  elements.cartTotal.textContent = formatCurrency(total);
  elements.cartItems.querySelectorAll("[data-cart-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.cartRemove));
  });
}

function renderClientOrderStatus() {
  if (!elements.clientOrderStatus) return;
  const table = elements.orderTableInput?.value.trim();
  const relevantOrders = state.orders
    .filter((order) => !table || order.table === table)
    .filter((order) => order.status !== "closed")
    .slice(-4)
    .reverse();

  if (!relevantOrders.length) {
    elements.clientOrderStatus.innerHTML = "";
    return;
  }

  elements.clientOrderStatus.innerHTML = `
    <h3>Ultimos pedidos</h3>
    ${relevantOrders.map((order) => `
      <article class="order-status-card client-order-history-card" style="background:#111827 !important;color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;border-color:rgba(31,41,55,0.2) !important;">
        <strong class="client-order-history-title" style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;opacity:1 !important;">${escapeHtml(checkDisplayLabel(order.table))} - ${orderStatusLabel(order.status)}</strong>
        <span class="client-order-history-items" style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;opacity:1 !important;">${order.items.map((item) => `${item.quantity}x ${escapeHtml(item.name)}`).join(", ")}</span>
        <small class="client-order-history-meta" style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;opacity:1 !important;font-weight:800;">${formatCurrency(order.total)} - ${formatTime(order.createdAt)}</small>
      </article>
    `).join("")}
  `;
}

function renderAdminProducts() {
  if (!elements.adminProductList) return;
  if (!state.products.length) {
    elements.adminProductList.innerHTML = `<p class="muted">Nenhum produto cadastrado.</p>`;
    return;
  }

  elements.adminProductList.innerHTML = state.products.map((product) => `
    <article class="product-admin-item${product.active ? "" : " is-off"}">
      ${productThumbMarkup(product)}
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(product.category || "Sem categoria")} - ${formatCurrency(product.price)} - ${Number(product.prepMinutes) || 10} min</span>
        <small>${escapeHtml(product.description || "")}</small>
      </div>
      <div class="mini-actions">
        <button type="button" data-product-toggle="${escapeHtml(product.id)}">${product.active ? "Pausar" : "Ativar"}</button>
        <button type="button" data-product-remove="${escapeHtml(product.id)}">Remover</button>
      </div>
    </article>
  `).join("");

  elements.adminProductList.querySelectorAll("[data-product-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleProduct(button.dataset.productToggle));
  });
  elements.adminProductList.querySelectorAll("[data-product-remove]").forEach((button) => {
    button.addEventListener("click", () => removeProduct(button.dataset.productRemove));
  });
}

function productImageMarkup(product) {
  const url = normalizeUrl(product.imageUrl, "");
  if (!url) {
    return `<div class="product-image-placeholder" aria-hidden="true">${escapeHtml(productInitials(product.name))}</div>`;
  }

  return `<img class="product-image" src="${escapeHtml(url)}" alt="${escapeHtml(product.name)}" loading="lazy" />`;
}

function productThumbMarkup(product) {
  const url = normalizeUrl(product.imageUrl, "");
  if (!url) {
    return `<div class="product-thumb" aria-hidden="true">${escapeHtml(productInitials(product.name))}</div>`;
  }

  return `<img class="product-thumb" src="${escapeHtml(url)}" alt="" loading="lazy" />`;
}

function productInitials(name) {
  return String(name || "Produto")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";
}

function renderAdminOrders() {
  if (!elements.adminOrdersList) return;
  const orders = [...state.orders].reverse();
  if (!orders.length) {
    elements.adminOrdersList.innerHTML = `<p class="muted">Nenhum pedido enviado ainda.</p>`;
    return;
  }

  elements.adminOrdersList.innerHTML = orders.map(orderCard).join("");
  bindOrderButtons(elements.adminOrdersList);
}

function renderKitchenBoard() {
  if (!elements.kitchenBoard) return;
  elements.kitchenBoard.innerHTML = ORDER_STATUS_FLOW.map((status) => {
    const orders = state.orders.filter((order) => order.status === status);
    return `
      <section class="kitchen-column">
        <h3><span>${ORDER_STATUS_LABELS[status]}</span><b>${orders.length}</b></h3>
        ${orders.length ? orders.map(orderCard).join("") : `<p class="muted">Sem pedidos.</p>`}
      </section>
    `;
  }).join("");
  bindOrderButtons(elements.kitchenBoard);
}

function renderChecks() {
  if (!elements.checksList) return;
  const openOrders = state.orders.filter((order) => order.status !== "closed");
  if (!openOrders.length) {
    elements.checksList.innerHTML = `<p class="muted">Nenhuma comanda aberta.</p>`;
    return;
  }

  const byTable = openOrders.reduce((acc, order) => {
    acc[order.table] = acc[order.table] || [];
    acc[order.table].push(order);
    return acc;
  }, {});

  elements.checksList.innerHTML = Object.entries(byTable).map(([table, orders]) => {
    const total = orders.reduce((sum, order) => sum + order.total, 0);
    const items = orders.flatMap((order) => order.items.map((item) => `${item.quantity}x ${escapeHtml(item.name)}`));
    return `
      <article class="check-card">
        <div>
          <strong>${escapeHtml(checkDisplayLabel(table))}</strong>
          <span>${orders.length} pedido(s) - ${items.join(", ")}</span>
        </div>
        <div>
          <b>${formatCurrency(total)}</b>
          <button type="button" data-close-check="${escapeHtml(table)}">Fechar comanda</button>
        </div>
      </article>
    `;
  }).join("");

  elements.checksList.querySelectorAll("[data-close-check]").forEach((button) => {
    button.addEventListener("click", () => closeCheck(button.dataset.closeCheck));
  });
}

function orderCard(order) {
  const nextStatus = nextOrderStatus(order.status);
  return `
    <article class="order-card">
      <div>
        <strong>${escapeHtml(checkDisplayLabel(order.table))} - ${escapeHtml(order.customer || "Cliente")}</strong>
        <span>${order.items.map((item) => `${item.quantity}x ${escapeHtml(item.name)}`).join(", ")}</span>
        <small>${orderStatusLabel(order.status)} - ${formatCurrency(order.total)} - ${formatTime(order.createdAt)}</small>
      </div>
      <div class="mini-actions">
        ${nextStatus ? `<button type="button" data-order-next="${escapeHtml(order.id)}">${ORDER_STATUS_LABELS[nextStatus]}</button>` : ""}
      </div>
    </article>
  `;
}

function bindOrderButtons(root) {
  root.querySelectorAll("[data-order-next]").forEach((button) => {
    button.addEventListener("click", () => advanceOrder(button.dataset.orderNext));
  });
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
  elements.myTicket.hidden = !ticket && ACCESS_MODE === "fila";
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
  const statusText = ticket.status === "called" ? "Sua vez chegou" : ticket.status === "done" ? "Comanda aberta" : "Aguardando";
  const activeProducts = getActiveProducts();
  const menuUrl = normalizeUrl(state.company.menuPdfUrl, "");
  const hasOrderingMenu = Boolean(state.company.menuEnabled && activeProducts.length);
  const checkNotice = ticket.status === "done"
    ? `<p class="called-note">Atendimento iniciado. O cardapio abriu abaixo e seus pedidos entram na comanda ${escapeHtml(ticketCheckLabel(ticket))}.</p>`
    : "";
  const requestPendingNotice = ticket.status === "called" && ticket.checkRequested
    ? `<p class="called-note">Comanda solicitada. Aguarde a recepcao liberar para fazer pedidos.</p>`
    : "";
  const checkRequest = ticket.status === "called" && !ticket.checkRequested
    ? `<button class="primary request-check-button" type="button" data-request-check="${escapeHtml(ticket.id)}">Solicitar comanda</button>`
    : "";
  const calledNotice = ticket.status === "called"
    ? `<p class="called-note">Sua vez chegou. Voce tem 10 minutos para comparecer a recepcao.</p>`
    : "";
  const menuButton = hasOrderingMenu
    ? `<button class="ghost ticket-menu-button" type="button" data-ticket-menu>Ver menu</button>`
    : menuUrl
      ? `<a class="ghost ticket-menu-button" href="${escapeHtml(menuUrl)}" target="_blank" rel="noreferrer">Ver menu</a>`
      : "";
  const leaveButton = ticket.status !== "done"
    ? `<button class="text-button ticket-leave-button" type="button" data-leave-ticket="${escapeHtml(ticket.id)}">Sair da fila</button>`
    : "";

  elements.myTicket.innerHTML = `
    <div class="ticket-minimal">
      <h2>${ticket.status === "called" ? "Sua vez chegou!" : "Sua vez esta chegando!"}</h2>
      <span class="ticket-ahead-label">Faltam</span>
      <div class="ticket-progress-ring" aria-label="${ahead} grupos na frente">
        <strong>${String(ahead).padStart(2, "0")}</strong>
      </div>
      <span class="ticket-groups-label">${ahead === 1 ? "grupo" : "grupos"}</span>
      <small>Tempo estimado<br><b>${formatDuration(wait)}</b></small>
      <button class="primary ticket-details-button" type="button" data-ticket-details>Detalhes da fila</button>
      ${menuButton}
      ${leaveButton}
    </div>
    ${calledNotice}
    ${requestPendingNotice}
    ${checkRequest}
    ${checkNotice}
    <div class="ticket-grid ticket-details-grid" hidden>
      <div class="metric"><strong>${formatNumber(ticket.number)}</strong><span>sua senha</span></div>
      <div class="metric"><strong>${ahead}</strong><span>grupos na frente</span></div>
      <div class="metric wait-metric"><strong>${formatDuration(wait)}</strong><span>espera estimada</span></div>
    </div>
  `;

  elements.myTicket.querySelector("[data-ticket-details]")?.addEventListener("click", () => {
    const details = elements.myTicket.querySelector(".ticket-details-grid");
    if (!details) return;
    details.hidden = !details.hidden;
  });
  elements.myTicket.querySelector("[data-ticket-menu]")?.addEventListener("click", () => {
    const target = elements.clientOrderPanel && !elements.clientOrderPanel.hidden
      ? elements.clientOrderPanel
      : elements.clientMenuPanel;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  elements.myTicket.querySelector("[data-leave-ticket]")?.addEventListener("click", async (event) => {
    await leaveQueue(event.currentTarget.dataset.leaveTicket);
  });
  elements.myTicket.querySelector("[data-request-check]")?.addEventListener("click", async (event) => {
    await requestTicketCheck(event.currentTarget.dataset.requestCheck);
  });
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
    const checkRequestLabel = ticket.checkRequested ? " - Solicitou comanda" : "";
    return `
      <div class="admin-item${calledClass}">
        <span class="place">${formatNumber(ticket.number)}</span>
        <span class="person">
          <strong>${escapeHtml(ticket.name)}</strong>
          <span>${partyLabel(ticket.partySize)} - ${statusLabel(ticket.status)}${checkRequestLabel} - ${formatDuration(estimateWait(ticket))}</span>
        </span>
        <span class="mini-actions">
          <button type="button" data-action="call" data-id="${ticket.id}" ${canCall ? "" : "disabled"}>Chamar</button>
          <button type="button" data-action="done" data-id="${ticket.id}" ${ticket.status === "called" ? "" : "disabled"}>Abrir comanda</button>
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
        <div class="table-card-head">
          <div class="table-people" aria-hidden="true">${seatDots(bucket)}</div>
          <strong>${tableLabel(bucket)}</strong>
        </div>
        <div class="table-availability">
          <span class="availability">${status.available}</span>
          <div>
            <b>${status.available === 1 ? "mesa livre" : "mesas livres"}</b>
            <small>de ${status.total} ${status.total === 1 ? "mesa" : "mesas"}</small>
          </div>
        </div>
        <div class="table-stats">
          <span><b>${status.used}</b> ${status.used === 1 ? "ocupada" : "ocupadas"}</span>
          <span><b>${waiting}</b> aguardando</span>
        </div>
        <div class="table-actions">
          <button class="table-action-free" type="button" data-table-action="free" data-bucket="${bucket}" ${status.used <= 0 ? "disabled" : ""}>Liberar mesa</button>
          <button class="table-action-occupy" type="button" data-table-action="occupy" data-bucket="${bucket}" ${status.used >= status.total ? "disabled" : ""}>Marcar ocupada</button>
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
  const brand = "#F97316";
  const brandDark = "#C2410C";
  const brandSoft = themeMode === "dark" ? "#431407" : "#FFF7ED";
  const heroAccent = "rgba(249, 115, 22, 0.62)";

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
  const ticket = state.queue.find((item) => item.id === state.myTicketId);
  if (ticket) return ticket;
  const snapshot = loadSavedTicketSnapshot();
  if (snapshot?.id === state.myTicketId) return snapshot;
  if (!state.myTicketId) return null;
  return {
    id: state.myTicketId,
    companySlug: COMPANY_SLUG,
    number: 0,
    name: "Cliente",
    service: "Fila ativa",
    partySize: 2,
    status: "waiting",
    checkRequested: false,
    createdAt: new Date().toISOString(),
    calledAt: null
  };
}

function getCheckTicket() {
  const ticket = getMyTicket();
  return ticket && ["called", "done"].includes(ticket.status) ? ticket : null;
}

function ticketCheckLabel(ticket) {
  return `Fila ${formatNumber(ticket.number)}`;
}

function ticketForCheckLabel(label) {
  return state.queue.find((ticket) => ticketCheckLabel(ticket) === label);
}

function checkDisplayLabel(label) {
  return String(label || "").startsWith("Fila ") ? `Comanda ${label}` : `Mesa ${label}`;
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

  const { error } = await db.rpc("fila_set_used_tables", {
    p_company_slug: COMPANY_SLUG,
    p_admin_pin: adminSessionPin(),
    p_bucket: bucket,
    p_delta: delta
  });

  if (error) {
    alert(`Não consegui atualizar mesas: ${error.message}`);
  }
}

function adminSessionPin() {
  return sessionStorage.getItem(adminAuthKey(COMPANY_SLUG)) || (!db ? state.company.adminPin || defaultCompany.adminPin : "");
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
    checkRequested: ticket.check_requested || false,
    createdAt: ticket.created_at,
    calledAt: ticket.called_at
  };
}

function fromSupabaseProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category || "Cardapio",
    description: product.description || "",
    price: Number(product.price) || 0,
    prepMinutes: product.prep_minutes || 10,
    imageUrl: product.image_url || "",
    active: product.active ?? true
  };
}

function toSupabaseProduct(product) {
  return {
    company_slug: COMPANY_SLUG,
    name: product.name,
    category: product.category || "Cardapio",
    description: product.description || "",
    price: product.price,
    prep_minutes: product.prepMinutes || 10,
    image_url: product.imageUrl || "",
    active: product.active ?? true
  };
}

function fromSupabaseOrder(order) {
  const items = (order.fila_order_items || []).map((item) => ({
    id: item.product_id || item.id,
    name: item.name,
    quantity: item.quantity,
    price: Number(item.unit_price) || 0
  }));

  return {
    id: order.id,
    companySlug: order.company_slug || COMPANY_SLUG,
    table: order.table_label,
    customer: order.customer_name,
    items,
    total: Number(order.total) || items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: order.status,
    createdAt: order.created_at
  };
}

function fromSupabaseCompany(company) {
  return {
    slug: company.slug,
    name: company.name,
    adminPin: company.admin_pin || (!db ? defaultCompany.adminPin : ""),
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
    accentColor: company.accent_color || "#F97316",
    ownerStatus: company.owner_status || "teste",
    paymentStatus: company.payment_status || "pendente",
    legalName: company.legal_name || "",
    companyDocument: company.company_document || "",
    fiscalAddress: company.fiscal_address || "",
    fiscalCity: company.fiscal_city || "",
    fiscalState: company.fiscal_state || "",
    billingEmail: company.billing_email || "",
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
    legal_name: company.legalName || "",
    company_document: company.companyDocument || "",
    fiscal_address: company.fiscalAddress || "",
    fiscal_city: company.fiscalCity || "",
    fiscal_state: company.fiscalState || "",
    billing_email: company.billingEmail || "",
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
      queue: stored?.queue || [],
      products: stored?.products?.length ? stored.products : DEFAULT_PRODUCTS.map((product) => ({ ...product })),
      orders: stored?.orders || [],
      billingSettings: { ...DEFAULT_BILLING_SETTINGS, ...(stored?.billingSettings || {}) }
    };
  } catch {
    return { ...defaultState };
  }
}

function persistLocalState() {
  localStorage.setItem(`${STORAGE_KEY}-${COMPANY_SLUG}`, JSON.stringify(state));
  if (state.myTicketId) {
    saveMyTicketId(state.myTicketId);
  } else {
    clearMyTicketId();
  }
}

async function addProduct(event) {
  event.preventDefault();
  const name = elements.productNameInput.value.trim();
  const category = elements.productCategoryInput.value.trim() || "Cardapio";
  const price = parseMoney(elements.productPriceInput.value);
  const prepMinutes = clamp(Number(elements.productPrepInput.value) || 10, 1, 180);
  const description = elements.productDescriptionInput.value.trim();
  const imageUrl = normalizeUrl(elements.productImageUrlInput?.value.trim(), "");

  if (!name || price <= 0) {
    elements.menuUploadStatus.textContent = "Informe nome e preco do produto.";
    return;
  }

  const product = {
    id: `${slugify(name)}-${Date.now()}`,
    name,
    category,
    price,
    prepMinutes,
    description,
    imageUrl,
    active: true
  };

  if (db) {
    const { data, error } = await db
      .from("fila_products")
      .insert(toSupabaseProduct(product))
      .select()
      .single();
    if (error) {
      elements.menuUploadStatus.textContent = `Nao consegui adicionar: ${error.message}`;
      return;
    }
    state.products.push(fromSupabaseProduct(data));
    await db
      .from("queue_companies")
      .update({ menu_enabled: true, monthly_price: "pro", updated_at: new Date().toISOString() })
      .eq("slug", COMPANY_SLUG);
  } else {
    state.products.push(product);
  }

  state.company.menuEnabled = true;
  elements.menuEnabledInput.checked = true;
  elements.productForm.reset();
  if (elements.productImageFileInput) elements.productImageFileInput.value = "";
  elements.menuUploadStatus.textContent = "Produto adicionado ao cardapio Pro.";
  persistLocalState();
  render();
}

async function toggleProduct(id) {
  const current = state.products.find((product) => product.id === id);
  if (!current) return;
  if (db) {
    const { error } = await db
      .from("fila_products")
      .update({ active: !current.active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("company_slug", COMPANY_SLUG);
    if (error) return alert(`Nao consegui atualizar produto: ${error.message}`);
  }
  state.products = state.products.map((product) => (
    product.id === id ? { ...product, active: !product.active } : product
  ));
  persistLocalState();
  render();
}

async function removeProduct(id) {
  if (db) {
    const { error } = await db
      .from("fila_products")
      .delete()
      .eq("id", id)
      .eq("company_slug", COMPANY_SLUG);
    if (error) return alert(`Nao consegui remover produto: ${error.message}`);
  }
  state.products = state.products.filter((product) => product.id !== id);
  cart = cart.filter((item) => item.id !== id);
  persistLocalState();
  render();
}

function addToCart(id) {
  const product = state.products.find((item) => item.id === id && item.active);
  if (!product) return;
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      quantity: 1
    });
  }
  renderCart();
  if (ACCESS_MODE === "fila") closeCartDrawer();
  pulseCartSummary();
}

function removeFromCart(id) {
  cart = cart
    .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
    .filter((item) => item.quantity > 0);
  renderCart();
}

function pulseCartSummary() {
  if (!elements.cartDrawerToggle) return;
  elements.cartDrawerToggle.classList.remove("is-updated");
  void elements.cartDrawerToggle.offsetWidth;
  elements.cartDrawerToggle.classList.add("is-updated");
}

async function submitTableOrder() {
  const ticket = getCheckTicket();
  const table = ticket ? ticketCheckLabel(ticket) : elements.orderTableInput.value.trim();
  const customer = ticket ? ticket.name : elements.orderCustomerInput.value.trim();

  if (!table || !customer) {
    elements.orderMessage.textContent = "Informe mesa ou comanda e nome para enviar o pedido.";
    return;
  }

  if (!cart.length) {
    elements.orderMessage.textContent = "Adicione pelo menos um item ao carrinho.";
    return;
  }

  const order = {
    id: crypto.randomUUID(),
    companySlug: COMPANY_SLUG,
    table,
    customer,
    items: cart.map((item) => ({ ...item })),
    total: cartTotal(),
    status: "new",
    createdAt: new Date().toISOString()
  };

  if (db) {
    const { data, error } = await db
      .from("fila_orders")
      .insert({
        company_slug: COMPANY_SLUG,
        table_label: table,
        customer_name: customer,
        status: "new",
        total: order.total
      })
      .select()
      .single();

    if (error) {
      elements.orderMessage.textContent = `Nao consegui enviar pedido: ${error.message}`;
      return;
    }

    const itemsPayload = order.items.map((item) => ({
      order_id: data.id,
      product_id: isUuid(item.id) ? item.id : null,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price
    }));
    const { error: itemsError } = await db.from("fila_order_items").insert(itemsPayload);
    if (itemsError) {
      elements.orderMessage.textContent = `Pedido criado, mas os itens falharam: ${itemsError.message}`;
      return;
    }

    order.id = data.id;
    order.createdAt = data.created_at;
    state.orders.push(order);
  } else {
    state.orders.push(order);
  }

  cart = [];
  closeCartDrawer();
  elements.orderMessage.textContent = `Pedido enviado para a cozinha. Status: ${orderStatusLabel(order.status)}.`;
  persistLocalState();
  if (db) await refreshProFromSupabase();
  render();
}

async function advanceOrder(id) {
  const current = state.orders.find((order) => order.id === id);
  const next = current ? nextOrderStatus(current.status) : null;
  if (!next) return;
  if (db) {
    const { error } = await db
      .from("fila_orders")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("company_slug", COMPANY_SLUG);
    if (error) return alert(`Nao consegui atualizar pedido: ${error.message}`);
  }
  state.orders = state.orders.map((order) => {
    if (order.id !== id) return order;
    return { ...order, status: next };
  });
  persistLocalState();
  render();
}

async function closeCheck(table) {
  const checkTicket = ticketForCheckLabel(table);
  if (db) {
    const { error } = await db
      .from("fila_orders")
      .update({ status: "closed", updated_at: new Date().toISOString() })
      .eq("company_slug", COMPANY_SLUG)
      .eq("table_label", table)
      .neq("status", "closed");
    if (error) return alert(`Nao consegui fechar comanda: ${error.message}`);
    if (checkTicket) await changeUsedTables(partyBucket(checkTicket.partySize), -1);
  } else if (checkTicket) {
    changeUsedTablesLocal(partyBucket(checkTicket.partySize), -1);
  }
  state.orders = state.orders.map((order) => (
    order.table === table ? { ...order, status: "closed" } : order
  ));
  persistLocalState();
  render();
}

function getActiveProducts() {
  return state.products.filter((product) => product.active);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function nextOrderStatus(status) {
  const index = ORDER_STATUS_FLOW.indexOf(status);
  return index >= 0 ? ORDER_STATUS_FLOW[index + 1] : null;
}

function orderStatusLabel(status) {
  if (status === "closed") return "Comanda fechada";
  return ORDER_STATUS_LABELS[status] || status || "Novo";
}

function parseMoney(value) {
  const normalized = String(value || "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  return Number(normalized) || 0;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value) || 0);
}

function formatTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
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
  if (!companyAvailable) {
    return "Restaurante nao encontrado ou removido. Volte para a pagina inicial e entre com o usuario correto.";
  }
  if (state.company.ownerStatus === "bloqueado") {
    return "Fila bloqueada pelo Fila Ai. Procure o suporte para reativar este restaurante.";
  }
  if (state.company.trialEndsAt && state.company.paymentStatus !== "pago" && new Date(state.company.trialEndsAt).getTime() < Date.now()) {
    return "Periodo de teste encerrado. Regularize o financeiro para reabrir a fila.";
  }
  if (!state.company.queueOpen) {
    return "Fila fechada no painel do restaurante. Para abrir, entre em Administrativo > Configurar e altere Fila para Aberta.";
  }
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

function normalizeContractLink(value) {
  const candidate = String(value || "").trim();
  if (!candidate || candidate === LEGACY_CONTRACT_LINK) return DEFAULT_BILLING_SETTINGS.contractLink;
  return normalizeUrl(candidate, DEFAULT_BILLING_SETTINGS.contractLink);
}

function normalizeTime(value, fallback) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || "") ? value : fallback;
}

function whatsappPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function isValidCnpj(value) {
  const cnpj = String(value || "").replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (length) => {
    const weights = length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = cnpj.slice(0, length).split("").reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13]);
}

async function sha256(value) {
  const data = new TextEncoder().encode(String(value));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function saveAccessChoice(type, user, passwordHash) {
  if (!elements.accessRememberInput?.checked) {
    localStorage.removeItem(SAVED_ACCESS_KEY);
    return;
  }

  localStorage.setItem(SAVED_ACCESS_KEY, JSON.stringify({
    type,
    user,
    savedAt: new Date().toISOString()
  }));
}

function fillSavedAccess() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_ACCESS_KEY) || "null");
    if (!saved?.user) return;
    elements.accessUserInput.value = saved.user;
    elements.accessRememberInput.checked = true;
  } catch {
    localStorage.removeItem(SAVED_ACCESS_KEY);
  }
}

async function trySavedAccessLogin() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(SAVED_ACCESS_KEY) || "null");
  } catch {
    localStorage.removeItem(SAVED_ACCESS_KEY);
    return;
  }

  if (!saved?.user || !saved?.passwordHash) return;
  setAccessMessage("Entrando com acesso salvo...");

  try {
    if (saved.type === "restaurant") {
      const { data, error } = await db.rpc("fila_admin_authorized", {
        p_company_slug: saved.user,
        p_admin_pin: saved.passwordHash
      });
      if (error) throw error;
      if (data) {
        sessionStorage.setItem(adminAuthKey(saved.user), saved.passwordHash);
        window.location.href = `${window.location.pathname}?empresa=${encodeURIComponent(saved.user)}&modo=admin`;
        return;
      }
    }
  } catch {
    // If saved access cannot be checked, keep the manual login available.
  }

  localStorage.removeItem(SAVED_ACCESS_KEY);
  elements.accessPasswordInput.value = "";
  elements.accessRememberInput.checked = false;
  setAccessMessage("Acesso salvo expirou. Entre novamente.", "error");
}

function adminAuthKey(slug) {
  return `${ADMIN_AUTH_PREFIX}-${slug}`;
}

function savedAdminKey(slug) {
  return `${ADMIN_SAVED_PREFIX}-${slug}`;
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

function isTrialExpired(company) {
  return Boolean(company.trial_ends_at && new Date(company.trial_ends_at).getTime() < Date.now());
}

function statusLabel(status) {
  const labels = {
    active: "ativo",
    blocked: "bloqueado",
    called: "Chamado",
    contacted: "contatado",
    "contrato aceito": "contrato aceito",
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

function aiStatusLabel(status) {
  const labels = {
    detectado: "Detectado",
    triagem: "Em triagem",
    investigando: "Investigando",
    reproduzindo: "Reproduzindo",
    causa_identificada: "Causa identificada",
    corrigindo: "Corrigindo",
    testando: "Testando",
    verificando_regressao: "Verificando regressao",
    aguardando_aprovacao: "Aguardando sua aprovacao",
    aprovado: "Aprovado",
    deploy: "Em publicacao",
    monitoramento_pos_deploy: "Monitoramento",
    resolvido: "Resolvido",
    rejeitado: "Rejeitado",
    reaberto: "Reaberto"
  };
  return labels[status] || status || "Detectado";
}

function aiSeverityLabel(severity) {
  const labels = {
    critica: "Critica",
    alta: "Alta",
    media: "Media",
    baixa: "Baixa"
  };
  return labels[severity] || "Media";
}

function aiModuleLabel(moduleName) {
  const labels = {
    fila: "Fila",
    login: "Login",
    admin: "Administrador",
    financeiro: "Financeiro",
    contrato: "Contrato",
    cardapio: "Cardapio",
    pedidos: "Pedidos",
    dono: "Central do dono",
    geral: "Geral"
  };
  return labels[moduleName] || moduleName || "Geral";
}

function aiRiskLabel(risk) {
  const labels = {
    baixo: "Baixo",
    medio: "Medio",
    alto: "Alto"
  };
  return labels[risk] || "Medio";
}

function aiDefaultImpact(severity) {
  if (severity === "critica") return "Pode impedir o uso principal do sistema e precisa de atencao imediata.";
  if (severity === "alta") return "Pode atrapalhar cliente ou restaurante e deve ser investigado com prioridade.";
  if (severity === "baixa") return "Impacto limitado, mas deve ser acompanhado para evitar repeticao.";
  return "Pode afetar parte da operacao e precisa de investigacao antes de correcao.";
}

function planFromValue(value) {
  return value === "pro" ? "pro" : "essencial";
}

function billingQuote(planValue, cycle) {
  const plan = PLAN_CATALOG[planFromValue(planValue)] || PLAN_CATALOG.essencial;
  const isAnnual = cycle === "anual";
  return {
    planName: plan.label,
    features: plan.features,
    monthlyText: formatCurrency(plan.monthly),
    totalText: formatCurrency(isAnnual ? plan.yearly : plan.monthly)
  };
}

function billingDueDate() {
  const base = state.company.trialEndsAt && !isTrialExpired({ trial_ends_at: state.company.trialEndsAt })
    ? new Date(state.company.trialEndsAt)
    : new Date();
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(base);
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
  return Array.from({ length: count }, () => `<span class="seat-person"></span>`).join("") + (bucket === 6 ? `<b>+</b>` : "");
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

function titleFromSlug(value) {
  return String(value || "Restaurante")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeAccessMode(value) {
  const mode = slugify(value);
  if (["acesso", "login", "entrar", "area-administrativa", "administracao"].includes(mode)) return "acesso";
  if (["ativar", "activate", "token", "teste"].includes(mode)) return "ativar";
  if (["dono", "owner", "master", "central"].includes(mode)) return "dono";
  if (["admin", "administrativo", "gestao", "gestor"].includes(mode)) return "admin";
  if (["fila", "cliente", "qr", "publico"].includes(mode)) return "fila";
  return "";
}

function normalizeAdminTab(value) {
  const tab = slugify(value);
  const panels = {
    fila: "adminQueuePanel",
    queue: "adminQueuePanel",
    adminqueuepanel: "adminQueuePanel",
    mesas: "adminTablesPanel",
    mesa: "adminTablesPanel",
    tables: "adminTablesPanel",
    admintablespanel: "adminTablesPanel",
    cardapio: "adminMenuPanel",
    menu: "adminMenuPanel",
    produtos: "adminMenuPanel",
    adminmenupanel: "adminMenuPanel",
    pedidos: "adminOrdersPanel",
    pedido: "adminOrdersPanel",
    orders: "adminOrdersPanel",
    adminorderspanel: "adminOrdersPanel",
    cozinha: "adminKitchenPanel",
    kitchen: "adminKitchenPanel",
    preparo: "adminKitchenPanel",
    adminkitchenpanel: "adminKitchenPanel",
    comandas: "adminChecksPanel",
    comanda: "adminChecksPanel",
    checks: "adminChecksPanel",
    admincheckspanel: "adminChecksPanel",
    financeiro: "adminBillingPanel",
    pagamento: "adminBillingPanel",
    contrato: "adminBillingPanel",
    billing: "adminBillingPanel",
    adminbillingpanel: "adminBillingPanel",
    configurar: "adminConfigPanel",
    configuracoes: "adminConfigPanel",
    settings: "adminConfigPanel",
    adminconfigpanel: "adminConfigPanel"
  };

  return panels[tab] || "";
}

function adminTabSlug(panelId) {
  const slugs = {
    adminQueuePanel: "fila",
    adminTablesPanel: "mesas",
    adminMenuPanel: "cardapio",
    adminOrdersPanel: "pedidos",
    adminKitchenPanel: "cozinha",
    adminChecksPanel: "comandas",
    adminBillingPanel: "financeiro",
    adminConfigPanel: "configurar"
  };

  return slugs[panelId] || "";
}

function updateAdminTabUrl(panelId, options = {}) {
  if (ACCESS_MODE !== "admin" || !window.history?.replaceState) return;

  const tab = adminTabSlug(panelId);
  if (!tab) return;

  const nextParams = new URLSearchParams(window.location.search);
  nextParams.set("empresa", COMPANY_SLUG);
  nextParams.set("modo", "admin");
  nextParams.set("aba", tab);

  const nextUrl = `${window.location.pathname}?${nextParams.toString()}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
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
