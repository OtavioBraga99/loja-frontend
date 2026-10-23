const API_URL = 'http://localhost:8080/produtos'

export async function listarProdutosPaginados(pagina, tamanho = 8, signal) {
    const resposta = await fetch(
        `${API_URL}/paginados?page=${pagina}&size=${tamanho}`,{ signal }
    )

    if (!resposta.ok) {
        throw new Error('Não foi possível carregar os produtos.')
    }

    return await resposta.json()
}