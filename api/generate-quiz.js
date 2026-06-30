// Fonction serverless Vercel - garde ta clé API secrète côté serveur
// La clé API doit être configurée dans Vercel : variable d'environnement ANTHROPIC_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { themes } = req.body
  const THEME_LABELS = {
    pop: 'Pop culture (manga, ciné, jeux vidéo)',
    tech: 'Tech & IA (réseaux sociaux, startups, gadgets)',
    sport: 'Sport & E-sport',
    music: 'Musique (hip-hop, afrobeat, tendances)',
  }
  const themesStr = (themes || ['pop', 'tech', 'sport', 'music'])
    .map((t) => THEME_LABELS[t] || t)
    .join(', ')

  const prompt = `Tu es un générateur de quiz pour les jeunes (15-25 ans). Génère exactement 10 questions de quiz sur ces thèmes : ${themesStr}.

Règles strictes :
- Mélange les thèmes
- Mélange QCM (4 options) et Vrai/Faux
- Niveaux mixtes : facile, moyen, difficile
- Questions actuelles, fun, engageantes pour les jeunes
- Pour QCM : 1 seule bonne réponse parmi 4
- Pour Vrai/Faux : options = ["Vrai", "Faux"]

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, ce format exact :
{"questions":[{"theme":"pop","question":"texte","type":"qcm","options":["A","B","C","D"],"answer":"A","explanation":"courte explication","difficulty":"facile"}]}

Génère exactement 10 questions maintenant.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur API Anthropic: ' + response.status)
    }

    const data = await response.json()
    let text = data.content.map((b) => b.text || '').join('')
    text = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)

    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Erreur génération quiz:', error)
    return res.status(500).json({ error: 'Impossible de générer le quiz' })
  }
}
