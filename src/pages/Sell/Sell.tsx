import { useState } from "react";

import AsyncSelect from 'react-select/async';
// eslint-disable-next-line import/no-unresolved
import { SingleValue } from "react-select/dist/declarations/src/types";

import { useStatus } from '../../hooks/useStatus'
import { Loading } from '../../components/Loading/Loading'
import { StockRepository } from '../../data/StockRepository'
import { OrderRepository, OrderStatusType } from "../../data/OrderRepository";
import { Image } from '../../components/Image/Image'
import './style.css'
import { formarNumber } from "../../helpers/formatNumber";
import { CustomTimestamp } from "../../gateways/firebase";

interface ProductDataType {
  id: string | undefined;
  bar_code: string;
  category: string;
  current_address: string;
  name: string;
  price_cost: string;
  price_final: string;
  quantity: number;
  inStockQuantity: number;
  ref_code: number;
  expire_at: CustomTimestamp;
  photo?: string;
  value: string | undefined;
  label: string;
}

export default function SellPage() {

  const [selectedProduct, setSelectedProduct] = useState<ProductDataType | null>();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [order, setOrder] = useState<ProductDataType[]>([]);
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();

  function handleRemoveProductFromOrder(product: ProductDataType) {
    const newOrder = order.filter((item) => item.id !== product.id);
    setOrder(newOrder);
  }

  function handleSelectProduct(selectedOption: SingleValue<ProductDataType>) {
    setSelectedProduct(selectedOption)
    setSelectedQuantity(1)
  }
  const selectLoadOptions = (searchValueParam: string) => {
    const searchValue = String(searchValueParam)
    const isNumber = Number(searchValue);
    let searchKey: "name" | "bar_code" | "category" = 'name';

    if (isNumber) {
      searchKey = 'bar_code';
    } else if (searchValue.length >= 2) {
      searchKey = 'name';
    } else {
      return Promise.resolve([]);
    }

    return new StockRepository().searchStockDataBy({
      key: searchKey,
      value: searchValue
    }).then((data) => {
      return data.map((product) => ({
        value: product.id,
        label: product.name,
        inStockQuantity: product.quantity,
        ...product,
      }));
    });
  }

  function sumSelectProductTotal() {
    const total = selectedQuantity * formarNumber(selectedProduct?.price_final || '');

    if (isNaN(total)) {
      return ''
    }

    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  }

  function handleAddToOrder() {
    if (!selectedProduct) {
      return;
    }

    const existsProduct = order.find((product) => product.id === selectedProduct.id);
    if (existsProduct) {
      const newOrder = order.map((product) => {
        if (product.id === selectedProduct.id) {
          return {
            ...product,
            quantity: product.quantity + selectedQuantity,
          }
        }
        return product;
      })
      setOrder(newOrder)
      setSelectedProduct(null)
      setSelectedQuantity(1)

      return;
    }

    const newOrder = [{ ...selectedProduct, quantity: selectedQuantity }, ...order];
    setOrder(newOrder)

    setSelectedProduct(null)
    setSelectedQuantity(1)
  }

  function sumOrderTotal() {
    const total = order.reduce((acc, product) => {
      const productTotal = product.quantity * formarNumber(product.price_final);
      return acc + productTotal;
    }, 0);

    if (isNaN(total)) {
      return '-'
    }

    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  }

  function handleCreateOrderWithStatus(status: OrderStatusType) {
    const orderRepository = new OrderRepository();

    const newOrder = {
      total_price: sumOrderTotal(),
      status,
      items: order.map((product) => ({
        id: String(product.id),
        name: product.name,
        quantity: product.quantity,
        price_cost: product.price_cost,
        price_final: product.price_final,
      }))
    }

    startLoading()
    orderRepository.createOrder(newOrder)
      .then(() => {
        setSelectedProduct(null)
        setOrder([])
        return updateStockQuantity(order);
      })
      .catch((error) => {
        setErrorLoading(error.message)
      })
      .finally(() => {
        stopLoading()
      });
  }

  function updateStockQuantity(order: ProductDataType[]) {
    const stockRepository = new StockRepository();

    const promises = order.map((product) => {
      const newQuantity = product.inStockQuantity - product.quantity;
      return stockRepository.updateItemQuantityToStock(
        String(product.id),
        {
          quantity: newQuantity < 0 ? 0 : newQuantity,
        }
      );
    })

    return Promise.all(promises);
  }

  return (
    <>
      {loading && <Loading />}
      <div className="sell-page-container">
        <div className="message-banner">
          <h1>Seja bem vindo a página de vendas</h1>
        </div>
        <div className="sell-page-header">

          <div className="input-reader input-reader--select">
            <AsyncSelect
              placeholder="Código de barras, Nome do produto ou use o leitor de código de barras"
              cacheOptions
              escapeClearsValue
              /* @ts-ignore */
              loadOptions={selectLoadOptions}
              isClearable
              isSearchable
              onChange={handleSelectProduct}
              value={selectedProduct}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selectedProduct ) {
                  e.preventDefault();
                  handleAddToOrder();
                }
              }}

            />
          </div>

          <div className="input-reader">
            <label htmlFor="scan-input">Qtd: </label>
            <input
              className="my-input input-number"
              type="number"
              placeholder="Quantidade"
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              value={selectedQuantity}
            />
          </div>

          <div className="input-reader">
            <label htmlFor="scan-input">Preço Un.: {selectedProduct?.price_final ? `R$` : ''}</label>
            <input className="my-input input-number" type="text" placeholder="preco" value={selectedProduct?.price_final ? `${selectedProduct?.price_final}` : 0} />
          </div>

          <div className="input-write">
            <label htmlFor="scan-input">Total: {sumSelectProductTotal()}</label>
          </div>

          <button className="my-btn sell-page-button" disabled={!selectedProduct} onClick={handleAddToOrder}>
            +
          </button>
        </div>

        <div className="sell-page-body">
          <div className="item-list">

            {
              order.map((product) => (
                <div className="item" key={product.id}>
                  <Image photoRef={String(product.photo)} />
                  <div className="title">
                    {product.name}
                    <div className="cod">{product.bar_code}</div>
                  </div>
                  <div className="price">R$ {product.price_final}</div>
                  <div className="qtd">{product.quantity}</div>
                  <button className="my-btn remove-button my-btn-v3" onClick={() => handleRemoveProductFromOrder(product)}>x</button>
                </div>
              ))
            }

          </div>
        </div>

        <div className="sell-page-footer">
          <button className="my-btn sell-page-button" disabled={!order.length} onClick={() => handleCreateOrderWithStatus("pending")}>O cliente vai Pagar depois</button>

          <div className="total-title">
            Total: <span className="total-price">{sumOrderTotal()}</span>
          </div>

          <button className="my-btn sell-page-button my-btn-v2" disabled={!order.length} onClick={() => handleCreateOrderWithStatus("paid")}>O cliente vai Pagar agora</button>

        </div>

      </div>
    </>
  )
}
