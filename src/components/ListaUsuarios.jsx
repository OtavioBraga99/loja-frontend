import { useEffect, useState } from 'react';

function ListaUsuarios({ atualizacaoUsuarios }){
    const [usuarios, setUsuarios] = useState([])
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState('')

    async function buscarUsuarios() {
        setCarregando(true)
        setErro('')

        try {
            const resposta = await fetch('http://localhost:8080/usuarios')

            if (!resposta) {
                throw new Error('Não foi possível buscar os usuários.')
            }

            const dados = await resposta.json()

            setUsuarios(dados)

        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        if(atualizacaoUsuarios === 0) {
            return
        }

        let ativo = true 

        async function atualizarUsuarios() {
            try {
                const resposta = await fetch('http://localhost:8080/usuarios')

                if (!resposta.ok) {
                    throw new Error('Não foi possível atualizar os usuários.')
                }

                const dados = await resposta.json()

                if (ativo) {
                    setUsuarios(dados)
                    setErro('')
                }
        
            } catch (error) {
                if (ativo) {
                    setErro(error.message)
                }
            }
        }   
        
        atualizarUsuarios()

        return () => {
            ativo = false
        }
    }, [atualizacaoUsuarios])

    return (
        <section className="carrinho">
            <h2>Usuários cadastrados</h2>

            <button 
                className="btn-finalizar"
                onClick={buscarUsuarios}
                disabled={carregando}
            >
                {carregando ? 'Buscando...' : 'Buscar usuários'}
                    
            </button>

            <p>Total de usuários{usuarios.length}</p>
            
            {erro && (
                <p className="erro">{erro}</p>
            )}

            {usuarios.map(usuario => (
                <div className="carrinho-item" key={usuario.id}>
                    <div>
                        <h3>{usuario.nome}</h3>
                        <p>ID: {usuario.id}</p>
                        <p>Email: {usuario.email}</p>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default ListaUsuarios