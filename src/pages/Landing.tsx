import React from 'react'
import { LandingNav } from '../components/landing/LandingNav'
import { Hero } from '../components/landing/Hero'
import { Showcase } from '../components/landing/Showcase'
import { Team } from '../components/landing/Team'
import { Flow } from '../components/landing/Flow'
import { Workspace } from '../components/landing/Workspace'
import { Honest, FinalCTA, Footer } from '../components/landing/TrustFinalFooter'

/**
 * Public landing page, deliberately outside RequireAuth/RequireOnboarded.
 * Self-contained scroll container: the app shell sets body overflow hidden,
 * so this page owns its own scroll (h-[100dvh] overflow-y-auto).
 * Reads no store, writes nothing. Uses the `lp-*` colour tokens and the display font.
 */
export const Landing: React.FC = () => (
  <div id="top" className="h-[100dvh] overflow-y-auto overflow-x-clip bg-lp-bg font-display text-lp-text">
    <LandingNav />
    <main>
      <Hero />
      <Showcase />
      <Team />
      <Flow />
      <Workspace />
      <Honest />
      <FinalCTA />
    </main>
    <Footer />
  </div>
)
