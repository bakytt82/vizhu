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
    if (error) setAuthError(error.message === 'Invalid login credentials' ? 'Неверный логин или пароль' : error.message);
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
                <th class               {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    Нет добавленных товаров
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors border-b border-border/10 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary rounded-2xl relative overflow-hidden shrink-0 shadow-sm border border-border/20">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                              <Eye size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-base tracking-tight">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/20">
                        <Tag size={12} className="text-vizhu-orange" />
                        {p.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-base text-foreground">
                        {p.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">сом</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{p.quantity || 0}</span>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">шт. в наличии</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {new Date(p.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                          {new Date(p.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                        p.in_stock ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                      )}>
                        {p.in_stock ? 'В наличии' : 'Нет в наличии'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setCurrentProduct(p);
                            setIsEditing(true);
                          }}
                          className="bg-card hover:bg-secondary text-vizhu-purple p-2 rounded-xl border border-border/50 transition-all shadow-sm hover:scale-105 active:scale-95"
                          title="Редактировать"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1">Редактировать</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="bg-card hover:bg-red-50 text-red-500 p-2 rounded-xl border border-border/50 transition-all shadow-sm hover:scale-105 active:scale-95"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}                   onClick={() => handleDelete(p.id, p.name)}
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
