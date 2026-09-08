# Zavyn V16 — base

Baseada diretamente na Zavyn V15.

Nesta primeira etapa foram adicionadas páginas separadas para:
- login.html
- cadastro.html
- perfil.html

A V16 mantém a estrutura da V15 e não altera o sistema existente de catálogo, carrinho, Mercado Pago, Worker ou R2.

Observação: login/cadastro/perfil são apenas a estrutura visual inicial nesta etapa; a autenticação e o armazenamento real serão implementados posteriormente.


## V16 — autenticação integrada

Esta versão conecta `cadastro.html`, `login.html` e `perfil.html` ao Worker `zavyn-api`.

Rotas usadas:
- `POST /register`
- `POST /login`
- `GET /me`
- `POST /logout`
- `PUT /profile`

O token de sessão recebido do Worker é mantido no navegador para esta primeira etapa. O pagamento Mercado Pago e os arquivos R2 permanecem no `script.js` original.
