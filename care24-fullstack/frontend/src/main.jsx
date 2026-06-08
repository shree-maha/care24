import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LandingPage          from './Care24LandingPage'
import AuthPage             from './Care24AuthPage'
import ServicesPage         from './Care24ServicesPage'
import BookingPage          from './Care24BookingPage'
import UserDashboard        from './Care24UserDashboard'
import AdminDashboard       from './Care24AdminDashboard'
import CaregiverDashboard   from './Care24CaregiverDashboard'

function App() {
  const [route, setRoute] = React.useState(
    window.location.hash.replace('#/', '') || 'landing'
  )

  const navigate = (page) => {
    window.location.hash = `/${page}`
    setRoute(page)
    window.scrollTo(0, 0)
  }

  React.useEffect(() => {
    const handler = () => {
      setRoute(window.location.hash.replace('#/', '') || 'landing')
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const props = { onNavigate: navigate }

  switch (route) {
    case 'auth':              return <AuthPage              {...props} />
    case 'services':          return <ServicesPage          {...props} />
    case 'booking':           return <BookingPage           {...props} />
    case 'dashboard':         return <UserDashboard         {...props} />
    case 'caregiver-dashboard': return <CaregiverDashboard  {...props} />
    case 'admin':             return <AdminDashboard        {...props} />
    default:                  return <LandingPage           {...props} />
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
