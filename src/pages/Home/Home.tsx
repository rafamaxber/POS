import './style.css'

export default function Home() {
  return (
    <div className="container-all">
      <ul>
        <li><a href="/stock">Incluir Item no Estoque</a></li>
        <li><a href="/stock">Remover Item do Estoque (vender)</a></li>
      </ul>
    </div>
  );
}
