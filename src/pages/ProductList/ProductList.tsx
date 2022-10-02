import './style.css'

export default function ProductList() {
  return (
    <div className="page-container">
      <div className="search-bar">
      <form className='search-form'>
        <div className="form-item">
          <input className='my-input' autoFocus type="search" name="q" />
        </div>
        <div className="form-button">
          <button className='my-btn' type="submit">Buscar</button>
        </div>
      </form>
      </div>

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
                <span className='product-key'>Quantidade:</span> <span className='product-value'>10</span>
              </div>
              <div className='product-data-line'>
                <span className='product-key'>Validade:</span> <span className='product-value'>10/10/2022</span>
              </div>
              <div className='product-data-line'>
                <span className='product-key'>Endereço:</span> <span className='product-value'>PL-02</span>
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
                <span className='product-key'>Quantidade:</span> <span className='product-value'>10</span>
              </div>
              <div className='product-data-line'>
                <span className='product-key'>Validade:</span> <span className='product-value'>10/10/2022</span>
              </div>
              <div className='product-data-line'>
                <span className='product-key'>Endereço:</span> <span className='product-value'>PL-02</span>
              </div>

            </div>
          </div>
  
        </div>
      </div>
    </div>
  )
}
