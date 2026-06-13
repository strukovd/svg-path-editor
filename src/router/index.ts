import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainPage from '../components/pages/MainPage.vue';

const routes: Array<RouteRecordRaw> = [
	{
		name: `MainPage`,
		path: `/`,
		component: MainPage
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

export default router;
