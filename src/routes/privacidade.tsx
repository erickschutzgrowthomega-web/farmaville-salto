import { createFileRoute, Link } from "@tanstack/react-router";

import { openCookieSettings } from "../lib/consent";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade | Farma Ville Salto" },
      {
        name: "description",
        content:
          "Como a Farma Ville mede o uso desta página, quais dados vão para as plataformas de anúncio e como retirar sua escolha.",
      },
      { property: "og:title", content: "Política de privacidade | Farma Ville Salto" },
      {
        property: "og:description",
        content: "Quais dados esta página mede, quem os recebe e como retirar sua escolha.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacidade" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-frost text-ink antialiased">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="text-sm font-semibold text-brand-deep underline underline-offset-4">
          Voltar para a página da Farma Ville
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-4 sm:px-8">
        <h1 className="font-display text-4xl font-medium sm:text-5xl">Política de privacidade</h1>
        <p className="mt-3 text-sm text-ink/55">
          Vale para esta página da Farmácia Farma Ville | Delivery em Salto.
        </p>

        <section className="mt-10 space-y-8 leading-relaxed text-ink/75">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">O que é medido</h2>
            <p className="mt-2">
              Quando a medição está ligada, registramos a página visitada, o endereço que trouxe o
              visitante, o dispositivo e o navegador usados, e o clique nos botões de WhatsApp. Não
              pedimos nome, endereço, documento nem dados de saúde nesta página.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Quem recebe esses dados</h2>
            <p className="mt-2">
              As informações de navegação desta página vão para o <strong>Google</strong>, por meio do{" "}
              <strong>Google Tag Manager</strong> e do <strong>Google Ads</strong>, e são usadas para
              duas finalidades: <strong>medir o desempenho das campanhas de anúncio</strong> (quantas
              pessoas clicaram em falar com a farmácia) e <strong>otimizar esses anúncios</strong>.
              Cada plataforma trata os dados segundo a sua própria política de privacidade.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Quem não é medido</h2>
            <p className="mt-2">
              Visitantes em regiões que exigem consentimento (Europa e Reino Unido) só são medidos
              depois de aceitar. Quem recusa não tem a página carregada a ferramenta de medição, e os
              cliques dessa pessoa não são enviados. Visitantes de outras regiões, como o Brasil, não
              veem o aviso e podem desligar a medição pelo link no rodapé.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Como mudar de ideia</h2>
            <p className="mt-2">
              A escolha pode ser retirada a qualquer momento, com o mesmo cuidado com que foi feita.
              Basta abrir as configurações de privacidade: a decisão anterior vale até você salvar uma
              nova, e a retirada passa a valer na hora, inclusive nas abas já abertas.
            </p>
            <button
              type="button"
              onClick={openCookieSettings}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-deep"
            >
              Abrir configurações de privacidade
            </button>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Conversas pelo WhatsApp</h2>
            <p className="mt-2">
              Ao clicar em um botão desta página, você é levado ao WhatsApp, que passa a ser regido
              pelas práticas de privacidade dele. O que você escreve na conversa é tratado pela nossa
              equipe para responder ao seu contato.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Fale com a farmácia</h2>
            <p className="mt-2">
              Dúvidas sobre estas práticas podem ser levadas à equipe pelos mesmos canais da página:
              telefone (11) 91060-1040, WhatsApp ou Instagram @farmaville.brasil.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
