<template>
  <div class="container mx-auto mt-8 px-4">
      <!-- <div v-if="cartError" class="bg-red-100 text-red-700 p-4 rounded mb-4 flex justify-between items-center shadow-md">
          {{ cartError }}
          <button @click="clearError" class="text-red-700 text-lg font-semibold hover:text-red-800 transition duration-150">&times;</button>
      </div> -->

      <div v-if="cartLoading" class="flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>

      <div v-else-if="cartItems.length === 0" class="text-center">
          <p class="text-gray-600">Your cart is empty</p>
          <router-link to="/" class="mt-2 inline-block bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition duration-150">Browse Events</router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2">
              <div class="bg-white shadow-lg rounded-lg mb-6">
                  <div class="p-4 flex justify-between items-center border-b border-gray-200">
                      <h5 class="text-lg font-semibold">Shopping Cart ({{ cartItemCount }} items)</h5>
                      <button @click="clearCart" class="text-red-600 hover:text-red-800 transition duration-150">Clear Cart</button>
                  </div>

                  <ul>
                      <li v-for="item in cartItems" :key="item.event.id" class="border-b border-gray-200 p-4">
                          <div class="flex">
                              <img :src="item.event.image" :alt="item.event.title" class="w-24 h-24 rounded-lg object-cover mr-4 shadow-sm" />
                              <div class="flex-1">
                                  <h5 class="text-lg font-semibold">{{ item.event.title }}</h5>
                                  <p class="text-gray-600">{{ formatDate(item.event.date) }}</p>
                                  <p class="text-sm text-gray-500">{{ item.event.description }}</p>
                                  <p class="text-indigo-600 font-semibold">UAH {{ item.event.price }} per seat</p>
                                  <router-link :to="{ name: 'EventDetails', params: { id: item.event.id } }" class="text-blue-500 hover:underline mt-2 inline-block">View Event Details</router-link>

                                  <div class="mt-4">
                                      <h6 class="text-sm font-semibold">Selected Seats ({{ item.seats.length }})</h6>
                                      <div class="flex flex-wrap gap-2 mt-2">
                                          <div v-for="seat in item.seats" :key="seat.id" class="bg-blue-500 text-white rounded px-2 py-1 flex items-center">
                                              Seat {{ seat.seatNumber }}
                                              <button @click="removeSeats(item.event.id, [seat.id])" class="ml-2 text-xs text-white hover:text-red-400 transition duration-150">&times;</button>
                                          </div>
                                      </div>
                                  </div>

                                  <div class="mt-4 flex justify-between items-center">
                                      <p class="text-sm font-semibold">Subtotal: UAH {{ (item.event.price * item.seats.length).toFixed(2) }}</p>
                                      <button @click="removeEventFromCart(item.event.id)" class="text-red-600 hover:text-red-800 transition duration-150">Remove Event</button>
                                  </div>
                              </div>
                          </div>
                      </li>
                  </ul>
              </div>

              <div class="bg-white shadow-lg rounded-lg p-4">
                  <div class="flex justify-between items-center">
                      <div>
                          <p class="text-sm">Subtotal ({{ cartItemCount }} items)</p>
                          <h4 class="text-lg font-semibold">UAH {{ totalPrice.toFixed(2) }}</h4>
                      </div>
                  </div>
              </div>
          </div>

          <div id="checkout" class="bg-white shadow-lg rounded-lg p-6">
              <h5 class="text-lg font-semibold mb-4">Checkout</h5>
              <form @submit.prevent="handleOrder" class="space-y-4">
                  <div class="space-y-1">
                      <label for="name" class="text-sm font-semibold">Name *</label>
                      <input type="text" id="name" v-model="contact.name" required :class="['w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500', {'border-red-500': validationErrors.name}]" />
                      <p v-if="validationErrors.name" class="text-red-500 text-xs mt-1">{{ validationErrors.name }}</p>
                  </div>

                  <div class="space-y-1">
                      <label for="email" class="text-sm font-semibold">Email *</label>
                      <input type="email" id="email" v-model="contact.email" required :class="['w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500', {'border-red-500': validationErrors.email}]" />
                      <p v-if="validationErrors.email" class="text-red-500 text-xs mt-1">{{ validationErrors.email }}</p>
                  </div>

                  <div class="space-y-1">
                      <label for="phone" class="text-sm font-semibold">Phone *</label>
                      <input type="text" id="phone" v-model="contact.phone" required :class="['w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500', {'border-red-500': validationErrors.phone}]" />
                      <p v-if="validationErrors.phone" class="text-red-500 text-xs mt-1">{{ validationErrors.phone }}</p>
                  </div>

                  <button type="submit" :disabled="cartLoading || cartItems.length === 0" class="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition duration-150 flex items-center justify-center">
                      <span v-if="cartLoading" class="animate-spin h-5 w-5 mr-2 border-b-2 border-white"></span> Place Order
                  </button>
              </form>

              <div v-if="bookingMessages.length > 0" class="mt-4">
                  <div v-for="(message, index) in bookingMessages" :key="index" :class="['p-2 rounded text-center', message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                      {{ message.message }}
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>


