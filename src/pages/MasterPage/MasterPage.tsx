import { Outlet } from 'react-router-dom';
import { AuthComponent } from '../../components/AuthComponent/AuthComponent';
import { logout } from '../../gateways/firebase';

import './style.css'

export default function MasterPage() {
  return (
    <AuthComponent>
      <div className="container-all">
        <header className="header">
          <nav className='nav'>
            <ul className='nav-list'>
              <li><a href="/">Pagina inicial</a></li>
              <li><a href="/stock">Ver Estoque</a></li>
              <li><a href="/stock/add">Incluir Produto no Estoque</a></li>
              <li><a onClick={logout}>Sair</a></li>
            </ul>
          </nav>
        </header>
        <Outlet />
      </div>
    </AuthComponent>
  );
}
