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

let cart=JSON.parse(localStorage.getItem("zavynCart")||"[]")
  .map(item=>books.find(b=>b.n===item.n)?{...books.find(b=>b.n===item.n),qty:item.qty||1}:null)
  .filter(Boolean);

const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

const ZAVYN_API_URL="https://zavyn-api.portalzero26.workers.dev";

let selectedPayment="pix";

let currentOrderId=
  localStorage.getItem("zavynCurrentOrderId")||null;

let currentOrderExternalReference=
  localStorage.getItem("zavynCurrentOrderExternalReference")||null;


function saveCart(){
  localStorage.setItem(
    "zavynCart",
    JSON.stringify(
      cart.map(b=>({n:b.n,qty:b.qty}))
    )
  );
}


function cartCount(){
  return cart.reduce(
    (sum,b)=>sum+b.qty,
    0
  );
}


function cartTotal(){
  return cart.reduce(
    (sum,b)=>sum+b.price*b.qty,
    0
  );
}


function renderBooks(list=books){

  document.getElementById("volumes").innerHTML=
  list.map(b=>`

   <article class="book">

    <button
     class="book-cover-button"
     onclick="openBookModal(${b.n})"
     aria-label="Ver detalhes do Volume ${b.n}"
    >

     <div class="cover-image-wrap">

      <img
       class="book-cover"
       src="${b.image}"
       alt="Capa do Volume ${b.n} — Reincarnation in Another World: Next Level"
       loading="lazy"
      >

     </div>

    </button>

    <div class="book-meta">

     <span>
      VOLUME ${b.n}
     </span>

     <strong>
      ${money(b.price)}
     </strong>

    </div>

    <h3>
     ${b.title}
    </h3>

    <p>
     ${b.description}
    </p>

    <div class="book-actions">

     <button
      class="details-button"
      onclick="openBookModal(${b.n})"
     >
      VER DETALHES
     </button>

     <button
      class="add-button"
      onclick="addToCart(${b.n})"
     >
      ADICIONAR
     </button>

    </div>

   </article>

  `).join("");

}


function openBookModal(n){

  const b=books.find(x=>x.n===n);

  if(!b)return;

  document.getElementById("modalCover").src=b.image;

  document.getElementById("modalCover").alt=
   `Capa do Volume ${b.n}`;

  document.getElementById("modalTitle").textContent=
   b.title;

  document.getElementById("modalVolume").textContent=
   `Volume ${b.n} • Reincarnation in Another World: Next Level`;

  document.getElementById("modalDescription").textContent=
   b.description;

  document.getElementById("modalPrice").textContent=
   money(b.price);

  document.getElementById("modalAdd").onclick=()=>{
    addToCart(b.n);
    closeBookModal();
    openCart();
  };

  const modal=document.getElementById("bookModal");

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");

}


function closeBookModal(){

  const modal=
   document.getElementById("bookModal");

  modal.classList.remove("open");

  modal.setAttribute(
   "aria-hidden",
   "true"
  );

  document.body.classList.remove(
   "modal-open"
  );

}


document.addEventListener(
  "keydown",
  e=>{
    if(e.key==="Escape"){
      closeBookModal();
      closeCart();
    }
  }
);


function addToCart(n){

  const b=books.find(x=>x.n===n);

  if(!b)return;

  const existing=
   cart.find(x=>x.n===n);

  if(existing){
    existing.qty+=1;
  }else{
    cart.push({
      ...b,
      qty:1
    });
  }

  saveCart();

  renderCart();

  openCart();

}


function changeQty(n,delta){

  const item=
   cart.find(x=>x.n===n);

  if(!item)return;

  item.qty+=delta;

  if(item.qty<=0){
    cart=
      cart.filter(x=>x.n!==n);
  }

  saveCart();

  renderCart();

}


function removeFromCart(n){

  cart=
   cart.filter(x=>x.n!==n);

  saveCart();

  renderCart();

}


