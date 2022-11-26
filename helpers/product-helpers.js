var db = require('../config/connection')
module.exports = {

    addProduct:(product , callback)=>{
        console.log("Product");
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId.toString())
        })
    }

}