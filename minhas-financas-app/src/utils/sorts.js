export const sortOrdemAlfabetica = (itens) => {
    return [...itens].sort((a, b) => a.descricao.localeCompare(b.descricao));
} 