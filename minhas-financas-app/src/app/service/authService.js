import ApiService from "../apiservice";
import LocalStorageService from "./localStorageService";

import jwt from 'jsonwebtoken'

export const USUARIO_LOGADO = "_usuario_logado"
export const TOKEN = "_access_token"

export default class AuthService {
    
    static estaLogado(){

        const token = LocalStorageService.obterItem(TOKEN)

        if(!token){
            return false;
        }

        const decodedToken = jwt.decode(token)

        const expiration = decodedToken.exp

        const isTokenInvalido = Date.now() >= (expiration * 1000)
        
        return !isTokenInvalido
    }

    static deslogar(){
        LocalStorageService.removerItem(USUARIO_LOGADO)
        LocalStorageService.removerItem(TOKEN)
    }

    static logar(usuario, token){
        LocalStorageService.adicionarItem(USUARIO_LOGADO, usuario)
        LocalStorageService.adicionarItem(TOKEN, token)
        ApiService.registrarToken(token)
    }

    static obterUsuarioAutenticado(){
        return LocalStorageService.obterItem(USUARIO_LOGADO)
    }

    //Refresh na sessão
    static refreshSession(){
        const token = LocalStorageService.obterItem(TOKEN)
        const usuario = AuthService.obterUsuarioAutenticado()
        AuthService.logar(usuario, token)

        return usuario
    }

}