import AccountPage from './account-page'
import { getCompanyData } from '../services/company-service'
import { getCurrentUser } from '../services/personal-service'

export default async function AccountWrapper() {
  const user = await getCurrentUser()
  const company = await getCompanyData()

  return <AccountPage user={user} company={company} />
}
