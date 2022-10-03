import { toast } from 'react-toastify';
import { StockDataType, StockRepository } from '../../data/StockRepository';
import './style.css'

export default function ProductRegister() {
  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = Object.fromEntries(new FormData(event.currentTarget)) as unknown as StockDataType;

    new StockRepository().addItemToStock(body)
      .then(() => {
        toast.success('Produto cadastrado com sucesso!');
      })
      .catch((error) => {
        toast.error(error.message);
      })
  }

  return (
    <div className="page-container-all">
      <div className="product-form">
        
        <div className='product-form-header'>
          <div className='product-form-title'>
            Incluir um novo produto no estoque.
          </div>
        </div>

        <form className='product-register-form' onSubmit={handleRegister}>
          
          <div className="form-card">

            <div className='form-card-title'>
              Insira somente as informações do produto necessárias
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="bar_code">Código do produto:</label>
              <input className='my-input' autoFocus required type="text" autoComplete='false' name="bar_code" id="bar_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="ref_code">SKU:</label>
              <input className='my-input' autoFocus required type="text" autoComplete='false' name="ref_code" id="ref_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="name">Nome:</label>
              <input className='my-input' required type="text" autoComplete='false' name="name" id="name" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="category">Categoria:</label>
              <select className='my-input' name='category' id='category'>
                <option>Selecionar uma categoria:</option>
                <option value="cat1">ca1</option>
                <option value="cat2">cat2</option>
              </select>
            </div>
            
          </div>
            
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price_final">Preço de venda:</label>
              <input className='my-input' required type="text" autoComplete='false' name="price_final" id="price_final" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price_cost">Preço de compra:</label>
              <input className='my-input' required type="text" autoComplete='false' name="price_cost" id="price_cost" />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="quantity">Quantidade:</label>
              <input className='my-input' required type="number" autoComplete='false' name="quantity" id="quantity" />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="current_address">Endereço:</label>
              <input className='my-input' required type="text" autoComplete='false' name="current_address" id="current_address" />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="expire_at">Validade:</label>
              <input className='my-input' required type="date" autoComplete='false' name="expire_at" id="expire_at" />
            </div>
          </div>
          

          <div className="form-upload-container form-card">
            <div className='form-card-title'>
              Faça o upload da imagem do produto
            </div>

            <div className="form-item-upload">
              <label className='my-custom-input-upload' htmlFor="photo">Clique aqui para incluir uma nova imagem:</label>
              <input className='my-input-upload' multiple accept="image/*" type="file" name="photo" id="photo" />
            </div>
          </div>

          <div className="form-button">
            <button className='my-btn' type="submit">Criar novo produto</button>
          </div>


        </form>
      </div>
    </div>
  )
}
