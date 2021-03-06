import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'
import AuthService from './services/auth'

/*
 |--------------------------------------------------------------------------
 | Admin Views
 |--------------------------------------------------------------------------|
 */


//Layouts
import LayoutHorizontal from './views/layouts/LayoutHorizontal.vue'
import LayoutFront from './views/layouts/LayoutFront.vue'
import LayoutLogin from './views/layouts/LayoutLogin.vue'


//Auth
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import Profile from './views/admin/Profile.vue'

// User Management
import AllUsers from './views/admin/users/Index.vue'
import ShowUser from './views/admin/users/Show.vue'
import AddUser from './views/admin/users/AddUser.vue'
import updateUser from './views/admin/users/UpdateUser.vue'
import DeletedUsers from './views/admin/users/DeletedUsers.vue'
import NotFoundPage from './views/errors/404.vue'

/*
 |--------------------------------------------------------------------------
 | Frontend Views
 |--------------------------------------------------------------------------|
 */

import Home from './views/front/Home.vue'

Vue.use(VueRouter)

const routes = [
    
    /*
     |--------------------------------------------------------------------------
     | Layout Routes for DEMO
     |--------------------------------------------------------------------------|
     */



    /*
     |--------------------------------------------------------------------------
     | Frontend Routes
     |--------------------------------------------------------------------------|
     */

    {
        path: '/', component: LayoutLogin,
        children: [
            {
                path: '/',
                component: Login,
                name: 'front'
            },
            {
                path: '/home',
                component: Login,
                name: 'home'
            },
        ]
    },

    /*
     |--------------------------------------------------------------------------
     | Admin Backend Routes
     |--------------------------------------------------------------------------|
     */
    {
        path: '/campaigns', component: LayoutHorizontal,  // Change the desired Layout here
        meta: { requiresAuth: true },
        children: [

            {
                path: '/campaigns',
                name: 'campaigns.index',
                component: require('./views/admin/campaigns/Index.vue'),
                meta: {
                title: 'Klaviyo Campaigns',
                breadcrumb: 'Campaigns'
                },
            },
            {
                path: '/campaign/:id',
                name: 'campaigns.show',
                component: require('./views/admin/campaigns/Show.vue'),
                keepAlive: true,
                meta: {
                breadcrumb: 'Campaign'
                },
            },
            
        ]
    },
    {
        path: '/flows', component: LayoutHorizontal,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/flows',
                name: 'flows.index',
                component: require('./views/admin/flows/Index.vue'),
                meta: {
                title: 'Klaviyo Flows',
                breadcrumb: 'Flows'
                },
            },
            {
                path: '/flow/:id',
                name: 'flows.show',
                component: require('./views/admin/flows/Show.vue'),
                meta: {
                title: 'Klaviyo Flow',
                breadcrumb: 'Flow'
                },
            },
        
        ]
    },
    {
        path: '/calculator', component: LayoutHorizontal,  // Change the desired Layout here
        meta: { requiresAuth: true },
        children: [

            {
                path: '/',
                name: 'calculator',
                component: require('./views/admin/calculator/Show.vue'),
                meta: {
                title: 'Calculator',
                breadcrumb: 'Calculator'
                },
            }
            
        ]
    },
    {
        path: '/profile', component: LayoutHorizontal,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/',
                component: Profile,
                name: 'profile'
            }
            
        ]
    },
    {
        path: '/users', component: LayoutHorizontal,
        meta: { isAdmin: true},
        children: [
            {
                path: '/users',
                name: 'users.index',
                component: AllUsers,
                meta: {
                title: 'All Users',
                breadcrumb: 'Users'
                },
            },
            {
                path: '/user/create',
                name: 'users.create',
                component: AddUser,
                meta: {
                title: 'Create New User',
                breadcrumb: 'Add User'
                },
            },
            {
                path: '/user/edit/:id',
                name: 'users.edit',
                component: updateUser,
                meta: {
                title: 'Edit User',
                breadcrumb: 'Edit User'
                },
            },
            {
                path: '/users/deleted',
                name: 'users.deleted',
                component: DeletedUsers,
                meta: {
                title: 'Deleted Users',
                breadcrumb: 'Deleted Users'
                },
            },
            {
                path: '/user/:id',
                name: 'users.show',
                component: ShowUser,
                meta: {
                title: 'Show User',
                breadcrumb: 'User'
                },
            },
        
        ]
    },
    

    /*
     |--------------------------------------------------------------------------
     | Auth & Registration Routes
     |--------------------------------------------------------------------------|
     */

    {
        path: '/', component: LayoutLogin,
        children: [
            {
                path: 'login',
                component: Login,
                name: 'login'
            },
            {
                path: 'register',
                component: Register,
                name: 'register'
            },
        ]
    },
    

    // DEFAULT ROUTE
    {   path: '*', component : NotFoundPage }
]

const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    
    // If the next route is requires user to be Logged IN
    if (to.matched.some(m => m.meta.requiresAuth)){

        return AuthService.check().then(authenticated => {
            if(!authenticated){
                return next({ path : '/login'})
            }
            // We check if the auth Object is Empty 
            // If it is Empty we Dispatch An Event to Get Auth User
            if(_.isEmpty(store.getters.getAuthUser)){
                store.dispatch('setAuthUser')
            }
            
            return next()
        })
    }
    if (to.matched.some(m => m.meta.isAdmin)){
    return AuthService.checkIsAdmin().then(admin => {
            if(!admin){
                return next({ path : '/campaigns'})
            }
            return next()
        })
    }

    return next()
});

export default router