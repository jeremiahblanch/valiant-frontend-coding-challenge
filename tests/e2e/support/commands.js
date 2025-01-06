import { removeNonDigits } from '@/utils/stringDigits'

Cypress.Commands.add('extractNumber', (selector) => {
  cy.get(selector)
    .invoke('text')
    .then(text => Number(removeNonDigits(text)))
})
