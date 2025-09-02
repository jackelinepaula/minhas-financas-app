import React from "react";

import currencyFormatter from 'currency-formatter'
import Button from "../../components/Button";
import Badge from "../../components/Badge";

import { mesExtenso } from "../../constants/constants";

function TableLancamentos(props) {



    const rows = props.lancamentos.map(lancamento => {
        return (
            <tr key={lancamento.id}>
                <td>{lancamento.descricao}</td>
                <td>{currencyFormatter.format(lancamento.valor, { locale: 'pt-BR' })}</td>
                <td>{lancamento.tipo}</td>
                <td>{mesExtenso(lancamento.mes)}</td>
                <td>{lancamento.status}</td>
                <td>{lancamento.categoria ? (<Badge className='badge' label={lancamento.categoria.descricao} variant={"bg-light"}/>) : "-"}</td>
                <td className="container-button">
                    <Button disabled={lancamento.status !== 'PENDENTE'} className='success' onClick={(e) => props.alterarStatus(lancamento, 'EFETIVADO')} title="Efetivar" icone="check" />

                    <Button disabled={lancamento.status !== 'PENDENTE'} className='btn btn-warning' onClick={(e) => props.alterarStatus(lancamento, 'CANCELADO')} title="Cancelar" icone="times" />

                    <Button disabled={lancamento.status !== 'PENDENTE'} className='btn btn-info' onClick={(e) => props.editar(lancamento.id)} title="Editar" icone="pen-to-square" />

                    <Button disabled={lancamento.status !== 'PENDENTE'} className='btn btn-danger' onClick={(e) => props.deletar(lancamento)} title="Excluir" icone="trash" />
                        
                </td>
            </tr>
        )
    })

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}

export default TableLancamentos