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

// TODO rename component to loanRepaymentCalculator
describe('LoanRepaymentCalculator', () => {
  beforeEach('visit', () => {
    cy.visit('http://localhost:5173/')
  })

  it('gets a valid result when we pick the first option of each dropdown', () => {
    cy.get('#loanPurposeDropdown').select(0)
    cy.get('#repaymentPeriodDropdown').select(0)
    cy.get('#termDropdown').select(0)
    cy.get('[data-test-id="result"]').contains('Total repayments', {
      matchCase: false,
    })
  })

  // Exhaustive tests for all valid combinations
  loanAmounts.forEach((amount) => {
    loanPurposes.forEach((lp) => {
      repaymentPeriods.forEach((rp) => {
        termMonths.forEach((tm) => {
          it(`gets the correct result for $${amount}, ${lp.label}, ${rp.label}, ${tm.label}`, () => {
            cy.get('#loanAmountInput').type(`{selectAll}{del}${amount}`)
            cy.get('#loanPurposeDropdown').select(lp.label)
            cy.get('#repaymentPeriodDropdown').select(rp.label)
            cy.get('#termDropdown').select(tm.label)

            const { eachRepayment, total } = getExpectedRepaymentAndTotalValues(
              {
                amount,
                purposeInput: lp.label,
                periodInput: rp.label,
                termInput: tm.label,
              }
            )

            cy.extractNumber('[data-test-id="repaymentPerPeriod"]').should(
              'eq',
              Math.round(eachRepayment)
            )

            cy.extractNumber('[data-test-id="repaymentsTotal"]').should(
              'eq',
              Math.round(total)
            )
          })
        })
      })
    })
  })
})

function getExpectedRepaymentAndTotalValues ({
  amount,
  purposeInput,
  periodInput,
  termInput,
}) {
  const { annualRate } = findByLabelOrValue(loanPurposes, purposeInput)
  const { value: periodsPerYear } = findByLabelOrValue(
    repaymentPeriods,
    periodInput
  )
  const { value: months } = findByLabelOrValue(termMonths, termInput)

  const rate = annualRate / periodsPerYear
  const periods = (periodsPerYear / 12) * months

  const eachRepayment = PMT(rate, periods, amount) * -1
  const total = eachRepayment * periods

  return { eachRepayment, total }
}

function findByLabelOrValue (list, searchFor) {
  return list.find(
    ({ label, value }) => value === searchFor || label === searchFor
  )
}
