# Plume & Mélodie — Site web dynamique

## Présentation du projet

**Plume & Mélodie** est un service de **chansons personnalisées**. Le site web présente l'offre, permet aux clients de passer commande, et met en valeur les créations musicales.

**Identité visuelle**
- Fond sombre (noir)
- Couleurs principales : or/doré (`#F0B429`) et blanc
- Typographie : serif élégante pour les titres, sans-serif pour le corps
- Motif papillon comme élément décoratif récurrent
- Ton : chaleureux, artisanal, émotionnel

**Fichiers de référence**
- `Plume & Mélodie.png` — logo officiel
- `Te voilà.mp3` — exemple de chanson personnalisée

---

## Architecture du site

### Pages principales
- **Accueil** — accroche, présentation du concept, appel à l'action
- **Comment ça marche** — étapes du processus de commande
- **Exemples** — lecteur audio avec extraits de chansons réalisées
- **Commander** — formulaire de commande (occasion, destinataire, histoire, style musical)
- **À propos** — histoire et valeurs de Plume & Mélodie
- **Contact / FAQ**

### Fonctionnalités dynamiques
- Formulaire de commande multi-étapes avec validation
- Lecteur audio intégré pour les exemples
- Système de témoignages / avis clients
- Galerie de commandes réalisées (avec permission)
- Confirmation de commande par email
- Tableau de bord admin pour gérer les commandes (optionnel)

---

## Stack technique

> À définir selon les choix du projet. Exemples courants :
> - **Frontend** : HTML/CSS/JS vanilla, ou React/Next.js, ou Vue/Nuxt
> - **Backend** : Node.js/Express, PHP, ou solution no-code (Webflow, Framer)
> - **Base de données** : PostgreSQL, MySQL, ou Firebase
> - **Emails** : Resend, SendGrid, ou Nodemailer
> - **Hébergement** : Vercel, Netlify, OVH, ou autre

Mettre à jour cette section dès que les choix sont arrêtés.

---

## Conventions de code

- Nommer les fichiers en `kebab-case`
- Garder les composants/pages en français pour les labels visibles
- Variables et fonctions en anglais (camelCase)
- Ne pas commenter ce qui est évident ; commenter la logique métier spécifique
- Valider les entrées utilisateur côté serveur, jamais seulement côté client

---

## Contenu et ton éditorial

- Langue principale : **français**
- Ton : poétique, bienveillant, personnel — éviter le jargon commercial
- Les appels à l'action mettent l'accent sur l'émotion (ex. "Offrir une chanson unique")
- Mettre en avant le côté artisanal et humain (pas de génération IA mentionnée)

---

## Commandes de développement

> À compléter selon le stack retenu.

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

---

## Priorités de développement

1. Page d'accueil responsive et performante
2. Formulaire de commande fonctionnel
3. Lecteur audio pour les exemples
4. Intégration email (confirmation de commande)
5. SEO de base (balises meta, Open Graph)
