import prisma from '../../utils/prisma.js';

export class ProductService {
  static async getAllProducts(channelId?: number) {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
        product_images: true,
        price_book_items: channelId ? {
          where: {
            price_books: {
              channel_id: channelId
            }
          }
        } : true
      }
    });

    // If channelId is provided, project the price into the product object for convenience
    if (channelId) {
      return products.map((p: any) => ({
        ...p,
        price: p.price_book_items[0]?.price || null
      }));
    }


    return products;
  }

  static async getProductById(productId: number) {
    return prisma.products.findUnique({
      where: { product_id: productId },
      include: {
        categories: true,
        product_images: true,
        price_book_items: {
          include: {
            price_books: true
          }
        }
      }
    });
  }

  static async createProduct(data: {
    name: string;
    description?: string;
    category_id?: number;
    stock_quantity?: number;
    images?: string[];
  }) {
    const { images, ...productData } = data;
    
    return prisma.products.create({
      data: {
        ...productData,
        product_images: images ? {
          create: images.map(url => ({ image_url: url }))
        } : undefined
      },
      include: {
        product_images: true
      }
    });
  }

  static async reduceStock(productId: number, quantity: number) {
    const product = await prisma.products.findUnique({
      where: { product_id: productId },
      select: { stock_quantity: true }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if ((product.stock_quantity || 0) < quantity) {
      throw new Error('Insufficient stock');
    }

    return prisma.products.update({
      where: { product_id: productId },
      data: {
        stock_quantity: {
          decrement: quantity
        }
      }
    });
  }

  static async getProductStock(productId: number) {
    const product = await prisma.products.findUnique({
      where: { product_id: productId },
      select: { stock_quantity: true }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      product_id: productId,
      stock_quantity: product.stock_quantity
    };
  }
}
