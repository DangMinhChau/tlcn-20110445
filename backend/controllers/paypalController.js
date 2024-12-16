const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { client } = require('../configs/paypal');
const Order = require('../models/orderModel');

exports.createPayPalOrder = catchAsync(async (req, res, next) => {
  const { orderTotal } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: orderTotal,
        },
      },
    ],
  });

  const order = await client.execute(request);

  res.status(200).json({
    status: 'success',
    data: order.result,
  });
});

exports.capturePayment = catchAsync(async (req, res, next) => {
  const { orderID } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  const capture = await client.execute(request);

  if (capture.result.status !== 'COMPLETED') {
    return next(new AppError('Payment failed', 400));
  }

  res.status(200).json({
    status: 'success',
    data: capture.result,
  });
});