function cartItemMarkup(b){

  return `
   <div class="cart-item drawer-cart-item">

    <img
     src="${b.image}"
     alt="Capa do Volume ${b.n}"
    >

    <div class="drawer-item-info">

     <strong>
      Volume ${b.n}
     </strong>

     <span>
      ${b.title}
     </span>

     <small>
      ${money(b.price)} cada
     </small>

     <div class="qty-controls">

      <button
       type="button"
       onclick="changeQty(${b.n},-1)"
       aria-label="Diminuir quantidade"
      >
       −
      </button>

      <b>
       ${b.qty}
      </b>

      <button
       type="button"
       onclick="changeQty(${b.n},1)"
       aria-label="Aumentar quantidade"
      >
       +
      </button>

      <button
       class="remove-link"
       type="button"
       onclick="removeFromCart(${b.n})"
      >
       Remover
      </button>

     </div>

    </div>

    <strong class="item-subtotal">
     ${money(b.price*b.qty)}
    </strong>

   </div>
  `;

}


function renderCart(){

  const count=
   cartCount();

  document.getElementById(
   "cartCount"
  ).textContent=count;

  const html=
   cart.length
    ? cart.map(cartItemMarkup).join("")
    : '<p class="empty">Seu carrinho está vazio.</p>';

  document.getElementById(
   "cartItems"
  ).innerHTML=html;

  document.getElementById(
   "cartTotal"
  ).textContent=
   money(cartTotal());

  document.getElementById(
   "drawerItems"
  ).innerHTML=html;

  document.getElementById(
   "drawerTotal"
  ).textContent=
   money(cartTotal());

}


