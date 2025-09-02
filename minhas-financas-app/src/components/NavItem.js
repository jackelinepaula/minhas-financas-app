import React from "react";

function NavItem({render, ...props}) {

    if (render) {
        return (
            <li className="nav-item">
                <a onClick={props.onClick} className="nav-link" href={props.href}>{props.label}</a>
            </li>
        )
    }

    return false
}

export default NavItem