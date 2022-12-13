import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

import { ScanPage } from '../../components/ScanPage/ScanPage';
import { UploadFile } from '../../components/UploadFile/UploadFile';
import { useStatus } from '../../hooks/useStatus'

import { CategoryDataType, StockDataType, StockRepository } from '../../data/StockRepository';
import { OnChangeValue } from 'react-select';
import { getProductDataByEAN } from '../../gateways/brasilApi';
import CreatableSelect from 'react-select/creatable';

import './style.css'
import { slugify } from '../../helpers/slugify';
import { Timestamp } from 'firebase/firestore';

interface CategoryProps { label: string | undefined; value: string | undefined, __isNew__?: boolean }

export default function ProductRegister() {
  const { id: productIdInEdition = null } = useParams<{ id: string }>();
  const [photoRef, setPhotoRef] = useState('');
  const [barCodeValue, setBarCodeValue] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryProps | null>(null);
  const [categoryData, setCategoryData] = useState<Array<CategoryProps>>([]);
  const [barCodeInputManually, setBarCodeInputManually] = useState(false);
  const [formData, setFormData] = useState<StockDataType>();
  const formRef = useRef<HTMLFormElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();
  const navigate = useNavigate();


  useEffect(() => {
    new StockRepository().getCategoryData()
      .then((data: CategoryDataType[]) => {
        setCategoryData(data.map(c => ({ value: c.key, label: c.value })));
      });
  }, []);
  
  useEffect(() => {
    if (productIdInEdition) {
      new StockRepository().getStockDataById(productIdInEdition)
      .then(data => {
        Object.entries(data)
          .forEach(([key, value]) => {
            if (key === 'bar_code') {
              setBarCodeValue(value);
              return;
            }

            if (key === 'category') {
              setFormData((oldData) => ({
                ...oldData,
                category: value,
              } as StockDataType));
              return;
            }
            
            if (key === 'photo') {
              setPhotoRef(value)
              return;
            }
            
            if (key === 'expire_at') {
              const expireAt = value ? new Date(new Timestamp(value?.seconds, value?.nanoseconds).toDate()) : null;
              const expireAtFormatted = expireAt ? `${expireAt.getFullYear()}-${expireAt.getMonth() + 1}-${String(expireAt.getDate()).padStart(2,'0')}` : '';

              setFormData((oldData) => ({
                ...oldData,
                [key]: expireAtFormatted,
              } as unknown as StockDataType));
              return;
            }

            setFormData((oldData) => ({
              ...oldData,
              [key]: value
            } as StockDataType));
          })
      })
      .catch((error) => {
        toast.error(new Error(String(error)).message);
      })
    }
  }, [categoryData]);
  
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
    startLoading();

    const body = formData as StockDataType;
    
    try {
      if (newCategory) {
        new StockRepository().addCategoryData({
          key: String(newCategory?.value),
          value: String(newCategory?.label),
        })
        .then(() => {
          toast.success('Nova categoria criada com sucesso!');
        })
      }
      
      if (productIdInEdition) {
        new StockRepository().updateItemToStock(productIdInEdition, {
          ...body,
          photo: photoRef,
          bar_code: barCodeValue,
        })
          .then(() => {
            toast.success('Produto atualizado com sucesso!', {
              onClose: () => navigate('/stock')
            });

          })

          return;
        }

      new StockRepository().addItemToStock({
        ...body,
        photo: photoRef,
        bar_code: barCodeValue,
      })
      .then(() => {
        setFormData({} as StockDataType);
        setBarCodeValue('');
        formRef.current?.reset();
        firstInput.current?.focus();
        toast.success('Produto cadastrado com sucesso!');
      })
    } catch (error) {
      stopLoading();
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
    } as StockDataType));

    console.log(formData);
  }

  function handleCategoryChange(newValue: OnChangeValue<CategoryProps, false>) {
    let categoryData = {
      label: newValue?.label || undefined,
      value: newValue?.value || undefined,
    };

    if (newValue?.__isNew__) {
      categoryData = {
        label: newValue?.label,
        value: newValue?.value && slugify(newValue.value),
      }

      setNewCategory(categoryData);
      setCategoryData((oldData) => [...oldData, categoryData]);
    }

    setFormData((oldData) => ({
      ...oldData,
      category: categoryData?.value,
    } as StockDataType));
    
  }

  if (!barCodeValue && !barCodeInputManually && String(window.location.pathname).includes('stock/add')) {
    return (
      <ScanPage onSubmit={handleScanSubmit} onClose={handleScanClose}/>
    )
  }

  return (
    <div className="page-container-all">
      <div className="product-form">
        
        <div className='product-form-header'>
          {
            productIdInEdition ? (
              <div className='product-form-title'>
                Atualizar produto no estoque.
              </div>
            ) : (
              <div className='product-form-title'>
                Incluir um novo produto no estoque.
              </div>
            )
          }
        </div>

        <form className='product-register-form' onSubmit={handleRegister} ref={formRef}>
          
          <div className="form-card">

            <div className='form-card-title'>
              Insira somente as informações do produto necessárias
            </div>
            
            <div className="form-item">
              <label className='my-label' htmlFor="bar_code">Código de barras do produto:</label>
              <input className='my-input' ref={firstInput} autoFocus type="text" autoComplete='false' onInput={handleBarCodeValue} value={barCodeValue} name="bar_code" id="bar_code" />
            </div>
            
            <div className="form-item">
              <label className='my-label' htmlFor="ref_code">SKU:</label>
              <input className='my-input' type="text" onInput={handleInputChange} autoComplete='false' name="ref_code" id="ref_code" value={formData?.ref_code} />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="name">Nome:</label>
              <input className='my-input' required type="text" onInput={handleInputChange} autoComplete='false' name="name" id="name" value={formData?.name} />
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="category">Categoria:</label>
              <CreatableSelect options={categoryData} name="category" id="category" onChange={handleCategoryChange} value={{ value: formData?.category, label: categoryData.find(d => d.value === formData?.category)?.label }} />
            </div>
            
          </div>

          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price_final">Preço de venda:</label>
              <input className='my-input' type="text" autoComplete='false' name="price_final" id="price_final" onInput={handleInputChange} value={formData?.price_final}/>
            </div>
            
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="price_cost">Preço de compra:</label>
              <input className='my-input' type="text" autoComplete='false' name="price_cost" id="price_cost" onInput={handleInputChange} value={formData?.price_cost}/>
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="quantity">Quantidade:</label>
              <input className='my-input' required type="number" autoComplete='false' name="quantity" id="quantity" onInput={handleInputChange} value={formData?.quantity} />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' aria-required htmlFor="current_address">Endereço:</label>
              <input className='my-input' type="text" autoComplete='false' name="current_address" id="current_address" onInput={handleInputChange} value={formData?.current_address} />
            </div>
          </div>
            
          <div className="form-card">
            <div className="form-item">
              <label className='my-label' htmlFor="expire_at">Validade:</label>
              <input className='my-input' type="date" autoComplete='false' name="expire_at" id="expire_at" onInput={handleInputChange}  value={formData?.expire_at as string}/>
            </div>
          </div>

          <div className="form-upload-container form-card">
            <div className='form-card-title'>
              Faça o upload da imagem do produto
            </div>

            <UploadFile setReferenceFilePath={(ref) => setPhotoRef(ref || '')}/>
          </div>

          {
            productIdInEdition ? (
              <div className="form-button-container">
                <button className='my-btn' type="submit">Atualizar produto</button>
              </div>
            ) : (
              <div className="form-button-container">
                <button className='my-btn' type="submit">Criar novo produto</button>
              </div>
            )
          }

        </form>
      </div>
    </div>
  )
}
