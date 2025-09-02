import React, { useEffect } from 'react';
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import '@arcgis/core/assets/esri/themes/light/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic';
import PopupTemplate from '@arcgis/core/PopupTemplate'

import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'

export default function Mapa({ buscaParams }) {
    const graphLayer = new GraphicsLayer()

    const map = new Map({
        basemap: "topo-vector",
    })

    const featureLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Minhas_Financas_Map/FeatureServer/0"
    });

    const createQuery = (params) => {
        const { descricao, mes, tipo, categoria, ano, idUsuario } = params

        let where = `ID_USUARIO = ${idUsuario}`

        if (descricao) {
            where += ` AND DESCRICAO LIKE '%${descricao}%'`
        }

        if (ano) {
            where += ` AND ANO = ${ano}`
        }

        if (mes) {
            where += ` AND MES = ${mes}`
        }

        if (tipo) {
            where += ` AND TIPO = '${tipo}'`
        }

        if (categoria) {
            where += ` AND CATEGORIA = ${categoria}`
        }

        return where

    }

    useEffect(() => {

        map.add(graphLayer)

        const view = new MapView({
            container: 'divMap',
            map: map,
            zoom: 17,
            center: [-46.183776, -23.516844]
        });

        const query = {
            where: createQuery(buscaParams),
            geometry: view.extent,
            outFields: ['*'],
            returnGeometry: true
        }


        const marcador = new PictureMarkerSymbol({
            url: `${process.env.PUBLIC_URL}/pinMarker.png`,
            width: '25px',
            height: '25px',
            yoffset: '12px'
        })

        /** Quando a feature for carregada no mapa... */
        featureLayer.load().then(() => {

            /** Faça a query */
            featureLayer.queryFeatures(query)
                .then((res) => {

                    res.features.forEach((feat) => {

                        const popupTemplate = new PopupTemplate({
                            title: `${feat.attributes.DESCRICAO}`,
                            content: construirPopup(feat)
                        });

                        /** Crie um gráfico pro retorno */
                        const graphic = new Graphic({
                            geometry: feat.geometry,
                            attributes: feat.attributes,
                            symbol: marcador,
                            popupTemplate: popupTemplate
                        })

                        /** Adicione esse gráfico na layer */
                        graphLayer.add(graphic)
                    })

                })

        })

        return (() => {
            if (view) {
                view.destroy()
            }
        })

    }, [])

    const construirPopup = (feature) => {
        const mesDomain = featureLayer.getFieldDomain("MES");
        const mesCode = feature.attributes.MES;

        //Pegando o valor (mês por extenso) do domain_mes
        const mesValor = mesDomain.codedValues.find(codedValue => codedValue.code === mesCode)?.name || mesCode;

        // Formatando valor moeda a ser exibido
        const valorMoeda = feature.attributes.VALOR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `<table style="width:100%;margin-top:0">
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Mês</th>
            <td style="border: 1px solid black; padding: 8px;">${mesValor}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Ano</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.ANO}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Valor</th>
            <td style="border: 1px solid black; padding: 8px;">R$ ${valorMoeda}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Tipo</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.TIPO}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Status</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.STATUS}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">ID do Usuário</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.ID_USUARIO}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">ID do Lançamento</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.ID_LANCAMENTO}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Categoria</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.CATEGORIA}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Latitude</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.LATITUDE}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black; padding: 8px;">Longitude</th>
            <td style="border: 1px solid black; padding: 8px;">${feature.attributes.LONGITUDE}</td>
        </tr>
    </table>`
    }

    return (
        <div id='divMap' style={{ width: '100%', height: '70vh' }}>

        </div>
    )

}