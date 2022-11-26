var express = require('express');
const productHelpers = require('../helpers/product-helpers.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"IPhone 11",
      category:"Mobile",
      description:"The iPhone 11 has a 6.1-inch (15 cm) IPS LCD with a resolution is 1792 x 828 pixels (1.4 megapixels) at a pixel density of 326 PPI with a maximum brightness of 625 nits ",
      image:"https://cellbuddy.in/buddy/wp-content/uploads/2022/09/11-purple.png"
    },
    {
      name:"OnePlus Nord",
      category:"Mobile",
      description:"OnePlus phones are known for their solid battery life and fast charging support, which is why so many users prefer them. ",
      image:"https://m.media-amazon.com/images/I/61+Q6Rh3OQL._SL1500_.jpg"
    },
    {
      name:"Oppo 10X",
      category:"Mobile",
      description:"Seize the Night with Ultra Night Mode 2.0. The Reno 10x Zoom is equipped with the Qualcomm Snapdragon 855 processor.",
      image:"https://cdn.dxomark.com/wp-content/uploads/medias/post-38804/oppo_reno_10xzoom.jpg"
    },
    {
      name:"MI Note 9 Pro",
      category:"Mobile",
      description:"Image result for mi note 9 pro Xiaomi Redmi Note 9 Pro 5G flaunts 128GB internal storage which can be expanded up to 512GB. ",
      image:"https://i02.appmifile.com/430_operator_in/30/01/2021/e95cb65d71fa8a1a5e7ee201e1a63d12!800x800!85.png"
    }
  ]

  res.render('admin/view-product.hbs' , {products , admin:true})
});

router.get('/add-product' , function(req , res){
  res.render("admin/add-product.hbs" , {admin:true})
}) 

router.post('/add-product' , (req , res)=>{
  console.log(req.body);
  console.log(req.files.image);
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

module.exports = router;
