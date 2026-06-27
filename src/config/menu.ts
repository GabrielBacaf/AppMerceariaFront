import { Home, Package, ShoppingCart, Users, Settings, ShoppingBag, Truck, UserCog, Shield } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface MenuItem {
  name: string;
  icon: Component;
  path: string;
  children?: Omit<MenuItem, 'icon' | 'children'>[];
}

export const menuItems: MenuItem[] = [
  { name: 'Home', icon: Home, path: '/' },
  { 
    name: 'Vendas', 
    icon: ShoppingCart, 
    path: '/sales'
  },
  { 
    name: 'Estoque', 
    icon: Package, 
    path: '',
    children: [
      { name: 'Produtos', path: '/products' },
      { name: 'Compras', path: '/purchases' },
      { name: 'Fornecedores', path: '/suppliers' },
    ]
  },
  { 
    name: 'Clientes', 
    icon: Users, 
    path: '/clients'
  },
  { 
    name: 'Configurações', 
    icon: Settings, 
    path: '',
    children: [
      { name: 'Usuários', path: '/users' },
      { name: 'Perfis de Acesso', path: '/roles' },
    ]
  },
];
