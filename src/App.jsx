
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produtos, setProdutos] = useState([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function buscarProdutos() {
      setCarregando(true)
      setErro('')

      try {
        const resposta = await fetch(
          `http://localhost:8080/produtos/paginados?page=${pagina}&size=5`,
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

  function proximaPagina() {
    if (pagina < totalPaginas - 1) {
      setPagina(pagina + 1)
    }
  }

  function paginaAnterior() {
    if (pagina > 0) {
      setPagina(pagina - 1)
    }
  }

  return (
    <div className="container">
      <h1>Minha Loja</h1>
      <p>Bem-vindo à nossa loja virtual!</p>

      <h2>Produtos disponíveis</h2>

      {carregando && <p>Carregando produtos...</p>}

      {erro && <p className="erro">{erro}</p>}

      {!carregando && !erro && produtos.length === 0 && (
        <p>Nenhum produto cadastrado.</p>
      )}

      {!carregando && !erro && (
        <>
          <div className="produtos">
            {produtos.map((produto) => (
              <div className="produto-card" key={produto.id}>
                <h3>{produto.nome}</h3>
                <p>
                  Preço: R$ {Number(produto.preco).toFixed(2)}
                </p>
                <p>Estoque: {produto.quantidade}</p>
              </div>
            ))}
          </div>

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
    </div>
  )
}

export default App
