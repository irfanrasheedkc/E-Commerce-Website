var db = require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId

module.exports = {

    addProduct:(product , callback)=>{
        console.log("Product");
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId.toString())
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve , reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise(async(resolve , reject)=>{
            console.log(objectId(proId))
            var myquery = { _id:objectId(proId) };
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne(myquery).then((response)=>{
                resolve(response)
            })
        })
    }

}