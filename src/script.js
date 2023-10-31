function generateTable() {
    let table = document.querySelector("table");
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

function get_on_click(){
    var table=document.getElementsByTagName("table")[0];
    var t_hand=document.getElementsByTagName('tr')[0];
    var tds = t_hand.querySelectorAll('td');
    tds[3].onclick = makeSortable_by_SubmissionDeadline;
    tds[4].onclick = makeSortable_by_ConferenceDate;
    tds[0].onclick = makeSortable_by_H_Index;
}

window.onload=function(){
    console.log(conferences);
    generateTable();
    // var table=document.getElementsByTagName("table")[0];
    // get_on_click();
    // document.querySelectorAll('tr').forEach(function(item) {
    //     var tds = item.querySelectorAll('td'),
    //         td = tds[3]
    //     try {
    //         var targetDate = Date.parse(td.innerText)
    //         if (targetDate < Date.now()) {
    //             td.style.color = 'gray'
    //             td.style.textDecoration = 'line-through'
    //         }
    //         else if (targetDate - Date.now() < 1000*60*60*24*120) {
    //             td.style.color = 'red'
    //             td.style.fontWeight = 'bolder'
    //             var delta = targetDate - Date.now()
    //             var days = Math.floor(delta/(24*60*60*1000))
    //             td.innerText = td.innerText + ' (' + days.toString() + ')'
    //         }
    //     }
    //     catch(e){}
    // });
}
