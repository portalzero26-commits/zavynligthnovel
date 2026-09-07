# Zavyn V13

V13 da livraria digital Zavyn.

## O que mudou
- Preço dos 8 e-books definido em R$ 5,00 no catálogo.
- Checkout PIX continua conectado ao Worker da Zavyn.
- O pedido e a `external_reference` ficam salvos localmente para permitir consulta após atualização da página.
- A consulta de pagamento usa `external_reference` quando disponível, compatível com o fluxo de teste validado no Worker.
- Após pagamento aprovado (`processed` + `accredited`), a página mostra um botão de download para cada volume comprado.
- O download usa o endpoint protegido do Worker e o bucket privado R2.
- Mensagens do checkout atualizadas para refletir a entrega digital.

## API
`https://zavyn-api.portalzero26.workers.dev`

## Importante
Esta V13 ainda deve ser usada com o ambiente de teste até a conclusão da validação e da troca para credenciais de produção. O teste oficial de PIX do Mercado Pago usa os dados específicos do sandbox; isso não altera o preço real de R$ 5,00 mostrado no catálogo.

## Estrutura
- `index.html`
- `style.css`
- `script.js`
- `zavyn-logo.png`
- `covers/volume-1.webp` até `volume-7.webp`
- `covers/volume-8.png`
