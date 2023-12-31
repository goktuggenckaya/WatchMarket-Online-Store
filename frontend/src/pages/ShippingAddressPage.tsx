import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'

export default function ShippingAddressPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state
  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping')
    }
  }, [userInfo, navigate])
  const [country, setCountry] = useState(shippingAddress.country || '')
  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    })
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    )
    navigate('/payment')
  }

  useEffect(() => {
    dispatch({ type: 'SET_FULLBOX_OFF' })
  }, [dispatch, fullBox])

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="mt-5 md-5 container small-container border border-dark shadow-lg">
        <h1 className="my-3 text-right">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label className="text-danger">Full Name</Form.Label>
            <Form.Control
              className="border border-danger"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 text-warning" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              className="border border-warning"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 text-info" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              className="border border-info"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 text-primary" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              className="border border-primary"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 text-success" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              className=" border border-success"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          {/* <div className="mb-3">
            <Button
              id="chooseOnMap"
              type="button"
              variant="light"
              onClick={() => navigate('/map')}
            >
              Choose Location On Map
            </Button>
            {shippingAddress.location && shippingAddress.location.lat ? (
              <div>
                LAT: {shippingAddress.location.lat}
                LNG:{shippingAddress.location.lng}
              </div>
            ) : (
              <div>No location</div>
            )}
          </div> */}

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
