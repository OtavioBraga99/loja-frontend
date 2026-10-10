
function Carrinho({
  carrinho,
  alterarQuantidade,
  removerDoCarrinho,
  valorTotal,
  formatarMoeda,
  finalizando,
  children
}) {
  return (
    <section className="carrinho">
      <h2>🛒 Meu Carrinho</h2>

      {carrinho.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {carrinho.map(item => (
            <div className="carrinho-item" key={item.id}>
              <div>
                <h3>{item.nome}</h3>

                <p>
                  Preço unitário: {formatarMoeda(item.preco)}
                </p>

                <div className="controle-quantidade">
                  <button
                    onClick={() => alterarQuantidade(item.id, -1)}
                    disabled={item.quantidade <= 1 || finalizando}
                  >
                    -
                  </button>

                  <span>{item.quantidade}</span>

                  <button
                    onClick={() => alterarQuantidade(item.id, 1)}
                    disabled={
                      item.quantidade >= item.estoque || finalizando
                    }
                  >
                    +
                  </button>
                </div>

                <p>
                  Subtotal: {formatarMoeda(
                    item.preco * item.quantidade
                  )}
                </p>
              </div>

              <button
                className="btn-remover"
                onClick={() => removerDoCarrinho(item.id)}
                disabled={finalizando}
              >
                Remover
              </button>
            </div>
          ))}

          <h3>Total: {formatarMoeda(valorTotal)}</h3>
        </>
      )}
      {children}
    </section>
  )
}

export default Carrinho
