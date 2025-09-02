import React from "react"

export default function Badge({variant, label}){

    return(
        <span className={"badge "+variant}>
            {label}
        </span>
    )
}