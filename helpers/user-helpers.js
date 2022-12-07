var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId

const bcrypt = require('bcrypt')
const { Collection } = require('mongodb')

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
        let proObj = {
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(product=>product.item==proId)
                console.log(proExist)
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId),'products.item':objectId(proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })
                }else{
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
                    {
                        $push: { products: proObj }
                    }
                ).then((response) => {
                    resolve()
                })
                }
            }
            else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1 , quantity:1 , product : {$arrayElemAt:['$product',0]}
                    }
                }
            ]).toArray()
            console.log(cartItems);
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
        if (cart) {
            count = cart.products.length
            console.log(count)
        }
        resolve(count)
    })
    },
    changeProductQuantity:(details)=>{
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise((resolve , reject)=>{
            if(details.count==-1 && details.quantity==1)
            {
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                    {
                        $pull:{products:{item:objectId(details.product)}}
                    }).then((response)=>{
                        resolve({removeProduct:true})
                    })
            }
            else
            {
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objectId(details.cart), 'products.item':objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':details.count}
                    }).then((response)=>{
                        resolve(true)
                    })
            }
        })
    },
    deleteProduct:(proId , Id)=>{
        console.log(Id)
        console.log(proId)
        return new Promise((resolve , reject)=>{
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objectId(Id),'products.item':objectId(proId)},
                    {
                        $pull:{products:{item:objectId(proId)}}
                    }).then((response)=>{
                        resolve({removeProduct:true})
                    })
                }
    )}
}