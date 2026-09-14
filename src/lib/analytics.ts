/**
 * Google Tag Manager install, gated on consent.
 *
 * The container is only fetched once the ad signals are granted: in a region
 * that requires consent, a visitor who has not accepted yet never loads it, and
 * an event that was refused is dropped rather than queued for later.
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

/** The container that carries the campaign's measurement. */
const GTM_CONTAINER_ID =
  (import.meta.env["VITE_GTM_CONTAINER_ID"] as string | undefined)?.trim() || "GTM-K554R96K";

type DataLayer = unknown[];

function dataLayer(): DataLayer {
  const win = window as unknown as { dataLayer?: DataLayer };
  return (win.dataLayer ??= []);
}

let liveChoice: ConsentChoice = { ...ALL_DENIED };
let fallbackChoice: ConsentChoice = { ...ALL_DENIED };
let containerRequested = false;
let started = false;

function canMeasure(): boolean {
  return liveChoice.ad_storage === "granted";
}

function loadContainer(): void {
  if (containerRequested || !GTM_CONTAINER_ID || typeof document === "undefined") return;
  containerRequested = true;
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
  dataLayer().push({ event: name, ...params });
}

function applyChoice(choice: ConsentChoice): void {
  liveChoice = choice;
  pushConsent(choice);
  if (canMeasure()) loadContainer();
}

/** Sets the deny-by-default signals, resolves the region, then loads the container if allowed. */
export async function startAnalytics(): Promise<void> {
  if (started || typeof window === "undefined") return;
  started = true;

  dataLayer();
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
 * container can send it to the campaign without touching each link.
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
    },
    true,
  );
}
