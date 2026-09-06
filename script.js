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
const ZAVYN_API_URL="https://zavyn-api.portalzero26.workers.dev";
let selectedPayment="pix";
let currentOrderId=localStorage.getItem("zavynCurrentOrderId")||null;

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
 selectedPayment=btn.dataset.payment||"pix";
 const notice=document.getElementById("paymentNotice");
 if(notice) notice.textContent=selectedPayment==="pix" ? "PIX conectado ao Mercado Pago. O pedido será criado com o valor calculado pela Zavyn." : "Cartão será conectado na próxima etapa. Nesta versão, use PIX para testar o pagamento.";
}));

function showPaymentResult(html){
 const box=document.getElementById("paymentResult");
 if(!box)return;
 box.innerHTML=html;
 box.classList.add("visible");
 box.scrollIntoView({behavior:"smooth",block:"center"});
}

function closePaymentResult(){
 const box=document.getElementById("paymentResult");
 if(box){box.classList.remove("visible");box.innerHTML="";}
 localStorage.removeItem("zavynCurrentOrderId");
 currentOrderId=null;
}

async function createPixPayment(){
 if(!cart.length){alert("Seu carrinho está vazio.");return;}
 const name=document.getElementById("customerName").value.trim();
 const email=document.getElementById("customerEmail").value.trim();
 if(!name || !email){alert("Preencha seu nome e seu e-mail.");return;}
 if(!/^\S+@\S+\.\S+$/.test(email)){alert("Digite um e-mail válido.");return;}

 const submit=document.querySelector(".checkout-submit");
 const original=submit.textContent;
 submit.disabled=true;
 submit.textContent="CRIANDO PIX...";
 closePaymentResult();

 try{
   const response=await fetch(`${ZAVYN_API_URL}/create-order`,{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify({
       name,
       email,
       totalAmount:cartTotal(),
       items:cart.map(b=>({n:b.n,qty:b.qty}))
     })
   });
   const data=await response.json();
   if(!response.ok || !data.ok){
     throw new Error(data.error || "Não foi possível criar o PIX.");
   }

   const order=data.order||{};
   currentOrderId=order.id||null;
   if(currentOrderId) localStorage.setItem("zavynCurrentOrderId",currentOrderId);
   const payment=order.transactions?.payments?.[0]||{};
   const method=payment.payment_method||{};
   const qr=method.qr_code_base64||"";
   const code=method.qr_code||"";
   const ticket=method.ticket_url||"";

   showPaymentResult(`
     <div class="payment-result-head"><span class="payment-status-dot"></span><div><strong>PIX criado com sucesso</strong><small>Pedido ${order.id||""}</small></div></div>
     <p class="payment-result-total">Total: <strong>${money(data.calculatedTotal||cartTotal())}</strong></p>
     ${qr?`<div class="pix-qr-wrap"><img src="data:image/png;base64,${qr}" alt="QR Code PIX para pagamento"></div>`:""}
     ${code?`<label class="pix-code-label">PIX copia e cola<input id="pixCode" readonly value="${code.replace(/"/g,"&quot;")}"></label><button type="button" class="button secondary-action" id="copyPixBtn">COPIAR CÓDIGO PIX</button>`:""}
     <div class="payment-result-actions">
       <button type="button" class="button" id="checkPaymentBtn">VERIFICAR PAGAMENTO</button>
       ${ticket?`<a class="payment-ticket" href="${ticket}" target="_blank" rel="noopener">ABRIR PIX</a>`:""}
     </div>
     <p class="payment-help">No ambiente de teste, o Mercado Pago pode aprovar este pedido automaticamente.</p>
   `);

   const copyBtn=document.getElementById("copyPixBtn");
   if(copyBtn) copyBtn.onclick=async()=>{
     try{await navigator.clipboard.writeText(code);copyBtn.textContent="CÓDIGO COPIADO ✓";}catch{alert("Não foi possível copiar automaticamente. Selecione o código e copie.");}
   };
   const checkBtn=document.getElementById("checkPaymentBtn");
   if(checkBtn) checkBtn.onclick=checkCurrentPayment;
 }catch(error){
   showPaymentResult(`<div class="payment-error"><strong>Não foi possível criar o PIX.</strong><p>${error.message}</p><button type="button" class="button" onclick="closePaymentResult()">FECHAR</button></div>`);
 }finally{
   submit.disabled=false;
   submit.textContent=original;
 }
}

async function checkCurrentPayment(){
 // Recupera o ID também do localStorage, evitando perder o pedido por atualização/re-renderização da página.
 currentOrderId=currentOrderId||localStorage.getItem("zavynCurrentOrderId")||null;
 if(!currentOrderId){alert("Nenhum pedido ativo para consultar.");return;}
 const btn=document.getElementById("checkPaymentBtn");
 if(btn){btn.disabled=true;btn.textContent="VERIFICANDO...";}
 try{
   const response=await fetch(`${ZAVYN_API_URL}/check-order?id=${encodeURIComponent(currentOrderId)}`);
   const data=await response.json();
   const order=data.order||{};
   if(order.id){
     currentOrderId=order.id;
     localStorage.setItem("zavynCurrentOrderId",currentOrderId);
   }
   const payment=order.transactions?.payments?.[0]||{};
   const approved=payment.status==="processed" && payment.status_detail==="accredited";
   if(approved){
     cart=[];
     saveCart();
     localStorage.removeItem("zavynCurrentOrderId");
     renderCart();
     renderCheckout();
     showPaymentResult(`<div class="payment-success"><div class="success-icon">✓</div><strong>Pagamento aprovado!</strong><p>O Mercado Pago confirmou o pagamento do pedido.</p><p class="success-note">Próxima etapa do projeto: liberar automaticamente o e-book após a confirmação.</p><button type="button" class="button" onclick="closePaymentResult()">CONTINUAR</button></div>`);
   }else{
     showPaymentResult(`<div class="payment-waiting"><strong>Pagamento ainda não confirmado.</strong><p>Status atual: <b>${payment.status||order.status||"aguardando"}</b> · ${payment.status_detail||order.status_detail||"waiting_transfer"}</p><button type="button" class="button" id="checkPaymentBtn">VERIFICAR NOVAMENTE</button></div>`);
     document.getElementById("checkPaymentBtn").onclick=checkCurrentPayment;
   }
 }catch(error){
   alert("Não foi possível consultar o pagamento agora.");
 }finally{
   const b=document.getElementById("checkPaymentBtn");
   if(b){b.disabled=false;}
 }
}

document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();
 if(selectedPayment!=="pix"){alert("O pagamento por cartão será integrado na próxima etapa. Por enquanto, selecione PIX para testar o checkout.");return;}
 createPixPayment();
});

document.getElementById("backToCartBtn").onclick=()=>{
 document.getElementById("carrinho").scrollIntoView({behavior:"smooth",block:"start"});
};
