<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800 text-center">User Registration</h2>

    <form @submit="handleSubmit" class="space-y-4">
      <div>
        <input
          class="field border border-gray-300 rounded-md p-3 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="username"
          type="text"
          v-model="username"
          placeholder="Username"
        />
      </div>
      <div>
        <input
          class="field border border-gray-300 rounded-md p-3 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="email"
          type="text"
          v-model="email"
          placeholder="Email"
        />
      </div>
      <div>
        <input
          class="field border border-gray-300 rounded-md p-3 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="password"
          type="password"
          v-model="password"
          placeholder="Password"
        />
      </div>
      <div>
        <input
          class="field border border-gray-300 rounded-md p-3 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="confirm_password"
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm Password"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </form>

    <div v-if="messages.length !== 0" class="mt-6">
      <ul class="space-y-2">
        <li v-for="(message, index) in messages" :key="index" class="text-gray-600">
          {{ message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { REGISTER_USER } from "../graphql/authQueries"

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const messages = ref([])

const { mutate: register } = useMutation(REGISTER_USER)

async function handleSubmit(e) {
    e.preventDefault();

    if (!username.value) {
        alert("Username field should not be empty");
        return;
    }
    if (!email.value) {
        alert("Email field should not be empty");
        return;
    }
    if (!password.value) {
        alert("Password field should not be empty");
        return;
    }
    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.');
        return;
    }

    const userData = {
        username: username.value,
        email: email.value,
        password: password.value,
    };

    await fetchUserData(userData);
}

const fetchUserData = async (userData) => {
    try {
        const res = await register( {input: userData} );

        if (res.data?.register?.message) {
            messages.value.push(res.data.register.message);
        }
        router.push('/login');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        messages.value.push('Registration failed. Please try again later.');
    }
}
</script>

<style>
.field {
    margin: 10px 0;
    padding: 10px;
    border: 3px solid black;
    border-radius: 5px;
}
</style>
