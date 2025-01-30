function injectScript(content) {
    const script = document.createElement('script');
    script.textContent = content;
    document.documentElement.appendChild(script);
    script.remove();
}

fetch(browser.runtime.getURL('script.js'))
    .then(response => response.text())
    .then(text => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => injectScript(text));
        } else {
            injectScript(text);
        }
    })
    .catch(err => console.error('Erreur de chargement du script:', err));
