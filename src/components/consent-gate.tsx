import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  ALL_DENIED,
  ALL_GRANTED,
  CONSENT_CATEGORIES,
  CONSENT_LABELS,
  NOTICE_VERSION,
  OPEN_SETTINGS_EVENT,
  clearRecord,
  detectRegion,
  readRecord,
  writeRecord,
  type ConsentChoice,
} from "../lib/consent";

type Panel = "closed" | "banner" | "settings";

export function ConsentGate() {
  const [panel, setPanel] = useState<Panel>("closed");
  const [draft, setDraft] = useState<ConsentChoice>(ALL_DENIED);
  const [region, setRegion] = useState("");
  const fallback = useRef<ConsentChoice>({ ...ALL_DENIED });

  useEffect(() => {
    let alive = true;

    detectRegion().then((info) => {
      if (!alive) return;
      setRegion(info.loc);
      fallback.current = info.requiresConsent ? { ...ALL_DENIED } : { ...ALL_GRANTED };
      if (!readRecord() && info.requiresConsent) setPanel("banner");
    });

    const openSettings = () => {
      const current = readRecord();
      setDraft({ ...(current ? current.choice : fallback.current) });
      setPanel("settings");
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);

    return () => {
      alive = false;
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
    };
  }, []);

  if (panel === "closed") return null;

  const isBanner = panel === "banner";

  const decide = (choice: ConsentChoice) => {
    writeRecord(choice, isBanner ? "banner" : "settings", region);
    setPanel("closed");
  };

  return (
    <div className="fixed inset-x-0 bottom-[5.75rem] z-[60] px-4 sm:bottom-6 sm:px-6">
      <div
        role="dialog"
        aria-modal={isBanner ? undefined : "true"}
        aria-label="Privacidade e medidas de anúncio"
        className="mx-auto max-w-3xl rounded-3xl border border-glass-strong bg-glass-strong/95 p-5 shadow-2xl backdrop-blur-2xl sm:p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">
          {isBanner ? "Privacidade e medidas de anúncio" : "Configurações de privacidade"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          {isBanner ? (
            <>
              Podemos registrar como você chegou e o que clicou aqui para medir as campanhas de anúncio.
              Nada é medido antes de você escolher, e você muda de ideia quando quiser.{" "}
              <Link to="/privacidade" className="font-semibold text-brand-deep underline underline-offset-2">
                Ver política de privacidade
              </Link>
            </>
          ) : (
            <>
              Escolha o que pode ser medido. As alterações valem na hora e podem ser revistas a qualquer momento.
            </>
          )}
        </p>

        {isBanner ? null : (
          <ul className="mt-4 space-y-3">
            {CONSENT_CATEGORIES.map((category) => (
              <li
                key={category}
                className="flex items-start justify-between gap-4 rounded-2xl border border-glass-strong bg-glass px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{CONSENT_LABELS[category].title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink/60">{CONSENT_LABELS[category].text}</p>
                </div>
                <label className="mt-0.5 inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-deep">
                  <input
                    type="checkbox"
                    checked={draft[category] === "granted"}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        [category]: event.target.checked ? "granted" : "denied",
                      }))
                    }
                    className="size-4 accent-brand"
                  />
                  Permitir
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {isBanner ? (
            <>
              <button
                type="button"
                onClick={() => decide(ALL_GRANTED)}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-deep"
              >
                Aceitar e medir
              </button>
              <button
                type="button"
                onClick={() => decide(ALL_DENIED)}
                className="inline-flex items-center justify-center rounded-full border border-glass-strong px-6 py-3 text-sm font-semibold text-ink transition hover:bg-glass"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => setPanel("settings")}
                className="text-sm font-semibold text-brand-deep underline underline-offset-2 sm:ml-auto"
              >
                Escolher em detalhe
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => decide(draft)}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-deep"
              >
                Salvar escolha
              </button>
              <button
                type="button"
                onClick={() => setPanel("closed")}
                className="inline-flex items-center justify-center rounded-full border border-glass-strong px-6 py-3 text-sm font-semibold text-ink transition hover:bg-glass"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  clearRecord();
                  setPanel("closed");
                }}
                className="text-sm font-semibold text-brand-deep underline underline-offset-2 sm:ml-auto"
              >
                Retirar minha escolha
              </button>
            </>
          )}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-ink/45">
          Escolha registrada em {new Date().toLocaleDateString("pt-BR")} · aviso {NOTICE_VERSION}
        </p>
      </div>
    </div>
  );
}
