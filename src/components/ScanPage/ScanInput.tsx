import { useEffect, useState, useRef, useCallback } from 'react';
import throttle from 'lodash.throttle';

export const BarCodeReader = ({ onSubmit, timeToClearScannedValue = 500, BAR_CODE_READER_ID = 'bar-code-reader' }) => {
  const [barCodeValue, setBarCodeValue] = useState('');
  const barCodeReaderInput = useRef();

  const cleanInput = () => {
    setBarCodeValue('');
  };

  const cleanInputThrottle = useCallback(throttle(cleanInput, timeToClearScannedValue), []);

  const setBarCodeInputFocus = () => {
    if (barCodeReaderInput.current && barCodeReaderInput.current.focus) {
      barCodeReaderInput.current.focus({ preventScroll: true });
    }
  };

  const handleBarCode = (event) => {
    setBarCodeValue(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (barCodeValue !== '') {
      onSubmit(barCodeValue);
    }

    setBarCodeValue('');
  };

  const onKeyPressHandler = useCallback((event) => {
    if (event.target.nodeName === 'BODY' || event.target.id === BAR_CODE_READER_ID) {
      const isTheBarCodeInputAlreadyInFocus = document.activeElement === barCodeReaderInput.current;
      if (!isTheBarCodeInputAlreadyInFocus) {
        setBarCodeInputFocus();
      }
      cleanInputThrottle();
    }
  }, [BAR_CODE_READER_ID, cleanInputThrottle]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyPressHandler);

    return () => document.removeEventListener('keydown', onKeyPressHandler);
  }, [onKeyPressHandler]);

  return (
    <form className="bar-code-reader" onSubmit={onSubmitHandler}>
      <input
        autoFocus
        value={barCodeValue}
        id={BAR_CODE_READER_ID}
        ref={barCodeReaderInput}
        onChange={handleBarCode}
        type="text"
        autoComplete="off"
      />
    </form>
  );
};
