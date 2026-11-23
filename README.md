# fourchette-pos

La caisse de Fourchette & Cie, l'application d'un restaurant fictif : plan de salle, commande, addition, envois en cuisine. Elle parle à l'API (`fourchette-api`) par le proxy de Vite. Toutes les données sont fictives.

React, Vite, TypeScript, shadcn/ui.

## Installer

Forkez ce dépôt, clonez votre fork à côté de `fourchette-api` et de `fourchette-kitchen`, dans un même dossier `fourchette/`. Le pré-vol ajoute le dépôt de départ en `upstream`. Le pas à pas, et la vérification du poste (`npm run preflight`), sont dans le README de `fourchette-api`.

## Lancer

Le plus simple : `npm run all` dans `fourchette-api` lance les trois applications.

Seule : `npm run dev`, sur http://localhost:5174. L'API doit tourner sur http://localhost:3000 ; `VITE_API=http://localhost:3001 npm run dev` vise une API sur un autre port (PowerShell : `$env:VITE_API='http://localhost:3001'; npm run dev`).

## Vérifier son travail

```
npm run verify
```

Contrôle des types, puis les tests. `npm run build` construit l'application.

## Branches

Comme dans `fourchette-api` (son README, section « Branches ») : une branche de départ arrivée en séance se récupère par `upstream` et se pousse sur votre fork ; une branche `feature/<nom>` en part, et sa PR s'ouvre dans votre fork, vers cette branche de départ.
