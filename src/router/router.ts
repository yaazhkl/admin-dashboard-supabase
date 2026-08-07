import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Login from "../page/Login.vue";
import Dashboard from "../page/Dashboard.vue";
import Users from "../page/Users.vue";
import Departments from "../page/Departments.vue";
import Positions from "../page/Positions.vue";
import ActivityLog from "../page/ActivityLog.vue";
import Account from "../page/Account.vue";

const routes = [
    {
        path : '/',
        name : 'Login',
        component : Login
    }, {
        path : '/Dashboard',
        name : 'Dashboard',
        component : Dashboard,
        meta : {
            requiresAuth : true
        }
    }, {
        path : '/Users',
        name : 'Users',
        component : Users,
        meta : {
            requiresAuth : true
        }
    },
    {
        path : '/Departments',
        name : 'Departments',
        component : Departments,
        meta : {
            requiresAuth : true
        }
    },{
        path : '/Positions',
        name : 'Positions',
        component : Positions,
        meta : {
            requiresAuth : true
        }
    },{
        path : '/Logs',
        name : 'Logs',
        component : ActivityLog,
        meta : {
            requiresAuth : true
        }
    },{
        path : '/Account',
        name : 'Account',
        component : Account,
        meta : {
            requiresAuth : true
        }
    }
]

export const router = createRouter({
    history : createWebHistory(),
    routes,
});

router.beforeEach((to)=>{
    const currentUser = localStorage.getItem("currentUser");

    if(to.meta.requiresAuth && !currentUser){
        return{
            name : "Login"
        };
    }

    if(to.name === "Login" && currentUser){
        return{
            name : "Dashboard"
        }
    }
});