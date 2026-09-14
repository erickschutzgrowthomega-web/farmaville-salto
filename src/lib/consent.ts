/**
 * Consent handling for ad measurement (route: regional banner).
 *
 * The default denies every ad signal until the visitor decides. Only visitors in
 * regions that require consent see the banner; everyone else keeps the site as
 * it is. Every saved choice is stored with the moment it was made and the
 * version of the notice that was shown, so the record answers which visitor
 * accepted, when, and under which wording.
 */

export type ConsentDecision = "granted" | "denied";

export type ConsentCategory =
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "analytics_storage";

export type ConsentChoice = Record<ConsentCategory, ConsentDecision>;

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
];

export const CONSENT_LABELS: Record<ConsentCategory, { title: string; text: string }> = {
  ad_storage: {
    title: "Medição de anúncios",
    text: "Registra o resultado das campanhas, como o clique em Falar pelo WhatsApp.",
  },
  ad_user_data: {
    title: "Dados enviados aos anúncios",
    text: "Compartilha informações do visitante com a plataforma de anúncios. Fica desligado, a menos que você ligue.",
  },
  ad_personalization: {
    title: "Anúncios personalizados",
    text: "Usa a navegação para escolher quais anúncios mostrar para cada pessoa.",
  },
  analytics_storage: {
    title: "Medição do site",
    text: "Conta visitas e mostra quais partes da página as pessoas usam.",
  },
};

export const ALL_DENIED: ConsentChoice = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

export const ALL_GRANTED: ConsentChoice = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};

/** Bump when the wording shown in the banner changes, so the record points at the right text. */
export const NOTICE_VERSION = "2026-09-14";

const STORAGE_KEY = "farma-ville:consent:v1";
const REGION_CACHE_KEY = "farma-ville:region:v1";

export const CHANGE_EVENT = "farma-ville:consent-change";
export const OPEN_SETTINGS_EVENT = "farma-ville:open-cookie-settings";

/** Regions that require consent before ad measurement: EEA, United Kingdom, Switzerland. */
const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "SE", "IS", "LI",
  "NO", "GB", "UK", "CH",
]);

export type ConsentRecord = {
  choice: ConsentChoice;
  decidedAt: string;
  noticeVersion: string;
  source: "banner" | "settings";
  region: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function store(kind: "local" | "session"): Storage | null {
  if (!isBrowser()) return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function normaliseChoice(input: unknown): ConsentChoice {
  const source = (input ?? {}) as Record<string, unknown>;
  const choice = { ...ALL_DENIED };
  for (const category of CONSENT_CATEGORIES) {
    if (source[category] === "granted") choice[category] = "granted";
  }
  return choice;
}

export function readRecord(): ConsentRecord | null {
  const storage = store("local");
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.choice) return null;
    return {
      choice: normaliseChoice(parsed.choice),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
      noticeVersion: typeof parsed.noticeVersion === "string" ? parsed.noticeVersion : "",
      source: parsed.source === "settings" ? "settings" : "banner",
      region: typeof parsed.region === "string" ? parsed.region : "",
    };
  } catch {
    return null;
  }
}

export function writeRecord(
  choice: ConsentChoice,
  source: ConsentRecord["source"],
  region = "",
): ConsentRecord {
  const record: ConsentRecord = {
    choice: normaliseChoice(choice),
    decidedAt: new Date().toISOString(),
    noticeVersion: NOTICE_VERSION,
    source,
    region,
  };
  store("local")?.setItem(STORAGE_KEY, JSON.stringify(record));
  announceChange();
  return record;
}

/** Withdrawing removes the stored decision; the visitor is asked again. */
export function clearRecord(): void {
  store("local")?.removeItem(STORAGE_KEY);
  announceChange();
}

function announceChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openCookieSettings(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export type RegionInfo = { loc: string; requiresConsent: boolean };

const UNKNOWN_REGION: RegionInfo = { loc: "UNKNOWN", requiresConsent: true };

let regionPromise: Promise<RegionInfo> | null = null;

async function lookupRegion(): Promise<RegionInfo> {
  const cached = store("session")?.getItem(REGION_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as RegionInfo;
      if (parsed && typeof parsed.requiresConsent === "boolean") return parsed;
    } catch {
      // fall through to a fresh lookup
    }
  }

  let info = UNKNOWN_REGION;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const response = await fetch("/cdn-cgi/trace", { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (response.ok) {
      const text = await response.text();
      const loc = (/loc=(\S+)/.exec(text)?.[1] ?? "").trim().toUpperCase();
      // Unknown or Tor exit: ask rather than assume the visitor is unregulated.
      if (loc && loc !== "XX" && loc !== "T1") {
        info = { loc, requiresConsent: CONSENT_REGIONS.has(loc) };
      }
    }
  } catch {
    info = UNKNOWN_REGION;
  }

  store("session")?.setItem(REGION_CACHE_KEY, JSON.stringify(info));
  return info;
}

/** The region lookup is cached for the page visit; consent itself is read afresh on send. */
export function detectRegion(): Promise<RegionInfo> {
  if (!regionPromise) regionPromise = lookupRegion();
  return regionPromise;
}

export type ResolvedConsent = {
  choice: ConsentChoice;
  record: ConsentRecord | null;
  region: RegionInfo;
  /** The choice used when the visitor has not decided: denied in consent regions, granted elsewhere. */
  fallback: ConsentChoice;
};

export async function resolveConsent(): Promise<ResolvedConsent> {
  const region = await detectRegion();
  const fallback = region.requiresConsent ? { ...ALL_DENIED } : { ...ALL_GRANTED };
  const record = readRecord();
  return { choice: record ? record.choice : fallback, record, region, fallback };
}

/**
 * Pushes the current signals to the data layer. Must run before the container
 * loads, and again on every change, so a later refusal applies immediately.
 */
export function pushConsent(choice: ConsentChoice): void {
  if (!isBrowser()) return;
  const dataLayer = ((window as unknown as { dataLayer?: unknown[] }).dataLayer ??= []);
  dataLayer.push({ consent: { ...choice } });
  dataLayer.push({ event: "consent_update" });
}

/** Keeps other open tabs in sync with a decision made in this one. */
export function watchConsentChanges(onChange: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handle = () => onChange();
  window.addEventListener(CHANGE_EVENT, handle);
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  });
  return () => {
    window.removeEventListener(CHANGE_EVENT, handle);
  };
}
