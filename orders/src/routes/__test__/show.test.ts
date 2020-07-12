import mongoose from "mongoose"
import request from "supertest"
import {app} from "../../app"
import {Ticket} from "../../models/ticket";
import {BaseRoute} from "../base-route";

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  const user = global.signin()
  // make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  // make request to fetch the order
  const {body: fetchOrder} = await request(app)
    .get(`${BaseRoute.ORDER}/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchOrder.id).toEqual(order.id)

})

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  const user = global.signin()
  // make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  // make request to fetch the order
  await request(app)
    .get(`${BaseRoute.ORDER}/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)

})