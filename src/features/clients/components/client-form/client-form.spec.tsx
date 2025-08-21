import { useActionState } from 'react'

import { render, screen, waitFor } from '@testing-library/react'

import { ClientForm } from './client-form'
import * as clientActions from '../../actions'
import { initialState } from '../../state'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}))

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: jest.fn(() => ({ pending: false })),
}))

jest.mock('../../actions', () => ({
  addClientAction: jest.fn((prevState: unknown, formData: FormData) =>
    Promise.resolve({ success: true }),
  ),
  updateClientAction: jest.fn((clientId: number, prevState: unknown, formData: FormData) =>
    Promise.resolve({ success: true }),
  ),
}))

describe('ClientForm', () => {
  beforeEach(() => {
    ;(clientActions.addClientAction as jest.Mock).mockReset()
    ;(clientActions.updateClientAction as jest.Mock).mockReset()
    ;(useActionState as jest.Mock).mockReset()
    ;(useActionState as jest.Mock).mockReturnValue([initialState, clientActions.addClientAction])
  })
  it('should render the form with "Save Client" button for adding a new client', () => {
    render(<ClientForm action={clientActions.addClientAction} state={initialState} />)

    expect(screen.getByLabelText('form.fullNameLabel')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('form.fullNamePlaceholder')).toBeInTheDocument()
    expect(screen.getByLabelText('form.emailLabel')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('form.emailPlaceholder')).toBeInTheDocument()
    expect(screen.getByLabelText('form.phoneLabel')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('form.phonePlaceholder')).toBeInTheDocument()
    expect(screen.getByLabelText('form.taxIdLabel')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('form.taxIdPlaceholder')).toBeInTheDocument()
    expect(screen.getByLabelText('form.addressLabel')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('form.addressPlaceholder')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'form.saveButton' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'form.updateButton' })).not.toBeInTheDocument()
  })

  it('should render the form with "Save Changes" button and pre-filled data for editing an existing client', () => {
    const initialData = {
      documentId: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      cpf_or_cnpj: '111.222.333-44',
      address: '123 Main St',
    }

    ;(useActionState as jest.Mock).mockReturnValue([initialState, clientActions.updateClientAction])

    render(
      <ClientForm
        action={clientActions.updateClientAction}
        state={initialState}
        initialData={initialData}
      />,
    )

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('123456789')).toBeInTheDocument()
    expect(screen.getByDisplayValue('111.222.333-44')).toBeInTheDocument()
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'form.updateButton' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'form.saveButton' })).not.toBeInTheDocument()
  })

  it('should call the addClientAction with form data on submission', async () => {
    ;(useActionState as jest.Mock).mockReturnValue([initialState, clientActions.addClientAction])

    const mockFormData = new FormData()
    mockFormData.append('name', 'Jane Doe')
    mockFormData.append('email', 'jane.doe@example.com')
    mockFormData.append('phone', '987654321')
    mockFormData.append('cpf_or_cnpj', '555.666.777-88')
    mockFormData.append('address', '456 Oak Ave')
    ;(clientActions.addClientAction as jest.Mock).mockImplementation(
      async (prevState, formData) => {
        return { success: true, message: 'Client added successfully!' }
      },
    )
    render(<ClientForm action={clientActions.addClientAction} state={initialState} />)

    await clientActions.addClientAction(initialState, mockFormData)

    await waitFor(() => {
      expect(clientActions.addClientAction).toHaveBeenCalledTimes(1)
      const submittedFormData = (clientActions.addClientAction as jest.Mock).mock.calls[0][1]
      expect(submittedFormData.get('name')).toBe('Jane Doe')
      expect(submittedFormData.get('email')).toBe('jane.doe@example.com')
      expect(submittedFormData.get('phone')).toBe('987654321')
      expect(submittedFormData.get('cpf_or_cnpj')).toBe('555.666.777-88')
      expect(submittedFormData.get('address')).toBe('456 Oak Ave')
    })
  })

  it('should display validation errors', async () => {
    const errorState = {
      errors: {
        name: 'fullNameTooShort',
        email: 'invalidEmail',
      },
      message: undefined,
    }

    ;(useActionState as jest.Mock).mockReturnValue([errorState, clientActions.addClientAction])
    ;(clientActions.addClientAction as jest.Mock).mockImplementation(
      async (prevState, formData) => {
        return errorState
      },
    )

    render(<ClientForm action={clientActions.addClientAction} state={errorState} />)

    await clientActions.addClientAction(initialState, new FormData())

    await waitFor(() => {
      expect(screen.getByText('fullNameTooShort')).toBeInTheDocument()
      expect(screen.getByText('invalidEmail')).toBeInTheDocument()
    })
  })

  it('should display a general message on action error', async () => {
    const errorMessage = 'errors.default'
    const errorState = { message: errorMessage }

    ;(useActionState as jest.Mock).mockReturnValue([errorState, clientActions.addClientAction])
    ;(clientActions.addClientAction as jest.Mock).mockImplementation(
      async (prevState, formData) => {
        return errorState
      },
    )

    render(<ClientForm action={clientActions.addClientAction} state={errorState} />)

    await clientActions.addClientAction(initialState, new FormData())

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should call the updateClientAction with form data on submission', async () => {
    const initialData = {
      documentId: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      cpf_or_cnpj: '111.222.333-44',
      address: '123 Main St',
    }

    ;(useActionState as jest.Mock).mockReturnValue([initialState, clientActions.updateClientAction])

    const mockUpdateFormData = new FormData()
    mockUpdateFormData.append('documentId', initialData.documentId)
    mockUpdateFormData.append('name', 'Jane Smith')
    mockUpdateFormData.append('email', 'jane.smith@example.com')
    mockUpdateFormData.append('phone', initialData.phone)
    mockUpdateFormData.append('cpf_or_cnpj', initialData.cpf_or_cnpj)
    mockUpdateFormData.append('address', initialData.address)
    ;(clientActions.updateClientAction as jest.Mock).mockImplementation(
      async (clientId, prevState, formData) => {
        return { success: true, message: 'Client updated successfully!' }
      },
    )

    render(
      <ClientForm
        action={clientActions.updateClientAction}
        state={initialState}
        initialData={initialData}
      />,
    )

    await clientActions.updateClientAction(
      parseInt(initialData.documentId),
      initialState,
      mockUpdateFormData,
    )

    await waitFor(() => {
      expect(clientActions.updateClientAction).toHaveBeenCalledTimes(1)
      const submittedClientId = (clientActions.updateClientAction as jest.Mock).mock.calls[0][0]
      const submittedFormData = (clientActions.updateClientAction as jest.Mock).mock.calls[0][2]
      expect(submittedFormData.get('name')).toBe('Jane Smith')
      expect(submittedFormData.get('email')).toBe('jane.smith@example.com')
      expect(submittedFormData.get('documentId')).toBe('123')
      expect(submittedClientId).toBe(123)
    })
  })
})
