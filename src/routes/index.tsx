import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Cross,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Smartphone,
  Truck,
} from "lucide-react";
import locationMap from "../assets/farma-ville-map.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Farmácia em Salto SP | Farma Ville Delivery" },
      {
        name: "description",
        content: "Farma Ville, farmácia em Salto SP com atendimento local, WhatsApp e opção de delivery. Fale com a equipe ou veja como chegar.",
      },
      { property: "og:title", content: "Farma Ville | Farmácia em Salto SP" },
      {
        property: "og:description",
        content: "Farmácia local em Salto com atendimento pelo WhatsApp e opção de delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Pharmacy",
          name: "Farmácia Farma Ville | Delivery em Salto",
          telephone: "+55 11 91060-1040",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Dentro do Supermercado Delta - Rod. Hilário Ferrari, 2300 - Salto Ville",
            addressLocality: "Salto",
            addressRegion: "SP",
            postalCode: "13323-500",
            addressCountry: "BR",
          },
          sameAs: ["https://instagram.com/farmaville.brasil"],
        }),
      },
    ],
  }),
  component: Index,
});

const whatsappUrl =
  "https://wa.me/5511910601040?text=Ol%C3%A1%21%20Vim%20pelo%20Google%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20Farma%20Ville.";

const mapsUrl =
  "https://www.google.com/maps/place/Farm%C3%A1cia+Farma+Ville+%7C+Delivery+em+Salto/@-23.5022773,-48.9622982,432430m/data=!3m1!1e3!4m7!3m6!1s0x94cf4f05a18bcebb:0x5f8d32a4e86d8498!8m2!3d-23.216452!4d-47.2685585!15sCg5mYXJtYSB2aWxsZSBzcJIBFnBoYXJtYWNldXRpY2FsX2NvbXBhbnngAQA!16s%2Fg%2F11ll_mblr9";

const highlights = [
  { icon: MapPin, title: "Atendimento em Salto", text: "Atendimento local na cidade de Salto." },
  { icon: Truck, title: "Opção de delivery", text: "Consulte a opção de delivery pelo WhatsApp." },
  { icon: MessageCircle, title: "Atendimento pelo WhatsApp", text: "Fale diretamente com a nossa equipe." },
  { icon: Navigation, title: "Localização física", text: "Dentro do Supermercado Delta, em Salto." },
];

function Index() {
  return (
    <div className="min-h-screen overflow-hidden bg-frost text-ink antialiased">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="Farma Ville - início">
          <span className="grid size-10 place-items-center rounded-xl bg-brand text-primary-foreground shadow-sm">
            <Cross className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <strong className="block font-display text-base font-semibold">Farma Ville</strong>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist">Salto · SP</span>
          </span>
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full border border-glass-strong bg-glass px-4 py-2 text-sm font-semibold text-brand-deep shadow-sm backdrop-blur-xl transition hover:bg-glass-strong sm:inline-flex">
          <Phone className="size-4" aria-hidden="true" /> (11) 91060-1040
        </a>
      </header>

      <main id="inicio">
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-glass-strong bg-glass px-3.5 py-1.5 text-xs font-semibold text-brand-deep shadow-sm backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-whatsapp" aria-hidden="true" /> Farmácia local · Salto, SP
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl">
            Farma Ville: sua <em className="font-medium text-brand-deep">farmácia</em> em Salto
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            Atendimento, praticidade e opção de delivery para você cuidar da sua saúde sem complicação.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 rounded-full bg-whatsapp px-7 py-4 font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-whatsapp-deep">
              <MessageCircle className="size-5" aria-hidden="true" /> Falar pelo WhatsApp
            </a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-glass-strong bg-glass px-7 py-4 font-semibold text-brand-deep shadow-sm backdrop-blur-xl transition hover:bg-glass-strong">
              <Navigation className="size-5" aria-hidden="true" /> Como chegar
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-glass-strong pt-6 text-sm text-ink/60">
            {["Delivery em Salto", "Atendimento pelo WhatsApp", "Dentro do Supermercado Delta"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5"><Check className="size-4 text-brand" aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sobre" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Sobre</p>
            <h2 id="sobre" className="mt-3 font-display text-4xl font-medium">Farma Ville em Salto</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-ink/70">Uma farmácia localizada em Salto, São Paulo, preparada para atender você com praticidade e proximidade.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-glass-strong bg-glass p-6 shadow-sm backdrop-blur-xl">
                <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><Icon className="size-5" aria-hidden="true" /></span>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="localizacao" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-8 rounded-[2rem] border border-glass-strong bg-glass p-6 shadow-xl backdrop-blur-2xl sm:p-9 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Localização</p>
              <h2 id="localizacao" className="mt-3 font-display text-4xl font-medium">Onde estamos</h2>
              <address className="mt-5 not-italic leading-relaxed text-ink/75"><strong className="text-ink">Dentro do Supermercado Delta</strong><br />Rod. Hilário Ferrari, 2300<br />Salto - SP, 13323-500</address>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-deep">
                <MapPin className="size-4" aria-hidden="true" /> Ver localização no Google Maps
              </a>
            </div>
            <img src={locationMap} alt="Mapa ilustrativo de localização em Salto" loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm" />
          </div>
        </section>

        <section aria-labelledby="contato" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-deep p-8 text-center text-primary-foreground shadow-2xl sm:p-14">
            <h2 id="contato" className="font-display text-4xl font-medium">Precisa falar com a Farma Ville?</h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">Entre em contato pelo WhatsApp e fale com a nossa equipe.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-primary-foreground px-8 py-4 font-semibold text-brand-deep shadow-lg transition hover:-translate-y-0.5">
              <MessageCircle className="size-5" aria-hidden="true" /> Chamar no WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl border-t border-glass-strong px-5 pb-28 pt-10 sm:px-8 sm:pb-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display font-semibold">Farmácia Farma Ville | Delivery em Salto</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">Dentro do Supermercado Delta - Rod. Hilário Ferrari, 2300 - Salto Ville, Salto - SP, 13323-500</p>
          </div>
          <div className="space-y-3 text-sm text-ink/70">
            <a href="tel:+5511910601040" className="flex items-center gap-2 font-semibold text-brand-deep"><Phone className="size-4" aria-hidden="true" />(11) 91060-1040</a>
            <a href="https://instagram.com/farmaville.brasil" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold text-brand-deep"><Instagram className="size-4" aria-hidden="true" />@farmaville.brasil</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 font-semibold text-primary-foreground hover:bg-whatsapp-deep"><MessageCircle className="size-4" aria-hidden="true" /> WhatsApp</a>
          </div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp" className="whatsapp-pulse fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-xl transition hover:bg-whatsapp-deep">
        <MessageCircle className="size-6" aria-hidden="true" />
      </a>
    </div>
  );
}
