'use client'

import { useEffect, useState } from 'react'
import LandingSection from './components/LandingSection'
import Timeline from './components/Timeline'

export default function Home() {
  const [spotlightActive, setSpotlightActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY < 50) {
        setSpotlightActive(true)
      }
    }, 5000)

    const handleInteraction = () => {
      setSpotlightActive(false)
    }

    window.addEventListener('scroll', handleInteraction)
    window.addEventListener('click', handleInteraction)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
    }
  }, [])

  return (
    <main>
      {spotlightActive && (
        <div
          onClick={() => setSpotlightActive(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            pointerEvents: 'none',
            animation: 'fadeIn 0.8s ease forwards',
          }}
        />
      )}

      <LandingSection />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0 64px',
        marginBottom: '48px',
      }}>
        <span style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#1D1D0C',
          opacity: 0.3,
          fontFamily: 'Satoshi, sans-serif',
        }}>
          ↓ scroll
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: spotlightActive ? 51 : 'auto' }}>
        <Timeline spotlightActive={spotlightActive} />
      </div>

    </main>
  )
}