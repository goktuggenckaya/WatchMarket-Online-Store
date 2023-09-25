import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CheckoutSteps from '../components/CheckoutSteps'
import { Store } from '../Store'

export default function PaymentMethodPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod },
  } = state

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  )

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping')
    }
  }, [shippingAddress, navigate])
  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
    localStorage.setItem('paymentMethod', paymentMethodName)
    navigate('/placeorder')
  }
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="mt-5 md-5 container really-small-container border border-dark shadow-lg">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3 text-right">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              className="text-primary"
              type="radio"
              id="CreditCard"
              label="CreditCard"
              value="CreditCard"
              checked={paymentMethodName === 'CreditCard'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              className="text-primary"
              type="radio"
              id="DebitCard"
              label="DebitCard"
              value="DebitCard"
              checked={paymentMethodName === 'DebitCard'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3 text-center">
            <Button variant="dark" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
