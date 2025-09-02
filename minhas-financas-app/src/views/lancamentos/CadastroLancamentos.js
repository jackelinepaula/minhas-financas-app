import React, { Component } from 'react'

import { withRouter } from 'react-router-dom'
import FormGroup from '../../components/FormGroup'

import Card from '../../components/Card'

import LancamentoService from '../../app/service/lancamentoService'
import SelectMenu from '../../components/SelectMenu'
import { mensagemErro, mensagemSucesso } from '../../components/Toast'

import Button from '../../components/Button'
import CategoriaService from '../../app/service/categoriaService'

import Modal from '../../components/Modal'

import { meses, tiposLancamento } from '../../constants/constants'
import { sortOrdemAlfabetica } from '../../utils/sorts'
import { maskInputMoeda } from '../../utils/mask'
import MapaCadastro from '../../components/MapaCadastro'

class CadastroLancamentos extends Component {

    state = {
        id: null,
        descricao: '',
        valorMask: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        categoria: '',
        latitude: '',
        longitude: '',
        categorias: [],
        usuario: null,
        atualizando: false,
        showModalMapa: false
    }

    constructor() {
        super();
        this.service = new LancamentoService();
        this.categoriaService = new CategoriaService();
    }

    toogleModalMapa = () => {
        this.setState(prevState => ({ showModalMapa: !prevState.showModalMapa }))
    }

    setCoordenadas = (latitude, longitude) => {
        this.setState({latitude: latitude.toFixed(6)})
        this.setState({longitude: longitude.toFixed(6)})
    }

    navegarConsultar = () => {
        this.props.history.push('/consulta-lancamentos')
    }

    submit = () => {

        const { descricao, categoria, valor, mes, ano, tipo, latitude, longitude } = this.state
        const lancamento = { descricao, categoria, valor: valor.toString(), mes, ano, tipo, latitude, longitude }

        try {
            this.service.validar(lancamento)
        } catch (erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(msg => mensagemErro(msg))
            return false
        }

        this.service.salvar(lancamento)
            .then((res) => {
                this.props.history.push('/consulta-lancamentos')
                mensagemSucesso("Lançamento cadastrado.")
            }).catch(erro => {
                mensagemErro(erro.response.data)
            })

    }

    atualizar = () => {
        const { descricao, categoria, valor, mes, ano, tipo, status, latitude, longitude, id } = this.state;

        const lancamento = { descricao, categoria, valor: valor.toString(), mes, ano, tipo, status, latitude, longitude, id };

        this.service.atualizar(lancamento)
            .then((res) => {
                this.props.history.push('/consulta-lancamentos')
                mensagemSucesso("Lançamento atualizado.")
            })
            .catch(erro => {
                mensagemErro(erro.response.data)
            })

    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;


        this.setState({ [name]: value })

        //Estou verificando se o valor do campo 'valor' é negátivo

        if (name === "valor") {
            if (value.includes('-')) {
                this.setState({ valor: '0' })
            }
        }
    }

    handleMoeda = (e) => {
        e.preventDefault()

        const valorInput = e.target.value === "" ? "0" : e.target.value

        const valores = maskInputMoeda(valorInput)

        this.setState({
            valor: valores.valorPuro,
            valorMask: valores.valorFormatado
        })
    }

    buscarCategorias = () => {
        this.categoriaService.getListaCategorias()
            .then((response) => {
                const categorias = sortOrdemAlfabetica((response.data));

                //Mapeando categorias de acordo com o select [label e value]
                const listaCategorias = [{ label: 'Selecione', value: '' }, ...categorias.map(c => ({ label: c.descricao, value: c.id }))]

                this.setState({ categorias: listaCategorias })

            }).catch(erro => {
                mensagemErro(erro.response)
            })

    }

