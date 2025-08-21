import { render, screen } from '@testing-library/react'
import { useFormStatus } from 'react-dom'

import { SubmitButton } from './button-submit'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: jest.fn(),
}))

describe('SubmitButton', () => {
  const defaultProps = {
    formId: 'test-form',
    buttonTextKey: 'form.saveButton',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFormStatus as jest.Mock).mockReturnValue({ pending: false })
  })

  it('renders button with correct attributes', () => {
    render(<SubmitButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('form', 'test-form')
  })

  it('displays button text when not pending', () => {
    render(<SubmitButton {...defaultProps} />)

    expect(screen.getByText('form.saveButton')).toBeInTheDocument()
    expect(screen.queryByText('form.loading')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('displays loading spinner and text when pending', () => {
    ;(useFormStatus as jest.Mock).mockReturnValue({ pending: true })

    render(<SubmitButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    const loadingSpinner = screen.getByRole('status')
    expect(loadingSpinner).toBeInTheDocument()
    expect(loadingSpinner).toHaveTextContent('form.loading')

    expect(screen.queryByText('form.saveButton')).not.toBeInTheDocument()
  })

  it('is disabled when pending', () => {
    ;(useFormStatus as jest.Mock).mockReturnValue({ pending: true })

    render(<SubmitButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('is not disabled when not pending', () => {
    render(<SubmitButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('renders with different button text keys', () => {
    render(<SubmitButton formId="test-form" buttonTextKey="form.updateButton" />)

    expect(screen.getByText('form.updateButton')).toBeInTheDocument()
  })

  it('renders with different form IDs', () => {
    render(<SubmitButton formId="another-form" buttonTextKey="form.saveButton" />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('form', 'another-form')
  })
})
