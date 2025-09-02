import React from 'react'
import { Dialog } from 'primereact/dialog'

export default function Modal({style, breakpoints, visible, header, children, onhide}) {
    return (
        <Dialog draggable={false} header={header} visible={visible} onHide={onhide}
            style={style ? style : { width: '55vw' }} breakpoints={breakpoints ? breakpoints : { '960px': '75vw', '641px': '100vw' }}>
            {children}
        </Dialog>
    )
}