function openCart(){

  const d=
    document.getElementById(
     "cartDrawer"
    );

  d.classList.add("open");

  d.setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeCart(){

  const d=
    document.getElementById(
     "cartDrawer"
    );

  if(!d)return;

  d.classList.remove("open");

  d.setAttribute(
    "aria-hidden",
    "true"
  );

}


document.getElementById(
 "openCartBtn"
).onclick=openCart;

document.getElementById(
 "closeCartBtn"
).onclick=closeCart;

document.getElementById(
 "closeCartBackdrop"
).onclick=closeCart;


function openCheckout(){

  if(!cart.length){
    alert(
      "Adicione pelo menos um livro ao carrinho."
    );
    return;
  }

  closeCart();

  renderCheckout();

  document.getElementById(
   "checkout"
  ).classList.add(
   "checkout-active"
  );

  document.getElementById(
   "checkout"
  ).scrollIntoView({
   behavior:"smooth",
   block:"start"
  });

}


document.getElementById(
 "drawerCheckoutBtn"
).onclick=openCheckout;

document.getElementById(
 "checkoutBtn"
)?.addEventListener(
 "click",
 openCheckout
);


renderBooks();

renderCart();

const searchInput=
  document.getElementById("bookSearch");

let communitySearchTimer=null;


/* =========================================================
   BUSCA DE LIVROS E AUTORES
========================================================= */

function openBookSearchModal(){

  const modal=
    ensureBookSearchModal();

  const modalInput=
    document.getElementById(
      "bookSearchModalInput"
    );

  const results=
    document.getElementById(
      "bookSearchResults"
    );

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

  if(modalInput){

    modalInput.value=
      searchInput?.value?.trim()||"";

    setTimeout(()=>{
      modalInput.focus();
    },40);

    if(modalInput.value){

      searchCommunityBooks(
        modalInput.value
      );

    }else if(results){

      results.innerHTML=
        '<p class="user-search-empty">Digite o nome de um livro ou autor.</p>';

    }

  }

}


function closeBookSearchModal(){

  const modal=
    document.getElementById(
      "bookSearchModal"
    );

  if(!modal)return;

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


function ensureBookSearchModal(){

  let modal=
    document.getElementById(
      "bookSearchModal"
    );

  if(modal){

    const closeBtn=
      document.getElementById(
        "closeBookSearchBtn"
      );

    const backdrop=
  document.getElementById(
    "bookSearchBackdrop"
  ) ||
  document.getElementById(
    "closeBookSearchBackdrop"
  );

    if(closeBtn && !closeBtn.dataset.bound){
      closeBtn.addEventListener(
        "click",
        closeBookSearchModal
      );

      closeBtn.dataset.bound="true";
    }

    if(backdrop && !backdrop.dataset.bound){
      backdrop.addEventListener(
        "click",
        closeBookSearchModal
      );

      backdrop.dataset.bound="true";
    }

    return modal;
  }

  modal=
    document.createElement("div");

  modal.id=
    "bookSearchModal";

  modal.className=
    "book-search-modal";

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  modal.innerHTML=`

    <button
      type="button"
      id="closeBookSearchBtn"
      aria-label="Fechar busca"
    >
      Fechar
    </button>

    <div
      id="closeBookSearchBackdrop"
      class="book-search-backdrop"
    ></div>

    <div class="book-search-panel">

      <input
        id="bookSearchModalInput"
        type="search"
        placeholder="Buscar livros ou autores..."
        autocomplete="off"
      >

      <div
        id="bookSearchResults"
      ></div>

    </div>

  `;

  document.body.appendChild(
    modal
  );

const searchBackdrop =
  document.getElementById(
    "bookSearchBackdrop"
  ) ||
  document.getElementById(
    "closeBookSearchBackdrop"
  );

searchBackdrop?.addEventListener(
  "click",
  closeBookSearchModal
);

  document
    .getElementById(
      "closeBookSearchBackdrop"
    )
    ?.addEventListener(
      "click",
      closeBookSearchModal
    );

  const modalInput=
    document.getElementById(
      "bookSearchModalInput"
    );

  modalInput?.addEventListener(
    "input",
    e=>{

      if(searchInput){

        searchInput.value=
          e.target.value;

      }

      scheduleBookSearch(
        e.target.value
      );

    }
  );

  return modal;

}


/* =========================================================
   ESCAPE PARA TEXTOS
========================================================= */

function escapeBookSearchText(value){

  return String(
    value??""
  )

  .replace(
    /&/g,
    "&amp;"
  )

  .replace(
    /</g,
    "&lt;"
  )

  .replace(
    />/g,
    "&gt;"
  )

  .replace(
    /"/g,
    "&quot;"
  )

  .replace(
    /'/g,
    "&#039;"
  );

}


/* =========================================================
   RESULTADOS DA BUSCA
========================================================= */

function renderBookSearchResults(
  books,
  query
){

  const results=
    document.getElementById(
      "bookSearchResults"
    );

  if(!results)return;

  if(!books.length){

    results.innerHTML=`

      <p class="user-search-empty">
        Nenhum livro encontrado para

        <strong>
          ${escapeBookSearchText(query)}
        </strong>.

      </p>

    `;

    return;
  }


  results.innerHTML=
    books.map(book=>{

      const price=
        Number(book.price||0)===0

          ? "GRÁTIS"

          : Number(
              book.price
            ).toLocaleString(
              "pt-BR",
              {
                style:"currency",
                currency:"BRL"
              }
            );


      return`

        <button
          type="button"
          class="user-result book-search-result"
          data-book-id="${escapeBookSearchText(book.id)}"
        >

          ${
            book.cover_url

              ? `

                <img
                  class="user-result-avatar"
                  src="${escapeBookSearchText(
                    book.cover_url
                  )}"
                  alt="Capa de ${escapeBookSearchText(
                    book.title
                  )}"
                >

              `

              : `

                <span
                  class="user-result-avatar"
                >
                  ${escapeBookSearchText(
                    String(
                      book.title||"L"
                    )
                    .trim()
                    .charAt(0)
                    .toUpperCase()
                  )}
                </span>

              `
          }


          <span
            class="user-result-info"
          >

            <strong>
              ${escapeBookSearchText(
                book.title||"Livro"
              )}
            </strong>

            <small>
              por
              ${escapeBookSearchText(
                book.author?.name||
                "Autor"
              )}
            </small>

            <small>
              ${price}
            </small>

          </span>


          <span
            class="user-result-arrow"
          >
            →
          </span>


        </button>

      `;

    }).join("");


  results
    .querySelectorAll(
      ".book-search-result"
    )
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          const bookId=
            button.dataset.bookId;


          const book=
            books.find(
              item=>
                String(item.id)===
                String(bookId)
            );


         if(book){
  if(book.isLegacy){
    openBookModal(book.n);
  }else{
    showCommunityBookDetails(book);
  }
 }

        }
      );

    });

}


/* =========================================================
   PESQUISAR LIVROS
========================================================= */

