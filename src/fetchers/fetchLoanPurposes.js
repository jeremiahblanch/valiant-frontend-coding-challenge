import { ENDPOINT_LOAN_PURPOSES } from '../constants/endpoints'
import { fetchConfig } from './fetchConfig'

export async function fetchLoanPurposes () {
  return fetchConfig(ENDPOINT_LOAN_PURPOSES)
}
