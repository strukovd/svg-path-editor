// import { UserModel } from '@/types/UserModel';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		id: 0,
		username: '',
		fullname: '',
		image_key: '',
	}),  // as UserModel),
	getters: {},
	actions: {}
});