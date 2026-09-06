const books=[
{n:1,title:"O início da jornada",price:19.90,image:"covers/volume-1.webp",description:"A primeira etapa de uma aventura em outro mundo. Conheça o começo da jornada e os desafios que dão forma a essa nova história."},
{n:2,title:"Novos caminhos",price:19.90,image:"covers/volume-2.webp",description:"A jornada avança e novas possibilidades surgem pelo caminho. Um volume para quem quer descobrir o que existe além do primeiro passo."},
{n:3,title:"Mistérios da floresta",price:19.90,image:"covers/volume-3.webp",description:"Uma nova região traz perguntas, perigos e mistérios. A aventura se aprofunda enquanto o grupo segue em frente."},
{n:4,title:"Um novo desafio",price:19.90,image:"covers/volume-4.webp",description:"Novos obstáculos colocam os protagonistas à prova. A jornada ganha escala e cada escolha passa a ter mais peso."},
{n:5,title:"O jogo",price:19.90,image:"covers/volume-5.webp",description:"Estratégia, tensão e decisões entram em cena. Um capítulo marcante da série, onde cada movimento pode mudar o rumo da história."},
{n:6,title:"Novos destinos",price:19.90,image:"covers/volume-6.webp",description:"A história abre novos horizontes e conduz os personagens para destinos ainda desconhecidos."},
{n:7,title:"A Hidra se aproxima",price:19.90,image:"covers/volume-7.webp",description:"A ameaça da Hidra se torna cada vez mais próxima. O clima muda e a batalha que se aproxima promete ser decisiva."},
{n:8,title:"A batalha contra a Hidra",price:19.90,image:"covers/volume-8.png",description:"O confronto contra a Hidra chega ao centro da história. Um volume de batalha, tensão e grandes consequências para a jornada."}
];

let cart=JSON.parse(localStorage.getItem("zavynCart")||"[]").map(item=>books.find(b=>b.n===item.n)?{...books.find(b=>b.n===item.n),qty:item.qty||1}:null).filter(Boolean);
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function saveCart(){localStorage.setItem("zavynCart",JSON.stringify(cart.map(b=>({n:b.n,qty:b.qty}))));}
function cartCount(){return cart.reduce((sum,b)=>sum+b.qty,0);}
function cartTotal(){return cart.reduce((sum,b)=>sum+b.price*b.qty,0);}

function renderBooks(list=books){
 document.getElementById("volumes").innerHTML=list.map(b=>`
 <article class="book">
   <button class="book-cover-button" onclick="openBookModal(${b.n})" aria-label="Ver detalhes do Volume ${b.n}">
     <div class="cover-image-wrap"><img class="book-cover" src="${b.image}" alt="Capa do Volume ${b.n} — Reincarnation in Another World: Next Level" loading="lazy"></div>
   </button>
   <div class="book-meta"><span>VOLUME ${b.n}</span><strong>${money(b.price)}</strong></div>
   <h3>${b.title}</h3>
   <p>${b.description}</p>
   <div class="book-actions"><button class="details-button" onclick="openBookModal(${b.n})">VER DETALHES</button><button class="add-button" onclick="addToCart(${b.n})">ADICIONAR</button></div>
 </article>`).join("");
}

