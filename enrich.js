// Funzione serverless Vercel: genera un breve racconto AI su un luogo.
// La chiave API vive SOLO qui (variabile d'ambiente su Vercel), mai nel frontend.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { title, extract } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: 'Titolo mancante' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Chiave API non configurata sul server' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Sei una guida d'arte appassionata che accompagna i visitatori dal vivo. Racconta in italiano, in massimo 120 parole, un aneddoto o una curiosità poco nota su "${title}". Contesto disponibile da Wikipedia: ${extract || 'nessuno'}. Tono coinvolgente e narrativo, non enciclopedico. Se non hai informazioni affidabili su questo luogo specifico, dillo onestamente invece di inventare dettagli.`
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Errore dal provider AI' });
    }

    const story = (data.content || []).find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ story });

  } catch (err) {
    return res.status(500).json({ error: 'Errore interno' });
  }
};
