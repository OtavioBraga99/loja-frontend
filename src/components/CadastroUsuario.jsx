import { useState } from 'react'
import { cadastrarUsuario } from '../services/usuarioService'

function CadastroUsuario({ onUsuarioCadastrado }) {

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cadastrando, setCadastrando] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const [erro, setErro] = useState('')

    async function realizarCadastro() {
        if(nome.trim() === '' || email.trim() === '') {
            setErro('Preencha todos os campos.')
            return
        }

        setCadastrando(true)
        setMensagem('')
        setErro('')

        try {
            const usuario = await cadastrarUsuario(nome, email)

            setMensagem(`Usuário cadastrado com sucesso! ID: ${usuario.id}`)

            setNome('')
            setEmail('')

            if (onUsuarioCadastrado){
                onUsuarioCadastrado()
            }

        } catch (error) {
            setErro(error.message)
        } finally {
            setCadastrando(false)
        }
    }

    return (
    <section className="carrinho">

            <h2>Cadastro de Usuário</h2>

      <div className="finalizar-pedido">

        <label htmlFor="nome">Nome:</label>

                <input 
                    id="nome"
                    type="text"
          placeholder="Digite seu nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)} 
                />

        <label htmlFor="email">E-mail:</label>

                <input 
                    id="email"
          type="email"
          placeholder="Digite seu e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <button
                className="btn-finalizar"
                    type="button"
                    onClick={realizarCadastro}
                    disabled={cadastrando}
                    >
                    {cadastrando ? 'Cadastrando...' : 'Cadastrar'}
                </button>

            </div>

            {mensagem && (
                <p className="mensagem-sucesso">{mensagem}</p>
            )}

            {erro && (
                <p className="erro">{erro}</p>
            )}

        </section>
    )
}
export default CadastroUsuario
