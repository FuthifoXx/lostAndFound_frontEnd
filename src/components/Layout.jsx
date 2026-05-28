import Topbar from './Topbar'
import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className='app-shell'>
      <Topbar />

      <div className='app-body'>
        <Sidebar />

        <main className='app-main'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
