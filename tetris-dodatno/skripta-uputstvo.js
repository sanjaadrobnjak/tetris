let izabraniBlokovi=[]; //moguci blokovi koji su cekirani
function zapocniIgru()
{
    let nivo = document.querySelector('input[name=nivo]:checked').value;
    let cekiraniBlokovi=document.querySelectorAll(".blok");
    cekiraniBlokovi.forEach(function(checkbox) {
        if (checkbox.checked) {
            izabraniBlokovi.push(checkbox.id);
        }
    });

    localStorage.setItem("tezinaNivoa", nivo);
    localStorage.setItem("cekiraniBlokovi", izabraniBlokovi);
}

$(document).ready(function(){
    $("#zapocni").click(function(){
        window.location.href="tetris-igra.html";
    });

    $("#rezultati").click(function(){
        window.location.href="tetris-rezultati.html";
    });
});