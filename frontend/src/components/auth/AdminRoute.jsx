import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);


  if (!user || user.role !== 'admin') {
    console.warn("Unauthorized access attempt detected. User role:", user?.role);
    return <Navigate to="/login" replace />;
  }

  console.log("Admin authorization confirmed.");
  return children;
};

export default AdminRoute;
