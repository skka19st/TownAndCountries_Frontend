// Javascript-dokument 

// läs in landfil 
LandfilIn();

// ny inläsning av landfilen
function InitLand(){
    LandfilIn();
}
// info om valt land skickas via onClick
function InitStad(landid, landnamn){
    StadfilIn(landid, landnamn);
}
// info om vald stad skickas via onClick
function InitDetalj(stadid, stadnamn, antal, landnamn){
    ByggDetaljSida(stadid, stadnamn, antal, landnamn);
}

// staden markeras som besökt
function InitMarkera(stadid){
    // läs in de ev stadid som redan är lagrade
    var stadlista = LasLocalStorage();

    // kontrollera om staden redan är markerad som besökt
    var stadSaknas = KontrolleraStad(stadlista, stadid);
   
    //stadens idnr sparas i local Storage
    if (stadSaknas) {
        stadlista.push(stadid);            // stadid läggs sist i listan
        stadlista.sort(function (x, y) {   // array sorteras
            return x - y;                  // stigande sortering
            //return y - x;                // fallande sortering  
        }); 
        stadstring = stadlista.toString(); // omvandla array till string
        localStorage.setItem("stad", stadstring);   
    }
}

function KontrolleraStad(stadlista, stadid) {    
    for (stadInd = 0 ; stadInd < stadlista.length ; stadInd++) {
        var num1 = Number(stadlista[stadInd]);
        var num2 = Number(stadid);
        //if (stadlista[stadInd] === stadid) {
        if (num1 === num2) {        
            return false;
        }
    } 
    // angiven stad fanns inte tidigare i localStorage
    return true;  
}

function LasLocalStorage(){
    stadlista = new Array;
    var stadstring = localStorage.getItem("stad"); 
    if (stadstring === null) {
        return stadlista;          
    }

    // omvandla string från localeStorage till array
    stadlista = stadstring.split(",");  
    return stadlista;   
}

function ByggLandSida(landfil) {
    // rensa skärmen från ev gammalt data
    document.getElementById("landrad").innerHTML = "";

    // endast land-delen ska synas
    // 'none' = även containerns plats försvinner
    document.getElementById("stadcontainer").style.display = "none";  
    document.getElementById("detaljcontainer").style.display = "none";

    // en rad per land skapas
    for (landInd = 0 ; landInd < landfil.length ; landInd++) {
        var kodtext = "";        
        var namn = landfil[landInd].countryname;
        var id = landfil[landInd].id;

        // land till detaljraden
        kodtext += '<div id="landnamn">' + namn + '</div>';
        kodtext += '<div id="landid" class="dolda">' + id + '</div>';

        // button med land-info lagrat i 'OnClick'
        var param = id + ", '" + namn + "'";
        var onClickText = 'OnClick="InitStad(' + param + ')"';
        kodtext += "<button id='btnland' " + onClickText + ">Visa städer";
        kodtext += "</button>";

        // lägg till den skapade listraden 
        var listradtext = document.getElementById("landrad");
        listradtext.insertAdjacentHTML("beforeend", kodtext);
    }     
}

