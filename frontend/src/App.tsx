
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './screens/Home'
import { Game } from './screens/Game'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/game' element={<Game/>} /> 
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
