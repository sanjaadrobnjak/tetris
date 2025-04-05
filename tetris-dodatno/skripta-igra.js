let blokovi={
    blok1:[
        [0,0,0,0],
        [1,1,1,1]
    ],
    blok2:[
        [1,1],
        [1,1]
    ],
    blok3:[
        [1,0,0],
        [1,1,1]
    ],
    blok4:[
        [0,0,1],
        [1,1,1]
    ],
    blok5:[
        [0,1,0],
        [1,1,1]
    ],
    blok6:[
        [0,1,1],
        [1,1,0]
    ],
    blok7:[
        [1,1,0],
        [0,1,1]
    ]
}

   
let originalni={
    blok1:[
        [0,0,0,0],
        [1,1,1,1]
    ],
    blok2:[
        [1,1],
        [1,1]
    ],
    blok3:[
        [1,0,0],
        [1,1,1]
    ],
    blok4:[
        [0,0,1],
        [1,1,1]
    ],
    blok5:[
        [0,1,0],
        [1,1,1]
    ],
    blok6:[
        [0,1,1],
        [1,1,0]
    ],
    blok7:[
        [1,1,0],
        [0,1,1]
    ]
}

let matrica=[]; 
let sekvenca=[]; 
let brTrenutnogBloka;

let tmp=0;    
let handler;

const vrste=10;
const kolone=10;

let iKoord;   
let jKoord;   
let jKoordD; 


let nizBlokica=[];  
let slBlokMatr=[];

let rezultat=0;
let prethodniRez=0;
let brzina; 
let rotiran=false;



