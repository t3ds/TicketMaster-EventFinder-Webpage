//var geohash = require('./latlon-geohash.js')
//AIzaSyAdQQYtLvPtkV1e7rSfBYNfLBY11OtAonE
const searchform = document.getElementById('esearch');
const butclick = document.getElementById('searchbut');
const detectLoc = document.getElementById('autod');
const kwField = document.getElementById("keyword");
//var flaskURL = 'http://127.0.0.1:5000'
function clearAll(){
    searchform.elements['keyword'].value = ''
    searchform.elements['dist'].value = ''
    searchform.elements['category'].selectedIndex = "0"
    searchform.elements['location'].value = ''
    detectLoc.checked = false

    const searchtable = document.getElementById('events')
    searchtable.innerHTML = ""
    document.getElementById("details").innerHTML = ""
    document.getElementById("details").classList.remove("eventform")
    document.getElementById("venue").innerHTML = ""
    document.getElementById("venue").classList.remove("venue")

    if (document.contains(document.getElementsByClassName("venuedetailbtn")[0])){
        document.getElementsByClassName("venuedetailbtn")[0].remove()
    }

    searchform.elements['location'].setAttribute('type', 'text')



}

//CREDIT TO: https://codepen.io/andrese52/pen/ZJENqp
//link allowed by professor in piazza post: https://piazza.com/class/lccnfyaky8yrr/post/195_f1
function sortTable(n) {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("events");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName("TR");
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) { //Change i=0 if you have the header th a separate table.
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/

        if (n == 2){
            x = rows[i].getElementsByTagName("TD")[n].getElementsByTagName('a')[0];
            y = rows[i + 1].getElementsByTagName("TD")[n].getElementsByTagName('a')[0];
        }

        else{

            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
        }
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  
function getVenueDetails(venue){

    
    if (document.contains(document.getElementsByClassName("venuedetailbtn")[0])){
        document.getElementsByClassName("venuedetailbtn")[0].remove()
    }

    document.getElementById("venue").innerHTML = ""
    document.getElementById("venue").classList.remove("venue")


    res = new XMLHttpRequest();
    res.open("GET", `/venueinfo?id=${venue}`,false);
    res.send();
    data = JSON.parse(res.responseText)
    console.log(data)

    if (data.hasOwnProperty('_embedded')){

    
        var venueCard = document.getElementById('venue')
        venueCard.classList.add("venue")

        //add border case for if none of values present

        if (data._embedded.hasOwnProperty('venues') && data._embedded.venues["0"].hasOwnProperty('name')){
            let title = document.createElement('div')
            title.innerHTML = `<span>${data._embedded.venues["0"].name}</span>`

            title.classList.add("venueTitle")

            venueCard.appendChild(title)
        }

        if (data._embedded.hasOwnProperty('venues') && data._embedded.venues["0"].hasOwnProperty("images") && data._embedded.venues["0"].images["0"].hasOwnProperty("url")){
            let venueIcon = document.createElement('div')
            venueIcon.innerHTML = `<img src="${data._embedded.venues["0"].images["0"].url}">`

            venueIcon.classList.add("venueIcon")

            venueCard.appendChild(venueIcon)
        }


        leftHalfVenue = document.createElement('div')
        leftHalfVenue.classList.add('lefthalfvenue')
        venueCard.appendChild(leftHalfVenue)

        if (data._embedded.hasOwnProperty('venues') && (data._embedded.venues['0'].hasOwnProperty('address') || data._embedded.venues['0'].hasOwnProperty('city') || data._embedded.venues['0'].hasOwnProperty('postalCode') || data._embedded.venues['0'].hasOwnProperty('state'))){

            let address = document.createElement('div')
            address.classList.add('address')

            let details = `<p id = "adrTitle">Address: </p><p>`


            if (data._embedded.venues['0'].hasOwnProperty('address')){
                details += `<span>${data._embedded.venues['0'].address.line1}</span><br>`
            }

            if (data._embedded.venues['0'].hasOwnProperty('city') && data._embedded.venues['0'].hasOwnProperty('state')){
                details += `<span>${data._embedded.venues['0'].city.name}, ${data._embedded.venues['0'].state.stateCode}</span><br>`
            }

            else if (data._embedded.venues['0'].hasOwnProperty('city')){
                details += `<span>${data._embedded.venues['0'].city.name}</span><br>`
            }

            else if (data._embedded.venues['0'].hasOwnProperty('state')){
                details += `<span>${data._embedded.venues['0'].state.stateCode}</span><br>`
            }


            if (data._embedded.venues['0'].hasOwnProperty('postalCode')){
                details += `<span>${data._embedded.venues['0'].postalCode}</span>`
            }

            details += "</p>"

            address.innerHTML = details

            leftHalfVenue.appendChild(address)
        }

        else {
            leftHalfVenue.innerHTML = `<p>Address: N/A</p>`
        }

        mapLink = document.createElement('a')

        mapLink.innerHTML = "Open in Google Maps"
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${data._embedded.venues["0"].name.replaceAll(' ', '+')}`

        leftHalfVenue.appendChild(mapLink)

        rightHalfVenue = document.createElement('div')
        rightHalfVenue.classList.add('righthalfvenue')
        venueCard.appendChild(rightHalfVenue)

        if (data._embedded.venues['0'].hasOwnProperty('url')){
            rightHalfVenue.innerHTML = `<a href = "${data._embedded.venues['0'].url}" target = "_blank">More events at this venue</a>`
        }

        else{
            rightHalfVenue.innerHTML = `<p>N/A</p>`
        }

        venueCard.scrollIntoView({behavior:"smooth"})
}

}

function displayEventDetails(data){

    //change individual divs into a nested div

    const eventDetails = document.getElementById("details")
    eventDetails.innerHTML = ""

    if (document.contains(document.getElementsByClassName("venuedetailbtn")[0])){
        document.getElementsByClassName("venuedetailbtn")[0].remove()
    }

    document.getElementById("venue").innerHTML = ""
    document.getElementById("venue").classList.remove("venue")

    eventDetails.classList.add('eventform')

    let title = document.createElement('div')
    title.innerText = data.name

    title.classList.add("eventTitle")

    eventDetails.appendChild(title)

    leftHalf = document.createElement('div')
    leftHalf.classList.add("lefthalf")
    eventDetails.appendChild(leftHalf)

    /*let eventInfo = document.createElement('div')
    eventInfo.classList.add("ename")
    eventDetails.appendChild(eventInfo)*/

    let edates = document.createElement('div')
    edates.classList.add("ecard")

    edates.innerHTML = `<p class = "eheading">Date</p><span>${data.dates.start.hasOwnProperty("localDate")? data.dates.start.localDate: ''} ${data.dates.start.hasOwnProperty("localTime")? data.dates.start.localTime: ''}</span>`
    leftHalf.appendChild(edates)

    if (data._embedded.hasOwnProperty("attractions")){

        let eartists = document.createElement('div')
        eartists.classList.add("ecard")

        let artistInfo = `<p class = "eheading">Artist/Team</p>`
        const artists = [];

        for (let artist in data._embedded.attractions){

            if (data._embedded.attractions[artist].hasOwnProperty('url')){

                artists.push(`<a href="${data._embedded.attractions[artist].url}", target = "_blank">${data._embedded.attractions[artist].name}</a>`)

            }

            else{
                artists.push(`${data._embedded.attractions[artist].name}`)
            }

        }

        artistInfo += `<span>${artists.join(" | ")}</span>`

        eartists.innerHTML = artistInfo

        leftHalf.appendChild(eartists)
    }


    if(data._embedded.hasOwnProperty('venues')){
        let evenue = document.createElement('div')
        evenue.classList.add("ecard")
        evenue.innerHTML = `<p class = "eheading">Venue</p><span>${data._embedded.venues["0"].name}</span>`
        leftHalf.appendChild(evenue)
    }
    

    if (data.hasOwnProperty("classifications") && data.classifications.hasOwnProperty("0")){
        let egenre = document.createElement('div')
        egenre.classList.add("ecard")

        let genreInfo = `<p class = "eheading">Genre</p>`
        const genres = [];

        if (data.classifications["0"].hasOwnProperty("segment") && data.classifications["0"].segment.name != "Undefined"){
            genres.push(data.classifications["0"].segment.name)
        }

        
        if (data.classifications["0"].hasOwnProperty("genre") && data.classifications["0"].genre.name != "Undefined"){
            genres.push(data.classifications["0"].genre.name)
        }

        if (data.classifications["0"].hasOwnProperty("subGenre") && data.classifications["0"].subGenre.name != "Undefined"){
            genres.push(data.classifications["0"].subGenre.name)
        }

        if (data.classifications["0"].hasOwnProperty("type") && data.classifications["0"].type.name != "Undefined"){
            genres.push(data.classifications["0"].type.name)
        }

        if (data.classifications["0"].hasOwnProperty("subType") && data.classifications["0"].subType.name != "Undefined"){
            genres.push(data.classifications["0"].subType.name)
        }

        genreInfo += `<span>${genres.join(' | ')}</span>`

        egenre.innerHTML = genreInfo

        leftHalf.appendChild(egenre)

    }

    if (data.hasOwnProperty('priceRanges')){
        let ranges = document.createElement('div')
        ranges.classList.add("ecard")

        ranges.innerHTML = `<p class = "eheading">Price Ranges</p><span>${data.priceRanges["0"].min} - ${data.priceRanges["0"].max} ${data.priceRanges["0"].currency}</span>`
        leftHalf.appendChild(ranges)
    }

    if (data.dates.hasOwnProperty("status")){
        let saleStatus = document.createElement('div')
        saleStatus.classList.add("ecard")

        statusHTML = `<p class = "eheading">Ticket Status</p>`

        if (data.dates.status.code = "onsale"){
            statusHTML += `<div style = "background-color: green">On Sale</div>`
        }

        else if (data.dates.status.code = "offsale") {
            statusHTML += `<div style = "background-color: red">Off Sale</div>`

        }

        else if (data.dates.status.code = "canceled") {
            statusHTML += `<div style = "background-color: black">Canceled</div>`

        }

        else{
            statusHTML += `<div style = "background-color: orange">${data.dates.status.code.charAt(0).toUpperCase() + data.dates.status.code.slice(1) }</div>`
        }

        saleStatus.innerHTML = statusHTML
        leftHalf.appendChild(saleStatus)
    }

    if (data.hasOwnProperty("url")){
        let buytics = document.createElement('div')
        buytics.classList.add("ecard")

        buytics.innerHTML = `<p class = "eheading">Buy Tickets At:</p><span><a href = "${data.url}" target = "_blank">Ticketmaster</a></span>`

        leftHalf.appendChild(buytics)
    }

    rightHalf = document.createElement('div')
    rightHalf.classList.add("righthalf")
    eventDetails.appendChild(rightHalf)



    if (data.hasOwnProperty("seatmap") && data.seatmap.hasOwnProperty("staticUrl")){
        rightHalf.innerHTML = `<img src = ${data.seatmap.staticUrl} alt="">`
    }

    let showDetails = document.createElement('div')
    showDetails.classList.add("venuedetailbtn")

    let arrow = document.createElement('div')
    arrow.classList.add("arrow")
    arrow.setAttribute('onclick', `getVenueDetails("${data._embedded.venues["0"].name}");`)
    console.log(data._embedded.venues["0"].name)
    //showDetails.innerHTML = `<span>Show Venue Details</span><br><div class = "arrow" onclick= "getVenueDetails("${data._embedded.venues["0"].name}")"></div>`
    showDetails.innerHTML = `<span>Show Venue Details</span><br>`
    showDetails.appendChild(arrow)
    //showDetails.setAttribute('onclick', `getVenueDetails("${data._embedded.venues["0"].name}");`)
    eventDetails.parentNode.insertBefore(showDetails, eventDetails.nextSibling);

    eventDetails.scrollIntoView({behavior:"smooth"})


}
function getEventDetails(id){

    var res = new XMLHttpRequest();
    res.open("GET",  `/eventinfo?id=${id}`, false);
    //res.open("GET", `https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=JkmJpKYdrPK2RAbotuKq3aXe3zEQxcUn`, false);
    res.send();

    data = JSON.parse(res.responseText)
    console.log(data)

    displayEventDetails(data)


}
function fetchIpinfo (){

    var res = new XMLHttpRequest();
    res.open("GET", "https://ipinfo.io?token=YOUR_TOKEN", false);
    res.send();

    data = JSON.parse(res.responseText)
    console.log(data)

    return data['loc']
    
}

function displayTable(data){

    const searchtable = document.getElementById('events')
    searchtable.innerHTML = ""
    document.getElementById("details").innerHTML = ""
    document.getElementById("details").classList.remove("eventform")
    document.getElementById("venue").innerHTML = ""
    document.getElementById("venue").classList.remove("venue")

    if (document.contains(document.getElementsByClassName("venuedetailbtn")[0])){
        document.getElementsByClassName("venuedetailbtn")[0].remove()
    }

    console.log(data)
    if (data.page.totalElements == 0){
        searchtable.innerHTML = `<p class = 'norecords'>No Records Found</p>`
    }

    else{



        //console.log(data._embedded)

        

        let row = document.createElement('tr')

        const rowdata =  `<th style = "width:15%;">Date</th>\
            <th style = "width:15%;">Icon</th>\
            <th onclick=sortTable(2) style = "cursor: pointer;"><a>Event</a></th>\
            <th  onclick= sortTable(3) style = "cursor: pointer;"><a>Genre</a></th>\
            <th a onclick= sortTable(4) style = "width:20%;cursor: pointer;"><a>Venue</a></th>`;

        row.innerHTML = rowdata

        searchtable.appendChild(row)


        /*for (let i = 0; i < data._embedded.events.length; i++){

            let obj = data._embedded.events[i];
            console.log(obj)
        }*/

        for (let e in data._embedded.events){

            if (!(data._embedded.events[e].hasOwnProperty('name') || (data._embedded.events[e].hasOwnProperty('segment') || data._embedded.events[e].segment.hasOwnProperty('name'))||
            (data._embedded.events[e].hasOwnProperty('venues') || data._embedded.events[e].venues["0"].hasOwnProperty('name')))){
                continue;
            }

            row = document.createElement('tr')
            //${data.dates.start.hasOwnProperty("localTime")? data.dates.start.localTime: ''}
            const rowdata = `<tr>\
                <td>${data._embedded.events[e].dates.start.hasOwnProperty("localDate")?`${data._embedded.events[e].dates.start.localDate}<br>` : ''}\
                ${data._embedded.events[e].dates.start.hasOwnProperty("localTime")?data._embedded.events[e].dates.start.localTime : ''}</td>\
                <td><img src='${data._embedded.events[e]['images']['0']['url']}'></td>\
                <td><a onclick = "getEventDetails('${data._embedded.events[e].id}')" target = '_blank'>${data._embedded.events[e].name}</a></td>\
                <td>${data._embedded.events[e].classifications[0].segment.name}</td>\
                <td>${data._embedded.events[e]._embedded.venues[0].name}</td>\
            </tr>`

            row.innerHTML = rowdata
            searchtable.appendChild(row)



            console.log(data._embedded.events[e])
        }
}
}

function fetchGoogleMaps(addr){

    var res = new XMLHttpRequest();
    res.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=YOUR_API_KEY`, false);
    res.send();

    data = JSON.parse(res.responseText)
    if (data['results'].length == 0){
        return "error";
    }
    console.log(data)

    return data['results']['0']['geometry']['location'].lat + ',' + data['results']['0']['geometry']['location'].lng

}

detectLoc.addEventListener('change', () => {
    //console.log(detectLoc.checked)
    if (detectLoc.checked){
        //console.log("aaa")
        //document.getElementById("location").remove();
        searchform.elements['location'].setAttribute('type', 'hidden')
    }

    else {

        searchform.elements['location'].setAttribute('type', 'text')

    }
});

searchform.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if(searchform.elements['keyword'].checkValidity() === false){


        kwField.setCustomValidity("Please Fill Out This Field.");

    }
    else {
        kw = searchform.elements['keyword'].value
    }

    if(searchform.elements['location'].checkValidity() === false){


        kwField.setCustomValidity("Please Fill Out This Field.");

    }

    else {
        if (detectLoc.checked){

            latlon = fetchIpinfo();
        }

        else {
            latlon = fetchGoogleMaps(searchform.elements['location'].value);
            if (latlon == "error"){
                document.getElementById('events').innerHTML = `<p class = 'norecords'>No Records Found</p>`
                return
            }

            
            console.log(latlon);
        }
    }

    let unit = 'miles'
    if (searchform.elements['dist'].value === ''){
        dist = 10;
    }
    else{
        dist = searchform.elements['dist'].value;
    }

    const category = searchform.elements['category'].value;


    res = new XMLHttpRequest();
    res.open("GET", `/tmdetails?keyword=${kw}&distance=${dist}&category=${category}&point=${latlon}`,false);
    res.send();
    console.log(res)
    data = res.responseText
    // console.log(JSON.parse(data))

    displayTable(JSON.parse(data));
    
    //console.log(searchform.elements['autod'].value);
});



function searchClick(values){
    stuff = values.closest('form')

    
    console.log(stuff.elements['dist'].value === '');
    
}


