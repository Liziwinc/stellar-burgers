import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  children: React.ReactElement;
  notInit?: boolean;
};

export const ProtectedRoute = ({
  children,
  notInit = false
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (notInit && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!notInit && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
