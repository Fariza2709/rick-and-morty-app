import { createRouter, createWebHistory } from 'vue-router';
import routes from '../router/index';
import { RouterLinkStub } from '@vue/test-utils';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

global.router = router;
global.RouterLinkStub = RouterLinkStub;
