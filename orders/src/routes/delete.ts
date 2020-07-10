import express, {Response, Request} from "express";
import {BaseRoute} from "./base-route";
import {NotAuthorizedError, NotFoundError, OrderStatus, requiredAuth} from "@mttickets/common";
import {Order} from "../models/order";

const router = express.Router()

router.delete(`${BaseRoute.ORDER}/:orderId`, requiredAuth, async (req: Request, res: Response) => {
  const {orderId} = req.params

  const order = await Order.findById(orderId)

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled

  await order.save()

  res.status(204).send(order)
})

export {router as deleteOrderRouter}