// const { getCartCount } = require("../../helpers/user-helpers");

function addToCart(proId){
    console.log("Going");
    $.ajax({
        url:'/add-to-cart?id='+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count = $('#cart-count').html()
                count = parseInt(count)+1
                // console.log("User id is")
                // console.log(response.userId)
                // count = getCartCount(userId)
                $("#cart-count").html(count)
            }
            
        }
    })
}