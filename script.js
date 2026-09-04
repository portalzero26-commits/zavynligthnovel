const books=[
{n:1,title:"O início da jornada",price:19.90},
{n:2,title:"Novos caminhos",price:19.90},
{n:3,title:"Mistérios da floresta",price:19.90},
{n:4,title:"Um novo desafio",price:19.90},
{n:5,title:"O jogo",price:19.90},
{n:6,title:"Novos destinos",price:19.90},
{n:7,title:"A Hidra se aproxima",price:19.90},
{n:8,title:"A batalha contra a Hidra",price:19.90}
];
let cart=[];
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function renderBooks(){
document.getElementById("volumes").innerHTML=books.map(b=>`<article class="book"><div class="cover">VOLUME<br><b>${String(b.n).padStart(2,"0")}</b></div><h3>Volume ${b.n}</h3><p>${b.title}</p><strong>${money(b.price)}</strong><button onclick="addToCart(${b.n})">ADICIONAR</button></article>`).join("");
}
function addToCart(n){const b=books.find(x=>x.n===n);if(!cart.some(x=>x.n===n))cart.push(b);renderCart();}
function removeFromCart(n){cart=cart.filter(x=>x.n!==n);renderCart();}
function renderCart(){
document.getElementById("cartCount").textContent=cart.length;
const box=document.getElementById("cartItems");
if(!cart.length){box.innerHTML='<p class="empty">Seu carrinho está vazio.</p>'}
else{box.innerHTML=cart.map(b=>`<div class="cart-item"><span>Volume ${b.n} — ${b.title}</span><span>${money(b.price)} <button onclick="removeFromCart(${b.n})">×</button></span></div>`).join("")}
document.getElementById("cartTotal").textContent=money(cart.reduce((s,b)=>s+b.price,0));
}
document.getElementById("checkoutBtn").onclick=()=>alert(cart.length?"O checkout real será conectado na próxima etapa.":"Adicione pelo menos um livro ao carrinho.");
renderBooks();renderCart();
