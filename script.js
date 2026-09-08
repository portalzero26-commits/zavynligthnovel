const books=[
{n:1,title:"O início da jornada",price:5.00,image:"covers/volume-1.webp",description:"A primeira etapa de uma aventura em outro mundo. Conheça o começo da jornada e os desafios que dão forma a essa nova história."},
{n:2,title:"Novos caminhos",price:5.00,image:"covers/volume-2.webp",description:"A jornada avança e novas possibilidades surgem pelo caminho. Um volume para quem quer descobrir o que existe além do primeiro passo."},
{n:3,title:"Mistérios da floresta",price:5.00,image:"covers/volume-3.webp",description:"Uma nova região traz perguntas, perigos e mistérios. A aventura se aprofunda enquanto o grupo segue em frente."},
{n:4,title:"Um novo desafio",price:5.00,image:"covers/volume-4.webp",description:"Novos obstáculos colocam os protagonistas à prova. A jornada ganha escala e cada escolha passa a ter mais peso."},
{n:5,title:"O jogo",price:5.00,image:"covers/volume-5.webp",description:"Estratégia, tensão e decisões entram em cena. Um capítulo marcante da série, onde cada movimento pode mudar o rumo da história."},
{n:6,title:"Novos destinos",price:5.00,image:"covers/volume-6.webp",description:"A história abre novos horizontes e conduz os personagens para destinos ainda desconhecidos."},
{n:7,title:"A Hidra se aproxima",price:5.00,image:"covers/volume-7.webp",description:"A ameaça da Hidra se torna cada vez mais próxima. O clima muda e a batalha que se aproxima promete ser decisiva."},
{n:8,title:"A batalha contra a Hidra",price:5.00,image:"covers/volume-8.png",description:"O confronto contra a Hidra chega ao centro da história. Um volume de batalha, tensão e grandes consequências para a jornada."}
];

let cart=JSON.parse(localStorage.getItem("zavynCart")||"[]").map(item=>books.find(b=>b.n===item.n)?{...books.find(b=>b.n===item.n),qty:item.qty||1}:null).filter(Boolean);
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const ZAVYN_API_URL="https://zavyn-api.portalzero26.workers.dev";
let selectedPayment="pix";
let currentOrderId=localStorage.getItem("zavynCurrentOrderId")||null;
let currentOrderExternalReference=localStorage.getItem("zavynCurrentOrderExternalReference")||null;

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
const userSearchModal=document.getElementById("userSearchModal");
const userSearchModalInput=document.getElementById("userSearchModalInput");
const userSearchResults=document.getElementById("userSearchResults");
let publicProfileModal=document.getElementById("publicProfileModal");
let publicProfileContent=document.getElementById("publicProfileContent");

function ensurePublicProfileModal(){
 if(publicProfileModal && publicProfileContent) return true;

 const modal=document.createElement("div");
 modal.id="publicProfileModal";
 modal.className="public-profile-modal";
 modal.setAttribute("aria-hidden","true");
 modal.innerHTML=`
   <div class="public-profile-backdrop" id="closePublicProfileBackdrop"></div>
   <section class="public-profile-card" role="dialog" aria-modal="true">
     <button class="modal-close" id="closePublicProfileBtn" type="button" aria-label="Fechar">×</button>
     <div id="publicProfileContent"></div>
   </section>
 `;
 document.body.appendChild(modal);

 publicProfileModal=modal;
 publicProfileContent=modal.querySelector("#publicProfileContent");

 document.getElementById("closePublicProfileBtn")?.addEventListener("click",closePublicProfile);
 document.getElementById("closePublicProfileBackdrop")?.addEventListener("click",closePublicProfile);
 return true;
}

function openUserSearch(){
 if(!userSearchModal)return;
 userSearchModal.classList.add("open");
 userSearchModal.setAttribute("aria-hidden","false");
 document.body.classList.add("modal-open");
 if(userSearchModalInput){
   userSearchModalInput.value=searchInput?.value?.trim()||"";
   setTimeout(()=>userSearchModalInput.focus(),40);
   if(userSearchModalInput.value) searchUsers(userSearchModalInput.value);
   else if(userSearchResults) userSearchResults.innerHTML='<p class="user-search-empty">Digite para começar a buscar.</p>';
 }
}

function closeUserSearch(){
 if(!userSearchModal)return;
 userSearchModal.classList.remove("open");
 userSearchModal.setAttribute("aria-hidden","true");
 if(!publicProfileModal?.classList.contains("open")) document.body.classList.remove("modal-open");
}

function closePublicProfile(){
 if(!publicProfileModal)return;
 publicProfileModal.classList.remove("open");
 publicProfileModal.setAttribute("aria-hidden","true");
 if(!userSearchModal?.classList.contains("open")) document.body.classList.remove("modal-open");
}

