# Cicerone

App web che, data la posizione GPS, trova chiese, palazzi, statue, monumenti e castelli nei dintorni su una mappa interattiva e ne mostra una breve descrizione (Wikipedia + OpenStreetMap, gratis). In più, può generare un racconto AI su un luogo (a pagamento, via Claude), e fotografare un dettaglio (un quadro, una statua) per condividerlo in una nuova chat di questo progetto Claude e farlo identificare lì — senza nessuna chiamata a pagamento dall'app stessa.

## Come funziona
0. **Aperta da un'altra app (es. Sicilia)**: se l'URL contiene `?city=...&lat=...&lon=...&zoom=...&view=map`, Cicerone apre subito la mappa su quel punto invece di partire dalla home — è così che l'app "Sicilia" (nella scheda di ogni città, riquadro "Arte e monumenti") rimanda qui.
1. **Vicino a me (gratis, istantaneo)**: tocca l'Uomo Vitruviano → si apre la mappa interattiva centrata sulla tua posizione (raggio 1,2 km), con un punto dorato per ogni luogo trovato. Pensata per quando sei già davanti a un'opera.
2. **Esplora una città (gratis, mappa interattiva)**: tocca "Esplora una città", digita un luogo (Nominatim/OpenStreetMap, gratis) → mappa centrata lì (raggio 2,5 km). In entrambi i casi tocchi un punto → scheda con descrizione; spostando la mappa compare "Cerca opere in questa zona" per aggiornare i risultati sulla nuova vista.
3. **Due fonti dati combinate**: Wikipedia (`it`/`en`, con descrizione ed eventuale foto) e OpenStreetMap/Overpass (storico, opere d'arte pubbliche, luoghi di culto — molto più completo di Wikipedia su castelli, rovine e monumenti minori). I duplicati (stesso luogo su entrambe le fonti) vengono scartati automaticamente, tenendo la versione Wikipedia quando c'è.
4. **Racconto AI (a pagamento)**: da una scheda, tocca "✨ Racconto AI" → chiama `/api/enrich`, che usa Claude per scrivere un breve aneddoto (utile soprattutto per i punti OpenStreetMap, che non hanno una descrizione propria).
5. **Fotografa un dettaglio (gratis dall'app)**: tocca "Fotografa un dettaglio" → scatti una foto → tocca "Condividi con Claude" (usa la condivisione nativa del telefono per mandarla a una nuova chat di questo progetto) oppure "Scarica foto" e allegala a mano.

La funzione `/api/enrich.js` gira solo sul server di Vercel: la chiave API non è mai nel codice né visibile nel repo.

## Immagine in home
L'Uomo Vitruviano nella hero è la fotografia di Luc Viatour del disegno di Leonardo da Vinci (Gallerie dell'Accademia, Venezia), di pubblico dominio. Va scaricata a mano e aggiunta al repo (non è inclusa qui):
1. Scarica: https://upload.wikimedia.org/wikipedia/commons/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg
2. Rinominala **`vitruvian.jpg`**
3. Mettila nella stessa cartella di `index.html`

## Da personalizzare prima del deploy
Nel file `index.html`, cerca la costante `PROJECT_CHAT_URL` e sostituiscila con l'URL reale di questo progetto su claude.ai (apri il progetto "Guida D'Arte" e copia l'indirizzo dalla barra del browser). Serve solo come fallback quando la condivisione diretta non è supportata dal browser.

## Icona e installazione come app
Ho aggiunto `manifest.json` + icone (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`): sono i file che permettono al telefono di mostrare "Aggiungi alla schermata Home" con un'icona vera (rosa dei venti oro su verde) e aprire l'app a schermo intero, senza barra del browser. Vanno caricati nel repo insieme a `index.html`, nella stessa cartella principale — nessuna configurazione aggiuntiva richiesta.

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
