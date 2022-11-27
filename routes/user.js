const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers.js');
const userHelpers = require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user;
  console.log(user);
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products.hbs', {products , user});
  })
  
});

router.get('/login' , function(req , res ){
  res.render('user/login');
})

router.post('/signup' , function(req , res ){
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
  })
})

router.get('/signup' , function(req , res ){
  res.render('user/signup');
})

router.post('/login' , (req , res )=>{
  userHelpers.doLogin(req.body).then((response)=>{
    console.log("returned is"+response.status)
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }
    else{
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})
module.exports = router;
