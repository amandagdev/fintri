import Footer from '@/common/components/footer/footer'
import LandingIntro from '@/features/landing-intro/landing-intro'
import LandingPrice from '@/features/landing-price/landing-price'
import LandingStarted from '@/features/landing-started/landing-started'

export default function HomePage() {
  return (
    <div className="bg-white items-center flex flex-col h-screen">
      <LandingIntro />
      <LandingStarted />
      <LandingPrice />
      <Footer />
    </div>
  )
}
