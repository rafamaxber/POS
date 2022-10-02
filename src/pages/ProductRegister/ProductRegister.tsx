import './style.css'

export default function ProductRegister() {
  return (
    <div className="page-container-all">
      <div className="product-form">
        
        <div className='product-form-header'>
          <div className='product-form-title'>
            Incluir um novo produto no estoque.
          </div>
        </div>

        <form className='product-register-form'>
          
          <div className="form-card">

            <div className='form-card-title'>
              Insira somente as informações do produto necessárias
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="code">Código do produto:</label>
              <input className='my-input' required type="text" autoComplete='false' name="code" id="code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="name">Nome:</label>
              <input className='my-input' required type="text" autoComplete='false' name="name" id="name" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="category">Categoria:</label>
              <select className='my-input'>
                <option>Selecionar uma categoria:</option>
                <option value="cat1">ca1</option>
                <option value="cat2">cat2</option>
              </select>
            </div>
            
          </div>
            
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price1">Preço de venda:</label>
              <input className='my-input' required type="text" autoComplete='false' name="price1" id="price1" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price2">Preço de compra:</label>
              <input className='my-input' required type="text" autoComplete='false' name="price2" id="price2" />
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
              <label className='my-label' aria-required htmlFor="address">Endereço:</label>
              <input className='my-input' required type="text" autoComplete='false' name="address" id="address" />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="expireAt">Validade:</label>
              <input className='my-input' required type="date" autoComplete='false' name="expireAt" id="expireAt" />
            </div>
          </div>
          

          <div className="form-upload-container form-card">
            <div className='form-card-title'>
              Faça o upload da imagem do produto
            </div>

            <div className="form-item-upload">
              <label className='my-custom-input-upload' htmlFor="photo">Clique aqui para incluir uma nova imagem:</label>
              <input className='my-input-upload' accept="image/*" type="file" name="photo" id="photo" />
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
