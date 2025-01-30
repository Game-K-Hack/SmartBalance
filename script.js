(function() {
    'use strict';

    const HOURS_PER_WEEK = 38;
    const HOURS_PER_DAY = HOURS_PER_WEEK/5;
    const HOURS_PER_DAY_S = HOURS_PER_DAY*3600;

    let lockexecute = 0;

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
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const formattedHours = String(hours);
        const formattedMinutes = String(minutes);
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
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours} h ${formattedMinutes}`;
    }

    function boxhtml(h, b, i) {
        if (document.getElementById("cloned")) {
            document.getElementById("cloned").remove();
        }

        let hdj = "";
        let bdls = "";
        let hdsi = "";

        if (h === -1 && b === -1 && i === -1) {
            hdj = "⏳ Wait...";
            bdls = "⏳ Wait...";
            hdsi = "⏳ Wait...";
        } else if (h === -2 && b === -2 && i === -2) {
            hdj = "❌ Error";
            bdls = "❌ Error";
            hdsi = "❌ Error";
        } else if (h >= 0 || b >= 0 || i >= 0 ) {
            hdj = seconds2timeformat(h);
            if (seconds2timeformat(b) === "Pas de temps") {
                bdls = `Pas de temps d'avance`;
            } else {
                bdls = b < 0 ? `⚠️ ${seconds2timeformat(-b)} de retard` : `💪 ${seconds2timeformat(b)} d'avance`;
            }
            hdsi = seconds2timeformatH(i);
        }

        let elm = document.querySelector(`article[code="congeGta"]`).cloneNode(true);
        elm.classList.remove('position-5');
        elm.classList.add('position-6');
        elm.id = "cloned";
        elm.querySelector(`h2[class="cs-widget-title"]`).innerText = "Heures";

        let box = elm.querySelectorAll(`div[class="conge-container"] div[class="conge-color card"]`);
        let box1 = box[0];
        let box2 = box[1];
        let box3 = box[2];

        box1.style.backgroundColor = "#f0c828";
        box1.querySelector(`span[data-cy="CsIcon-light"]`).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M12 20q-1.649 0-3.108-.626t-2.55-1.716t-1.716-2.55T4 12q0-.965.212-1.849q.211-.884.59-1.671q.379-.788.916-1.46q.538-.672 1.19-1.22l6.107 6.108l-.707.708l-5.4-5.4q-.789.88-1.349 2.05T5 12q0 2.9 2.05 4.95T12 19t4.95-2.05T19 12q0-2.617-1.76-4.651T12.5 5.023V7h-1V4h.5q1.649 0 3.108.626t2.55 1.716t1.716 2.55T20 12t-.626 3.108t-1.716 2.55t-2.55 1.716T12 20m-5.001-7.23q-.328 0-.548-.222t-.22-.55t.221-.547t.55-.22t.547.221t.22.55t-.221.547t-.55.22m5 5q-.327 0-.547-.221t-.22-.55t.221-.547t.55-.22t.547.221t.22.55t-.221.547t-.55.22m5-5q-.327 0-.547-.221t-.22-.55t.221-.547t.55-.22t.547.221t.22.55t-.221.547t-.55.22"/></svg>`;
        box1.querySelector(`span[class="sub-details"]`).innerText = "Heures du jour";
        box1.querySelector(`h2[class="details"]`).innerText = hdj;

        box2.style.backgroundColor = "#c84646";
        box2.querySelector(`span[data-cy="CsIcon-light"]`).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M3 20v-1h8.5V7.94q-.708-.129-1.25-.642T9.56 6H6.116L9 13.212q-.058 1-.929 1.702T6 15.616t-2.071-.702T3 13.212L5.885 6H4V5h5.56q.165-.836.834-1.418T12 3t1.606.582T14.44 5H20v1h-1.884L21 13.212q-.058 1-.929 1.702T18 15.616t-2.071-.702T15 13.212L17.884 6h-3.443q-.149.785-.691 1.298t-1.25.643V19H21v1zm12.99-6.884h4.02L18 8.092zm-12 0h4.02L6 8.092zM12 7q.617 0 1.059-.441q.441-.442.441-1.059t-.441-1.059Q12.617 4 12 4t-1.059.441T10.5 5.5t.441 1.059Q11.383 7 12 7"/></svg>`;
        box2.querySelector(`span[class="sub-details"]`).innerText = "Balance de la semaine";
        box2.querySelector(`h2[class="details"]`).innerText = bdls;

        box3.style.backgroundColor = "#ad5d93";
        box3.querySelector(`span[data-cy="CsIcon-light"]`).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 18 18"><path fill="#fff" d="M11 12.77q.329 0 .549-.23t.22-.54q0-.329-.22-.549t-.549-.22q-.31 0-.54.22t-.23.549q0 .31.23.54t.54.23M7 20v-1l7-.692V6.452q0-.567-.37-.983q-.368-.415-.91-.465L7.615 4.5v-1l5.23.516q.927.103 1.54.794Q15 5.5 15 6.427v12.762zm-2.539 0v-1H6V5.116q0-.697.472-1.156q.472-.46 1.144-.46h8.769q.696 0 1.156.46T18 5.116V19h1.539v1zM7 19h10V5.116q0-.27-.173-.443t-.442-.173h-8.77q-.269 0-.442.173T7 5.116z"/></svg>`;
        box3.querySelector(`span[class="sub-details"]`).innerText = "Heures de sortie idéales";
        box3.querySelector(`h2[class="details"]`).innerText = hdsi;

        document.querySelector(`div[class="cs-dashboard-content"]`).appendChild(elm);
    }

    function executeWhenElementCreated(observer) {
        if (lockexecute === 1) {
            return;
        }
        lockexecute = 1;
        setTimeout(() => { lockexecute = 0; }, 2000);
        boxhtml(-1, -1, -1);
        let d = gettime();
        if (Object.keys(d).includes("error") && Object.keys(d).includes("codeError")) {
            boxhtml(-2, -2, -2);
            return;
        }
        d = data2time(d);
        let timesorted = {};
        Object.keys(d).forEach((key) => timesorted[key] = sortTimes(d[key]));
        let weeks = groupByWeek(Object.keys(d));
        weeks = weeks.map((week) => week.map((key) => timesorted[key]));
        let cw = weeks[weeks.length-1];

        let sbalance = 0;
        let sworkedtoday = 0;
        let sidealout = 0;
        let sweekwork = 0;

        let today = new Date().toISOString().split("T")[0];
        let htoday = getLocalTime();
        let currentweek = findCurrentWeekIndex(Object.keys(d));

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

        boxhtml(sworkedtoday, sbalance, sidealout);
        observer.disconnect();
        lockexecute = 0;
    }

    function initializeObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (document.querySelector('article[code="congeGta"] div.conge-container[class="conge-container"] div[class="conge-color card"] svg g path')) {
                        setTimeout(() => {
                            executeWhenElementCreated(observer);
                        }, 100);
                    }
                }
            }
        });
        observer.observe(targetNode, config);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeObserver);
    } else {
        initializeObserver();
    }
})();
