import React from "react"

function FormGroup(props){
        return(
            <div style={{textAlign: 'start'}} className='form-group'>
                <label htmlFor='#'>{props.label}</label>
                {props.children}
            </div>
        )
}

export default FormGroup