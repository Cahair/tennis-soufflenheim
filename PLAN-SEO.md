# Plan d'action SEO — Tennis Padel Club Soufflenheim

Objectif : que le club ressorte sur Google quand on cherche un club de tennis,
de padel ou de pickleball en Alsace du Nord, dans le Bas-Rhin et autour de
Haguenau, et qu'il soit bien présent sur les recherches autour de Strasbourg.

Audit et mise en œuvre du 12 octobre 2026.

---

## Ce qu'on peut raisonnablement viser

| Recherche | Chances | Levier principal |
| --- | --- | --- |
| « tennis Soufflenheim », « padel Soufflenheim », nom du club | Très bonnes | Site + fiche Google |
| « padel Haguenau », « club tennis Haguenau », « padel Alsace du Nord » | Bonnes | Fiche Google, pages `/padel` et `/tennis` |
| « club padel Bas-Rhin », « padel couvert Bas-Rhin », « tournoi padel Bas-Rhin » | Moyennes | Pages sports, articles de tournois, annuaires |
| « pickleball Alsace », « pickleball Bas-Rhin » | Bonnes (peu de concurrence) | Page `/pickleball` |
| « padel Strasbourg », « club tennis Strasbourg » | Faibles en résultats naturels | Annuaires, articles « où jouer au padel dans le Bas-Rhin », tournois sur Ten'up |

Pour les recherches locales, Google montre d'abord la carte (le « pack
local »), qui classe les clubs selon leur **distance** avec la personne qui
cherche, la **pertinence** de leur fiche et leur **notoriété** (avis, liens,
citations). Strasbourg compte une dizaine de clubs de padel plus proches
(Eckbolsheim, Mundolsheim, Bischheim, Reichstett…) : le club ne passera pas
devant eux sur « padel Strasbourg ». Il peut en revanche être cité dans les
listes et annuaires que ces recherches font remonter, et attirer les
Strasbourgeois par ses tournois et son padel couvert.

---

## 0. Bloquant : le nom de domaine

**`tpc-soufflenheim.fr` n'existe pas** (aucune réponse DNS, vérifié le
12/10/2026). Tant que le site n'est pas en ligne sur son domaine définitif,
rien ne peut être indexé.

- [ ] Réserver le domaine (Infomaniak) et le rattacher à l'hébergement Node.js, en HTTPS.
- [ ] Définir `SITE_URL` dans `.env.local` **avant** `npm run build` (canonical, sitemap, robots.txt et JSON-LD en dépendent).
- [ ] Choisir une seule version (`https://tpc-soufflenheim.fr` **ou** `https://www.…`) et rediriger l'autre en 301 chez l'hébergeur.
- [ ] Retirer la mention « Maquette de démonstration — contenus et tarifs indicatifs » du pied de page (`src/components/Footer.tsx`).
- [ ] Ne jamais laisser une copie de test publique indexable sur un autre domaine.

---

## 1. Déjà fait dans le code

