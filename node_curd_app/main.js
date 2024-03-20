require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
// const { route } = require('./routes/test');


const app=express();
const PORT=process.env.PORT || 4000;



mongoose.connect(process.env.DB_URI,{usenewurlparser:true,})
const db=mongoose.connection
db.on('error',(error)=>console.log(error));
db.once('open',()=>console.log('connected to the database!'));





app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use(session({
secret:'my secret key',
saveUninitialized:true,
resave:false,
}))

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})

 app.use(express.static('uploads'))

 app.set('view engine','ejs')



 //route prefix
 app.use ("",require("./routes/test"))
 app.use ("",require("./routes/routes"))

 
 app.use ("",require("./routes/text"))
  app.use ("",require("./routes/book"))

 
// app.get('/',(req,res)=>{
//     res.send("Hello world")
//  })

// const viewName = 'login_users';
// res.render(viewName, data);


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})