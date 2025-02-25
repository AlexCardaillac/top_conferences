function generateConfTable(table) {
    let tbody = table.tBodies[0];
    for (let conf of conferences) {
        let row = tbody.insertRow();
        for (let cat of conf["categories"]) {
            row.classList.add(cat.replace(/\s/g, ''));
        }
        let cell = row.insertCell();
        cell.innerText = conf["hindex"];
        cell.scope="row"
        cell = row.insertCell();
        cell.innerHTML = `<strong>${conf["abbrev"]}</strong><strong>:</strong>&nbsp;<span class="removable-sm">${conf["title"]}</span><a class="removable-l" href="${conf["link"]}">${conf["title"]}</a>`;
        cell = row.insertCell();
        cell.classList.add("removable-xs");
        cell.innerHTML = `${conf["location"]} <img style="vertical-align:middle;" src="pics/${conf["flag"]}.png">`
        cell = row.insertCell();
        cell.innerText = conf["cfp"];
        cell = row.insertCell();
        cell.innerText = conf["date"];
        cell = row.insertCell();
        cell.classList.add("removable-sm");
        cell.innerHTML = `<a href="${conf["link"]}">${conf["link"]}</a>`;
    }
}

function generateJourTable(table) {
    let tbody = table.tBodies[0];
    for (let conf of journals) {
        let row = tbody.insertRow();
        for (let cat of conf["categories"]) {
            row.classList.add(cat.replace(/\s/g, ''));
        }
        let cell = row.insertCell();
        cell.innerText = conf["hindex"];
        cell.scope="row"
        cell = row.insertCell();
        cell.innerText = conf["iscore"];
        cell = row.insertCell();
        cell.innerText = conf["title"];
        cell.innerHTML = `<span class="removable-sm">${conf["title"]}</span><a class="removable-l" href="${conf["link"]}">${conf["title"]}</a>`;
        cell = row.insertCell();
        cell.innerText = conf["publisher"];
        cell = row.insertCell();
        cell.classList.add("removable-sm");
        cell.innerHTML = `<a href="${conf["link"]}">${conf["link"]}</a>`;
    }
}

function getScore(x, is_hindex){
    if (is_hindex) {
        var td = x.querySelectorAll('td')[0]
    } else {
        var td = x.querySelectorAll('td')[1]
    }

    let delta = 0;

    try {
        delta = parseInt(td.innerText);
    }
    catch(e){
            return 0;
    }
    if (isNaN(delta)){
        return 0;
    }
    return delta;
}

let hi_toggle = false;
let is_toggle = false;
function sortScore(is_hindex) {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.tBodies[0];
    let rows = tbody.getElementsByTagName("tr");
    rows = Array.prototype.slice.call(rows,0);

    let toggle = is_toggle;
    if (is_hindex) {
        toggle = hi_toggle;
    }

    rows.sort(function(x,y){
        let tx = getScore(x, is_hindex);
        let ty = getScore(y, is_hindex);
        if (toggle) {
            return tx - ty;
        }
        return ty - tx;

    });
    for(let i = 0; i < rows.length; i++){
        tbody.appendChild(rows[i]);
    }
    if (is_hindex) {
        hi_toggle = !hi_toggle;
    } else {
        is_toggle = !is_toggle;
    }
}

function getTime(x, is_conf){
    let tds = x.querySelectorAll('td');
    if (is_conf) {
        td = tds[4];
        toggle = sc_toggle
    } else {
        td = tds[3];
        toggle = sd_toggle
    }

    let delta = 36600;
    let tt = td.innerText;
    items = tt.split("-");
    if (items.length > 1) {
        iitems = items[1].split(",");
        if (iitems.length > 1) {
            tt = items[0] + iitems[1];
        }
    }
    try {
        let targetDate = Date.parse(tt)
        if (targetDate < Date.now()) {
            if (toggle) {
                delta = -1;
            }
            else {
                delta = Infinity;
            }
        }
        else {
            delta = targetDate - Date.now()
            delta = Math.floor(delta/(24*60*60*1000))
        }
    }
    catch(e){}

    if (isNaN(delta)){
        delta = 36600;
    }

    return delta;
}

