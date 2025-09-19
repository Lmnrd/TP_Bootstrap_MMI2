// Barre de navigation transparente → fond solide au défilement
// Ce script utilise IntersectionObserver pour détecter quand la section "Img_transparent"
// quitte le viewport et bascule les classes sur la barre de navigation en conséquence.

(function () {
    // Références DOM mises en cache
    const navbar = document.getElementById('barreNavigation');
    const sections = Array.from(document.querySelectorAll('.section-img-transparente'));

    // Pour garder la barre "solide" plus longtemps, on exige qu'une plus
    // grande portion de la section soit visible avant de redevenir transparente.
    const VISIBLE = 0.6; // 60% visible requis pour passer en transparent
    const OFFSET = 80; // px sous le haut de l'écran à tester

    // Sécurité : on quitte si les éléments requis sont absents
    if (!navbar || sections.length === 0) return;

    // Au croisement : si au moins une section transparente est visible (≥60%), on reste transparent
    const updateByObserver = () => {
        const anyVisible = sections.some((section) => {
            const rect = section.getBoundingClientRect();
            const hauteurVisible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            return hauteurVisible > 0 && hauteurVisible >= rect.height * VISIBLE; // ≥ VISIBLE visible
        });

        if (anyVisible) {
            navbar.classList.remove('barre-solide');
            navbar.classList.add('barre-transparente');
        } else {
            navbar.classList.remove('barre-transparente');
            navbar.classList.add('barre-solide');
        }
    };

    // Observateur pour réagir aux entrées/sorties de viewport des sections ciblées
    const observer = new IntersectionObserver(updateByObserver, {
        threshold: VISIBLE,
        // Réduit légèrement la zone d'observation en haut pour éviter que la navbar
        // ne redevienne transparente trop tôt lorsqu'on arrive sur la zone blanche.
        rootMargin: "-80px 0px 0px 0px"
    });
    sections.forEach((section) => observer.observe(section));

    // Fallback réactif sur le scroll: on regarde si la zone sous la navbar chevauche
    // une section image. Cela fonctionne dans les deux sens (descente et remontée).
    let rafId = null;
    const onScroll = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
            rafId = null;
            const underOnImage = sections.some((section) => {
                const rect = section.getBoundingClientRect();
                const y = OFFSET; // point de test sous la navbar
                return rect.top <= y && rect.bottom >= y; // la zone test est au-dessus de l'image
            });

            if (underOnImage) {
                navbar.classList.remove('barre-solide');
                navbar.classList.add('barre-transparente');
            } else {
                navbar.classList.remove('barre-transparente');
                navbar.classList.add('barre-solide');
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Ajustement initial au chargement
    updateByObserver();
    onScroll();
})();


