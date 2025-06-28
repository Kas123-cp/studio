'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addProduct } from '@/lib/placeholder-data';
import type { FormState } from '@/lib/types';
import { productSchema } from '@/lib/types';

export async function addProductAction(prevState: FormState, formData: FormData): Promise<FormState> {
    
    const imageFiles = formData.getAll('images').filter((file: File | string) => file instanceof File && file.size > 0);

    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        brand: formData.get('brand'),
        price: formData.get('price'),
        condition: formData.get('condition'),
        images: imageFiles,
        description: formData.get('description'),
        specs: {
            processor: formData.get('specs.processor'),
            ram: formData.get('specs.ram'),
            storage: formData.get('specs.storage'),
            display: formData.get('specs.display'),
            battery: formData.get('specs.battery'),
        },
        featured: formData.get('featured') === 'on',
        newArrival: formData.get('newArrival') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to add product. Please check the fields.',
        };
    }

    const { images, ...productData } = validatedFields.data;

    try {
        const imagePromises = images.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return `data:${file.type};base64,${buffer.toString('base64')}`;
        });
        const imageDataUris = await Promise.all(imagePromises);

        const newProductData = {
            ...productData,
            images: imageDataUris,
        };
        
        await addProduct(newProductData);

        revalidatePath('/products');
        revalidatePath('/admin');
        revalidatePath('/');

    } catch (error) {
        console.error('Failed to save product to Firestore:', error);
        return {
            message: 'Error: Failed to save product to the database.',
        };
    }

    redirect('/admin');
}
