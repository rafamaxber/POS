import { addDoc, collection, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { CollectionNames, db } from "../gateways/firebase";

export interface StockDataType {
  bar_code: string,
  category: string,
  current_address: string,
  name: string,
  price_cost: number,
  price_final: number,
  quantity: number,
  ref_code: number,
  expire_at: string,
  photo?: any
}

export type CategoryDataType = {
  value: string
  key: string
}

export class StockRepository {
  addItemToStock(body: StockDataType) {
    return addDoc(collection(db, CollectionNames.STOCK), {
      bar_code: body.bar_code,
      category: body.category,
      current_address: body.current_address,
      name: body.name,
      price_cost: Number(body.price_cost),
      price_final: Number(body.price_final),
      quantity: Number(body.quantity),
      ref_code: body.ref_code,
      expire_at: body.expire_at ? Timestamp.fromDate(new Date(body.expire_at)) : null,
      updated_at: Timestamp.fromDate(new Date()),
      created_at: Timestamp.fromDate(new Date()),
      photo: body.photo
    });
  }

  async getStockDataByBarCode(barCode: string): Promise<StockDataType> {
    const data = await getDocs(query(collection(db, CollectionNames.STOCK), where("bar_code", "==", barCode)));
    console.log('getStockDataByBarCode=>', data.docs.map((doc) => doc.data())[0])
    return data.docs.map((doc) => doc.data())[0] as unknown as Promise<StockDataType>
  }
  
  async getStockData(): Promise<StockDataType[]> {
    const data = await getDocs(query(collection(db, CollectionNames.STOCK)));
    return data.docs.map((doc) => doc.data()) as unknown as Promise<StockDataType[]>
  }
  
  async getCategoryData(): Promise<CategoryDataType[]> {
    const data = await getDocs(query(collection(db, CollectionNames.PRODUCT_CATEGORIES)));
    return data.docs.map((doc) => doc.data()) as unknown as Promise<CategoryDataType[]>
  }
  
  async addCategoryData(body: CategoryDataType) {
    return addDoc(collection(db, CollectionNames.PRODUCT_CATEGORIES), {
      value: body.value,
      key: body.key
    });
  }
}
