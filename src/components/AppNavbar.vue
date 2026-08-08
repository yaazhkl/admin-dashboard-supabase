<script setup lang="ts">
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const goToAccount = ()=>{
    router.push({name : "Account"})
  }
defineProps<{
  userName: string;
  isOpen : boolean;
}>()


defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20" >
    <div class="flex items-center gap-3">
      <!-- Hamburger -->
      <button
        class="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <svg class="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="font-semibold text-slate-800 hidden sm:block">HR Management</h1>
    </div>

    <div class="flex items-center gap-4 cursor-pointer" @click="goToAccount">
      <div class="flex items-center gap-2">
        <div class="">
          
        </div>
        <div class="w-9 h-9 rounded-full bg-sky-900 text-white flex items-center justify-center font-semibold text-slate-900 text-sm">
          {{ userName.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium text-slate-700 hidden sm:block">{{ userName }}</span>
      </div>
    </div>
  </header>
</template>