function escapeHtml(value){
 return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}

function userInitial(user){
 return (String(user?.name||user?.username||"Z").trim().charAt(0).toUpperCase()||"Z");
}

function avatarMarkup(user, className="user-result-avatar"){
 const avatar=user?.avatar_url||"";
 if(avatar) return `<span class="${className} has-avatar" style="background-image:url(${JSON.stringify(avatar)})"></span>`;
 return `<span class="${className}">${escapeHtml(userInitial(user))}</span>`;
}

function renderUserResults(users, query){
 if(!userSearchResults)return;
 if(!users.length){
   userSearchResults.innerHTML=`<p class="user-search-empty">Nenhum usuário encontrado para <strong>${escapeHtml(query)}</strong>.</p>`;
   return;
 }
 userSearchResults.innerHTML=users.map(user=>`
   <button type="button" class="user-result" data-username="${escapeHtml(user.username)}">
     ${avatarMarkup(user)}
     <span class="user-result-info">
       <strong>${escapeHtml(user.name||"Usuário")}</strong>
       <small>@${escapeHtml(user.username)}</small>
     </span>
     <span class="user-result-arrow">→</span>
   </button>
 `).join("");
 userSearchResults.querySelectorAll(".user-result").forEach(btn=>{
   btn.addEventListener("click",()=>openPublicProfile(btn.dataset.username));
 });
}

let userSearchTimer=null;
async function searchUsers(query){
 const q=String(query||"").trim();
 if(!userSearchResults)return;
 if(q.length<2){
   userSearchResults.innerHTML='<p class="user-search-empty">Digite pelo menos 2 caracteres.</p>';
   return;
 }
 userSearchResults.innerHTML='<p class="user-search-loading">Procurando usuários...</p>';
 try{
   const token=localStorage.getItem("zavynAuthToken")||"";
   if(!token){
     userSearchResults.innerHTML='<p class="user-search-empty error">Faça login para buscar usuários.</p>';
     return;
   }
   const response=await fetch(`${ZAVYN_API_URL}/users/search?q=${encodeURIComponent(q)}`,{
     method:"GET",
     headers:{
       Authorization:`Bearer ${token}`,
       Accept:"application/json"
     }
   });
   const data=await response.json();
   if(!response.ok||!data.ok) throw new Error(data.error||"Não foi possível buscar usuários.");
   renderUserResults(Array.isArray(data.users)?data.users:[],q);
 }catch(error){
   userSearchResults.innerHTML=`<p class="user-search-empty error">${escapeHtml(error.message||"Erro ao buscar usuários.")}</p>`;
 }
}

function scheduleUserSearch(value){
 clearTimeout(userSearchTimer);
 userSearchTimer=setTimeout(()=>searchUsers(value),220);
}

async function openPublicProfile(username){
 if(!ensurePublicProfileModal()) return;

 // Fecha a busca antes de abrir o perfil para evitar dois overlays competindo.
 closeUserSearch();

 publicProfileModal.classList.add("open");
 publicProfileModal.setAttribute("aria-hidden","false");
 document.body.classList.add("modal-open");
 publicProfileContent.innerHTML='<p class="user-search-loading">Carregando perfil...</p>';
 try{
   const token=localStorage.getItem("zavynAuthToken")||"";
   if(!token){
     throw new Error("Faça login para visualizar perfis públicos.");
   }
   const response=await fetch(`${ZAVYN_API_URL}/public-profile?username=${encodeURIComponent(username)}`,{
     method:"GET",
     headers:{
       Authorization:`Bearer ${token}`,
       Accept:"application/json"
     }
   });
   const data=await response.json();
   if(!response.ok||!data.ok) throw new Error(data.error||"Não foi possível carregar o perfil.");
   renderPublicProfile(data);
 }catch(error){
   publicProfileContent.innerHTML=`<div class="public-profile-error"><p>${escapeHtml(error.message||"Erro ao carregar o perfil.")}</p><button type="button" class="outline-button" onclick="closePublicProfile()">FECHAR</button></div>`;
 }
}