async function searchCommunityBooks(
  query
){

  const q=
    String(
      query||""
    ).trim();

  const results=
    document.getElementById(
      "bookSearchResults"
    );

  if(!results)return;

  if(q.length<2){

    results.innerHTML=
      '<p class="user-search-empty">Digite pelo menos 2 caracteres.</p>';

    return;
  }

  results.innerHTML=
    '<p class="user-search-loading">Procurando livros...</p>';

  const normalizeSearchText=value=>
    String(value||"")
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"");

  const normalized=
    normalizeSearchText(q);

  /* =========================================
     LIVROS ANTIGOS DA ZAVYN
  ========================================= */

  const legacyBooks=
    books
      .filter(book=>{

        const title=
          normalizeSearchText(
            book.title||""
          );

        const description=
          normalizeSearchText(
            book.description||""
          );

        return(
          title.includes(
            normalized
          )
          ||
          description.includes(
            normalized
          )
        );

      })
      .map(book=>({

        ...book,

        id:
          `legacy-${book.n}`,

        cover_url:
          book.image||"",

        author:{
          name:"Zavyn",
          username:"zavyn"
        },

        isLegacy:true

      }));


  /* =========================================
     LIVROS DOS AUTORES
  ========================================= */

  let communityBooks=[];

  try{

    const response=
      await fetch(
        `${ZAVYN_API_URL}/books/search?q=${encodeURIComponent(q)}`
      );

    const data=
      await response.json();

    if(
      !response.ok||
      !data.ok
    ){

      throw new Error(
        data.error||
        "Não foi possível buscar os livros."
      );

    }

    communityBooks=
      (
        Array.isArray(
          data.books
        )
          ? data.books
          : []
      )
      .map(book=>({

        ...book,

        isLegacy:false

      }));

  }catch(error){

    /*
       Se a API da comunidade falhar,
       os livros antigos da Zavyn continuam
       aparecendo normalmente na busca.
    */

    if(!legacyBooks.length){
      throw error;
    }

  }


  /* =========================================
     JUNTA OS DOIS CATÁLOGOS
  ========================================= */

  const allBooks=[
    ...legacyBooks,
    ...communityBooks
  ];


  renderBookSearchResults(
    allBooks,
    q
  );

}


/* =========================================================
   DELAY DA BUSCA
========================================================= */

function scheduleBookSearch(
  value
){

  clearTimeout(
    communitySearchTimer
  );


  communitySearchTimer=
    setTimeout(
      ()=>{
        searchCommunityBooks(
          value
        );
      },
      220
    );

}


/* =========================================================
   DETALHES DO LIVRO DA COMUNIDADE
========================================================= */

function showCommunityBookDetails(
  book
){

  closeBookSearchModal();


  const oldModal=
    document.getElementById(
      "communityBookDetailsModal"
    );


  if(oldModal){

    oldModal.remove();

  }


  const modal=
    document.createElement(
      "div"
    );

  modal.id=
    "communityBookDetailsModal";

  modal.className=
    "book-search-modal";

  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  const price=
    Number(book.price||0)===0

      ? "GRÁTIS"

      : Number(
          book.price
        ).toLocaleString(
          "pt-BR",
          {
            style:"currency",
            currency:"BRL"
          }
        );


  modal.innerHTML=`

    <div
      class="book-search-backdrop"
      id="communityBookDetailsBackdrop"
    ></div>


    <section
      class="book-details-modal-card"
      role="dialog"
      aria-modal="true"
    >


      <button
        type="button"
        class="modal-close"
        id="closeCommunityBookDetails"
        aria-label="Fechar"
      >
        ×
      </button>


      ${
        book.cover_url

          ? `

            <img
              src="${escapeBookSearchText(
                book.cover_url
              )}"
              alt="Capa de ${escapeBookSearchText(
                book.title
              )}"
              class="community-detail-cover"
            >

          `

          : ""
      }


      <div
        class="book-details-modal-info"
      >

        <p
          class="eyebrow gold"
        >
          LIVRO DA COMUNIDADE
        </p>


        <h2>
          ${escapeBookSearchText(
            book.title||
            "Livro"
          )}
        </h2>


        <p>
          por
          <strong>
            ${escapeBookSearchText(
              book.author?.name||
              "Autor"
            )}
          </strong>
        </p>


        <p>
          ${escapeBookSearchText(
            book.description||
            "Sem descrição."
          )}
        </p>


        <strong>
          ${price}
        </strong>


        <button
          type="button"
          class="button"
          id="communityBookBuyButton"
        >
          VER LIVRO
        </button>


      </div>


    </section>

  `;


  document.body.appendChild(
    modal
  );


  document.body.classList.add(
    "modal-open"
  );


  const close=()=>{
    modal.remove();
    document.body.classList.remove(
      "modal-open"
    );
  };


  document
    .getElementById(
      "closeCommunityBookDetails"
    )
    ?.addEventListener(
      "click",
      close
    );


  document
    .getElementById(
      "communityBookDetailsBackdrop"
    )
    ?.addEventListener(
      "click",
      close
    );


  document
    .getElementById(
      "communityBookBuyButton"
    )
    ?.addEventListener(
      "click",
      ()=>{
        alert(
          "A página individual e a compra deste livro serão conectadas na próxima etapa."
        );
      }
    );

}


