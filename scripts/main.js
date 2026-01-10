const shippingFee = 4.99;
let basket = [];


function linksNameCategory() {
    let menuCategoryEl = document.getElementById("menu-category");
    menuCategoryEl.innerHTML = ""; 
    for (let i = 0; i < categories.length; i++) {
        linkNameCategoryTemplate(menuCategoryEl, i);
    }
}


function linkNameCategoryTemplate(menuCategoryEl, i){
    menuCategoryEl.innerHTML += ` 
      <a href="#categoryIdNr-${i}"> 
        ${categories[i].name} 
      </a> 
    `;
}      


function categoryNameFoto() {
    const categoryElement = document.getElementById("category");
    categoryElement.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        categoryElement.innerHTML += categoryNameFotoTemplate(i)
        generateFoodsCards(i);
    }
}


function categoryNameFotoTemplate(i){
    return `
      <div class="food-category" id="categoryIdNr-${i}"> 
        <h2>${categories[i].name}</h2>
        <img src="${categories[i].image}" alt="${categories[i].name}">
      </div>
      <div class="foods" id="foodsNr${i}"></div>
    `;
}


function generateFoodsCards(index) { 
    let foodElement = document.getElementById("foodsNr" + index);
    foodElement.innerHTML = "";
    let foodList = categories[index].foods;
    for (let foodsIndex = 0;foodsIndex < foodList.length; foodsIndex++) {
        let food = foodList [foodsIndex];
        foodElement.innerHTML += foodcardsTemplate(food, foodsIndex, index);
    }
}


function foodcardsTemplate(food, foodsIndex, index){
    return `
      <div class="food pizza" id="food-${index}-${foodsIndex}"> 
        <h2>${food.name}</h2><p>${food.description}</p>
        <span class="euro">${food.price.toFixed(2)}€</span>
        <div class="hero-plus-div" onclick="addToBasket(${index}, ${foodsIndex})">
        <button class="hero-plus-icon">+</button></div>
      </div>
    `;
}


function addToBasket(categoryIndex, foodIndex) { 
    let food = categories[categoryIndex].foods[foodIndex];
    let basketIndex = -1;
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name === food.name) {
            basketIndex = i;
            break;
        }
    }
    if (basketIndex !== -1) {
        basket[basketIndex].count++;
    } else {
        basket.push({
            name: food.name,
            price: food.price,
            count: 1,
        });
    }
    generateBasketCard();
    document.getElementById("side-menu").classList.add("show-mobile"); 
}


function generateBasketCard() {
    const emptyBasketEl = document.getElementById("empty-basket");
    const basketInfoEl = document.getElementById("basket-info");
    const basketFoodsEl = document.getElementById("basket-foodstuffs");
    basketFoodsEl.innerHTML = "";
    if (basket.length === 0) {
        basketInfoEl.style.display = "none";
        emptyBasketEl.style.display = "flex";
        return;
    }
    basketInfoEl.style.display = "block";
    emptyBasketEl.style.display = "none";
    for (let i = 0; i < basket.length; i++) {
        let food = basket[i];
        let totalPrice = (food.price * food.count).toFixed(2).replace('.', ',');
        basketFoodsEl.innerHTML += basketCardTemplate(food, i, totalPrice);
    
    }
    generatePriceTable();
}


function basketCardTemplate(food, i, totalPrice){
    return `
      <div class="basket-food">
          <h3>${food.name}</h3>
          <div class="basket-food-info">
              <div class="count">
                  <button type="button" onclick="decreaseBasket(${i})">
                      <i class="bi bi-dash-lg"></i>
                  </button>

                  <span class ="count-number">${food.count}x</span>

                  <button type="button" onclick="increaseBasket(${i})">
                      <i class="bi bi-plus-lg"></i>
                  </button>
              </div>

              <div class="price-container">
                <span class= "price">${totalPrice} €</span>
              </div>

              <button type="button" class="btn-trash-can" onclick="deleteFromBasket(${i})">
                <i class="bi bi-trash3-fill"></i>
              </button>
          </div>
      </div>
`;
}


function increaseBasket(index) {
    basket[index].count++;
    generateBasketCard();
}


function decreaseBasket(i) {
    if (basket[i].count > 1) {
        basket[i].count--;
    } else {
        basket.splice(i, 1);
    }
    generateBasketCard();
}


function deleteFromBasket(index) {
    basket.splice(index, 1);
    generateBasketCard();
}


function generatePriceTable() {
    let subtotal = calculatePrice(basket);
    let total = (subtotal + shippingFee).toFixed(2);
    document.getElementById("basket_table").innerHTML = PriceTableTemplate(total, subtotal); //mega wichtig=> hier muss ich ken "+=" nutzen weil ich nur einmal tabelle in warenkorb zeigen will deswegen nur "=" nutzen
}
 

function PriceTableTemplate(total, subtotal){
    return `
    <tr>
      <td class="label">Zwischensumme</td>
      <td class="value">${subtotal.toFixed(2).replace('.', ',')}€</td>
    </tr>
    <tr>
      <td class="label">Lieferkosten</td>
      <td class="value">${shippingFee.toFixed(2).replace('.', ',')}€</td>
    </tr>
    <tr class="total-row">
      <td class="label">Gesamt</td>
      <td class="value" id="basket-total">${total.replace('.', ',')}€</td>
    </tr>
  `;

}


function calculatePrice(foods) {
    let subtotal = 0;
    for (let i = 0; i < foods.length; i++) {
        subtotal = subtotal + foods[i].price * foods[i].count;
    }
    return parseFloat(subtotal.toFixed(2));
}


function updatePopupData() {
    let listeText = "";
    for (let i = 0; i < basket.length; i++) {
        listeText += basket[i].count + "x " + basket[i].name + "<br>";
    }
    document.getElementById("popup-liste").innerHTML = listeText;
    document.getElementById("popup-preis").innerText = document.getElementById("basket-total").innerText;
}


function BtnPay() {
    updatePopupData(); // Hier rufen wir die Daten-Vorbereitung auf, wird niemals updatePopupData() selbstständig ausführen ausser wenn bezahle taste geclckt wird. weil in  onclick'btnPay diese function updatePopupData(); aufgerfuen und nie anderswo
    document.getElementById("pay-overlay").style.display = "flex";
}


function emptyShoppingCart(){
  basket = [];
    generateBasketCard();
    document.getElementById("pay-overlay").style.display = "none";

}


function confirmOrder() {
    basket = [];
    generateBasketCard();
    document.getElementById("pay-overlay").style.display = "none";
    document.getElementById("success-overlay").style.display = "flex";
}


function closepreise() {
    document.getElementById("success-overlay").style.display = "none";
}

function cancelOrder() {
    document.getElementById("pay-overlay").style.display = "none";
}


function toggleMobileMenu() {
    let sideMenu = document.getElementById("side-menu");
    sideMenu.classList.toggle("show-mobile");
}


function init() {
    linksNameCategory();
    categoryNameFoto();
    generateBasketCard();
}

