import express, {Response, Request} from "express";
import {BaseRoute} from "./base-route";
import {NotAuthorizedError, NotFoundError, requiredAuth} from "@mttickets/common";
import {Order} from "../models/order";

const router = express.Router()

router.get(
  `${BaseRoute.ORDER}/:orderId`,
  requiredAuth,
  async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    res.send(order)
  })

export {router as showOrderRouter}