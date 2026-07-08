export function ContentSections() {
  return (
    <>
      <section className="section" id="cosa-offriamo">
        <div className="section-head">
          <p className="eyebrow-line">Partner Iren</p>
          <h2>Cosa Offriamo</h2>
        </div>
        <div className="content-card">
          <ul className="content-list">
            <li>
              Gestione completa delle operazioni contrattuali domestiche e
              business: Switch, Volture (sia abbinate a Switch che Interne),
              Subentri e Nuovi Allacci
            </li>
            <li>
              Inserimento contratti tramite IrenForce (firma OTP o cartacea)
            </li>
            <li>
              Operatività immediata: la pratica si inserisce in 2 minuti, senza
              allegati. IrenForce è un gestionale tutto-in-uno che integra
              caricamento contratti, verifica e post-vendita in un&apos;unica
              piattaforma.
            </li>
            <li>
              Post-vendita strutturato: supporto su fatture, cessazioni,
              variazioni di potenza, etc...
            </li>
            <li>
              Supporto garantito: numero verde dedicato per la risoluzione delle
              problematiche
            </li>
            <li>
              Offerte low cost garantite per tutto il 2026, con un programma
              d&apos;azione stabilito fino al 2030.
            </li>
          </ul>
        </div>
      </section>

      <section className="section section-alt" id="offerte-attive">
        <div className="section-head">
          <p className="eyebrow-line">Tariffe</p>
          <h2>Offerte Attive</h2>
        </div>
        <div className="offers-grid">
          <article className="offer-card">
            <span className="offer-badge">Prezzo fisso</span>
            <h3>Sottocasa Special — RID o Bollettino</h3>
            <ul>
              <li>Luce: 0,12 €/kWh (perdite incluse)</li>
              <li>Gas: 0,43 €/Smc</li>
            </ul>
          </article>
          <article className="offer-card">
            <span className="offer-badge">Prezzo fisso</span>
            <h3>36 Fisso Summer Edition</h3>
            <p>F1: 0,109 €/kWh (perdite incluse)</p>
          </article>
          <article className="offer-card">
            <span className="offer-badge">Prezzo fisso</span>
            <h3>Tua Azienda — RID o Bollettino</h3>
            <ul>
              <li>Luce: 0,145 €/kWh (perdite incluse)</li>
              <li>Gas: 0,56 €/Smc</li>
              <li>Piano compensi ricorrente basato sui consumi in fornitura</li>
            </ul>
          </article>
          <article className="offer-card">
            <span className="offer-badge suspended">Sospesa</span>
            <h3>Stay Tech</h3>
            <p>
              Con televisore in regalo o acquisto e-bike rateizzato in bolletta
              (attualmente sospesa)
            </p>
          </article>
          <article className="offer-card">
            <span className="offer-badge">Pertinenze</span>
            <h3>Offerta &quot;10 per due&quot;</h3>
            <p>Costo di commercializzazione: 55 €</p>
          </article>
          <article className="offer-card">
            <span className="offer-badge">TLC</span>
            <h3>Fibra a 18,99 €/mese</h3>
            <p>
              Disponibile anche l&apos;offerta Iren Stay (prezzo fisso + Fibra)
            </p>
          </article>
        </div>
        <p className="commission-note" style={{ marginTop: "1.5rem" }}>
          Tutte le offerte sono attivabili anche con Bollettino, eccetto Fibra e
          Iren Stay.
        </p>
      </section>

      <section className="section" id="provvigioni">
        <div className="section-head">
          <p className="eyebrow-line">Compensi</p>
          <h2>Provvigioni</h2>
          <p>Soglie di pagamento per contratto inserito:</p>
        </div>
        <div className="content-card">
          <table className="commission-table">
            <thead>
              <tr>
                <th>Contratti mensili</th>
                <th>Compenso per contratto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Da 1 a 5 contratti</td>
                <td>60€ cad.</td>
              </tr>
              <tr>
                <td>Da 6 a 10 contratti</td>
                <td>70€ cad.</td>
              </tr>
              <tr>
                <td>Da 11 a 50 contratti</td>
                <td>80€ cad.</td>
              </tr>
              <tr>
                <td>Da 51 a 99 contratti</td>
                <td>90€ cad.</td>
              </tr>
              <tr>
                <td>Oltre 99 contratti</td>
                <td>100€ cad.</td>
              </tr>
            </tbody>
          </table>
          <p className="commission-note">
            A tutti i compensi si aggiunge un bonus di 15€ per ogni contratto
            che rimane attivo per 9 mesi, per un totale di 115€ a contratto
            (sulle offerte low cost).
          </p>
        </div>
      </section>

      <section className="section section-alt" id="come-procedere">
        <div className="section-head">
          <p className="eyebrow-line">Prossimi passi</p>
          <h2>Come Procedere</h2>
        </div>
        <div className="content-card">
          <ul className="content-list">
            <li>
              Eventualmente siate interessati può direttamente compilare il form
              qui riportato.
            </li>
            <li>
              Dopo l&apos;approvazione di IREN, provvederemo all&apos;invio del
              contratto via mail per la firma digitale.
            </li>
            <li>
              Dovrà allegare: documento di identità e visura camerale (non
              antecedente a 6 mesi).
            </li>
            <li>Resto disponibile per qualsiasi chiarimento.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
