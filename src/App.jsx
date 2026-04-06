import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ASCII from './pages/ASCII'
import NewNav from './pages/NewNav'
import BrandTeam from './pages/BrandTeam'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ascii" element={<ASCII />} />
      <Route path="/new-nav" element={<NewNav />} />
      <Route path="/brand-team" element={<BrandTeam />} />
    </Routes>
  )
}

export default App
