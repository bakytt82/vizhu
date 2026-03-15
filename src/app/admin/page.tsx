'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, LogOut, Plus, Search, Tag, Eye, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [products, setProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchProducts();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProducts();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить товар "${name}"? Это действие необратимо.`)) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      fetchProducts();
    } else {
      alert('Ошибка при удалении товара: ' + error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError('Неверный логин или пароль');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-vizhu-purple" size={32} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-sm p-8 rounded-3xl border border-border/50 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-vizhu-purple to-vizhu-orange bg-clip-text text-transparent inline-block">
              VIZHU ADMIN
            </h1>
            <p className="text-sm text-muted-foreground mt-2">Вход для сотрудников салона</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-vizhu-purple/20"
                placeholder="admin@vizhu.kg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-vizhu-purple/20"
                placeholder="••••••••"
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vizhu-purple text-white rounded-xl py-3 font-medium hover:bg-vizhu-purple-dark transition-colors"
            >
              {loading ? 'Вход...' : 'Войти в систему'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <ProductForm 
          initialData={currentProduct}
          onCancel={() => {
            setIsEditing(false);
            setCurrentProduct(null);
          }}
          onComplete={() => {
            setIsEditing(false);
            setCurrentProduct(null);
            fetchProducts();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card p-4 md:p-6 rounded-3xl border border-border/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Управление каталогом</h1>
          <p className="text-muted-foreground">Добавляйте, редактируйте и удаляйте оправы</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setCurrentProduct(null);
              setIsEditing(true);
            }}
            className="bg-vizhu-orange text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Добавить товар
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 bg-muted text-muted-foreground hover:text-red-500 rounded-xl transition-colors"
            title="Выйти"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Product List Skeleton for now */}
      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Поиск по названию или бренду..."
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl border-0 text-sm focus:ring-2 focus:ring-vizhu-purple/20"
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Всего товаров: {products.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Товар</th>
                <th className="px-6 py-4 font-medium">Категория</th>
                <th className="px-6 py-4 font-medium">Цена</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Нет добавленных товаров
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-xl relative overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Eye size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs">
                        <Tag size={12} />
                        {p.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{p.price.toLocaleString()} сом</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        p.in_stock ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {p.in_stock ? 'В наличии' : 'Нет в наличии'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => {
                            setCurrentProduct(p);
                            setIsEditing(true);
                          }}
                          className="text-vizhu-purple hover:underline text-xs font-medium"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
