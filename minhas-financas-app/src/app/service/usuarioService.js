import ApiService from "../apiservice";

import ErroValidacao from "../exception/ErroValidacao";

class UsuarioService extends ApiService {

    constructor() {
        super('/usuarios')
    }

    autenticar(credenciais) {
        return this.post('/auth', credenciais)
    }

    obterSaldoPorId(id) {
        return this.get(`/${id}/saldo`)
    }

    salvarUsuario(usuario) {
        return this.post('', usuario)
    }

    validar(usuario) {
        const erros = []

        if (!usuario.nome) {
            erros.push('O campo Nome é obrigatório')
        }

        if (!usuario.email) {
            erros.push('O campo Email é obrigatório')

        } else if (!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            erros.push('Insira um Email válido')
        }

        if (!usuario.senha) {
            erros.push('Insira uma Senha')
        }

        if (!usuario.senhaRep) {
            erros.push('Confirme sua Senha')
        } else if (usuario.senha !== usuario.senhaRep) {
            erros.push('As senhas tem que ser iguais')
        }

        if (erros && erros.length > 0) {
            throw new ErroValidacao(erros)
        }
        return erros
    }

}

export default UsuarioService