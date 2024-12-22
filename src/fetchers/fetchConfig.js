import axios from 'axios'

export async function fetchConfig (url) {
  try {
    const apiResponse = await axios.get(url)

    return apiResponse.data
  } catch (err) {
    throw new Error(`fetchConfig error ${err.message} for ${url}`)
  }
}
