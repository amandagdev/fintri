import AccountPage from './account-page'
import { getCompanyData, getCurrentUser } from '../services/user-service'

export default async function AccountWrapper() {
  const user = await getCurrentUser()
  const company = await getCompanyData()

  return <AccountPage user={user} company={company} />
}
