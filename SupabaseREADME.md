# 🚀 Supabase — Guide du grohr

---

<details>
<summary><strong>🧠 C’est quoi Supabase ?</strong></summary>

Supabase c'est une jolie potite plateforme qui fournit une stack backend prête à l’emploi basée sur **PostgreSQL**.

- 🗄️ Base de données PostgreSQL  
- 🔐 Authentification  
- 🌐 API automatique pour accéder aux données
- 📦 Stockage de fichiers  

</details>

---

<details>
<summary><strong>🏗️ Architecture du projet</strong></summary>

```
Frontend (React)
        |
        v
Backend (NestJS)
        |
        v
    Supabase
    ├─ Auth
    ├─ PostgreSQL
    └─ Storage
```

- Auth Supabase pour les users  
- PostgreSQL pour stocker les données jeu  
- Storage pour images (comme les PdP) 
- NestJS communiquera directement avec Supabase  

</details>

---

## <summary><strong>LE MENU DE GAUCHE SUR SUPABASE</strong></summary>

---

<details>
<summary><strong>🧱 TABLES Editor</strong></summary>

On crée les tables pour structurer les données.
Normalement il faut faire des requêtes SQL pour les créer, mais on peut aussi juste cliquer sur « New Table » en haut à gauche pour le faire.
On peut créer des colonnes, puis les remplir avec les données qu’on veut.

## Exemple de table : users
- id  
- username  
- avatar_url  
- created_at  

## Exemple de table : matchs
- id  
- player1_id  
- player2_id  
- score_player_1  
- score_player_2  
- winner_id  
- created_at  

Pour le type des colonnes, il faut sélectionner ce qui correspond le mieux à ce qu’on veut faire.
Par exemple, pour l’id, on veut qu’il soit unique et réutilisable pour identifier qqun, alors il y a évidemment un truc magique fait pour ça qui est le type : uuid.

En default value, ils te proposent d’en générer un aléatoirement, c’est plutôt pratique (gen_random_uuid() ) ou l’autre possibilité, je me souviens plus trop de la différence.

Ce qui est bien c’est que tous les types sont expliqués directement quand tu veux les sélectionner, donc tout est assez clair, en général t’as pas trop besoin de chercher sur internet pour choisir.

Il y a des bool si on a besoin d’un vrai/faux pour le winner par exemple, du texte pour afficher un pseudo, il y a aussi des dates, des time, etc.

Pour le time et la date, j’utilise quasi toujours <strong>timestamptz</strong> qui donne toutes les infos en une colonne (date, heure, en prenant en compte la time zone), mais pour simplifier le parsing on peut aussi prendre deux colonnes : <strong>date</strong> + <strong>timez</strong> (heure + time zone), à voir.

Une fois une table créée, quand tu retournes dans le <strong>Tables Editor</strong>, tu peux voir la liste des tables que tu as crées à gauche.
-> En cliquant dessus tu accèdes au détail des tables.

Tu peux toujours modifier quasi toutes les données après l’avoir crée contrairement à Trello xD

Pour <strong>modifier une colonne</strong>, il faut cliquer sur la petite flèche qui descend, à droite du nom de colonne puis <strong>« Edit column »</strong>.

Si t'as fait ça en même temps que tu lis ce tuto, t’as du voir que tu peux aussi trier les datas en fonction de cette colonne et ça c’est super pratique.

Pour <strong>modifier une valeur</strong> d’une ligne d’une colonne, tu peux <strong>double click</strong> dessus si jamais t’as besoin.

## Types importants
- uuid → identifiant unique  
- text → texte  
- bool → vrai/faux  
- timestamptz → date + heure + timezone  

## ID auto
```sql
gen_random_uuid()
```

</details>

---

<details>
<summary><strong>💻 SQL Editor</strong></summary>

Permet d’écrire du SQL directement.
En gros, tout ce que tu fais dans le Table Editor peut aussi être fait ici, mais en écrivant du SQL.

## Exemple, récupérer tous les utilisateurs :
```sql
SELECT * FROM users;
```

