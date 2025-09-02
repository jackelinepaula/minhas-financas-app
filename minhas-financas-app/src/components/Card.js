import React, { Component } from 'react'

class Card extends Component{
    render(){
        return(
            <div className='card md-3 '>
                <div style={{textAlign: 'start'}} className='card-header'>
                    <h4 className='title-card'>{this.props.title}</h4>
                </div>
                <div className='card-body'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Card