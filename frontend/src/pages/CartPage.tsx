import { useContext } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MessageBox from '../components/MessageBox'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import { Link, useNavigate } from 'react-router-dom'

import { CartItem } from '../types/Cart'
import { toast } from 'react-toastify'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const updateCartHandler = async (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }
  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="text-center">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item: CartItem) => (
                <ListGroup.Item
                  variant="secondary"
                  className="align-items-center"
                  key={item._id}
                >
                  <Row className="align-items-center shadow-lg p-3 mb-5 dark rounded">
                    <Col md={5}>
                      <Container className="p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded-circle thumbnail"
                        ></img>{' '}
                      </Container>
                    </Col>
                    <Col md={4}>
                      <Link
                        className="text-nowrap"
                        to={`/product/${item.slug}`}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={6}>
                      <div className="p-3">
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          variant="danger"
                          disabled={item.quantity === 1}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>{' '}
                        <span>{item.quantity}</span>{' '}
                        <Button
                          variant="success"
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          disabled={item.quantity === item.countInStock}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </div>
                    </Col>
                    <Col md={4}>
                      <text className="text-danger"> ${item.price}</text>
                    </Col>
                    <Col md={1}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="dark"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="info"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
