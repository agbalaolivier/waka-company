require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const validator = require('validator');
const helmet = require('helmet');
const xss = require('xss');
const cors = require('cors');
const path = require('path'); // Nécessaire pour gérer les chemins de fichiers

const app = express();
const port = process.env.PORT || 3000;

// Configuration de CORS (autorise ton domaine Render + le local)
app.use(cors({
    origin: '*' // Autorise toutes les origines ou remplace par ton domaine Render exact
}));

// Middleware pour la sécurité
app.use(helmet({
    contentSecurityPolicy: false // Évite de bloquer les scripts/styles locaux en production
}));
app.use(bodyParser.json());

// 1. SERVIR LES FICHIERS STATIQUES (HTML, CSS, JS, IMAGES)
// Indique à Express d'aller chercher les fichiers dans le dossier parent (racine du projet)
app.use(express.static(path.join(__dirname, '../')));

// 2. ROUTE RACINE (Affiche index.html à la connexion)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ROUTE API CONTACT
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!validator.isEmail(email)) {
        console.error('Email invalide:', email);
        return res.status(400).send('Adresse email invalide');
    }
    if (!name || !email || !message) {
        console.error('Champs manquants:', { name, email, message });
        return res.status(400).send('Tous les champs sont requis.');
    }

    const sanitizedName = xss(name);
    const sanitizedMessage = xss(message);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Nouveau message de ${sanitizedName}`,
        text: `Nom: ${sanitizedName}\nEmail: ${email}\nMessage: ${sanitizedMessage}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur Nodemailer:', error);
            return res.status(500).send('Erreur lors de l envoi de l email.');
        }
        res.status(200).send('Message envoyé avec succès !');
    });
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});