import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/slices/userSlice';
import { AppDispatch, RootState } from '../../services/store';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <ForgotPasswordUI
      errorText={error || undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
