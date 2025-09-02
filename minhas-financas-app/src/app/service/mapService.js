import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Point from '@arcgis/core/geometry/Point'
import LocalStorageService from "./localStorageService";
import { mensagemErro } from "../../components/Toast";

class MapService {

    item = LocalStorageService.obterItem('_usuario_logado')

    lancamentoLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Minhas_Financas_Map/FeatureServer/0"
    })

    categoriaLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Minhas_Financas_Map/FeatureServer/3",
    })

    async salvar(lancamento) {

        await this.lancamentoLayer.load()

        const atributos = {
            DESCRICAO: lancamento.descricao,
            ANO: lancamento.ano,
            MES: lancamento.mes,
            VALOR: lancamento.valor,
            TIPO: lancamento.tipo,
            STATUS: lancamento.status,
            ID_LANCAMENTO: lancamento.id,
            ID_USUARIO: this.item.id,
            CATEGORIA: lancamento.categoria ? lancamento.categoria.id : null,
            LATITUDE: lancamento.latitude ? lancamento.latitude : null,
            LONGITUDE: lancamento.longitude ? lancamento.longitude : null
        }

        const ponto = new Graphic({
            geometry: {
                type: 'point',
                latitude: atributos.LATITUDE,
                longitude: atributos.LONGITUDE
            },
            attributes: atributos
        })

        try {
            this.lancamentoLayer.applyEdits(
                {
                    addFeatures: [ponto]
                }
            )
        } catch (error) {
            mensagemErro(error.response)
        }

    }

    async atualizar(lancamento) {
        await this.lancamentoLayer.load()

        const query = {
            where: `ID_LANCAMENTO = ${lancamento.id}`,
            returnGeometry: true
        }

        await this.lancamentoLayer.queryFeatures(query)
            .then((res) => {

                const feature = res.features[0]

                const atributosEditados = {
                    OBJECTID: feature.attributes.OBJECTID,
                    DESCRICAO: lancamento.descricao,
                    ANO: lancamento.ano,
                    MES: lancamento.mes,
                    VALOR: lancamento.valor,
                    TIPO: lancamento.tipo,
                    STATUS: lancamento.status,
                    ID_LANCAMENTO: lancamento.id,
                    ID_USUARIO: this.item.id,
                    CATEGORIA: lancamento.categoria ? lancamento.categoria.id : null,
                    LATITUDE: lancamento.latitude ? lancamento.latitude : null,
                    LONGITUDE: lancamento.longitude ? lancamento.longitude : null
                }

                const pontoEditado = new Graphic({
                    geometry: new Point({
                        style: "point",
                        latitude: atributosEditados.LATITUDE,
                        longitude: atributosEditados.LONGITUDE
                    }),
                    attributes: atributosEditados
                })
                
                try {
                    this.lancamentoLayer.applyEdits({
                        updateFeatures: [pontoEditado]
                    })
                } catch (error) {
                    console.log(error.response)
                }

            })

    }

    async deletar(id_lancamento) {
        await this.lancamentoLayer.load()

        const query = {
            where: `ID_LANCAMENTO = ${id_lancamento}`,
            returnGeometry: true
        }

        await this.lancamentoLayer.queryFeatures(query)
            .then((res) => {

                if(!res.features || res.features.length === 0){
                    mensagemErro("Lançamento não encontrado no mapa")
                    return false
                }

                const feature = res.features[0]
                const objectID = feature.attributes.OBJECTID

                try {
                    this.lancamentoLayer.applyEdits({
                        deleteFeatures: [{
                            objectId: objectID
                        }] 
                    })
                } catch (error) {
                    console.log(error.response)
                }

            })
    }

    async salvarCategoria(categoria){

        await this.categoriaLayer.load()

        const atributos = {
            ID_CATEGORIA: categoria.id,
            DESCRICAO: categoria.descricao
        }

        const registro = new Graphic({
            attributes: atributos
        })
        
        try {
            this.categoriaLayer.applyEdits({
                addFeatures: [registro]
            })

        } catch (error) {
            console.log("Erro: "+error.response)
        }

    }

    async cadastroEmMassaLancamento(lancamentos){

        for(const lancamento of lancamentos){
            try {
                await this.salvar(lancamento)
            } catch (error) {
                console.log(error)
            }
        }

    }
}

export default MapService