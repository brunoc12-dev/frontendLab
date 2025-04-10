import { defineStore } from "pinia";
import api from "@/services/api";
import router from "@/router";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        user:JSON.parse(sessionStorage.getItem('user')) || null,
        token:sessionStorage.getItem('token') || null,
        loading:false,
        error:null
    }),
    getters:{
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.user
    },
    actions:{
        async login(credentials){
            this.loading = true;
            this.error = null;

            try {
                const response = await api.login(credentials);
                this.token = response?.data?.tokens?.access;
                this.user = response?.data?.user;
                sessionStorage.setItem('token', this.token);
                sessionStorage.setItem('user', JSON.stringify(this.user));
                router.push({name:'dashboard'});
            } catch (error) {
                this.error = error?.response?.data?.error || 'Error al iniciar sesión.';
            } finally{
                this.loading = false;
            }
        },
        async register(userData){
            this.loading = true;
            this.error = null;

            try {
                await api.register(userData);
                router.push({name:'login'});
            } catch (error) {
                console.log(error)
                this.error = error?.response?.data?.error || 'Error al registrarse.';
            } finally{
                this.loading = false;
            }
        },
        logout(){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this.token = null;
            this.user = null;
            router.push({name:'login'});
        },
        clearError(){
            this.error = null;
        }
    }
})