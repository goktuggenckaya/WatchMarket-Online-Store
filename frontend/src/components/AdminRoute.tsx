import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../Store';
import SalesManagerPage from '../pages/SalesManagerPage';

export default function ProtectedRoute() {
  const {
    state: { userInfo },
  } = useContext(Store);

  if (userInfo && userInfo.isAdmin) {
    if (userInfo.name === 'Product Manager') {
      return <Outlet />;
    } else if (userInfo.name === 'Sales Manager') {
      return <SalesManagerPage />;
    }
  } else {
    return <Navigate to="/signin" />;
  }
}
