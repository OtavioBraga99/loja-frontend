
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  // ESTADOS DOS PRODUTOS
  const [produtos, setProdutos] = useState([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)

  // ESTADOS DE CARREGAMENTO E ERRO
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // ESTADO DO CARRINHO
  const [carrinho, setCarrinho] = useState([])

  // BUSCAR PRODUTOS NA API SPRING BOOT
  useEffect(() => {
    const controller = new AbortController()

    async function buscarProdutos() {
      setCarregando(true)
      setErro('')

      try {
        const resposta = await fetch(
          `http://localhost:8080/produtos/paginados?page=${pagina}&size=6`,
          { signal: controller.signal }
        )

        if (!resposta.ok) {
          throw new Error('Erro ao buscar produtos')
        }

        const dados = await resposta.json()

        setProdutos(dados.content)
        setTotalPaginas(dados.page.totalPages)

      } catch (error) {
        if (error.name !== 'AbortError') {
          setErro(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    buscarProdutos()

    return () => controller.abort()

  }, [pagina])

  // PRÓXIMA PÁGINA
  function proximaPagina() {
    if (pagina < totalPaginas - 1) {
      setPagina(paginaAtual => paginaAtual + 1)
    }
  }

  // PÁGINA ANTERIOR
  function paginaAnterior() {
    if (pagina > 0) {
      setPagina(paginaAtual => paginaAtual - 1)
    }
  }

  // ADICIONAR PRODUTO AO CARRINHO
  function adicionarAoCarrinho(produto) {

    setCarrinho(carrinhoAtual => {

      const produtoExistente = carrinhoAtual.find(
        item => item.id === produto.id
      )

      const quantidadeAtual = produtoExistente?.quantidade ?? 0

      // Verifica o estoque disponível
      if (quantidadeAtual >= produto.quantidade) {
        return carrinhoAtual
      }

      // Produto já existe no carrinho
      if (produtoExistente) {
        return carrinhoAtual.map(item =>
          item.id === produto.id
            ? {
                ...item,
                estoque: produto.quantidade,
                quantidade: item.quantidade + 1
              }
            : item
        )
      }

      // Adiciona um novo produto ao carrinho
      return [
        ...carrinhoAtual,
        {
          id: produto.id,
          nome: produto.nome,
          preco: Number(produto.preco),
          quantidade: 1,
          estoque: produto.quantidade
        }
      ]
    })
  }

  // REMOVER PRODUTO DO CARRINHO
  function removerDoCarrinho(produtoId) {
    setCarrinho(carrinhoAtual =>
      carrinhoAtual.filter(item => item.id !== produtoId)
    )
  }

  // ALTERAR QUANTIDADE DO PRODUTO
  function alterarQuantidade(produtoId, diferenca) {

    setCarrinho(carrinhoAtual =>
      carrinhoAtual.map(item => {

        if (item.id !== produtoId) {
          return item
        }

        const novaQuantidade = item.quantidade + diferenca

        // Quantidade mínima permitida
        if (novaQuantidade < 1) {
          return item
        }

        // Não permite ultrapassar o estoque
        if (novaQuantidade > item.estoque) {
          return item
        }

        return {
          ...item,
          quantidade: novaQuantidade
        }
      })
    )
  }

  // QUANTIDADE TOTAL DE ITENS
  const quantidadeItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  )

  // VALOR TOTAL DO CARRINHO
  const valorTotal = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  )

  // FORMATAR VALORES EM REAIS
  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <div className="container">

      {/* CABEÇALHO */}
      <h1>Minha Loja</h1>

      <p>Bem-vindo à nossa loja virtual!</p>

      <p>🛒 Carrinho: {quantidadeItens} itens</p>

      {/* LISTAGEM DE PRODUTOS */}
      <h2>Produtos disponíveis</h2>

      {carregando && (
        <p>Carregando produtos...</p>
      )}

      {erro && (
        <p className="erro">{erro}</p>
      )}

      {!carregando && !erro && produtos.length === 0 && (
        <p>Nenhum produto cadastrado.</p>
      )}

      {!carregando && !erro && (
        <>
          <div className="produtos">

            {produtos.map(produto => {

              const quantidadeNoCarrinho =
                carrinho.find(item => item.id === produto.id)
                  ?.quantidade ?? 0

              const semEstoque =
                produto.quantidade <= 0 ||
                quantidadeNoCarrinho >= produto.quantidade

              return (
                <div
                  className="produto-card"
                  key={produto.id}
                >

                  <h3>{produto.nome}</h3>

                  <p>
                    Preço: {formatarMoeda(produto.preco)}
                  </p>

                  <p>
                    Estoque: {produto.quantidade}
                  </p>

                  <button
                    className="btn-adicionar"
                    onClick={() => adicionarAoCarrinho(produto)}
                    disabled={semEstoque}
                  >
                    {semEstoque
                      ? 'Indisponível'
                      : 'Adicionar ao carrinho'}
                  </button>

                </div>
              )
            })}

          </div>

          {/* PAGINAÇÃO */}
          {totalPaginas > 0 && (
            <div className="paginacao">

              <button
                onClick={paginaAnterior}
                disabled={pagina === 0}
              >
                Anterior
              </button>

              <span>
                Página {pagina + 1} de {totalPaginas}
              </span>

              <button
                onClick={proximaPagina}
                disabled={pagina >= totalPaginas - 1}
              >
                Próxima
              </button>

            </div>
          )}
        </>
      )}

      {/* CARRINHO DE COMPRAS */}
      <section className="carrinho">

        <h2>🛒 Meu Carrinho</h2>

        {carrinho.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>

            {carrinho.map(item => (
              <div
                className="carrinho-item"
                key={item.id}
              >

                <div>
                  <h3>{item.nome}</h3>

                  <p>
                    Preço unitário: {formatarMoeda(item.preco)}
                  </p>

                  {/* CONTROLE DE QUANTIDADE */}
                  <div className="controle-quantidade">

                    <button
                      onClick={() => alterarQuantidade(item.id, -1)}
                      disabled={item.quantidade <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantidade}</span>

                    <button
                      onClick={() => alterarQuantidade(item.id, 1)}
                      disabled={item.quantidade >= item.estoque}
                    >
                      +
                    </button>

                  </div>

                  <p>
                    Subtotal: {
                      formatarMoeda(
                        item.preco * item.quantidade
                      )
                    }
                  </p>

                </div>

                <button
                  className="btn-remover"
                  onClick={() => removerDoCarrinho(item.id)}
                >
                  Remover
                </button>

              </div>
            ))}

            <h3>
              Total: {formatarMoeda(valorTotal)}
            </h3>

          </>
        )}

      </section>

    </div>
  )
}

export default App
