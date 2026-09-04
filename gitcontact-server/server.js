const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const validator = require('validator');
const helmet = require('helmet');
const xss = require('xss');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(helmet({ contentSecurityPolicy: false }));

// Support des données envoyées en JSON et en Formular (URL Encoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fichiers statiques
app.use(express.static(path.join(__dirname, '../')));

// Config Transporter Nodemailer unique
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ROUTE RACINE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ROUTE API CONTACT
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).send('Adresse email invalide');
    }
    if (!name || !message) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    const sanitizedName = xss(name);
    const sanitizedMessage = xss(message);

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Nouveau message de ${sanitizedName}`,
        text: `Nom: ${sanitizedName}\nEmail: ${email}\nMessage: ${sanitizedMessage}`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Erreur Nodemailer Contact:', error);
            return res.status(500).send('Erreur lors de l envoi de l email.');
        }
        res.status(200).send('Message envoyé avec succès !');
    });
});

// ROUTE API QUESTIONNAIRE (Placée AVANT app.listen)
app.post('/api/questionnaire', (req, res) => {
    const projectTitle = String(req.body.project_title || '').trim();

    if (!projectTitle) {
        return res.status(400).send('Le nom du projet est requis.');
    }

    const answers = Object.entries(req.body)
        .filter(([fieldName]) => fieldName !== 'project_title')
        .map(([fieldName, value]) => `${fieldName}: ${xss(String(value || '').trim() || 'Non renseigné')}`)
        .join('\n\n');

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Nouveau questionnaire : ${xss(projectTitle)}`,
        text: `Projet : ${xss(projectTitle)}\n\nDÉTAILS DES RÉPONSES :\n-------------------\n${answers}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Erreur Nodemailer Questionnaire:', error);
            return res.status(500).send("Erreur lors de l'envoi du questionnaire.");
        }
        res.status(200).send('Questionnaire envoyé avec succès.');
    });
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

// DÉMARRAGE DU SERVEUR (En toute fin de fichier)
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});