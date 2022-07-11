let label = document.getElementById('label')
let shoppingCart = document.getElementById('shopping-cart')

let basket = JSON.parse(localStorage.getItem("data")) || [];

// console.log(basket);

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");

    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
};

// the calculation function has been invoked to prevent the basket value going to zero when the page is refreshed 
calculation();

let generateCartItems = () => {
    if(basket.length !==0) {
        
        // this function will target all the items one by one and then insert any items in the cart into the cart page 
        return (shoppingCart.innerHTML = basket.map((x) => {
            
            // I have used variables to deconstruct the x, which are equal to the items selected by the user. I want to pluck the ID and the Item and form a new x that just contains this information.
            let { id, item } = x;
            
            // I have created a search function to match the ids of the items in my basket to the items in my data.js. y.id is coming from the database, id is coming from the basket.  .find will match the items. if nothing matches then nothing will be returned hence the empty array
            let search = shopItemsData.find((y) => y.id === id) || [];

            let {img, name, price} = search; 

            return `
            <div class="cart-item">
                <img width="100" src=${img} alt="image of dried fruits">
                <div class="details">
                    
                    <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${name}</p>
                            <p class="cart-item-price">£${price}</p>
                        </h4>
                        <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                    </div>
                    
                    <div class="buttons">
                        <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>   
                            <div id=${id} class="quantity">${item}</div>
                        <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                    </div>
                    <h3>£${item * search.price}</h3>
                </div>
            </div>
            `;
        }).join(''));
    } else {
        // console.log('basket is EMPTY')

        shoppingCart.innerHTML = ``
        label.innerHTML = `
        <h2>Cart is empty</h2>
        <a href="index.html">
            <button class="homebtn">Back to home</button>
        </a>
        `
    }
};

generateCartItems();

// the id has been passsed so that JS knows which card to remove
let increment = (id) => {
    let selectedItem = id;

    // This variable performs a search to see if the item already exists in the basket
    let search = basket.find((x) => x.id === selectedItem.id);

    if(search === undefined){
        basket.push({
            id: selectedItem.id,
            item: 1,
        })
    }else{
        search.item += 1;
    }

    // console.log(basket)

    // i have invoked this say that the quantity * itemPrice will be displayed in the shopping cart
    generateCartItems();
    
    // i have invoked the update function in the increment and decrement functions so that it can respond to the cartAmount changes made by the user
    update(selectedItem.id);

    // SetItem puts the data into the local storage
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let selectedItem = id;

    let search = basket.find((x) => x.id === selectedItem.id);

    // if there are no figs in the local storage and the user decrements the figs an error will show.  This if statement prevents that from happening    
    if(search === undefined) return;
    
    else if(search.item === 0) return; 
        
    else {
        search.item -= 1;
    }

     // console.log(basket)
     update(selectedItem.id);
    
    // .filter targets all the objects in the basket array one by one.  x.item !==0 selects all the objects that aren't equal to zero.  The .filter will remove the ones that are equal to zero
    basket = basket.filter((x) => x.item !== 0);

    // i am calling this function to remove items from the cart that have a quanitity of zero
    generateCartItems();

    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    // only if the item exists will it increase 
    let search = basket.find((x) => x.id === id)
    
    // search.item targets the number of items and will leave out the ID
    document.getElementById(id).innerHTML = search.item;
    calculation();
    totalAmount();
};

let removeItem = (id) => {
    let selectedItem = id;
    // console.log(selectedItem.id);

    // inside x (the items in the cart) we are targeting the id.  The .filter initiates a new array filled with elements that pass my test
    basket = basket.filter((x) => x.id !== selectedItem.id);

    // invoking this function will remove a card automatically if there is zero quantity
    generateCartItems();
    
    totalAmount();

    calculation();

    localStorage.setItem("data", JSON.stringify(basket));
};

let totalAmount = () => {
    if(basket.legth !==0) {
        let amount = basket.map((x) => {
            
            // i am deconstructing x as i just want x to refer to the items id
            let {item, id} = x;
            
            // this is using the id to match against the database
            let search = shopItemsData.find((y) => y.id === id) || [];

            return item * search.price;
        }).reduce((x, y) => x + y, 0);
        // console.log(amount)

        label.innerHTML = `
        <h2>Total Bill : £${amount}</h2>
        <button class="checkout">Checkout</button>
        <button onclick="clearCart()" class="clear-cart">Clear cart</button>
        `

    } else return
};

let clearCart = () => {
    basket = [];
    
    generateCartItems();

    calculation();

    localStorage.setItem("data", JSON.stringify(basket));

    // this function is being invoked using an onclick event on the clear cart button
}

totalAmount();