import { Suspense } from 'react'
import './App.css'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './screens/Landing'
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import Game from './screens/Game'
import Play from './screens/Play'
import Layout from './layout'
import { Loader } from './components/Loader'
import { useUser } from '@repo/store/useUser'

function App() {

  return (
    <div>
      <RecoilRoot>
        <Suspense fallback={<Loader/>}>
          <AuthApp/>
        </Suspense>
      </RecoilRoot>
    </div>
  )
}

function AuthApp(){
   const user = useUser();
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout children={<Landing/>} /> }/>
        <Route path="/home" element={ <Layout children={<Home/>} /> }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Register/>}/>
        <Route path="/play" element={ <Layout children={<Play/>} /> }/>
        <Route path="/play/:mode" element={ <Layout children={<Play/>} /> }/>
        <Route path="/game/:gameId" element={ <Layout children={<Game/>} /> }/>
      </Routes>
    </BrowserRouter>
   )
}

export default App
