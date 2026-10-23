import { useState } from 'react'

export function useCarrinho() {
    const [carrinho, setCarrinho ] = useState([])

    function adicionarAoCarrinho(produto) {
        setCarrinho(atual => {
            const produtoExistente = atual.find(
                item => item.id === produto.id
            )

            if (produtoExistente) {
                return atual.map(item =>
                    item.id === produto.id
                        ? { ...item, quantidade: item.quantidade +1}
                        : item
                )
            }

            return [...atual, { ...produto, quantidade: 1}]
        })
    }

    function removerDoCarrinho(produtoId) {
        setCarrinho(atual =>
            atual.filter(item => item.id !== produtoId)
        )
    }

    function alterarQuantidade(produtoId, diferenca) {
        setCarrinho(carrinhoAtual =>
            carrinhoAtual.map(item => {
                if(item.id !== produtoId) {
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

    function limparCarrinho() {
        setCarrinho ([])
    }

    const quantidadeItens = carrinho.reduce(
        (total, item) => total + item.quantidade, 0
    )

    const valorTotal = carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade, 0
    )

    return (
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        alterarQuantidade,
        limparCarrinho,
        quantidadeItens,
        valorTotal
    )
}