function injectScript(content) {
    const script = document.createElement('script');
    script.textContent = content;
    document.documentElement.appendChild(script);
    script.remove();
}

browser.storage.local.get("smartbalance").then(data => {
    if (data.smartbalance) {
        sessionStorage.setItem("smartbalance", data.smartbalance);
    } else {
        sessionStorage.setItem("smartbalance", "");
        browser.storage.local.set({ smartbalance: null }).then();
    }
}).catch(error => console.error("Erreur lors du chargement de la variable 'smartbalance':", error));

browser.storage.local.get("smartbalancec").then(data => {
    if (data.smartbalancec) {
        sessionStorage.setItem("smartbalancec", data.smartbalancec);
    } else {
        sessionStorage.setItem("smartbalancec", "");
        browser.storage.local.set({ smartbalancec: "I2YwYzgyOHwjYzg0NjQ2fCNjODhjOGN8I2FkNWQ5M3wjYzg5NmM4" }).then();
    }
}).catch(error => console.error("Erreur lors du chargement de la variable 'smartbalancec':", error));

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
