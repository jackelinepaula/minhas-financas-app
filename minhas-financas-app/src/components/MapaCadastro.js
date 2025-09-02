import React, { useEffect } from 'react';
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import '@arcgis/core/assets/esri/themes/light/main.css';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'

export default function MapaCadastro({ setCoordenadas, fecharMapa, prevLongitude, prevLatitude }) {

    const graphLayer = new GraphicsLayer()

    const map = new Map({
        basemap: "topo-vector",
    })

    const marcador = new SimpleMarkerSymbol({
        style: 'circle',
        color: [214, 34, 70],
        size: 12,
        outline: {
            color: [255, 255, 255],
            width: 2
        }
    });

    useEffect(() => {

        map.add(graphLayer)

        const view = new MapView({
            container: 'divMap',
            map: map,
            zoom: 17,
            center: [-46.183776, -23.516844]
        });

        /** Caso o usuário já tenha selecionado um ponto e queira voltar no mapa é possível 
         * ver o ponto anterior
         */
        if(prevLongitude && prevLatitude){

            const pontoFigura = new Graphic({
                geometry: {
                    type: 'point',
                    longitude: prevLongitude,
                    latitude: prevLatitude 
                },
                symbol: marcador
            })

            graphLayer.add(pontoFigura)
            view.center = [prevLongitude, prevLatitude]
            
        }

        /** Criando um ponto o evento click */
        view.on('click', (event) => {
            const latitude = event.mapPoint.latitude;
            const longitude = event.mapPoint.longitude;

            setCoordenadas(latitude, longitude)

            graphLayer.removeAll();

            const pontoFigura = new Graphic({
                geometry: event.mapPoint,
                symbol: marcador
            })

            graphLayer.add(pontoFigura)
            
            const mensagem = new Graphic({
                geometry: {
                    type: "point",
                    longitude: longitude,
                    latitude: latitude + 0.0002, // Ajuste a latitude para a mensagem ficar acima do ponto
                },
                symbol: {
                    type: "text",
                    color: "black",
                    haloColor: "white",
                    haloSize: "2px",
                    font: {
                        size: "22px",
                        family: "sans-serif",
                    },
                    text: "Local selecionado"
                },
            });

            graphLayer.add(mensagem);

            setTimeout(()=> {
                fecharMapa()
            }, 1000)
        });

        return (() => {
            if (view) {
                view.destroy()
            }
        })

    }, [])

    return (
        <div id='divMap' style={{position: 'relative', width: '100%', height: '70vh' }}>
        </div>
    )
}