# Déployer ce site Next.js sur Infomaniak (Node.js)

Guide pour publier le site sur un sous-domaine de démo (ex. `demo.mondomaine.fr`)
via l'hébergement web Infomaniak avec support Node.js.

## Prérequis

- Un hébergement web Infomaniak actif (les offres payantes incluent le support Node.js).
- Le domaine principal géré chez Infomaniak (pour créer le sous-domaine).
- Next.js 16 exige **Node.js ≥ 20.9** : choisir la version **LTS 22** dans le Manager.

## 1. Créer le site Node.js dans le Manager

1. Se connecter à [manager.infomaniak.com](https://manager.infomaniak.com).
2. Ouvrir **Hébergement Web** → cliquer sur le nom de ton hébergement.
3. Cliquer sur le bouton bleu **Ajouter** (un site).
4. Choisir **Projet avec technologies avancées** → **Node.js** → version **22 LTS**.
5. À l'étape du domaine, choisir **Sous-domaine d'un domaine existant** et saisir
   par ex. `demo` → le site répondra sur `demo.mondomaine.fr`.
6. Choisir le mode **Personnalisé** (pas le projet d'exemple) et la méthode
   d'import : **SSH/SFTP** (le plus simple pour commencer) ou **Git**.

## 2. Envoyer le code

**Ne PAS envoyer** ces dossiers (ils seront régénérés sur le serveur) :

- `node_modules/`
- `.next/`
- `.git/` (inutile en SFTP)

Via SFTP (FileZilla, WinSCP…) avec les identifiants affichés dans le Manager :
envoyer tout le reste du dossier du projet dans le répertoire du site
(`package.json` doit se trouver à la racine du répertoire d'exécution).

Alternative : connecter un dépôt GitHub/GitLab dans le Manager — Infomaniak
clonera le repo et pourra re-déployer à chaque mise à jour.

## 3. Configurer les commandes

Dans le tableau de bord du site Node.js (Manager) :

| Champ | Valeur |
|---|---|
| Dossier d'exécution | `./` (là où se trouve `package.json`) |
| Commande de build | `npm install && npm run build` |
| Commande de démarrage | `npm start` |
| Port d'écoute | laisser la valeur du Manager — voir note ci-dessous |

**Note port** : Infomaniak transmet le port à l'application via la variable
d'environnement `PORT`. `next start` lit automatiquement `PORT`, donc `npm start`
fonctionne tel quel, rien à modifier dans le code.

## 4. Démarrer et vérifier

1. Lancer le **build** puis **démarrer** l'application depuis le tableau de bord.
2. En cas d'erreur, ouvrir la **console / logs** du site dans le Manager.
3. Activer le **certificat SSL** (Let's Encrypt, gratuit) sur le sous-domaine.
4. Ouvrir `https://demo.mondomaine.fr` — le site doit s'afficher.

## 5. Mettre à jour le site

À chaque modification :

1. Re-envoyer les fichiers modifiés (SFTP) ou `git pull` (si import Git —
   on peut aussi mettre `git pull && npm install && npm run build` en commande de build).
2. Relancer le **build** dans le Manager.
3. **Redémarrer** l'application (les changements ne sont pris en compte qu'après redémarrage).

## Dépannage rapide

- **Erreur au démarrage** : vérifier dans les logs que la version Node est ≥ 20.9
  (`node -v` en SSH) et que le build a bien produit le dossier `.next/`.
- **Page blanche / 502** : l'app n'écoute pas sur le bon port → vérifier que la
  commande de démarrage est bien `npm start` (et non `next dev`).
- **Build qui échoue sur le serveur** : lancer `npm run build` en local d'abord ;
  si ça passe en local mais pas sur le serveur, comparer les versions Node.
