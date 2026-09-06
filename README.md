ZAVYN V6 — LOGO + CAPAS PRESERVADAS

Esta versão mantém as 8 capas originais e inclui a logo oficial da Zavyn.

ESTRUTURA DO REPOSITÓRIO:
index.html
style.css
script.js
zavyn-logo.png
covers/volume-1.webp ... volume-7.webp
covers/volume-8.png

IMPORTANTE: ao publicar no GitHub Pages, envie TODOS esses arquivos e a pasta covers para a raiz do repositório. Não envie a pasta Zavyn_v6_logo_capas_corrigido como uma pasta dentro do repositório.


V8: corrigido o ícone do carrinho para SVG, removendo o quadrado branco causado pela renderização do emoji.


## Pagamento PIX — V10
O checkout usa a API da Zavyn em `https://zavyn-api.portalzero26.workers.dev`. O arquivo `zavyn-api-worker-v2.js` contém o Worker atualizado com `/create-order` e `/check-order`.

Para teste no Cloudflare, configure a variável `MP_TEST_MODE` como `true` e mantenha `MP_ACCESS_TOKEN` como Secret. O site calcula os itens, mas o Worker valida os preços novamente antes de criar a Order.

Cartão ainda não está conectado nesta versão.
