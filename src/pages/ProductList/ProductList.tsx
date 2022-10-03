import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { StockDataType, StockRepository } from '../../data/StockRepository'
import './style.css'

export default function ProductList() {
  const [products, setProducts] = useState<StockDataType[]>([])

  useEffect(() => {
    new StockRepository().getStockData()
      .then((data) => {
        setProducts(data)
        console.log(data)
      })
  }, [])
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
          
          {
            products && products.map((product) => (
              <div className="product-item" key={product.bar_code}>
                <div className='product-image'>
                  <img src="https://via.placeholder.com/150" alt="product" />
                </div>
                <div className="product-info">
                  <div className='product-title'>{product.name}</div>
                  <div className='product-data-line'>
                    <span className='product-key'>Código:</span> <span className='product-value'>{product.bar_code} {product.ref_code}</span>
                  </div>
                  <div className='product-data-line'>
                    <span className='product-key'>Preço:</span> <span className='product-value'>R$ {product.price_final}</span>
                  </div>
                  <div className='product-data-line'>
                    <span className='product-key'>Quantidade:</span> <span className='product-value'>{product.quantity}</span>
                  </div>
                  {product?.expire_at && <div className='product-data-line'>
                    {/* <span className='product-key'>Validade:</span> <span className='product-value'>{Timestamp.fromMillis product.expire_at.toDate().toJSON()}</span> */}
                  </div>}
                  <div className='product-data-line'>
                    <span className='product-key'>Endereço:</span> <span className='product-value'>{product.current_address}</span>
                  </div>
                </div>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  )
}
