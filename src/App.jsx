import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const resposta = await fetch(
          'http://localhost:8080/produtos/paginados?page=0&size=10'
        )

        if (!resposta.ok) {
          throw new Error('Erro ao buscar produtos')
        }

        const dados = await resposta.json()

        setProdutos(dados.content)
      } catch (error) {
        setErro(error.message)
      } finally {
        setCarregando(false)
      }
    }

    buscarProdutos()
  }, [])

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
    </div>
  )
}

export default App