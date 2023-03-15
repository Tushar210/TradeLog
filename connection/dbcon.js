const mongo=require("mongoose")
require("dotenv").config()
// const db="mongodb+srv://tusharbijalwan12try:bpapb9768l@tradingjournal.8njoo6h.mongodb.net/test"
const db=process.env.DB
const connect_db=async()=>{
    try {
        await mongo.connect(db)
        console.log("DB CONNECTED")
    } catch (error) {
        console.log("\n*ERROR IN CONNECTION*\n"+error)
    }
}
module.exports=connect_db
