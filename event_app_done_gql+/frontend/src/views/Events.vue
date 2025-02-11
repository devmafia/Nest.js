<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-end mb-8 relative">
        <button
          @click="openFilter"
          class="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Пошуковий фільтр</span>
        </button>

        <div
          v-if="isModalOpen"
          class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl p-6 z-20 w-80"
        >
          <div class="space-y-6">
            <div>
              <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Категорія</label>
              <select
                v-model="selectedCategory"
                id="category"
                class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Виберіть категорію</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>

            <div>
              <label for="time" class="block text-sm font-semibold text-gray-700 mb-2">Дата</label>
              <input
                v-model="selectedDate"
                type="date"
                id="time"
                class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">За літерою</label>
              <select
                v-model="selectedLetter"
                class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Виберіть літеру</option>
                <option v-for="letter in letters" :key="letter" :value="letter">{{ letter }}</option>
              </select>
            </div>

            <button
              @click="closeFilter"
              class="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Закрити
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="event in paginatedEvents"
          :key="event.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          <div class="relative overflow-hidden aspect-video">
            <img
              :src="`http://localhost:5000${event.image}`"
              :alt="event.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0"></div>
          </div>

          <div class="p-6">
            <div class="flex items-center space-x-2 mb-3">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {{ event.category }}
              </span>
              <span class="text-gray-500 text-sm">{{ event.date }}</span>
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              {{ event.title }}
            </h3>

            <p class="text-gray-600 line-clamp-3 mb-4">{{ event.description }}</p>

            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-blue-600">{{ event.price }} UAH</span>
              <router-link
                :to="{ name: 'EventDetails', params: { id: event.id } }"
                class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                <span>View Details</span>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center space-x-4 mt-8">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Попередня
        </button>
        <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Наступна
        </button>
      </div>

      <ul class="mt-8 space-y-2">
        <li
          v-for="(message, index) in messages"
          :key="index"
          class="bg-red-50 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, watchEffect } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { FETCH_EVENTS } from "../graphql/eventQueries";

const eventsData = ref([]);
const isModalOpen = ref(false);
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const selectedCategory = ref("");
const selectedDate = ref("");
const selectedLetter = ref("");
const messages = ref([]);
let categories = [];

const openFilter = () => (isModalOpen.value = true);
const closeFilter = () => (isModalOpen.value = false);

const { onResult, loading, error } = useQuery(FETCH_EVENTS);

onMounted(() => {
  console.log("Component Mounted. Loading State:", loading.value);

  watchEffect(() => {
    if (error.value) {
      console.error("GraphQL Error:", error.value);
      messages.value.push(error.value);
    }
  });

  onResult((result) => {
    if (result.data?.getAllEvents) {
      eventsData.value = result.data.getAllEvents;
      console.log("Fetched Events:", eventsData.value);
      for (let i in eventsData.value) {
        categories.push(eventsData.value[i].category);
      }
    }
  });
});

const filteredEvents = computed(() => {
  return eventsData.value.filter((event) => {
    const matchesCategory =
      selectedCategory.value !== "" ? event.category === selectedCategory.value : true;
    const matchesDate = selectedDate.value
      ? new Date(event.date).toISOString().split("T")[0] === selectedDate.value
      : true;
    const matchesLetter =
      selectedLetter.value !== "" ? event.title.startsWith(selectedLetter.value) : true;
    return matchesCategory && matchesDate && matchesLetter;
  });
});

const currentPage = ref(1);
const itemsPerPage = ref(9);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEvents.value.length / itemsPerPage.value))
);

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredEvents.value.slice(start, start + itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

watch(filteredEvents, () => {
  currentPage.value = 1;
});
</script>
