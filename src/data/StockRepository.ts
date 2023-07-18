import { addDoc, collection, getDocs, getDoc, query, Timestamp, deleteDoc, where, doc, updateDoc } from "firebase/firestore";
import { CollectionNames, db, CustomTimestamp } from "../gateways/firebase";

export interface StockDataType {
  id?: string,
  bar_code: string,
  category: string,
  current_address: string,
  name: string,
  price_cost: string,
  price_final: string,
  quantity: number,
  ref_code: number,
  expire_at: CustomTimestamp,
  photo?: unknown
}

export type CategoryDataType = {
  value: string
  key: string
}

export class StockRepository {
  addItemToStock(body: StockDataType) {
    return addDoc(collection(db, CollectionNames.STOCK), {
      bar_code: body?.bar_code || '',
      ref_code: body?.ref_code || '',
      current_address: body.current_address|| '',
      category: body.category,
      name: body.name,
      price_cost: body.price_cost || '',
      price_final: body.price_final || '',
      quantity: Number(body.quantity),
      expire_at: body.expire_at ? Timestamp.fromDate(new Date(String(body.expire_at))) : null,
      updated_at: Timestamp.fromDate(new Date()),
      created_at: Timestamp.fromDate(new Date()),
      photo: body.photo
    });
  }

  updateItemToStock(id: string, body: StockDataType) {
    const expireAt = body.expire_at;

    return updateDoc(doc(db, CollectionNames.STOCK, id), {
      bar_code: body?.bar_code || '',
      ref_code: body?.ref_code || '',
      current_address: body.current_address|| '',
      category: body.category,
      name: body.name,
      price_cost: body.price_cost || '',
      price_final: body.price_final || '',
      quantity: body.quantity ? Number(body.quantity) : 0,
      expire_at: body.expire_at ? Timestamp.fromDate(new Date(String(expireAt))) : null,
      updated_at: Timestamp.fromDate(new Date()),
      photo: body?.photo
    });
  }

  updateItemQuantityToStock(id: string, body:{ quantity: number }) {
    return updateDoc(doc(db, CollectionNames.STOCK, id), {
      quantity: body.quantity ? Number(body.quantity) : 0,
      updated_at: Timestamp.fromDate(new Date()),
    });
  }

  async getStockDataByBarCode(barCode: string): Promise<StockDataType> {
    const data = await getDocs(query(collection(db, CollectionNames.STOCK), where("bar_code", "==", barCode)));

    return data.docs.map((doc) => doc.data())[0] as unknown as Promise<StockDataType>
  }

  async searchStockDataBy({ key, value }: { key: 'bar_code' | 'name' | 'category'; value: string | number }): Promise<StockDataType[]> {
    const searchEndText = String(value).slice(0, -1) + String.fromCharCode(String(value).charCodeAt(String(value).length - 1) + 1);
    const data = await getDocs(
      query(
        collection(db, CollectionNames.STOCK),
        where(key, ">=", value),
        where(key, "<", searchEndText)
      )
    );

    return data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as Promise<StockDataType[]>
  }

  async getStockDataById(id: string): Promise<StockDataType> {
    const data = await getDoc(doc(db, CollectionNames.STOCK, id));

    return {
      ...data.data(),
      id: data.id,
    } as unknown as Promise<StockDataType>
  }

  async getStockData(): Promise<StockDataType[]> {
    const data = await getDocs(query(collection(db, CollectionNames.STOCK)));
    return data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as Promise<StockDataType[]>
  }

  async deleteStockData(id: string) {
    await deleteDoc(doc(db, CollectionNames.STOCK, id));
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
