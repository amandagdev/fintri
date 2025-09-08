import { fireEvent, render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import CompanyForm from './company-form'

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  startTransition: jest.fn((callback) => callback()),
  useActionState: jest.fn((action, initialState) => [initialState, jest.fn()]),
}))

jest.mock('../../actions', () => ({
  updateCompanyDataAction: jest.fn(),
  removeCompanyLogoAction: jest.fn(),
}))

jest.mock('../../utils/wrapper', () => {
  return function MockWrapper({
    children,
    title,
    description,
  }: {
    children: React.ReactNode
    title: string
    description: string
  }) {
    return (
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </div>
    )
  }
})

const mockCompany = {
  name: 'Test Company',
  cnpj: '12.345.678/0001-90',
  address: 'Test Address',
  email: 'test@company.com',
  phone: '(11) 99999-9999',
  logo: 'http://localhost:1337/uploads/test-logo.png',
}

describe('CompanyForm', () => {
  const mockT = jest.fn((key: string) => key)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTranslations as jest.Mock).mockReturnValue(mockT)
  })

  it('should render form with company data', () => {
    render(<CompanyForm company={mockCompany} />)

    expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12.345.678/0001-90')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Address')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@company.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument()
  })

  it('should render form without company data', () => {
    render(<CompanyForm />)

    expect(screen.getAllByDisplayValue('')).toHaveLength(6)
    expect(screen.getByText('common.saveChanges')).toBeInTheDocument()
  })

  it('should display current logo when company has logo', () => {
    render(<CompanyForm company={mockCompany} />)

    const logoImage = screen.getByAltText('Logo atual')
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', 'http://localhost:1337/uploads/test-logo.png')
  })

  it('should show remove logo button when logo exists', () => {
    render(<CompanyForm company={mockCompany} />)

    expect(screen.getByText('Remover Logo')).toBeInTheDocument()
  })

  it('should handle file input change', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null,
      result: 'data:image/png;base64,test',
    }

    global.FileReader = jest.fn(() => mockFileReader) as unknown as typeof FileReader

    render(<CompanyForm company={mockCompany} />)

    const fileInput = screen.getByPlaceholderText('test-logo.png')
    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile)
  })

  it('should render remove logo button when logo exists', () => {
    render(<CompanyForm company={mockCompany} />)

    expect(screen.getByText('Remover Logo')).toBeInTheDocument()
  })
})
