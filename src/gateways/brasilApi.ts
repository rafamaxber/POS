import axios from "axios";

export function getProductDataByEAN(ean: string) {
  return axios.get(`http://brasilapi.simplescontrole.com.br/mercadoria/consulta/?ean=${ean}&access-token=${import.meta.env.VITE_BRASIL_API_ACCESS_TOKEN}&_format=json`);
}
