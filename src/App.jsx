import { MotionConfig } from 'framer-motion'
import Experience from './three/Experience.jsx'
import Nav, { WaFab } from './ui/Nav.jsx'
import Hero from './ui/Hero.jsx'
import ValueProps, { Marquee } from './ui/ValueProps.jsx'
import Gallery from './ui/Gallery.jsx'
import Brands from './ui/Brands.jsx'
import HowToBuy from './ui/HowToBuy.jsx'
import Footer from './ui/Footer.jsx'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <WaFab />
      <Experience>
        <Hero />
        <Marquee />
        <ValueProps />
        <Gallery />
        <Brands />
        <HowToBuy />
        <Footer />
      </Experience>
    </MotionConfig>
  )
}
