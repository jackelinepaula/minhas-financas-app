import React from 'react'

export default function Button({className, type, onClick, icone, label, disabled, title, value}){

    return(
        <button disabled={disabled} type={type} className={'btn btn-'+className} onClick={onClick} title={title} value={value}>
            {icone && (<i className={'pi pi-'+icone}></i>)}
            {label}
        </button>
    )

}