const express=require("express")
const route=express()
const mongo=require("mongoose")
const model=require("../model/user_db")

const session=require("express-session")
route.use(session({secret:"tradingjournal123@"}))

route.get('/',(req,res)=>{
    res.render('landing')
})
route.get('/about',(req,res)=>{
    res.render('about')
})

// SIGN UP GEt AND POST REQUEST_________________________________
route.get('/signup',(req,res)=>{
    res.render('signup')
})

route.post('/signup-user',async(req,res)=>{
    
    try{
        const {username,useremail,userpassword}=req.body
        const user=new model({
            username:username,
            useremail:useremail,
            userpassword:userpassword,
        })
        const usr_data=await user.save()
        if(usr_data){res.redirect('/login')}
        else{res.redirect('/signup')}
    }
    catch(er){
        console.log("\nERROR IN /signup-user ROUTE"+er)
    }
})

// __________________________________________________________________


// LOGIN GEt AND POST request_____________________________________
route.get('/login',(req,res)=>{
    res.render('login')
})

route.post('/login-user',async(req,res)=>{
    try{
        const email=req.body.useremail
        const pass=req.body.userpassword

        console.log(email,"\n",pass)
        const usr_log=await model.findOne({useremail:email})

        if(usr_log){
            if(usr_log.userpassword==pass){
                req.session.user_id=usr_log._id
                res.redirect('/homeland')
            }
            else{
                res.redirect('/signup')
            }
        }
    }
    catch(er){
        console.log("\nERROR IN /login-user route",er)
    }
})
// _______________________________________________________________


// logout route___________________________________________
route.get('/logout', (req, res) => {
    try {
        // req.session.destroy();
            res.redirect('/');
    } catch (error) {
        console.log("\nERROR IS IN Logout Route"+error);
    }
});

// ______________________________________________________

module.exports=route