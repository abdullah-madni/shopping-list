$(document).ready(function () {

    registerServiceWorker();


    showCartItems();


    $('form').submit(function (e) {
        e.preventDefault();
        const cartItem = this.itemName.value;
        addItemToCartList(cartItem);
        showCartItems();
        this.reset();
    });


    $('.cart-list').on('dblclick', 'li', function () {
        const cartItem = this.innerHTML;
        removeItemToCartList(cartItem);
        showCartItems();
    });


    $('.modal-toggler').click( function() {
        $('.my-modal').slideToggle('slow');
    });


    $('.modal-close').click(function () {
        $('.my-modal').slideToggle('slow');
    });

});



function addItemToCartList(cartItem) {
    cartItem = cartItem.toUpperCase();
    if (localStorage.getItem("cartList") == null) {
        let cartList = [];
        cartList.push(cartItem);
        localStorage.setItem("cartList", cartList.toString());
    } else {
        let cartList = [localStorage.getItem("cartList")];
        cartList.push(cartItem);
        localStorage.setItem("cartList", cartList.toString());
    }
}


function showCartItems() {
    const cartListEl = $('.cart-list');
    if (localStorage.getItem("cartList") == null) {
        cartListEl.html("No items there... yet");
    } else {
        cartListEl.html('');
        let cartList = localStorage.getItem("cartList").split(",");
        cartList.forEach(function (cartItem, index) {
            cartListEl.append(`<li>${cartItem}</li>`);
        });
    }
}


function removeItemToCartList(cartItem) {
    cartItem = cartItem.toUpperCase();
    const cartListEl = $('.cart-list');
    let cartList = localStorage.getItem("cartList").split(",");
    const index = cartList.indexOf(cartItem);
    if (index > -1) {
        cartList.splice(index, 1);
        if (cartList.length > 0) {
            localStorage.setItem("cartList", cartList.toString());
        } else {
            localStorage.clear();
        }
    }
}



function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('Registration successful', reg);
        }).catch(e => console.error('Error during service worker registration:', e));
    } else {
        console.warn('Service Worker is not supported');
    }
}