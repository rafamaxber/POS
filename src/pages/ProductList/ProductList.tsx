import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loading } from '../../components/Loading/Loading'
import { CategoryDataType, StockDataType, StockRepository } from '../../data/StockRepository'
import { useStatus } from '../../hooks/useStatus'
import './style.css'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from '@chakra-ui/react'
import { Image } from '../../components/Image/Image'
import { format } from 'date-fns'

export default function ProductList() {
  const [products, setProducts] = useState<StockDataType[]>([])
  const [categories, setCategories] = useState<CategoryDataType[]>([])
  const [filteredProducts, setFilteredProducts] = useState<StockDataType[] | null>(null)
  const [modalData, setModalData] = useState<{type: string; data: StockDataType } | null>(null)
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  function handleStockDataByCategory(category: string) {

    if (category === 'all') {
      setFilteredProducts(null)
      return
    }

    const filtered = products.filter((product) => product.category === category)

    setFilteredProducts(filtered)
  }

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

  function handleOpenModalDeleteProduct(product: StockDataType) {
    onOpen();

    setModalData({
      type: 'DELETE',
      data: product
    })
  }

  async function handleDeleteProduct() {
    const stockRepository = new StockRepository();
    startLoading()

    modalData?.data.id && stockRepository.deleteStockData(modalData?.data.id)
    .then(() => {
      setProducts(products.filter((product) => product.id !== modalData?.data.id))
      onClose()
    })
    .catch((error) => {
      setErrorLoading(error.message)
    })
    .finally(() => {
      stopLoading()
    });
  }

  function sortProductList(a: StockDataType, b: StockDataType) {
    if (a.quantity > b.quantity) {
      return 1
    }
    if (a.quantity < b.quantity) {
      return -1
    }

    return 0
  }

  function getClassNameByQuantity(quantity: number) {
    if (quantity <= 0) {
      return 'product-item-container--out-of-stock'
    }

    if (quantity <= 5) {
      return 'product-item-container--low-stock'
    }

    return ''
  }

  return (
    <>
      {loading && <Loading />}
      <div className="page-container">
        <div className="search-bar">
        <div className='search-form'>
          <div className="form-item">
            <input className='my-input' autoFocus type="search" name="q" onChange={handleSearch} />
          </div>
          <div className="form-button">
            <button className='my-btn' type="submit">Buscar</button>
          </div>
        </div>
        </div>

        <div className="showcase">
          <nav className="side-bar">
            <h3 className="side-bar-title">Categorias</h3>
            <ul className='side-bar-list'>
              <li className="side-bar-list-item">
                <button onClick={() => handleStockDataByCategory('all')} className='side-bar-link'>Todos</button>
              </li>
            {
                categories.map((category) => (
                  <li key={category.key} className="side-bar-list-item">
                    <button onClick={() => handleStockDataByCategory(category.key)} className='side-bar-link'>{category.value}</button>
                  </li>
                ))
            }
            </ul>
          </nav>

          <div className="product-list">
            {
              (filteredProducts || products).sort(sortProductList).map((product) => (
                <div className={`product-item-container ${getClassNameByQuantity(product.quantity)}`} key={product.id}>
                  <div className="product-item">
                    <Image photoRef={String(product.photo)} />
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
                      {product?.expire_at && (
                        <div className='product-data-line'>
                          <span className='product-key'>Validade:</span> <span className='product-value'>{format(product.expire_at.toDate(), 'dd/MM/yyyy HH:mm:ss')}</span>
                        </div>
                      )}
                      <div className='product-data-line'>
                        <span className='product-key'>Endereço:</span> <span className='product-value'>{product.current_address}</span>
                      </div>
                    </div>

                  </div>

                  <div className='product-actions'>
                    <Link to={`/stock/${product.id}/edit`}>
                      <button className='my-btn'>Atualizar</button>
                    </Link>
                    <button className='my-btn my-btn-v3' onClick={() => handleOpenModalDeleteProduct(product)}>Excluir</button>
                  </div>
                </div>
              ))
            }

          </div>
        </div>
      </div>

      <DeleteProduct isOpen={isOpen} onClose={onClose} onDelete={handleDeleteProduct}/>
    </>
  )
}

function DeleteProduct({ isOpen, onClose, onDelete }: {isOpen: boolean, onClose: () => void, onDelete: () => void}) {
  const cancelRef = useRef()

  return (
    <AlertDialog
      isOpen={isOpen}
      //@ts-ignore
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Apagar Produto
          </AlertDialogHeader>

          <AlertDialogBody>
            Tem certeza que quer apagar este produto?
          </AlertDialogBody>

          <AlertDialogFooter>
            {/* @ts-ignore */}
            <Button ref={cancelRef} onClick={onClose}>
              Não, Cancelar
            </Button>
            <Button colorScheme='red' onClick={onDelete} ml={3}>
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
