import { ScannerIcon } from "./ScanIcon";
import { BarCodeReader } from "./ScanInput";
import './ScanPage.css';

interface Props {
  onSubmit: (value: string) => void;
  onClose?: () => void;
}

export function ScanPage({ onSubmit, onClose }: Props) {
 function handleScanSubmit(barCode: string) {
   onSubmit(barCode);
 }
 
  return (
    <div className="scan-page-container">
      <BarCodeReader onSubmit={handleScanSubmit}/>

      <div className="scan-page-container__scan-icon">
        <ScannerIcon className="scanner-icon" />
        <div className="scan-page-container__scan-icon__text">
          Escaneie o código de barras do produto
        </div>
        
        {onClose && <div className="scan-page-container__scan-icon__close" onClick={onClose}>
          Não é possível escanear o código de barras? Clique aqui.
        </div>}
      </div>
    </div>
  )
}
