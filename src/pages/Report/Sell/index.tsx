import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { MdAttachMoney } from 'react-icons/md';
import { Loading } from "../../../components/Loading/Loading";
import { OrderDataType, OrderRepository, OrderStatusType } from "../../../data/OrderRepository";
import { useStatus } from "../../../hooks/useStatus";
import { formarNumber } from "../../../helpers/formatNumber";
import './style.css'

export default function ReportSellPage() {
  const { startLoading, stopLoading, setErrorLoading, loading } = useStatus();
  const [data, setData] = useState<OrderDataType[]>([])

  useEffect(() => {
    startLoading()

    getOrderData()

  }, [])

  function getOrderData() {
    const orderRepository = new OrderRepository();

    return orderRepository.getOrderData()
    .then((orderData) => {
      setData(orderData)
    }).catch((error) => {
      setErrorLoading(error.message)
    }).finally(() => {
      stopLoading()
    });
  }

  function sumProfit(order: OrderDataType) {
    const total = order.items.reduce((acc, item) => {
      const profit = (formarNumber(item.price_final) - formarNumber(item.price_cost)) * item.quantity;
      return acc + profit;
    }, 0);
    if (isNaN(total)) {
      return '-'
    }

    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  }

  function formatStatusLabel(status: OrderStatusType) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pendente';
      case 'PAID':
        return 'Pago';
      case 'CANCELED':
        return 'Cancelado';
      default:
        return '-';
    }
  }

  function handleUpdateStatus(id: string) {
    const orderRepository = new OrderRepository();

    startLoading()
    orderRepository.updateOrderStatus(id, 'paid')
      .then(() => {
        return getOrderData()
      })
      .then(() => {
        toast.success('Pagamento recebido com sucesso!');
      })
      .catch((error) => {
        toast.error(`Não foi possível receber o pagamento. ${error.message}}`);
      })
      .finally(() => {
        stopLoading()
      });
  }

  // TODO: ser possível filtrar por status
  // TODO: ser possível editar nome do cliente e incluir comentarios
  // TODO: ser possível deletar venda
  // TODO: calcular lucro e valor total
  return (
    <>
      {loading && <Loading />}
      <div className="page-container">
        <h1>Histórico de vendas</h1>

        <table className="report-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor total</th>
              <th>Lucro</th>
              <th>Status</th>
              <th>Itens</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id}>
                <td>{format(order.created_at.toDate(), 'dd/MM/yyyy HH:mm:ss')}</td>
                <td>{order.total_price}</td>
                <td>{sumProfit(order)}</td>
                <td>{formatStatusLabel(order.status)}</td>
                <td>{order.items.length}</td>
                <td>
                  {order?.status?.toUpperCase() === 'PENDING' && (
                    <button className='my-btn-circle my-btn-v2' title="Receber pagamento" onClick={() => handleUpdateStatus(String(order.id))}>
                      <MdAttachMoney />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
