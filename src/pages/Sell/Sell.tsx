import { useState } from "react";
import { ScanPage } from "../../components/ScanPage/ScanPage";
import { CategoryDataType, StockDataType, StockRepository } from '../../data/StockRepository'
import './style.css'

export default function SellPage() {

  const [state, setState] = useState({
    productIdentifier: '',
    quantity: 999,
    price: 999.99,
  });

  const [productList, setProductList] = useState<StockDataType[]>([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value.toLowerCase()
    setState({
      ...state,
      productIdentifier: searchValue
    });

    const isNumber = Number(searchValue);
    if (isNumber) {
      new StockRepository().searchStockDataBy({ 
        key: 'bar_code',
        value: searchValue
      }).then((data) => {
        console.log('data::', data);
        setProductList(data);
      });
      console.log('is a number::', searchValue);
    } else if (searchValue.length >= 3) {
      console.log('searching...', searchValue);
    }


  }

  return (
    <div className="sell-page-container">
      <div className="message-banner">
        <h1>Seja bem vindo a página de vendas</h1>
      </div>
      <div className="sell-page-header">
        
        <div className="input-reader">
          <input 
            className="my-input input-datalist" 
            placeholder="Código de barras, Nome do produto ou use o leitor de código de barras" 
            list="product_list" 
            name="product_identifier" 
            id="product_identifier" 
            onChange={handleSearch}
            value={state.productIdentifier}
          />
          <datalist id="product_list">
            {productList.map((product) => (
              <option key={product.id} value={product.bar_code}>{product.name}</option>
            ))}
          </datalist>
        </div>

        <div className="input-reader">
          <label htmlFor="scan-input">Qtd: </label>
          <input 
            className="my-input input-number" 
            type="number" 
            placeholder="Quantidade" 
            value={state.quantity} 
          />
        </div>
        
        <div className="input-reader">
          <label htmlFor="scan-input">Preço Un.: {state.price ? `R$` : ''}</label>
          <input className="my-input input-number" type="text" placeholder="preco" value={state.price ? `${state.price}` : 0} />
        </div>
        
        <div className="input-write">
          <label htmlFor="scan-input">Total: {state.quantity * state.price ? `R$ ${state.price}` : 0}</label>
        </div>

        <button className="my-btn sell-page-button">+</button>
      </div>

      <div className="sell-page-body">
        <div className="item-list">
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
          <div className="item">
            <div className="title">
              joelho 90º azul soldavel com bucha de latão 25mm 3/4
              <div className="cod">178979011300558</div>
            </div>
            <div className="price">R$ 7,00</div>
            <div className="qtd">2</div>
            <button className="my-btn remove-button my-btn-v3">x</button>
          </div>
          
        </div>
      </div>

      <div className="sell-page-footer">
        <button className="my-btn sell-page-button">O cliente vai Pagar depois</button>
        <div className="total-title">Total:</div>
        <div className="total-price">R$ 7,00</div>

        <button className="my-btn sell-page-button my-btn-v2">O cliente vai Pagar agora</button>

      </div>

    </div>

  )
}
