import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';

import { auth } from '../../gateways/firebase';
import { Loading } from '../Loading/Loading';

export function AuthComponent({ children }: { children: React.ReactNode }) {
  const [user, userLoading, userError] = useAuthState(auth);
  const navigate = useNavigate();
  const [action, setAction] = useState('login');

  useEffect(() => {
    if (userLoading) {
      setAction('loading');
      return;
    }

    if (userError) {
      setAction('error');
      return;
    }

      setAction(user ? 'user_found' : 'user_not_found');
      return;
  }, [user, userLoading, userError])

  if (action === 'loading') {
    return <Loading />
  }
  
  if (action === 'error') {
    return <div>Error: {userError?.message}</div>;
  }

  if (action === 'user_not_found' && String(window.location.pathname).search('login') <= 0) {
    navigate('/login');
    return null;
  }

  return children;
}
