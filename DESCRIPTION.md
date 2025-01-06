# Steps taken

These are the steps I followed. The order was influenced by:
- me getting my head around the problem
- learning Vue 3

An ideal set of steps is laid out [at the bottom](#ideal-steps).

1. Make simple loan amount input that when changed recalculates the PMT using constants for the other values.
2. Fetch the values from the APIs and display them on screen
3. Make select components
4. Use values from select components to change params for PMT calculations.
5. Make the basic layout so it is easy to see the results.
6. Make a currency input component for the loan amount input. Make this component handle restrictions on valid characters and display number with correct format.
    - Created utils and composables for handling locale and formatting so that this code will work in different locales.
    - Component handles typing and will format as the user types whilst keeping their cursor in the right position (eg the comma separator will move as they add new digits).
    - Component handles values being pasted.
    - Component works better than the equivalent input on (https://valiant.finance) :smile: That input has a bug where hitting backspace in the middle of the value moves your cursor to the end, subsequent placement of the cursor into the middle followed by typing a digit also results in the cursor moving to the end. My component handles these scenarios.

7. Write tests for currency input component. Write unit tests for the utils created that deal with number formatting. Write unit test for the component itself.
    - The tests for CurrencyInput use vue test utils.

8. Incorporate the currency input into the app. Change the component where necessary to better fit with the app. Update tests.
9. Add loading states and handling for loading errors. Improve validation and error handling.
10. Re-evaluate structure of app now that all the pieces work. Refactor if necessary.
    - Moved main UI logic from App into a component LoanRepaymentCalculator
    - Changed calculation to a computed that returns an object that has repyament amoutn and total or an error message
    - Removed "fetcher" utils and put all fetching into useLoanCalculatorConfiguration composable - this makes it easier to mock the composable in testing.

11. Improve styling taking into consideration different screen sizes.
    - Added Skeleton version of SelectInput to show when configuration is loading. 
    - Use grid layout on very small screens and flex-wrap on sizes > sm

12. Write first e2e test.
13. Write comprehensive e2e tests that go through all the permutations of different options.
    - involved double checking that I was using PMT correctly by finding existing online loan calculators and entering in the same values.
14. Do any changes / refactors that become apparant after tests have been created. 
    - updated all relevant elements to use [data-testid]
15. Re-read code looking for consistency or pattens, names and do any refactors necessary.
16. Re-read fat marker sketch and check solution against specs.
    - updated styling to more closely match Valiant colour scheme. Lint rules prevent using custom Tailwind classes. Tried to extend / replace Tailwind theme colours but lint rules wouldn't recognise my classes. Stopped this due to it being non essential.

# Ideal Steps
In a more ideal scenario, where I was more familiar with an existing codebase and company coding patterns, I would 
1. make the happy-path e2e tests first (X amount with Y options equals Z repayments), deciding on the test-ids for each appropriate element, 
2. build out the app to satisfy the tests.
3. Add non-happy path tests and features.

The currency input is a self-contained piece of work. This could be done first, or delegated to a separate developer whilst the main app is being built. However, the behaviour (cursor control, digit limiting) of the currency input is a "nice-to-have" and the app could still function with a more simple text input and some validation messages, so I would build out the app first (with a text or `[type=number]` input), satisfying the e2e tests, and then add the currency input as an enhancement.
