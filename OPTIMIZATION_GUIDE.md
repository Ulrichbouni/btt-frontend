# 🚀 Guide d'Optimisation Frontend - BTT-LUX

## Performance et Best Practices

### 📦 1. Lazy Loading des Routes

**Implémentation dans App.jsx :**

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LazyLoadFallback from './components/Loading';

// Lazy load des pages lourdes
const Admin = lazy(() => import('./pages/Admin/Dashboard'));
const Catalogue = lazy(() => import('./pages/Catalogue'));
const DemandeDevis = lazy(() => import('./pages/DemandeDevis'));
const AssistantIA = lazy(() => import('./pages/AssistantIA'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LazyLoadFallback />}>
          <Routes>
            <Route path="/" element={<Accueil />} /> {/* Chargé immédiatement */}
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/devis" element={<DemandeDevis />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/assistant" element={<AssistantIA />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

**Gain attendu :** Réduction du bundle initial de ~40%

---

### 🖼️ 2. Optimisation des Images

**Utiliser WebP avec fallback :**

```jsx
function OptimizedImage({ src, alt, className }) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img src={src} alt={alt} className={className} loading="lazy" />
    </picture>
  );
}
```

**Lazy loading natif :**
```jsx
<img src="/large-image.jpg" loading="lazy" alt="Description" />
```

**Conversion d'images :**
```bash
# Installer cwebp (macOS)
brew install webp

# Convertir toutes les images
for img in public/assets/*.{jpg,png}; do
  cwebp -q 80 "$img" -o "${img%.*}.webp"
done
```

---

### 🎨 3. Optimisation CSS avec Tailwind

**Configuration Tailwind (tailwind.config.js) :**

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
  // Purge automatique en production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,html}'],
  },
}
```

**Utiliser les classes utilitaires plutôt que CSS custom :**
```jsx
// ❌ Éviter
<div style={{ marginTop: '20px', color: 'blue' }}>...</div>

// ✅ Préférer
<div className="mt-5 text-blue-600">...</div>
```

---

### ⚡ 4. Optimisation des Re-Renders React

**Utiliser React.memo pour les composants purs :**

```jsx
import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product }) {
  return (
    <div className="card">
      <h3>{product.nom}</h3>
      <p>{product.prix_ttc} €</p>
    </div>
  );
});
```

**useCallback pour les fonctions passées en props :**

```jsx
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // Dépendances vides = fonction stable
```

**useMemo pour les calculs coûteux :**

```jsx
const filteredProducts = useMemo(() => {
  return products.filter(p => p.prix_ttc < maxPrice);
}, [products, maxPrice]);
```

---

### 🔄 5. Optimisation des Requêtes API

**Utiliser un cache simple :**

```js
// src/services/cache.js
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
```

**Utilisation dans api.js :**

```js
import { getCached, setCache } from './cache';

export async function getProducts() {
  const cacheKey = 'products';
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  const { data } = await api.get('/products');
  setCache(cacheKey, data);
  return data;
}
```

---

### 📊 6. Bundle Analysis

**Analyser la taille du bundle :**

```bash
npm install -D rollup-plugin-visualizer

# vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true })
  ]
});

npm run build
# Ouvre un graphique interactif de la taille du bundle
```

---

### 🎯 7. Web Vitals - Objectifs

| Métrique | Objectif | Actuel | Action |
|----------|----------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ? | Lazy load images, précharger polices |
| **FID** (First Input Delay) | < 100ms | ? | Réduire JavaScript bloquant |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ? | Définir dimensions des images |
| **TTFB** (Time to First Byte) | < 600ms | ? | CDN, cache serveur |

**Mesurer avec Lighthouse :**
```bash
npm install -g lighthouse
lighthouse https://votre-site.com --view
```

---

### 🌐 8. Configuration CDN et Cache

**Fichier `vercel.json` optimisé :**

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

### 🔐 9. Sécurité Frontend

**Sanitiser les entrées utilisateur :**

```js
// src/utils/sanitize.js
export function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Utilisation
<div>{sanitizeHTML(userInput)}</div>
```

**Content Security Policy (CSP) :**

Ajouter dans `index.html` :
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://votre-api.com">
```

---

### 📱 10. Progressive Web App (PWA)

**Installer Vite PWA Plugin :**

```bash
npm install -D vite-plugin-pwa
```

**Configuration (vite.config.js) :**

```js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BTT-LUX',
        short_name: 'BTT',
        description: 'Plateforme BTP professionnelle',
        theme_color: '#2563eb',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/votre-api\.com\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

### ✅ Checklist avant Déploiement

- [ ] `npm run build` passe sans erreur
- [ ] `npm run test` coverage > 70%
- [ ] `npm audit` : 0 vulnérabilités high/critical
- [ ] Lighthouse score > 90 (Performance)
- [ ] Images converties en WebP
- [ ] Lazy loading activé sur toutes les routes lourdes
- [ ] ErrorBoundary wrappé autour de l'app
- [ ] Variables d'environnement configurées sur Vercel
- [ ] CSP headers configurés
- [ ] Gzip/Brotli activé (automatique sur Vercel)

---

**Dernière mise à jour :** 2026-09-24
