import { getProductsAction } from '@/app/admin/actions';
import ProductGrid from '@/components/ProductGrid';

export default async function ProductsPage() {
    const products = await getProductsAction();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold font-headline">Our Collection</h1>
                <p className="text-lg text-muted-foreground mt-2">Browse our full range of premium laptops</p>
            </div>
            <ProductGrid initialProducts={products} />
        </div>
    );
}
