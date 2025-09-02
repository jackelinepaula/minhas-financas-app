import ApiService from "../apiservice";
import ErroValidacao from "../exception/ErroValidacao";
import MapService from "./mapService";

class CategoriaService extends ApiService {

    constructor() {
        super('/categorias')
        this.mapService = new MapService()
    }

    getListaCategorias() {
        return this.get('/listar')
    }

    async cadastrarCategoria(descricaoCategoria) {
        await this.post('/', descricaoCategoria)
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    this.mapService.salvarCategoria(res.data)
                }
            })
    }

    validar(descricaoCategoria) {

        if (descricaoCategoria === '') {
            throw new ErroValidacao("Insira uma Descrição válida.")
        }

    }

}

export default CategoriaService