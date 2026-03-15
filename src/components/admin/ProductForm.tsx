'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

export default function ProductForm({
  initialData = null,
  onComplete,
  onCancel,
}: {
  initialData?: any;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || 'Очки для зрения');
  const [description, setDescription] = useState(initialData?.description || '');
  const [shape, setShape] = useState(initialData?.shape || 'Квадратная');
  const [material, setMaterial] = useState(initialData?.material || 'Пластик');
  const [frameType, setFrameType] = useState(initialData?.frameType || 'Ободковая');
  const [inStock, setInStock] = useState(initialData?.in_stock ?? true);
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || '0');
  
  const [colors, setColors] = useState<ColorOption[]>(initialData?.colors || []);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  // Temporary state for new color
  const [newColorId, setNewColorId] = useState('black');
  const [newColorLabel, setNewColorLabel] = useState('Черный');
  const [newColorHex, setNewColorHex] = useState('#000000');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImages([...images, publicUrl]);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError('Ошибка загрузки изображения. Проверьте настройки хранилища (Storage) в Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const addColor = () => {
    if (!newColorId || !newColorLabel || !newColorHex) return;
    setColors([...colors, { id: newColorId, label: newColorLabel, hex: newColorHex }]);
    setNewColorId('black');
    setNewColorLabel('Черный');
    setNewColorHex('#000000');
  };

  const removeColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        name,
        brand,
        price: parseFloat(price),
        category,
        description,
        shape,
        material,
        frame_type: frameType,
        in_stock: inStock,
        quantity: parseInt(quantity) || 0,
        colors,
        images,
        slug: initialData?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      };

      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
        if (insertError) throw insertError;
      }

      onComplete();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Произошла ошибка при сохранении товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
        <h2 className="text-xl font-bold">{initialData ? 'Редактировать товар' : 'Добавить новый товар'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-full transition-colors">
          <X size={20} className="text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название товара <span className="text-red-500">*</span></label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
              placeholder="Напр., Aviator Classic Gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Бренд <span className="text-red-500">*</span></label>
            <input
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
              placeholder="Напр., RAY-BAN"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Цена (сом) <span className="text-red-500">*</span></label>
            <input
              required
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
              placeholder="8500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
            >
              <option value="eyeglasses">Очки для зрения</option>
              <option value="sunglasses">Солнцезащитные очки</option>
              <option value="computer">Компьютерные очки</option>
              <option value="sports">Спортивные очки</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Количество в наличии <span className="text-red-500">*</span></label>
            <input
              required
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
              placeholder="10"
            />
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Форма</label>
            <input
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
              placeholder="Авиаторы, Квадратная..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Материал</label>
            <input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
              placeholder="Металл, Пластик..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Тип оправы</label>
            <select
              value={frameType}
              onChange={(e) => setFrameType(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-vizhu-purple/20"
            >
              <option value="Ободковая">Ободковая</option>
              <option value="Полуободковая">Полуободковая</option>
              <option value="Безободковая">Безободковая</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-4 border-t border-border/50">
          <label className="text-sm font-medium">Описание товара</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-muted border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-vizhu-purple/20 resize-none"
            placeholder="Опишите особенности этой оправы..."
          />
        </div>

        {/* Images Upload */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <label className="text-sm font-medium flex items-center justify-between">
            Фотографии товара
            <span className="text-xs text-muted-foreground font-normal">Первое фото будет главным</span>
          </label>
          
          <div className="flex flex-wrap gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                <img src={img} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-vizhu-purple transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={loading}
              />
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <UploadCloud size={24} className="mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Загрузить</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <label className="text-sm font-medium">Доступные цвета</label>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {colors.map(color => (
              <div key={color.id} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm border border-border/50">
                <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                {color.label}
                <button type="button" onClick={() => removeColor(color.id)} className="text-muted-foreground hover:text-red-500 ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border/50 w-full md:w-auto overflow-x-auto">
            <input
              value={newColorLabel}
              onChange={(e) => setNewColorLabel(e.target.value)}
              placeholder="Название (напр. Золотой)"
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm min-w-[120px]"
            />
            <input
              value={newColorId}
              onChange={(e) => setNewColorId(e.target.value)}
              placeholder="ID (напр. gold)"
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm min-w-[100px]"
            />
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2 py-1 flex-shrink-0">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-xs text-muted-foreground font-mono w-16">{newColorHex}</span>
            </div>
            <button
              type="button"
              onClick={addColor}
              className="bg-vizhu-purple text-white p-1.5 rounded-lg hover:bg-vizhu-purple-dark transition-colors flex-shrink-0"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="pt-4 border-t border-border/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-5 h-5 rounded border-border text-vizhu-purple focus:ring-vizhu-purple/20"
            />
            <span className="text-sm font-medium">Товар в наличии</span>
          </label>
        </div>

        {/* Actions */}
        <div className="pt-6 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-medium border border-border hover:bg-muted transition-colors flex-1 md:flex-none"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-vizhu-purple text-white px-6 py-3 rounded-xl font-medium hover:bg-vizhu-purple-dark transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {initialData ? 'Сохранить изменения' : 'Создать товар'}
          </button>
        </div>
      </form>
    </div>
  );
}
