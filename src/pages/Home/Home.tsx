import './style.css'

export default function Home() {
  return (
    <div className="container-all">
      <ul className='nav-home'>
        <li><a href="/vender">Vender</a></li>
        <li><a href="/stock">Ver Estoque</a></li>
        <li><a href="/stock/add">Incluir Produto no Estoque</a></li>
        <li><a href="/ver-vendas">Histórico de vendas</a></li>
      </ul>
    </div>
  );
}
