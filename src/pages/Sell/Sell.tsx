import { ScanPage } from "../../components/ScanPage/ScanPage";

export function SellPage() {
  function handleScanSubmit(barCode: string) {
    console.log(barCode);
  }
  
  return (
    <div className="sell-page-container">
      <ScanPage onSubmit={handleScanSubmit}/>
    </div>

  )
}
