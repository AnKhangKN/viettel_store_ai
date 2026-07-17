import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute – Bảo vệ route theo vai trò người dùng.
 *
 * @param {string} requiredRole - Vai trò được phép vào: 'admin' | 'staff' | 'user' | undefined (public)
 * @param {React.ReactNode} children
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const user = useSelector((state) => state.auth.user)
  const accessToken = useSelector((state) => state.auth.accessToken)

  const role = user?.role || null

  // Chưa đăng nhập mà cần quyền → về login
  if (requiredRole && !accessToken) {
    return <Navigate to="/login" replace />
  }

  // Đã đăng nhập → kiểm tra role có khớp không
  if (requiredRole && role !== requiredRole) {
    // Redirect về trang chủ tương ứng với role thực tế
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (role === 'staff') return <Navigate to="/staff/dashboard" replace />
    // role là 'user' hoặc không xác định → về trang chủ user
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
