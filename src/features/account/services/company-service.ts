import { axiosInstance, axiosUploadInstance, getStrapiImageUrl } from '@/lib/axios'
import { createAuthHeaders, getJWTToken, handleApiError } from '@/lib/service-utils'

import type { Company, UpdateCompanyDataPayload } from '../types'

export async function getCompanyData(): Promise<Company> {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.get('/api/company?populate=*', {
      headers: createAuthHeaders(jwt),
    })

    const companyData = response.data.data || response.data
    const mappedCompany = mapCompanyData(companyData)

    return mappedCompany
  } catch {
    return getEmptyCompany()
  }
}

export async function updateCompanyData(
  payload: UpdateCompanyDataPayload,
  logoFile?: File | null,
): Promise<void> {
  try {
    const jwt = await getJWTToken()

    const currentCompanyResponse = await axiosInstance.get('/api/company?populate=logo', {
      headers: createAuthHeaders(jwt),
    })
    const companyData = currentCompanyResponse.data.data
    const companyId = companyData?.id as number | undefined
    const currentLogoId = companyData?.logo?.id as number | undefined

    const dataPayload: Record<string, unknown> = { ...payload.company }
    if (!logoFile && currentLogoId) {
      dataPayload.logo = currentLogoId
    }

    await axiosInstance.put(
      '/api/company',
      { data: dataPayload },
      {
        headers: createAuthHeaders(jwt),
      },
    )

    if (logoFile && logoFile.size > 0 && companyId) {
      const uploadFormData = new FormData()
      uploadFormData.append('files', logoFile)
      uploadFormData.append('ref', 'api::company.company')
      uploadFormData.append('refId', companyId.toString())
      uploadFormData.append('field', 'logo')

      const uploadResponse = await axiosUploadInstance.post('/api/upload', uploadFormData, {
        headers: {
          ...createAuthHeaders(jwt),
        },
      })

      const uploadedFile = uploadResponse.data[0]
      if (uploadedFile?.id) {
        await axiosInstance.put(
          '/api/company',
          { data: { logo: uploadedFile.id } },
          {
            headers: createAuthHeaders(jwt),
          },
        )
      }
    }
  } catch (error) {
    handleApiError(error, 'updateCompanyData', 'account.errors')
  }
}

export async function removeCompanyLogo(): Promise<void> {
  try {
    const jwt = await getJWTToken()

    const companyResponse = await axiosInstance.get('/api/company?populate=*', {
      headers: createAuthHeaders(jwt),
    })
    const company = companyResponse.data.data
    const logoId = company?.logo?.id

    if (logoId) {
      await axiosInstance.delete(`/api/upload/files/${logoId}`, {
        headers: createAuthHeaders(jwt),
      })

      await axiosInstance.put(
        '/api/company',
        { data: { logo: null } },
        {
          headers: createAuthHeaders(jwt),
        },
      )
    }
  } catch (error) {
    handleApiError(error, 'removeCompanyLogo', 'account.errors')
  }
}

function mapCompanyData(companyData: Record<string, unknown> | null): Company {
  if (!companyData) {
    return getEmptyCompany()
  }

  const logoUrl = (companyData.logo as Record<string, unknown>)?.url as string
  const fullLogoUrl = getStrapiImageUrl(logoUrl)

  return {
    name: (companyData.name as string) || '',
    cnpj: (companyData.cnpj as string) || '',
    address: (companyData.address as string) || '',
    email: (companyData.email as string) || '',
    phone: (companyData.phone as string) || '',
    logo: fullLogoUrl,
  }
}

function getEmptyCompany(): Company {
  return {
    name: '',
    cnpj: '',
    address: '',
    email: '',
    phone: '',
    logo: '',
  }
}
