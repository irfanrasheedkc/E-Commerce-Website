const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers.js');
const userHelpers = require('../helpers/user-helpers')

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user;
  console.log(user);
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products.hbs', {products , user});
  })
  
});

router.get('/login' , function(req , res ){
  if(req.session.loggedIn){
    res.redirect('/');
  }else{
    res.render('user/login',{"loginErr":req.session.loginError});
    req.session.loginError=false
  }
})

router.post('/signup' , function(req , res ){
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.loggedIn = true
    req.session.user = response
  })
})

router.get('/signup' , function(req , res ){
  res.render('user/signup');
})

router.post('/login' , (req , res )=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn="Login failed"
      req.session.user=response.user
      res.redirect('/')
    }
    else{
      req.session.loginError=true
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})

router.get('/cart',verifyLogin,async (req , res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id).then((products)=>{
    console.log(products)
    res.render('user/cart', {products});
  })
})

router.get('/uptime',(req,res)=>{
  res.render('user/uptime')
})

router.get('/add-to-cart',verifyLogin,(req,res)=>{
  console.log(req.session.user)
  userHelpers.addToCart(req.query.id , req.session.user._id).then(()=>{
    res.redirect('/')
  })
})


module.exports = router;