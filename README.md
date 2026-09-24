# Cicerone

App web che, data la posizione GPS, trova chiese, palazzi, statue e altri monumenti nei dintorni e ne mostra una breve descrizione (Wikipedia, gratis). In più, può generare un racconto AI su un luogo (a pagamento, via Claude), e fotografare un dettaglio (un quadro, una statua) per condividerlo in una nuova chat di questo progetto Claude e farlo identificare lì — senza nessuna chiamata a pagamento dall'app stessa.

## Come funziona
1. **Ricerca per posizione (gratis)**: tocca "Scopri cosa mi circonda" → l'app interroga `it.wikipedia.org` (fallback `en.wikipedia.org`) cercando pagine geolocalizzate entro 1,5 km, ordinate per distanza.
2. **Racconto AI (a pagamento)**: tocca "✨ Racconto AI" su un luogo → chiama `/api/enrich`, che usa Claude per scrivere un breve aneddoto.
3. **Fotografa un dettaglio (gratis dall'app)**: tocca "Fotografa un dettaglio" → scatti una foto → tocca "Condividi con Claude" (usa la condivisione nativa del telefono per mandarla a una nuova chat di questo progetto) oppure "Scarica foto" e allegala a mano.

La funzione `/api/enrich.js` gira solo sul server di Vercel: la chiave API non è mai nel codice né visibile nel repo.

## Da personalizzare prima del deploy
Nel file `index.html`, cerca la costante `PROJECT_CHAT_URL` e sostituiscila con l'URL reale di questo progetto su claude.ai (apri il progetto "Guida D'Arte" e copia l'indirizzo dalla barra del browser). Serve solo come fallback quando la condivisione diretta non è supportata dal browser.

## Deploy
Nessun build step richiesto: `index.html` statico + una funzione serverless in `/api`.

1. Crea un repo GitHub (es. `Cicerone`) e caricaci tutto il contenuto di questa cartella (`index.html`, `api/enrich.js`).
2. Su [vercel.com](https://vercel.com) → *Add New Project* → importa il repo → deploy (framework: "Other").
3. **Prima di usare "Racconto AI"**: vai su Vercel → il tuo progetto → *Settings → Environment Variables* → aggiungi:
   - Nome: `ANTHROPIC_API_KEY`
   - Valore: la tua chiave, presa da [console.anthropic.com](https://console.anthropic.com)
   - Poi fai un redeploy (Settings → Deployments → ⋯ → Redeploy) perché la variabile venga letta.
4. Apri l'URL su telefono e aggiungi alla schermata Home.

Nota: la geolocalizzazione, la fotocamera e la condivisione file funzionano solo su HTTPS (Vercel la fornisce automaticamente) o su `localhost`.

## Costi da tenere d'occhio
Solo "Racconto AI" chiama `claude-sonnet-5` — poche migliaia di token, quindi centesimi, ma si sommano con l'uso. Il riconoscimento foto non costa nulla all'app: passa dalla tua chat Claude normale. Puoi controllare la spesa in tempo reale su [console.anthropic.com](https://console.anthropic.com) (sezione Usage).
