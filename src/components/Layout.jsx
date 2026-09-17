import { useState } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='app-shell'>
      <Topbar
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((open) => !open)}
      />

      <div className='app-body'>
        <Sidebar
          open={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <button
            type='button'
            className='sidebar-backdrop'
            aria-label='Close navigation menu'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className='app-main'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
