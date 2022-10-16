import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { UploadFile } from '../../components/UploadFile/UploadFile';
import { StockDataType, StockRepository } from '../../data/StockRepository';
import './style.css'

export default function ProductRegister() {
  const [photoRef, setPhotoRef] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  
  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = Object.fromEntries(new FormData(event.currentTarget)) as unknown as StockDataType;

    new StockRepository().addItemToStock({
      ...body,
      photo: photoRef
    })
      .then(() => {
        formRef.current?.reset();
        firstInput.current?.focus();
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

        <form className='product-register-form' onSubmit={handleRegister} ref={formRef}>
          
          <div className="form-card">

            <div className='form-card-title'>
              Insira somente as informações do produto necessárias
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="bar_code">Código do produto:</label>
              <input className='my-input' ref={firstInput} autoFocus required type="text" autoComplete='false' name="bar_code" id="bar_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="ref_code">SKU:</label>
              <input className='my-input' type="text" autoComplete='false' name="ref_code" id="ref_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="name">Nome:</label>
              <input className='my-input' required type="text" autoComplete='false' name="name" id="name" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="category">Categoria:</label>
              <select className='my-input' required name='category' id='category'>
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
              <label className='my-label' htmlFor="expire_at">Validade:</label>
              <input className='my-input' type="date" autoComplete='false' name="expire_at" id="expire_at" />
            </div>
          </div>

          <div className="form-upload-container form-card">
            <div className='form-card-title'>
              Faça o upload da imagem do produto
            </div>

            <UploadFile setReferenceFilePath={(ref) => setPhotoRef(ref || '')}/>
          </div>

          <div className="form-button-container">
            <button className='my-btn' type="submit">Criar novo produto</button>
          </div>

        </form>
      </div>
    </div>
  )
}
