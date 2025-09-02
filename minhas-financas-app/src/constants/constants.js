export const meses = [
    { label: 'Selecione', value: '' },
    { label: 'Janeiro', value: 1 },
    { label: 'Fevereiro', value: 2 },
    { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Maio', value: 5 },
    { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 },
    { label: 'Novembro', value: 11 },
    { label: 'Dezembro', value: 12 },
]

export const tiposLancamento = [
    { label: 'Selecione', value: '' },
    { label: 'Despesa', value: 'DESPESA' },
    { label: 'Receita', value: 'RECEITA' },
]

export const formatosArquivo = {
    CSV: "csv",
    JSON: "json"
}

export const mesExtenso = (mes) => {

    const meses = {
        1: "Janeiro",
        2: "Fevereiro",
        3: "Março",
        4: "Abril",
        5: "Maio",
        6: "Junho",
        7: "Julho",
        8: "Agosto",
        9: "Setembro",
        10: "Outubro",
        11: "Novembro",
        12: "Dezembro"
    }

    return meses[mes]

}