function openBookModal(n){
 const b=books.find(x=>x.n===n); if(!b)return;
 document.getElementById("modalCover").src=b.image;
 document.getElementById("modalCover").alt=`Capa do Volume ${b.n}`;
 document.getElementById("modalTitle").textContent=b.title;
 document.getElementById("modalVolume").textContent=`Volume ${b.n} • Reincarnation in Another World: Next Level`;
 document.getElementById("modalDescription").textContent=b.description;
 document.getElementById("modalPrice").textContent=money(b.price);
 document.getElementById("modalAdd").onclick=()=>{addToCart(b.n);closeBookModal();openCart();};
 const modal=document.getElementById("bookModal"); modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open");
}
function closeBookModal(){const modal=document.getElementById("bookModal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeBookModal();closeCart();}});

function addToCart(n){
 const b=books.find(x=>x.n===n); if(!b)return;
 const existing=cart.find(x=>x.n===n);
 if(existing) existing.qty+=1; else cart.push({...b,qty:1});
 saveCart(); renderCart(); openCart();
}
function changeQty(n,delta){
 const item=cart.find(x=>x.n===n); if(!item)return;
 item.qty+=delta;
 if(item.qty<=0) cart=cart.filter(x=>x.n!==n);
 saveCart(); renderCart();
}
function removeFromCart(n){cart=cart.filter(x=>x.n!==n);saveCart();renderCart();}

function cartItemMarkup(b){return `<div class="cart-item drawer-cart-item">
  <img src="${b.image}" alt="Capa do Volume ${b.n}">
  <div class="drawer-item-info"><strong>Volume ${b.n}</strong><span>${b.title}</span><small>${money(b.price)} cada</small>
    <div class="qty-controls"><button type="button" onclick="changeQty(${b.n},-1)" aria-label="Diminuir quantidade">−</button><b>${b.qty}</b><button type="button" onclick="changeQty(${b.n},1)" aria-label="Aumentar quantidade">+</button><button class="remove-link" type="button" onclick="removeFromCart(${b.n})">Remover</button></div>
  </div>
  <strong class="item-subtotal">${money(b.price*b.qty)}</strong>
</div>`}

function renderCart(){
 const count=cartCount();
 document.getElementById("cartCount").textContent=count;
 const html=cart.length?cart.map(cartItemMarkup).join(""): '<p class="empty">Seu carrinho está vazio.</p>';
 document.getElementById("cartItems").innerHTML=html;
 document.getElementById("cartTotal").textContent=money(cartTotal());
 document.getElementById("drawerItems").innerHTML=html;
 document.getElementById("drawerTotal").textContent=money(cartTotal());
}

function openCart(){const d=document.getElementById("cartDrawer");d.classList.add("open");d.setAttribute("aria-hidden","false");}
function closeCart(){const d=document.getElementById("cartDrawer");if(!d)return;d.classList.remove("open");d.setAttribute("aria-hidden","true");}

document.getElementById("openCartBtn").onclick=openCart;
document.getElementById("closeCartBtn").onclick=closeCart;
document.getElementById("closeCartBackdrop").onclick=closeCart;

function openCheckout(){
 if(!cart.length){alert("Adicione pelo menos um livro ao carrinho.");return;}
 closeCart();
 renderCheckout();
 document.getElementById("checkout").classList.add("checkout-active");
 document.getElementById("checkout").scrollIntoView({behavior:"smooth",block:"start"});
}

document.getElementById("drawerCheckoutBtn").onclick=openCheckout;
document.getElementById("checkoutBtn").onclick=openCheckout;

renderBooks();renderCart();

const searchInput=document.getElementById("bookSearch");
if(searchInput){searchInput.addEventListener("input",()=>{
 const q=searchInput.value.trim().toLowerCase();
 const filtered=books.filter(b=>`volume ${b.n} ${b.title} reincarnation in another world next level`.includes(q));
 renderBooks(filtered);
});}

function renderCheckout(){
 const container=document.getElementById("checkoutItems");
 if(!container)return;
 container.innerHTML=cart.length ? cart.map(b=>`<div class="summary-item"><span>V${b.n} · ${b.title} <b>× ${b.qty}</b></span><strong>${money(b.price*b.qty)}</strong></div>`).join("") : '<p class="empty">Seu carrinho está vazio.</p>';
 document.getElementById("checkoutSubtotal").textContent=money(cartTotal());
 document.getElementById("checkoutTotal").textContent=money(cartTotal());
}

document.querySelectorAll(".payment-option").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".payment-option").forEach(b=>b.classList.remove("selected"));
 btn.classList.add("selected");
}));

document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();
 if(!cart.length){alert("Seu carrinho está vazio.");return;}
 const name=document.getElementById("customerName").value.trim();
 const email=document.getElementById("customerEmail").value.trim();
 if(!name || !email){return;}
 alert("Checkout preparado! O próximo passo é conectar o pagamento real da Zavyn. Nenhuma cobrança foi realizada.");
});

document.getElementById("backToCartBtn").onclick=()=>{
 document.getElementById("carrinho").scrollIntoView({behavior:"smooth",block:"start"});
};
