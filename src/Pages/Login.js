import React, { Component } from 'reactn'
import { Card, InputGroup, FormControl, Button } from 'react-bootstrap'
import Config from '../Global/Config'
import bckg from '../Assets/background.jpg'
import logo from '../Assets/logo.png'
import { Api, persistState } from '../Services'
import swal from 'sweetalert'
import md5 from 'md5'

export default class Login extends Component {
  async login () {
    const { user, psw } = this.state

    if (user === '' || psw === '') {
      swal('Error', 'Please insert credentials and then retry', 'error')
    } else {
      const data = await Api.login(user, md5(psw))

      if (!data) {
        swal('Error', 'Invalid credentials', 'error')
      } else {
        await this.setGlobal({ ...data, loggedIn: true }, persistState)
        this.props.postLogin()
      }
    }
  }

  async register () {
    const { user, psw } = this.state

    if (user === '' || psw === '') {
      swal('Error', 'Please insert credentials and then retry', 'error')
    } else {
      const data = await Api.signup(user, psw)

      console.log(data)

      if (!data) {
        swal('Error', 'Could not register, please try again later', 'error')
      } else {
        swal('Info', 'Register succeded! Please, login to access the system', 'info')
      }
    }
  }

  render () {
    const { page, logoBox, footer, a, signup } = styles

    return (
      <div style={page}>
        <Card style={{ width: 360, ...Config.shadow, padding: 20, borderRadius: 5 }}>
          <div style={logoBox}>
            <img src={logo} style={{ width: 160, height: 90 }} alt='' />
          </div>
          <hr/>
          <p>Please, enter your credentials</p>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Username</InputGroup.Text>
            <FormControl onChange={(e) => this.setState({ user: e.target.value })} />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Password</InputGroup.Text>
            <FormControl type='password' onChange={(e) => this.setState({ psw: e.target.value })} />
          </InputGroup>
          <Button style={{ width: 120, margin: 'auto' }} size='lg' variant='dark' onClick={() => this.login()}>Login</Button>
          <hr/>
          <div style={signup}>
            <p>or, enter your credentials and click</p>
            <u style={{ marginLeft: 5, color: 'blue' }} onClick={() => this.register()}>Sign up</u>
          </div>
        </Card>
        <div style={footer}>
          © 2022 Kanon Gaming | EMail <a href='mailto:francesco@chpl.it' style={a}>francesco@chpl.it</a> | v {Config.appVersion}
        </div>
      </div>
    )
  }
}

const styles = {
  page: {
    height: '100vh',
    backgroundImage: `url(${bckg})`,
    backgroundSize: 'cover',
    backgroundPositionY: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'fixed',
    bottom: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: 'white'
  },
  a: {
    color: 'white',
    textDecoration: 'underline',
    marginLeft: 6,
    marginRight: 6
  },
  signup: {
    display: 'flex',
    flexDirection: 'row'
  }
}
