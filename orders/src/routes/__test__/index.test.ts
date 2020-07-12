import mongoose from "mongoose";
import request from "supertest"

import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import {BaseRoute} from "../base-route";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  return ticket
}

it('fetches orders for an particular user', async () => {
  // Create 3 tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()

  // Create one order as User #1
  await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', userOne)
    .send({ticketId: ticketOne.id})
    .expect(201)

  // Create two orders as User #2
  const {body: orderOne} = await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', userTwo)
    .send({ticketId: ticketTwo.id})
    .expect(201)

  const {body: orderTwo} = await request(app)
    .post(BaseRoute.ORDER)
    .set('Cookie', userTwo)
    .send({ticketId: ticketThree.id})
    .expect(201)

  // Make request to get orders for User #2
  const response = await request(app)
    .get(BaseRoute.ORDER)
    .set('Cookie', userTwo)
    .expect(200)

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})