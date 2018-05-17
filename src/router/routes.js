import DashboardLayout from "../layout/dashboard/DashboardLayout.vue"
import NotFound from "../pages/NotFoundPage.vue"
import Dashboard from "../pages/Dashboard.vue"
import Organize from "../pages/Organize.vue"
import Login from "../pages/Login.vue"

import store from "../config/store"

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "calendrier",
        component: Dashboard
      },
      {
        path: "organize",
        name: "organiser",
        component: Organize
      }
    ],

    beforeEnter(to, from, next) {
      if (localStorage.getItem(store.localKey)) {
        store.user = JSON.parse(localStorage.getItem(store.localKey)).user
        store.events = JSON.parse(localStorage.getItem(store.localKey)).events
      }
      if (store.user && store.user.loggedIn) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/login',
    component: Login
  },

  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
