import { Suspense, useState } from 'react'
import './App.css'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './screens/Landing'
import Login from './screens/Login'
import Game from './screens/Game'
import Layout from './layout'

function App() {

  return (
    <div>
      <RecoilRoot>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthApp/>
        </Suspense>
      </RecoilRoot>
    </div>
  )
}

function AuthApp(){

   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout children={<Landing/>} /> }/>
        <Route path="/login" element={<Login/>}/> 
        <Route path="/game/:gameId" element={ <Layout children={<Game/>} /> }/>
      </Routes>
    </BrowserRouter>
   )
}

export default App
