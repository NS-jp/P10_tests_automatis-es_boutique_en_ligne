# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `docker-compose up`
3. Ouvrez le site via l'URL http://localhost:8080 

# Lancement des tests automatiques 
## Installation de NodeJS
Téléchargez la dernière version LTS de Node depuis le site https://nodejs.org/fr.  

## Installation de Cypress
Depuis un terminal ouert dans le dossier du projet, lancez la commande :`npm install cypress --save-dev`

## Configuration Cypress 
Une fois que Cypress installé, lancez la commande suivante depuis un terminal ouvert: `npx cypress open`, afin d'initialiser Cypress pour le projet. 

Choisissez le type de tests "E2E Testing", puis le navigateur de votre choix. 

Optez pour l'option "Scaffold example specs" et exécutez le test en sélectionnant le fichier correspondant. 