import { ContentSections } from "@/components/ContentSections";
import { PartnerForm } from "@/components/PartnerForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <p className="eyebrow-line">Collabora con noi</p>
          <h1>
            Iren Corner: energia, processi digitali e supporto dedicato per la
            tua agenzia
          </h1>
          <p className="hero-subtitle">
            Offerte competitive, compensi strutturati e operatività immediata
            tramite IrenForce per la tua agenzia.
          </p>
        </section>

        <ContentSections />

        <section className="section" id="candidatura">
          <div className="section-head">
            <p className="eyebrow-line">Candidatura</p>
            <h2>Compila il form</h2>
            <p>
              Inserisci i dati aziendali. Dopo l&apos;approvazione di IREN
              riceverai il contratto via email.
            </p>
          </div>
          <PartnerForm />
        </section>
      </main>
    </>
  );
}
