        // Toggle mobile menu
        const toggleButton = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuLabel = document.getElementById('menu-label');

        toggleButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');

            // Toggle the menu visibility
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('pt-4');

            // Update the menu label visibility
            menuLabel.classList.toggle('hidden', !isHidden);
        });

  /*      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenuu = document.getElementById('mobile-menu');
        const sidebar = document.getElementById('sidebar');

        mobileMenuToggle.addEventListener('click', () => {
            // Alternar menú móvil
            const isMenuOpen = mobileMenu.classList.contains('hidden');
            mobileMenuu.classList.toggle('hidden', !isMenuOpen);
            document.body.classList.toggle('bg-black', isMenuOpen);
            document.body.classList.toggle('bg-opacity-50', isMenuOpen);
        });*/ 