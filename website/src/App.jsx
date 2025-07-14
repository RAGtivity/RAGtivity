import { useState } from 'react'
import Sidebar from "./components/Sidebar"
import Main from './components/Main'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  if (!isLoggedIn) {
    if (showSignup) {
      return <Signup onSignup={() => setShowSignup(false)} onSwitchToLogin={() => setShowSignup(false)} />
    }
    return <Login onLogin={() => setIsLoggedIn(true)} onSwitchToSignup={() => setShowSignup(true)} />
  }

  return (
    <div className='flex'>
      <Sidebar />
      <Main />
    </div>
  )
}

export default App
