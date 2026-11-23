import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import AppLayout from './screens/AppLayout'
import Splash from './screens/01-Splash'
import Onboarding from './screens/02-04-Onboarding'
import SignUp from './screens/05-SignUp'
import ProfileSetup from './screens/06-ProfileSetup'
import Home from './screens/07-Home'
import Packs from './screens/08-Packs'
import CreateRoom from './screens/09-CreateRoom'
import JoinRoom from './screens/10-JoinRoom'
import HowToPlay from './screens/23-HowToPlay'
import Profile from './screens/24-Profile'
import RoomScreen from './screens/RoomScreen'

// Dev-only previews of the system states (removed from production builds).
const NoInternet = import.meta.env.DEV ? lazy(() => import('./screens/25-NoInternet')) : null
const PlayerDisconnected = import.meta.env.DEV ? lazy(() => import('./screens/26-PlayerDisconnected')) : null
const HostTransfer = import.meta.env.DEV ? lazy(() => import('./screens/27-HostTransfer')) : null

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/packs" element={<Packs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/join/:code" element={<JoinRoom />} />
          <Route path="/room/:code" element={<RoomScreen />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          {NoInternet && <Route path="/dev/no-internet" element={<NoInternet />} />}
          {PlayerDisconnected && <Route path="/dev/disconnected" element={<PlayerDisconnected />} />}
          {HostTransfer && <Route path="/dev/host-transfer" element={<HostTransfer />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
