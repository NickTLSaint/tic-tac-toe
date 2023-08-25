window.addEventListener("load", ajustarTamanho);
window.addEventListener("resize", ajustarTamanho);

function ajustarTamanho() {
    var main = document.querySelector("main");
    main.style.width = "80vw";
    main.style.height = "80vh";
    var bodyHeight = main.clientHeight;
    var bodyWidth = main.clientWidth;
    var tamanho = Math.min(bodyHeight, bodyWidth);
    main.style.width = tamanho + "px";
    main.style.height = tamanho + "px";
    main.style.margin = "10px";
    var fsz = (tamanho*0.15);
    document.body.style.fontSize  = fsz + "px";
}

var table = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
var cont = 0;
var clickable = [true, true, true, true, true, true, true, true, true];
var waitclick = true;

for (var i = 1; i < 10; i++) {
    var divID = "a" + i;
    var pID = "p" + i;
    var div = document.getElementById(divID);
    
    div.addEventListener("mouseenter", createHoverIn(pID, divID, i-1));
    div.addEventListener("mouseout", createHoverOut(pID, divID, i-1));
    div.addEventListener("mouseover", createHoverIn(pID, divID, i-1));
    div.addEventListener("click", createOnClick(pID, divID, i-1));
}

function createHoverIn(pID, divID, pos) {
    return function() {
        hoverIn(pID, divID, pos);
    };
}

function createHoverOut(pID, divID, pos) {
    return function() {
        hoverOut(pID, divID, pos);
    };
}

function createOnClick(pID, divID, pos) {
    return function() {
        onClicked(pID, divID, pos);
    };
}

function hoverIn(pID, divID, pos) {
    var pn = document.getElementById(pID);
    pn.style.display = "block";
    var dn = document.getElementById(divID);
    if (table[pos] == "-"){
        dn.style.boxShadow = "0 0 30px 0 rgba(0, 90, 170, 0.8)";
    }
}

function hoverOut(pID, divID, pos) {
    var pn = document.getElementById(pID);
    var dn = document.getElementById(divID);
    dn.style.boxShadow = "none";
    if (table[pos] == "-"){
        pn.style.display = "none";
    }
}

function onClicked(pID, divID, pos) {
    if (waitclick && clickable[pos]){
        waitclick = false;
        table[pos] = "x";
        clickable[pos] = false;
        var pn = document.getElementById(pID);
        pn.style.color = "rgba(0, 90, 170, 0.8)";
        var dn = document.getElementById(divID);
        dn.style.boxShadow = "none";
        cont++;
        confVencedor();
        enemyMove();
    }
}

function enemyMove(){
    enemyAnim();
}

function basicEnemyMove(){
    var n;

    if(table[0] == "x" || table[2] == "x" || table[6] == "x" || table[8] == "x"){
        n=4;
    }
    else if(table[4] == "x"){
        var n = getRandomInt(0, 4);
        n *=2;
        if (n==4){
            n=8
        };
    }
    else{
        let tpos = table.indexOf("x");
        let provList = [];
        switch(tpos){
            case 1:
                provList = [0, 2, 4];
                n = provList[getRandomInt(0, 3)];
            break;
            case 3:
                provList = [0, 4, 6];
                n = provList[getRandomInt(0, 3)];
            break;
            case 5:
                provList = [2, 4, 8];
                n = provList[getRandomInt(0, 3)];
            break;
            case 7:
                provList = [4, 6, 8];
                n = provList[getRandomInt(0, 3)];
            break;
        }
    }

        table[n] = "o";
        let px = document.getElementById("p"+(n+1));
        px.style.color = "red";
        px.innerText = "O";
        px.style.display = "block";
        cont++;
        clickable[n] = false;
            setTimeout(function() {
                waitclick = true;
            }, 1000);
}


