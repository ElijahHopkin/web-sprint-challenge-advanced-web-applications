// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import {screen, render} from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'


test('spinner renders when spinnerOn is true', () => {
  render(<Spinner on={true} />)
  const spinner = screen.queryByText('Please wait...');
  expect(spinner).toBeInTheDocument()
})
