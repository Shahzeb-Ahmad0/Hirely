import './App.css'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import InterviewReportPage from './pages/InterviewReportPage.jsx'
import Error from "./pages/Error.jsx"
import Loader from './pages/Loader.jsx'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/dashboard/:id' element={<InterviewReportPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/error' element={<Error/>} />
      <Route path='/loader' element={<Loader/>} />
      <Route path='*' element={<Error/>} />
    </Routes>
    </>
  )

}

export default App
