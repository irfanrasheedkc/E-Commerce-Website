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
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve , reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    updateProduct:(proId , proDetails)=>{
        return new Promise((resolve , reject)=>{
            console.log(proId)
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    money:proDetails.money,
                    description:proDetails.description,
                    category:proDetails.category
                }
            }).then((response)=>{
                console.log(response)
                resolve()
            })
        })
    }

}