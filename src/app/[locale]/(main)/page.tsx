import LandingIntro from '@/features/landing-intro/landing-intro'
import LandingPrice from '@/features/landing-price/landing-price'
import LandingStarted from '@/features/landing-started/landing-started'

export default function HomePage() {
  return (
    <div>
      <LandingIntro />
      <LandingStarted />
      <LandingPrice />
    </div>
  )
}
