const API_URL = 'http://localhost:8080/usuarios'

export async function listarUsuarios() {
  const resposta = await fetch(API_URL)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os usuários.')
  }

  return await resposta.json()
}

export async function cadastrarUsuario(nome, email) {
    const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({nome, email})
    })

    if (!resposta.ok) {
        throw new Error('Não foi possível cadastrar usuário.')
    }

    return await resposta.json()
}