function minimax(){
    var rootList = [];
    rootList.push(table.slice());
    var rCont = 0;
    var iCont = 0;
    var lim = 9;
    var idLista = ["0"];
    var inser = "o";
    var turno = 1;
    var vencedor = [0];
    var turnoLista = ["x"];

    while(true){

        if (resultado(rootList[rCont]) == "-" && (rootList[rCont]).indexOf("-") != -1){

            var inList = (rootList[rCont].slice());

            while(true){

                if(inList[iCont] == "-"){
                    inList[iCont] = inser;
                    vencedor.push(resultado(inList) == "x" ? -1 : (resultado(inList) == "o" ? 1 : 0));
                    iCont++;
                    idLista.push(idLista[rCont].slice() + iCont);
                    rootList.push(inList.slice());
                    turnoLista.push(inser);

                    if(iCont == 9){
                        rCont++;
                        iCont=0;
                        break;
                    }
                    else{
                        break;
                    }
                }
                else{

                    if(iCont >= 8){
                        rCont++;
                        iCont=0;
                        break;
                    }
                    else{
                        iCont++;
                    }
                }
            }

            if(idLista[rCont].length != turno){

                if ((idLista[rCont].length)%2 == 0){
                    inser = "x";
                }
                else{
                    inser = "o";
                }

                turno++;
            }

            if(rCont == rootList.length){
                break;
            }
            else if(idLista[rCont].length == lim){
                break;
            }
            
        }
        else{
            
            rCont++;
            if(rCont == rootList.length){
                break;
            }
            else if(idLista[rCont].length == lim){
                break;
            }
        }
    }


    var revCont = (rootList.length)-1;
    var prevId = idLista[revCont].substring(0, (idLista[revCont].length)-1);
    var valorSub = vencedor[revCont];
    var iEsc = revCont;
    revCont--;
    var atuId = idLista[revCont].substring(0, (idLista[revCont].length)-1);

    while(true){

        if (prevId == atuId){
            
            if (turnoLista[revCont] == "x"){
                
                if(vencedor[revCont] < valorSub){
                    valorSub = vencedor[revCont];
                    iEsc = revCont;
                }
            }
            else if(turnoLista[revCont] == "o"){
                if(vencedor[revCont] > valorSub){
                    valorSub = vencedor[revCont];
                    iEsc = revCont;
                }
            }
            revCont--;

            if (revCont > -1){
                atuId = idLista[revCont].substring(0, (idLista[revCont].length)-1);
            }

        }
        else{

            let indice = idLista.indexOf(prevId);
            vencedor[indice] = valorSub;
            prevId = idLista[revCont].substring(0, (idLista[revCont].length)-1);
            valorSub = vencedor[revCont];

            if (revCont >0){
                iEsc = revCont;
            }

            revCont--;

            if (revCont > -1){
                atuId = idLista[revCont].substring(0, (idLista[revCont].length)-1);
            }

        }

        if(revCont == -1){
            let melhor = (idLista[iEsc].substring(1,2));
            var pn = document.getElementById("p"+(melhor));
            pn.style.color = "red";
            pn.innerText = "O";
            pn.style.display = "block";
            table[melhor-1] = "o";
            clickable[melhor-1] = false;
            setTimeout(function() {
                waitclick = true;
            }, 1000);

            break;
        }
    }

    cont++;
    confVencedor();
}

