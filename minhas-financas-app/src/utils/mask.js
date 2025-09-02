export const maskInputMoeda = (valor) => {
   
    valor = valor.replace(/\D/g, "")

    //Pensando na máscara estou adicionando ZEROs a esquerda do valor, pra que inicialmente
    //pra que tenha o formato "0,01" e depois "0,12" e assim por diante

    if(valor.length === 1){
        valor = "00" + valor
    }else if(valor.length === 2){
        valor = "0" + valor
    }


    const inteiro = valor.slice(0, -2)
    const decimal = valor.slice(-2)

    const valorFormatado = `R$ ${parseInt(inteiro, 10).toLocaleString("pt-BR")},${decimal}`
    const valorPuro = parseFloat(`${inteiro}.${decimal}`)

    //Valor máscara e valor puro
    return {valorFormatado: valorFormatado, valorPuro: valorPuro}

}