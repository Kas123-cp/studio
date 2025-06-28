'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addProductAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { FormState } from '@/lib/types';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Product
        </Button>
    );
}

export default function AddProductPage() {
    const initialState: FormState = { message: '', errors: {} };
    const [state, dispatch] = useFormState(addProductAction, initialState);
    const { toast } = useToast();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (state?.message && state.errors) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: state.message,
            });
        }
    }, [state, toast]);

    const getError = (field: string) => state?.errors?.[field]?.[0];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const currentPreviews = imagePreviews.slice();

            // Clear old previews for new selection if you want to replace instead of append
            currentPreviews.forEach(preview => URL.revokeObjectURL(preview));
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto">
                 <Button asChild variant="ghost" className="mb-4">
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Link>
                </Button>
                <form action={dispatch}>
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>Provide the main information about the laptop.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. MacBook Pro 16-inch" />
                                    {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Brand</Label>
                                        <Input id="brand" name="brand" placeholder="e.g. Apple" />
                                        {getError('brand') && <p className="text-sm text-destructive">{getError('brand')}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (PKR)</Label>
                                        <Input id="price" name="price" type="number" placeholder="e.g. 350000" />
                                         {getError('price') && <p className="text-sm text-destructive">{getError('price')}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Condition</Label>
                                    <RadioGroup name="condition" defaultValue="Used" className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="New" id="cond-new" />
                                            <Label htmlFor="cond-new">New</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Used" id="cond-used" />
                                            <Label htmlFor="cond-used">Used</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Refurbished" id="cond-refurb" />
                                            <Label htmlFor="cond-refurb">Refurbished</Label>
                                        </div>
                                    </RadioGroup>
                                    {getError('condition') && <p className="text-sm text-destructive">{getError('condition')}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Describe the product..." />
                                     {getError('description') && <p className="text-sm text-destructive">{getError('description')}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="images">Product Images</Label>
                                    <Input 
                                        id="images" 
                                        name="images" 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file:text-primary file:font-semibold"
                                    />
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                                            {imagePreviews.map((src, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <Image src={src} alt={`Preview ${index + 1}`} fill className="rounded-md object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">You can upload multiple images. The first will be the main display image.</p>
                                    {getError('images') && <p className="text-sm text-destructive">{getError('images')}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Specifications</CardTitle>
                                <CardDescription>Enter the technical details for the laptop.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="specs.processor">Processor</Label>
                                        <Input id="specs.processor" name="specs.processor" placeholder="e.g. Apple M1 Pro" />
                                        {getError('specs.processor') && <p className="text-sm text-destructive">{getError('specs.processor')}</p>}
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="specs.ram">RAM</Label>
                                        <Input id="specs.ram" name="specs.ram" placeholder="e.g. 16GB" />
                                        {getError('specs.ram') && <p className="text-sm text-destructive">{getError('specs.ram')}</p>}
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="specs.storage">Storage</Label>
                                        <Input id="specs.storage" name="specs.storage" placeholder="e.g. 512GB SSD" />
                                        {getError('specs.storage') && <p className="text-sm text-destructive">{getError('specs.storage')}</p>}
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="specs.display">Display</Label>
                                        <Input id="specs.display" name="specs.display" placeholder="e.g. 16.2-inch Liquid Retina XDR" />
                                        {getError('specs.display') && <p className="text-sm text-destructive">{getError('specs.display')}</p>}
                                    </div>
                               </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specs.battery">Battery</Label>
                                    <Input id="specs.battery" name="specs.battery" placeholder="e.g. Up to 21 hours" />
                                    {getError('specs.battery') && <p className="text-sm text-destructive">{getError('specs.battery')}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Marketing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="featured" name="featured" />
                                    <Label htmlFor="featured">Mark as Featured Product</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="newArrival" name="newArrival" />
                                    <Label htmlFor="newArrival">Mark as New Arrival</Label>
                                </div>
                            </CardContent>
                        </Card>

                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
