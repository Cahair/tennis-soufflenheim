# Site du Tennis Padel Club Soufflenheim (maquette)

Maquette de site vitrine pour le TPCS — Tennis, Padel & Pickleball à Soufflenheim, depuis 1979.

Construit avec **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4** et **sharp** (photos). Les animations de la page d'accueil reposent sur **GSAP** (ScrollTrigger, SplitText, DrawSVG) et **Lenis** (défilement lissé) ; tout le reste est fait maison : galerie lightbox, accordéon FAQ… et le mini-CMS intégré (`/admin`).

## Lancer le site

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

Pour une version optimisée de production :

```bash
npm run build
npm start
```

## Pages

| URL | Contenu |
| --- | --- |
| `/` | Accueil (`src/components/landing/`) : écran d'ouverture, hero, le club & chiffres clés, disciplines, padel couvert, réservation Ten'up, actus & agenda, galerie, témoignages, partenaires — animations désactivées si l'utilisateur préfère un mouvement réduit |
| `/le-club` | Histoire (frise 1979 → aujourd'hui), mot du président, comité, installations |
| `/tarifs` | Adhésions, tarifs horaires padel, école de tennis |
| `/actualites` | Articles + agenda des événements |
| `/galerie` | Galerie photos filtrable avec visionneuse plein écran |
| `/contact` | Coordonnées, formulaire (démo), carte, FAQ complète |

## Modifier le contenu — mini-CMS intégré

Le site embarque sa propre administration sur **`/admin`** (mot de passe
partagé) : actualités, agenda, tarifs, galerie, histoire, comité, sponsors,
FAQ, témoignages, coordonnées… tout est modifiable par les bénévoles du club,
sans toucher au code. Voir le [guide d'utilisation](GUIDE-ADMIN.md).

Fonctionnement :

- Le contenu vit dans des fichiers JSON : seed versionné dans `content/`,
  version modifiée dans `data/content/` (créée à la première modification).
- Les photos envoyées via l'admin sont converties en WebP (avec miniature de
  flou) dans `data/uploads/`, servies par la route `/uploads/[file]`.
- Chaque enregistrement sauvegarde l'ancienne version dans `data/backups/`
  (30 dernières par fichier) puis revalide le cache de tout le site :
  les modifications sont en ligne en quelques secondes.
- Les messages du formulaire de contact sont consultables dans
  l'admin (« Messages reçus »).

Configuration (fichier `.env.local`, voir `.env.example`) :

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD` | mot de passe de l'administration |
| `SESSION_SECRET` | clé de signature des sessions (hex aléatoire) |
| `TPCS_DATA_DIR` | dossier persistant du contenu (défaut : `./data`) |

Ce qui reste dans le code (volontairement hors CMS) : la navigation
(`src/lib/nav.ts`), le règlement intérieur (`src/lib/reglement.ts`), les
images décoratives (`src/lib/images.ts`) et les couleurs du club
(`src/app/globals.css`).

## Déploiement (Infomaniak, hébergement Node.js)

1. Déployer le dépôt et installer : `npm install` (Node ≥ 20).
2. Créer `.env.local` avec `ADMIN_PASSWORD`, `SESSION_SECRET` et, recommandé,
   `TPCS_DATA_DIR` pointant vers un dossier **hors du dépôt** (ex.
   `/srv/tpcs-data`) pour que le contenu survive aux redéploiements.
3. `npm run build` puis démarrer avec `npm start -- --port $PORT`.
4. À chaque mise à jour du code : re-build puis redémarrage — le contenu du
   club (JSON + photos) est conservé dans `TPCS_DATA_DIR`.

## Notes

- Tarifs, événements et articles : contenus **indicatifs** créés pour la maquette, à valider avec le club.
- Réservations : lien réel vers Ten'up.
- Le formulaire de contact enregistre les messages dans l'admin ; l'envoi
  d'une notification e-mail pourra être branché plus tard (SMTP Infomaniak).
