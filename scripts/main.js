const shippingFee = 4.99;
let baskets = []; 

function linksNameCategorygenerate() { 
  let menuCategoryEl = document.getElementById("menu-category"); 
  menuCategoryEl.innerHTML = "";//dakhele div dar index.html ro khali kon
  for (let i = 0; i < categories.length; i++) { //ba halghe be tamame anasore dakhle datenbank dastersi peyda kon
    menuCategoryEl.innerHTML += ` 
      <a href="#categoryIdNr-${i}"> 
        ${categories[i].name} 
      </a>
    `;
  }
}


function categoryNameFotoGenerate() { 
  const categoryElement = document.getElementById("category");
  categoryElement.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    categoryElement.innerHTML += `
      <div class="food-category category-full" id="categoryIdNr-${i}"> 
        <h2>${categories[i].name}</h2>
        <img src="${categories[i].image}" alt="${categories[i].name}">
      </div>
      <div class="foods" id="foodsNr${i}"></div>
    `;

    generateFoodsCards(i);
  }
}


function generateFoodsCards(index) { 
  let foodElement = document.getElementById("foodsNr" + index); 
  foodElement.innerHTML = "";
  for (let foodsIndex = 0; foodsIndex < categories[index].foods.length; foodsIndex++) { 
    let food = categories[index].foods[foodsIndex];
    foodElement.innerHTML += `
      <div class="food pizza" id="food-${index}-${foodsIndex}"> 
        <h2>${food.name}</h2><p>${food.description}</p>
        <span class="euro">${food.price.toFixed(2)}€</span>
        <div class="hero-plus-div" onclick="addToBasket(${index}, ${foodsIndex})"><button class="hero-plus-icon">+</button></div></div>
    `;
  }
}


function addToBasket(categoryIndex, foodIndex) {
  let food = categories[categoryIndex].foods[foodIndex];
   let basketIndex = -1; 
  for (let i = 0; i < baskets.length; i++) {
    if (baskets[i].name === food.name) {
      basketIndex = i; break; 
    }
  }
  if (basketIndex !== -1) {baskets[basketIndex].count++;} else {
      baskets.push({
      name: food.name,
      price: food.price,
      count: 1
    });
  }
  console.log(baskets); 
  generateBasketCard();
}


function generateBasketCard() {
  const basketFoodsEl = document.getElementById("basket-foodstuffs");      
  const basketInfoEl  = document.getElementById("basket-info");     
  const emptyBasketEl = document.getElementById("empty-basket");   
  basketFoodsEl.innerHTML = "";  
  if (baskets.length === 0) { basketInfoEl.style.display = "none"; emptyBasketEl.style.display = "flex"; return;}
  basketInfoEl.style.display = "block"; emptyBasketEl.style.display = "none"; 
  for (let i = 0; i < baskets.length; i++) { let food = baskets[i]; let totalPrice = (food.price * food.count).toFixed(2); 
   basketFoodsEl.innerHTML += `
  <div class="basket-food"><h3>${food.name}</h3>
    <div class="basket-food-info"><div class="count"><button type="button" class="btn-minus" data-index="${i}">-</button><span>${food.count}x</span><button type="button" class="btn-plus" data-index="${i}">+</button></div>
      <div class="price euro trash"><span>${totalPrice}€</span><button type="button" class="btn-delete" data-index="${i}">🗑️</button></div></div></div>
`;
  }
  generatePriceTable();
}


function increaseBasket(index) { 
  baskets[index].count++; 
  generateBasketCard();  
}


function decreaseBasket(i) { 
  console.log("VORHER:", baskets[i].count);
  if (baskets[i].count > 1) { baskets[i].count--;} 
  else { baskets.splice(i, 1);}
  generateBasketCard();   
}


function deleteFromBasket(index) { 
  baskets.splice(index, 1);        
  generateBasketCard();       
}


function generatePriceTable() {
  let subtotal = calculatePrice(baskets);
  let total = (subtotal + shippingFee).toFixed(2);
  document.getElementById("basket-total").innerHTML = `
    <tr><td>Zwischensumme</td><td class="euro">${subtotal}€</td></tr>
    <tr><td>Lieferkosten</td><td class="euro">${shippingFee}€</td></tr>
    <tr><td>Gesamt</td><td class="euro">${total}€</td></tr>
  `;
}


function calculatePrice(foods) { 
  let subtotal = 0;
  for (let i = 0; i < foods.length; i++) {   
    subtotal = subtotal + foods[i].price * foods[i].count;
  }
  return parseFloat(subtotal.toFixed(2));
}


function init() {
  linksNameCategorygenerate();    
  categoryNameFotoGenerate();    
  generateBasketCard();          
  const basketFoodsEl = document.getElementById("basket-foodstuffs"); 
  basketFoodsEl.addEventListener("click", function(e) {       
    const btn = e.target.closest("button");                 
    if (!btn) return; const index = Number(btn.dataset.index);
    if (btn.classList.contains("btn-minus")) {decreaseBasket(index);} 
      else if (btn.classList.contains("btn-plus")) {increaseBasket(index);}
      else if (btn.classList.contains("btn-delete")) {deleteFromBasket(index);}
  });
}
