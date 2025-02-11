<template>
    <div>
        <ul class="flex p-4 space-x-4 justify-end">
            <li><span>
                <router-link to="/">Events</router-link>
            </span></li>
            <li><span>
                <router-link to="/cart">Cart</router-link>
            </span></li>
            <li><span>
                <router-link to="/profile">Profile</router-link>
            </span></li>
            <li><span>
                <router-link to="/login">Login</router-link>
            </span></li>
            <li><span @click="handleLogout">
                Logout
            </span></li>
            <li class="pr-4"><span>
                <router-link to="/register">Registration</router-link>
            </span></li>
        </ul> 
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();
    function handleLogout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('jwtAdmin');
        router.push('/login');
    }
</script>

<style scoped>

</style>