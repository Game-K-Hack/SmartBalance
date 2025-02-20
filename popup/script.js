let whatalready = false;
let whatTimeoutId = null;
let settingIds = [
  "ihjt", "ihjtt", 
  "ibs", "ibse", "ibst", 
  "ib30dj", "ib30dje", "ib30djt", 
  "ihsi", "ihsit", 
  "ihsid", "ihsidt", "ihsidc", 
  "ihsiq", "ihsiqt", 
  "ihsiqd", "ihsiqdt", "ihsiqdc"
];
let colorIds = ["chjt", "cbs", "cb30dj", "chsi", "chsie"];

function getValueById(id) {
  return document.getElementById(id).checked;
}

function what() {
  let lvl1 = [
    getValueById("ihjt"), 
    getValueById("ibs"), 
    getValueById("ib30dj"), 
    getValueById("ihsi"), 
    getValueById("ihsiq"), 
  ]
  if (lvl1.toString() == [false, false, false, false, false].toString()) {
    if (!whatalready) {
      whatalready = true;
      window.scrollTo(1, 1);
      document.getElementById("what").style.display = "unset";
    }
  } else {
    whatalready = false;
    document.getElementById("what").style.display = "none";
  }
}

function update() {
  if (whatTimeoutId != null) {
    clearTimeout(whatTimeoutId)
  }
  if (!whatalready) {
    whatTimeoutId = setTimeout(what, 5000);
  } else {
    what();
  }

  let vals = [];
  for (let id of settingIds) { vals.push(getValueById(id)); }
  let value = btoa(vals.join("|"));
  browser.storage.local.set({ smartbalance: value });

  let valsc = [];
  for (let id of colorIds) { valsc.push(document.getElementById(id).value); }
  let valuec = btoa(valsc.join("|"));
  browser.storage.local.set({ smartbalancec: valuec });
}

function checkUrl(url) {
  const correctDomain = url.startsWith("https://portail-rh.algam.net");
  if (!correctDomain) {
    document.body.style.width = "10em";
    document.body.style.height = "6.5em";
    document.getElementById("page").style.display = "none";
  } else {
    document.getElementById("notpage").style.display = "none";

    browser.storage.local.get("smartbalance").then(data => {
      if (data.smartbalance) {
        for (let id of settingIds) {
          console.log(atob(data.smartbalance).split("|")[settingIds.indexOf(id)]);
          document.getElementById(id).checked = atob(data.smartbalance).split("|")[settingIds.indexOf(id)] === "true";
        }
      }
    }).catch(error => console.error("Erreur lors du chargement de la variable 'smartbalance' :", error));

    browser.storage.local.get("smartbalancec").then(data => {
      if (data.smartbalancec) {
        for (let id of colorIds) {
          console.log(atob(data.smartbalancec).split("|")[colorIds.indexOf(id)]);
          document.getElementById(id).value = atob(data.smartbalancec).split("|")[colorIds.indexOf(id)];
        }
      }
    }).catch(error => console.error("Erreur lors du chargement de la variable 'smartbalancec':", error));

    fetch(browser.runtime.getURL('../manifest.json')).then(
      response => response.text()
    ).then(text => {
      let v = text.split(`"version": "`)[1].split(`",`)[0];
      let a = "Vm0weE5HSXlUWGROVldoVlYwZDRWbFl3WkRSV1JteHlXa2M1VjFKdGVEQmFWV1JIVmtVeFYxZHVjRmRXTTFKUVZrZDRZV1JXUm5WaVJuQlhWbXhWZUZkV1VrZFRNbEpJVm10a2FsSnNjRTlaYlhSTFVsWmFjVk5ZYUZSTlZuQjZWMnRvVjJGc1NuUmhSbWhhWWtaV05GUnJXbXRXTVhCRlZXMTBUbFp1UWpaV1Z6QXhWakZhV0ZOcmJGSmlSM2hYV1d0YVlVMXNjRmRYYlhSWVZqQTFSMVF4V21GVWJVVjZVV3RvV0dKR1duWldWRVpTWlVaa1dXTkhhRlJTV0VKWVZtMHhORkl3TUhoVldHaFRWa2Q0VWxaV1VYZFBVVDA5";
      for (let step = 0; step < 8; step++) {a = atob(a);}
      a = a.split("|");
      document.getElementById("about").innerHTML = `<p>Auteur: <b>${a[0]}</b><br>Version: <b>${v}</b><br><br>Pour toutes demandes, problème et autre, vous pouvez me contacter à l'adresse mail suivante: <a href="mailto:${a[1]}">${a[1]}</a></p>`;
    })
    .catch(err => console.error('Erreur de chargement du manifest:', err));

    for (let id of settingIds.concat(colorIds)) {
      document.getElementById(id).addEventListener("click", update);
    }
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("what").style.display = "none";

  // Vérifier l'URL initiale
  const tabs = await browser.tabs.query({active: true, currentWindow: true});
  checkUrl(tabs[0].url);

  // Écouter les changements d'URL
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      checkUrl(changeInfo.url);
    }
  });

  document.getElementById("notpagebtn").addEventListener("click", function () {
    browser.tabs.create({
      url: "https://portail-rh.algam.net/smartw080/srh/smartrh/smartrh?smartrh=logon",
    });
    window.close();
  });
});