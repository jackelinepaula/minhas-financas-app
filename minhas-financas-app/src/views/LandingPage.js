import React, { Component } from 'react'
import Button from '../components/Button'

class LandingPage extends Component{

    navegarHome = () => {
        this.props.history.push("/home")
    }

    render(){
        return(
            <div className='container d-flex flex-column align-items-center text-center'>
                <h2 className='title-main'>Bem vindo ao sistema <span>Minhas Finanças</span></h2>
                <p className='text-main'>Este é seu sistema para controle de finanças pessoais, clique no botão abaixo para acessar o sistema</p>
                <div className='col-md-4 container-button text-center d-flex justify-content-center'>
                    <Button onClick={this.navegarHome} className='success btn-landing' label="Acessar" icone="sign-in"/>
                </div>
            </div>
        )
    }
}

export default LandingPage