const express = require('express');
// const fetch = require('node-fetch');
const router = express.Router();

const api = "Your_Api_Key";

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Paymob Payment' });
});

router.post('/start-payment', async function(req, res, next) {
  try {
    const fetch = (await import('node-fetch')).default;
    // First step
    let data = {
      "api_key": api
    };
    let request = await fetch('https://pakistan.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    let response = await request.json();
    let token = response.token;

    // Second step
    data = {
      "auth_token": token,
      "delivery_needed": "false",
      "amount_cents": "100", // Amount in sents
      "currency": "PKR",
      "items": []
    };
    request = await fetch('https://pakistan.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    response = await request.json();
    let id = response.id;

    // Third step
    data = {
      "auth_token": token,
      "amount_cents": "100", //Amount in sebts
      "expiration": 3600,
      "order_id": id,
      "billing_data": {
        "apartment": "803",
        "email": "claudette09@exa.com",
        "floor": "42",
        "first_name": "Clifford",
        "street": "Ethan Land",
        "building": "8028",
        "phone_number": "+86(8)9135210487",
        "shipping_method": "PKG",
        "postal_code": "01898",
        "city": "Jaskolskiburgh",
        "country": "PK",
        "last_name": "Nicolas",
        "state": "Utah"
      },
      "currency": "PKR",
      "integration_id": "Your Integration ID"
    };
    request = await fetch('https://pakistan.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    response = await request.json();
    let theToken = response.token;

    // Redirect to the payment page
    res.redirect(`https://pakistan.paymob.com/api/acceptance/iframes/Your_ifram_Id?payment_token=${theToken}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

module.exports = router;