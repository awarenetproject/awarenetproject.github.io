class SiteHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '.';
        const activePage = this.getAttribute('active-page') || '';

        this.innerHTML = `
        <header class="site-header">
            <nav class="navbar">
                <a class="navbar__brand" href="${basePath}/index.html" aria-label="AWARENET">
                    <span class="navbar__logos">
                        <img class="navbar__partner" src="${basePath}/assets/images/team/uni_icons/cariparo.png"
                            alt="Fondazione Cariparo logo">
                    </span>
                    <span class="navbar__identity" style="flex-direction: row; gap: 0.75rem; align-items: center; margin-left: 1.5rem;">
                        <img src="${basePath}/assets/images/logos/awarenet_logo.svg" 
                            alt="AWARENET logo" 
                            style="height: 2.5rem; width: auto; object-fit: contain;">
                        <span class="navbar__title">AWARENET</span>
                    </span>
                </a>
                <button class="navbar__toggle" aria-expanded="false" aria-controls="primary-navigation">☰</button>
                <ul id="primary-navigation" class="navbar__menu">
                    <li class="navbar__item"><a href="${basePath}/index.html" class="navbar__link ${activePage === 'home' ? 'navbar__link--active' : ''}">Home</a></li>
                    <li class="navbar__item"><a href="${basePath}/pages/research.html" class="navbar__link ${activePage === 'research' ? 'navbar__link--active' : ''}">Research</a></li>
                    <li class="navbar__item"><a href="${basePath}/pages/team.html" class="navbar__link ${activePage === 'team' ? 'navbar__link--active' : ''}">Team</a></li>
                    <li class="navbar__item"><a href="${basePath}/pages/news.html" class="navbar__link ${activePage === 'news' ? 'navbar__link--active' : ''}">News</a></li>
                    <li class="navbar__item"><a href="${basePath}/pages/contact.html" class="navbar__link ${activePage === 'contact' ? 'navbar__link--active' : ''}">Contact</a></li>
                </ul>
            </nav>
        </header>
        `;

        this.initToggle();
    }

    initToggle() {
        const toggleButton = this.querySelector('.navbar__toggle');
        const navigation = this.querySelector('#primary-navigation');

        if (toggleButton && navigation) {
            toggleButton.addEventListener('click', () => {
                const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
                toggleButton.setAttribute('aria-expanded', String(!expanded));
                navigation.classList.toggle('navbar__menu--open');
            });

            navigation.querySelectorAll('.navbar__link').forEach((link) => {
                link.addEventListener('click', () => {
                    navigation.classList.remove('navbar__menu--open');
                    toggleButton.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
}

customElements.define('site-header', SiteHeader);
