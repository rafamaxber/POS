import { addDoc, collection, getDocs, query, Timestamp, doc, updateDoc } from "firebase/firestore";
import { CollectionNames, db, CustomTimestamp } from "../gateways/firebase";

export interface OrderDataType {
  id?: string,
  comments?: string,
  client?: string,
  created_at: CustomTimestamp,
  total_price: string,
  status: OrderStatusType,
  items: OrderItemDataType[]
}

export type OrderStatusType = 'pending' | 'in_progress' | 'delivered' | 'cancelled' | 'paid';

export interface OrderItemDataType {
  id: string,
  name: string,
  price_cost: string,
  price_final: string,
  quantity: number,
}

export class OrderRepository {
  createOrder(body: Omit<OrderDataType, 'created_at' | 'id'>) {
    return addDoc(collection(db, CollectionNames.ORDERS), {
      total_price: body?.total_price || '',
      created_at: Timestamp.fromDate(new Date()),
      status: body.status,
      comments: body?.comments || '',
      client: body?.client || '',
      items: body.items
    });
  }

  async getOrderData(): Promise<OrderDataType[]> {
    const data = await getDocs(query(collection(db, CollectionNames.ORDERS)));
    return data.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .sort((a, b) => {
        return b.created_at.seconds - a.created_at.seconds
      }) as unknown as Promise<OrderDataType[]>
  }

  async updateOrderStatus(id: string, status: OrderStatusType) {
    return updateDoc(doc(db, CollectionNames.ORDERS, id), {
      status: status,
    });
  }
}
