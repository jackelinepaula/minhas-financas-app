import ApiService from "../apiservice";

import ErroValidacao from "../exception/ErroValidacao";
import MapService from "./mapService";

class LancamentoService extends ApiService {


    constructor() {
        super('/lancamentos')
        this.mapService = new MapService()
    }

    getPorId(id) {
        return this.get(`/${id}`)
    }

    alterarStatus(id, status) {
        return this.put(`/${id}/atualizar-status`, { status })
    }

    async salvar(lancamento) {
        await this.post('/', lancamento)
        .then((res) => {
            this.mapService.salvar(res.data)
        })
    }

    async atualizar(lancamento) {
        await this.put(`/${lancamento.id}`, lancamento)
        .then((res) => {
            this.mapService.atualizar(res.data)
        })
    }

    validar(lancamento) {
        const erros = [];

        if (!lancamento.ano) {
            erros.push("Informe o Ano")
        }

        if (!lancamento.mes) {
            erros.push("Informe o Mês")
        }

        if (!lancamento.descricao) {
            erros.push("Informe uma Descrição")
        }

        if (!lancamento.valor) {
            erros.push("Informe um Valor")
        }

        if (!lancamento.tipo) {
            erros.push("Informe um Tipo")
        }

        if (erros && erros.length > 0) {
            throw new ErroValidacao(erros)
        }

    }

    consultar(lancamentoFiltro) {
        let params = `?ano=${lancamentoFiltro.ano}`

        if (lancamentoFiltro.mes) {
            params = `${params}&mes=${lancamentoFiltro.mes}`
        }

        if (lancamentoFiltro.tipo) {
            params = `${params}&tipo=${lancamentoFiltro.tipo}`
        }

        if (lancamentoFiltro.status) {
            params = `${params}&status=${lancamentoFiltro.status}`
        }

        if (lancamentoFiltro.usuario) {
            params = `${params}&usuario=${lancamentoFiltro.usuario}`
        }

        if (lancamentoFiltro.descricao) {
            params = `${params}&descricao=${lancamentoFiltro.descricao}`
        }

        if (lancamentoFiltro.categoria) {
            params = `${params}&categoria=${lancamentoFiltro.categoria}`
        }

        return this.get(params);
    }

    async upload(file) {

        const formData = new FormData();
        formData.append('file', file)

        const resposta = await this.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

        await this.mapService.cadastroEmMassaLancamento(resposta.data.lancamentosSalvos)

        return resposta.data
    }

    download(lancamentoFiltro) {
        let params = `?ano=${lancamentoFiltro.ano}`

        if (lancamentoFiltro.mes) {
            params = `${params}&mes=${lancamentoFiltro.mes}`
        }

        if (lancamentoFiltro.tipo) {
            params = `${params}&tipo=${lancamentoFiltro.tipo}`
        }

        if (lancamentoFiltro.status) {
            params = `${params}&status=${lancamentoFiltro.status}`
        }

        if (lancamentoFiltro.usuario) {
            params = `${params}&usuario=${lancamentoFiltro.usuario}`
        }

        if (lancamentoFiltro.descricao) {
            params = `${params}&descricao=${lancamentoFiltro.descricao}`
        }

        if (lancamentoFiltro.categoria) {
            params = `${params}&categoria=${lancamentoFiltro.categoria}`
        }

        if (lancamentoFiltro.formato) {
            params = `${params}&formato=${lancamentoFiltro.formato}`
        }

        return this.get(`/download-arquivo${params}`, { responseType: 'text' });
    }

    async deletar(id) {
        await this.delete(`/${id}`)
        .then((res) => {
            
            if(res.status === 200){
                this.mapService.deletar(id)
            }

        })
    }

    validarArquivo = (arquivo) => {
        const formatoValido = ['text/csv', 'application/csv'];
        const tamanhoMaximo = 10 * 1024 * 1024
    
        if (!arquivo) {
            return { valido: false, mensagem: "Nenhum arquivo foi selecionado." };
        }
    
        if (!formatoValido.includes(arquivo.type)) {
            return { valido: false, mensagem: "Arquivo inválido. É permitido carregar apenas arquivo com extensão .csv" };
        }
    
        if (arquivo.size === 0) {
            return { valido: false, mensagem: "O arquivo está vazio!" };
        }
    
        if (arquivo.size > tamanhoMaximo) {
            return { valido: false, mensagem: "O arquivo está muito grande! O tamanho máximo permitido é 10MB" };
        }
    
        return { valido: true };
    }

}

export default LancamentoService