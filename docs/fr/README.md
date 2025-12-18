# Bienvenue sur Synura !

## Qu'est-ce que Synura ?
Synura est une application polyvalente qui vous permet de parcourir du contenu provenant de diverses sources à l'aide de mini-applications puissantes appelées "extensions". Imaginez-le comme un navigateur, mais au lieu de sites web, vous utilisez des extensions pour obtenir du contenu dans un format d'application natif et épuré.

## Concepts Clés pour les Utilisateurs

*   **Découverte d'Extension** : Entrez un domaine (par exemple, `example.com` ou `https://example.com`) pour récupérer automatiquement le fichier `synura.js` de ce domaine. Si aucun protocole n'est fourni, `https://` est utilisé par défaut. C'est la méthode principale pour installer des extensions depuis leurs sites officiels.
*   **Installation Directe** : Entrez une URL complète (par exemple, `https://raw.githubusercontent.com/user/repo/main/synura.js`) pour installer un script d'extension spécifique. **Note de Sécurité** : Cette méthode est restreinte aux domaines de confiance (comme GitHub, GitLab, etc.) pour empêcher l'exécution de code malveillant. N'utilisez pas cela pour des domaines généraux.
*   **Validation par Liste Blanche** : Les installations directes par URL sont validées par rapport à une liste blanche de domaines autorisés pour la sécurité. La découverte de domaine contourne cette vérification pour permettre l'exploration.
*   **Extensions** : Ce sont de petits plugins qui récupèrent et affichent du contenu. Par exemple, vous pourriez avoir une extension pour un site d'actualités, une plateforme vidéo ou un flux de médias sociaux. Vous pouvez installer de nouvelles extensions pour étendre ce que vous pouvez faire avec Synura.
*   **Runtimes (Environnements d'exécution)** : Lorsque vous ouvrez une extension, elle s'exécute dans un "runtime". Vous pouvez avoir plusieurs runtimes ouverts à la fois, tout comme avoir plusieurs onglets dans un navigateur web. Chaque runtime est une instance distincte d'une extension. Vous pouvez basculer entre eux et même avoir plusieurs runtimes pour la même extension.
*   **Marque-pages** : Vous avez trouvé quelque chose d'intéressant ? Vous pouvez marquer la vue actuelle pour la sauvegarder pour plus tard. Un marque-page enregistre l'état exact de la vue, afin que vous puissiez y revenir à tout moment.

## Naviguer dans l'Application

### L'Écran Principal
L'écran principal de l'application est l'endroit où vous gérez vos runtimes. La barre supérieure (barre d'application) est votre outil de navigation principal.

### La Barre d'Application

La barre d'application comporte plusieurs icônes :

*   **`+` (Ajouter)** : Appuyez ici pour ouvrir un nouveau runtime. Vous pouvez choisir une extension installée ou entrer un domaine de site web pour en installer une nouvelle.
*   **Menu Déroulant (centre)** : Il affiche le runtime actuellement actif. Appuyez dessus pour voir une liste de tous vos runtimes ouverts et basculer entre eux. Vous pouvez également glisser vers la gauche ou la droite sur le menu déroulant pour changer rapidement.
*   **`X` (Fermer)** : Ceci ferme le runtime actuel.
*   **`☆` (Ajouter un Marque-page)** : Appuyez ici pour enregistrer la vue actuelle dans vos marque-pages.
*   **`🔖` (Marque-pages)** : Ceci vous amène à votre liste de marque-pages enregistrés.
*   **`⚙️` (Paramètres)** : Ceci ouvre l'écran des paramètres, où vous pouvez personnaliser Synura.

Si l'écran est trop étroit, ces options seront regroupées dans un menu à trois points sur la droite.

### Marque-pages
L'écran des marque-pages affiche toutes vos vues enregistrées.

*   **Aperçu de la Vue** : Appuyer sur un marque-page ouvre un **aperçu en cache** de la page telle qu'elle était lorsque vous l'avez enregistrée. C'est idéal pour consulter rapidement des informations sans avoir besoin d'une connexion Internet.
*   **Restaurer la Vue** : Pour interagir à nouveau avec la page (par exemple, cliquer sur des liens, actualiser les données), recherchez l'**icône de restauration**. Appuyer dessus reconnectera à l'extension et ramènera la vue à la vie dans un nouveau runtime.

## Paramètres (`⚙️`)

L'écran des paramètres vous permet d'ajuster presque tous les aspects de votre expérience Synura.

### Extensions
*   **Installer de Nouvelles Extensions** : Appuyez sur le bouton **`+`** dans la barre d'application et entrez le domaine du site web (par exemple, `https://example.com`). Si le site prend en charge Synura, l'extension sera automatiquement découverte et installée.
*   **Gérer les Extensions** : Appuyez sur **Gérer** pour voir une liste de vos extensions installées, où vous pouvez les mettre à jour ou les supprimer.

### Apparence
*   **Ajuster la Densité du Contenu** : Utilisez le curseur pour rendre le contenu plus espacé ou plus compact. Vous verrez un aperçu en direct de la façon dont cela affecte les listes et les cartes.
*   **Thème de Couleur** : Personnalisez l'apparence de l'application en choisissant entre les schémas de couleurs **Clair**, **Sombre** et **Monokai**.
*   **Graisse de la Police** : Ajustez l'épaisseur du texte selon vos préférences (par exemple, léger, régulier, gras).
*   **Langue** : Définissez la langue de l'application. Vous pouvez choisir une langue spécifique ou la laisser suivre la langue par défaut de votre système.

### Comportement
*   **Délai d'Attente Réseau** : Définissez combien de temps l'application doit attendre une réponse d'une demande réseau, de 1 à 60 secondes.
*   **Paramètres Proxy** : Configurez un serveur proxy pour les demandes réseau.
*   **Paramètres de Cache** : Gérez le cache de l'application, y compris la suppression des données mises en cache pour libérer de l'espace.
*   **Animation GIF** : Contrôlez la lecture des GIF animés : **Désactivé** (image statique), **Une fois** (jouer une fois) ou **Boucle** (jouer en continu).

### Vidéo & Audio
*   **Lecture Automatique Vidéo** : Un commutateur pour contrôler si les vidéos commencent à jouer automatiquement lorsqu'elles apparaissent à l'écran.
*   **Lecture Vidéo en Arrière-plan** : Activez ceci pour continuer à entendre l'audio d'une vidéo même après avoir navigué ailleurs ou changé d'application.
*   **Mixer avec d'Autres** : Autorisez l'audio de Synura à jouer en même temps que l'audio d'autres applications.
*   **Heures DVR Lecture en Direct** : Pour les diffusions en direct, choisissez combien d'heures de diffusion garder disponibles pour revenir en arrière (de 0 à 6 heures).

### Confidentialité & Sécurité
*   **Gérer les Paramètres** : Configurez diverses options de confidentialité et de sécurité pour contrôler quelles données sont stockées et partagées.

### À Propos
*   **Licences Open Source** : Consultez les licences des logiciels open source qui aident à propulser Synura.

---
*Ce document est destiné aux utilisateurs finaux. Pour la documentation développeur, veuillez consulter [Commencer](getting_started.md), la [Référence API](api_reference.md), et [Exemples](examples.md).*