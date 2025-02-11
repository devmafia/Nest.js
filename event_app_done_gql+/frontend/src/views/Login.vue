<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input
          class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="username"
          type="text"
          v-model="username"
          required
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="email"
          type="email"
          v-model="email"
          required
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="password"
          type="password"
          v-model="password"
          required
        />
      </div>
      <div>
        <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          class="field border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
          name="confirm_password"
          type="password"
          v-model="confirmPassword"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </form>

    <div v-if="messages.length > 0" class="mt-6">
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
import Cookie from 'js-cookie';
import { useMutation } from '@vue/apollo-composable';
import { LOGIN_USER } from "../graphql/authQueries"

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const messages = ref([]);

const { mutate: login } = useMutation(LOGIN_USER);

async function handleSubmit() {
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!username.value) {
    alert('Username field should not be empty');
    return;
  }
  if (!email.value) {
    alert('Invalid email format');
    return;
  }
  if (!password.value) {
    alert('Password must be at least 8 characters long and contain at least one letter and one number');
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const res = await login({
        input: {
          username: username.value,
          email: email.value,
          password: password.value
        }
    });
    console.log(res)
    if (res.data) {
      const data = res.data;
      if (data.login.token) {
        localStorage.setItem('jwt', data.login.token);
        Cookie.set('userId', data.login.userId);
        router.push('/');
      }
      if (data.login.message) {
        messages.value.push(data.login.message);
      }
    }
  } catch (error) {
    console.error('Error occurred during login:', error);
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(err => console.error('GraphQL Error:', err));
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
    messages.value.push('An error occurred during login.');
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
