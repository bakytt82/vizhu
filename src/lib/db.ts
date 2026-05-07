import { supabase } from './supabase';
import { products as staticProducts } from '@/data/products';
import { Product } from '@/types';

/**
 * Fetches all products from Supabase.
 * Falls back to static products if the database is empty or the request fails.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    let allDbProducts: DbProduct[] = [];

    // Fetch products
    const productsRes = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (productsRes.data) {
      allDbProducts = [...allDbProducts, ...productsRes.data];
    }
    
    // Fetch lenses (optional, might not exist yet)
    // We fetch but ignore the 404 error if it happens to prevent dev overlay crash
    const lensesRes = await supabase.from('lenses').select('*').order('created_at', { ascending: false });
    if (lensesRes && lensesRes.data) {
      allDbProducts = [...allDbProducts, ...lensesRes.data];
    }

    if (productsRes.error && allDbProducts.length === 0) {
      console.error('Error fetching from Supabase:', productsRes.error);
      return staticProducts;
    }

    const dbProducts = allDbProducts.map(mapDbProductToFrontend);
    
    // AI Studio Synchronization:
    // If we have live products in Supabase, we use them as the source of truth.
    // This ensures the site catalog matches the AI Studio project exactly.
    if (dbProducts.length > 0) {
      return dbProducts;
    }

    // Fallback to static products only if the database is empty
    return staticProducts;
  } catch (err) {
    console.error('Error fetching products from database, falling back to static data:', err);
    return staticProducts;
  }
}

/**
 * Fetches a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Try products table first
    const { data: pData } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pData) return mapDbProductToFrontend(pData);

    // Then try lenses table
    const { data: lData } = await supabase
      .from('lenses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (lData) return mapDbProductToFrontend(lData);

    // Fallback to static products
    const staticProduct = staticProducts.find(p => p.slug === slug);
    return staticProduct || null;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    const staticProduct = staticProducts.find(p => p.slug === slug);
    return staticProduct || null;
  }
}

/**
 * Mapper function to ensure the database fields match the frontend types.
 * Handles the potential difference between single strings and localized objects.
 */
interface DbProduct extends Omit<Product, 'id' | 'description' | 'shortDescription' | 'inStock' | 'frameType'> {
  id?: string | number;
  description?: string | { ru: string; kg: string; en: string };
  shortDescription?: string | { ru: string; kg: string; en: string };
  in_stock?: boolean;
  frame_type?: string;
}

function mapDbProductToFrontend(dbP: DbProduct): Product {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'product-images';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const baseUrl = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/${bucket}` : '';

  const images = (Array.isArray(dbP.images) ? dbP.images : []).map((img: string) => {
    if (!img) return '';
    if (img.startsWith('http') || img.startsWith('/')) return img;
    
    // Determine folder: use 'lenses/' for lenses category, otherwise use env or 'products/'
    const folder = dbP.category === 'lenses' ? 'lenses/' : (process.env.NEXT_PUBLIC_SUPABASE_FOLDER || 'products/');
    return baseUrl ? `${baseUrl}/${folder}${img}` : img;
  });

  return {
    ...dbP,
    id: dbP.id?.toString() || Math.random().toString(),
    // Fallback logic for localized fields if they come as strings from Admin
    description: typeof dbP.description === 'string' ? { ru: dbP.description, kg: dbP.description, en: dbP.description } : (dbP.description || { ru: '', kg: '', en: '' }),
    shortDescription: typeof dbP.shortDescription === 'string' ? { ru: dbP.shortDescription, kg: dbP.shortDescription, en: dbP.shortDescription } : (dbP.shortDescription || { ru: '', kg: '', en: '' }),
    inStock: dbP.in_stock ?? true,
    // Ensure nested objects preserve structure
    colors: Array.isArray(dbP.colors) ? dbP.colors : [],
    images: images.filter(Boolean),
    features: Array.isArray(dbP.features) ? dbP.features : [],
    rating: dbP.rating || 5,
    reviewCount: dbP.reviewCount || 0,
    frameType: dbP.frame_type || dbP.frameType,
    quantity: dbP.quantity || 0,
  };
}
