import React, { Component } from "react"

import Card from "../components/Card"
import FormGroup from "../components/FormGroup"
import Button from "../components/Button"

import UsuarioService from "../app/service/usuarioService"

import { mensagemErro, mensagemSucesso } from '../components/Toast'

class CadastroUsuario extends Component {

    state = {
        nome: "",
        email: "",
        senha: "",
        senhaRep: ""
    }

    constructor(){
        super()
        this.service = new UsuarioService()
    }

    cadastrar = () => {

        const { nome, email, senha, senhaRep} = this.state
        const usuario = {nome, email, senha, senhaRep}


        try {
            this.service.validar(usuario)
        } catch (erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(mensagem => mensagemErro(mensagem))
            return false
        }

        this.service.salvarUsuario(usuario)
        .then(res => {
            mensagemSucesso('Cadastro feito com sucesso! Faça o login para acessar o sistema.')
            this.props.history.push('/login')
        }).catch(erro => {
            mensagemErro(erro.response.data)
        })

    }

    cancelarCadastrar = () => {
        this.props.history.push('/login')
    }

    render() {
        return (
            
                <Card title="Cadastro de Usuário">

                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='bs-component'>

                                {/* Formulário */}
                                <fieldset>
                                    <FormGroup label="*Nome: " htmlFor="inputNome">
                                        <input type="text"
                                            id="inputNome"
                                            name="nome"
                                            className="form-control"
                                            placeholder='Digite seu nome'
                                            onChange={e => this.setState({ nome: e.target.value })} />

                                    </FormGroup>

                                    <FormGroup label="*Email: " htmlFor="inputEmail">
                                        <input type="text"
                                            id="inputEmail"
                                            name="email"
                                            className="form-control"
                                            placeholder='Digite seu email'
                                            onChange={e => this.setState({ email: e.target.value })} />
                                    </FormGroup>

                                    <FormGroup label="*Senha: " htmlFor="inputSenha">
                                        <input type='password'
                                            id="inputSenha"
                                            name="senha"
                                            className="form-control"
                                            placeholder='Digite sua senha'
                                            onChange={e => this.setState({ senha: e.target.value })} />
                                    </FormGroup>

                                    <FormGroup label="*Confirme sua senha: " htmlFor="inputSenha">
                                        <input type='password'
                                            id="inputSenha"
                                            name="senha"
                                            className="form-control"
                                            placeholder='Confirme sua senha'
                                            onChange={e => this.setState({ senhaRep: e.target.value })} />
                                    </FormGroup>
                                    <div className='container-button'>
                                        <Button onClick={this.cadastrar} type="Button" className="success" label="Salvar" icone='save'/>
                                        <Button onClick={this.cancelarCadastrar} type="Button" className="danger" label="Cancelar" icone='times'/>
                                    </div>
                                </fieldset>

                            </div>
                        </div>
                    </div>


                </Card>
        )
    }
}

export default CadastroUsuario