import mongoose from "mongoose"
import {OrderCreatedEvent, OrderStatus} from "@mttickets/common";
import {Message} from "node-nats-streaming"

import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Order} from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'dada',
    userId: 'dadq',
    status: OrderStatus.Created,
    ticket: {
      id: 'daq',
      price: 10,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}

it('replicates the order info', async () => {
  const {listener, data, msg} = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.price).toEqual(data.ticket.price)
})

it('ack the message', async () => {
  const {listener, data, msg} = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})