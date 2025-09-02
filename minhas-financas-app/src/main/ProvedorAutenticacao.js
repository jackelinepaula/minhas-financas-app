import React, { Component } from 'react'
import AuthService from '../app/service/authService'

import ApiService from '../app/apiservice'
import jwt from 'jsonwebtoken'

export const AuthContext = React.createContext()
export const AuthConsumer = AuthContext.Consumer


const AuthProvider = AuthContext.Provider


class ProvedorAutenticacao extends Component {

    state = {
        usuarioAutenticado: null,
        estaAutenticado: false,
        isLoading: true
    }

    iniciarSessao = (tokenDTO) => {
        const token = tokenDTO.token

        //Decodificando os claims do token
        const claims = jwt.decode(token)
        const usuario = {
            id: claims.userid,
            nome: claims.nome
        }

        ApiService.registrarToken(token)
        AuthService.logar(usuario, token)
        this.setState({ estaAutenticado: true, usuarioAutenticado: usuario })
    }

    encerrarSessao = () => {
        AuthService.deslogar()
        this.setState({ estaAutenticado: false, usuarioAutenticado: null })
    }

    componentDidMount(){
        const estaAutenticado = AuthService.estaLogado()
        if(estaAutenticado){
            const usuario = AuthService.refreshSession()
            this.setState({
                usuarioAutenticado: usuario,
                estaAutenticado: true,
                isLoading: false
            })
        }else{
            this.setState(previousState => {
                return {
                    ...previousState, 
                    isLoading: false
                }
            })
        }
    }

    render() {

        if(this.state.isLoading){
            return null
        }

        const contexto = {
            usuarioAutenticado: this.state.usuarioAutenticado,
            estaAutenticado: this.state.estaAutenticado,
            iniciarSessao: this.iniciarSessao,
            encerrarSessao: this.encerrarSessao
        }

        return (
            <AuthProvider value={contexto}>
                {this.props.children}
            </AuthProvider>
        )
    }

}

export default ProvedorAutenticacao