let lose
let win = false;
let counterStart = 0
let fichas = document.getElementById("fichas")
let spanParagraphLoss = document.getElementById("spanParagraphLoss")
spanParagraphLoss.style.display = "none"
let Puntos = document.getElementById("Puntos")
let CartasJugadas = document.getElementById("CartasJugadas")
var paragraph = document.createElement('p')
const spanParagraph = document.getElementById("spanParagraph")
spanParagraph.appendChild(paragraph)
let CARD_GROUP = document.getElementById("card-group-select")
let buttonClick = document.getElementById("buttonClick")
let buttonStop = document.getElementById("buttonStop")
let valorDeck = 0;

// se me ocurre poner que por cada click del boton se envie el objeto de valores dinamicos al server,
// o de lo contrario exportarlos pero ya vimos que hay drama con eso

/**
 * Enviar valores dinamicos al backend para ser transportados a todo el proyecto
 */

class ValoresDinamicos{
    constructor(valorDeck, gameStatus){
        this.id;
        this.numero = Math.floor(Math.random() * (29 - 19 + 1) + 19)
        this.valorDeck;
        this.cardValues = []
        this.gameStatusLoss;
        this.fichas = 50
    }

    resetUserGame(){
        this.numero = Math.floor(Math.random() * (29 - 19 + 1) + 19)
        this.valorDeck = 0
        this.cardValues = []
        this.gameStatusLoss = Boolean
        if(this.fichas > 0) enableButtons()
        restartCards()
        counterStart = 0 
    }
    returnCards(){
        fetch(`https://deckofcardsapi.com/api/deck/${valoresDinamicos.id}/return/`)
    }
    
    calcularFichasTotales(array){
        let arrayTwo = []
        let arrayKing = []
        let arrayA = []
        array.map(card => {
            if(card == '2') return arrayTwo.push(card) 
            else if(card == 'KING') return arrayKing.push(card)
            arrayA.push(card)
        })
        
        if(arrayTwo.length == 3) this.fichas += 10
        if(arrayKing.length == 3) this.fichas += 17
        if(arrayA.length == 3) this.fichas += 20
        if(arrayKing.length == 4) this.fichas += 27
        if(arrayA.length == 4) this.fichas += 30
        if(arrayTwo.length == 4) this.fichas += 33
        console.log(this.fichas)
    }

    comenzarJuego(){
        if(this.cardValues.length == 0 ) valoresDinamicos.fichas = valoresDinamicos.fichas - 4;
        if(this.fichas < 0){
            fichas.innerHTML = `Sin fichas` 
            disableButtons()
        }
    }

    eliminarFichas(){
        valoresDinamicos.fichas = valoresDinamicos.fichas - 5;
    }
}

let valoresDinamicos = new ValoresDinamicos()

let alertas = document.querySelector(".alert")
setInterval(() => {
    alertas = document.querySelector(".alert")
    valuesUpdate()
}, 10);


buttonClick.addEventListener("click", ()=>{
    counterStart += 1
    if(counterStart==1) valoresDinamicos.comenzarJuego()
})

function valuesUpdate(){
    fichas.innerHTML = `${valoresDinamicos.fichas}`
    Puntos.innerHTML = `${valoresDinamicos.valorDeck}`    
    CartasJugadas.innerHTML = `${valoresDinamicos.cardValues.length}`
}

window.onload = function sucedeEnWindowOnload(){
    valuesUpdate()
    const url = `http://localhost:3000/api/id`
    fetch(url)
    .then((response)=> response.json())
    .then((response)=>{
       valoresDinamicos.id = response;
    })
}

console.log(valoresDinamicos.numero)

async function pickCard(){
    // if(valoresDinamicos.cardValues.length == 7){
    //     disableButtons()
    // }
    spanParagraphLoss.style.display = "none"
    await fetch(`https://deckofcardsapi.com/api/deck/${valoresDinamicos.id}/draw/?count=1`)
    .then(res => res.json())
    .then((response)=>{
        CARD_GROUP.innerHTML += `
        <div id="card-group-select" class="wholeCard align-items-bottom ">
        <div class="card">
        <img class="card-img" src='${response.cards[0].image}'></img>
        </div>
        </div> 
        `
        valoresDinamicos.cardValues.push(response.cards[0].value)
        verifyValues()
        return
    })
}

function verifyValues(){
    valoresDinamicos.valorDeck = 0;
    valoresDinamicos.cardValues.forEach((card)=>{
        switch(card){
            case "2": valoresDinamicos.valorDeck += 2
            break;
            case "KING": valoresDinamicos.valorDeck += 7
            break;
            case "ACE": valoresDinamicos.valorDeck += 5
            break;
            default: alert("error")
        }
        paragraph.innerHTML = `${valoresDinamicos.valorDeck} Puntos Límite es ${valoresDinamicos.numero}`; 
    })
    checkLose(valoresDinamicos.valorDeck)
    return
}

function checkLose(value){
    if(value < valoresDinamicos.numero){
        valoresDinamicos.gameStatusLoss = false;
        return
    }
    valoresDinamicos.gameStatusLoss = true;
    valoresDinamicos.eliminarFichas()
    paragraph.innerHTML = ``;
    spanParagraphLoss.style.display = "block"
    disableButtons()
    return
}

function stopPicking(){
    if(valoresDinamicos.gameStatusLoss == false) {
        alertas.outerHTML = `
        <div class="alert alert-success" role="alert">
        Ganaste la ronda! Bien hecho.
        </div>
        `
    }
    paragraph.innerHTML = ``;
    valoresDinamicos.calcularFichasTotales(valoresDinamicos.cardValues)
    disableButtons()
    valoresDinamicos.resetUserGame()

}

function disableButtons(){  
    buttonStop.disabled = true;
    buttonClick.disabled = true;
    if(valoresDinamicos.gameStatusLoss == true) {
        alertas.outerHTML = `
        <div class="alert alert-danger" role="alert">
            Perdiste la ronda... Prueba suerte otra vez !
        </div>
        `
    }
    valoresDinamicos.resetUserGame()
}

function enableButtons(){
    buttonStop.disabled = false;
    buttonClick.disabled = false;
}

function restartCards(){
    CARD_GROUP.innerHTML = ``
    valoresDinamicos.returnCards()
}
