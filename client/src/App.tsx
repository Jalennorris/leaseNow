
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import FloorPlans from './pages/floorPlans/floorplans'

function App() {


  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/floorplans" element={<FloorPlans />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