<script setup>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import Cookies from 'js-cookie';
  import { gql } from 'graphql-tag'
  import { useQuery, useMutation } from "@vue/apollo-composable"

  const store = useStore();
  const router = useRouter();

  const contact = ref({ name: '', email: '', phone: '' });
  const bookingMessages = ref([]);
  const validationErrors = ref({});

  const cartItems = computed(() => store.getters.cartItems);
  const totalPrice = computed(() => store.getters.totalPrice);
  const cartItemCount = computed(() => store.getters.cartItemCount);;

  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
  };

    const validateForm = () => {
        const errors = {};

        if (!contact.value.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!contact.value.email.trim()) {
            errors.email = 'Email is required';
        }

        if (!contact.value.phone.trim()) {
            errors.phone = 'Phone number is required';
        }

        validationErrors.value = errors;
        return Object.keys(errors).length === 0;
    };

    const clearError = () => {
        store.commit('setError', null);
    };

    const removeSeats = (eventId, seatIds) => {
        store.commit('removeSeatsFromCart', { eventId, seatIds });
    };

    const removeEventFromCart = (eventId) => {
        const item = cartItems.value.find(item => item.event.id === eventId);
        if (item) {
            store.commit('removeSeatsFromCart', {
                eventId,
                seatIds: item.seats.map(seat => seat.id)
            });
        }
    };

    const clearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            store.commit('clearCart');
        }
    };

    const scrollToCheckout = () => {
        document.getElementById('checkout').scrollIntoView({
            behavior: 'smooth'
        });
    };

    const BOOK_EVENTS_MUTATION = gql`
        mutation BookEvents($input: CreateBookingDto!) {
            createBooking(input: $input) {
                id
                userId
                guestName
                guestEmail
                phone
                totalPrice
            }
        }
    `;

    const { mutate: bookEvents } = useMutation(BOOK_EVENTS_MUTATION);

    const handleOrder = async () => {
        if (!validateForm()) {
            return;
        }

        try {
          const input =  {
              events: cartItems.value.map((booking) => ({
                  eventId: parseInt(booking.event.id, 10),
                  seats: booking.seats.map((seat) => parseInt(seat.id,10)),
                  quantity: booking.quantity,
              })),
              userId: parseInt(Cookies.get('userId'), 10) || null,
              guestName: contact.value.name,
              guestEmail: contact.value.email,
              phone: contact.value.phone,
        };

        const response = await bookEvents({ input: input });
        bookingMessages.value = [{
            success: "Order completed!",
            message: "Booked!"
        }];
        } catch (error) {
            console.error('Error booking events:', error);
            bookingMessages.value = [{
                success: false,
                message: 'An error occurred while booking events.'
            }];
        }
    }
</script>

  <style scoped>
  .badge {
    font-size: 0.9em;
  }

  .spinner-border {
    width: 1rem;
    height: 1rem;
  }

  .form-control.is-invalid {
    border-color: #dc3545;
    padding-right: calc(1.5em + 0.75rem);
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }
  </style>
