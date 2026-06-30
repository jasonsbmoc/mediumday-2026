import { Hero } from './components/Hero/Hero'
import { Speakers } from './components/Speakers/Speakers'
import { FAQ } from './components/FAQ/FAQ'

export default function App() {
  return (
    <main>
      <Hero />
      {/* No rules around Speakers — its organic fringe defines those edges. */}
      <Speakers />
      <FAQ />
    </main>
  )
}
