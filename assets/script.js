   // script.js

   document.addEventListener("DOMContentLoaded", function() {
    // Sélectionner tous les liens de navigation
    const navLinks = document.querySelectorAll('.main-nav a');

    // Ajouter un écouteur d'événements pour chaque lien
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien

            // Récupérer l'ID de la section cible
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            console.log(`Naviguer vers : ${targetId}`); // Debug

            // Faire défiler la page vers la section cible
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth', // Défilement fluide
                    block: 'start' // Aligne le début de la section en haut de la fenêtre
                });
            } else {
                console.log(`Section non trouvée : ${targetId}`); // Debug
            }
        });
    });
});