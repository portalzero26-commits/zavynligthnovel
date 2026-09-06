const books=[
{n:1,title:"O início da jornada",price:19.90,image:"covers/volume-1.webp",tag:"Volume 01"},
{n:2,title:"Novos caminhos",price:19.90,image:"covers/volume-2.webp",tag:"Volume 02"},
{n:3,title:"Mistérios da floresta",price:19.90,image:"covers/volume-3.webp",tag:"Volume 03"},
{n:4,title:"Um novo desafio",price:19.90,image:"covers/volume-4.webp",tag:"Volume 04"},
{n:5,title:"O jogo",price:19.90,image:"covers/volume-5.webp",tag:"Volume 05"},
{n:6,title:"Novos destinos",price:19.90,image:"covers/volume-6.webp",tag:"Volume 06"},
{n:7,title:"A Hidra se aproxima",price:19.90,image:"covers/volume-7.webp",tag:"Volume 07"},
{n:8,title:"A batalha contra a Hidra",price:19.90,image:"covers/volume-8.png",tag:"Volume 08"}
];

let cart=[];
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function renderBooks(){
  document.getElementById("volumes").innerHTML=books.map(b=>`
  <article class="book">
    <div class="cover-image-wrap">
      <img class="book-cover" src="${b.image}" alt="Capa do Volume ${b.n} — Reincarnation in Another World: Next Level" loading="lazy">
      <span class="cover-number">${String(b.n).padStart(2,"0")}</span>
    </div>
    <div class="book-meta"><span>${b.tag}</span><strong>${money(b.price)}</strong></div>
    <h3>${b.title}</h3>
    <p class="book-series">Reincarnation in Another World: Next Level</p>
    <div class="book-actions">
      <button class="details-button" onclick="openBook(${b.n})">VER DETALHES</button>
      <button class="add-button" onclick="addToCart(${b.n})">ADICIONAR</button>
    </div>
  </article>`).join("");
}

function openBook(n){
  const b=books.find(x=>x.n===n);
  if(!b)return;
  document.getElementById("modalContent").innerHTML=`
    <div class="modal-cover"><img src="${b.image}" alt="Capa do Volume ${b.n}"></div>
    <div class="modal-info">
      <p class="eyebrow">${b.tag}</p>
      <h2>${b.title}</h2>
      <p class="modal-series">Reincarnation in Another World: Next Level</p>
      <div class="detail-divider"></div>
      <p class="modal-description">Esta é a página de apresentação do Volume ${b.n}. A sinopse completa poderá ser adicionada aqui com o texto oficial da obra.</p>
      <div class="book-facts"><span>FORMATO<strong>E-book</strong></span><span>SÉRIE<strong>Next Level</strong></span></div>
      <div class="modal-buy"><strong>${money(b.price)}</strong><button class="button" onclick="addToCart(${b.n});closeBook();document.getElementById('carrinho').scrollIntoView({behavior:'smooth'})">ADICIONAR À SACOLA</button></div>
    </div>`;
  document.getElementById("bookModal").classList.add("open");
  document.body.classList.add("modal-open");
}

function closeBook(){
  document.getElementById("bookModal").classList.remove("open");
  document.body.classList.remove("modal-open");
}

function addToCart(n){
  const b=books.find(x=>x.n===n);
  if(!b)return;
  if(!cart.some(x=>x.n===n))cart.push(b);
  renderCart();
}

function removeFromCart(n){
  cart=cart.filter(x=>x.n!==n);
  renderCart();
}

function renderCart(){
  document.getElementById("cartCount").textContent=cart.length;
  const box=document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML='<p class="empty">Sua sacola está vazia.</p>';
  }else{
    box.innerHTML=cart.map(b=>`
    <div class="cart-item">
      <div><small>VOLUME ${String(b.n).padStart(2,"0")}</small><span>${b.title}</span></div>
      <div><strong>${money(b.price)}</strong><button onclick="removeFromCart(${b.n})" aria-label="Remover Volume ${b.n}">×</button></div>
    </div>`).join("");
  }
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,b)=>s+b.price,0));
}

document.getElementById("checkoutBtn").onclick=()=>alert(
  cart.length
  ?"O checkout real será conectado na próxima etapa."
  :"Adicione pelo menos um livro à sacola."
);

document.getElementById("closeModal").onclick=closeBook;
document.getElementById("bookModal").addEventListener("click",e=>{if(e.target.id==="bookModal")closeBook()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBook()});

renderBooks();
renderCart();