function renderPublicProfile(data){
 const user=data.user||{};
 const followers=Number(data.followers||0);
 const following=Number(data.following||0);
 const mural=Array.isArray(data.mural)?data.mural:[];
 const isSelf=Boolean(data.isSelf);
 const followingUser=Boolean(data.isFollowing);
 const buttonHtml=isSelf
   ? '<span class="public-profile-own">Este é o seu perfil</span>'
   : `<button type="button" class="public-follow-btn ${followingUser?"following":""}" id="publicFollowBtn" data-username="${escapeHtml(user.username)}">${followingUser?"✓ Seguindo":"＋ Seguir"}</button>`;
 const avatar=user.avatar_url
   ? `<div class="public-profile-avatar has-avatar" style="background-image:url(${JSON.stringify(user.avatar_url)})"></div>`
   : `<div class="public-profile-avatar">${escapeHtml(userInitial(user))}</div>`;
 const muralHtml=[1,2,3].map(slot=>{
   const has=mural.some(item=>Number(item.slot)===slot);
   return has
     ? `<div class="public-mural-slot has-image"><img src="${ZAVYN_API_URL}/public-mural-image?username=${encodeURIComponent(user.username)}&slot=${slot}" alt="Foto ${slot} do mural de @${escapeHtml(user.username)}" loading="lazy"></div>`
     : `<div class="public-mural-slot empty"><span>＋</span></div>`;
 }).join("");
 publicProfileContent.innerHTML=`
   <div class="public-profile-top">
     ${avatar}
     <div class="public-profile-main">
       <p class="eyebrow gold">PERFIL ZAVYN</p>
       <h2 id="publicProfileName">${escapeHtml(user.name||"Usuário")}</h2>
       <p class="public-profile-handle">@${escapeHtml(user.username||"usuario")}</p>
       <p class="public-profile-bio">${escapeHtml(user.bio||"Este usuário ainda não adicionou uma bio.")}</p>
       <div class="public-profile-stats">
         <div><strong>${followers}</strong><span>Seguidores</span></div>
         <div><strong>${following}</strong><span>Seguindo</span></div>
       </div>
       <div class="public-profile-action">${buttonHtml}</div>
     </div>
   </div>
   <div class="public-profile-divider"></div>
   <div class="public-profile-mural">
     <div class="public-profile-section-title"><h3>Mural</h3><span>Até 3 fotos</span></div>
     <div class="public-mural-grid">${muralHtml}</div>
   </div>
   <div class="public-profile-books">
     <div class="public-profile-section-title"><h3>Livros publicados</h3></div>
     <p>Este espaço ficará disponível quando a publicação de autores for liberada.</p>
   </div>
 `;
 const followBtn=document.getElementById("publicFollowBtn");
 if(followBtn){
   followBtn.addEventListener("click",()=>togglePublicFollow(followBtn,user.username));
 }
}

async function togglePublicFollow(button,username){
 const token=localStorage.getItem("zavynAuthToken")||"";
 if(!token){
   window.location.href="login.html";
   return;
 }
 const original=button.textContent;
 button.disabled=true;
 button.textContent="...";
 try{
   const response=await fetch(`${ZAVYN_API_URL}/follow`,{
     method:"POST",
     headers:{
       Authorization:`Bearer ${token}`,
       "Content-Type":"application/json",
       Accept:"application/json"
     },
     body:JSON.stringify({username})
   });
   const data=await response.json();
   if(!response.ok||!data.ok) throw new Error(data.error||"Não foi possível seguir este usuário.");
   button.classList.add("following");
   button.textContent="✓ Seguindo";
   const countEl=publicProfileContent.querySelector(".public-profile-stats div:first-child strong");
   if(countEl && Number.isFinite(Number(data.followers))) countEl.textContent=String(data.followers);
 }catch(error){
   button.textContent=original;
   alert(error.message||"Não foi possível seguir este usuário.");
 }finally{
   button.disabled=false;
 }
}

if(searchInput){
 searchInput.readOnly=true;
 searchInput.addEventListener("focus",openUserSearch);
 searchInput.addEventListener("click",openUserSearch);
 searchInput.addEventListener("input",openUserSearch);
}
document.getElementById("closeUserSearchBtn")?.addEventListener("click",closeUserSearch);
document.getElementById("closeUserSearchBackdrop")?.addEventListener("click",closeUserSearch);
ensurePublicProfileModal();
userSearchModalInput?.addEventListener("input",e=>{
 if(searchInput) searchInput.value=e.target.value;
 scheduleUserSearch(e.target.value);
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){
   if(publicProfileModal?.classList.contains("open")) closePublicProfile();
   else if(userSearchModal?.classList.contains("open")) closeUserSearch();
 }
});

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
 localStorage.removeItem("zavynCurrentOrderExternalReference");
 currentOrderId=null;
 currentOrderExternalReference=null;
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
       totalAmount:cartTotal().toFixed(2),
       items:cart.map(b=>({n:b.n,qty:b.qty}))
     })
   });
   const data=await response.json();
   if(!response.ok || !data.ok){
     throw new Error(data.error || "Não foi possível criar o PIX.");
   }

   const order=data.order||{};
   currentOrderId=order.id||null;
   currentOrderExternalReference=order.external_reference||data.externalReference||null;
   if(currentOrderId) localStorage.setItem("zavynCurrentOrderId",currentOrderId);
   if(currentOrderExternalReference) localStorage.setItem("zavynCurrentOrderExternalReference",currentOrderExternalReference);
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
     <p class="payment-help">Pagamento em ambiente de produção. Após pagar o PIX, use “VERIFICAR PAGAMENTO” para confirmar a aprovação.</p>
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