## Exemple, créer une table users :
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT
);
```

## Cette page permet en gros de :
- créer des tables  
- modifier des colonnes  
- supprimer des tables  
- ajouter des données
- requêtes avancées, recheches, etc

Quand tu fais une requête, Supabase affiche directement le résultat en dessous. Si ca marche t’auras « Success, no row returned » en général, sauf si tu rajoutes du débug.

Les requêtes SQL se sauvegardent à gauche, et comme ça si t’as besoin d’en utiliser une presque pareil, tu peux copier tranquillou le code de ce que t’as fait avant.

</details>

---

<details>
<summary><strong>🗄️ DATABASE</strong></summary>

C’est la vue globale de ta base de données.

Tu peux retrouver tout ça :
- tables  
- fonctions SQL  
- triggers  
- schemas  
- extensions  
- policies (RLS 🔐)

Les policies, c’est les autorisations de requêtes que tu permets de faire sur les différentes tables, c’est assez important de s’intéresser à ça pour pas avoir de pb d’écrasement de données par un random par exemple.

</details>

---

<details>
<summary><strong>🔐 AUTHENTICATION</strong></summary>

C’est le système de connexion des utilisateurs.
Au lieu de coder toi-même :

- mots de passe  
- hashage (cryptage des mdp++)
- tokens JWT  
- sessions  

Supabase le fait presque tout seul, et ça c’est <strong>merveilleux</strong>.

Tu peux activer différents moyens d'authentication, qu'ils appellent "Providers" en général

## Exemples de providers :
- email  
- Google
- Apple 
- GitHub  
- Discord  

Donc on a un point à chercher assez facilement avec l’auth.

Quand un utilisateur se connecte, Supabase crée automatiquement son compte dans la table auth.users.
Ensuite tu peux récupérer son id pour le relier à ta propre table users (faut vraiment le faire, sinon on se complique la vie, et on risque de créer des doublons d'users).

Comme ça tu peux stocker toutes les infos spécifiques au projet, sans toucher aux tables internes de Supabase (l'auth).

Flux :
```
auth.users → users
```

Cette table d'auth, c’est une table séparée des autres et tu peux seulement y accéder via le <strong>menu de gauche</strong> puis <strong>« Authentification »</strong>.
Parfois tu vas oublier où ça se trouve et c’est normal, c’est PAS dans TABLE EDITOR.

</details>

---

<details>
<summary><strong>📦 STORAGE</strong></summary>

## Stockage de fichiers :
- PdP  
- images
- documents  
- vidéos  

On crée d’abord un “bucket” (un gros dossier), avec « New Bucket » en vert tout à droite, puis tu peux le paramétrer.

Par exemple : PdP

Puis on peut envoyer des fichiers dedans depuis le frontend ou le backend.
Ensuite Supabase génère une URL qui permet de récupérer le fichier.

</details>

---

<details>
<summary><strong>⚙️ EDGE FUNCTIONS</strong></summary>

Permettent d’exécuter du code côté serveur.
C’est un peu comme créer des mini API.

## Permet de gérer :
- appel d'APIs  
- envoi d'emails  
- traitements spécifiques 

Perso je pense pas qu’on en aura forcément besoin vu qu’on a déjà NestJS.
Mais ça peut être pratique pour certains traitements rapides.

</details>

---

<details>
<summary><strong>⚡ REALTIME</strong></summary>

J’ai jamais utilisé, je testerai.
De ce que j’ai compris c’est que Supabase peut prévenir automatiquement tous les clients quand une donnée change.

Update (merci chatGPT):

Exemple d’utilisation :
Un joueur termine une partie.
Le score est ajouté dans la base.
Tous les clients connectés reçoivent la mise à jour instantanément.

Ça peut être intéressant pour les updates live :
- chat  
- notifications 
- statuts en ligne 
- scores  

</details>

---

<details>
<summary><strong>🧠 ADVISORS</strong></summary>

En gros c’est comme un copilot qui surveille un projet Github.
Il te dit quand des trucs sont pas opti, quand t’as des problèmes de sécurité (il va souvent les ping ça, c’est pour ça que je disais que c’est pas mal de s’intéresser aux RLS = Row Level Security), il te prévient aussi quand t’as des index qui manquent et que c’est pas pratique pour identifier les données de certaines colonnes.
J’utilise pas mal ça, et souvent j’y pense pas assez, ça serait bien de regarder vite fait après chaque TABLE qu’on créée.

Analyse automatique :

- sécurité  
- performance  
- indexes  
- RLS  

</details>

---

<details>
<summary><strong>📊 OBSERVABILITY</strong></summary>

Permet de surveiller ce qui se passe.

Monitoring :

- performances  
- mémoire  
- requêtes lentes  

On a pas forcément besoin de ça, sauf si on voit que le site est giga lent sur un truc.

</details>

---

<details>
<summary><strong>📜 LOGS</strong></summary>

Pas besoin de vous expliquer je crois : si t’as un truc qui marche pas, cette page est ton amie mdrr

Debug :

- SQL errors  
- auth errors  
- API logs  

</details>

---

<details>
<summary><strong>🔌 INTEGRATIONS</strong></summary>

Permet de connecter Supabase à d’autres services.

Par exemple
- GitHub  
- Stripe (paiements)  
- analytics
- etc  

On s'en servira sûrement pas, c’est plutôt si on a le temps. On pourra s’amuser, il y a pas mal de trucs que tu peux faire.

</details>

---

<details>
<summary><strong>⚙️ PROJECT SETTINGS</strong></summary>

C’est la config du projet.

## C’est là que tu trouves :
- les clés API 
- les infos de connexion à PostgreSQL
- les réglages de sécurité
- les domaines autorisés (pour avoir un nom de domaine)
- les paramètres d’authentification
- et encore plein de choses sexy de ce style

On va souvent visiter cette page normalement, puisque c’est là qu’on va aller pour connecter le backend à supabase.
Le plus important c’est la page « API Keys », il y aura toutes les clés qu’il nous faudra. On peut switch en haut entre :
-> Publishable and secret API Keys
-> Legacy anon, service_role API keys

⚠️ IMPORTANT :  il y a un petit bouton un peu caché mais important en haut : *logo de prise* connect 

C’est là que trouves tout ce qu’il te faut ou presque pour connecter ton projet à supabase, avec les variables d’environnement toutes prêtes à être copiées collées.

</details>

---

<details>
<summary><strong>🧾 CONCLUSION</strong></summary>

Pour Transcendence on utilisera surtout :

- Table Editor  
- SQL Editor  
- Auth  
- Storage  
- Project Settings  

</details>