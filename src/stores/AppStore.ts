import { defineStore } from 'pinia';
// import { ModalModel } from '@/plugins/modal';

export const useAppStore = defineStore('app', {
	state: () => ({
		loading: true,

		// modals: [] as ModalModel[],

		// snackbar: {
		// 	show: false,
		// 	msg: '',
		// 	color: '',
		// 	icon: ''
		// } as SnackbarPayload
	}),
});