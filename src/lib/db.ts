import { supabase } from './supabase';
import { products as staticProducts } from '@/data/products';
import { Product } from '@/types';

/**
 * Fetches all products from Supabase.
 * Falls back to static products if the database is empty or the request fails.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return staticProducts;
    }

    // Map Supabase product to Frontend Product type
    return data.map(mapDbProductToFrontend);
  } catch (err) {
    console.error('Error fetching products:', err);
    return staticProducts;
  }
}

/**
 * Fetches a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return staticProducts.find(p => p.slug === slug) || null;
    }

    return mapDbProductToFrontend(data);
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return staticProducts.find(p => p.slug === slug) || null;
  }
}

/**
 * Mapper function to ensure the database fields match the frontend types.
 * Handles the potential difference between single strings and localized objects.
 */
function mapDbProductToFrontend(dbP: any): Product {
  return {
    ...dbP,
    id: dbP.id.toString(),
    // Fallback logic for localized fields if they come as strings from Admin
    description: typeof dbP.description === 'string' ? dbP.description : (dbP.description || ''),
    shortDescription: typeof dbP.shortDescription === 'string' ? dbP.shortDescription : (dbP.shortDescription || ''),
    inStock: dbP.in_stock ?? true,
    // Ensure nested objects preserve structure
    colors: Array.isArray(dbP.colors) ? dbP.colors : [],
    images: Array.isArray(dbP.images) ? dbP.images : [],
    features: Array.isArray(dbP.features) ? dbP.features : [],
    rating: dbP.rating || 5,
    reviewCount: dbP.reviewCount || 0,
  };
}
