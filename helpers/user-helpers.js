var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId

const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (userdata) => {
        return new Promise(async (resolve, reject) => {
            userdata.Password = await bcrypt.hash(userdata.Password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
                resolve(data.insertedId.toString())
            }
            )
        })
    },
    doLogin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let status = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userdata.Email })
            if (user) {
                bcrypt.compare(userdata.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("Login success")
                        resolve({ user, status: true })
                    }
                    else {
                        console.log("Login failed")
                        resolve({ status: false })
                    }
                })
            }
            else {
                console.log("Failed")
                resolve({ status: false })
            }
        })
    },
    addToCart: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
                {
                    $push: { products: objectId(proId) }
                }
                ).then((response) => {
                    resolve()
                })
            }
            else {
                let cartObj = {
                    user: objectId(userId),
                    products: [objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    }
}