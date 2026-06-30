# Quiz Génération Z — guide de mise en ligne

Ce guide t'explique comment publier ton appli en ligne, étape par étape, sans
avoir besoin de savoir coder.

## Ce que contient ce projet

- `src/App.jsx` — toute l'application (écrans, logique du quiz)
- `api/generate-quiz.js` — le serveur qui génère les questions avec Claude,
  sans jamais exposer ta clé API au public
- `index.html`, `vite.config.js`, `package.json` — fichiers techniques,
  tu n'as pas besoin d'y toucher

## Étape 1 — Créer un compte GitHub

1. Va sur [github.com](https://github.com) et crée un compte gratuit
2. Crée un nouveau dépôt (bouton "New repository"), nomme-le par exemple
   `quiz-genz`
3. Laisse-le en "Public" ou "Private", peu importe

## Étape 2 — Mettre le code sur GitHub

Le plus simple : sur la page de ton nouveau dépôt GitHub, clique sur
"uploading an existing file" et glisse-dépose tous les fichiers et dossiers
de ce projet (en gardant la structure des dossiers `src/` et `api/`).

## Étape 3 — Créer ta clé API Anthropic

1. Va sur [console.anthropic.com](https://console.anthropic.com)
2. Crée un compte si besoin
3. Va dans "API Keys" et clique sur "Create Key"
4. Copie cette clé (tu ne pourras plus la revoir après) et garde-la de côté

Note : l'usage de l'API est payant à l'usage, mais le coût est très faible
pour un usage personnel ou un petit nombre d'utilisateurs (quelques
centimes par génération de quiz).

## Étape 4 — Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) et crée un compte (tu peux te
   connecter directement avec ton compte GitHub)
2. Clique sur "Add New Project"
3. Choisis ton dépôt `quiz-genz` dans la liste
4. Avant de cliquer sur "Deploy", déroule la section "Environment
   Variables" et ajoute :
   - Nom : `ANTHROPIC_API_KEY`
   - Valeur : la clé que tu as copiée à l'étape 3
5. Clique sur "Deploy"

Après quelques secondes, Vercel te donne une URL publique du style
`quiz-genz.vercel.app` — ton appli est en ligne et accessible à n'importe
qui dans le monde.

## Étape 5 — Tester

Ouvre l'URL fournie par Vercel, lance un quiz, vérifie que les questions
se génèrent bien. Si une erreur apparaît, vérifie que la clé API a bien
été collée sans espace en trop dans les "Environment Variables" de Vercel.

## Et après ?

- Chaque fois que tu modifies un fichier sur GitHub, Vercel redéploie
  automatiquement la nouvelle version
- Tu peux relier un nom de domaine personnalisé (genre `monquiz.com`)
  depuis les paramètres du projet sur Vercel
- Surveille ta consommation API sur console.anthropic.com pour éviter
  les mauvaises surprises si l'appli devient populaire
