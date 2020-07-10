import request from "supertest"
import mongoose from "mongoose"
import {app} from "../../app"
import {BaseRoute} from "../base-route";
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/order";
import {OrderStatus} from "@mttickets/common";

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId()

  await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', global.signin())
    .send({
      ticketId
    })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'dadasda',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })

  await order.save()

  await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201)
})

it.todo('emits an order created event')