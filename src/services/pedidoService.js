const API_URL = 'http://localhost:8080/pedidos'

export async function criarPedido(pedido) {
    const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })

    if (!resposta.ok) {
        const dadosErro = await resposta.json().catch(() => null)

        throw new Error(
            dadosErro?.message ||
            dadosErro?.mensagem ||
            'Não foi possível finalizar o pedido'
        )
    }

    return await resposta.json()
}

export async function listarPedidoPorUsuario(usuarioId) {
    const resposta = await fetch(
        `${API_URL}/usuario/${usuarioId}`
    )

    if (!resposta.ok) {
        throw new Error('Não foi possível carregar o histórico de pedidos')
    }

    return await resposta.json()
}