function getPurchasedVolumesFromReference(externalReference){
 const volumes=[];
 if(!externalReference)return volumes;
 const parts=String(externalReference).split("_");
 for(const part of parts){
   const match=part.match(/^v([1-8])x(\d+)$/);
   if(match){
     const volume=Number(match[1]);
     const quantity=Number(match[2]);
     if(Number.isInteger(volume)&&volume>=1&&volume<=8&&Number.isInteger(quantity)&&quantity>0){
       volumes.push(volume);
     }
   }
 }
 return volumes;
}

async function checkCurrentPayment(){
 currentOrderId=currentOrderId||localStorage.getItem("zavynCurrentOrderId")||null;
 currentOrderExternalReference=currentOrderExternalReference||localStorage.getItem("zavynCurrentOrderExternalReference")||null;
 if(!currentOrderId && !currentOrderExternalReference){alert("Nenhum pedido ativo para consultar.");return;}
 const btn=document.getElementById("checkPaymentBtn");
 if(btn){btn.disabled=true;btn.textContent="VERIFICANDO...";}
 try{
   const query=currentOrderExternalReference
     ? `external_reference=${encodeURIComponent(currentOrderExternalReference)}`
     : `id=${encodeURIComponent(currentOrderId)}`;
   const response=await fetch(`${ZAVYN_API_URL}/check-order?${query}`);
   const data=await response.json();
   if(!response.ok || !data.ok){
     throw new Error(data.error || data.order?.errors?.[0]?.message || "Não foi possível consultar o pedido.");
   }
   const order=data.order||{};
   if(order.id){
     currentOrderId=order.id;
     localStorage.setItem("zavynCurrentOrderId",currentOrderId);
   }
   if(order.external_reference){
     currentOrderExternalReference=order.external_reference;
     localStorage.setItem("zavynCurrentOrderExternalReference",currentOrderExternalReference);
   }
   const payment=order.transactions?.payments?.[0]||{};
   const approved=payment.status==="processed" && payment.status_detail==="accredited";
   if(approved){
     const ref=order.external_reference||currentOrderExternalReference;
     const purchasedVolumes=[...new Set(getPurchasedVolumesFromReference(ref))].sort((a,b)=>a-b);

     if(!ref || purchasedVolumes.length===0){
       throw new Error("O pagamento foi aprovado, mas não foi possível identificar os volumes deste pedido.");
     }

     const downloads=purchasedVolumes.map(volume=>`
       <a class="download-button" href="${ZAVYN_API_URL}/download?external_reference=${encodeURIComponent(ref)}&volume=${volume}" download="Zavyn-Volume-${volume}.pdf">
         BAIXAR VOLUME ${volume}
       </a>`).join("");

     cart=[];
     saveCart();
     renderCart();
     renderCheckout();
     showPaymentResult(`<div class="payment-success"><div class="success-icon">✓</div><strong>Pagamento aprovado!</strong><p>O Mercado Pago confirmou o pagamento do seu pedido.</p><div class="download-box"><p class="download-title">SEUS E-BOOKS ESTÃO DISPONÍVEIS</p><p class="download-help">O pedido foi confirmado. Baixe abaixo somente os volumes registrados nesta compra.</p><div class="download-list">${downloads}</div></div><p class="success-note">Guarde esta página até concluir os downloads. A entrega automática por e-mail será adicionada em uma próxima etapa.</p><button type="button" class="button" onclick="closePaymentResult()">CONTINUAR</button></div>`);
   }else{
     showPaymentResult(`<div class="payment-waiting"><strong>Pagamento ainda não confirmado.</strong><p>Status atual: <b>${payment.status||order.status||"aguardando"}</b> · ${payment.status_detail||order.status_detail||"waiting_transfer"}</p><button type="button" class="button" id="checkPaymentBtn">VERIFICAR NOVAMENTE</button></div>`);
     document.getElementById("checkPaymentBtn").onclick=checkCurrentPayment;
   }
 }catch(error){
   showPaymentResult(`<div class="payment-error"><strong>Não foi possível consultar o pagamento.</strong><p>${error.message}</p><button type="button" class="button" id="retryPaymentBtn">TENTAR NOVAMENTE</button></div>`);
   document.getElementById("retryPaymentBtn").onclick=checkCurrentPayment;
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
