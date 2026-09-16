/**
 * Google Ads tag (gtag.js) install, gated on consent.
 *
 * The tag is only fetched once the ad signals are granted: in a region that
 * requires consent, a visitor who has not accepted yet never loads it, and an
 * event that was refused is dropped rather than queued for later.
 */

import {
  ALL_DENIED,
  pushConsent,
  readRecord,
  resolveConsent,
  watchConsentChanges,
  type ConsentChoice,
  type ResolvedConsent,
} from "./consent";

/** The Google Ads account that measures the campaign. */
const GOOGLE_ADS_ID =
  (import.meta.env["VITE_GOOGLE_ADS_ID"] as string | undefined)?.trim() || "AW-18438615676";

/** The Google Tag Manager container. */
export const GTM_CONTAINER_ID =
  (import.meta.env["VITE_GTM_CONTAINER_ID"] as string | undefined)?.trim() || "GTM-K554R96K";

/** The "Contato Whatsapp" conversion: a click on any WhatsApp button. */
const WHATSAPP_CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/mWPeCK34__ccEPzkm9hE`;

type DataLayer = unknown[];

declare global {
  interface Window {
    dataLayer?: DataLayer;
    gtag?: (...args: unknown[]) => void;
  }
}

function dataLayer(): DataLayer {
  return (window.dataLayer ??= []);
}

/** The official gtag stub: queues calls in the data layer until the library loads. */
function gtag(...args: unknown[]): void {
  // eslint-disable-next-line prefer-rest-params
  dataLayer().push(args);
}

let liveChoice: ConsentChoice = { ...ALL_DENIED };
let fallbackChoice: ConsentChoice = { ...ALL_DENIED };
let tagRequested = false;
let gtmRequested = false;
let started = false;

function canMeasure(): boolean {
  return liveChoice.ad_storage === "granted";
}

function loadTag(): void {
  if (tagRequested || !GOOGLE_ADS_ID || typeof document === "undefined") return;
  tagRequested = true;

  window.gtag = window.gtag ?? gtag;
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`;
  document.head.appendChild(script);
}

function loadGtm(): void {
  if (gtmRequested || !GTM_CONTAINER_ID || typeof document === "undefined") return;
  gtmRequested = true;

  dataLayer().push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
  document.head.appendChild(script);
}

/**
 * Sends a measured event. Refused or undecided visitors are never counted, and
 * nothing refused earlier is replayed after a later acceptance.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !canMeasure()) return;
  window.gtag?.("event", name, params);
}

function applyChoice(choice: ConsentChoice): void {
  liveChoice = choice;
  pushConsent(choice);
  if (canMeasure()) {
    loadTag();
    loadGtm();
  }
}

/** Sets the deny-by-default signals, resolves the region, then loads the tag if allowed. */
export async function startAnalytics(): Promise<void> {
  if (started || typeof window === "undefined") return;
  started = true;

  window.gtag = window.gtag ?? gtag;
  pushConsent(liveChoice);

  let resolved: ResolvedConsent;
  try {
    resolved = await resolveConsent();
  } catch {
    pushConsent(liveChoice);
    return;
  }

  fallbackChoice = resolved.fallback;
  applyChoice(resolved.choice);

  const refresh = () => {
    const record = readRecord();
    applyChoice(record ? record.choice : fallbackChoice);
  };
  watchConsentChanges(refresh);
}

/**
 * Reports every click on a WhatsApp button as a `whatsapp_click` event, so the
 * tag can send it to the campaign without touching each link.
 */
export function trackOutboundClicks(): void {
  if (typeof document === "undefined") return;
  document.addEventListener(
    "click",
    (event) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.href ?? "";
      if (!/wa\.me\/|api\.whatsapp\.com\//i.test(href)) return;
      const label =
        (anchor.getAttribute("aria-label") || anchor.textContent || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 60) || "WhatsApp";
      trackEvent("whatsapp_click", {
        link_text: label,
        page_path: window.location.pathname,
        page_location: window.location.href,
      });
      if (canMeasure()) {
        window.gtag?.("event", "conversion", { send_to: WHATSAPP_CONVERSION_SEND_TO });
      }
    },
    true,
  );
}
