const books = [
  {n:1, title:"O Início da Jornada", price:19.90},
  {n:2, title:"Novos Caminhos", price:19.90},
  {n:3, title:"Mistérios da Floresta", price:19.90},
  {n:4, title:"Um Novo Desafio", price:19.90},
  {n:5, title:"O Jogo", price:19.90},
  {n:6, title:"Novos Destinos", price:19.90},
  {n:7, title:"A Hidra se Aproxima", price:19.90},
  {n:8, title:"A Batalha Contra a Hidra", price:19.90}
];
let cart=[];
const money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function renderBooks(){
  document.getElementById('bookGrid').innerHTML=books.map(b=>`
    <article class="book">
      <div class="cover">VOLUME<br>${b.n}</div>
      <h3>Volume ${b.n}</h3>
      <p>${b.title}</p>
      <strong>${money(b.price)}</strong>
      <button onclick="addToCart(${b.n})">ADICIONAR AO CARRINHO</button>
    </article>`).join('');
}
function addToCart(n){const b=books.find(x=>x.n===n); if(!cart.some(x=>x.n===n)) cart.push(b); renderCart();}
function removeFromCart(n){cart=cart.filter(x=>x.n!==n);renderCart();}
function renderCart(){
  document.getElementById('cartCount').textContent=cart.length;
  const box=document.getElementById('cartItems');
  if(!cart.length){box.innerHTML='<p>Seu carrinho está vazio.</p>'}
  else box.innerHTML=cart.map(b=>`<div class="cart-item"><span>Volume ${b.n} — ${b.title}</span><span>${money(b.price)} <button onclick="removeFromCart(${b.n})">×</button></span></div>`).join('');
  document.getElementById('cartTotal').textContent=money(cart.reduce((s,b)=>s+b.price,0));
}
document.getElementById('checkoutBtn').onclick=()=>alert(cart.length?'O checkout será conectado na próxima etapa.':'Adicione pelo menos um volume ao carrinho.');
renderBooks();renderCart();
