// EDITE A LISTA ABAIXO: troque nomes, descrições, preços e categorias pelos itens reais do seu cardápio.
const WHATSAPP = "5599984531798";
const products = [
  {id:1,name:"Combinado Hot",category:"Combinados",description:"Seleção de peças hot crocantes. Informe a quantidade no nome do produto.",price:0,emoji:"🍣"},
  {id:2,name:"Combinado Misto",category:"Combinados",description:"Uma combinação de sabores para aproveitar cada peça.",price:0,emoji:"🍱"},
  {id:3,name:"Combinado de Niguiri",category:"Combinados",description:"10 peças de niguiri. Consulte os sabores disponíveis.",price:0,emoji:"🍣"},
  {id:4,name:"Temaki Hot",category:"Temakis",description:"Temaki empanado e preparado na hora.",price:0,emoji:"🌮"},
  {id:5,name:"Temaki Cru",category:"Temakis",description:"Temaki com ingredientes frescos. Consulte opções.",price:0,emoji:"🍙"},
  {id:6,name:"Copo Sushi",category:"Especiais",description:"Uma forma prática e deliciosa de comer sushi.",price:0,emoji:"🥢"},
  {id:7,name:"Camarão Recheado",category:"Empanados",description:"Camarão empanado recheado com cream cheese.",price:0,emoji:"🍤"},
  {id:8,name:"Patinha de Caranguejo",category:"Empanados",description:"Patinha de caranguejo empanada e crocante.",price:0,emoji:"🦀"},
  {id:9,name:"Soda Italiana 400 ml",category:"Bebidas",description:"Soda italiana tradicional. Consulte os sabores.",price:0,emoji:"🥤"}
];
let cart = [];
let activeCategory = "Todos";
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const categories = ["Todos",...new Set(products.map(p=>p.category))];

function renderCategories(){
  document.getElementById("categories").innerHTML = categories.map(c=>`<button class="category ${c===activeCategory?'active':''}" data-category="${c}">${c}</button>`).join("");
  document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.category;renderCategories();renderProducts()}));
}
function renderProducts(){
  const shown = products.filter(p=>activeCategory==="Todos"||p.category===activeCategory);
  document.getElementById("products").innerHTML = shown.map(p=>`
    <article class="product"><div class="product-visual">${p.emoji}</div><div class="product-info">
      <h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom">
      <span class="price">${p.price>0?money(p.price):"Consulte o valor"}</span>
      <button class="add" data-add="${p.id}">Adicionar +</button></div></div></article>`).join("");
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.add))));
}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});renderCart();document.getElementById("pedido").scrollIntoView({behavior:"smooth",block:"start"});}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById("cart-count").textContent=count;
  document.getElementById("cart-total").textContent=money(total);
  document.getElementById("cart-items").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><span>${x.qty} × ${x.name}</span><span>${x.price>0?money(x.price*x.qty):"A confirmar"} <button data-remove="${x.id}" aria-label="Remover ${x.name}">×</button></span></div>`).join(""):'<p class="empty">Seu carrinho ainda está vazio.</p>';
  document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(x=>x.id!==Number(b.dataset.remove));renderCart()}));
}
document.getElementById("send-order").addEventListener("click",()=>{
  if(!cart.length){alert("Adicione pelo menos um produto ao seu pedido.");return;}
  const name=document.getElementById("customer-name").value.trim();
  const address=document.getElementById("customer-address").value.trim();
  const notes=document.getElementById("customer-notes").value.trim();
  if(!name||!address){alert("Preencha seu nome e endereço para continuar.");return;}
  const lines=cart.map(x=>`• ${x.qty}x ${x.name} — ${x.price>0?money(x.price*x.qty):"valor a confirmar"}`);
  const total=cart.every(x=>x.price>0)?money(cart.reduce((s,x)=>s+x.price*x.qty,0)):"A confirmar";
  const msg=`Olá, Gishimai! Quero fazer um pedido:\n\n${lines.join("\n")}\n\nTotal: ${total}\n\nNome: ${name}\nEndereço: ${address}\n${notes?`Observações: ${notes}\n`:""}\nAguardo a confirmação.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderCategories();renderProducts();renderCart();
