import { Hero } from './components/Hero/Hero'
import { Speakers } from './components/Speakers/Speakers'
import { FAQ } from './components/FAQ/FAQ'
import { FinalCta } from './components/FinalCta/FinalCta'
import { Footer } from './components/Footer/Footer'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        {/* No rules around Speakers — its organic fringe defines those edges. */}
        <Speakers />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
