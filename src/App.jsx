import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddItem from './pages/AddItem'
import MyItems from './pages/MyItems'
import Notifications from './pages/Notifications'
import EditItem from './pages/EditItem'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path='/add-item' element={<AddItem />} />
      <Route path='/my-items' element={<MyItems />} />
      <Route path='/notifications' element={<Notifications />} />
      <Route path='/edit-item/:id' element={<EditItem />} />
    </Routes>
  )
}

export default App