$(document).ready(function(){

    let redniBroj=parseInt(localStorage.getItem("redniBroj"));
    if(isNaN(redniBroj)){
        redniBroj=0;
    }

    inicijalizujPocetakIgre();

    function kreni(brBloka){
        if(handler){
            clearInterval(handler);
        }
        if(pocetakZauzet()){
            alert("Igra je gotova izgubili ste!");
            let ime=prompt("Unesite svoje ime: ");
            if(ime){
                
                localStorage.setItem(`rezultat_${ime}_${redniBroj}`, rezultat); 
                redniBroj++;
                localStorage.setItem("redniBroj", redniBroj)
                window.location.href="tetris-rezultati.html";
            }
            return;
        }
        if(prethodniRez!=rezultat){
            brzina-=100;
            if(brzina<=500) brzina=500;
        }
        postaviBlokInicijalno(brBloka);
        handler=setInterval(f,brzina);
    }

    function inicijalizujPocetakIgre(){
        document.getElementById("rezultat").innerHTML=0;
        
        let nivo = localStorage.getItem("tezinaNivoa");
        let tezina = "Greska";
        if(nivo == "1") {
            tezina = "Lako";
            brzina = 2000;
        }
        else if(nivo == "2"){
            tezina = "Srednje";
            brzina = 1000;
        } 
        else if(nivo == "3") {
            tezina = "Teško";
            brzina=700;
        }

        document.getElementById("nivoIgre").innerHTML= tezina;
        for(let i=0; i<vrste; i++){
            matrica[i]=[];
            for(let j=0; j<kolone; j++){
                matrica[i][j]=0;    
            }
        }

        for(let i=0; i<2; i++){
            slBlokMatr[i]=[];
            for(let j=0; j<4; j++){
                slBlokMatr[i][j]=0;
            }
        }

        let blokici=localStorage.getItem("cekiraniBlokovi");
        let izabraniBlokoviNizStringova = blokici.split(",");
        nizBlokica = izabraniBlokoviNizStringova.map(function(blok) {
            return parseInt(blok.replace("blok", ""));
        });
        //alert(nizBlokica); 
        

        let prviBlokIndeks=Math.floor(Math.random()*nizBlokica.length);
        let prviBlok=nizBlokica[prviBlokIndeks];
        sekvenca.push(prviBlok);

        kreni(prviBlok);
    }    
    
    function postaviBlokInicijalno(brBloka){   
        iKoord=0;
        let blok=blokovi["blok"+brBloka];
        let maxi=blok.length;
        let maxj=blok[0].length;

        let najlevlja=kolone;
        let najdesnije=0;

        //preskacem pocetne prazne redove, ako su potpun prazni => blok1
        let pocetniRed = 0;
        for (let k = 0; k < maxi; k++) {
            let praznaVrsta = true;
            for (let j = 0; j < maxj; j++) {
                if (blok[k][j] == 1) {
                    praznaVrsta = false;
                    break;
                }
            }
            if (praznaVrsta==false) {
                pocetniRed = k;
                break;
            }
        }
        
        for(let k=pocetniRed;k<maxi; k++){
            if(iKoord==1 && k==0) continue;
            for (let j=0; j<maxj; j++){
                if(matrica[iKoord+k-pocetniRed][j]==0 && blok[k] && blok[k][j]==1){
                    matrica[iKoord+k-pocetniRed][j]=1;
                    let polje=$("#i"+(iKoord+k-pocetniRed)+"j"+j);
                    polje.addClass("zauzeta");
                    if(j<najlevlja) najlevlja=j;
                    if(j>najdesnije) najdesnije=j;
                    
                }
            }
        }
        
        jKoord=najlevlja;
        jKoordD=najdesnije;
    }

    function postaviBlok(brBloka, i){   
        iKoord=i;
        let blok=blokovi["blok"+brBloka];
        let maxi=blok.length;
        let maxj=blok[0].length;

        for(let k=0;k<maxi; k++){
            for (let j=0; j<maxj; j++){
                if(iKoord+k<matrica.length && jKoord+j<(matrica[iKoord+k].length)){
                    if(matrica[iKoord+k][j+jKoord]==0 && blok[k] && blok[k][j]==1){
                        matrica[iKoord+k][j+jKoord]=1;
                        let polje=$("#i"+(iKoord+k)+"j"+(jKoord+j));
                        polje.addClass("zauzeta");
                    }
                }
            }
        }
        
    }

    function oslobodiDole(brBloka, i){  //oslobadja prethodni red
        iKoord=i+1;
        let blok=blokovi["blok"+brBloka];
        let maxi=blok.length;
        let maxj=blok[0].length;
        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if (i + k >= 0 && i + k < matrica.length && j+jKoord >= 0 && j+jKoord < matrica[i + k].length) {
                    if (matrica[i + k][j+jKoord] == 1 && blok[k][j] == 1) {
                        matrica[i + k][j+jKoord] = 0;
                        let polje = $("#i" + (i + k) + "j" + (j+jKoord));
                        polje.removeClass("zauzeta");
                    }
                }
            }
        }
        
        
    }

    function sledeciBlok(brBlokaTr, brBlokaSl){
        let blok=blokovi["blok"+brBlokaTr];
        let maxi=blok.length;
        let maxj=blok[0].length;

        let blokSl=blokovi["blok"+brBlokaSl];
        let maxiSl=blokSl.length;
        let maxjSl=blokSl[0].length;

         //brisem prethodni blok
        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if (blok[k][j] == 1) {  
                    if (k < slBlokMatr.length && j < slBlokMatr[k].length) {
                        slBlokMatr[k][j] = 0;
                        let staroPolje = $("#sli" + k + "j" + j);
                        staroPolje.removeClass("zauzeta");
                    }
                }
            }
        }

        for (let k = 0; k < maxiSl; k++) {
            for (let j = 0; j < maxjSl; j++) {
                if (blokSl[k][j] == 1) {
                    if (k < slBlokMatr.length && j < slBlokMatr[k].length) {
                        slBlokMatr[k][j] = 1;
                        let polje = $("#sli" + k + "j" + j);
                        polje.addClass("zauzeta");
                    }
                }
            }
        }


    }

    function imaNesto(brBloka){
        let blok=blokovi["blok"+brBloka];
        let maxi=blok.length;
        let maxj=blok[0].length;
        let k=maxi-1;
        if (iKoord + k + 1 >= matrica.length) return true; 
        let m=0;
        while(m<maxj){
            if(blok[k][m]==1 && (matrica[iKoord+k+1][m+jKoord]==1)) return  true;
            m++;
        }
        return false;
    }
   
   
    function pocetakZauzet(){
        let j=0;
        while(j<kolone){
            if(matrica[0][j]==1) return true;
            j++;
        }
        return false;
    }

    function redoviPopunjeni(){
        let popunjen;
        for (let i = vrste - 1; i >= 0; i--) {
            popunjen = true;
            for (let j = 0; j < kolone; j++) {
                if (matrica[i][j] == 0) {
                    popunjen = false;
                    break;
                }
            }

            if (popunjen==true) {
                for (let k = i; k > 0; k--) {
                    for (let j = 0; j < kolone; j++) {
                        matrica[k][j] = matrica[k-1][j];
                        let polje = $("#i" + k + "j" + j);
                        if (matrica[k][j] == 0) {
                            polje.removeClass("zauzeta");
                        } else {
                            polje.addClass("zauzeta");
                        }
                    }
                }
                for (let j = 0; j < kolone; j++) {
                    matrica[0][j] = 0;
                    let polje = $("#i0j" + j);
                    polje.removeClass("zauzeta");
                }
                prethodniRez=rezultat;
                rezultat += 100;
                document.getElementById("rezultat").innerHTML = rezultat;
                i++;
            }
        }
    }

    function f(){
        let i=sekvenca[0];  //broj bloka
        brTrenutnogBloka=i;
        let prviBlokIndeks=Math.floor(Math.random()*nizBlokica.length);
        let prviBlok=nizBlokica[prviBlokIndeks];
        sekvenca.push(prviBlok);
        sledeciBlok(sekvenca[0], sekvenca[1]);

        if (tmp < matrica.length) {
            if (imaNesto(i)) {
                tmp = 0;
                sekvenca.shift();
                let sledeciBlok = sekvenca[0];
                redoviPopunjeni();
                if(rotiran){
                    blokovi["blok"+brTrenutnogBloka]=originalni["blok"+brTrenutnogBloka];
                }
                kreni(sledeciBlok);
                return; 
            }
            
            oslobodiDole(i, tmp - 1);
            postaviBlok(i, tmp);
            tmp++;
            
    
            if (tmp >= vrste - 1) {
                tmp = 0;
                sekvenca.shift();
                let sledeciBlok = sekvenca[0];
                redoviPopunjeni();
                if(rotiran){
                    blokovi["blok"+brTrenutnogBloka]=originalni["blok"+brTrenutnogBloka];
                }
                kreni(sledeciBlok);
                return;
            }
        }  
    }   


    function postaviDesno(brBloka){
        let blok=blokovi["blok"+brBloka];
        let maxi=blok.length;           
        let maxj=blok[0].length;        

        
        let novaJKoordD=jKoord+maxj;
        if(novaJKoordD>=kolone || matrica[iKoord][novaJKoordD]==1){
            console.log("Ne moze vise da se pomeri udesno");
            return;
        }
        if(imaNesto(brBloka)){
            console.log("Ne moze vise da se pomeri udesno");
            return;
        }
        let novaPoz=jKoord+1;

        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if (blok[k][j] == 1 && matrica[iKoord + k][jKoord + j] == 1) {
                    matrica[iKoord + k][jKoord + j] = 0;
                    let staroPolje = $("#i" + (iKoord + k) + "j" + (jKoord + j));
                    staroPolje.removeClass("zauzeta");
                }
            }
        }
    
        
        for (let k = 0; k <maxi; k++) {
            for (let j = maxj-1; j >=0; j--) {
                if (blok[k][j] == 1 && matrica[iKoord+k][novaPoz+j] == 0 && iKoord + k < matrica.length && novaPoz + j < matrica[iKoord].length ) {
                    
                    matrica[iKoord +k][novaPoz + j] = 1;
    
                    let polje = $("#i" + (iKoord +k) + "j" + (novaPoz+j));
                    polje.addClass("zauzeta");
                }
            }
        }
    
        jKoord=novaPoz;
        jKoordD=novaJKoordD;
        
        console.log("i "+iKoord+" j levo "+jKoord+" j desno "+jKoordD);

        
    }

    function postaviLevo(brBloka) {
        let blok = blokovi["blok" + brBloka];
        let maxi = blok.length;          
        let maxj = blok[0].length;       

        let novaJ = jKoord - 1; 
        if(novaJ<0 || imaNesto(brBloka || matrica[iKoord][novaJ]==1)){
            console.log("Ne moze da se pomeri vise ulevo");
            return;
        }
        let novaJKoordD=novaJ+jKoordD-jKoord;

        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if (blok[k][j] == 1 && matrica[iKoord + k][jKoord + j] == 1) {
                    matrica[iKoord + k][jKoord + j] = 0;
                    let staroPolje = $("#i" + (iKoord + k) + "j" + (jKoord + j));
                    staroPolje.removeClass("zauzeta");
                }
            }
        }
    
        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if (blok[k][j] == 1 && matrica[iKoord + k][novaJ + j] == 0 &&  iKoord + k < matrica.length && novaJ + j < matrica[iKoord].length) {
                    matrica[iKoord + k][novaJ + j] = 1;
                    let polje = $("#i" + (iKoord + k) + "j" + (novaJ + j));
                    polje.addClass("zauzeta");
                }
            }
        }
    
        jKoord = novaJ;
        jKoordD=novaJKoordD;
    }

    

    function postaviDole(brBloka){
        let blok=blokovi["blok"+brBloka];
        let maxi=blok.length;
        let maxj=blok[0].length;

        if(imaNesto(brBloka) || (iKoord + maxi >= vrste)){
            console.log("Blok ne moze vise dole");
            return;
        }
        console.log("pomerila dole");

        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if (blok[k][j] == 1) {
                    matrica[iKoord+k][jKoord+j]=0;
                    let polje = $("#i" + (iKoord+k) + "j" + (jKoord+j));
                    polje.removeClass("zauzeta");
                }
            }
        }
        iKoord++;

        for (let k = 0; k < maxi; k++) {
            for (let j = 0; j < maxj; j++) {
                if(blok[k][j]==1){
                    matrica[iKoord+k][jKoord+j]=1;
                    let polje=$("#i"+(iKoord+k)+"j"+(jKoord+j));
                    polje.addClass("zauzeta");
                }
            }
            
        }
        
        console.log("i "+iKoord+" j levo "+jKoord+" j desno "+jKoordD);
    }

    function mozeRotacija(blok, iKoord, jKoord){
        let maxi=blok.length;
        let maxj=blok[0].length;

        for(let i=0; i<maxi; i++){
            for(let j=0; j<maxj; j++){
                if(blok[i][j]==1){
                    if (iKoord + i >= vrste || jKoord + j < 0 || jKoord + j >= kolone || matrica[iKoord + i][jKoord + j] == 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function rotiraj(brBloka) {
        let blok = blokovi["blok" + brBloka];
        
        let novaMatrica = [];
    
        for (let j = 0; j < blok[0].length; j++) {
            novaMatrica[j] = [];
            for (let i = 0; i < blok.length; i++) {
                novaMatrica[j][i] = blok[blok.length - 1 - i][j];
            }
        }
    
        for (let k = 0; k < blok.length; k++) {
            for (let j = 0; j < blok[0].length; j++) {
                if (blok[k][j] == 1) {
                    matrica[iKoord + k][jKoord + j] = 0;
                    let polje = $("#i" + (iKoord + k) + "j" + (jKoord + j));
                    polje.removeClass("zauzeta");
                }
            }
        }
    
        if (mozeRotacija(novaMatrica, iKoord, jKoord)==false) {
            postaviBlok(brBloka, iKoord);
            console.log("Nije moguca rotacija bloka");
            return;
        } else {
            blokovi["blok" + brBloka] = novaMatrica;
            jKoordD = jKoord + novaMatrica[0].length - 1;
            postaviBlok(brBloka, iKoord);
            console.log("i " + iKoord + " j levo " + jKoord + " j desno " + jKoordD);  
        }
    }



    $(document).on("keydown", function(event){
        switch(event.keyCode){
            case 37:
                postaviLevo(brTrenutnogBloka);   //za pomeranje ulevo
                break;
            case 38:    //strelica nagore
                rotiraj(brTrenutnogBloka); 
                break;
            case 39:
                postaviDesno(brTrenutnogBloka);  //za pomeranje udesno
                break;
            case 40:
                postaviDole(brTrenutnogBloka); //za ubrzano kretanje
                break;
        }
    });   

});