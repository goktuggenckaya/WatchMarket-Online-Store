import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox'
import { ApiError } from '../types/ApiError'
import { useCreateOrderMutation } from '../hooks/orderHooks'

export default function PlaceOrderPage() {
  const navigate = useNavigate()

  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  cart.shippingPrice = round2(10)
  cart.taxPrice = 0
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice

  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation()

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
  }, [cart, navigate])

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <div className="mt-5 md-5 container small-container border border-dark shadow-lg">
        <h1 className="my-3 text-center">Preview Order</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3 bg-secondary shadow-lg">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  ,{cart.shippingAddress.country}
                </Card.Text>
                <Link to="/shipping">Edit</Link>
              </Card.Body>
            </Card>

            <Card className="mb-3 bg-secondary">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {cart.paymentMethod}
                </Card.Text>
                <Link to="/payment">Edit</Link>
              </Card.Body>
            </Card>

            <Card className="mb-3 bg-secondary">
              <Card.Header>
                <h1 className="font-weight-bold text-center"> Products</h1>
              </Card.Header>
              <Card.Body className="mb-3 bg-secondary">
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item
                      className="align-items-center bg-secondary"
                      key={item._id}
                    >
                      <Row className="align-items-center shadow-lg p-4 mb-9 bg-light rounded">
                        <Col md={3}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded thumbnail"
                          ></img>{' '}
                        </Col>
                        <Col md={3}>
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>
                          <text className="text-danger">${item.price}</text>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to="/cart">Edit</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 bg-secondary">
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="mb-3 bg-secondary">
                    <Row>
                      <Col>Items</Col>
                      <Col>${cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="mb-3 bg-secondary">
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className="mb-3 bg-secondary">
                    <Row>
                      <Col>
                        <strong> Order Total</strong>
                      </Col>
                      <Col>
                        <strong>${cart.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="mb-3 bg-secondary">
                    <div className="d-grid">
                      <Button
                        variant="success"
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0 || isLoading}
                      >
                        Place Order
                      </Button>
                    </div>
                    {isLoading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
