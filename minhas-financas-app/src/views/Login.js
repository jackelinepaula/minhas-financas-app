import React, { Component } from 'react'
import Card from '../components/Card'
import FormGroup from '../components/FormGroup'

import {withRouter} from 'react-router-dom'

import UsuarioService from '../app/service/usuarioService'

import { mensagemErro } from '../components/Toast'

import { AuthContext } from '../main/ProvedorAutenticacao'
import Button from '../components/Button'

class Login extends Component {

    state = {
        email: "",
        senha: "",
    }

    constructor(){
        super()
        this.service = new UsuarioService()
    }

    entrar = async () => {
        
        let obj = {
            email: this.state.email,
            senha: this.state.senha
        }

        this.service.autenticar(obj)
        .then(res => {
            this.context.iniciarSessao(res.data)
            this.props.history.push('/home')
        }).catch(erro => {
            mensagemErro(erro.response.data)
        })
        
    }

    handleKeyEnter = (e) => {
        if(e.key === "Enter"){
            this.entrar()
        }
    }

    navegarCadastrar = () => {
        this.props.history.push('/cadastro-usuarios')
    }

    componentDidMount = () => {
        if(this.context.estaAutenticado){
            this.props.history.push('/home')
        }
    }

    render() {
        return (
                <div className='row'>
                    <div className='col-md-6 offset-md-3'>

                        {/* Section para os cards */}
                        <div className='bs-docs-section'>

                            {/* Card */}
                            <Card title="Login">
                                <div className='row'>
                                    <span>{this.state.mensagemErro}</span>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='bs-component'>

                                            {/* Formulário */}
                                            <fieldset>
                                                <FormGroup label="*Email: " htmlFor="inputEmail" >

                                                    <input type='email'
                                                        value={this.state.email}
                                                        onChange={e => this.setState({ email: e.target.value })}
                                                        className='form-control'
                                                        id='inputEmail'
                                                        aria-describedby='emailHelp'
                                                        placeholder='Digite o email' 
                                                        onKeyDown={this.handleKeyEnter}/>

                                                </FormGroup>
                                                <FormGroup label="*Senha: " htmlFor="inputSenha">

                                                    <input type='password'
                                                        value={this.state.senha}
                                                        onChange={e => this.setState({ senha: e.target.value })}
                                                        className='form-control'
                                                        id='inputSenha'
                                                        aria-describedby='emailHelp'
                                                        placeholder='Digite sua senha' 
                                                        onKeyDown={this.handleKeyEnter}/>

                                                </FormGroup>

                                                <div className='container-button '>
                                                    <Button type={"submit"} onClick={this.entrar} className='success' label="Entrar" icone="sign-in"/>
                                                    <Button onClick={this.navegarCadastrar} className='btn btn-danger' label="Cadastrar" icone="plus"/>
                                                </div>
                                            </fieldset> 

                                        </div>
                                    </div>
                                </div>
                            </Card>

                        </div>

                    </div>
                </div>
        )
    }
}

Login.contextType = AuthContext

export default withRouter(Login)