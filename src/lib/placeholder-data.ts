import { firestore } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

const LaptopsCollection = 'Laptops';

export async function getProducts(): Promise<Product[]> {
    if (!firestore) {
        console.error('Firestore is not initialized. Cannot get products.');
        return [];
    }
    try {
        const snapshot = await firestore.collection(LaptopsCollection).orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                brand: data.brand,
                price: data.price,
                condition: data.condition,
                images: data.images || [],
                specs: data.specs,
                description: data.description,
                featured: data.featured || false,
                newArrival: data.newArrival || false,
                createdAt: data.createdAt?.toDate()?.toISOString() || new Date(0).toISOString(),
            } as Product;
        });
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        // This can happen if the collection doesn't exist yet.
        return [];
    }
}

export async function getProduct(id: string): Promise<Product | null> {
    if (!firestore) {
        console.error('Firestore is not initialized. Cannot get product.');
        return null;
    }
    try {
        const docRef = firestore.collection(LaptopsCollection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        if (!data) return null;

        return { 
            id: doc.id,
            name: data.name,
            brand: data.brand,
            price: data.price,
            condition: data.condition,
            images: data.images || [],
            specs: data.specs,
            description: data.description,
            featured: data.featured || false,
            newArrival: data.newArrival || false,
            createdAt: data.createdAt?.toDate()?.toISOString() || new Date(0).toISOString(),
        } as Product;
    } catch (error) {
        console.error(`Error fetching product ${id} from Firestore:`, error);
        return null;
    }
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
     if (!firestore) {
        console.error('Firestore is not initialized. Cannot add product.');
        throw new Error('Database connection is not available.');
    }
    
    try {
        const newProductData = {
            ...productData,
            price: Number(productData.price),
            featured: productData.featured || false,
            newArrival: productData.newArrival || false,
            createdAt: FieldValue.serverTimestamp(),
        };

        const docRef = await firestore.collection(LaptopsCollection).add(newProductData);
        
        return {
            id: docRef.id,
            ...productData,
            price: Number(productData.price),
            createdAt: new Date().toISOString(), // Return an estimated time for client-side use
        };
    } catch (error) {
        console.error('Error adding product to Firestore:', error);
        throw new Error('Failed to add product to the database.');
    }
}
