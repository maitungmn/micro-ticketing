import request from "supertest"
import mongoose from "mongoose"

import {app} from "../../app"
import {BaseRoute} from "../base-route";
import {Order} from "../../models/order";
import {OrderStatus} from "@mttickets/common";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payment";

const mockToken = 'tok_visa'

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post(BaseRoute.Payment)
    .set('Cookie', global.signin())
    .send({
      token: 'dada',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })

  await order.save()

  await request(app)
    .post(BaseRoute.Payment)
    .set('Cookie', global.signin())
    .send({
      token: 'dada',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })

  await order.save()

  await request(app)
    .post(BaseRoute.Payment)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'dadq'
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const price = Math.floor(Math.random() * 100000)

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })

  await order.save()

  await request(app)
    .post(BaseRoute.Payment)
    .set('Cookie', global.signin(userId))
    .send({
      token: mockToken,
      orderId: order.id,
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({limit: 50})
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  })

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  })

  expect(payment).not.toBeNull()
})