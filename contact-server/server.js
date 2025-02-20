require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const validator = require('validator');
const helmet = require('helmet'); // Pour renforcer la sécurité des en-têtes HTTP
const xss = require('xss'); // Pour filtrer les entrées utilisateur et prévenir les attaques XSS
const cors = require('cors'); // Ajout de l'importation du module cors
// ... existing code ...

const app = express();
const port = process.env.PORT || 3000;
// Configuration de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Remplacez par l'origine de votre frontend
}));

// Middleware pour renforcer la sécurité
app.use(helmet());
app.use(bodyParser.json());

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validation et filtrage des données
    if (!validator.isEmail(email)) {
        console.error('Email invalide:', email); // Ajout d'un log
        return res.status(400).send('Adresse email invalide');
    }
    if (!name || !email || !message) {
        console.error('Champs manquants:', { name, email, message }); // Ajout d'un log
        return res.status(400).send('Tous les champs sont requis.');
    }

    const sanitizedName = xss(name); // Filtrer le nom pour prévenir les attaques XSS
    const sanitizedMessage = xss(message); // Filtrer le message pour prévenir les attaques XSS

    // Configurer le transporteur d'email avec un mot de passe d'application
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD // Utilisez un mot de passe d'application ici
        }
    });

    const mailOptions = {
        from: 'ronniking99@gmail.com',
        to: process.env.EMAIL,
        subject: 'Test Email',
        text:  'Ceci est un test.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
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