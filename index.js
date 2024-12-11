   // index.js

   // Importer le module express
   const express = require('express');

   // Créer une instance de l'application Express
   const app = express();

   // Définir une route pour la racine
   app.get('/', (req, res) => {
       res.send('Hello World!');
   });

   // Démarrer le serveur sur le port 3000
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });