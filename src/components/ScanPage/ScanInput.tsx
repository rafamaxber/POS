import { useEffect, useState, useRef, useCallback, FormEvent } from 'react';
import throttle from 'lodash.throttle';

interface Props {
  onSubmit: (value: string) => void;
  timeToClearScannedValue?: number;
  BAR_CODE_READER_ID?: string;
}

export const BarCodeReader = ({ onSubmit, timeToClearScannedValue = 500, BAR_CODE_READER_ID = 'bar-code-reader' }: Props) => {
  const [barCodeValue, setBarCodeValue] = useState('');
  const barCodeReaderInput = useRef<HTMLInputElement>(null);

  const cleanInput = () => {
    setBarCodeValue('');
  };

  const cleanInputThrottle = useCallback(throttle(cleanInput, timeToClearScannedValue), []);

  const setBarCodeInputFocus = () => {
    if (barCodeReaderInput.current && barCodeReaderInput.current.focus) {
      barCodeReaderInput.current.focus({ preventScroll: true });
    }
  };

  const handleBarCode = (event: React.FormEvent<HTMLInputElement>) => {
    setBarCodeValue(event.currentTarget.value);
  };

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (barCodeValue !== '') {
      onSubmit(barCodeValue);
    }

    setBarCodeValue('');
  };

  const onKeyPressHandler = useCallback((event: KeyboardEvent) => {
    // @ts-ignore
    if (event.target?.nodeName === 'BODY' || event.target?.id === BAR_CODE_READER_ID) {
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