    componentDidMount() {
        const params = this.props.match.params

        //Verificando se existe o param D para só então entrar na tela de atualizar lançamento

        if (params.id) {
            this.service
                .getPorId(params.id)
                .then((res) => {

                    const valores = maskInputMoeda((parseFloat(res.data.valor)).toFixed(2).toString())

                    this.setState({ valorMask: valores.valorFormatado, valor: valores.valorPuro, ...res.data, atualizando: true })
                })
                .catch((erro) => {
                    mensagemErro(erro.response)
                })
        }

        //Populando o select de categorias
        this.buscarCategorias()

    }

    render() {

        return (

            <>
                <Card title={this.state.atualizando ? "Atualizar Lançamento" : "Cadastro de Lançamento"}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <FormGroup id="inputDescricao" label="*Descrição: ">
                                <input id="inputDescricao" type='text' value={this.state.descricao} className='form-control' name='descricao' onChange={this.handleChange}
                                    placeholder='Digite uma descrição' />
                            </FormGroup>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <FormGroup id="inputAno" label="*Ano: ">
                                <input id="inputAno" type='number' value={this.state.ano} className='form-control' name='ano' onChange={this.handleChange}
                                    placeholder='Digite o ano do lançamento' />
                            </FormGroup>
                        </div>
                        <div className='col-md-4'>
                            <FormGroup id="inputMes" label="*Mês: ">
                                <SelectMenu id="inputMes"
                                    name="mes"
                                    className="form-control"
                                    lista={meses}
                                    value={this.state.mes}
                                    onChange={this.handleChange} />
                            </FormGroup>
                        </div>
                        <div className='col-md-4'>
                            <FormGroup id="inputCategoria" label="Categoria: ">
                                <SelectMenu id="inputCategoria"
                                    name="categoria"
                                    className="form-control"
                                    lista={this.state.categorias}
                                    value={this.state.categoria}
                                    onChange={this.handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <FormGroup id="inputValor" label="*Valor: ">
                                <input id="inputValor"
                                    type="text"
                                    min={0}
                                    name="valor"
                                    placeholder='R$ 0,00'
                                    value={this.state.valorMask}
                                    className="form-control"
                                    onChange={this.handleMoeda} />
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup id="inputTipo" label="*Tipo: ">
                                <SelectMenu id="inputTipo"
                                    name="tipo"
                                    className="form-control"
                                    value={this.state.tipo}
                                    lista={tiposLancamento}
                                    onChange={this.handleChange} />
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup id="inputStatus" label="Status: ">
                                <input
                                    type="text"
                                    name="status"
                                    className="form-control"
                                    disabled
                                    value={this.state.status}
                                />
                            </FormGroup>
                        </div>

                        <div className="col-md-4">
                            <FormGroup id="inputLatitude" label="Latitude: ">
                                <input
                                    type="number"
                                    name="latitude"
                                    className="form-control"
                                    disabled
                                    onChange={this.handleChange}
                                    value={this.state.latitude}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-4">
                            <FormGroup id="inputLongitude" label="Longitude: ">
                                <input
                                    type="number"
                                    name="longitude"
                                    disabled
                                    className="form-control"
                                    onChange={this.handleChange}
                                    value={this.state.longitude}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-4">
                            <FormGroup id="inputLongitude" label="Selecione um ponto no mapa: ">
                                <Button className='outline-dark form-control justify-content-center' icone="map" label='Abrir no mapa' onClick={this.toogleModalMapa} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className='container-button'>
                        {
                            this.state.atualizando ?
                                (<Button className='info' onClick={this.atualizar} icone="refresh" label='Atualizar' />) :
                                (<Button className='success' onClick={this.submit} icone="save" label='Salvar' />)
                        }
                        <Button className='danger' onClick={this.navegarConsultar} icone="times" label='Cancelar' />
                    </div>
                </Card>

                <Modal header={"Escolha um ponto no mapa"} breakpoints={{ '1360px': '90vw', '1050px': '75vw' }} visible={this.state.showModalMapa} onhide={this.toogleModalMapa}>
                    <MapaCadastro prevLatitude={this.state.latitude} prevLongitude={this.state.longitude} setCoordenadas={this.setCoordenadas} fecharMapa={this.toogleModalMapa}/>
                </Modal>
            </>


        )
    }
}

export default withRouter(CadastroLancamentos)