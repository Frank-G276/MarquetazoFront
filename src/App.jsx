import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { Layout } from './components/Layout.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { CategoriesProvider } from './context/CategoriesContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { ProductsAdminPage } from './pages/ProductsAdminPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'
import { OrdersPage } from './pages/OrdersPage.jsx'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.jsx'
import { ProductDetailPage } from './pages/ProductDetailPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ShippingPolicyPage } from './pages/ShippingPolicyPage.jsx'
import { ShopPage } from './pages/ShopPage.jsx'
import { SearchPage } from './pages/SearchPage.jsx'

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <CategoriesProvider>
      <ProductsProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tienda" element={<ShopPage />} />
              <Route path="/buscar" element={<SearchPage />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/envios" element={<ShippingPolicyPage />} />
              <Route path="/privacidad" element={<PrivacyPolicyPage />} />

              <Route
                path="/carrito"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-pedidos"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panel"
                element={
                  <ProtectedRoute managerOnly>
                    <ProductsAdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </ProductsProvider>
      </CategoriesProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
