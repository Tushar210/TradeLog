const mongo=require("mongoose")
const schema=mongo.Schema({
    username:String,
    useremail:String,
    userpassword:String,
    crud_user_db: [{ type: mongo.Schema.Types.ObjectId, ref: "crud_user_db" }],
})
const md=mongo.model("User",schema)
module.exports=md