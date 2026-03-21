import { Router } from 'express';
import { ProductController } from './product.controller.js';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', ProductController.createProduct);
router.post('/reduce-stock', ProductController.reduceStock);
router.get('/:id/stock', ProductController.getProductStock);

export default router;
