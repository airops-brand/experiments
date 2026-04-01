import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ASCII from './pages/ASCII'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ascii" element={<ASCII />} />
    </Routes>
  )
}

export default App
