User Story 1: Connecter ses services préférés
Titre: Lier un compte externe à AREA
Description:
En tant qu'utilisateur d'AREA,
Je veux pouvoir brancher mes services du quotidien comme Gmail ou Spotify,
Pour ensuite les faire communiquer entre eux.
Ce qui doit fonctionner
Bon, là il faut que tout roule. L'utilisateur doit pouvoir voir tous les services qu'on propose, cliquer dessus et se connecter tranquillement avec son compte habituel. L'authentification doit passer comme une lettre à la poste. Évidemment, ses identifiants doivent être stockés de manière ultra-sécurisée, on rigole pas avec ça.
Et surtout, qu'il y ait un message de confirmation qui s'affiche quand c'est bon, histoire qu'il sache que ça a marché. Si jamais ça foire, on lui dit pourquoi clairement, pas de message d'erreur cryptique du genre "Error 500" qui veut rien dire.
Ce qu'il faut avant de commencer
Déjà, l'utilisateur doit avoir un compte sur notre plateforme et être connecté. Ça paraît logique mais bon, autant le préciser. Et puis le service qu'il veut brancher doit être configuré côté backend, sinon évidemment ça va pas marcher.
Ce qui change après
Une fois que c'est fait, le service apparaît comme "connecté" dans son profil. Comme ça il peut directement l'utiliser pour créer ses automatisations. Simple et efficace.
Quand est-ce que c'est vraiment terminé ?
Alors là, pas de raccourcis. Les tests automatiques doivent tous passer, quelqu'un de l'équipe doit avoir relu le code et dit OK, la documentation doit être mise à jour pour que les nouveaux puissent comprendre, et tout ça doit être déployé en environnement de test où ça tourne sans problème.

User Story 2: Créer une automatisation
Titre: Faire discuter deux services ensemble
Description:
En tant qu'utilisateur de l'app,
Je veux créer une automatisation qui réagit toute seule quand quelque chose se passe,
Pour ne plus avoir à faire certaines tâches répétitives manuellement.
Ce qui doit fonctionner
L'interface de création doit être accessible facilement, pas cachée au fond d'un menu. L'utilisateur choisit son déclencheur, genre "quand je reçois un mail", il configure les détails si besoin, puis il choisit ce qui se passe après, par exemple "balance ça sur Slack". Il personnalise le tout, et hop, ça se sauvegarde automatiquement en base de données et ça s'active direct.
Ah et important : il faut qu'il voie un message de confirmation à la fin, sinon il va se demander si ça a vraiment marché.
Comment ça se passe concrètement
Imagine que t'es l'utilisateur. Tu débarques sur l'app, tu cliques sur "Créer une automatisation". Là t'as une liste de services, mettons tu choisis Gmail. Ensuite tu dis "OK, je veux que ça se déclenche quand je reçois un nouveau mail". Tu peux même filtrer, genre "seulement les mails de mon patron" si t'as envie.
Après tu choisis où ça doit atterrir, par exemple Slack. Tu sélectionnes "Envoyer un message", tu choisis le channel, tu personnalises le texte du message, et tu valides. Bam, c'est fait. À partir de maintenant, chaque mail de ton boss finit automatiquement sur Slack. Pratique non ?
Les règles qu'on doit respecter
Une automatisation c'est toujours une action qui déclenche une réaction, ni plus ni moins. Les services que t'utilises doivent déjà être connectés, logique. Chaque automatisation doit avoir un nom unique pour pas tout mélanger. Et tous les champs marqués comme obligatoires doivent être remplis, on laisse pas passer les trucs à moitié finis.
Les points d'entrée de l'API
Pour créer une nouvelle automatisation, on envoie un POST vers /areas avec toutes les infos dedans : le nom, le service qui déclenche, le type d'action, les paramètres, le service qui réagit, etc. Ça nous renvoie un 201 Created avec l'objet tout beau.
Pour récupérer la liste des services disponibles, c'est un simple GET sur /services. Pareil pour savoir ce qu'on peut faire avec un service spécifique : GET sur /services/:id/actions ou /services/:id/reactions.
À quoi ça ressemble visuellement
On a imaginé un wizard en plusieurs étapes, comme ça c'est pas intimidant. Tu avances progressivement, tu vois un aperçu avant de valider, et tout fonctionne aussi bien sur téléphone que sur ordinateur. Parce que franchement, créer une automatisation depuis son canapé avec son portable, c'est quand même pratique.

User Story 3: Gérer ce qu'on a créé
Titre: Voir et contrôler toutes mes automatisations
Description:
En tant qu'utilisateur,
Je veux avoir une vue claire de toutes mes automatisations actives,
Pour pouvoir les gérer facilement sans me perdre.
Ce qui doit fonctionner
L'utilisateur doit voir d'un coup d'œil toutes ses automatisations. Pour chacune, il voit le nom, les services impliqués, et si c'est actif ou non. Il peut activer ou désactiver avec un simple toggle, parce que des fois on veut juste mettre en pause sans tout supprimer.
Il peut aussi supprimer une automatisation, mais là on lui demande confirmation parce que c'est quand même chiant de supprimer un truc par erreur. Et bien sûr il peut éditer ce qu'il a déjà créé, des fois qu'il veuille changer un paramètre.
Si l'utilisateur a créé plein d'automatisations, on les affiche par paquets de 20, histoire que la page charge rapidement. Et on lui met un filtre par service, comme ça s'il veut voir juste ses trucs Gmail, c'est possible.
Les points d'entrée de l'API
Pour lister les automatisations, GET sur /areas avec des paramètres optionnels pour la pagination et les filtres. Pour modifier une automatisation existante, PUT sur /areas/:id avec les nouvelles données. Pour supprimer, DELETE sur /areas/:id qui renvoie un 204 No Content.

Notre planning
On a découpé ça en sprints. La première story, connecter les services, c'est priorité haute pour le sprint 1, complexité moyenne environ 5 points. La création d'automatisations c'est aussi sprint 1 mais c'est plus costaud, on part sur 8 points. Et la gestion des automatisations c'est pour le sprint 2, priorité moyenne, 5 points aussi.

Les détails techniques
Notre stack technique
Côté backend on utilise NestJS avec TypeScript parce que franchement c'est solide et bien structuré. Le frontend c'est du Next.js, donc du React moderne avec tout ce qu'il faut. Pour la base de données on a pris PostgreSQL, c'est fiable et ça scale bien. L'API c'est du REST classique, rien de fancy mais ça fait le job. Et pour l'authentification on passe par des JWT, c'est devenu un standard maintenant.
Où ça se trouve dans le code
Le module de gestion des automatisations c'est dans /backend/src/areas. Tout ce qui concerne les services connectés c'est dans /backend/src/services. L'authentification et la sécurité c'est dans /backend/src/auth. Et évidemment tout le frontend c'est dans /frontend.
Structure de la base
On a quatre tables principales. La table users pour les utilisateurs de l'application, c'est la base. Ensuite services qui liste tous les services disponibles comme Google, GitHub, Spotify et compagnie. Puis user_services qui fait le lien entre un utilisateur et ses services connectés, avec les tokens d'authentification stockés dedans. Et enfin areas où on stocke toutes les automatisations créées par les utilisateurs