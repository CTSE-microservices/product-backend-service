import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service.js';

export class ProductController {
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const channelIdStr = req.query.channel_id as string;
      const channelId = channelIdStr ? parseInt(channelIdStr) : undefined;
      const products = await ProductService.getAllProducts(channelId);
      res.json(products);
    } catch (error) {

      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.params.id as string);
      const product = await ProductService.getProductById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async reduceStock(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.body.product_id);
      const quantity = parseInt(req.body.quantity);
      
      if (isNaN(productId) || isNaN(quantity)) {
        return res.status(400).json({ message: 'Invalid product_id or quantity' });
      }

      const product = await ProductService.reduceStock(productId, quantity);
      res.json({ message: 'Stock reduced successfully', product });
    } catch (error) {
      next(error);
    }
  }


  static async getProductStock(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.params.id as string);
      const stock = await ProductService.getProductStock(productId);
      res.json(stock);

    } catch (error) {
      next(error);
    }
  }
}
