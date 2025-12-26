# Bienvenue sur Synura !

## Qu'est-ce que Synura ?
Synura est une application polyvalente qui vous permet de parcourir du contenu provenant de diverses sources à l'aide de mini-applications puissantes appelées "extensions". Pensez-y comme un navigateur, mais au lieu de sites web, vous utilisez des extensions pour obtenir du contenu dans un format d'application natif et propre.

## Concepts Clés pour les Utilisateurs

*   **Découverte d'Extensions** : Saisissez un domaine (par exemple, `example.com` ou `https://example.com`) pour récupérer automatiquement le fichier `synura.js` de ce domaine. Si aucun protocole n'est fourni, `https://` est utilisé par défaut. C'est le moyen principal d'installer des extensions depuis leurs sites web officiels.
*   **Installation Directe** : Saisissez une URL complète (par exemple, `https://raw.githubusercontent.com/user/repo/main/synura.js`) pour installer un script d'extension spécifique. **Note de Sécurité** : Cette méthode est restreinte aux domaines de confiance (comme GitHub, GitLab, etc.) pour empêcher l'exécution de code malveillant. N'utilisez pas cela pour des domaines généraux.
*   **Validation par Liste Blanche** : Les installations directes par URL sont validées par rapport à une liste blanche de domaines autorisés pour la sécurité. La découverte de domaine contourne cette vérification pour permettre l'exploration.
*   **Extensions** : Ce sont de petits plugins qui récupèrent et affichent du contenu. Par exemple, vous pourriez avoir une extension pour un site d'actualités, une plateforme vidéo ou un fil de réseaux sociaux. Vous pouvez installer de nouvelles extensions pour étendre ce que vous pouvez faire avec Synura.
*   **Runtimes (Environnements d'exécution)** : Lorsque vous ouvrez une extension, elle s'exécute dans un "runtime". Vous pouvez avoir plusieurs runtimes ouverts à la fois, tout comme avoir plusieurs onglets dans un navigateur web. Chaque runtime est une instance distincte d'une extension. Vous pouvez basculer entre eux, et même avoir plusieurs runtimes pour la même extension.
*   **Marque-pages** : Vous avez trouvé quelque chose d'intéressant ? Vous pouvez marquer la vue actuelle pour la sauvegarder pour plus tard. Un marque-page enregistre l'état exact de la vue, afin que vous puissiez y revenir à tout moment.

## Naviguer dans l'Application

### L'Écran Principal
L'écran principal de l'application est l'endroit où vous gérez vos runtimes. La barre supérieure (barre d'application) est votre outil de navigation principal.

### La Barre d'Application

La barre d'application comporte plusieurs icônes qui vous aident à naviguer et à gérer votre contenu. Certaines icônes ont des **raccourcis cachés** accessibles par un appui long :

*   **`+` (Ajouter)** :
    *   **Appuyer** : Ouvrir un nouveau runtime. Vous pouvez choisir une extension installée ou saisir un domaine/URL de site web pour en installer une nouvelle.
    *   **Appui Long** : Ouvrir l'écran de **Gestion des Extensions** pour voir les détails de vos extensions installées.
*   **Menu Déroulant (centre)** : Affiche le runtime actuellement actif. Appuyez pour basculer entre les runtimes ouverts, ou balayez vers la gauche/droite sur le menu déroulant pour les faire défiler.
*   **`X` (Fermer)** : Ferme le runtime actuel.
*   **`↻` (Mettre à jour)** : *Visible uniquement en Mode Développeur.* Met à jour l'extension actuelle depuis sa source.
*   **`✨` (IA)** :
    *   **Appuyer** : Ouvrir le **Menu IA** pour des actions rapides (Résumé, Traduire, etc.).
    *   **Appui Long** : Ouvrir les **Paramètres IA** pour configurer les fournisseurs et les préférences.
*   **`☆` (Ajouter un Marque-page)** :
    *   **Appuyer** : Enregistrer la vue actuelle dans vos marque-pages.
    *   **Appui Long** : Aller directement à votre liste de **Marque-pages**.
*   **`🔖` (Marque-pages)** : Voir votre liste de marque-pages enregistrés.
*   **`⚙️` (Paramètres)** : Ouvrir l'écran principal des paramètres.

Si l'écran est trop étroit, certaines options peuvent se déplacer dans un menu à trois points.

### Bouton IA (`✨`)
Appuyez sur le **bouton IA** dans la barre d'application pour ouvrir la **Boîte de dialogue du Menu IA**. Cela vous donne des fonctionnalités alimentées par l'IA à la demande pour la vue actuelle :

