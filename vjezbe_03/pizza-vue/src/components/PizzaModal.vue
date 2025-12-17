<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-slate-700 rounded-2xl w-full max-w-3xl p-6 border border-slate-700 relative">
      <button
        class="absolute top-3 right-4 text-slate-300 hover:text-white text-2xl font-bold"
        @click="emit('close')"
      >
        ×
      </button>

      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
          <img
            :src="pizza.slika_url"
            :alt="pizza.naziv"
            class="w-full h-64 md:h-full object-cover rounded-xl shadow-md"
          />
        </div>

        <div class="md:w-1/2 space-y-4 text-white">
          <h1 class="text-2xl md:text-3xl font-bold text-orange-400">
            {{ pizza.naziv }}
          </h1>

          <div>
            <h2 class="text-sm uppercase tracking-wide text-slate-300 mb-1">Sastojci</h2>
            <p>{{ pizza.sastojci.join(', ') }}</p>
          </div>

          <div>
            <h2 class="text-sm uppercase tracking-wide text-slate-300 mb-1">Cijene</h2>
            <ul class="space-y-1">
              <li v-for="(cijena, velicina) in pizza.cijene" :key="velicina">
                <span class="font-semibold capitalize">{{ velicina }}:</span>
                <span> {{ cijena }} €</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pizza: { type: Object, required: true },
})

const emit = defineEmits(['close'])
</script>
