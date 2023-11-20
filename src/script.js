function generateTable(table) {
    for (let conf of conferences) {
        let row = table.insertRow();
        let cell = row.insertCell();
        cell.innerText = conf["hindex"];
        cell.style = "width:8%;text-align:center;"
        cell = row.insertCell();
        cell.innerHTML = `<strong>${conf["abbrev"]}</strong><strong>:</strong>&nbsp;${conf["title"]}`;
        cell.style = "width:20%;"
        cell = row.insertCell();
        cell.innerHTML = `${conf["location"]} <img style="vertical-align:middle;" src="../pics/${conf["flag"]}.png">`
        cell.style = "width:20%;"
        cell = row.insertCell();
        cell.innerText = conf["cfp"];
        cell.style = "width:16%;"
        cell = row.insertCell();
        cell.innerText = conf["date"];
        cell.style = "width:16%;"
        cell = row.insertCell();
        cell.innerHTML = `<a href="${conf["link"]}">${conf["link"]}</a>`;
        cell.style = "width:20%;"
        // for (key in conf) {
        //     let cell = row.insertCell();
        //     let text = document.createTextNode(conf[key]);
        //     cell.appendChild(text);
        // }
    }
}

function get_H_Index(x){
    var tds = x.querySelectorAll('td')
    td = tds[0]
    if (td.innerText == "H-Index"){
        if (hi_toggle) {
            return -100000;
        }
        return Infinity;
    }

    var delta = 0;
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

var hi_toggle = false;
function makeSortable_by_H_Index() {
    var table=document.getElementsByTagName("table")[0];
    var flag=false;

    var tbody=table.tBodies[0];
    var rows=tbody.getElementsByTagName("tr");
    rows=Array.prototype.slice.call(rows,0);

    rows.sort(function(x,y){
        var tx = get_H_Index(x);
        var ty = get_H_Index(y);
        if (hi_toggle) {
            return tx - ty;
        }
        return ty - tx;

    });
    for(var i=0;i<rows.length;i++){
        tbody.appendChild(rows[i]);
    }
    hi_toggle = !hi_toggle;
}

function get_submission_time(x, is_conf){
    var tds = x.querySelectorAll('td');
    if (is_conf) {
        td = tds[4];
        toggle = sc_toggle
    } else {
        td = tds[3];
        toggle = sd_toggle
    }

    if (td.innerText == "Submission Deadline" ||
        td.innerText == "Conference Date"){
        if (toggle) {
            return Infinity;
        }
        return -1;
    }

    var delta = 36600;
    var tt = td.innerText;
    items = tt.split("-");
    if (items.length > 1) {
        iitems = items[1].split(",");
        if (iitems.length > 1) {
            tt = items[0] + iitems[1];
        }
    }
    try {
        var targetDate = Date.parse(tt)
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

var sd_toggle = false;
function makeSortable_by_SubmissionDeadline() {
    var table=document.getElementsByTagName("table")[0];
    var flag = false;

    var tbody=table.tBodies[0];
    var rows=tbody.getElementsByTagName("tr");
    rows=Array.prototype.slice.call(rows,0);

    rows.sort(function(x,y){
        var tx = get_submission_time(x, false);
        var ty = get_submission_time(y, false);
        if (sd_toggle) {
            return ty - tx;
        }
        return tx - ty;

    });
    for(var i=0;i<rows.length;i++){
        tbody.appendChild(rows[i]);
    }
    sd_toggle = !sd_toggle
}



var sc_toggle = false;
function makeSortable_by_ConferenceDate() {
    var table=document.getElementsByTagName("table")[0];
    var flag=false;

    var tbody=table.tBodies[0];
    var rows=tbody.getElementsByTagName("tr");
    rows=Array.prototype.slice.call(rows,0);

    rows.sort(function(x,y){
        var tx = get_submission_time(x, true);
        var ty = get_submission_time(y, true);
        if (sc_toggle) {
            return ty - tx;
        }
        return tx - ty;
    });
    for(var i=0;i<rows.length;i++){
        tbody.appendChild(rows[i]);
    }
    sc_toggle = !sc_toggle
}

function get_on_click(table){
    // var table=document.getElementsByTagName("table")[0];
    var t_hand=document.getElementsByTagName('tr')[0];
    var tds = t_hand.querySelectorAll('td');
    tds[3].onclick = makeSortable_by_SubmissionDeadline;
    tds[4].onclick = makeSortable_by_ConferenceDate;
    tds[0].onclick = makeSortable_by_H_Index;
}

window.onload=function(){
    console.log(conferences);
    let table = document.querySelector("table");
    generateTable(table);
    get_on_click(table);
    document.querySelectorAll('tr').forEach(function(item) {
        var tds = item.querySelectorAll('td'),
            td = tds[3]
        try {
            var targetDate = Date.parse(td.innerText)
            if (targetDate < Date.now()) {
                td.style.color = 'gray'
                td.style.textDecoration = 'line-through'
            }
            else if (targetDate - Date.now() < 1000*60*60*24*120) {
                td.style.color = 'red'
                td.style.fontWeight = 'bolder'
                var delta = targetDate - Date.now()
                var days = Math.floor(delta/(24*60*60*1000))
                td.innerText = td.innerText + ' (' + days.toString() + ')'
            }
        }
        catch(e){}
    });
    makeSortable_by_SubmissionDeadline();
}
