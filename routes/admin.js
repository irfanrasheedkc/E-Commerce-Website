var express = require('express');
const productHelpers = require('../helpers/product-helpers.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-product.hbs' , {products , admin:true})
  })
  
});

router.get('/add-product' , function(req , res){
  res.render("admin/add-product.hbs" , {admin:true})
}) 

router.post('/add-product' , (req , res)=>{
  productHelpers.addProduct(req.body , (id)=>{
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg' , (err,done)=>{
      if(!err){
        res.render("admin/add-product")
      }
      else
        console.log(err)
    })
  })
})

router.get('/delete-product',(req , res)=>{
  let proId = req.query.id
  productHelpers.deleteProduct(proId).then((respone)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product',async (req , res)=>{
  let product =await productHelpers.getProductDetails(req.query.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product' , (req , res)=>{
  productHelpers.updateProduct(req.query.id , req.body).then(()=>{
    res.redirect('/admin')
    if(req.files){
    if(req.files.image){
      let image=req.files.Image
      image.mv('./public/product-images/'+req.query.id+'.jpg' , (err,done)=>{
        if(!err){
          res.render("admin")
        }
        else
          console.log(err)
      })
    }
  }
  })
})

module.exports = router;
