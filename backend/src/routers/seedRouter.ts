import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ProductModel } from '../models/productModel';
import { UserModel } from '../models/userModel';
import { sampleProducts } from '../data';
import { sampleUsers } from '../data';

const seedRouter = express.Router();

seedRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(sampleProducts);
    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(sampleUsers);
    res.send({ createdProducts, createdUsers });
  })
);
export default seedRouter;
