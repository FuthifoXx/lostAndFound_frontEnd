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
import ItemDetails from './pages/ItemDetails'
import AdminClaims from './pages/AdminClaims'
import PendingItems from './pages/PendingItems'
import PartnerDashboard from './pages/PartnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RecoveryHistory from './pages/RecoveryHistory'
import RecoveryAnalytics from './pages/RecoveryAnalytics'
import BranchPerformance from './pages/BranchPerformance'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PartnerRoute from './components/PartnerRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/items' element={<Items />} />
      <Route path='/items/:id' element={<ItemDetails />} />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/notifications'
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/my-items'
        element={
          <ProtectedRoute>
            <Layout>
              <MyItems />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/edit-item/:id'
        element={
          <ProtectedRoute>
            <Layout>
              <EditItem />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/add-item'
        element={
          <PartnerRoute>
            <Layout>
              <AddItem />
            </Layout>
          </PartnerRoute>
        }
      />

      <Route
        path='/partner'
        element={
          <PartnerRoute>
            <Layout>
              <PartnerDashboard />
            </Layout>
          </PartnerRoute>
        }
      />

      <Route
        path='/pending-items'
        element={
          <AdminRoute>
            <Layout>
              <PendingItems />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path='/admin/claims'
        element={
          <AdminRoute>
            <Layout>
              <AdminClaims />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path='/admin'
        element={
          <AdminRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path='/recovery-history'
        element={
          <PartnerRoute>
            <Layout>
              <RecoveryHistory />
            </Layout>
          </PartnerRoute>
        }
      />
      <Route
        path='/analytics/recovery'
        element={
          <PartnerRoute>
            <Layout>
              <RecoveryAnalytics />
            </Layout>
          </PartnerRoute>
        }
      />
      <Route
        path='/analytics/branches'
        element={
          <AdminRoute>
            <Layout>
              <BranchPerformance />
            </Layout>
          </AdminRoute>
        }
      />
    </Routes>
  )
}

export default App
