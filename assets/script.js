document.addEventListener("DOMContentLoaded", function() {
    // ----------------------------------------------------
    // INITIALISATION EMAILJS
    // ----------------------------------------------------
    if (typeof emailjs !== 'undefined') {
        emailjs.init("ycxVpyjoNcogYWwHY");
    }
    const navLinks = document.querySelectorAll('.main-nav a, .nav-link');
    const sections = document.querySelectorAll('.section-content');
    const loadingScreen = document.getElementById('loading');
    const logoImg = document.querySelector('.logo-img');
    
    // Formulaires
    const contactForm = document.getElementById('contact-form');
    const modalForm = document.getElementById('modal-form');
    const phoneInput = document.querySelector("#modal-phone");
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Éléments de la Modale
    const modal = document.querySelector('.modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal');

    // ----------------------------------------------------
    // 1. FONCTION D'AFFICHAGE DU MESSAGE DE SUCCÈS DANS LA MODALE
    // ----------------------------------------------------
    function showSuccessModal(title, message) {
        const formContainer = document.getElementById('modal-form-container');
        const successContainer = document.getElementById('modal-success-message');
        const successTitle = document.getElementById('success-title');
        const successText = document.getElementById('success-text');

        if (modal && successContainer) {
            // Masque le formulaire interne
            if (formContainer) formContainer.style.display = 'none';

            // Met à jour les textes
            if (successTitle) successTitle.textContent = title;
            if (successText) successText.textContent = message;

            // Affiche le message de succès dans la boîte blanche
            successContainer.style.display = 'block';

            // Ouvre la modale
            modal.classList.add('active');
        }
    }

    // ----------------------------------------------------
    // 2. GESTION DE LA NAVIGATION PAR SECTIONS
    // ----------------------------------------------------
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href'); 
            
            if (targetId && targetId.startsWith('#')) {
                event.preventDefault();

                if (loadingScreen) loadingScreen.style.display = 'flex';

                document.querySelectorAll('.section-content').forEach(section => {
                    section.classList.remove('active');
                });

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    setTimeout(() => {
                        if (loadingScreen) loadingScreen.style.display = 'none';
                    }, 400);
                } else {
                    console.error(`Section non trouvée: ${targetId}`);
                    if (loadingScreen) loadingScreen.style.display = 'none';
                }
            }
        });
    });

    // ----------------------------------------------------
    // 3. GESTION DU LOGO
    // ----------------------------------------------------
    if (logoImg) {
        logoImg.addEventListener('click', function() {
            logoImg.classList.toggle('active');
        });
    }

    // ----------------------------------------------------
    // 4. TRAITEMENT DES FORMULAIRES AVEC EMAILJS
    // ----------------------------------------------------
    function handleFormSubmit(formElement, getSuccessMessage) {
        if (!formElement) return;

        // Validation visuelle en direct du champ email
        const emailInput = formElement.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (emailInput.validity.valid) {
                    emailInput.classList.remove('invalid');
                    emailInput.classList.add('valid');
                } else {
                    emailInput.classList.remove('valid');
                    emailInput.classList.add('invalid');
                }
            });
        }

        // Soumission vers EmailJS
        formElement.addEventListener('submit', function(event) {
            event.preventDefault();

            if (formElement === modalForm && iti && phoneInput) {
                phoneInput.value = iti.getNumber();
            }

            const formData = new FormData(formElement);
            const data = Object.fromEntries(formData.entries());
            const clientName = data.name || 'Cher client';

            emailjs.sendForm('service_ctmgeoh', 'template_rfrt9rg', formElement)
                .then(() => {
                    formElement.reset();
                    if (emailInput) emailInput.classList.remove('valid', 'invalid');

                    const msgInfo = getSuccessMessage(clientName);
                    showSuccessModal(msgInfo.title, msgInfo.message);
                }, (error) => {
                    console.error('Erreur EmailJS :', error);
                    alert("Erreur lors de l'envoi du message : " + JSON.stringify(error));
                });
        });
    }

    // Liaison des formulaires
    handleFormSubmit(contactForm, (name) => ({
        title: `Merci ${name} !`,
        message: "Votre message a bien été transmis à Waka'Company. Nous vous répondrons sous 24h."
    }));

    handleFormSubmit(modalForm, (name) => ({
        title: `Merci ${name} !`,
        message: "Votre demande de devis a bien été envoyée. Un conseiller reprendra contact avec vous rapidement."
    }));

    handleFormSubmit(newsletterForm, () => ({
        title: "Inscription réussie !",
        message: "Vous êtes désormais inscrit à la newsletter de Waka'Company."
    }));

    // ----------------------------------------------------
    // 5. GESTION DE LA MODALE (OUVERTURE & FERMETURE)
    // ----------------------------------------------------
    function resetModalContent() {
        const formContainer = document.getElementById('modal-form-container');
        const successContainer = document.getElementById('modal-success-message');
        
        if (formContainer) formContainer.style.display = 'block';
        if (successContainer) successContainer.style.display = 'none';
    }

    if (modal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                resetModalContent();
                modal.classList.add('active');
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    // --- DÉBUT BLOC INDICATIF TÉLÉPHONE ---
let iti = null;
if (phoneInput && typeof window.intlTelInput !== 'undefined') {
    iti = window.intlTelInput(phoneInput, {
        initialCountry: "fr",
        preferredCountries: ["fr", "be", "ch", "ca", "ci", "sn"],
        nationalMode: false,
        useFullscreenPopup: false, 
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js"
    });
}

// --- FIN BLOC INDICATIF TÉLÉPHONE ---

    // ----------------------------------------------------
    // 6. AFFICHAGE TOGGLE FLYS
    // ----------------------------------------------------
    const toggleFlys = document.getElementById('toggle-flys');
    if (toggleFlys) {
        toggleFlys.addEventListener('click', function() {
            const flysContainer = document.querySelector('.flys-container');
            if (flysContainer) {
                const isHidden = flysContainer.style.display === 'none' || flysContainer.style.display === '';
                flysContainer.style.display = isHidden ? 'block' : 'none';
            }
        });
    }
});