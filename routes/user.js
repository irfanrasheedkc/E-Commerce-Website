const { response } = require('express');
var express = require('express');
const res = require('express/lib/response.js');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers.js');
const userHelpers = require('../helpers/user-helpers')

const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  let cartCount = null
  if (req.session.user) { cartCount = await userHelpers.getCartCount(req.session.user._id) }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products.hbs', { products, user, cartCount });
  })

});

router.get('/login', function (req, res) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginError });
    req.session.userLoginError = false
  }
})

router.post('/signup', function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.user = response
    req.session.user.loggedIn = true
    res.redirect('/')
  })
})

router.get('/signup', function (req, res) {
  res.render('user/signup');
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userLoggedIn = true
      req.session.user = response.user
      req.session.user.loggedIn = "Login failed"
      
      res.redirect('/')
    }
    else {
      req.session.userLoginError = true
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.userLoggedIn = false
  res.redirect('/');
})

router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalValue = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(products)
  res.render('user/cart', { products, user: req.session.user, totalValue });

})

router.get('/uptime', (req, res) => {
  res.render('user/uptime')
})

router.get('/add-to-cart', (req, res) => {
  console.log("API call");
  console.log(req.session.user)
  userHelpers.addToCart(req.query.id, req.session.user._id).then(() => {
    res.json({ status: true, userId: req.session.user._id })
  })
})

router.post('/change-product-quantity',(req, res, next) => {
  console.log(req.body)
  userHelpers.changeProductQuantity(req.body).then(async (response) => {
    console.log("Response is :")
    console.log(response)
    response.total = await userHelpers.getTotalAmount(req.body.user)
    res.json(response)
  })
})

router.get('/delete-product', (req, res) => {
  let proId = req.query.proId
  let Id = req.query.id
  userHelpers.deleteProduct(proId, Id).then((respone) => {
    console.log(respone)
    res.redirect('/cart/')
  })
})

router.get('/place-order', verifyLogin, async (req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order', { total , user:req.session.user});
})

router.post('/place-order' ,async (req , res)=>{
  let products = await userHelpers.getCartProductList(req.body.userId)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body , products , totalPrice).then((orderId)=>{
    if(req.body.payment_method == 'cod'){
    res.json({codSuccess:true});
    }else{
        userHelpers.generateRazorpay(orderId , totalPrice).then((response)=>{
          res.json(response)
        })
    }
  })
  console.log(req.body)
})

router.get('/order-success' , (req , res)=>{
  res.render('user/order-success' , {user:req.session.user})
})

router.get('/orders' , async(req , res)=>{
  let orders =  await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/orders' , {user:req.session.user , orders})
})

router.get('/view-order-products' , async(req , res)=>{
  let products = await userHelpers.getOrderProducts(req.query.id)
  console.log("Products are this:");
  console.log(products)
  res.render('user/view-order-products' , {user:req.session.user , products})
})

router.post('/verify-payment' , (req,res)=>{
  userHelpers.verifyPayment(req.body).then(()=>{
    console.log(req.body)
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("Payment Success")
      res.json({status:true})
    })
  }).catch(()=>{
    console.log("Error");
    res.json({status:false , errMsg:''})
  })
})

module.exports = router;