import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useUserStore } from "src/stores/useUserStore";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;
  const isProduction = process.env.NODE_ENV === "production";

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    base: isProduction ? "/virtual-kennel/" : "/",
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Router Guard to check for authentication
  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    try {
      userStore.setupAuthWatcher();
      if (
        to.matched.some((record) => record.meta?.requiresAuth) &&
        !userStore.isAuthenticated
      ) {
        next({ name: "login" });
      } else if (to.path == "/" && userStore.isAuthenticated) {
        next({ name: "dashboard" });
      } else {
        next(); // Allow navigation
      }
    } catch (error) {
      console.log(error);
      next({ name: "login" });
    }
  });
  return Router;
});
