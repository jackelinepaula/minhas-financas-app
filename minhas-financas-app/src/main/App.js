import React, { Component } from 'react';
import '../App.css';

import 'bootswatch/dist/flatly/bootstrap.css'
import '../estilo.css'

import 'toastr/build/toastr.min'
import 'toastr/build/toastr.css'
        

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-cyan/theme.css';

import Rotas from './rotas';
import NavBar from '../components/NavBar';

import ProvedorAutenticacao from './ProvedorAutenticacao';



class App extends Component {

  render() {
    return (
      
      <ProvedorAutenticacao>
        <NavBar />
        <div className="container">
          <Rotas />
        </div>
      </ProvedorAutenticacao>

    );
  }
}

export default App;
