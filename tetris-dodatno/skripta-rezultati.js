document.addEventListener("DOMContentLoaded", function(){
    let rezultati = [];
    for (let i = 0; i < localStorage.length; i++) {
        let pom = localStorage.key(i);
        if (pom.startsWith("rezultat_")) {
            let procitao = pom.split('_');
            let ime = procitao[1]; 
            let redniBroj = procitao[2]; 
            let rez = parseInt(localStorage.getItem(pom));
            rezultati.push({
                ime: ime,
                redniBroj: parseInt(redniBroj), 
                rez: rez
            });
        }
    }

    
    
    let poslednjiIgrac=rezultati[0];
    for(let i=0; i<rezultati.length; i++){
        if(rezultati[i].redniBroj>poslednjiIgrac.redniBroj){
            poslednjiIgrac=rezultati[i];
        }

    }
    
    if (poslednjiIgrac) {
        document.getElementById("prethodna").textContent = `${poslednjiIgrac.ime}: ${poslednjiIgrac.rez}`;
    }
    rezultati.sort((a, b) => b.rez - a.rez);
    let tabelaNajboljih = document.getElementById("rezultati");
    let granica;
    if(rezultati.length<5){
        granica=rezultati.length;
    }else{
        granica=5;
    }
    

    tmp=0;
    while(tmp<granica){
        let vrsta = document.createElement("tr");
        let kolonaIme = document.createElement("td");
        let kolonaOstvarenRezultat = document.createElement("td");
        kolonaIme.textContent = rezultati[tmp].ime;
        kolonaOstvarenRezultat.textContent = rezultati[tmp].rez;
        vrsta.appendChild(kolonaIme);
        vrsta.appendChild(kolonaOstvarenRezultat);
        tabelaNajboljih.appendChild(vrsta);
        tmp++;
    }
    
});

$(document).ready(function(){
    $("#pocetak").click(function(){
        window.location.href = "tetris-uputstvo.html";
    });
});