function ByggStadSida(stadfil, landid, landnamn) {
    // rensa skärmen från ev gammalt data
    document.getElementById("stadrad").innerHTML = "";
    document.getElementById("valStad").innerHTML = "";

    // visa städer på skärmen
    // 'initial' = standardvärde (synlig)
    // 'none' = även containerns plats försvinner
    document.getElementById("stadcontainer").style.display = "initial";
    document.getElementById("detaljcontainer").style.display = "none";

    // ta enbart med de städer som hör till aktuellt land
    for (stadInd = 0 ; stadInd < stadfil.length ; stadInd++) {
        var kodtext = "";

        // en rad per stad skapas
        if (stadfil[stadInd].countryid === landid) {            
            var namn = stadfil[stadInd].stadname;
            var id = stadfil[stadInd].id;
            var antal = stadfil[stadInd].population;

            // stad till detaljraden
            kodtext += '<div id="namn">' + namn + '</div>';
            kodtext += '<div id="stadid" class="dolda">' + id + '</div>';
            kodtext += '<div id="antal" class="dolda">' + antal + '</div>';

            // button med stad-id, namn, population o land lagrat i 'OnClick'
            var param = id+", '"+namn+"', "+antal+", '"+landnamn+"'";
            var onClickText = 'OnClick="InitDetalj('+ param + ')"' ;
            kodtext += "<button id='btnstad' "+ onClickText + ">Mer info";
            kodtext += "</button>";

            // lägg till den skapade listraden 
            var listradtext = document.getElementById("stadrad");
            listradtext.insertAdjacentHTML("beforeend", kodtext)     
        }
    }
    // tillbaka till landlistan (button)
    var kodtext = "";
    kodtext += '<button id="btnvalTillb" onClick="InitLand()">Tillbaka</button>';

    // lägg till den skapade valraden 
    var listradtext = document.getElementById("valStad");
    listradtext.insertAdjacentHTML("beforeend", kodtext) 
}

function ByggDetaljSida(id, namn, antal, landnamn) {
    // rensa skärmen från ev gammalt data
    document.getElementById("detaljrad").innerHTML = "";
    document.getElementById("valDetalj").innerHTML = "";

    // visa detaljer om vald stad på skärmen
    // 'initial' = standardvärde (synlig)
    document.getElementById("detaljcontainer").style.display = "initial";

    // stadens info till skärmen
    var kodtext = "";
    kodtext += '<div id="stadnamn">' + namn + '</div>';
    var detaljtext = "";
    detaljtext += " ligger i " + landnamn + " och beräknas ha ";
    detaljtext += antal + " innevånare"; 
    kodtext += '<div id="detaljtext">' + detaljtext + '</div>';

    //button med stadens id lagrat i 'OnClick'
    var onClickText = 'OnClick="InitMarkera('+ id + ')"' ;
    kodtext += "<button id='btnMarkera' "+ onClickText + ">Markera som besökt";
    kodtext += "</button>";

    // lägg till den skapade listraden 
    var listradtext = document.getElementById("detaljrad");
    listradtext.insertAdjacentHTML("beforeend", kodtext); 

    // tillbaka (button)
    var kodtext = "";
    var ledtext = "Tillbaka till förstasidan";
    kodtext += '<button id="btnvalFirst" onClick="InitLand()">';
    kodtext += ledtext + '</button>';

    // lägg till den skapade valraden 
    var listradtext = document.getElementById("valDetalj");
    listradtext.insertAdjacentHTML("beforeend", kodtext) 
}

// inläsning av landfilen
function LandfilIn() {
    fetch ("land.json")

    // '.then' är ett promise som gör att JavaScript väntar tills 
    // förra anropet är klart
    // return skickar resultatet vidare till nästa '.then' 
    .then (function(landfil) {     // 'landfil' är respons från fetch    
     return landfil.json();        // returnerar svaret (texten) som json-fil              
    })

    // 'landfil' innehåller resultatet av föregående '.then'
    // function utan namn (triggas av en händelse, anropas aldrig utifrån)
    .then(function(landfil) {   // här kommer inläst data in som json-fil
        ByggLandSida(landfil);  
    })

    // '.catch' hanterar fel
    .catch(function(landdata) {
    console.log("fel vid inläsning av land");
    });
}

// inläsning av stad-filen
function StadfilIn(landid, landnamn){
    fetch ("stad.json")

    // '.then' är ett promise som gör att JavaScript väntar tills 
    // förra anropet är klart
    .then (function(stadfil) { 
        // return skickar resultatet vidare till nästa '.then'         
        return stadfil.json();                 
    })

    // 'stadfil' innehåller resultatet av föregående '.then'
    // function utan namn (triggas av en händelse, anropas aldrig utifrån)
    .then (function(stadfil) {  
        ByggStadSida(stadfil, landid, landnamn);                       
    })
    
    // '.catch' hanterar fel
    .catch(function(staderror) {
        console.log("fel vid inläsning av stad");
    });
}