/* =========================================================
   CAMPO DE BUSCA DO CABEÇALHO
========================================================= */

if(searchInput){

  searchInput.readOnly=
    false;


  searchInput.placeholder=
    "Buscar livros ou autores...";


  searchInput.addEventListener(
    "focus",
    openBookSearchModal
  );


  searchInput.addEventListener(
    "click",
    openBookSearchModal
  );


  searchInput.addEventListener(
    "input",
    e=>{

      if(
        document
          .getElementById(
            "bookSearchModal"
          )
          ?.classList.contains(
            "open"
          )
      ){

        const modalInput=
          document.getElementById(
            "bookSearchModalInput"
          );


        if(modalInput){

          modalInput.value=
            e.target.value;

        }


        scheduleBookSearch(
          e.target.value
        );

      }

    }
  );

}


/* =========================================================
   ESC PARA FECHAR
========================================================= */

document.addEventListener(
  "keydown",
  e=>{

    if(e.key!=="Escape"){
      return;
    }


    const details=
      document.getElementById(
        "communityBookDetailsModal"
      );


    if(details){

      details.remove();

      document.body.classList.remove(
        "modal-open"
      );

      return;

    }


    const searchModal=
      document.getElementById(
        "bookSearchModal"
      );


    if(
      searchModal?.classList.contains(
        "open"
      )
    ){

      closeBookSearchModal();

    }

  }
);


/* =========================================================
   CHECKOUT
========================================================= */

function renderCheckout(){

  const container=
    document.getElementById(
      "checkoutItems"
    );

  if(!container)return;


  container.innerHTML=
    cart.length

      ? cart.map(
          b=>`

            <div
              class="summary-item"
            >

              <span>
                V${b.n} · ${b.title}

                <b>
                  × ${b.qty}
                </b>

              </span>

              <strong>
                ${money(
                  b.price*b.qty
                )}
              </strong>

            </div>

          `
        ).join("")

      : '<p class="empty">Seu carrinho está vazio.</p>';


  document.getElementById(
    "checkoutSubtotal"
  ).textContent=
    money(cartTotal());


  document.getElementById(
    "checkoutTotal"
  ).textContent=
    money(cartTotal());

}


/* =========================================================
   FORMA DE PAGAMENTO
========================================================= */

document
  .querySelectorAll(
    ".payment-option"
  )
  .forEach(
    btn=>
      btn.addEventListener(
        "click",
        ()=>{

          document
            .querySelectorAll(
              ".payment-option"
            )
            .forEach(
              b=>
                b.classList.remove(
                  "selected"
                )
            );


          btn.classList.add(
            "selected"
          );


          selectedPayment=
            btn.dataset.payment||
            "pix";


          const notice=
            document.getElementById(
              "paymentNotice"
            );


          if(notice){

            notice.textContent=
              selectedPayment==="pix"

                ? "PIX conectado ao Mercado Pago. O pedido será criado com o valor calculado pela Zavyn."

                : "Cartão será conectado na próxima etapa. Nesta versão, use PIX para testar o pagamento.";

          }

        }
      )
  );


