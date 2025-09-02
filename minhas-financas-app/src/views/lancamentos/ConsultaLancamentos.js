import React, { Component } from 'react'

import Card from '../../components/Card'
import FormGroup from '../../components/FormGroup'
import SelectMenu from '../../components/SelectMenu'
import TableLancamentos from './TableLancamentos'
import { mensagemAlerta, mensagemErro, mensagemSucesso } from '../../components/Toast'
import LancamentoService from '../../app/service/lancamentoService'

import { formatosArquivo, meses, tiposLancamento } from '../../constants/constants'

import { sortOrdemAlfabetica } from '../../utils/sorts'

import LocalStorageService from '../../app/service/localStorageService'

import { ConfirmDialog } from 'primereact/confirmdialog'
import Button from '../../components/Button'
import CategoriaService from '../../app/service/categoriaService'
import Modal from '../../components/Modal'
import Mapa from '../../components/Mapa'

class ConsultaLancamentos extends Component {

    state = {
        ano: '',
        tipo: '',
        mes: '',
        descricao: '',
        categoria: '',
        lancamentos: [],
        categorias: [],
        lancamentoDeletar: {},
        descricaoCategoria: '',
        formatoExportacao: '',
        estaExportando: '',
        estaEnviando: '',
        alertModal: '',
        logErros: '',
        arquivoSelecionado: '',
        showConfirmDialog: false,
        showModalCategoria: false,
        showModalUpload: false,
        showModalExportar: false,
        showModalMapa: false,
    }

    constructor() {
        super()
        this.lancamentoService = new LancamentoService()
        this.categoriaService = new CategoriaService()
    }

    navegarCadastrar = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    //Esse método limpa input do modal de cadastro de categoria
    clearInput = () => {

        this.setState({
            descricaoCategoria: '',
            logErros: '',
            arquivoSelecionado: '',
            alertModal: '',
        });

    }

    // Modal

