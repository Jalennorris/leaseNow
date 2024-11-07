
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import FloorPlans from './pages/floorPlans/floorplans'
import ReservePlan from './pages/reservePlan/ReservePlan'
import Register from './pages/Register/register'
import Login from './pages/Login/login'
import Amenities from './pages/Amenities/Amenities'
import Contact from './pages/Contact/contact'

function App() {


  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/floorplans" element={<FloorPlans />} />
          <Route path="/floorplans/:propertyId/reserve" element={<ReservePlan />} />
          <Route  path='amenities' element={<Amenities/>}/> 

          //
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>
          <Route path='contact' element={<Contact />}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App
