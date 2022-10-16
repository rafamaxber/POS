import './style.css'

export default function Home() {
  return (
    <div className="container-all">
      <ul className='nav-home'>
        <li><a href="/stock">Vender</a></li>
        <li><a href="/stock/add">Incluir Produto no Estoque</a></li>
        <li><a href="/stock">Ver Estoque</a></li>
      </ul>
    </div>
  );
}
