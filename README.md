# Cicerone

App web che, data la posizione GPS, trova chiese, palazzi, statue, monumenti e castelli nei dintorni su una mappa interattiva e ne mostra una breve descrizione. Tre fonti dati, tutte gratuite: Wikipedia, OpenStreetMap e (in Svizzera) l'inventario federale dei beni culturali. Nessuna chiamata a pagamento, nessuna chiave API richiesta.

## Come funziona
0. **Aperta da un'altra app (es. Sicilia)**: se l'URL contiene `?city=...&lat=...&lon=...&zoom=...&view=map`, Cicerone apre subito la mappa su quel punto invece di partire dalla home — è così che l'app "Sicilia" (nella scheda di ogni città, riquadro "Arte e monumenti") rimanda qui.
1. **Vicino a me**: tocca l'Uomo Vitruviano → si apre la mappa interattiva centrata sulla tua posizione (raggio 1,8 km), con un punto dorato per ogni luogo trovato — e mostra subito la scheda del punto più vicino, senza dover prima toccare un marker.
2. **Esplora una città**: tocca "Esplora una città", digita un luogo (Nominatim/OpenStreetMap) → mappa centrata lì (raggio 2,5 km), stesso comportamento. In entrambi i casi, spostando la mappa compare "Cerca opere in questa zona" per aggiornare i risultati sulla nuova vista; toccando un altro punto dorato si apre la sua scheda.
3. **Tre fonti dati combinate**:
   - **Wikipedia** (`it`/`en`): descrizione ed eventuale foto.
   - **OpenStreetMap/Overpass**: storico, opere d'arte pubbliche, luoghi di culto — molto più completo di Wikipedia su castelli, rovine e monumenti minori (inclusi quelli senza nome, mostrati con un'etichetta generica).
   - **geo.admin.ch** (solo se ti trovi in Svizzera): inventario federale KGS dei beni culturali protetti di importanza nazionale.
   - **patrimonioculturale-er.it** (solo se ti trovi in Emilia-Romagna): ~9.200 beni architettonici tutelati, portale del Segretariato Regionale del Ministero della Cultura.
   - **Regione Liguria** (solo se ti trovi in Liguria): dataset ufficiale "Siti Archeologici" (Settore Cultura e Spettacolo), licenza CC BY 4.0.

   I duplicati (stesso luogo su più fonti) vengono scartati automaticamente. **Note tecniche di trasparenza**, in ordine di affidabilità decrescente:
   - **Liguria**: l'endpoint è confermato HTTPS e il dataset è quello giusto (siti archeologici); resta da verificare solo il nome esatto del layer, scoperto automaticamente dal servizio (`GetCapabilities`) — buona probabilità che funzioni al primo colpo.
   - **Emilia-Romagna**: stessa scoperta automatica del layer, ma il servizio usa `http://` non `https://` — il browser potrebbe bloccarlo come "contenuto misto" su una pagina servita in https. Se non funziona, è probabilmente questo il motivo.
   - **Svizzera**: passata all'API STAC (standard, GeoJSON nativo in WGS84 — niente conversione di coordinate a mano, meno probabilità di errore). Resta ipotetico solo il nome del campo con il titolo del bene (`bezeichnung`/`label`/`objektname`/`title`), non verificato su una risposta reale.

   Se una di queste fonti non produce risultati in una zona dove dovrebbe, fammelo sapere: sono quasi certamente piccoli aggiustamenti (un nome di campo, un layer), non problemi di fondo.
4. **"✨ Chiedi a Claude"**: da una scheda, condivide il nome dell'opera in una nuova chat di questo progetto (stesso meccanismo della foto — vedi sotto), così puoi chiedere a Claude di raccontartela usando la tua chat normale, senza chiamate a pagamento dall'app.
5. **Fotografa un dettaglio**: tocca "Fotografa un dettaglio" → scatti una foto → tocca "Condividi con Claude" (usa la condivisione nativa del telefono per mandarla a una nuova chat di questo progetto) oppure "Scarica foto" e allegala a mano.

## Immagine in home
L'Uomo Vitruviano nella hero è la fotografia di Luc Viatour del disegno di Leonardo da Vinci (Gallerie dell'Accademia, Venezia), di pubblico dominio. Va scaricata a mano e aggiunta al repo (non è inclusa qui):
1. Scarica: https://upload.wikimedia.org/wikipedia/commons/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg
2. Rinominala **`vitruvian.jpg`**
3. Mettila nella stessa cartella di `index.html`

## Da personalizzare prima del deploy
Nel file `index.html`, cerca la costante `PROJECT_CHAT_URL` e sostituiscila con l'URL reale di questo progetto su claude.ai (apri il progetto "Guida D'Arte" e copia l'indirizzo dalla barra del browser). Serve solo come fallback quando la condivisione diretta non è supportata dal browser.

## Icona e installazione come app
`manifest.json` + icone (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`) permettono al telefono di mostrare "Aggiungi alla schermata Home" con un'icona vera e aprire l'app a schermo intero. Vanno caricati nel repo insieme a `index.html`, nella stessa cartella principale — nessuna configurazione aggiuntiva richiesta.

## Deploy
Nessun build step richiesto, nessuna funzione serverless: solo `index.html` statico + i file di cui sopra.

1. Crea un repo GitHub (es. `Cicerone`) e caricaci tutto il contenuto di questa cartella.
2. Su [vercel.com](https://vercel.com) → *Add New Project* → importa il repo → deploy (framework: "Other").
3. Apri l'URL su telefono e aggiungi alla schermata Home.

Nota: la geolocalizzazione, la fotocamera e la condivisione file funzionano solo su HTTPS (Vercel la fornisce automaticamente) o su `localhost`.

## Sull'Italia
Il Ministero della Cultura pubblica dati aperti su dati.beniculturali.it, ma solo come Linked Open Data/SPARQL (niente ricerca semplice per coordinate) — più lento e complesso da integrare rispetto alle fonti già in uso. Per ora resta fuori; se in futuro pubblicano un'API REST più semplice, si può aggiungere allo stesso modo della Svizzera.
