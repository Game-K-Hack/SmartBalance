(function() {
    'use strict';

    const HOURS_PER_WEEK = 38;
    const HOURS_PER_DAY = HOURS_PER_WEEK/5;
    const HOURS_PER_DAY_S = HOURS_PER_DAY*3600;
    const CARD_CONFIG = {
        "hjt": {
            "icon": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M12 20q-1.649 0-3.108-.626t-2.55-1.716t-1.716-2.55T4 12q0-.965.212-1.849q.211-.884.59-1.671q.379-.788.916-1.46q.538-.672 1.19-1.22l6.107 6.108l-.707.708l-5.4-5.4q-.789.88-1.349 2.05T5 12q0 2.9 2.05 4.95T12 19t4.95-2.05T19 12q0-2.617-1.76-4.651T12.5 5.023V7h-1V4h.5q1.649 0 3.108.626t2.55 1.716t1.716 2.55T20 12t-.626 3.108t-1.716 2.55t-2.55 1.716T12 20m-5.001-7.23q-.328 0-.548-.222t-.22-.55t.221-.547t.55-.22t.547.221t.22.55t-.221.547t-.55.22m5 5q-.327 0-.547-.221t-.22-.55t.221-.547t.55-.22t.547.221t.22.55t-.221.547t-.55.22m5-5q-.327 0-.547-.221t-.22-.55t.221-.547t.55-.22t.547.221t.22.55t-.221.547t-.55.22"/></svg>`, 
            "title": "Heures du jour"
        }, 
        "bs": {
            "icon": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M3 20v-1h8.5V7.94q-.708-.129-1.25-.642T9.56 6H6.116L9 13.212q-.058 1-.929 1.702T6 15.616t-2.071-.702T3 13.212L5.885 6H4V5h5.56q.165-.836.834-1.418T12 3t1.606.582T14.44 5H20v1h-1.884L21 13.212q-.058 1-.929 1.702T18 15.616t-2.071-.702T15 13.212L17.884 6h-3.443q-.149.785-.691 1.298t-1.25.643V19H21v1zm12.99-6.884h4.02L18 8.092zm-12 0h4.02L6 8.092zM12 7q.617 0 1.059-.441q.441-.442.441-1.059t-.441-1.059Q12.617 4 12 4t-1.059.441T10.5 5.5t.441 1.059Q11.383 7 12 7"/></svg>`, 
            "title": "Balance de la semaine"
        }, 
        "hsi": {
            "icon": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M11 12.77q.329 0 .549-.23t.22-.54q0-.329-.22-.549t-.549-.22q-.31 0-.54.22t-.23.549q0 .31.23.54t.54.23M7 20v-1l7-.692V6.452q0-.567-.37-.983q-.368-.415-.91-.465L7.615 4.5v-1l5.23.516q.927.103 1.54.794Q15 5.5 15 6.427v12.762zm-2.539 0v-1H6V5.116q0-.697.472-1.156q.472-.46 1.144-.46h8.769q.696 0 1.156.46T18 5.116V19h1.539v1zM7 19h10V5.116q0-.27-.173-.443t-.442-.173h-8.77q-.269 0-.442.173T7 5.116z"/></svg>`, 
            "title": "Heures de sortie idéales"
        }, 
        "hsiq": {
            "icon": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M11 12.77q.329 0 .549-.23t.22-.54q0-.329-.22-.549t-.549-.22q-.31 0-.54.22t-.23.549q0 .31.23.54t.54.23M7 20v-1l7-.692V6.452q0-.567-.37-.983q-.368-.415-.91-.465L7.615 4.5v-1l5.23.516q.927.103 1.54.794Q15 5.5 15 6.427v12.762zm-2.539 0v-1H6V5.116q0-.697.472-1.156q.472-.46 1.144-.46h8.769q.696 0 1.156.46T18 5.116V19h1.539v1zM7 19h10V5.116q0-.27-.173-.443t-.442-.173h-8.77q-.269 0-.442.173T7 5.116z"/></svg>`, 
            "title": "Heures de sortie idéales équilibré"
        }
    }

    let settingIds = [
        "hjt", "hjtt", 
        "bs", "bse", "bst", 
        "b30dj", "b30dje", "b30djt", 
        "hsi", "hsit", 
        "hsid", "hsidt", "hsidc", 
        "hsiq", "hsiqt", 
        "hsiqd", "hsiqdt", "hsiqdc"
    ];
    let boxIds = ["hjt", "bs", "b30dj", "hsi", "hsiq"];

    let lockexecute = 0;
    let lockdisplay = 0;
    let saveTime = "";

    let userData = null;

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    function getsrhdata() {
        let date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let ctx = srh.getIdContext();
        let data = {"script":"ws_gtareadtables","popu":[[srh.user.id,1]],"ddeb":formatDate(firstDay),"dfin":formatDate(lastDay),"tables":["cpointagereel"],"lastResult":true,"headerrows":true,"byday":false,"order":"nextday,mitem","idcontext":ctx,"pversion":-1,"lang":"fr","debug":false}
        data = encodeURIComponent(srh.ajax.buildWSParameter(data));
        return data;
    }

    function gettime() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/smartw080/srh/smartrh/smartrh", false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send("ctx=" + getsrhdata());
        if (xhr.status == 200) {
            let data = JSON.parse(xhr.responseText.slice(1, -1));
            return data;
        }
    }

    function data2time(data) {
        let timedata = {};
        let timelist = data.response.popu[srh.user.id.toString()]["1"].cpointagereel.rows;
        timelist.forEach((r) => timedata[r.datecorr.val] = []);
        timelist.forEach((r) => timedata[r.datecorr.val].push(r.timecorr.val));
        return timedata;
    }

    function time2seconds(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function sortTimes(times) {
        return times.sort((a, b) => time2seconds(a) - time2seconds(b));
    }

    function groupByWeek(dates) {
        function getWeekInfo(date) {
            const current = new Date(date);
            const firstDayOfYear = new Date(current.getFullYear(), 0, 1);
            const pastDaysOfYear = (current - firstDayOfYear) / (1000 * 60 * 60 * 24);
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            return {
                year: current.getFullYear(),
                week: weekNumber,
            };
        }

        const grouped = {};

        dates.forEach(date => {
            const { year, week } = getWeekInfo(date);
            const key = `${year}-W${week}`;

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(date);
        });

        return Object.values(grouped);
    }

    function findCurrentWeekIndex(dates) {
        const groupedWeeks = groupByWeek(dates);
        return groupedWeeks.length-1;
    }

    function getLocalTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function seconds2timeformat(seconds) {
        let s = seconds < 0 ? -seconds : seconds;
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        let formattedHours = String(hours);
        let formattedMinutes = String(minutes);
        const sh = hours > 1 ? "s": "";
        const sm = minutes > 1 ? "s": "";
        if (hours != 0) {
            return `${formattedHours} heure${sh} et ${formattedMinutes} minute${sm}`;
        } else if (minutes != 0) {
            return `${formattedMinutes} minute${sm}`;
        } else {
            return `Pas de temps`;
        }
    }

    function seconds2timeformatH(seconds) {
        let s = seconds < 0 ? -seconds : seconds;
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours} h ${formattedMinutes}`;
    }

    function checked(id) {
        let actv = localStorage.getItem("smartbalance");
        if (settingIds.includes(id)) {
            return atob(actv).split("|")[settingIds.indexOf(id)] === "true";
        } else {
            return false;
        }
    }

    function get_innerHTML_card(id, value, detailvalue, bl) {
        let newtext = "";
        let newdetailtext = "";

        if (checked(id + "t")) {
            newtext = seconds2timeformat(value);
            if (bl) {
                if (value < 0) {
                    newtext = newtext + " de retard";
                } else {
                    newtext = newtext + " d'avance";
                }
            }
        } else {
            newtext = value < 0 ? "- " : "";
            newtext += seconds2timeformatH(value);
        }

        if (checked(id + "e")) {
            if (value > 0) {
                newtext = "💪 " + newtext;
            } else {
                newtext = "⚠️ " + newtext;
            }
        }

        if (checked(id + "c")) {
            let colortext = "#aa1e1e";
            if (value >= 0) { colortext = "#3cb478"; }
            newtext = `<span style="color: ${colortext};">${newtext}</span>`;
        }

        if (checked(id + "d") && detailvalue) {
            if (checked(id + "dt")) {
                newdetailtext = seconds2timeformat(detailvalue);
                newdetailtext = (detailvalue < 0 ? "dans " : "il y a ") + newdetailtext;
            } else {
                newdetailtext = seconds2timeformatH(detailvalue);
                newdetailtext = (detailvalue < 0 ? "- " : "+ ") + newdetailtext;
            }

            if (checked(id + "dc")) {
                let colordetailtext = "#aa1e1e";
                if (detailvalue >= 0) { colordetailtext = "#3cb478"; }
                newdetailtext = `<span style="color: ${colordetailtext};">${newdetailtext}</span>`;
            } else {
                newdetailtext = `<span>${newdetailtext}</span>`;
            }
            newdetailtext += "<span></span>";
        }

        return newtext + newdetailtext;
    }

    function add_card(id, base_elm, value, detailvalue, bl) {
        if (checked(id)) {
            let elm = base_elm.cloneNode(true);
            elm.id = id;
            let clr = atob(localStorage.getItem("smartbalancec")).split("|");
            elm.style.backgroundColor = clr[boxIds.indexOf(id)];
            elm.querySelector(`span[data-cy="CsIcon-light"]`).innerHTML = CARD_CONFIG[id]["icon"];
            elm.querySelector(`span[class="sub-details"]`).innerText = CARD_CONFIG[id]["title"];
            let h = elm.querySelector(`h2[class="details"]`)
            h.innerHTML = get_innerHTML_card(id, value, detailvalue, bl);
            h.style.display = "flex";
            h.style.justifyContent = "space-between";
            let prt = document.getElementById("cloned").querySelector(`div[class="conge-container"]`);
            prt.appendChild(elm);
        }
    }

    function card_seter(status) {
        if (document.getElementById("cloned")) {
            document.getElementById("cloned").remove();
        }

        let val = calcul();

        let elm = document.querySelector(`article[code="congeGta"]`).cloneNode(true);
        elm.classList.remove('position-5');
        elm.classList.add('position-6');
        elm.id = "cloned";

        let box = elm.querySelectorAll(`div[class="conge-container"] div[class="conge-color card"]`);
        let base_box = box[0];
        for (let b of box) { b.remove(); }

        document.querySelector(`div[class="cs-dashboard-content"]`).appendChild(elm);

        if (status === "error") {
            lockdisplay = 1;
            elm.querySelector(`h2[class="cs-widget-title"]`).innerText = "Heures - ❌ Error";
        } else if (status === "wait") {
            lockdisplay = 1;
            elm.querySelector(`h2[class="cs-widget-title"]`).innerText = "Heures - ⏳ Wait...";
        } else if (val && (status === "display" || (status === "update" && lockdisplay === 0))) {
            lockdisplay = 0;
            elm.querySelector(`h2[class="cs-widget-title"]`).innerText = "Heures";

            add_card("hjt", base_box, val[0]);
            add_card("bs", base_box, val[1], null, true);
            // add_card("b30dj", base_box, val[2], null, true);
            let detailHeureDeSortieIdeale = time2seconds(getLocalTime()) - val[2];
            add_card("hsi", base_box, val[2], detailHeureDeSortieIdeale);
            let heureDeSortieIdealeEquilibre = val[2] - val[1];
            let detailHeureDeSortieIdealeEquilibre = time2seconds(getLocalTime()) - heureDeSortieIdealeEquilibre;
            add_card("hsiq", base_box, heureDeSortieIdealeEquilibre, detailHeureDeSortieIdealeEquilibre);
        }
    }

    function card_updater_value_changer(elm, id, value) {
        let box = elm.querySelector(`div[id="${id}"] h2[class="details"]`);
        if (box) {
            let newValue = get_innerHTML_card(id, value);
            if (box.innerHTML != newValue) {
                box.innerHTML = newValue;
            }
        }
    }

    function card_updater() {
        let elm = document.getElementById("cloned");
        if (elm) {
            let val = calcul();
            card_updater_value_changer(elm, "hjt", val[0]);
            card_updater_value_changer(elm, "bs", val[1]);
            // card_updater_value_changer(elm, "b30dj", val[2]);
            card_updater_value_changer(elm, "hsi", val[2], time2seconds(getLocalTime()) - val[2]);
            card_updater_value_changer(elm, "hsiq", val[2] - val[1]);

        }
    }

    function calcul() {
        if (userData === null) { return; }
        let timesorted = {};
        Object.keys(userData).forEach((key) => timesorted[key] = sortTimes(userData[key]));
        let weeks = groupByWeek(Object.keys(userData));
        weeks = weeks.map((week) => week.map((key) => timesorted[key]));
        let cw = weeks[weeks.length-1];

        let sbalance = 0;
        let sworkedtoday = 0;
        let sidealout = 0;
        let sweekwork = 0;

        let today = new Date().toISOString().split("T")[0];
        let htoday = getLocalTime();
        let currentweek = findCurrentWeekIndex(Object.keys(userData));

        if (currentweek > -1) {
            cw = weeks[currentweek];
            for (let i = 0; i < cw.length; i++) {
                if (cw[i].length != 4 && cw[i] != timesorted[today]) {
                    alert("ERROR: Vous avez oublié de pointer !");
                } else if (cw[i].length == 4) {
                    sweekwork += (time2seconds(cw[i][1]) - time2seconds(cw[i][0])) + (time2seconds(cw[i][3]) - time2seconds(cw[i][2]));
                }
            }
        }
        
        if (timesorted[today] !== undefined) {
            if (timesorted[today].length == 1) {
                sworkedtoday = time2seconds(htoday) - time2seconds(timesorted[today][0]);
                sidealout = time2seconds(htoday) + (HOURS_PER_DAY_S - sworkedtoday);
            } else if (timesorted[today].length == 2) {
                sworkedtoday = time2seconds(timesorted[today][1]) - time2seconds(timesorted[today][0]);
                sidealout = time2seconds(htoday) + (HOURS_PER_DAY_S - sworkedtoday);
            } else if (timesorted[today].length == 3) {
                sworkedtoday = time2seconds(timesorted[today][1]) - time2seconds(timesorted[today][0]);
                sworkedtoday += time2seconds(htoday) - time2seconds(timesorted[today][2]);
                sidealout = time2seconds(htoday) + (HOURS_PER_DAY_S - sworkedtoday);
                if (sworkedtoday-HOURS_PER_DAY_S > 0) {
                    sweekwork += sworkedtoday - HOURS_PER_DAY_S;
                }
            } else if (timesorted[today].length == 4) {
                sworkedtoday = time2seconds(timesorted[today][1]) - time2seconds(timesorted[today][0]);
                sworkedtoday += time2seconds(timesorted[today][3]) - time2seconds(timesorted[today][2]);
                sidealout = time2seconds(htoday) + (HOURS_PER_DAY_S - sworkedtoday);
                sbalance = sweekwork - (HOURS_PER_DAY_S*(cw.length));
            }

            if (timesorted[today].length < 4) {
                sbalance = sweekwork - (HOURS_PER_DAY_S*(cw.length-1));
            }
        } else {
            sbalance = sweekwork - (HOURS_PER_DAY_S*(cw.length));
        }

        return [sworkedtoday, sbalance, sidealout];
    }

    function executeWhenElementCreated() {
        if (lockexecute === 1) {
            return;
        }
        lockexecute = 1;
        setTimeout(() => { lockexecute = 0; }, 2000);
        // card_seter("wait");
        userData = gettime();
        if (Object.keys(userData).includes("error") && Object.keys(userData).includes("codeError")) {
            card_seter("error");
            return;
        }
        userData = data2time(userData);
        card_seter("display");
        lockexecute = 0;
        return "end"
    }

    function initializeObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (document.querySelector('article[code="congeGta"] div.conge-container[class="conge-container"] div[class="conge-color card"] svg g path')) {
                        setTimeout(() => {
                            let res = executeWhenElementCreated();
                            if (res === "end") {
                                observer.disconnect();
                                setInterval(card_updater, 30000);
                            }
                        }, 100);
                    } else if (document.querySelector('article[code="congeGta"]')) {
                        // card_seter("wait");
                    }
                    
                }
            }
        });
        observer.observe(targetNode, config);
    }

    function eventStorage() {
        window.addEventListener("storage", (event) => {
            card_seter("update");
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeObserver);
        document.addEventListener('DOMContentLoaded', eventStorage);
    } else {
        initializeObserver();
        eventStorage();
    }

})();
