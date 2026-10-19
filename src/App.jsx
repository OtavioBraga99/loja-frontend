import { useEffect, useState } from 'react'
import ListaProdutos from './components/ListaProdutos'
import Carrinho from './components/Carrinho'
import HistoricoPedidos from './components/HistoricoPedidos'
import CadastroUsuario from './components/CadastroUsuario'
import ListaUsuarios from './components/ListaUsuarios'
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

  // ESTADOS DA FINALIZAÇÃO DO PEDIDO
  const [usuarioId, setUsuarioId] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false)
  const [erroUsuarios, setErroUsuarios] = useState('')
  const [finalizando, setFinalizando] = useState(false)
  const [mensagemPedido, setMensagemPedido] = useState('')
  const [erroPedido, setErroPedido] = useState('')
  const [historico, setHistorico] = useState([])
  const [carregandoHistorico, setCarregandoHistorico] = useState(false)
  const [erroHistorico, setErroHistorico] = useState('')
  const [atualizacaoUsuarios, setAtualizacaoUsuarios] = useState(0)

  // CONSULTAR PEDIDOS
  async function buscarHistorico() {
    if (
      usuarioId.trim() === '' ||
      !Number.isSafeInteger(Number(usuarioId)) ||
      Number(usuarioId) <= 0
    ) {
      setErroHistorico('Informe um ID de usuário válido.')
      setHistorico([])
      return
    }

    setCarregandoHistorico(true)
    setErroHistorico('')
    setHistorico([])

    try {
      const resposta = await fetch(
        `http://localhost:8080/pedidos/usuario/${usuarioId}`
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível buscar o histórico.')
      }

      const dados = await resposta.json()

      setHistorico(dados)

    } catch (error) {
      setErroHistorico(error.message)
    } finally {
      setCarregandoHistorico(false)
    }
  }

  async function buscarUsuariosCheckout() {
    setCarregandoUsuarios(true)
    setErroUsuarios('')

    try {
      const resposta = await fetch('http://localhost:8080/usuarios')

      if (!resposta.ok) { 
        throw new Error ('Não foi possível carregar os usuários.')
      }

      const dados = await resposta.json()
      setUsuarios(dados)
    
    } catch (error) {
      setErroUsuarios(error.message)
    } finally {
      setCarregandoUsuarios(false)
    }
  }

  // BUSCAR PRODUTOS NA API SPRING BOOT
  useEffect(() => {
    const controller = new AbortController()

    async function buscarProdutos() {
      setCarregando(true)
      setErro('')

      try {
        const resposta = await fetch(
          `http://localhost:8080/produtos/paginados?page=${pagina}&size=8`,
          { signal: controller.signal }
        )

        if (!resposta.ok) {
          throw new Error('Erro ao buscar produtos')
        }

        const dados = await resposta.json()

        if (!controller.signal.aborted) {
          setProdutos(dados.content)
          setTotalPaginas(dados.page.totalPages)
        }

      } catch (error) {
        if (!controller.signal.aborted) {
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
    setMensagemPedido('')
    setErroPedido('')

    setCarrinho(carrinhoAtual => {
      const produtoExistente = carrinhoAtual.find(
        item => item.id === produto.id
      )

      const quantidadeAtual = produtoExistente?.quantidade ?? 0

      if (quantidadeAtual >= produto.quantidade) {
        return carrinhoAtual
      }

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

        if (novaQuantidade < 1 || novaQuantidade > item.estoque) {
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

  // FINALIZAR PEDIDO NO SPRING BOOT
  async function finalizarPedido() {

    if (finalizando) {
      return
    }

    if (carrinho.length === 0) {
      setErroPedido('Adicione produtos ao carrinho.')
      return
    }

    if (
      usuarioId.trim() === '' ||
      !Number.isSafeInteger(Number(usuarioId)) ||
      Number(usuarioId) <= 0
    ) {
      setErroPedido('Informe um ID de usuário válido.')
      return
    }

    setFinalizando(true)
    setMensagemPedido('')
    setErroPedido('')

    const pedido = {
      usuarioId: Number(usuarioId),
      itens: carrinho.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade
      }))
    }

    let pedidoCriado = null

    try {
      const resposta = await fetch(
        'http://localhost:8080/pedidos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pedido)
        }
      )

      if (!resposta.ok) {
        const dadosErro = await resposta.json().catch(() => null)

        throw new Error(
          dadosErro?.message ||
          dadosErro?.mensagem ||
          'Não foi possível finalizar o pedido.'
        )
      }

      pedidoCriado = await resposta.json()

      setMensagemPedido(
        `Pedido #${pedidoCriado.id} criado com sucesso!`
      )

      setCarrinho([])

    } catch (error) {
      setErroPedido(
        error.message || 'Erro ao finalizar pedido.'
      )
    } finally {
      setFinalizando(false)
    }

    // Atualiza o catálogo somente após a compra confirmada
    if (pedidoCriado) {
      try {
        const resposta = await fetch(
          `http://localhost:8080/produtos/paginados?page=${pagina}&size=8`
        )

        if (resposta.ok) {
          const dados = await resposta.json()

          setProdutos(dados.content)
          setTotalPaginas(dados.page.totalPages)
        }
      } catch (error) {
        console.error(
          'Pedido criado, mas não foi possível atualizar o catálogo:',
          error
        )
      }
    }
  }

  return (
    <div className="container">

      {/* CABEÇALHO */}
      <h1>Minha Loja</h1>

      <p>Bem-vindo à nossa loja virtual!</p>

      <CadastroUsuario 
        onUsuarioCadastrado={() => {
          setAtualizacaoUsuarios(valorAtual => valorAtual + 1)
        }}
      />
      <ListaUsuarios
        atualizacaoUsuarios={atualizacaoUsuarios}
      />

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
    <ListaProdutos
          produtos={produtos}
          carrinho={carrinho}
          adicionarAoCarrinho={adicionarAoCarrinho}
          finalizando={finalizando}
          formatarMoeda={formatarMoeda}
        />

    {/* PAGINAÇÃO */}
    {totalPaginas > 0 && (
      <div className="paginacao">
        <button
          onClick={paginaAnterior}
          disabled={pagina === 0 || finalizando}
        >
          Anterior
        </button>

        <span>
          Página {pagina + 1} de {totalPaginas}
        </span>

        <button
          onClick={proximaPagina}
          disabled={pagina >= totalPaginas - 1 || finalizando}
        >
          Próxima
        </button>
      </div>
    )}
  </>
)}


      {/* CARRINHO DE COMPRAS */}

<Carrinho
  carrinho={carrinho}
  alterarQuantidade={alterarQuantidade}
  removerDoCarrinho={removerDoCarrinho}
  valorTotal={valorTotal}
  formatarMoeda={formatarMoeda}
  finalizando={finalizando}
>
  {carrinho.length > 0 && (
    <div className="finalizar-pedido">
      <h3>Finalizar compra</h3>

      <label htmlFor="usuarioId">Selecione o usuário:</label>

      <select 
        id="usuarioId"
        value={usuarioId}
        onChange={e => setUsuarioId(e.target.value)}
        disabled={finalizando || carregandoUsuarios}
        >
          <option value="">Selecione um usuário</option>

          {usuarios.map(usuario =>(
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome} - ID: {usuario.id}
            </option>
          ))}
      </select>

      <button 
        type="button"
        onClick={buscarUsuariosCheckout}
          disabled={carregandoUsuarios || finalizando}
        >
          {carregandoUsuarios ? 'Carregando...' : 'Carregar usuários'}
      </button>

      {erroUsuarios && (
        <p className="erro">{erroUsuarios}</p>
      )}

      <button
        className="btn-finalizar"
        onClick={finalizarPedido}
        disabled={finalizando || carrinho.length === 0}
      >
        {finalizando ? 'Finalizando...' : 'Finalizar pedido'}
      </button>
    </div>
  )}

  {mensagemPedido && (
    <p className="mensagem-sucesso">{mensagemPedido}</p>
  )}

  {erroPedido && (
    <p className="erro">{erroPedido}</p>
  )}
</Carrinho>


<HistoricoPedidos
  historico={historico}
  buscarHistorico={buscarHistorico}
  carregandoHistorico={carregandoHistorico}
  erroHistorico={erroHistorico}
  formatarMoeda={formatarMoeda}
/>


    </div>
  )
}

export default App
