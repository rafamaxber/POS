import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ScanPage } from '../../components/ScanPage/ScanPage';
import { UploadFile } from '../../components/UploadFile/UploadFile';
import { CategoryDataType, StockDataType, StockRepository } from '../../data/StockRepository';
import { getProductDataByEAN } from '../../gateways/brasilApi';
import CreatableSelect from 'react-select/creatable';


import './style.css'
import { slugify } from '../../helpers/slugify';
import { OnChangeValue } from 'react-select';

interface CategoryProps { label: string; value: string, __isNew__?: boolean }

export default function ProductRegister() {
  const [photoRef, setPhotoRef] = useState('');
  const [barCodeValue, setBarCodeValue] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryProps | null>(null);
  const [categoryData, setCategoryData] = useState<Array<CategoryProps>>([]);
  const [barCodeInputManually, setBarCodeInputManually] = useState(false);
  const [formData, setFormData] = useState({});
  const formRef = useRef<HTMLFormElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    new StockRepository().getCategoryData()
      .then((data: CategoryDataType[]) => {
        setCategoryData(data.map(c => ({ value: c.key, label: c.value })));
      });
  }, []);
  
  useEffect(() => {
    if (barCodeValue) {
      new StockRepository().getStockDataByBarCode(barCodeValue)
        .then((data: StockDataType) => {
          console.log(data);
        });
    }
  }, [barCodeValue]);
  
  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = formData as StockDataType;
    
    try {
      if (newCategory) {
        new StockRepository().addCategoryData({
          key: newCategory.value,
          value: newCategory.label
        })
        .then(() => {
          toast.success('Nova categoria criada com sucesso!');
        })
      }
      
      new StockRepository().addItemToStock({
        ...body,
        photo: photoRef,
        bar_code: barCodeValue,
      })
      .then(() => {
        formRef.current?.reset();
        firstInput.current?.focus();
        toast.success('Produto cadastrado com sucesso!');
      })
    } catch (error) {
      toast.error(new Error(String(error)).message);
    }
  }

  function handleBarCodeValue(event: React.FormEvent<HTMLInputElement>) {
    setBarCodeValue(event.currentTarget.value);
  }
  
  function handleScanSubmit(barCode: string) {
    setBarCodeValue(barCode);
  }
  
  function handleScanClose() {
    setBarCodeInputManually(true);
  }
  
  function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormData((oldData) => ({
      ...oldData,
      [name]: value
    }));

    console.log(formData);
  }

  function handleCategoryChange(newValue: OnChangeValue<CategoryProps, false>) {
    let categoryData = {
      label: newValue?.label || '',
      value: newValue?.value || '',
    };

    if (newValue?.__isNew__) {
      categoryData = {
        label: newValue?.label,
        value: slugify(newValue?.value),
      }

      setNewCategory(categoryData);
    }

    setFormData((oldData) => ({
      ...oldData,
      category: categoryData?.value,
    }));
    
  }

  if (!barCodeValue && !barCodeInputManually) {
    return (
      <ScanPage onSubmit={handleScanSubmit} onClose={handleScanClose}/>
    )
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
              <label className='my-label' aria-required htmlFor="bar_code">Código de barras do produto:</label>
              <input className='my-input' ref={firstInput} autoFocus required type="text" autoComplete='false' onInput={handleBarCodeValue} value={barCodeValue} name="bar_code" id="bar_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="ref_code">SKU:</label>
              <input className='my-input' type="text" onInput={handleInputChange} autoComplete='false' name="ref_code" id="ref_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="name">Nome:</label>
              <input className='my-input' required type="text" onInput={handleInputChange} autoComplete='false' name="name" id="name" />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="category">Categoria:</label>
              <CreatableSelect options={categoryData} name="category" id="category" onChange={handleCategoryChange} />
            </div>
            
          </div>

          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price_final">Preço de venda:</label>
              <input className='my-input' type="text" autoComplete='false' name="price_final" id="price_final" onInput={handleInputChange} />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price_cost">Preço de compra:</label>
              <input className='my-input' type="text" autoComplete='false' name="price_cost" id="price_cost" onInput={handleInputChange} />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="quantity">Quantidade:</label>
              <input className='my-input' required type="number" autoComplete='false' name="quantity" id="quantity" onInput={handleInputChange} />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="current_address">Endereço:</label>
              <input className='my-input' type="text" autoComplete='false' name="current_address" id="current_address" onInput={handleInputChange} />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' htmlFor="expire_at">Validade:</label>
              <input className='my-input' type="date" autoComplete='false' name="expire_at" id="expire_at" onInput={handleInputChange} />
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
