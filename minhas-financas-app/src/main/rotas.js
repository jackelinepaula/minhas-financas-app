import React from "react";

import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Login from "../views/Login";
import CadastroUsuario from "../views/CadastroUsuario";
import Home from "../views/Home";
import ConsultaLancamentos from "../views/lancamentos/ConsultaLancamentos";
import CadastroLancamentos from "../views/lancamentos/CadastroLancamentos";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { AuthConsumer } from "./ProvedorAutenticacao";
import LandingPage from "../views/LandingPage";

function RotaAutenticada({ component: Component, estaAutenticado, ...props }) {
    return (
        <Route {...props} render={(componentProps) => {
            if (estaAutenticado) {
                return (
                    <Component {...componentProps} />
                )
            } else {
                return (
                    //Pathname para onde quero ir - State from é de onde viemos - isso serve para não perder o histórico no browser
                    <Redirect to={{ pathname: '/login', state: { from: componentProps.location } }} />
                )
            }
        }} />
    )
}

function Rotas(props) {
    return (
        <BrowserRouter basename='/jack'>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/cadastro-usuarios" component={CadastroUsuario} />
                <RotaAutenticada estaAutenticado={props.estaAutenticado} path="/home" component={Home} />
                <RotaAutenticada estaAutenticado={props.estaAutenticado} path="/consulta-lancamentos" component={ConsultaLancamentos} />
                <RotaAutenticada estaAutenticado={props.estaAutenticado} path="/cadastro-lancamentos/:id?" component={CadastroLancamentos} />
            </Switch>
        </BrowserRouter>
    )

}



export default () => (
    <AuthConsumer>
        {(context) => (<Rotas estaAutenticado={context.estaAutenticado} />)}
    </AuthConsumer>
)