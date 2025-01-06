How I did this.
1. Make simple loan amount input that when changed recalculates the PMT using constants for the other values.
2. Fetch the values from the apis and display them on screen
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
9. Add loading states and handling for loading errors.
10. Re-evaluate structure of app now that all the pieces work. Refactor if necessary.
    - Moved main UI logic from App into a component LoanRepaymentCalculator
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