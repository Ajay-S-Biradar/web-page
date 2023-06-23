const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dbname = "myfirstdb"
const path = require('path')
const nodemailer = require('nodemailer')
var otp 
var MAIL 
const PORT = 5000 
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'pug');
app.use('/static', express.static('static'));
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:"ajaysbiradar3@gmail.com",
      pass: "lqhvdmghcavraxop"
    }
})
async function connectToMongoDB() {
    try {
      await mongoose.connect('mongodb+srv://sbmunnu:munnu@mongo.mzaad3h.mongodb.net/<dbname>?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
connectToMongoDB()
Schema = mongoose.Schema 
const userSchema = new Schema({
    name:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String
    }
})
// console.log("hii") 
const User = mongoose.model('User', userSchema)

// app.get('/otp',(res,))

app.get('/test',(req,res)=>{
  message = "hiii"
  res.render('test')
})

app.get('/',(req,res)=>{
  message = "hiii"
  res.render('main',{message})
})

app.get('/login',(req,res) =>{
  message = "hiii"
  res.sendFile(path.join(__dirname,'login.html'))
  res.render('login')
})

app.post('/login',(req,res)=>{
  inputname = req.body.name
  pass = req.body.password
  User.findOne({name:inputname}).then((users)=>{
    if (users) {
      // User exists in the database
      console.log('User found:', users);
      // Perform actions for existing user 
      if(users.password===pass){
        console.log("Successful in login")
        res.redirect('/user') 
      }
      else{
        console.log('password and username not matched')
        res.render('login',{message:"invalid user name and password"})
      }
    } else {
      // User does not exist in the database 
      console.log('User not found');
      res.render('login',{message:"true"})
      // Perform actions for non-existing user
    }

  })
  .catch((err)=>{
    console.log(err)
  })
  // console.log(req.body)
})
app.get('/otp',(req,res)=>{
    otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp)
    res.sendFile(path.join(__dirname, 'otp.html'))
})
app.post('/otp',(req,res)=>{ 
  MAIL = req.body.mail 
  const mailOptions = {
    from: 'ajaysbiradar3@gmail.com',
    to: MAIL,
    subject: 'OTP',
    text: otp.toString()
  };
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      //   res.sendFile(path.join(__dirname, '2.html'));
      } else {
        console.log('Email is sent', info.response);
      //   res.sendFile(path.join(__dirname, '3.html'));/
      res.redirect('/signup')
      }
  });
})
app.get('/signup',(req,res)=>{
  res.sendFile(path.join(__dirname,'test.html'))
})
app.post('/signup',(req,res)=>{
    if(otp==req.body.otp){
    var newUser = {
        name:req.body.username , 
        password:req.body.userpass,
        email:req.body.useremail
    }
    new User(newUser).save().then((info)=>{
        console.log('hello')
        res.redirect('/login')
    })
    .catch((error)=>{
        console.log(error)
    })
    }
    else{
        console.log("not valid otp")
    }
})
app.get('/user',(req,res)=>{
  message = "u r logged in"
  res.render('main',{message})
})

// app.listen(3000,()=>{
app.listen(5000,()=>{
    console.log("running")
})