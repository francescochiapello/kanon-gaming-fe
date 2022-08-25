import React, { Component } from 'reactn'
import backgroundImage from '../Assets/background.jpg'

export default class Background extends Component {
  render () {
    const { shadow, background } = styles

    return (
      <div style={background}>
        <div style={shadow}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const styles = {
  shadow: {
    height: '100vh',
    width: '100%',
    backgroundColor: 'rgba(240,240,240,0.3)'
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
}
