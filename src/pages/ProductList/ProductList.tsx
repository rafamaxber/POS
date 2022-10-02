import './style.css'

export default function ProductList() {
  return (
    <div className="page-container">
      <div className="search-bar">search bar</div>

      <div className="showcase">
        <nav className="side-bar">
          <h3 className="side-bar-title">Categorias</h3>
          <ul className='side-bar-list'>
            <li className="side-bar-list-item">
              <a href="#cat1">Categoria 1</a>
            </li>
            <li className="side-bar-list-item">
              <a href="#cat1">Categoria 2</a>
            </li>
            <li className="side-bar-list-item">
              <a href="#cat1">Categoria 3</a>
            </li>
          </ul>
        </nav>

        <div className="product-list">
          
          <div className="product-item">
            <div className='product-image'>
              <img src="https://via.placeholder.com/150" alt="product" />
            </div>
            <div className="product-info">
              <div className='product-title'>Nome do produto</div>
              <div className='product-data-line'>
                <span className='product-key'>Preço:</span> <span className='product-value'>R$ 10,22</span>
              </div>
              <div className='product-data-line'>
                <span className='product-key'>Endereço:</span> <span className='product-value'>PL-02</span>
              </div>
              <div className='product-data-line'>
                Descrição do produto
              </div>
            </div>
          </div>
          
          <div className="product-item">
            <div className='product-image'>
              <img src="https://via.placeholder.com/150" alt="product" />
            </div>
            <div className="product-info">
              <div className='product-title'>Nome do produto</div>
              <div className='product-data-line'>
                <span className='product-key'>Preço:</span> <span className='product-value'>R$ 10,22</span>
              </div>
              <div className='product-data-line'>
                <span className='product-key'>Endereço:</span> <span className='product-value'>PL-02</span>
              </div>
              <div className='product-data-line'>
                Descrição do produto
              </div>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  )
}
