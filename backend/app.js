import express from "express"
import cors from "cors"
import {ROUTER} from "./router.js"

const {pathname: root} = new URL('../public', import.meta.url)

let rootCorregido = root.substring(1)

const app = express()

app.use(cors())

app.set('view engine', 'ejs')

app.use(express.static(rootCorregido))

app.use("/", ROUTER)

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server inició")
    console.log(rootCorregido)
})