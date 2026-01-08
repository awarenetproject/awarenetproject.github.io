class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="site-footer">
            <p>&copy; <span id="current-year"></span> AWARENET. All rights reserved.</p>
        </footer>
        `;

        const yearSpan = this.querySelector('#current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
}

customElements.define('site-footer', SiteFooter);
