import { useContext, useEffect } from 'react'
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
  PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import { ApiError } from '../types/ApiError'
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../hooks/orderHooks'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Order } from '../types/Order'

export default function OrderPage() {
  const { state } = useContext(Store)
  const { userInfo } = state

  const params = useParams()
  const { id: orderId } = params

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!)

  const { mutateAsync: deliverOrder, isLoading: loadingDeliver } =
    useDeliverOrderMutation()
  async function deliverOrderHandler() {
    try {
      await deliverOrder(orderId!)
      refetch()
      toast.success('Order is delivered')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  pdfMake.vfs = pdfFonts.pdfMake.vfs

  function generateInvoice(order: Order): void {
    const docDefinition = {
      content: [
        { text: 'Invoice', style: 'header' },
        { text: `Order ID: ${orderId}`, style: 'subheader' },
        { text: `Payment Method: ${order.paymentMethod}` },
        { text: `Name: ${order.shippingAddress.fullName}` },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Item', 'Price', 'Quantity', 'Total'],
              ...order.orderItems.map((item) => [
                item.name,
                item.price,
                item.quantity,
                item.price * item.quantity,
              ]),
            ],
          },
        },
        { text: `Total: ${order.totalPrice}` },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    }

    //pdfMake.createPdf(docDefinition).open()
    //sendInvoiceEmail(order, pdfMake.createPdf(docDefinition))
  }

  const testPayHandler = async (order: Order) => {
    await payOrder({ orderId: orderId! })
    refetch()
    toast.success('Order is paid')
    /*
    const order: Order = {
      orderId: '1234',
      customerName: 'gg',
      orderDate: 'May 3, 2023',
      items: [
        { name: 'Product 1', quantity: 2, price: 10 },
        { name: 'Product 2', quantity: 1, price: 20 },
        { name: 'Product 3', quantity: 3, price: 5 },
      ],
      total: 45,
    }
    */

    // Generate and display the invoice
    generateInvoice(order)
  }
  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID: string) => {
          return orderID
        })
    },
    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          payOrder({ orderId: orderId!, ...details })
          refetch()
          toast.success('Order is paid')
        } catch (err) {
          toast.error(getError(err as ApiError))
        }
      })
    },
    onError: (err) => {
      toast.error(getError(err as ApiError))
    },
  }
  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer()
  const { data: paypalConfig } = useGetPaypalClientIdQuery()

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypalConfig!.clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        })
      }
      loadPaypalScript()
    }
  }, [paypalConfig])
  const { mutateAsync: payOrder, isLoading: loadingPay } = usePayOrderMutation()

  return isLoading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : order ? (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3 text-center text-success">Order {orderId}</h1>
      <Row mt-5 md-5 container small-container border border-dark shadow-lg>
        <Col md={8}>
          <Card className="mt-4 md-5 mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order!.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
                <br />
                <strong>User ID: </strong> {'644c0f893bc1f7d062d659aa'}
              </Card.Text>

              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered {order.deliveredAt}
                </MessageBox>
              ) : order.isTransit ? (
                <MessageBox variant="warning">In Transit</MessageBox>
              ) : (
                <MessageBox variant="danger">
                  Processing, Not Delivered
                </MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                        <text className="text-danger"> ${item.price}</text>{' '}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className=" mt-3 md-5 mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : isRejected ? (
                      <MessageBox variant="danger">
                        Error in connecting to PayPal
                      </MessageBox>
                    ) : (
                      <div>
                        {/* <PayPalButtons
                          {...paypalbuttonTransactionProps}
                        ></PayPalButtons> */}
                        <Button
                          variant="success"
                          onClick={() => testPayHandler(order)}
                        >
                          Test Pay
                        </Button>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {/* {userInfo!.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )} */}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <div>no order data</div>
  )
}
