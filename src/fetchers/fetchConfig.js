import axios from 'axios'

export async function fetchConfig (url) {
  try {
    // Replace with your actual API endpoint
    const apiResponse = await axios.get(url)

    return apiResponse.data
  } catch (err) {
    throw new Error(`fetchConfigError ${err.message}`)
  }
}