| Domaine | Changement | Fichiers |
| --- | --- | --- |
| Pages d'atterrissage | `/tennis`, `/padel`, `/pickleball` : texte local (Soufflenheim, Haguenau, Alsace du Nord, Bas-Rhin), atouts, adhésions issues de l'admin, bloc « Venir au club » avec temps de trajet depuis 11 communes, FAQ, liens croisés | `src/lib/sports.ts`, `src/components/SportLanding.tsx`, `src/app/(site)/{tennis,padel,pickleball}/` |
| Titres et descriptions | Accueil : « Tennis Padel Club Soufflenheim · Tennis & padel dans le Bas-Rhin (67) ». Toutes les pages : titre et description réécrits avec mots-clés et localisation | `src/app/layout.tsx`, chaque `page.tsx` |
| Partage (Open Graph) | Titre, description et URL propres à chaque page (avant, toutes les pages partageaient le même titre) | `src/lib/seo.ts` (`pageMetadata`) |
| Titre principal (H1) de l'accueil | « Soufflenheim · Alsace du Nord » fait maintenant partie du H1, sans changement visuel | `src/components/landing/Hero.tsx` |
| Données structurées | Fiche club enrichie : coordonnées GPS, zone desservie (11 communes + Bas-Rhin + Alsace), équipements, carte, logo, photos, anciens noms (« Tennis Club de Soufflenheim »), FFT. Ajout de `WebSite` (nom du site affiché par Google), fil d'Ariane et FAQ sur les pages sports | `src/app/(site)/layout.tsx`, `src/lib/seo.ts` |
| Sitemap | Pages sports ajoutées ; dates de modification réelles (dernière modification du contenu dans l'admin) au lieu de « maintenant » à chaque visite ; régénéré toutes les heures | `src/app/sitemap.ts`, `src/lib/storage.ts` |
| Directives robots | `max-image-preview: large` (grandes photos dans Google et Discover) ; admin toujours en `noindex` et bloqué dans robots.txt | `src/app/layout.tsx`, `src/app/robots.ts` |
| Validation Search Console / Bing | Par variables `GOOGLE_SITE_VERIFICATION` et `BING_SITE_VERIFICATION` | `src/app/layout.tsx` |
| Maillage interne | Pages sports dans le menu « Le club », le pied de page et la section « Nos sports » de l'accueil | `src/lib/nav.ts`, `src/components/landing/Sports.tsx` |
| Cohérence nom/adresse/téléphone | Adresse « 1 rue de Koenigsbruck » (comme PagesJaunes, la mairie et la FAQ) ; pied de page et intro de l'accueil situent le club dans le Bas-Rhin / l'Alsace du Nord | `content/settings.json`, `content/home-intro.json`, `src/components/Footer.tsx` |

Fait en parallèle par une autre session : pages d'articles
`/actualites/<slug>` (JSON-LD Article, articles dans le sitemap), dates des
événements avec JSON-LD Event sur `/calendrier`, route `/llms.txt` pour les
assistants IA, mesure d'audience Umami.

> **Attention :** si le contenu a déjà été modifié via l'admin en production
> (`TPCS_DATA_DIR/content/settings.json` existe), la nouvelle adresse et la
> nouvelle intro du dépôt ne s'appliquent pas. Les reporter dans l'admin
> (« Coordonnées » et « Accueil »).

---

## 2. Au lancement (semaine 1) : vérifier l'indexation

- [ ] **Google Search Console** : créer une propriété « Domaine » validée par enregistrement DNS TXT chez Infomaniak (ou propriété « Préfixe d'URL » + `GOOGLE_SITE_VERIFICATION`).
- [ ] Envoyer le sitemap : `https://<domaine>/sitemap.xml`.
- [ ] Inspection d'URL puis « Demander une indexation » pour `/`, `/padel`, `/tennis`, `/pickleball`, `/tarifs`, `/contact`, `/le-club`.
- [ ] **Bing Webmaster Tools** : importer la propriété depuis Search Console (Bing alimente aussi Copilot, DuckDuckGo et la recherche de ChatGPT).
- [ ] Tester les données structurées sur `/` et `/padel` : [Test des résultats enrichis](https://search.google.com/test/rich-results) et [validator.schema.org](https://validator.schema.org/).
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) en mobile sur `/` : surveiller le LCP (écran d'ouverture + animations du hero) et `/galerie` (sphère 3D).
- [ ] Après 1 à 2 semaines : rapport « Pages » de Search Console, toutes les pages du sitemap doivent être « Indexées ». Les motifs à corriger : « Explorée, actuellement non indexée », « Autre page avec balise canonique correcte » (domaine mal configuré), « Bloquée par robots.txt ».

---

## 3. Fiche Google Business Profile : le levier n° 1

C'est elle qui apparaît sur la carte et dans le pack local pour « padel près
de moi », « club tennis Haguenau »… Gratuit, à gérer par un membre du comité.

- [ ] Revendiquer ou créer la fiche « Tennis Padel Club Soufflenheim » (une fiche existe peut-être déjà, créée automatiquement).
- [ ] Catégorie principale : « Club de tennis ». Catégories secondaires : les plus proches que Google propose pour le padel (ex. « Terrain de padel ») et « Club de sport ».
- [ ] Nom, adresse et téléphone **identiques** au site : `1 rue de Koenigsbruck, 67620 Soufflenheim`, `03 88 86 79 08`, URL du site.
- [ ] Horaires : décider lesquels publier. Aujourd'hui, PagesJaunes affiche 8 h – 22 h, Padel Magazine 7 h – 22 h et la FAQ du site les permanences du club house. Une seule version partout.
- [ ] Description (750 caractères max.) avec tennis, padel couvert, pickleball, Soufflenheim, Alsace du Nord, Haguenau.
- [ ] 15 à 20 photos : pistes de padel couvertes, courts, club house, tournois.
- [ ] Publier un « post » à chaque tournoi ou événement (lien vers l'article du site).
- [ ] **Avis** : demander un avis aux membres et aux joueurs extérieurs après chaque tournoi (lien court fourni par Google), répondre à tous les avis.

---

## 4. Citations et liens locaux (mois 1)

Google recoupe les informations du club sur d'autres sites. Incohérences
relevées pendant l'audit :

| Site | À faire |
| --- | --- |
| [Anybuddy](https://www.anybuddyapp.com/fr/club/tc-soufflenheim-soufflenheim) | Le club y apparaît sous l'ancien nom « TC Soufflenheim » : demander la mise à jour du nom et l'ajout du site |
| [Padel Magazine, annuaire](https://padelmagazine.fr/annuaire-des-clubs/tennis-padel-club-soufflenheim/) | Fiche ancienne (1 piste de padel) ; téléphone du président noté **06 19** 14 60 39 contre **06 10** 14 60 39 sur le site : vérifier lequel est juste et corriger partout |
| [Padel Magazine, « Où jouer au padel dans le Bas-Rhin »](https://padelmagazine.fr/ou-jouer-au-padel-dans-le-bas-rhin/) | Article ancien : demander l'ajout du club avec ses pistes couvertes |
| [PagesJaunes](https://www.pagesjaunes.fr/pros/09121624) | Vérifier horaires et adresse, ajouter le site |
| [Mairie de Soufflenheim](https://mairie-soufflenheim.fr/association/tennis-padel-club-soufflenheim/) | Demander un lien vers le site : c'est le lien local le plus fiable |
| [sport-padel.fr](https://www.sport-padel.fr/padel-soufflenheim/) | Article d'avril 2026 sur les pistes couvertes : demander un lien vers le site |
| [padelspeak.com](https://padelspeak.com/departement/67-bas-rhin/), [padelmaniacs.fr](https://padelmaniacs.fr/fr-fr/z/clubs-de-padel/350075-departement-bas-rhin/) | Vérifier ou créer la fiche, ajouter le site |
| Ten'up (fiche club FFT), Ligue Grand Est de tennis, comité du Bas-Rhin | Ajouter l'URL du site |
| Communauté de communes du Pays Rhénan, office de tourisme | Annuaire des associations : fiche + lien |
| Facebook, Instagram, YouTube, TikTok | Mettre l'URL du site dans chaque bio |
| Presse locale (DNA) | À chaque inauguration ou gros tournoi, envoyer un communiqué avec l'adresse du site |

---

## 5. Contenu (en continu)

### À corriger dans le site (contradictions trouvées)

Les sources externes récentes (sport-padel.fr, avril 2026) indiquent **3
pistes de padel : 1 extérieure et 2 couvertes ouvertes le 2 avril 2026**,
environ 170 membres. Le site dit encore autre chose :

- [ ] Admin › Disciplines › Padel : « Projet d'extension en cours (maquette 3D) » → à remplacer (ex. « 2 pistes couvertes + 1 extérieure »).
- [ ] Admin › Installations : une seule « Piste de padel » ; Admin › Chiffres clés : « 4 courts & pistes ».
- [ ] Code : `src/app/(site)/tarifs/page.tsx` (« fin de la construction des pistes de padel couvertes », sur-titre « 2024 / 25 ») et `src/components/landing/PadelReveal.tsx` (« Une piste SLAMCOURT »).
- [ ] Année d'arrivée du padel : 2023 dans l'histoire du club, 2021 selon sport-padel.fr.
- [ ] Faire relire par le comité les textes des pages sports (`src/lib/sports.ts`), en particulier : initiations pickleball ouvertes aux non-membres, entraîneurs, tournois mensuels.

### À produire

- [ ] **1 à 2 actualités par mois**, avec le lieu dans le titre : « Tournoi de padel P100 à Soufflenheim : les résultats », « Rentrée de l'école de tennis à Soufflenheim », « Portes ouvertes du club ». Chaque article a maintenant sa propre page indexable.
- [ ] Renseigner la **date** de chaque événement de l'agenda (champ ajouté) : les tournois peuvent apparaître dans les résultats d'événements Google.
- [ ] Texte alternatif descriptif sur chaque photo ajoutée via l'admin (« Finale du tournoi de padel 2026 au TPCS » plutôt que « photo 1 »).
- [ ] Idée de page à fort potentiel : **« Privatiser le club »** (anniversaires, séminaires, team building padel). La FAQ en parle déjà (environ 35 €/personne) ; c'est une recherche peu concurrencée (« team building padel Alsace »).
- [ ] Option : quelques lignes en allemand. Le club est à une dizaine de kilomètres de la frontière (Rastatt, Baden-Baden).

---

## 6. Suivi

Une fois par mois, 15 minutes :

- **Search Console › Performances** : impressions et clics sur « padel haguenau », « club padel bas-rhin », « tennis soufflenheim », « pickleball alsace », « padel alsace du nord » ; position moyenne des pages `/padel`, `/tennis`, `/pickleball`.
- **Search Console › Pages** : nombre de pages indexées, erreurs.
- **Google Business Profile › Performances** : vues, appels, demandes d'itinéraire, clics vers le site.
- **Umami** : visites venant de Google, clics vers Ten'up.

## Calendrier

| Quand | Quoi |
| --- | --- |
| Avant la mise en ligne | Domaine + `SITE_URL`, retrait de la mention « maquette », correction des contradictions padel |
| Semaine 1 | Search Console, Bing, sitemap, demandes d'indexation, fiche Google |
| Mois 1 | Citations et annuaires, liens mairie et presse, premiers avis |
| Mois 2 à 3 | Articles réguliers, page « Privatiser le club », bilan Search Console |
| En continu | Actualités, agenda daté, avis, posts sur la fiche Google |
