// Fonction pour charger et injecter le script en utilisant chrome.scripting
function injectScriptFile() {
    // On crée un élément script qui va charger notre fichier externe
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('script.js');
    script.type = 'text/javascript';
    
    // On attend que le document soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(script);
        });
    } else {
        document.head.appendChild(script);
    }
}

// On exécute l'injection
injectScriptFile();
