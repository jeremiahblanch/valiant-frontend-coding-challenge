import PMT from '@/utils/PMT'

import loanAmounts from '../fixtures/loanAmounts.json'
import loanPurposes from '../fixtures/loanPurposes.json'
import repaymentPeriods from '../fixtures/repaymentPeriods.json'
import termMonths from '../fixtures/termMonths.json'

describe('Example test', () => {
  it('runs the app', () => {
    cy.visit('http://localhost:5173/')
    cy.url().should('eq', 'http://localhost:5173/')
  })
})

describe('LoanRepaymentCalculator', () => {
  beforeEach('visit', () => {
    cy.visit('http://localhost:5173/')
  })

  it('gets a result when we pick the first option of each dropdown and use the default amount', () => {
    cy.getBySel('loan-purpose-dropdown').select(0)
    cy.getBySel('repayment-period-dropdown').select(0)
    cy.getBySel('term-dropdown').select(0)
    cy.getBySel('result').contains('Total repayments', {
      matchCase: false,
    })
  })

  // Exhaustive tests for all valid combinations
  loanAmounts.forEach((amount) => {
    loanPurposes.forEach((lp) => {
      repaymentPeriods.forEach((rp) => {
        termMonths.forEach((tm) => {
          it(`gets the correct result for $${amount}, ${lp.label}, ${rp.label}, ${tm.label}`, () => {
            cy.getBySel('loan-amount-input').type(`{selectAll}{del}${amount}`)
            cy.getBySel('loan-purpose-dropdown').select(lp.label)
            cy.getBySel('repayment-period-dropdown').select(rp.label)
            cy.getBySel('term-dropdown').select(tm.label)

            const { eachRepayment, totalRepayments } = getExpectedRepaymentAndTotalValues(
              {
                amount,
                period: rp.label,
                purpose: lp.label,
                term: tm.label,
              }
            )

            cy.getBySel('each-repayment').extractNumber().should(
              'eq',
              eachRepayment
            )

            cy.getBySel('total-repayments').extractNumber().should(
              'eq',
              totalRepayments
            )
          })
        })
      })
    })
  })

  // TODO - tests for invalid amounts
  // TODO - tests for loading state
  // TODO - tests for loading errors
})

function getExpectedRepaymentAndTotalValues ({
  amount,
  period,
  purpose,
  term,
}) {
  const { annualRate } = findByLabelOrValue(loanPurposes, purpose)
  const { value: periodsPerYear } = findByLabelOrValue(
    repaymentPeriods,
    period
  )
  const { value: months } = findByLabelOrValue(termMonths, term)

  const rate = annualRate / periodsPerYear
  const periods = (periodsPerYear / 12) * months

  const eachRepayment = PMT(rate, periods, amount) * -1

  return {
    eachRepayment: Math.ceil(eachRepayment),
    totalRepayments: Math.ceil(eachRepayment * periods),
  }
}

function findByLabelOrValue (list, searchFor) {
  return list.find(
    ({ label, value }) => value === searchFor || label === searchFor
  )
}
