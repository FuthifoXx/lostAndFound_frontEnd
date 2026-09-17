import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

function Layout({ children }) {
  const [sidebarPath, setSidebarPath] = useState(null)
  const { pathname } = useLocation()
  const sidebarOpen = sidebarPath === pathname

  return (
    <div className='app-shell'>
      <Topbar
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarPath(sidebarOpen ? null : pathname)}
      />

      <div className='app-body'>
        <Sidebar
          open={sidebarOpen}
          onNavigate={() => setSidebarPath(null)}
        />

        <button
          type='button'
          className={`sidebar-backdrop${sidebarOpen ? ' backdrop-open' : ''}`}
          aria-label='Close navigation menu'
          aria-hidden={!sidebarOpen}
          tabIndex={sidebarOpen ? 0 : -1}
          onClick={() => setSidebarPath(null)}
        />

        <main className='app-main'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
