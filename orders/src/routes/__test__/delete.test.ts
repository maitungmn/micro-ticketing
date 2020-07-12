import mongoose from "mongoose"
import request from "supertest"
import {OrderStatus} from "@mttickets/common";

import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import {BaseRoute} from "../base-route";
import {Order} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const user = global.signin()
  // make a request to create an order
  const {body: order} = await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  // make a request to cancel an order
  await request(app)
    .delete(`${BaseRoute.ORDER}/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // expectation to make sure th thing is cancelled
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const user = global.signin()
  // make a request to create an order
  const {body: order} = await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  // make a request to cancel an order
  await request(app)
    .delete(`${BaseRoute.ORDER}/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})