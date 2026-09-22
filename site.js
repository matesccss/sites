/* =============================================================
   SITE.JS — interacciones compartidas de toda la web
   - Menú: desplegables CCSS I / CCSS II + hamburguesa móvil
     (usa delegación de eventos sobre document, así funciona
     aunque el menú se inyecte más tarde vía fetch + innerHTML,
     que es precisamente lo que impedía que el script antiguo
     -metido dentro de menu.html- llegara a ejecutarse nunca)
   - Animación de aparición al hacer scroll (IntersectionObserver)
   ============================================================= */

(function () {

    /* =========================================================
       MENÚ — delegación de eventos (funciona sin esperar a que
       el menú exista todavía en el DOM)
       ========================================================= */

    document.addEventListener("click", function (e) {

        const dropdownBtn = e.target.closest(".dropdown-btn");

        if (dropdownBtn) {

            e.preventDefault();
            e.stopPropagation();

            const dropdown = dropdownBtn.closest(".menu-dropdown");

            document.querySelectorAll(".menu-dropdown").forEach(function (d) {
                if (d !== dropdown) d.classList.remove("abierto");
            });

            dropdown.classList.toggle("abierto");

            return;
        }

        const toggle = e.target.closest("#menuToggle");

        if (toggle) {

            e.preventDefault();
            e.stopPropagation();

            document.getElementById("menuPrincipal")?.classList.toggle("abierto");

            return;
        }

        /* Clic en un enlace del menú (móvil): cerrar todo */

        if (e.target.closest("#menuContenido a")) {

            document.getElementById("menuPrincipal")?.classList.remove("abierto");

            document.querySelectorAll(".menu-dropdown").forEach(function (d) {
                d.classList.remove("abierto");
            });

            return;
        }

        /* Clic fuera: cerrar desplegables y menú móvil */

        if (!e.target.closest(".menu-dropdown")) {
            document.querySelectorAll(".menu-dropdown").forEach(function (d) {
                d.classList.remove("abierto");
            });
        }

        if (!e.target.closest(".menu")) {
            document.getElementById("menuPrincipal")?.classList.remove("abierto");
        }

    });

    /* Cerrar con la tecla Escape */

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {
            document.querySelectorAll(".menu-dropdown").forEach(function (d) {
                d.classList.remove("abierto");
            });
            document.getElementById("menuPrincipal")?.classList.remove("abierto");
        }

    });


    /* =========================================================
       ANIMACIÓN DE APARICIÓN AL HACER SCROLL
       Se aplica automáticamente a los bloques principales de
       cualquier página, sin necesidad de tocar el HTML.
       ========================================================= */

    function iniciarReveal() {

        const selector = [
            ".quick-card", ".pau-card", ".board-wrapper", ".news-card",
            ".btn-tema", ".aviso-examen", ".curiosidades",
            ".video-section", "details.tema", "details.acordeon",
            ".game-card", ".reel-card", ".recurso",
            ".send-reel-box", ".banner"
        ].join(",");

        const elementos = document.querySelectorAll(selector);

        if (!elementos.length) return;

        elementos.forEach(function (el) {
            el.classList.add("reveal");
        });

        if (!("IntersectionObserver" in window)) {
            elementos.forEach(function (el) { el.classList.add("in-view"); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry, i) {

                if (entry.isIntersecting) {

                    const el = entry.target;
                    const retraso = (i % 6) * 60;

                    setTimeout(function () {
                        el.classList.add("in-view");
                    }, retraso);

                    observer.unobserve(el);

                }

            });

        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

        elementos.forEach(function (el) { observer.observe(el); });

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarReveal);
    } else {
        iniciarReveal();
    }

    /* Los bloques que llegan más tarde (menú, contenido inyectado)
       también deben poder animarse si se añaden dinámicamente. */
    const bodyObserver = new MutationObserver(function () {
        iniciarReveal();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    /* Evitar observar indefinidamente: paramos tras la carga inicial */
    window.addEventListener("load", function () {
        setTimeout(function () { bodyObserver.disconnect(); }, 3000);
    });

})();
