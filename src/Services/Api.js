import apisauce from 'apisauce'
import LocalStorage from './LocalStorage'
import Config from '../Global/Config'

const Api = {}
const storage = LocalStorage.get(Config.STORAGE_KEY)
if (storage !== null) { Api.jwt = storage.jwt || null }

const getClient = () => apisauce.create({
  baseURL: Config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: Api.jwt
  }
})

let client = getClient()
Api.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

Api.get = async (url, params) => {
  try {
    return await client.get(url, params)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.patch = async (url, data) => {
  try {
    return await client.patch(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.delete = async (url) => {
  try {
    return await client.delete(url)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.post = async (url, data) => {
  try {
    return await client.post(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.postData = async (url, data) => {
  try {
    return await client.post(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.setJWT = jwt => {
  Api.jwt = `${jwt}`
}

Api.signup = async (username, password) => {
  try {
    const res = await client.post('/api/v0/signup', { username, password })

    if (res.ok) {
      return true
    }
  } catch (err) {
    return false
  }
  return false
}

Api.login = async (username, password) => {
  try {
    const res = await client.post('/api/v0/signin', { username, password })

    console.log(res)

    if (res.ok) {
      const jwt = res.data.token
      Api.setJWT(jwt)
      client = getClient()
      return { jwt }
    }
  } catch (err) {
    return false
  }
  return false
}

export default Api
