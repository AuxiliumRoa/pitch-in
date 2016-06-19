import React, { Component } from 'react'
import Icon from './icon.jsx'

class IconBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id={ this.props.id }>
      {
        this.props.icons.map((icon) => {
          return <Icon key={ icon.key + '-icon' } icon={ icon.icon } link={ icon.link } />
        })
      }
      </div>
    )
  }

}

export default IconBox
