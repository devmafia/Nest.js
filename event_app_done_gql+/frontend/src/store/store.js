import { createStore } from 'vuex';

const saveCartToLocalStorage = (state) => {
  console.log(state);
  localStorage.setItem('cart', JSON.stringify(state));
};

export default createStore({
  state: {
    cart: {
      items: [],
      totalPrice: 0,
      selectedSeats: []
    }
  },
  mutations: {
    addToCart(state, { event, seats, price }) {
      const existingItem = state.cart.items.find(item => item.event.id === event.id);

      if (existingItem) {
        seats.forEach(seat => {
          if (!existingItem.seats.some(s => s.id === seat.id)) {
            existingItem.seats.push(seat);
          }
        });
        existingItem.quantity = existingItem.seats.length;
      } else {
        state.cart.items.push({
          event,
          seats: [...seats],
          quantity: seats.length
        });
      }

      state.cart.totalPrice = state.cart.items.reduce((total, item) => {
        return total + (item.event.price * item.seats.length);
      }, 0);

      saveCartToLocalStorage(state.cart);
    },
    setSelectedSeats(state, seats) {
      state.cart.selectedSeats = seats;
    },
    clearCart(state) {
      state.cart.items = [];
      state.cart.totalPrice = 0;
      state.cart.selectedSeats = [];
      saveCartToLocalStorage(state.cart);
    },
    removeSeatsFromCart(state, { eventId, seatIds }) {
      const item = state.cart.items.find(item => item.event.id === eventId);
      
      if (item) {
        item.seats = item.seats.filter(seat => !seatIds.includes(seat.id));
        item.quantity = item.seats.length;
  
        if (item.seats.length === 0) {
          state.cart.items = state.cart.items.filter(item => item.event.id !== eventId);
        }
  
        state.cart.totalPrice = state.cart.items.reduce((total, item) => {
          return total + (item.event.price * item.seats.length);
        }, 0);
  
        saveCartToLocalStorage(state.cart);
      }
    },
    loadCartFromStorage(state) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart  && savedCart !== "undefined") {
        const parsedCart = JSON.parse(savedCart);
        state.cart.items = parsedCart.items || [];
        state.cart.totalPrice = parsedCart.totalPrice || 0;
        state.cart.selectedSeats = parsedCart.selectedSeats;
      }
      return;
    },
  },
  getters: {
    cartItems: state => state.cart.items,
    totalPrice: state => state.cart.totalPrice,
    selectedSeats: state => state.cart.selectedSeats,
    calculateTotalPrice: state => {
      return state.cart.selectedSeats.length * (state.cart.items[0]?.event.price || 0);
    },
    isInCart: state => (eventId, seatId) => {
      const item = state.cart.items.find(item => item.event.id === eventId);
      return item ? item.seats.some(seat => seat.id === seatId) : false;
    }
  }
});
