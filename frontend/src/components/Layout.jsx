import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/tours', label: 'Tours' },
  { to: '/tours/new', label: 'Create tour' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/customers', label: 'Customers' },
  { to: '/guides', label: 'Guides' },
  { to: '/payments', label: 'Payments' },
  { to: '/reports', label: 'Reports' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Tour manager</div>
        <nav className="sidebar-nav">
          {nav.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="sidebar-logout"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Log out
        </button>
      </aside>
      <div className="main-area">
        <header className="top-bar">
          <h1 className="top-bar-title">{user?.name}&apos;s dashboard</h1>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
