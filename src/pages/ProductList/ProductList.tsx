import { ref, getDownloadURL } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { Loading } from '../../components/Loading/Loading'
import { CategoryDataType, StockDataType, StockRepository } from '../../data/StockRepository'
import { useStatus } from '../../hooks/useStatus'
import { storage } from '../../gateways/firebase';
import './style.css'

export function ProductImage({ photoRef }: { photoRef: string }) {
  const [photoUrl, setPhotoUrl] = useState('')
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();

  useEffect(() => {
    if (photoRef) {
      startLoading();

      const gsReference = ref(storage, photoRef);
      getDownloadURL(gsReference).then((url) => {
        console.log(url);
        setPhotoUrl(url);
      }).catch((error) => {
        setErrorLoading(error)
        console.log(error);
      }).finally(() => {
        stopLoading()
      })
    }
  }, [photoRef]);


    if (loading || !photoUrl) {
      return (
        <div className='product-image'>
          <img src='data:image/webp;base64,UklGRooEAABXRUJQVlA4WAoAAAAgAAAAlQAAlQAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOCBMAgAAcBEAnQEqlgCWAD4pFIlDIaEhEapsJBgChLS3cLr4shaz5hhZAjgZKPiA0nEzf9dfPYQ0XLIKGyRcsgobJFyyChskXLIJm7ZZ/1p/JFBsdvOwitjFFI/4246/wjTxzeyuErEmT0OseN+s9VeXgPp0yvV72EeLeoh6bpn0E3bgj1PxmyRdrgUNki5ZBQ2SLlkFDZItIAD+/9LsACGdcrGzxlPU6BOCq7wa7A7fz4x9GAZG0jiv0pyVNFHCRm7C0PnT0a/rRI+4M8LMkqhv6G7vXqj/IBZLlnkO/TQOhGuJbxMXnIUlrkRT+2uVYh6emOKuJhzUfg8gmgOGbwzMbKPaJzEQbuIl7pDVe6RH33vofZlbCgbeZxxdS4I2osCDsgIpz55Q/yX5b0y8+W4CisuMF22U9wx9E+6SfooulF69Tt0JFk043oLESFhaKKA/my1O/0LXLe5arfemH/z2qVRkOFBHhAifJsUaSH5qoVJTvywK1kczNm28v4Mnhn21s7TeT7BJgBLOIjcoXsVwPnz+6oOosRUhFTPczYRnMD78rAnlbn3gHP5x+CbJH++wPVoZUO/xQjKJ/Vulyuzga1W7ezoCHpba29/r8FQAT/+juZpFMnl2pTdo3MNl9byzUzH7wawVI+DwK3zCyHxVCBiJBbKpQWhoY9bMgy9ocKhxsJLQjPc8qjCUR2FVAiBFY29sCFSIbeMhAHz6krpCOTvSvVlpZE8V+0lHK3jPS59CsfGs6S+05kQeX9/HOQpl1nGmEgpTOf5IEAAAAAAA' alt="product" loading='lazy' />
        </div>
      )
    }
  
    return (
      <div className='product-image'>
        <img src={photoUrl} alt="product" loading='lazy' />
      </div>
    )
}

export default function ProductList() {
  const [products, setProducts] = useState<StockDataType[]>([])
  const [categories, setCategories] = useState<CategoryDataType[]>([])
  const [filteredProducts, setFilteredProducts] = useState<StockDataType[] | null>(null)
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();
  
  useEffect(() => {
    startLoading()
    const stockRepository = new StockRepository();
    
    Promise.all([
      stockRepository.getStockData(),
      stockRepository.getCategoryData()
    ]).then(([stockData, categoryData]) => {
      setProducts(stockData)
      setCategories(categoryData)
    }).catch((error) => {
      setErrorLoading(error.message)
    }).finally(() => {
      stopLoading()
    });

  }, [])

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value.toLowerCase()
    const filtered = products.filter((product) => {
      return product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.bar_code.toLowerCase().includes(search) ||
        product.current_address.toLowerCase().includes(search)
    })

    setFilteredProducts(filtered)
  }

  return (
    <>
      {loading && <Loading />}
      <div className="page-container">
        <div className="search-bar">
        <form className='search-form'>
          <div className="form-item">
            <input className='my-input' autoFocus type="search" name="q" onChange={handleSearch} />
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
            {
                categories.map((category) => {
                  return (
                    <li key={category.key} className="side-bar-list-item">
                      <a href={`#${category.key}`} className='side-bar-link'>{category.value}</a>
                    </li>
                  )
                })
              }
            </ul>
          </nav>

          <div className="product-list">
            {
              (filteredProducts || products).map((product) => (
                <div className="product-item" key={product.bar_code}>
                  <ProductImage photoRef={product.photo} />
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
    </>
  )
}
