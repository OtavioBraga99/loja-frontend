function ProdutoCard({
  produto,
  quantidadeNoCarrinho,
  adicionarAoCarrinho,
  finalizando,
  formatarMoeda
}) {
  const semEstoque =
    produto.quantidade <= 0 ||
    quantidadeNoCarrinho >= produto.quantidade

  return (
    <div className="produto-card">
      <h3>{produto.nome}</h3>

      <p>Preço: {formatarMoeda(produto.preco)}</p>

      <p>Estoque: {produto.quantidade}</p>

      <button
        className="btn-adicionar"
        onClick={() => adicionarAoCarrinho(produto)}
        disabled={semEstoque || finalizando}
      >
        {semEstoque
          ? 'Indisponível'
          : 'Adicionar ao carrinho'}
      </button>
    </div>
  )
}

export default ProdutoCard