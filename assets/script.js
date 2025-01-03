document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const loadingScreen = document.getElementById('loading');

    // Gestion des clics sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            const targetId = this.getAttribute('href'); // Récupère l'ID de la section cible
            
            // Afficher l'écran de chargement
            loadingScreen.style.display = 'flex';

            // Masquer toutes les sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.remove('active');
            });

            // Afficher la section cible
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Masquer l'écran de chargement après un court délai
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500); // Ajustez le délai selon vos besoins
            } else {
                console.error(`Section not found: ${targetId}`);
                loadingScreen.style.display = 'none'; // Masquer l'écran de chargement en cas d'erreur
            }
        });
    });
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
    
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
    
        // Créez un objet avec les données du formulaire
        const data = {
            name: name,
            email: email,
            message: message
        };
    
        // Envoyer les données à votre serveur
        fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert('Message envoyé avec succès !');
                // Réinitialiser le formulaire
                document.getElementById('contact-form').reset();
            } else {
                alert('Erreur lors de l\'envoi du message.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'envoi du message.');
        });
    });
    const cors = require('cors');

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Remplacez par l'origine de votre frontend
}));


});