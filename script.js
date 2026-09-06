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

let cart=[];
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

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
 document.getElementById("modalAdd").onclick=()=>{addToCart(b.n);closeBookModal();document.getElementById("carrinho").scrollIntoView({behavior:"smooth"});};
 const modal=document.getElementById("bookModal"); modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open");
}
function closeBookModal(){const modal=document.getElementById("bookModal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBookModal();});

function addToCart(n){
 const b=books.find(x=>x.n===n);
 if(!cart.some(x=>x.n===n))cart.push(b);
 renderCart();
}
function removeFromCart(n){cart=cart.filter(x=>x.n!==n);renderCart();}
function renderCart(){
 document.getElementById("cartCount").textContent=cart.length;
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<p class="empty">Seu carrinho está vazio.</p>';}
 else box.innerHTML=cart.map(b=>`<div class="cart-item"><span>Volume ${b.n} — ${b.title}</span><span>${money(b.price)} <button onclick="removeFromCart(${b.n})" aria-label="Remover">×</button></span></div>`).join("");
 document.getElementById("cartTotal").textContent=money(cart.reduce((s,b)=>s+b.price,0));
}

document.getElementById("checkoutBtn").onclick=()=>alert(cart.length?"O checkout real será conectado na próxima etapa.":"Adicione pelo menos um livro ao carrinho.");
renderBooks();renderCart();

const searchInput=document.getElementById("bookSearch");
if(searchInput){searchInput.addEventListener("input",()=>{
 const q=searchInput.value.trim().toLowerCase();
 const filtered=books.filter(b=>`volume ${b.n} ${b.title} reincarnation in another world next level`.includes(q));
 renderBooks(filtered);
});}
