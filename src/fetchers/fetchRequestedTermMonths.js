import { ENDPOINT_REQUESTED_TERM_MONTHS } from '../constants/endpoints'
import { fetchConfig } from './fetchConfig'

export async function fetchRequestedTermMonths () {
  return fetchConfig(ENDPOINT_REQUESTED_TERM_MONTHS)
}
