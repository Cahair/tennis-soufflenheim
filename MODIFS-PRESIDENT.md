# Modifs demandées par le président (nov. 2026)

Légende : ✅ fait · ⏳ en attente d'éléments du président

---

## Fait (8 nov. 2026)

| # | Modif | Ce qui a été fait |
|---|-------|-------------------|
| 1 | Hero : derniers vainqueurs | Photo des vainqueurs dans la carte du hero, légende « Vainqueurs du dernier tournoi de padel » (`public/images/vainqueurs-padel.webp`) ; vignette équivalente sur mobile |
| 2 | Hero : enlever le truc qui tourne | Badge rond « Padel · Réservable 7j/7 · À 4 » supprimé |
| 3 | Enlever les bandeaux croisés | Les 2 bandeaux défilants croisés en X supprimés partout : hero de l'accueil, en-tête de toutes les pages intérieures (PageHero, prop tape retirée) et sous la section padel de l'accueil |
| 4 | Plus de bouton de réservation | Section « Réserver » retirée de l'accueil, ainsi que l'entrée du menu, le bouton du hero, celui de la section padel de l'accueil, celui de l'appel final, celui du bandeau rose des pages intérieures et les boutons des disciplines. **Ten'up ne reste que dans le pied de page et sous les tarifs** (le bouton du règlement intérieur mène maintenant aux tarifs) |
| 5 | Balles au clic | Supprimées partout (hero, appel final, bandeau rose, pages intérieures). L'animation d'entrée du hero est conservée |
| 6 | Ten'up partout | « réservation en ligne » → « réservation Ten'up / sur Ten'up » (textes, chiffres clés, SEO, bandeau final) |
| 7 | Page padel | « …réservation Ten'up 7j/7 et une ambiance garden, pour tout le nord de l'Alsace, en passant par Haguenau, Lauterbourg et Wissembourg » |
| 8 | SLAMCOURT | Retiré partout (disciplines, installations, histoire 2023, accueil) |
| 9 | Tutoriels vidéo officiels FFT | Retiré des atouts du padel |
| 10 | « Le padel en six coups » | Section supprimée (`fx/PadelRally.tsx` supprimé) |
| 11 | Calendrier sans gare | Tableau des départs remplacé par des cartes d'événements (date en grand) |
| 12 | Menu « Le club » | Histoire & installations · Le mot du président · Le comité · Le club-house · Le tennis · Le padel · Le pickleball (tennis et pickleball pointent vers `/padel#tennis` et `/padel#pickleball`) |
| 13 | Page « Le club-house » | Nouvelle page `/club-house` : photos du bar et de l'accueil (photo « La salle » retirée), liste des équipements |
| 14 | Mot du président | Nouvelle page `/mot-du-president` (texte intégral, photo de l'inauguration en attendant mieux) + accroche en haut de `/le-club` |
| 15 | Adresse n° 1 | Lien Google Maps : `query=1+Rue+de+Koenigsbruck…` |
| 16 | Nom du club | « Tennis Padel Garden Club de Soufflenheim » partout (titres, SEO, textes, réglages). Ancien nom gardé en nom alternatif pour Google. Règlement intérieur (document officiel 2023/24) et histoire 2023 « Le TCS devient TPCS » non modifiés |
| 17 | Terrains | 3 pistes de padel (2 couvertes + 1 extérieure) et 1 court de tennis : installations (les 2 fiches tennis fusionnées en « Court de tennis »), page padel/tennis, accueil, comité, sponsors ; chiffre clé « courts & pistes » = 4 ; « Projet d'extension en cours » retiré |
| + | Tournoi P1000 | Actualité avec l'affiche (`/actualites/tournoi-p1000-hommes-mai-2027`) + date au calendrier (6 mai 2027) |

## En attente d'éléments du président

| # | Modif | Ce qu'il faut |
|---|-------|---------------|
| A | « Le club en bref » : changer les photos | Les photos (`landing/ClubStory.tsx`, aujourd'hui `terrasseClub` et `feteClub`) |
| B | Histoire : photos 2023 et 2025 | Les photos (`content/histoire-chapitres.json`, chapitres 2023 « Le padel entre en piste » et 2025 « Place au pickleball ») |
| C | Comité | Liste à jour. Retirer Quentin Brucker et François Cau. Nouvelle structure : Comité de direction (4) · Bureau · Commission sportive · Commission entretien · Commission animation (`content/committee.json` + `comite/page.tsx`) |
| D | Sponsors | Liste à jour : les 7 logos non affichés de `public/sponsor/` sont obsolètes (`content/sponsors.json`) |
| E | Club-house | Autres photos (vestiaires, terrasse…) |
| F | Mot du président | Photo du président (remplace `inauguration-president.webp`) |

## Points à vérifier

- **Contenu de prod** : les JSON modifiés dans `content/` ne servent que de valeur initiale. Si un fichier a déjà été modifié via l'admin sur le serveur (`data/content/`), c'est la version du serveur qui s'affiche : il faut alors refaire la modif dans l'admin. Fichiers concernés : `settings` (lien Maps, nom du club), `disciplines`, `facilities`, `stats`, `cta-band`, `histoire-chapitres`, `histoire-infos`, `home-intro`, `news`, `events`.
- **Image `club-house-bar.webp`** : c'est en fait le logo « Garden Club » (avec un bouton de capture d'écran iPhone dessus), pas une photo du bar. Elle est utilisée dans les installations (club house), la galerie et l'image de partage.
- **Court de tennis** : couvert ou extérieur ? Les textes ne le précisent pas pour l'instant. Ils disent seulement qu'il est éclairé, comme le site l'affirmait déjà.
- **Anciennes actualités et témoignages** : ils parlent encore de « la piste ». Je les ai laissés tels quels, puisqu'ils sont datés.
