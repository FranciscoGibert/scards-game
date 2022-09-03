import express from "express"
import fetch from "node-fetch"

const ROUTER = express.Router()

let DECK_ID = ''

let PLAYERS_ARRAY = [] //puedo utilizarlo para hacer multijugador

function fetchCards(){
    const url_ = 'https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD,AC,2C,KC,AH,2H,KH'
    fetch(url_)
    .then(res => res.json())
    .then((response)=>{
        DECK_ID = (response.deck_id)
        PLAYERS_ARRAY.push(response.deck_id)
        console.log(PLAYERS_ARRAY);
    }) 
}

ROUTER.get("/api/id", (req,res)=>{
    res.send(JSON.stringify(DECK_ID))
})

ROUTER.get("/api/cards", (req, res)=>{
    fetchCards()
    const url = `https://deckofcardsapi.com/api/deck/${DECK_ID}/draw/?count=2`
    fetch(url)
    .then((response)=> response.json())
    .then((response)=>{
        res.render("index.ejs")
    })
})
      
export {ROUTER , fetchCards}
