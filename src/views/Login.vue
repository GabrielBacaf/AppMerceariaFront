<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingCart, LogIn, Loader2 } from 'lucide-vue-next';
import { AuthService } from '../services';
import api from '../services/api';

const router = useRouter();

const login = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!login.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos.';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // 1. Obter o cookie CSRF do Sanctum (obrigatório no Laravel 11/Sanctum SPA)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    await api.get('/sanctum/csrf-cookie', { baseURL: baseUrl });
    
    // 2. Fazer o Login
    const response = await AuthService.login({
      login: login.value.trim(),
      password: password.value.trim(),
      device_name: 'web',
    });
    
    // Se a API retornar um token Sanctum
    if (response.data && response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    
    // Sucesso, redirecionar para a home
    router.push('/');
  } catch (err: any) {
    console.error('Erro de login:', err);
    if (err.response) {
      if (err.response.status === 422) {
        error.value = 'Dados inválidos. Verifique os campos.';
      } else if (err.response.status === 401) {
        error.value = 'Usuário ou senha incorretos.';
      } else {
        error.value = err.response.data?.message || 'Erro interno no servidor.';
      }
    } else {
      error.value = 'Ocorreu um erro ao conectar com o servidor. Verifique sua rede.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
    <!-- Efeitos de Fundo (Glassmorphism + Orbs) Dark Mode -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
      <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Container do Card Centralizado -->
    <div class="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 relative z-10 transform transition-all hover:shadow-primary-500/5">
      
      <!-- Cabeçalho -->
      <div class="text-center mb-8">
        <div class="inline-flex justify-center items-center bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 mb-4 transform transition-transform hover:scale-105 duration-300">
          <ShoppingCart class="w-10 h-10 text-primary-500" />
        </div>
        <h2 class="text-3xl font-extrabold text-white tracking-tight">
          App Mercearia
        </h2>
        <p class="mt-2 text-sm text-slate-400">
          Bem-vindo de volta! Acesse sua conta.
        </p>
      </div>

      <!-- Formulário -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        
        <!-- Mensagem de Erro -->
        <div v-if="error" class="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center animate-pulse">
          <p class="text-sm text-red-400 font-medium">{{ error }}</p>
        </div>

        <div>
          <label for="login" class="block text-sm font-medium text-slate-300 mb-1">
            Usuário
          </label>
          <div class="relative">
            <input 
              id="login" 
              v-model="login"
              name="login" 
              type="text" 
              autocomplete="username" 
              required 
              class="appearance-none block w-full px-4 py-3 border border-slate-700 rounded-xl shadow-sm bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm focus:bg-slate-900"
              placeholder="admin"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-300 mb-1">
            Senha
          </label>
          <div class="relative">
            <input 
              id="password" 
              v-model="password"
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              class="appearance-none block w-full px-4 py-3 border border-slate-700 rounded-xl shadow-sm bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm focus:bg-slate-900"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-primary-500 focus:ring-primary-500 border-slate-700 bg-slate-900 rounded cursor-pointer transition-colors">
            <label for="remember-me" class="ml-2 block text-sm text-slate-400 cursor-pointer">
              Lembrar-me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-400 hover:text-primary-300 transition-colors">
              Esqueceu a senha?
            </a>
          </div>
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-900/50 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group hover:shadow-primary-500/20"
          >
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
            <span v-else class="flex items-center gap-2">
              Entrar <LogIn class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