function enemyAnim(){

    let dispList = [];
    for (var i=0; i<10; i++){
        if (table[i] == "-"){
            dispList.push(i+1);
        }
    }
    
    let rear = [];
    let ind = dispList.length;
    for (var j=0; j<ind; j++){
        let rnd = getRandomInt(0, dispList.length);
        rear.push(dispList[rnd]);
        dispList.splice(rnd, 1);
    }

    let ant = -1;
    for(var k=0;k<(ind+1); k++){
        (function(idk){
            setTimeout(function() {
                if (ant != -1){
                    let dx2 = document.getElementById("a"+ ant);
                    let px2 = document.getElementById("p"+ ant);
                    dx2.style.boxShadow = "none";
                    px2.style.display = "";
                    px2.style.innerText = "";
                }
                ant = rear[idk];
                if (idk<ind){
                    let dx1 = document.getElementById("a"+ rear[idk]);
                    let px1 = document.getElementById("p"+ rear[idk]);
                    dx1.style.boxShadow = "0 0 30px 0 rgba(200, 0, 0, 0.8)";
                    px1.style.display = "block";
                    px1.style.innerText = "O";
                }
                else{
                    if(cont < 2){
                        basicEnemyMove();
                    }
                    else{
                        minimax();
                    }
                }
            }, ((100*idk)+100));
        })(k);
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resultado(lista){

    let pos = -1;

    if(lista[0] == lista[1] && lista[0] == lista[2] && (lista[0] == "x" || lista[0] == "o")){
        pos = 0;
    }
    else if(lista[3] == lista[4] && lista[3] == lista[5]&& (lista[3] == "x" || lista[3] == "o")){
        pos = 3;
    }
    else if(lista[6] == lista[7] && lista[6] == lista[8] && (lista[6] == "x" || lista[6] == "o")){
       pos = 6
    }else if(lista[0] == lista[3] && lista[0] == lista[6] && (lista[0] == "x" || lista[0] == "o")){
        pos = 0;
    }
    else if(lista[1] == lista[4] && lista[1] == lista[7] && (lista[1] == "x" || lista[1] == "o")){
        pos = 1;
    }
    else if(lista[2] == lista[5] && lista[2] == lista[8] && (lista[2] == "x" || lista[2] == "o")){
        pos = 2;
    }
    else if(lista[0] == lista[4] && lista[0] == lista[8] && (lista[0] == "x" || lista[0] == "o")){
        pos = 0;
    }
    else if(lista[2] == lista[4] && lista[2] == lista[6] && (lista[2] == "x" || lista[2] == "o")){
        pos = 2;
    }
    
    if(pos == -1){
        return "-";
    }
    else{
        return lista[pos];
    }

}

function efeito(sty1, sty2){
    var ma = document.getElementById("main");
    ma.classList.add(sty1);
    ma.classList.add(sty2);
}

function confVencedor(){

    if(resultado(table) == "o"){

        clickable = [false, false, false, false, false, false, false, false, false];
        waitclick  = false;
        var txt = document.getElementById("texto");
        txt.innerHTML = "<h1>Você perdeu</h1><h2>Clique aqui para reiniciar</h2>";
        txt.style.color = "red";
        txt.style.display = "block";
        var foot = document.getElementById("foot");
        foot.style.display = "block";
        ajustarTamanho();
        foot.style.fontSize = "auto";
        

        if(table[0] == table[1] && table[0] == table[2] && table[0] == "o"){
            efeito("hz1", "efeitoHori");
        }
        else if(table[3] == table[4] && table[3] == table[5] && table[3] == "o"){
            efeito("hz2", "efeitoHori");
        }
        else if(table[6] == table[7] && table[6] == table[8] && table[6] == "o"){
            efeito("hz3", "efeitoHori");
        }
        else if(table[0] == table[3] && table[0] == table[6] && table[0] == "o"){
            efeito("vr1", "efeitoVert");
        }
        else if(table[1] == table[4] && table[1] == table[7] && table[1] == "o"){
            efeito("vr2", "efeitoVert");
        }
        else if(table[2] == table[5] && table[2] == table[8] && table[2] == "o"){
            efeito("vr3", "efeitoVert");
        }
        else if(table[0] == table[4] && table[0] == table[8] && table[0] == "o"){
            efeito("dg1", "efeitoDiag");
        }
        else if(table[2] == table[4] && table[2] == table[6] && table[2] == "o"){
            efeito("dg2", "efeitoDiag2");
        }
    }
    else if(resultado(table) == "-" && table.indexOf("-") == -1){
        clickable = [false, false, false, false, false, false, false, false, false];
        waitclick  = false;
        var txt = document.getElementById("texto");
        txt.innerHTML = "<h1>Ninguém ganhou</h1><h2>Clique aqui para reiniciar</h2>";
        txt.style.color = "red";
        txt.style.display = "block";
        var foot = document.getElementById("foot");
        foot.style.display = "block";
        ajustarTamanho();
        foot.style.fontSize = "auto";
    }
    
} 

let txt = document.getElementById("texto");
txt.addEventListener("click", createResetar());

function createResetar() {
    return function() {
        resetar();
    };
}

function resetar(){
    let txt = document.getElementById("texto");
    txt.style.display = "none";
    let foot = document.getElementById("foot");
    foot.style.display = "none";

    table = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    cont = 0;
    clickable = [true, true, true, true, true, true, true, true, true];
    waitclick = true;
    for (var i = 1; i < 10; i++) {
        let pID = "p" + i;
        let p = document.getElementById(pID);
        p.innerText = "X";
        p.style.display = "none";
        p.style.color = "rgb(216, 216, 216)";
    }
}
