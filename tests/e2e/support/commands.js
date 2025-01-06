import { removeNonDigits } from '@/utils/stringDigits'

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('extractNumber', {
  prevSubject: true,
}, (subject) => {
  cy.wrap(subject)
    .invoke('text')
    .then(text => Number(removeNonDigits(text)))
})
