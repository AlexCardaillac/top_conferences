function generateTable() {
    let table = document.querySelector("table");
    for (let conf of conferences) {
        let row = table.insertRow();
        let cell = row.insertCell();
        cell.innerText = conf["hindex"];
        cell = row.insertCell();
        cell.innerText = conf["title"] + ", " + conf["abbrev"];
        cell = row.insertCell();
        cell.innerText = conf["location"];
        cell = row.insertCell();
        cell.innerText = conf["cfp"];
        cell = row.insertCell();
        cell.innerText = conf["date"];
        cell = row.insertCell();
        cell.innerText = conf["link"];
        // for (key in conf) {
        //     let cell = row.insertCell();
        //     let text = document.createTextNode(conf[key]);
        //     cell.appendChild(text);
        // }
    }
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
