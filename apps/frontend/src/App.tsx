import { Suspense } from 'react'
import './App.css'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './screens/Landing'
import Login from './screens/Login'
import Register from './screens/Register'
import Terms from './screens/Terms'
import Privacy from './screens/Privacy'
import ForgotPassword from './screens/ForgotPassword'
import ResetPassword from './screens/ResetPassword'
import Home from './screens/Home'
import Game from './screens/Game'
import Play from './screens/Play'
import Layout from './layout'
import { Loader } from './components/Loader'
import { ProtectedRouteWithSuspense } from './components/ProtectedRoute'

import { ToastProvider } from './components/Toast'

function App() {
  return (
    <div>
      <RecoilRoot>
        <ToastProvider>
          <Suspense fallback={<Loader />}>
            <AuthApp />
          </Suspense>
        </ToastProvider>
      </RecoilRoot>
    </div>
  )
}

function AuthApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — accessible by everyone */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes — authenticated users only */}
        <Route
          path="/home"
          element={
            <ProtectedRouteWithSuspense>
              <Layout children={<Home />} />
            </ProtectedRouteWithSuspense>
          }
        />

        {/* Guest-allowed routes — authenticated users OR guests */}
        <Route
          path="/play"
          element={
            <ProtectedRouteWithSuspense>
              <Layout children={<Play />} />
            </ProtectedRouteWithSuspense>
          }
        />
        <Route
          path="/play/:mode"
          element={
            <ProtectedRouteWithSuspense>
              <Layout children={<Play />} />
            </ProtectedRouteWithSuspense>
          }
        />
        <Route
          path="/game/:gameId"
          element={
            <ProtectedRouteWithSuspense>
              <Layout children={<Game />} />
            </ProtectedRouteWithSuspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