    confirmarExclusao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento })
    }

    cancelarExclusao = (lancamento) => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} })
    }

    confirmDialogFooter = () => {
        return (
            <div className='container-button d-flex justify-content-end'>
                <div className="d-flex button-container">
                    <Button label={"Cancelar"} onClick={this.cancelarExclusao} className="btn btn-cancelar" />
                    <Button label={"Confirmar"} onClick={this.deletar} className="btn btn-info" />
                </div>
            </div>
        )
    }

    toggleModalCategoria = () => {
        this.setState(prevState => ({ showModalCategoria: !prevState.showModalCategoria }))
        this.clearInput()
    }

    toggleModalUpload = () => {
        this.setState(prevState => ({ showModalUpload: !prevState.showModalUpload }))
        this.clearInput()
    }

    toogleModalMapa = () => {
        this.setState(prevState => ({ showModalMapa: !prevState.showModalMapa }))
    }

    toggleModalExportar = () => {
        this.setState(prevState => ({ showModalExportar: !prevState.showModalExportar }))
    }

    paramsMapa = () => {

        const item = LocalStorageService.obterItem('_usuario_logado')

        const {descricao, tipo, valor, mes, ano, categoria } = this.state;

        if(this.state.lancamentos){
            return {
                idUsuario: item.id,
                descricao: descricao || null,
                tipo: tipo || null,
                valor: valor || null,
                mes: mes || null,
                ano: ano || null,
                categoria: categoria || null
            };
        }

        
        return {
            idUsuario: item.id
        }
    }

    cadastrarCategoria = () => {
        const descricao = { descricao: this.state.descricaoCategoria }

        try {
            this.categoriaService.validar(this.state.descricaoCategoria)
        } catch (erro) {
            mensagemErro(erro.mensagens)
            return false
        }

        this.categoriaService.cadastrarCategoria(descricao)
            .then((res) => {
                mensagemSucesso("Categoria cadastrada com sucesso!")
                this.buscarCategorias()
                this.toggleModalCategoria()
            }).catch((erro) => {
                mensagemErro(erro.response.data)
            })


    }

    deletar = () => {
        this.lancamentoService.deletar(this.state.lancamentoDeletar.id)
            .then((res) => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)

                lancamentos.splice(index, 1)

                this.setState({ lancamentos: lancamentos, showConfirmDialog: false })

                mensagemSucesso('Lançamento deletado.')
            }).catch(erro => {
                mensagemErro(erro.response.data)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    alterarStatus = (lancamento, status) => {
        this.lancamentoService.alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);

                if (index !== -1) {
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento
                    this.setState({ lancamento: lancamento })
                }

                mensagemSucesso("Status atualizado")
            }).catch(erro => {
                mensagemErro(erro.response.data)
            })
    }

    buscar = () => {

        if (!this.state.ano) {
            mensagemErro("O preenchimento do Ano é obrigatório")
            return false
        }


        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            categoria: this.state.categoria
        }

        this.lancamentoService.consultar(lancamentoFiltro)
            .then((res) => {
                const lista = res.data
                if (res.data.length < 1) {
                    mensagemAlerta("Nenhum resultado encontrado.")
                }
                this.setState({ lancamentos: lista })
            }).catch((erro) => {
                mensagemErro(erro.response)
            })

    }

    downloadBusca = async (formato) => {

        this.toggleModalExportar()
        this.setState({ estaExportando: true })

        if (this.state.lancamentos.length === 0) {
            mensagemErro("Não há nenhuma busca para ser exportada")
            this.setState({ estaExportando: false })
            return false
        }

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            categoria: this.state.categoria,
            formato: formato
        }


        //Criando um delay para o efeito "exportando..."
        await new Promise(r => setTimeout(r, 500))


        this.lancamentoService.download(lancamentoFiltro)

            .then((response) => {

                const contentType = response.headers['content-type']

                //Verificando o formato de exportação
                let arquivo;

                if (formato === formatosArquivo.CSV) {
                    arquivo = response.data
                } else {
                    arquivo = JSON.stringify(response.data, null, 2)
                }

                //Criando um blob do arquivo
                const blob = new Blob([arquivo], { type: contentType })

                //Configurando uma URL para ser executada
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url;

                link.download = `busca-filtrada-lancamentos.${formato === formatosArquivo.CSV ? formatosArquivo.CSV : formatosArquivo.JSON}`

                document.body.appendChild(link);

                link.click()
                link.remove()

                window.URL.revokeObjectURL(url)
            })
            .catch((erro) => {
                console.log(erro)
            })
            .finally(() => {
                this.setState({ estaExportando: false })
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

    /** Funções de upload */
    limparAlertModal = () => {
        this.setState({ alertModal: '' })
    }

    selecionarArquivo = () => {
        /** Simulando um click */
        document.getElementById('arquivo').click()
    }

    pegarArquivo = (e) => {
        const arquivo = e.target.files[0]
        const validacao = this.lancamentoService.validarArquivo(arquivo);

        if (!validacao.valido) {
            this.setState({ alertModal: validacao.mensagem });
            return false;
        }

        this.setState({ arquivoSelecionado: arquivo });
    }

    handleDrop = (e) => {
        e.preventDefault();

        const arquivo = e.dataTransfer.files;

        const validacao = this.lancamentoService.validarArquivo(arquivo[0]);

        if (!validacao.valido) {
            this.setState({ alertModal: validacao.mensagem });
            return false;
        }

        this.setState({ arquivoSelecionado: arquivo[0] });

    }

    handleDragOver = (e) => {
        e.preventDefault();
    }

    cancelarArquivo = () => {
        this.setState({ arquivoSelecionado: null })
    }

    upload = async () => {
        this.setState({ estaEnviando: true })

        //Criando um delay para o efeito "exportando..."
        await new Promise(r => setTimeout(r, 800))

        this.lancamentoService.upload(this.state.arquivoSelecionado)
            .then((data) => {

                const { totalLinhas, sucessos, comCategoriaInexistente, erros, errosDetalhes } = data;

                if (erros === 0) {
                    mensagemSucesso(`Total de linhas processadas: ${totalLinhas}<br>Processadas com sucesso: ${sucessos}<br>Processadas com categoria inválida: ${comCategoriaInexistente}<br>Erros encontrados: ${erros}`)
                } else {
                    mensagemAlerta(`Total de linhas processadas: ${totalLinhas}<br>Processadas com sucesso: ${sucessos}<br>Processadas com categoria inválida: ${comCategoriaInexistente}<br>Erros encontrados: ${erros}`)
                }

                if (errosDetalhes && errosDetalhes.length > 0) {
                    this.setState({ logErros: JSON.stringify(errosDetalhes, null, 2) })
                } else {
                    this.toggleModalUpload()
                }

            }).catch((e) => {
                this.setState({ alertModal: e.response })
            }).finally(() => {
                this.setState({ estaEnviando: false })
                this.cancelarArquivo()
            })


    }

    baixarLogErros = () => {

        const arquivo = this.state.logErros

        //Criando um blob do arquivo
        const blob = new Blob([arquivo], { type: 'application/json' })

        //Configurando uma URL para ser executada
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url;

        link.download = `erros-de-upload.json`

        document.body.appendChild(link);

        //Simulando um click
        link.click()
        link.remove()

        window.URL.revokeObjectURL(url)

        this.toggleModalUpload()

    }

    componentDidMount() {
        this.buscarCategorias()
    }

    render() {

        return (
            <>

                <Card title="Consulta de Lançamentos">
                    <div className='row'>
                        <div className='col'>
                            <div bs-component>
                                <FormGroup htmlFor="inputAno" label="*Ano: ">
                                    <input type='text'
                                        className='form-control'
                                        id='inputAno'
                                        value={this.state.ano}
                                        disabled={this.state.estaExportando}
                                        onChange={e => this.setState({ ano: e.target.value })}
                                        placeholder='Digite um ano' />
                                </FormGroup>

                                <FormGroup htmlFor="inputMes" label="Mês: ">
                                    <SelectMenu id="inputMes"
                                        value={this.state.mes}
                                        disabled={this.state.estaExportando}
                                        onChange={e => this.setState({ mes: e.target.value })} className={"form-control"} lista={meses} />
                                </FormGroup>

                                <FormGroup htmlFor="inputDesc" label="Descrição: ">
                                    <input type='text'
                                        className='form-control'
                                        id='inputDesc'
                                        disabled={this.state.estaExportando}
                                        value={this.state.descricao}
                                        onChange={e => this.setState({ descricao: e.target.value })}
                                        placeholder='Digite uma descrição' />
                                </FormGroup>

                                <FormGroup htmlFor="inputTipo" label="Tipo de lançamento: ">
                                    <SelectMenu id="inputTipo"
                                        value={this.state.tipo}
                                        disabled={this.state.estaExportando}
                                        onChange={e => this.setState({ tipo: e.target.value })}
                                        className={"form-control"} lista={tiposLancamento} />
                                </FormGroup>

                                <FormGroup htmlFor="inputCategoria" label="Categoria: ">
                                    <SelectMenu id="inputCategoria"
                                        value={this.state.categoria}
                                        disabled={this.state.estaExportando}
                                        onChange={e => this.setState({ categoria: e.target.value })}
                                        className={"form-control"} lista={this.state.categorias} />
                                </FormGroup>

                                <div className='container-button'>
                                    <Button onClick={this.buscar} className='success' icone="search" title="Buscar" label={"Buscar"} disabled={this.state.estaExportando} />
                                    <Button onClick={this.navegarCadastrar} className='btn btn-danger' icone="plus" title="Cadastrar" label={"Cadastrar"} disabled={this.state.estaExportando} />
                                    <Button onClick={this.toggleModalExportar} className="btn btn-info" icone={this.state.estaExportando ? "spin pi-spinner" : "download"} label={this.state.estaExportando ? "Exportando..." : "Exportar dados"} disabled={this.state.estaExportando} />
                                </div>

                            </div>
                        </div>
                        <div className='col'>
                            <h4 className='font-weight-bold text-center'>Outras opções</h4>
                            <div className='row d-flex flex-column'>

                                <div class="text-success">
                                    <hr />
                                </div>

                                <Button label="Cadastrar nova categoria" className={"btn btn-outline-dark align-self-center"} icone={"plus-circle"} onClick={this.toggleModalCategoria} />

                                <div class="text-success">
                                    <hr />
                                </div>

                                <Button label="Realizar upload de arquivo" className={"btn btn-outline-dark align-self-center"} icone={"upload"} onClick={this.toggleModalUpload} />

                                <div class="text-success">
                                    <hr />
                                </div>

                                <Button label="Visualizar lançamentos no mapa" className={"btn btn-outline-dark align-self-center"} icone={"map"} onClick={this.toogleModalMapa} />

                                <div class="text-success">
                                    <hr />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='bs-component'>
                                <TableLancamentos lancamentos={this.state.lancamentos}
                                    deletar={this.confirmarExclusao}
                                    editar={this.editar}
                                    alterarStatus={this.alterarStatus} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <ConfirmDialog
                            group="declarative"
                            visible={this.state.showConfirmDialog}
                            onHide={() => this.setState({ showConfirmDialog: false })}
                            message="Tem certeza que deseja excluir?"
                            header="Excluir lançamento"
                            icon="pi pi-exclamation-triangle"
                            footer={this.confirmDialogFooter}
                        />
                    </div>
                </Card>

                {/**
                Modal de Categoria
                */}
                <Modal visible={this.state.showModalCategoria} header={"Cadastrar categoria"} onhide={this.toggleModalCategoria}>

                    <FormGroup htmlFor="inputDescCategoria" label="Descrição: ">
                        <input type='text'
                            className='form-control'
                            id='inputDesc'
                            maxLength="255"
                            value={this.state.descricaoCategoria}
                            onChange={e => this.setState({ descricaoCategoria: e.target.value })}
                            placeholder='Digite a descrição da categoria' />
                    </FormGroup>

                    <div className="d-flex justify-content-end button-container">
                        <Button label={"Cancelar"} onClick={this.toggleModalCategoria} className="btn btn-cancelar">
                        </Button>
                        <Button label={"Confirmar"} onClick={this.cadastrarCategoria} className="btn btn-info" />
                    </div>

                </Modal>

                {/**
                Modal de Upload
                */}

                <Modal visible={this.state.showModalUpload} header={"Upload - Arquivo CSV"} onhide={this.toggleModalUpload}>

                    <div className='card md-3'>

                        <div className='card-header'>
                            <div className="d-flex justify-content-start button-container">
                                <Button label="Selecionar arquivo" onClick={this.selecionarArquivo} className="btn btn-info" icone="file" disabled={this.state.estaEnviando} />
                                <Button label="Upload" onClick={this.upload} icone={this.state.estaEnviando ? "spin pi-spinner" : "upload"} className="success" disabled={this.state.arquivoSelecionado === '' ? true : false} />
                                <Button label="Cancelar" icone="times" className="btn btn-danger" onClick={this.toggleModalUpload} disabled={this.state.estaEnviando} />
                            </div>
                        </div>

                        <div className='card-body card-upload'>

                            {/** Se o log estiver com algum valor dentro, significa que há detalhes de erros para baixar */}
                            {this.state.logErros ?

                                <div onDrop={this.handleDrop} onDragOver={this.handleDragOver} className='dragDrop'>
                                    {this.state.logErros &&
                                        (<div className='logErro'>
                                            <div class="alert alert-dismissible alert-light">
                                                <p style={{ margin: 0 }}>Há erros em seu arquivo! Faça o download dos detalhes.</p>
                                            </div>
                                            <Button className="info" icone={"download"} label={"Download detalhes"} onClick={this.baixarLogErros} />
                                        </div>)
                                    }
                                </div>

                                :

                                <div onDrop={this.handleDrop} onDragOver={this.handleDragOver} className='dragDrop'>
                                    {this.state.alertModal &&
                                        <div class="alert alert-erro">
                                            <p>{this.state.alertModal}</p>
                                            <Button className={"btn btn-close-alert"} icone={"times"} data-bs-dismiss="alert" onClick={this.limparAlertModal} />
                                        </div>}

                                    {this.state.arquivoSelecionado ? (<div className='item-arquivo'>
                                        <p>{this.state.arquivoSelecionado.name}</p>
                                        <p>{(this.state.arquivoSelecionado.size / 1024).toFixed(2)}KB</p>
                                        <Button className="btn btn-cancela-arquivo" icone={"times"} onClick={this.cancelarArquivo} />
                                    </div>

                                    ) : "Arraste e solte o arquivo aqui para fazer upload!"}
                                </div>

                            }
                        </div>



                        {/** Vou simular um click nesse input com um botão*/}
                        <input type='file' id='arquivo' style={{ display: 'none' }} onChange={this.pegarArquivo} />
                    </div>



                </Modal>

                {/**
                Modal de Export
                */}

                <Modal style={{ width: '30vw' }} breakpoints={{ '1360px': '40vw', '1050px': '75vw' }} visible={this.state.showModalExportar} header={"Exportar dados"} onhide={this.toggleModalExportar}>
                    <p className='text-center'>Escolha o formato de exportação</p>

                    <div className="d-flex justify-content-center button-container">
                        <Button label={"Exportar como JSON"} onClick={(e) => this.downloadBusca(e.target.value)} className="btn btn-info">
                        </Button>
                        <Button label={"Exportar como CSV"} value={formatosArquivo.CSV} onClick={(e) => this.downloadBusca(e.target.value)} className="success" />
                    </div>

                </Modal>


                {/**
                 * Modal Mapa
                 */}

                <Modal visible={this.state.showModalMapa}  breakpoints={{ '1360px': '90vw', '1050px': '75vw' }} header={"Lançamentos realizados"} onhide={this.toogleModalMapa}>
                    <Mapa buscaParams={this.paramsMapa()}/>
                </Modal>
            </>
        )
    }
}

export default ConsultaLancamentos