/* =========================================================
   RESULTADO DO PAGAMENTO
========================================================= */

function showPaymentResult(
  html
){

  const box=
    document.getElementById(
      "paymentResult"
    );


  if(!box)return;


  box.innerHTML=
    html;


  box.classList.add(
    "visible"
  );


  box.scrollIntoView({
    behavior:"smooth",
    block:"center"
  });

}


function closePaymentResult(){

  const box=
    document.getElementById(
      "paymentResult"
    );


  if(box){

    box.classList.remove(
      "visible"
    );

    box.innerHTML="";

  }


  localStorage.removeItem(
    "zavynCurrentOrderId"
  );


  localStorage.removeItem(
    "zavynCurrentOrderExternalReference"
  );


  currentOrderId=
    null;


  currentOrderExternalReference=
    null;

}


/* =========================================================
   CRIAR PIX
========================================================= */

async function createPixPayment(){

  if(!cart.length){

    alert(
      "Seu carrinho está vazio."
    );

    return;

  }


  const name=
    document
      .getElementById(
        "customerName"
      )
      .value
      .trim();


  const email=
    document
      .getElementById(
        "customerEmail"
      )
      .value
      .trim();


  if(!name || !email){

    alert(
      "Preencha seu nome e seu e-mail."
    );

    return;

  }


  if(
    !/^\S+@\S+\.\S+$/.test(
      email
    )
  ){

    alert(
      "Digite um e-mail válido."
    );

    return;

  }


  const submit=
    document.querySelector(
      ".checkout-submit"
    );


  const original=
    submit.textContent;


  submit.disabled=
    true;


  submit.textContent=
    "CRIANDO PIX...";


  closePaymentResult();


  try{

    const response=
      await fetch(
        `${ZAVYN_API_URL}/create-order`,
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              name,

              email,

              totalAmount:
                cartTotal()
                  .toFixed(2),

              items:
                cart.map(
                  b=>({
                    n:b.n,
                    qty:b.qty
                  })
                )

            })
        }
      );


    const data=
      await response.json();


    if(
      !response.ok||
      !data.ok
    ){

      throw new Error(
        data.error||
        "Não foi possível criar o PIX."
      );

    }


    const order=
      data.order||
      {};


    currentOrderId=
      order.id||
      null;


    currentOrderExternalReference=
      order.external_reference||
      data.externalReference||
      null;


    if(currentOrderId){

      localStorage.setItem(
        "zavynCurrentOrderId",
        currentOrderId
      );

    }


    if(
      currentOrderExternalReference
    ){

      localStorage.setItem(
        "zavynCurrentOrderExternalReference",
        currentOrderExternalReference
      );

    }


    const payment=
      order.transactions
        ?.payments?.[0]||
      {};


    const method=
      payment.payment_method||
      {};


    const qr=
      method.qr_code_base64||
      "";


    const code=
      method.qr_code||
      "";


    const ticket=
      method.ticket_url||
      "";


    showPaymentResult(`

      <div
        class="payment-result-head"
      >

        <span
          class="payment-status-dot"
        ></span>

        <div>

          <strong>
            PIX criado com sucesso
          </strong>

          <small>
            Pedido ${order.id||""}
          </small>

        </div>

      </div>


      <p
        class="payment-result-total"
      >

        Total:

        <strong>
          ${money(
            data.calculatedTotal||
            cartTotal()
          )}
        </strong>

      </p>


      ${
        qr

          ? `

            <div
              class="pix-qr-wrap"
            >

              <img
                src="data:image/png;base64,${qr}"
                alt="QR Code PIX para pagamento"
              >

            </div>

          `

          : ""
      }


      ${
        code

          ? `

            <label
              class="pix-code-label"
            >

              PIX copia e cola

              <input
                id="pixCode"
                readonly
                value="${code.replace(
                  /"/g,
                  "&quot;"
                )}"
              >

            </label>


            <button
              type="button"
              class="button secondary-action"
              id="copyPixBtn"
            >
              COPIAR CÓDIGO PIX
            </button>

          `

          : ""
      }


      <div
        class="payment-result-actions"
      >

        <button
          type="button"
          class="button"
          id="checkPaymentBtn"
        >
          VERIFICAR PAGAMENTO
        </button>


        ${
          ticket

            ? `

              <a
                class="payment-ticket"
                href="${ticket}"
                target="_blank"
                rel="noopener"
              >
                ABRIR PIX
              </a>

            `

            : ""
        }


      </div>


      <p
        class="payment-help"
      >

        Pagamento em ambiente de produção.

        Após pagar o PIX, use
        “VERIFICAR PAGAMENTO”
        para confirmar a aprovação.

      </p>

    `);


    const copyBtn=
      document.getElementById(
        "copyPixBtn"
      );


    if(copyBtn){

      copyBtn.onclick=
        async()=>{

          try{

            await navigator
              .clipboard
              .writeText(
                code
              );


            copyBtn.textContent=
              "CÓDIGO COPIADO ✓";


          }catch{

            alert(
              "Não foi possível copiar automaticamente. Selecione o código e copie."
            );

          }

        };

    }


    const checkBtn=
      document.getElementById(
        "checkPaymentBtn"
      );


    if(checkBtn){

      checkBtn.onclick=
        checkCurrentPayment;

    }


  }catch(error){

    showPaymentResult(`

      <div
        class="payment-error"
      >

        <strong>
          Não foi possível criar o PIX.
        </strong>

        <p>
          ${error.message}
        </p>

        <button
          type="button"
          class="button"
          onclick="closePaymentResult()"
        >
          FECHAR
        </button>

      </div>

    `);

  }finally{

    submit.disabled=
      false;

    submit.textContent=
      original;

  }

}


