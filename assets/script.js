document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const loadingScreen = document.getElementById('loading');
    const logoImg = document.querySelector('.logo-img');
    
    // Formulaires
    const contactForm = document.getElementById('contact-form');
    const modalForm = document.getElementById('modal-form');
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
            // Masquer le formulaire interne s'il existe
            if (formContainer) formContainer.style.display = 'none';

            // Mettre à jour les textes
            if (successTitle) successTitle.textContent = title;
            if (successText) successText.textContent = message;

            // Afficher le message de succès
            successContainer.style.display = 'block';

            // Ouvrir la modale
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
    // 4. TRAITEMENT UNIFIÉ DES FORMULAIRES (AJAX / FETCH)
    // ----------------------------------------------------
    function handleFormSubmit(formElement, endpoint, getSuccessMessage) {
        if (!formElement) return;

        formElement.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(formElement);
            const data = Object.fromEntries(formData.entries());
            const clientName = data.name || 'Cher client';

            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    formElement.reset();
                    const msgInfo = getSuccessMessage(clientName);
                    showSuccessModal(msgInfo.title, msgInfo.message);
                } else {
                    alert('Erreur lors de l\'envoi. Veuillez réessayer.');
                }
            })
            .catch(error => {
                console.error('Erreur réseau:', error);
                alert('Erreur réseau lors de l\'envoi du formulaire.');
            });
        });
    }

    // Formulaire Contact classique
    handleFormSubmit(contactForm, '/api/contact', (name) => ({
        title: `Merci ${name} !`,
        message: "Votre message a bien été transmis à Waka'Company. Nous vous répondrons sous 24h."
    }));

    // Formulaire de la Modale
    handleFormSubmit(modalForm, '/api/contact', (name) => ({
        title: `Merci ${name} !`,
        message: "Votre demande de devis a bien été envoyée. Un conseiller reprendra contact avec vous rapidement."
    }));

    // Formulaire Newsletter
    handleFormSubmit(newsletterForm, '/api/newsletter', () => ({
        title: "Inscription réussie !",
        message: "Vous êtes désormais inscrit à la newsletter de Waka'Company."
    }));

    // ----------------------------------------------------
    // 5. GESTION DE LA MODALE (OUVERTURE & FERMETURE)
    // ----------------------------------------------------
    function resetModalContent() {
        const formContainer = document.getElementById('modal-form-container');
        const successContainer = document.getElementById('modal-success-message');
        
        // Remettre l'état par défaut (afficher formulaire, masquer succès)
        if (formContainer) formContainer.style.display = 'block';
        if (successContainer) successContainer.style.display = 'none';
    }

    if (modal) {
        // Ouverture via les boutons
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                resetModalContent();
                modal.classList.add('active');
            });
        });

        // Fermeture via le bouton X
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }

        // Fermeture au clic à l'extérieur
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

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
    function handleFormSubmit(formElement, endpoint, getSuccessMessage) {
    if (!formElement) return;

    formElement.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        const clientName = data.name || 'Cher client';

        // --------------------------------------------------
        // SIMULATION BACKEND (À la place du vrai fetch)
        // --------------------------------------------------
        console.log(`[TEST LOCAL] Données interceptées pour ${endpoint}:`, data);

        // On simule un délai réseau de 1 seconde (1000ms)
        new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ok: true, status: 200 });
            }, 1000);
        })
        .then(response => {
            if (response.ok) {
                formElement.reset();
                const msgInfo = getSuccessMessage(clientName);
                showSuccessModal(msgInfo.title, msgInfo.message);
            } else {
                alert('Erreur lors de l\'envoi. Veuillez réessayer.');
            }
        })
        .catch(error => {
            console.error('Erreur réseau simulée:', error);
        });
    });
}
function isValidEmail(email) {
    // Expression régulière standard pour vérifier la structure d'un e-mail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function handleFormSubmit(formElement, endpoint, getSuccessMessage) {
    if (!formElement) return;

    // 1. Validation en direct (supprime l'effet "bazar" avant le clic)
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

    // 2. Gestion de la soumission
    formElement.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        const clientName = data.name || 'Cher client';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // VIDAGE IMMÉDIAT DU FORMULAIRE (Évite de devoir actualiser)
                formElement.reset(); 
                if (emailInput) emailInput.classList.remove('valid', 'invalid');

                // Affichage de la modale de succès
                const msgInfo = getSuccessMessage(clientName);
                showSuccessModal(msgInfo.title, msgInfo.message);
            } else {
                alert('Erreur lors de l\'envoi. Veuillez réessayer.');
            }
        })
        .catch(error => {
            console.error('Erreur réseau:', error);
            alert('Erreur réseau lors de l\'envoi du formulaire.');
        });
    });
}
});