import LandingSection from './components/LandingSection'
import Timeline from './components/Timeline'

export default function Home() {
  return (
    <main>
  <LandingSection />
  <div style={{ position: 'relative', zIndex: 51 }}>
    <Timeline />
  </div>
</main>
  )
}