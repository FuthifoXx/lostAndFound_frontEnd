import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddItem from './pages/AddItem'
import MyItems from './pages/MyItems'
import Notifications from './pages/Notifications'
import EditItem from './pages/EditItem'
import Items from './pages/Items'
import ProtectedRoute from './components/ProtectedRoute'
import ItemDetails from './pages/ItemDetails'

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
      <Route path='/items' element={<Items />} />
      <Route path='/items/:id' element={<ItemDetails />} />
    </Routes>
  )
}

export default App
