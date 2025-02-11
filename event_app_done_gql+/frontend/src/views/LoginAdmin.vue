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
import { LOGIN_ADMIN } from "../graphql/authQueries"

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const messages = ref([]);

const { mutate } = useMutation(LOGIN_ADMIN);

async function handleSubmit(e) {
  e.preventDefault();

  if (!username.value) {
    alert("Username field should be not empty");
    return;
  }
  if (!email.value) {
    alert("Email field should be not empty");
    return;
  }
  if (!password.value) {
    alert("Password field should be not empty");
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
    const res = await mutate( {input: userData} );
    const data = res.data;
    localStorage.setItem('jwtAdmin', data.login.token);
    if (data.login.message) {
      messages.value.push(data.login.message);
    }
    router.push('/panel');
  } catch (error) {
    console.error('There was a problem with the mutation:', error);
  }
};
</script>

<style>
.field {
  margin: 10px 0;
  padding: 10px;
  border: 3px solid black;
  border-radius: 5px;
}
</style>
