import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainView from '../components/pages/MainView.vue';

const routes: Array<RouteRecordRaw> = [
	{
		name: `MainView`,
		path: `/`,
		component: MainView
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

export default router;
