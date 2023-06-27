// import db.js file
const db = require('./db')

// import jwt
const jwt = require('jsonwebtoken')

// create a func for register logic
register = (acno, uname, psw) => {
    // collection key:arg value
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: "user already exist",
                status: false,
                statusCode: 404
            }
        }
        else {
            // creating an object for new user
            newusers = new db.User({
                acno: acno,
                uname: uname,
                psw: psw,
                balance: 0,
                transactions: []
            })

            // save new object to reflect the change in db
            newusers.save()
            return {
                message: "registered succefully",
                status: true,
                statusCode: 200
            }
        }

    })
}

// login logic

login = (acno, psw) => {
    return db.User.findOne({ acno, psw }).then(user => {
        if (user) {

            // token generation
            const token = jwt.sign({ currentAcno: acno }, "secretkey123")
            return {
                message: "login succefull",
                status: true,
                statusCode: 200,
                currentUser: user.uname,
                currentAcno: user.acno,
                // send to client
                token
            }
        }
        else {
            return {
                message: "incurrect acno or password",
                status: false,
                statusCode: 401
            }
        }
    })
}

// get balance

getBalance = acno => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user.balance,
                status: true,
                statusCode: 200
            }
        }
        else {
            return {
                message: "incurrect acno",
                status: false,
                statusCode: 401
            }
        }
    })
}

// single user details
getUser = acno => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user,
                status: true,
                statusCode: 200
            }
        }
        else {
            return {
                message: "incurrect acno",
                status: false,
                statusCode: 401
            }
        }
    })
}

// fund transfer
fundTransfer = (toAcno, FromAcno, amount, psw, date) => {
    let amt = parseInt(amount)
    return db.User.findOne({ acno: FromAcno, psw }).then(fromUser => {  //checking the sending user in database
        if (fromUser) {
            return db.User.findOne({ acno: toAcno }).then(toUser => {  // checking receiving user in db
                if (toUser) {
                    if (amt > fromUser.balance) {   //checking balace 
                        return {
                            message: "Insufficient Balance",
                            status: false,
                            statusCode: 404
                        }
                    }
                    else {  // transation logic

                        fromUser.balance -= amt  //debit logic
                        fromUser.transactions.push({
                            type: "DEBIT",
                            amount: amt,
                            date
                        })
                        fromUser.save()

                        toUser.balance += amt  // credit logic
                        toUser.transactions.push({
                            type: "CREDIT",
                            amount: amt,
                            date

                        })
                        toUser.save()

                        return {
                            message: "Transaction Success",
                            status: true,
                            statusCode: 200,
                            balance: fromUser.balance
                        }

                    }
                }
                else {
                    return {
                        message: "Invalid Credit Credential",
                        status: false,
                        statusCode: 404
                    }
                }

            })
        }
        else {
            return {
                message: "Invalid Credit Credential",
                status: false,
                statusCode: 404
            }
        }
    })
}

// Transaction status
getTransaction = (acno) => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user.transactions,
                status: false,
                statusCode: 200
            }
        }
        else {
            return {
                message: "invalid user",
                status: false,
                statusCode: 404
            }
        }
    })

}

deleteAc = (acno) => {
    return db.User.deleteOne({ acno }).then(deleteCount => {
        if (deleteCount) {
            return {
                message: "User deleted",
                status: false,
                statusCode: 200
            }
        }
        else {
            return {
                message: "invalid user",
                status: false,
                statusCode: 404
            }
        }
    })
}


module.exports = {
    register, login, getBalance, getUser, fundTransfer, getTransaction, deleteAc
}
