import React, { useState, setGlobal } from 'reactn'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import { Api, clearState, persistState } from '../Services'

export default function Home () {
  const { page, leftSide, rightSide, buttons, column, exit } = styles
  const [filterName, setFilterName] = useState('')
  const [dataFull, setFullData] = useState([])

  const [countries, setCountries] = useState(0)
  const [country, setCountry] = useState([])
  const [data, setData] = useState([])

  // slot machine data
  const [coins, setCoins] = useState(20)
  const [lastSpin, setLastSpin] = useState(0)

  const searchCountry = async () => {
    const someAreEmpty = country.filter(c => !c || c === '')
    if (!country || someAreEmpty.length > 0) {
      swal('Error', 'Please, complete every country field and then retry', 'error')
      return
    }

    let query = ''
    for (const c of country) {
      query += `name=${c}&`
    }
    query = query.substring(0, query.length - 1)

    const result = await Api.get(`/api/v0/country?${query}`)
    if (!result.ok) {
      swal('Error', result.data.error, 'error')
      return
    }

    const items = []
    const results = result.data.result.flat()
    for (const item of results) {
      items.push({
        name: item.name.common,
        region: item.region,
        code: item.fifa,
        flag: item.flag,
        capital: item.capital[0]
      })
    }
    setData(items)
    setFullData(items)
  }

  const clear = () => {
    setCountries(0)
    setCountry([])
    setData([])
  }

  const add = () => setCountries(countries + 1)

  const logout = async () => {
    await setGlobal({ loggedIn: false }, persistState)
    clearState()
    window.location.reload()
  }

  const updateResults = () => {
    if (!filterName || filterName === '') {
      setData(dataFull)
      return
    }

    const filtered = dataFull.filter(d => d.name.toLowerCase().includes(filterName))
    setData(filtered)
  }

  const spin = async () => {
    const result = await Api.get('/api/v0/slot')
    if (result.ok) {
      const coinRes = result.data.coins
      if (coinRes === 0) {
        setCoins(coins - 1)
      } else {
        setCoins(coins + coinRes)
      }
      setLastSpin(coinRes)
    } 
  }

  const restart = () => {
    setCoins(20)
  }

  return (
    <div style={page}>
      <div style={exit}>
        <Link to='/' className='menu-logout'>
          <Button style={{ width: 100, fontSize: 12, margin: 'auto' }} size='lg' variant='danger' onClick={() => logout()}>Logout</Button>
        </Link>
      </div>
      <div style={leftSide}>
        <div style={column}>
          <h4>Slot Machine</h4>
          <h6>Coins remaining: {coins}</h6>
          <hr />
          <h6>Spin result: {lastSpin}</h6>
          <div style={{ display: 'flex' }}>
            <Button style={{ width: 80, fontSize: 12, margin: 'auto' }} size='lg' variant='danger' onClick={() => restart()}>Restart</Button>
            <Button style={{ width: 80, fontSize: 12, margin: 'auto' }} size='lg' variant='success' onClick={() => spin()}>Spin</Button>
          </div>
        </div>
        <div style={column}>
          <h4>Filter</h4>
          <hr />
          <InputGroup className='mb-3'>
            <InputGroup.Text>Country Name</InputGroup.Text>
            <FormControl
              value={filterName}
              // disabled={!data || data.length === 0}
              onKeyDown={e => {
                if (e.keyCode === 8 || e.keyChar === 8) {
                  updateResults()
                }
              }}
              onChange={(e) => {
                setFilterName(e.target.value)
                updateResults()
              }}
            />
          </InputGroup>
        </div>
        <div style={column}>
          <h4>Search</h4>
          <hr />
          {
            Array(countries).fill().map((c, i) => {
              return (
                <InputGroup className='mb-3' key={i}>
                  <InputGroup.Text>Country {i + 1}</InputGroup.Text>
                  <FormControl
                    // value={country[i]}
                    onChange={(e) => {
                      country[i] = e.target.value
                      setCountry(country)
                    }}
                  />
                </InputGroup>
              )
            })
          }
          <div style={buttons}>
            <Button style={{ width: 80, fontSize: 12, margin: 'auto' }} size='lg' variant='secondary' onClick={() => add()}>Add</Button>
            {countries > 0 && <Button style={{ width: 100, fontSize: 12, margin: 'auto' }} size='lg' variant='primary' onClick={() => searchCountry()}>Search</Button>}
            {countries > 0 && <Button style={{ width: 80, fontSize: 12, margin: 'auto' }} size='lg' variant='danger' onClick={() => clear()}>Clear</Button>}
          </div>
        </div>
      </div>
      <div style={rightSide}>
      <h4>Results</h4>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Name</th>
            <th>Region</th>
            <th>Code</th>
            <th>Flag</th>
            <th>Capital</th>
          </tr>
        </thead>
        <tbody>
          {
            data && data.length > 0 && data.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{item.name}</td>
                  <td>{item.region}</td>
                  <td>{item.code}</td>
                  <td>{item.flag}</td>
                  <td>{item.capital}</td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    padding: 20
  },
  leftSide: {
    width: '30%',
    height: '100%',
    padding: 10,
    margin: 10,
    backgroundColor: 'rgba(250,250,250,0.6)'
  },
  exit: {
    position: 'fixed',
    right: 10,
    top: 10
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: 10,
    margin: 10,
    backgroundColor: 'rgba(250,250,250,0.6)'
  },
  rightSide: {
    width: '70%',
    height: '100%',
    padding: 10,
    margin: 10,
    backgroundColor: 'rgba(250,250,250,0.6)'
  },
  buttons: {
    display: 'flex',
  }
}
