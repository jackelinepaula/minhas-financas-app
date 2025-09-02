import React from "react";
import NavItem from "./NavItem";
import { AuthConsumer } from "../main/ProvedorAutenticacao";


function NavBar(props) {

    const BASEURL = "/jack"

    return (
        <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
            <div className="container">

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarResponsive">

                    <ul className="navbar-nav">

                        <NavItem render={props.estaAutenticado} href= {BASEURL+"/home"} label="Início" />
                        <NavItem render={props.estaAutenticado} href={BASEURL+"/cadastro-usuarios"} label="Usuários" />
                        <NavItem render={props.estaAutenticado} href={BASEURL+"/consulta-lancamentos"} label="Lançamentos" />
                        <NavItem render={props.estaAutenticado} onClick={props.logout} href={BASEURL+"/login"} label="Sair" />

                    </ul>

                </div>

                <a href={BASEURL+"/"} className="navbar-brand">Minhas Finanças</a>

            </div>
        </div>

    )
}

export default () => (
    <AuthConsumer>
        {(context) => (<NavBar estaAutenticado={context.estaAutenticado} logout={context.encerrarSessao} />)}
    </AuthConsumer>
)