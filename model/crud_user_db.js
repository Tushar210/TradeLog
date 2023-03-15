const mongo=require("mongoose")

const schema=new mongo.Schema({
  user: {
    type: mongo.Schema.Types.ObjectId,
    ref: "user_db",
  }, 
  Date:Date,
    Script:String,
    Entrytime:String,
    Entryprice:Number,
    Exittime: String,
    Exitprice:Number,
    StopLoss:Number,
    Qty:Number,
    StrategyName:String,
})
const md=mongo.model("crud_user_db",schema)
module.exports=md