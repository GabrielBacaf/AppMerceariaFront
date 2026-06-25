<script setup lang="ts">
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-vue-next';
import Card from '../components/ui/Card.vue';
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card class="flex items-center p-6 gap-4 border-l-4 border-l-primary-500">
        <div class="p-3 bg-primary-100 text-primary-600 rounded-full">
          <Package class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium">Total Produtos</p>
          <p class="text-2xl font-bold text-slate-800">124</p>
        </div>
      </Card>
      
      <Card class="flex items-center p-6 gap-4 border-l-4 border-l-emerald-500">
        <div class="p-3 bg-emerald-100 text-emerald-600 rounded-full">
          <ShoppingCart class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium">Vendas Hoje</p>
          <p class="text-2xl font-bold text-slate-800">32</p>
        </div>
      </Card>

      <Card class="flex items-center p-6 gap-4 border-l-4 border-l-blue-500">
        <div class="p-3 bg-blue-100 text-blue-600 rounded-full">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium">Clientes Cadastrados</p>
          <p class="text-2xl font-bold text-slate-800">85</p>
        </div>
      </Card>

      <Card class="flex items-center p-6 gap-4 border-l-4 border-l-purple-500">
        <div class="p-3 bg-purple-100 text-purple-600 rounded-full">
          <DollarSign class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-slate-500 font-medium">Faturamento do Mês</p>
          <p class="text-2xl font-bold text-slate-800">R$ 15.420</p>
        </div>
      </Card>
    </div>
  </div>
</template>