*   **Résumé** : Obtenez un résumé rapide généré par l'IA du contenu à l'écran.
*   **Traduire** : Traduisez le contenu dans votre langue cible (configurée dans les Paramètres IA).
*   **Prompt Personnalisé** : Saisissez vos propres instructions pour que l'IA analyse le contenu.
*   **Partager vers IA Externe** : Exportez le contenu de la vue actuelle vers des applications d'IA externes comme ChatGPT ou Gemini sur votre appareil.
*   **Basculer le Cache** : Contrôlez si vous souhaitez utiliser les résultats d'IA mis en cache ou forcer une nouvelle analyse.

Pour une configuration détaillée de l'IA, allez dans **Paramètres > Paramètres IA** où vous pouvez :
*   Configurer votre fournisseur d'IA préféré (Gemini, OpenAI, DeepSeek, Claude).
*   Définir les langues source et cible pour la traduction.
*   Choisir la plage de recherche d'analyse (Profond est uniquement en Vue Liste) et le profil (Résumé, Expliquer, Simplifier, Vérification des Faits, Critique, Aperçu).
*   Ajuster les préférences de longueur de résumé.
*   Voir les statistiques d'utilisation des jetons.
*   Gérer les clés API pour chaque fournisseur.

### Marque-pages
L'écran des marque-pages affiche toutes vos vues enregistrées.

*   **Instantané de Vue** : Appuyer sur un marque-page ouvre un **instantané mis en cache** de la page telle qu'elle était lorsque vous l'avez enregistrée. C'est idéal pour consulter rapidement des informations sans avoir besoin d'une connexion Internet.
*   **Restaurer la Vue** : Pour interagir à nouveau avec la page (par exemple, cliquer sur des liens, actualiser les données), cherchez l'**icône de restauration**. Appuyer dessus reconnectera à l'extension et ramènera la vue à la vie dans un nouveau runtime.

## Paramètres (`⚙️`)

L'écran des paramètres vous permet d'ajuster presque tous les aspects de votre expérience Synura.

### Extensions
*   **Installer de Nouvelles Extensions** : Appuyez sur le bouton **`+`** dans la barre d'application et saisissez le domaine du site web (par exemple, `https://example.com`). Si le site prend en charge Synura, l'extension sera automatiquement découverte et installée.
*   **Gérer les Extensions** : Appuyez sur **Gérer** pour voir une liste de vos extensions installées, où vous pouvez les mettre à jour ou les supprimer.

### Apparence
*   **Ajuster la Densité du Contenu** : Utilisez le curseur pour que le contenu apparaisse plus espacé ou plus compact. Vous verrez un aperçu en direct de la façon dont cela affecte les listes et les cartes.
*   **Thème de Couleur** : Personnalisez l'apparence de l'application en choisissant entre les schémas de couleurs **Clair**, **Sombre** et **Monokai**.
*   **Graisse de Police** : Ajustez l'épaisseur du texte selon vos préférences (par exemple, léger, régulier, gras).
*   **Langue** : Définir la langue de l'application. Vous pouvez choisir une langue spécifique ou la laisser suivre la valeur par défaut de votre système.

### Comportement
*   **Délai d'Attente Réseau** : Définissez combien de temps l'application doit attendre une réponse d'une requête réseau, de 1 à 60 secondes.
*   **Paramètres Proxy** : Configurez un serveur proxy pour les requêtes réseau.
*   **Paramètres de Cache** : Gérez le cache de l'application, y compris l'effacement des données mises en cache pour libérer de l'espace.
*   **Animation GIF** : Contrôlez comment les GIF animés sont lus : **Désactivé** (image statique), **Une fois** (jouer une fois), ou **Boucle** (jouer en continu).

### Vidéo & Audio
*   **Lecture Automatique Vidéo** : Un commutateur pour contrôler si les vidéos commencent à jouer automatiquement lorsqu'elles apparaissent à l'écran.
*   **Lecture Vidéo en Arrière-plan** : Activez ceci pour continuer à entendre l'audio d'une vidéo même après avoir navigué ailleurs ou changé d'application.
*   **Mélanger avec d'Autres** : Autoriser l'audio de Synura à jouer en même temps que l'audio d'autres applications.
*   **Heures DVR de Lecture en Direct** : Pour les diffusions en direct, choisissez combien d'heures de la diffusion garder disponibles pour revenir en arrière (de 0 à 6 heures).

### Confidentialité & Sécurité
*   **Gérer les Paramètres** : Configurez diverses options de confidentialité et de sécurité pour contrôler quelles données sont stockrées et partagées.

### À Propos
*   **Licences Open Source** : Voir les licences des logiciels open source qui aident à propulser Synura.

---
*Ce document est pour les utilisateurs finaux. Pour la documentation développeur, veuillez consulter [Commencer](getting_started.md), la [Référence API](api_reference.md), et les [Exemples](examples.md).*