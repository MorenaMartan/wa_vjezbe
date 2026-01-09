<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <div
      class="mb-6 bg-white/70 backdrop-blur rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
    >
      <div class="flex-1">
        <label class="block text-sm font-semibold text-slate-700 mb-1"
          >Pretraga po nazivu</label
        >
        <input
          v-model="qNaziv"
          @input="fetchPizze()"
          type="text"
          placeholder="npr. Margherita"
          class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div class="w-full sm:w-44">
        <label class="block text-sm font-semibold text-slate-700 mb-1"
          >Cijena min</label
        >
        <input
          v-model="qMin"
          @input="fetchPizze()"
          type="text"
          placeholder="npr. 8"
          class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div class="w-full sm:w-44">
        <label class="block text-sm font-semibold text-slate-700 mb-1"
          >Cijena max</label
        >
        <input
          v-model="qMax"
          @input="fetchPizze()"
          type="text"
          placeholder="npr. 12"
          class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div class="w-full sm:w-52">
        <label class="block text-sm font-semibold text-slate-700 mb-1"
          >Sortiranje</label
        >
        <select
          v-model="qSort"
          @change="fetchPizze()"
          class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Bez sortiranja</option>
          <option value="asc">Cijena (uzlazno)</option>
          <option value="desc">Cijena (silazno)</option>
        </select>
      </div>

      <button
        @click="resetFilter()"
        class="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition"
      >
        Reset
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="pizza in pizze"
        :key="pizza.id"
        @click="odaberiPizzu(pizza)"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',

          odabrana_pizza?.naziv === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
      >
        <div class="bg-inherit rounded-xl overflow-hidden">
          <div class="w-full h-48 flex items-center justify-center bg-inherit">
            <div
              class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl"
            >
              <img
                :src="pizza.slika_url"
                :alt="pizza.naziv"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
              <h2 class="text-lg font-bold text-orange-500 tracking-wide">
                {{ pizza.naziv }}
              </h2>

              <div class="flex space-x-2">
                <div
                  v-for="sastojak in pizza.sastojci"
                  :key="sastojak"
                  class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate- 50 font-semibold text-xs"
                >
                  <v-icon :name="ikoneSastojaka[sastojak]" />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-gray-700">
                <span class="font-medium">Mala</span>
                <span>€{{ pizza.cijene.mala }}</span>
              </div>

              <div class="flex justify-between text-gray-700">
                <span class="font-medium">Srednja</span>
                <span>€{{ pizza.cijene.srednja }}</span>
              </div>

              <div class="flex justify-between text-gray-700">
                <span class="font-medium">Jumbo</span>
                <span>€{{ pizza.cijene.jumbo }}</span>
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                @click.stop="otvoriModalPizza(pizza)"
                class="px-3 py-1 veliki bg-slate-700 text-orange-400 border text-sm hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
              >
                Detalji
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OrderFooter
      v-if="odabrana_pizza"
      :odabrana-pizza="odabrana_pizza"
      @close="odabrana_pizza = null"
    />
    <PizzaModal
      v-if="prikaziPizzaModal"
      :pizza="pizzaZaModal"
      @close="prikaziPizzaModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { addIcons } from "oh-vue-icons";
import OrderFooter from "./OrderFooter.vue";
import PizzaModal from "./PizzaModal.vue";
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from "oh-vue-icons/icons";

addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton
);

const odabrana_pizza = ref(null);
const pizze = ref([]);

const qNaziv = ref("");
const qMin = ref("");
const qMax = ref("");
const qSort = ref("");

function resetFilter() {
  qNaziv.value = "";
  qMin.value = "";
  qMax.value = "";
  qSort.value = "";
  fetchPizze();
}

function odaberiPizzu(pizza_naziv) {
  odabrana_pizza.value = pizza_naziv;
}

const prikaziPizzaModal = ref(false);
const pizzaZaModal = ref(null);

function otvoriModalPizza(pizza) {
  pizzaZaModal.value = pizza;
  prikaziPizzaModal.value = true;
}

const ikoneSastojaka = {
  rajčica: "gi-tomato",
  sir: "gi-cheese-wedge",
  gljive: "gi-sliced-mushroom",
  bosiljak: "io-leaf-sharp",
  paprika: "gi-bell-pepper",
  šunka: "gi-ham-shank",
  "feferoni ljuti": "la-pepper-hot-solid",
  tunjevina: "gi-canned-fish",
  "crveni luk": "gi-garlic",
  panceta: "fa-bacon",
  kulen: "co-hotjar",
  vrhnje: "gi-milk-carton",
};

async function fetchPizze() {
  try {
    const params = {};

    if (qNaziv.value.trim() !== "") {
      params.naziv = qNaziv.value.trim();
    }

    if (qMin.value.trim() !== "" && !Number.isNaN(Number(qMin.value))) {
      params.cijena_min = qMin.value.trim();
    }

    if (qMax.value.trim() !== "" && !Number.isNaN(Number(qMax.value))) {
      params.cijena_max = qMax.value.trim();
    }

    if (qSort.value !== "") {
      params.sort = qSort.value;
    }

    const response = await axios.get("http://localhost:3000/pizze", { params });
    pizze.value = response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka o pizzama:", error);
    pizze.value = [];
  }
}

onMounted(() => {
  fetchPizze();
});
</script>

<style>
.veliki {
  height: 30px;
  width: 100%;
  border-radius: 15px;
}
</style>
