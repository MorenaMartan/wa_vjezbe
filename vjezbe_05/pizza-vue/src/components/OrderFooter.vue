<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-slate-700 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 sm:p-6 text-white"
  >
    <button
      class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
      @click="emit('close')"
    >
      ×
    </button>

    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6"
    >
      <div
        class="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 w-full sm:w-auto"
      >
        <img
          :src="odabranaPizza.slika_url"
          :alt="odabranaPizza.naziv"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md"
        />

        <h3
          class="font-bold tracking-wide text-base sm:text-lg text-orange-400"
        >
          {{ odabranaPizza.naziv }}
        </h3>
      </div>

      <div
        class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto"
      >
        <button
          v-for="(cijena, velicina) in odabranaPizza.cijene"
          :key="velicina"
          :class="[
            'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base transition-all cursor-pointer',
            odabranaVelicina === velicina
              ? 'bg-orange-500 text-white'
              : 'bg-slate-600/40 text-white hover:bg-orange-500 hover:text-white',
          ]"
          @click="odabranaVelicina = velicina"
        >
          {{ velicina }} – {{ cijena }}€
        </button>
      </div>

      <div class="flex items-center justify-center space-x-2 w-full sm:w-auto">
        <button
          @click="kolicina > 1 ? kolicina-- : (kolicina = 1)"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          -
        </button>

        <div
          class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base"
        >
          {{ kolicina }}
        </div>

        <button
          @click="kolicina++"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          +
        </button>
      </div>

      <div
        class="w-full sm:w-auto text-center font-semibold text-lg text-orange-400 tracking-wide"
      >
        Ukupno: {{ ukupna_cijena_stavke || "0.00" }}€
      </div>

      <button
        @click="dodajUNarudzbu"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow- black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Dodaj u košaricu
      </button>

      <button
        @click="prikaziModalDostava = true"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Naruči
      </button>
    </div>

    <div
      v-if="narucene_pizze.length"
      class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop- rounded-lg p-3 border border-slate-600"
    >
      <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
      <ul class="space-y-2">
        <li
          v-for="(stavka, index) in narucene_pizze"
          :key="index"
          class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
        >
          <div class="text-white">
            {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
          </div>

          <div class="flex items-center gap-3">
            <div class="text-orange-400 font-semibold">
              {{
                (
                  props.odabranaPizza.cijene[stavka.velicina] * stavka.kolicina
                ).toFixed(2)
              }}€
            </div>

            <button
              class="px-2 py-1 text-xs rounded-md bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              @click="ukloniStavku(index)"
            >
              Ukloni
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="prikaziModalDostava"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        class="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-600 relative"
      >
        <button
          class="absolute top-2 right-3 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
          @click="prikaziModalDostava = false"
        >
          ×
        </button>

        <h3 class="text-lg font-semibold text-white mb-4">Podaci za dostavu</h3>

        <div class="space-y-3">
          <div>
            <label class="text-sm text-slate-300">Prezime</label>
            <input
              v-model="dostava.prezime"
              type="text"
              placeholder="Prezime"
              class="mt-1 w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-500 outline-none"
            />
            <p v-if="errors.prezime" class="text-red-400 text-xs mt-1">
              {{ errors.prezime }}
            </p>
          </div>

          <div>
            <label class="text-sm text-slate-300">Adresa</label>
            <input
              v-model="dostava.adresa"
              type="text"
              placeholder="Adresa"
              class="mt-1 w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-500 outline-none"
            />
            <p v-if="errors.adresa" class="text-red-400 text-xs mt-1">
              {{ errors.adresa }}
            </p>
          </div>

          <div>
            <label class="text-sm text-slate-300">Telefon</label>
            <input
              v-model="dostava.telefon"
              type="tel"
              placeholder="Telefon"
              class="mt-1 w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-500 outline-none"
            />
            <p v-if="errors.telefon" class="text-red-400 text-xs mt-1">
              {{ errors.telefon }}
            </p>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            class="px-3 py-2 rounded-lg border border-slate-500 text-slate-200 hover:bg-slate-700 cursor-pointer"
            @click="prikaziModalDostava = false"
          >
            Odustani
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 cursor-pointer"
            @click="posaljiNarudzbu"
          >
            Potvrdi narudžbu
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="statusPoruka"
      class="mt-4 max-w-2xl mx-auto text-center px-4 py-3 rounded-lg"
      :class="
        statusTip === 'success'
          ? 'bg-emerald-600/70 text-emerald-50 border border-emerald-400'
          : 'bg-red-600/70 text-red-50 border border-red-400'
      "
    >
      {{ statusPoruka }}
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const props = defineProps({
  odabranaPizza: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const odabranaVelicina = ref("mala");
const kolicina = ref(1);
const narucene_pizze = ref([]);

const statusPoruka = ref("");
const statusTip = ref(null);

function ukloniStavku(index) {
  narucene_pizze.value.splice(index, 1);
}

const prikaziModalDostava = ref(false);

const dostava = ref({
  prezime: "",
  adresa: "",
  telefon: "",
});

const errors = ref({
  prezime: "",
  adresa: "",
  telefon: "",
});

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu =
    props.odabranaPizza.cijene[odabranaVelicina.value] || 0;
  return (cijenaPoKomadu * kolicina.value).toFixed(2);
});

function dodajUNarudzbu() {
  const novaStavka = {
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: kolicina.value,
  };
  narucene_pizze.value.push(novaStavka);
}

function izracunajCijenuStavke(stavka) {
  if (stavka.naziv === props.odabranaPizza.naziv) {
    const c = props.odabranaPizza.cijene[stavka.velicina] || 0;
    return c * stavka.kolicina;
  }
  return 0;
}

function validateDostava() {
  let ok = true;

  errors.value = { prezime: "", adresa: "", telefon: "" };

  if (!dostava.value.prezime.trim()) {
    errors.value.prezime = "Prezime je obavezno";
    ok = false;
  }
  if (!dostava.value.adresa.trim()) {
    errors.value.adresa = "Adresa je obavezna";
    ok = false;
  }
  if (!dostava.value.telefon.trim()) {
    errors.value.telefon = "Telefon je obavezan";
    ok = false;
  } else if (dostava.value.telefon.length < 6) {
    errors.value.telefon = "Telefon nije ispravan";
    ok = false;
  }

  return ok;
}

async function posaljiNarudzbu() {
  try {
    statusPoruka.value = "";
    statusTip.value = null;

    if (narucene_pizze.value.length === 0) {
      statusPoruka.value =
        "Košarica je prazna! Molimo dodajte pizze prije narudžbe.";
      statusTip.value = "error";
      return;
    }

    if (!validateDostava()) {
      statusPoruka.value = "Molimo ispunite sve podatke za dostavu.";
      statusTip.value = "error";
      return;
    }

    const podaciZaDostavu = { ...dostava.value };

    const odgovor = await axios.post("http://localhost:3000/narudzbe", {
      narucene_pizze: narucene_pizze.value,
      podaci_dostava: podaciZaDostavu,
    });

    statusPoruka.value =
      odgovor.data.poruka ||
      odgovor.data.message ||
      "Narudžba je uspješno poslana.";
    statusTip.value = "success";

    narucene_pizze.value = [];
    dostava.value = { prezime: "", adresa: "", telefon: "" };
    errors.value = { prezime: "", adresa: "", telefon: "" };
    prikaziModalDostava.value = false;
  } catch (error) {
    console.error("Greška pri slanju narudžbe:", error);

    const porukaErrora =
      error.response?.data?.poruka ||
      error.response?.data?.message ||
      "Došlo je do greške pri slanju narudžbe. Molimo pokušajte ponovno.";

    statusPoruka.value = porukaErrora;
    statusTip.value = "error";
  }
}
</script>

<style scoped>
.relative {
  position: relative;
  top: -10em;
}
</style>
