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

app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../')));

// Configuration Gmail SMTP SSL sur le port 465 (Optimal pour Render)
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const isSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: smtpPort,
    secure: isSecure, // true pour le port 465 (SSL)
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    connectionTimeout: 10000 // Timeout de 10s pour éviter les blocages indéfinis
});

// Vérification de la connexion au démarrage (pour voir directement les erreurs dans Render)
transporter.verify((error) => {
    if (error) {
        console.error('Erreur de connexion SMTP au démarrage :', error.message);
    } else {
        console.log('Serveur SMTP prêt à envoyer des emails');
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
            return res.status(500).send(`Erreur lors de l'envoi : ${error.message}`);
        }
        res.status(200).send('Message envoyé avec succès !');
    });
});

// ROUTE API QUESTIONNAIRE
app.post('/api/questionnaire', (req, res) => {
    try {
        const projectTitle = String(req.body.project_title || '').trim();
        const pdfData = String(req.body.pdf || '');

        if (!projectTitle || !pdfData) {
            return res.status(400).send('Le nom du projet est requis.');
        }

        const pdfBuffer = Buffer.from(pdfData, 'base64');
        if (pdfBuffer.subarray(0, 4).toString() !== '%PDF') {
            return res.status(400).send('Le fichier envoyé n’est pas un PDF valide.');
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `Nouveau questionnaire : ${xss(projectTitle)}`,
            text: `Questionnaire PDF reçu pour le projet : ${xss(projectTitle)}`,
            attachments: [{
                filename: `Questionnaire_${projectTitle.replace(/[^a-z0-9_-]+/gi, '_')}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }]
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Erreur Nodemailer Questionnaire:', error);
                return res.status(500).send(`Erreur d'envoi mail : ${error.message}`);
            }
            res.status(200).send('Questionnaire envoyé avec succès.');
        });
    } catch (err) {
        console.error('Erreur serveur interne :', err);
        res.status(500).send(`Erreur traitement : ${err.message}`);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});