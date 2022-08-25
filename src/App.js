import React, { Component, addCallback } from 'reactn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, Login } from './Pages'
import Background from './Components/Background'
import { restoreState } from './Services'
import './App.css'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  async componentDidMount () {
    await restoreState()
    this.setState({ loggedIn: this.global.loggedIn })

    addCallback(global => {
      if (global.loggedIn === true || global.loggedIn === false) {
        this.setState({ loggedIn: global.loggedIn })
      }

      return null
    })
  }

  renderApp () {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    )
  }

  postLogin () {
    this.setState({ loggedIn: true })
  }

  render () {
    const { loggedIn } = this.state
    return (
      <Background>
        {loggedIn
          ? this.renderApp()
          : <Login postLogin={() => this.postLogin()} />}
      </Background>
    )
  }
}
