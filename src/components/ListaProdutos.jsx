import ProdutoCard from './ProdutoCard'

function ListaProdutos({
  produtos,
  carrinho,
  adicionarAoCarrinho,
  finalizando,
  formatarMoeda
}) {
  return (
    <div className="produtos">
      {produtos.map(produto => (
        <ProdutoCard
          key={produto.id}
          produto={produto}
          quantidadeNoCarrinho={
            carrinho.find(item => item.id === produto.id)
              ?.quantidade ?? 0
          }
          adicionarAoCarrinho={adicionarAoCarrinho}
          finalizando={finalizando}
          formatarMoeda={formatarMoeda}
        />
      ))}
    </div>
  )
}

export default ListaProdutos