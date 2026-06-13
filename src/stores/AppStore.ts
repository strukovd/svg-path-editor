import { defineStore } from 'pinia';
// import { ModalModel } from '@/plugins/modal';

export const useAppStore = defineStore('app', () => {
	const loading = true;

	return {
		loading
	};
});