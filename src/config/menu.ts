import { Home, Package, ShoppingCart, Users, Settings, ShoppingBag, Truck, UserCog, Shield } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface MenuItem {
  name: string;
  icon: Component;
  path: string;
  children?: Omit<MenuItem, 'icon' | 'children'>[];
}

export const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { 
    name: 'Produtos', 
    icon: Package, 
    path: '/products',
    children: [
      { name: 'Cadastrar Produto', path: '/products/create' },
      { name: 'Listar Produtos', path: '/products' },
    ]
  },
  { 
    name: 'Vendas', 
    icon: ShoppingCart, 
    path: '/sales',
    children: [
      { name: 'Nova Venda', path: '/sales/create' },
      { name: 'Listar Vendas', path: '/sales' },
    ]
  },
  { 
    name: 'Dar entrada no Estoque', 
    icon: ShoppingBag, 
    path: '/purchases',
    children: [
      { name: 'Nova Compra', path: '/purchases/create' },
      { name: 'Listar Compras', path: '/purchases' },
    ]
  },
  { 
    name: 'Clientes', 
    icon: Users, 
    path: '/clients',
    children: [
      { name: 'Novo Cliente', path: '/clients/create' },
      { name: 'Listar Clientes', path: '/clients' },
    ]
  },
  { 
    name: 'Fornecedores', 
    icon: Truck, 
    path: '/suppliers',
    children: [
      { name: 'Novo Fornecedor', path: '/suppliers/create' },
      { name: 'Listar Fornecedores', path: '/suppliers' },
    ]
  },
  { 
    name: 'Usuários', 
    icon: UserCog, 
    path: '/users',
    children: [
      { name: 'Novo Usuário', path: '/users/create' },
      { name: 'Listar Usuários', path: '/users' },
    ]
  },
  { 
    name: 'Perfis de Acesso', 
    icon: Shield, 
    path: '/roles',
    children: [
      { name: 'Novo Perfil', path: '/roles/create' },
      { name: 'Listar Perfis', path: '/roles' },
    ]
  },
  { name: 'Configurações', icon: Settings, path: '/' },
];
