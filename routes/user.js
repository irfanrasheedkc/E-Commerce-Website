const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers.js');
const userHelpers = require('../helpers/user-helpers')

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
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
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('user/login', { "loginErr": req.session.loginError });
    req.session.loginError = false
  }
})

router.post('/signup', function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.loggedIn = true
    req.session.user = response
  })
})

router.get('/signup', function (req, res) {
  res.render('user/signup');
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = "Login failed"
      req.session.user = response.user
      res.redirect('/')
    }
    else {
      req.session.loginError = true
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy();
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
  res.render('user/place-order', { total });
})

module.exports = router;