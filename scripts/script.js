function generateConfTable(table) {
    let tbody = table.tBodies[0];
    for (let conf of conferences) {
        let row = tbody.insertRow();
        let cell = row.insertCell();
        cell.innerText = conf["hindex"];
        cell.scope="row"
        cell = row.insertCell();
        cell.innerHTML = `<strong>${conf["abbrev"]}</strong><strong>:</strong>&nbsp;${conf["title"]}`;
        cell = row.insertCell();
        cell.innerHTML = `${conf["location"]} <img style="vertical-align:middle;" src="pics/${conf["flag"]}.png">`
        cell = row.insertCell();
        cell.innerText = conf["cfp"];
        cell = row.insertCell();
        cell.innerText = conf["date"];
        cell = row.insertCell();
        cell.innerHTML = `<a href="${conf["link"]}">${conf["link"]}</a>`;
    }
}

function generateJourTable(table) {
    let tbody = table.tBodies[0];
    for (let conf of journals) {
        let row = tbody.insertRow();
        let cell = row.insertCell();
        cell.innerText = conf["hindex"];
        cell.scope="row"
        cell = row.insertCell();
        cell.innerText = conf["iscore"];
        cell = row.insertCell();
        cell.innerText = conf["title"];
        cell = row.insertCell();
        cell.innerText = conf["publisher"];
        cell = row.insertCell();
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

function onClick(table){
    let tds = table.tHead.querySelectorAll('th');
    tds[0].onclick = () => sortScore(true);
    if (is_conf_page) {
        tds[3].onclick = () => sortTime(false);
        tds[4].onclick = () => sortTime(true);
    } else {
        tds[1].onclick = () => sortScore(false);
    }
}

function verifyDeadlines() {
    document.querySelectorAll('tr').forEach(function(item) {
        let tds = item.querySelectorAll('td'),
            td = tds[3]
        try {
            let targetDate = Date.parse(td.innerText)
            if (targetDate < Date.now()) {
                td.style.color = 'gray'
                td.style.textDecoration = 'line-through'
            }
            else if (targetDate - Date.now() < 1000*60*60*24*120) {
                td.style.color = 'red'
                td.style.fontWeight = 'bolder'
                let delta = targetDate - Date.now()
                let days = Math.floor(delta/(24*60*60*1000))
                td.innerText = td.innerText + ' (' + days.toString() + ')'
            }
        }
        catch(e){}
    });
}

var is_conf_page = true;
window.onload=function(){
    if (document.URL.includes("journals")) {
        is_conf_page = false;
    }
    let table = document.querySelector("table");
    if (is_conf_page) {
        generateConfTable(table);
        verifyDeadlines();
        sortTime(false);
    } else {
        generateJourTable(table);
        sortScore(true);
    }
    onClick(table);
}
