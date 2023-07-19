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
              <li><a href="/vender">Vender</a></li>
              <li><a href="/stock">Ver Estoque</a></li>
              <li><a href="/stock/add">Incluir Produto no Estoque</a></li>
              <li><a href="/ver-vendas">Histórico de vendas</a></li>
              <li><button onClick={logout}>Sair</button></li>
            </ul>
          </nav>
        </header>
        <Outlet />
      </div>
    </AuthComponent>
  );
}
