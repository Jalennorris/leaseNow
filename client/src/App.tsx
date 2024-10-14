
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import FloorPlans from './pages/floorPlans/floorplans'
import ReservePlan from './pages/reservePlan/ReservePlan'

function App() {


  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/floorplans" element={<FloorPlans />} />
          <Route path="/floorplans/:propertyId/reserve" element={<ReservePlan />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
