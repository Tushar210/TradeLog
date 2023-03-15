const express = require("express")
const app = express()
const db_con=require("./connection/dbcon")
require("dotenv").config()
const port=process.env.PORT||8085

// MIDDLE WARES____________________________
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// ________________________________________

// setting up views,routers,images_________________
app.set("views","./views")
app.set("view engine","ejs")
app.use(express.static('public'));
app.use("/",require("./routers/user.js"))
app.use("/",require("./routers/record_table.js"))
// ________________________________________________

// Database connection_____________________________
db_con()
// ________________________________________________
app.get('/', (req, res) => {
  res.send("Hii")
})

app.listen(port, (err) => {if (err) {console.log(err) } else {console.log("SERVER STARTED")}})
// app.listen(8085, (err) => {if (err) {console.log(err) } else {console.log("SERVER STARTED")}})
