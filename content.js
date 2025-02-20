let default_config = "dHJ1ZXx0cnVlfHRydWV8dHJ1ZXx0cnVlfGZhbHNlfGZhbHNlfGZhbHNlfHRydWV8ZmFsc2V8dHJ1ZXx0cnVlfGZhbHNlfGZhbHNlfHRydWV8ZmFsc2V8ZmFsc2V8ZmFsc2U=";
browser.storage.local.get("smartbalance").then(data => {
    if (data.smartbalance) {
        localStorage.setItem("smartbalance", data.smartbalance);
    } else {
        localStorage.setItem("smartbalance", default_config);
        browser.storage.local.set({ smartbalance: default_config }).then();
    }
}).catch(error => {
    localStorage.setItem("smartbalance", default_config);
    console.error("Erreur lors du chargement de la variable 'smartbalance':", error);
});

let default_color = "I2YwYzgyOHwjYzg0NjQ2fCNjODhjOGN8I2FkNWQ5M3wjYzg5NmM4";
browser.storage.local.get("smartbalancec").then(data => {
    if (data.smartbalancec) {
        localStorage.setItem("smartbalancec", data.smartbalancec);
    } else {
        localStorage.setItem("smartbalancec", default_color);
        browser.storage.local.set({ smartbalancec: default_color }).then();
    }
}).catch(error => {
    localStorage.setItem("smartbalancec", default_color);
    console.error("Erreur lors du chargement de la variable 'smartbalancec':", error);
});



browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
        if (changes.smartbalance) {
            localStorage.setItem("smartbalance", changes.smartbalance.newValue);
            window.dispatchEvent(new Event("storage"));
        } else if (changes.smartbalancec) {
            localStorage.setItem("smartbalancec", changes.smartbalancec.newValue);
            window.dispatchEvent(new Event("storage"));
        }
    }
});



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
