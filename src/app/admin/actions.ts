'use server';

import { getProducts, getProduct } from '@/lib/placeholder-data';
import type { Product } from '@/lib/types';

export async function getProductsAction(): Promise<Product[]> {
  return await getProducts();
}

export async function getProductAction(id: string): Promise<Product | null> {
    return await getProduct(id);
}
