import { Outlet } from 'react-router-dom';
import { AuthComponent } from '../../components/AuthComponent/AuthComponent';
import './style.css'

export default function AuthLayout() {
  
  return (
    <AuthComponent>
      <div className="auth-layout">
        <Outlet />
      </div>
    </AuthComponent>
  );
}
