document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments
    const sections = document.querySelectorAll('.section-content');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Fonction pour afficher une section
    function showSection(sectionId) {
        console.log('Showing section:', sectionId); // Debug
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
                section.classList.add('active');
                section.style.opacity = 0;
                setTimeout(() => {
                    section.style.opacity = 1;
                }, 10);
                console.log('Section activated:', section.id); // Debug
            } else {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
    }

    // Initialisation : afficher l'accueil et cacher les autres sections
    sections.forEach(section => {
        if (section.id === 'accueil') {
            section.style.display = 'block';
            section.classList.add('active');
        } else {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });

    // Gestion de la navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            console.log('Clicked link for:', targetId); // Debug
            showSection(targetId);
            history.pushState(null, '', `#${targetId}`);
        });
    });
    // Gérer le bouton retour du navigateur
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'accueil';
    showSection(hash);

    
});