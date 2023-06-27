//  import express
const express = require('express')

// import logic file
const logic = require('./service/logic')

// app creation using express
const app = express()

// integrate frontend with server
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:4200' }))

// to convert all incoming json data to js
app.use(express.json())

// import jwt
const jwt = require('jsonwebtoken')

const jwtMiddlreware = (req, res, next) => {
    console.log("....middleware....");

    // access token from request header
    try {
        const token = req.headers["access_token"]

        // verify
        jwt.verify(token, "secretkey123")

        next()     //next use for next request
    }
    catch {
        res.status(404).json({
            statusCode: 404,
            status: false,
            message: "unautherrized user"
        })
    }
}

// request
app.post('/register', (req, res) => {

    logic.register(req.body.acno, req.body.uname, req.body.psw).then(result => {
        res.status(result.statusCode).json(result)
    })
})

//  its an example
// app.get('/getdata',(req,res)=>{
//     console.log(req.body.acno);
//     // res.send("get method....")
//     res.json(req.body.acno)
// })


// login

app.post('/login', (req, res) => {
    logic.login(req.body.acno, req.body.psw).then(result => {
        res.status(result.statusCode).json(result)
    })
})

// balance
app.get('/balance/:acno', jwtMiddlreware, (req, res) => {
    logic.getBalance(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})

// single user
app.get('/getUser/:acno', (req, res) => {
    logic.getUser(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})

// fund 
app.post('/transfer', (req, res) => {
    // toAcno, fromAcno, amount, psw, date
    logic.fundTransfer(
        req.body.toAcno,
        req.body.fromAcno,
        req.body.amount,
        req.body.psw,
        req.body.date
    ).then(result => {
        res.status(result.statusCode).json(result)
    })

})

// TransactionStatus
app.get('/transaction/:acno', (req, res) => {
    logic.getTransaction(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})

// delete account
app.delete('/deleteAc/:acno',jwtMiddlreware,(req,res)=>{
    logic.deleteAc(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
// port set 
app.listen(3000, () => {
    console.log("server started at port 3000");
})