let sd_toggle = false;
let sc_toggle = false;
function sortTime(is_conf) {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.tBodies[0];
    let rows = tbody.getElementsByTagName("tr");
    rows = Array.prototype.slice.call(rows, 0);

    let toggle = sd_toggle
    if (is_conf) {
        toggle = sc_toggle
    }

    rows.sort(function(x,y){
        let tx = getTime(x, is_conf);
        let ty = getTime(y, is_conf);
        if (toggle) {
            return ty - tx;
        }
        return tx - ty;

    });
    for(let i=0;i<rows.length;i++){
        tbody.appendChild(rows[i]);
    }
    if (is_conf) {
        sc_toggle = !sc_toggle
    } else {
        sd_toggle = !sd_toggle
    }
}

let n_toggle = false;
function sortName() {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.tBodies[0];
    let rows = tbody.getElementsByTagName("tr");
    rows = Array.prototype.slice.call(rows, 0);

    rows.sort(function(x,y){
        const nx = x.querySelectorAll('td')[1].innerText.toUpperCase();
        const ny = y.querySelectorAll('td')[1].innerText.toUpperCase();
        toggle = n_toggle ? -1 : 1;
        if (nx < ny) {
            return -1 * toggle;
        }
        else if (nx > ny) {
            return 1 * toggle;
        }
        return 0;

    });
    for(let i=0;i<rows.length;i++){
        tbody.appendChild(rows[i]);
    }
    n_toggle = !n_toggle
}

function onClick(table){
    let tds = table.tHead.querySelectorAll('th');
    tds[0].onclick = () => sortScore(true);
    if (is_conf_page) {
        tds[1].onclick = () => sortName();
        tds[3].onclick = () => sortTime(false);
        tds[4].onclick = () => sortTime(true);
    } else {
        tds[1].onclick = () => sortScore(false);
    }
}

function updateDate(td, targetDate) {
    if (targetDate < Date.now()) {
        td.style.color = 'gray'
        td.style.textDecoration = 'line-through'
    }
    else if (targetDate - Date.now() < 1000*60*60*24*60) {
        td.style.color = 'red'
        td.style.fontWeight = 'bolder'
        let delta = targetDate - Date.now()
        let days = Math.floor(delta/(24*60*60*1000))
        td.innerText = td.innerText + ' (' + days.toString() + ')'
    }
}

function verifyDates() {
    document.querySelectorAll('tr').forEach(function(item) {
        let tds = item.querySelectorAll('td'),
            td_deadline = tds[3],
            td_conf_date = tds[4]
        try {
            let targetDate = Date.parse(td_deadline.innerText)
            updateDate(td_deadline, targetDate)
            let tt = td_conf_date.innerText
            let items = tt.split("-");
            if (items.length > 1) {
                let iitems = items[1].split(",");
                if (iitems.length > 1) {
                    tt = items[0] + iitems[1];
                }
            }
            targetDate = Date.parse(tt)
            updateDate(td_conf_date, targetDate)
        }
        catch(e){}
    });
}

function reSortTable() {
    document.querySelectorAll('tr').forEach(function(item) {
        if (!item.querySelectorAll('td').length) return;

        item.style.display = "none";
        // check category
        if (category_opt == "All" || item.classList.contains(category_opt)){
            item.style.display = "table-row";
        }
        else return;

        // check options
        let td_deadline = item.querySelectorAll('td')[3];
        try {
            let opt1 = !display_past && Date.parse(td_deadline.innerText) < Date.now();
            let opt2 = !display_hindex && !(parseInt(item.querySelectorAll('td')[0].innerText) > 0);
            if (opt1 || opt2) {
                item.style.display = "none";
                return;
            }
        }
        catch(e){}
    });
}

let display_past = true;
let display_hindex = true;
let category_opt = "All";

function toggleWithIndex() {
    display_hindex = !display_hindex;
    reSortTable();
}

function togglePastDeadlines() {
    display_past = !display_past;
    reSortTable();
}

function selectCategory(opt) {
    category_opt = opt.value;
    reSortTable();
}

var is_conf_page = true;
window.onload=function(){
    if (document.URL.includes("journals")) {
        is_conf_page = false;
    }
    let table = document.querySelector("table");
    if (is_conf_page) {
        generateConfTable(table);
        verifyDates();
        sortTime(false);
    } else {
        generateJourTable(table);
        sortScore(true);
    }
    onClick(table);
}
