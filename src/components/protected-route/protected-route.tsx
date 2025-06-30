import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  children: React.ReactElement;
  notInit?: boolean; // Этот пропс для маршрутов, доступных только неавторизованным пользователям
};

export const ProtectedRoute = ({
  children,
  notInit = false
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  // Если проверка авторизации еще не завершилась, показываем загрузчик
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Логика для маршрутов, доступных только неавторизованным пользователям (например, /login, /register)
  if (notInit && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // Логика для маршрутов, доступных только авторизованным пользователям (например, /profile)
  if (!notInit && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если все проверки пройдены, рендерим дочерний компонент
  return children;
};