/* =========================================================
   IDENTIFICAR VOLUMES DO PEDIDO
========================================================= */

function getPurchasedVolumesFromReference(
  externalReference
){

  const volumes=[];


  if(!externalReference){
    return volumes;
  }


  const parts=
    String(
      externalReference
    ).split("_");


  for(
    const part of parts
  ){

    const match=
      part.match(
        /^v([1-8])x(\d+)$/
      );


    if(match){

      const volume=
        Number(
          match[1]
        );


      const quantity=
        Number(
          match[2]
        );


      if(
        Number.isInteger(
          volume
        )&&
        volume>=1&&
        volume<=8&&
        Number.isInteger(
          quantity
        )&&
        quantity>0
      ){

        volumes.push(
          volume
        );

      }

    }

  }


  return volumes;

}
/* =========================================================
   VERIFICAR PAGAMENTO
========================================================= */

async function checkCurrentPayment(){

  currentOrderId=
    currentOrderId||
    localStorage.getItem(
      "zavynCurrentOrderId"
    )||
    null;


  currentOrderExternalReference=
    currentOrderExternalReference||
    localStorage.getItem(
      "zavynCurrentOrderExternalReference"
    )||
    null;


  if(
    !currentOrderId&&
    !currentOrderExternalReference
  ){

    alert(
      "Nenhum pedido ativo para consultar."
    );

    return;

  }


  const btn=
    document.getElementById(
      "checkPaymentBtn"
    );


  if(btn){

    btn.disabled=
      true;

    btn.textContent=
      "VERIFICANDO...";

  }


  try{

    const query=
      currentOrderExternalReference

        ? `external_reference=${encodeURIComponent(
            currentOrderExternalReference
          )}`

        : `id=${encodeURIComponent(
            currentOrderId
          )}`;


    const response=
      await fetch(
        `${ZAVYN_API_URL}/check-order?${query}`
      );


    const data=
      await response.json();


    if(
      !response.ok||
      !data.ok
    ){

      throw new Error(
        data.error||
        data.order?.errors?.[0]?.message||
        "Não foi possível consultar o pedido."
      );

    }


    const order=
      data.order||
      {};


    if(order.id){

      currentOrderId=
        order.id;


      localStorage.setItem(
        "zavynCurrentOrderId",
        currentOrderId
      );

    }


    if(
      order.external_reference
    ){

      currentOrderExternalReference=
        order.external_reference;


      localStorage.setItem(
        "zavynCurrentOrderExternalReference",
        currentOrderExternalReference
      );

    }


    const payment=
      order.transactions
        ?.payments?.[0]||
      {};


    const approved=
      payment.status===
        "processed"&&
      payment.status_detail===
        "accredited";


    if(approved){

      const ref=
        order.external_reference||
        currentOrderExternalReference;


      const purchasedVolumes=
        [
          ...new Set(
            getPurchasedVolumesFromReference(
              ref
            )
          )
        ]
        .sort(
          (a,b)=>a-b
        );


      if(
        !ref||
        purchasedVolumes.length===0
      ){

        throw new Error(
          "O pagamento foi aprovado, mas não foi possível identificar os volumes deste pedido."
        );

      }


      const downloads=
        purchasedVolumes
          .map(
            volume=>`

              <a
                class="download-button"
                href="${ZAVYN_API_URL}/download?external_reference=${encodeURIComponent(
                  ref
                )}&volume=${volume}"
                download="Zavyn-Volume-${volume}.pdf"
              >

                BAIXAR VOLUME ${volume}

              </a>

            `
          )
          .join("");


      cart=[];

      saveCart();

      renderCart();

      renderCheckout();


      showPaymentResult(`

        <div
          class="payment-success"
        >

          <div
            class="success-icon"
          >
            ✓
          </div>


          <strong>
            Pagamento aprovado!
          </strong>


          <p>
            O Mercado Pago confirmou
            o pagamento do seu pedido.
          </p>


          <div
            class="download-box"
          >

            <p
              class="download-title"
            >
              SEUS E-BOOKS ESTÃO DISPONÍVEIS
            </p>


            <p
              class="download-help"
            >
              O pedido foi confirmado.
              Baixe abaixo somente os volumes
              registrados nesta compra.
            </p>


            <div
              class="download-list"
            >
              ${downloads}
            </div>

          </div>


          <p
            class="success-note"
          >
            Guarde esta página até concluir
            os downloads. A entrega automática
            por e-mail será adicionada em uma
            próxima etapa.
          </p>


          <button
            type="button"
            class="button"
            onclick="closePaymentResult()"
          >
            CONTINUAR
          </button>


        </div>

      `);


    }else{

      showPaymentResult(`

        <div
          class="payment-waiting"
        >

          <strong>
            Pagamento ainda não confirmado.
          </strong>


          <p>

            Status atual:

            <b>
              ${payment.status||
                order.status||
                "aguardando"}
            </b>

            ·

            ${
              payment.status_detail||
              order.status_detail||
              "waiting_transfer"
            }

          </p>


          <button
            type="button"
            class="button"
            id="checkPaymentBtn"
          >
            VERIFICAR NOVAMENTE
          </button>


        </div>

      `);


      document.getElementById(
        "checkPaymentBtn"
      ).onclick=
        checkCurrentPayment;

    }


  }catch(error){

    showPaymentResult(`

      <div
        class="payment-error"
      >

        <strong>
          Não foi possível consultar o pagamento.
        </strong>


        <p>
          ${error.message}
        </p>


        <button
          type="button"
          class="button"
          id="retryPaymentBtn"
        >
          TENTAR NOVAMENTE
        </button>


      </div>

    `);


    document.getElementById(
      "retryPaymentBtn"
    ).onclick=
      checkCurrentPayment;

  }finally{

    const b=
      document.getElementById(
        "checkPaymentBtn"
      );


    if(b){

      b.disabled=
        false;

    }

  }

}


/* =========================================================
   FORMULÁRIO DE CHECKOUT
========================================================= */

document
  .getElementById(
    "checkoutForm"
  )
  .addEventListener(
    "submit",
    e=>{

      e.preventDefault();


      if(
        selectedPayment!=="pix"
      ){

        alert(
          "O pagamento por cartão será integrado na próxima etapa. Por enquanto, selecione PIX para testar o checkout."
        );

        return;

      }


      createPixPayment();

    }
  );


/* =========================================================
   VOLTAR PARA O CARRINHO
========================================================= */

document
  .getElementById(
    "backToCartBtn"
  )
  .onclick=()=>{

    document
      .getElementById(
        "carrinho"
      )
      .scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

  };


/* =========================================================
   VOLTAR PARA O CARRINHO
========================================================= */

document
  .getElementById(
    "backToCartBtn"
  )
  .onclick=()=>{

    document
      .getElementById(
        "carrinho"
      )
      .scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

  };
