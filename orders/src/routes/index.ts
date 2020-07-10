import express, {Response, Request} from "express";
import {BaseRoute} from "./base-route";
import {requiredAuth} from "@mttickets/common";
import {Order} from "../models/order";

const router = express.Router()

router.get(BaseRoute.ORDER, requiredAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket')

  res.send(orders)
})

export {router as indexOrderRouter}