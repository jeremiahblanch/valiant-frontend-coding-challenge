import { ENDPOINT_REQUESTED_REPAYMENT_PERIODS } from '../constants/endpoints'
import { fetchConfig } from './fetchConfig'

export async function fetchRequestedPaymentPeriods () {
  return fetchConfig(ENDPOINT_REQUESTED_REPAYMENT_PERIODS)
}
