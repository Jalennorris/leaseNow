
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import FloorPlans from './pages/floorPlans/floorplans'
import ReservePlan from './pages/reservePlan/ReservePlan'
import Register from './pages/Register/register'
import Login from './pages/Login/login'

function App() {


  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/floorplans" element={<FloorPlans />} />
          <Route path="/floorplans/:propertyId/reserve" element={<ReservePlan />} />

          //
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App
