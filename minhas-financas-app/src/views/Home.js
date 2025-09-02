import React, { Component } from "react";
import UsuarioService from "../app/service/usuarioService";

import currencyFormatter from 'currency-formatter'

import { AuthContext } from "../main/ProvedorAutenticacao";
import { mensagemErro } from "../components/Toast";
import Button from "../components/Button";

class Home extends Component {

    state = {
        saldo: 0
    }

    constructor(){
        super()
        this.service = new UsuarioService()
    }

    navegarCadastrarLancamento = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    navegarCadastrarUsuario = () => {
        this.props.history.push('/cadastro-usuarios')
    }


    componentDidMount() {
        const usuarioLogado = this.context.usuarioAutenticado

        this.service.obterSaldoPorId(usuarioLogado.id)
            .then(res => {
                this.setState({saldo: res.data})
            }).catch(erro => {
                mensagemErro(erro.response.data)
            })
    }

    render() {
        return (
            <div className="jumbotron" >
                <h1 className="display-4 title-home">Bem vindo!</h1>
                <p className="lead">Esse é seu sistema de finanças.</p>
                <p className="lead">Seu saldo para o mês atual é de <span className="font-weight-bold">{currencyFormatter.format(this.state.saldo, { locale: 'pt-BR' })}</span></p>
                <hr className="my-4" />
                <p className="lead">Essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
                <div className="lead container-button">
                    <Button className="primary btn-lg" onClick={this.navegarCadastrarUsuario} icone="users" label="Cadastrar usuário"/>
                    <Button className="info btn-lg" onClick={this.navegarCadastrarLancamento} icone="money-bill" label="Cadastrar lançamento"/>
                </div>
            </div>
        )
    }
}

Home.contextType = AuthContext

export default Home