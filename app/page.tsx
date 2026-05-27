import LandingSection from './components/LandingSection'
import Timeline from './components/Timeline'
import SpotlightOverlay from './components/SpotlightOverlay'

export default function Home() {
  return (
    <main>
  <SpotlightOverlay />
  <LandingSection />
  <div style={{ position: 'relative', zIndex: 51 }}>
    <Timeline />
  </div>
</main>
  )
}