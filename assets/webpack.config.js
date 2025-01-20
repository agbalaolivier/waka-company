const path = require('path');

module.exports = {
  entry: './src/index.js',  // Chemin de votre fichier d'entrée
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Dossier de sortie
  },
  mode: 'development'
};
