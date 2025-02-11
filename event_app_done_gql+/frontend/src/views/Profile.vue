<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="container mx-auto max-w-4xl space-y-6">
      <!-- Personal Information Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-center mb-4">
          <UserIcon class="mr-3 text-blue-500" :size="24" />
          <h3 class="text-xl font-semibold text-gray-800">Personal Information</h3>
        </div>

        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="flex-grow text-gray-700">
              <strong>Username:</strong> {{ userData.username }}
            </span>
            <input
              v-if="editingUsername"
              v-model="usernameInput"
              class="border border-gray-300 rounded-md px-2 py-1 mr-2"
              placeholder="New username"
            />
            <button
              @click="toggleUsernameEdit"
              class="text-blue-500 hover:text-blue-600"
            >
              {{ editingUsername ? 'Cancel' : 'Edit' }}
            </button>
            <button
              v-if="editingUsername"
              @click="handleEditUsername"
              class="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <span class="flex-grow text-gray-700">
              <strong>Email:</strong> {{ userData.email }}
            </span>
            <input
              v-if="editingEmail"
              v-model="emailInput"
              class="border border-gray-300 rounded-md px-2 py-1 mr-2"
              placeholder="New email"
            />
            <button
              @click="toggleEmailEdit"
              class="text-blue-500 hover:text-blue-600"
            >
              {{ editingEmail ? 'Cancel' : 'Edit' }}
            </button>
            <button
              v-if="editingEmail"
              @click="handleEditEmail"
              class="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-center mb-4">
          <LockIcon class="mr-3 text-blue-500" :size="24" />
          <h3 class="text-xl font-semibold text-gray-800">Change Password</h3>
        </div>

        <div class="space-y-4">
          <input
            type="password"
            v-model="password"
            placeholder="New Password"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-200"
          />
          <button
            @click="handleEditPassword"
            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-center mb-4">
          <TicketIcon class="mr-3 text-blue-500" :size="24" />
          <h3 class="text-xl font-semibold text-gray-800">Your Bookings</h3>
        </div>

        <div v-if="userBookings.length === 0" class="text-center text-gray-500">
          No bookings yet
        </div>

        <div v-for="booking in userBookings" :key="booking.id" class="mb-6 last:mb-0">
          <div class="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold text-gray-800">Booking #{{ booking.id }}</h4>
              <button
                @click="handleDeleteBooking(booking.id)"
                class="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2Icon :size="20" />
              </button>
            </div>

            <div
              v-for="event in booking.events"
              :key="event.id"
              class="flex space-x-4 mb-4 pb-4 border-b border-gray-200 last:border-b-0"
            >
              <img
                :src="`http://localhost:5000${event.image}`"
                :alt="event.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div class="flex-grow">
                <h5 class="text-lg font-semibold text-gray-800">{{ event.title }}</h5>
                <p class="text-gray-600">
                  {{ new Date(event.date).toLocaleDateString() }} | ${{ event.price }}
                </p>
                <p class="text-gray-500 mt-2">{{ event.description }}</p>

                <div class="mt-2">
                  <strong class="text-gray-700">Seats:</strong>
                  <div class="flex space-x-2 mt-1">
                    <span
                      v-for="seat in booking.seats"
                      :key="seat.id"
                      class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                    >
                      {{ seat.seatNumber }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
          @click="handleDeleteUser"
          class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto space-x-2"
        >
          <Trash2Icon />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import {
  FETCH_USER_DATA,
  FETCH_USER_BOOKINGS,
  UPDATE_USERNAME,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  DELETE_USER,
  DELETE_BOOKING
} from '../graphql/profileQueries';
import Cookies from 'js-cookie';
import {
  User as UserIcon,
  Lock as LockIcon,
  Ticket as TicketIcon,
  Trash2 as Trash2Icon
} from 'lucide-vue-next';

const userId = parseInt(Cookies.get('userId'), 10);
const userToken = localStorage.getItem('jwt');

const userData = ref({});
const userBookings = ref([]);

const editingUsername = ref(false);
const editingEmail = ref(false);
const usernameInput = ref('');
const emailInput = ref('');

const password = ref('');
const confirmPassword = ref('');

const { onResult: userDataResponse } = useQuery(
  FETCH_USER_DATA,
  () => ({ id: userId }),
  () => ({
    context: {
      headers: {
        Authorization: userToken ? `Bearer ${userToken}` : undefined
      }
    }
  })
);

const { onResult: bookingsData } = useQuery(
  FETCH_USER_BOOKINGS,
  () => ({ id: userId }),
  () => ({
    context: {
      headers: {
        Authorization: userToken ? `Bearer ${userToken}` : undefined
      }
    }
  })
);

const { mutate: updateUsername } = useMutation(UPDATE_USERNAME, () => ({
  context: {
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : undefined
    }
  }
}));

const { mutate: updateEmail } = useMutation(UPDATE_EMAIL, () => ({
  context: {
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : undefined
    }
  }
}));

const { mutate: updatePassword } = useMutation(UPDATE_PASSWORD, () => ({
  context: {
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : undefined
    }
  }
}));

const { mutate: deleteUser } = useMutation(DELETE_USER, () => ({
  context: {
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : undefined
    }
  }
}));

const { mutate: deleteBooking } = useMutation(DELETE_BOOKING, () => ({
  context: {
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : undefined
    }
  }
}));

onMounted(() => {
  userDataResponse((result) => {
    if (result.data?.getUserdata.user) {
      userData.value = result.data.getUserdata.user;
    }
  });

  bookingsData((result) => {
    if (result.data?.getBookings) {
      userBookings.value = result.data.getBookings;
    }
  });
});

const toggleUsernameEdit = () => {
  editingUsername.value = !editingUsername.value;
  usernameInput.value = userData.value.username;
};

const toggleEmailEdit = () => {
  editingEmail.value = !editingEmail.value;
  emailInput.value = userData.value.email;
};

const handleEditUsername = async () => {
  try {
    const { data } = await updateUsername({
      variables: {
        id: parseInt(userData.value.id),
        username: usernameInput.value
      }
    });
    if (data?.updateUsername?.user) {
      userData.value = { ...userData.value, username: data.updateUsername.user.username };
      editingUsername.value = false;
    }
  } catch (error) {
    console.error('Update username error:', error);
  }
};

const handleEditEmail = async () => {
  try {
    const { data } = await updateEmail({
      variables: {
        id: parseInt(userData.value.id),
        email: emailInput.value
      }
    });
    if (data?.updateEmail?.user) {
      userData.value = { ...userData.value, email: data.updateEmail.user.email };
      editingEmail.value = false;
    }
  } catch (error) {
    console.error('Update email error:', error);
  }
};

const handleEditPassword = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    await updatePassword({
      variables: {
        id: parseInt(userData.value.id),
        password: password.value
      }
    });
    alert("Password updated successfully");
    confirmPassword.value = '';
  } catch (error) {
    console.error('Update password error:', error);
  }
};

const handleDeleteUser = async () => {
  try {
    await deleteUser({
      variables: {
        userId: parseInt(userData.value.id)
      }
    });
    router.push('/events');
  } catch (error) {
    console.error('Delete user error:', error);
  }
};

const handleDeleteBooking = async (bookingId) => {
  try {
    await deleteBooking({
      variables: {
        bookingId: parseInt(bookingId)
      }
    });
    userBookings.value = userBookings.value.filter(b => b.id !== bookingId);
  } catch (error) {
    console.error('Delete booking error:', error);
  }
};
</script>
