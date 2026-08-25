# BTT-LUX — Frontend Web

Application web React de la plateforme BTT-LUX : catalogue, calculateur de besoins, devis, paiement, missions technicien, suivi de chantier, espace admin, assistant IA, notifications.

**Stack :** React 18 · Vite 8 · React Router 7 · Tailwind CSS 3 · Axios · lucide-react · qrcode.react

---

## Démarrage local

```bash
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

## Structure

```
src/
  pages/            Écrans (Catalogue, Calculateur, Devis, Paiement, AssistantIA…)
    Admin/          Tableau de bord admin, détails devis, validation missions
    Technicien/     Missions technicien, prises de mesures
  services/api.js   Client Axios (baseURL = VITE_API_URL, injection du JWT)
  assets/           Images, styles, favicon
  App.jsx           Routage (React Router) + layout principal
  main.jsx          Point d'entrée
```

## Routes

| Route | Page |
|-------|------|
| `/login` · `/register` | Authentification (JWT stocké en `localStorage`) |
| `/produits` | Catalogue Luxerboard |
| `/calculateur` | Calculateur de besoins/coûts |
| `/pros` | Professionnels BTP |
| `/devis` | Demande & suivi de devis |
| `/suivi` | Suivi de chantier |
| `/formation` · `/galerie` · `/ressources` | Contenus |
| `/paiement` | Paiement (Campay mobile money) |
| `/assistant` | Assistant IA |
| `/notifications` | Centre de notifications |
| `/missions` · `/otp` | Missions technicien · configuration 2FA |
| `/admin/dashboard` · `/admin/devis/:id` · `/admin/validation-missions` | Espace admin |

## Variables d'environnement

| Variable | Rôle |
|----------|------|
| `VITE_API_URL` | URL de base de l'API backend (obligatoire, embarquée au build) |

## CI/CD

`.github/workflows/ci.yml` exécute sur chaque push vers `main` :
**scan de secrets (Gitleaks)** → **lint (Oxlint)** → **build (Vite)**.

## Déploiement (Vercel)

- `vercel.json` est prêt (`framework: vite`), Root Directory = racine du repo frontend.
- Définissez la variable de build **`VITE_API_URL`** dans le tableau de bord Vercel (`https://<votre-backend>.onrender.com/api`).
- Les assets `/assets/*` sont servis avec cache immuable ; les en-têtes de sécurité sont appliqués globalement.

## Licence

MIT — voir le fichier `LICENSE` à la racine du projet.