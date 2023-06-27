// import mongoose
const mongoose=require('mongoose')

// connection string
mongoose.connect('mongodb://127.0.0.1:27017/bankServer',{useNewUrlParser:true})

// model
const User= mongoose.model('User',{

acno:Number,
uname:String,
psw:String,
balance:Number,
transactions:[]
})

// export
module.exports={
    User
}