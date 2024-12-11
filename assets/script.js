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
    // Remplacez par votre clé d'API


});