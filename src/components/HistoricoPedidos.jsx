
function HistoricoPedidos({
  historico,
  buscarHistorico,
  carregandoHistorico,
  erroHistorico,
  formatarMoeda
}) {
  return (
    <section className="carrinho">
      <h2>Histórico de Pedidos</h2>

      <p>Consulte os pedidos do usuário informado acima.</p>

      <button
        className="btn-finalizar"
        onClick={buscarHistorico}
        disabled={carregandoHistorico}
      >
        {carregandoHistorico ? 'Buscando...' : 'Buscar histórico'}
      </button>

      {erroHistorico && (
        <p className="erro">{erroHistorico}</p>
      )}

      {!carregandoHistorico &&
        !erroHistorico &&
        historico.length === 0 && (
          <p>Nenhum pedido carregado.</p>
        )}

      {historico.map(pedido => (
        <div className="carrinho-item" key={pedido.id}>
          <div>
            <h3>Pedido #{pedido.id}</h3>

            <p>Status: {pedido.status}</p>

            <p>
              Data: {new Date(pedido.dataPedido).toLocaleString('pt-BR')}
            </p>

            {pedido.itens.map(item => (
              <p key={item.produtoId}>
                {item.quantidade} × {item.nomeProduto} —{' '}
                {formatarMoeda(
                  item.precoUnitario * item.quantidade
                )}
              </p>
            ))}

            <strong>
              Total: {formatarMoeda(pedido.total)}
            </strong>
          </div>
        </div>
      ))}
    </section>
  )
}

export default HistoricoPedidos
