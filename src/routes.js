/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import User from "views/examples/User.js";
import RoleMenu from "views/examples/RoleMenu.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Menu from "views/examples/Menu.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },

  {
    path: "/usercreation",
    name: "User Creation",
    icon: "ni ni-single-02 text-yellow",
    component: User,
    layout: "/admin",
  },
  {
    path: "/menu",
    name: "Menu",
    icon: "ni ni-bullet-list-67 text-red",
    component: Menu,
    layout: "/admin",
  },
  {
    path: "/rolemenu",
    name: "Role Menu Mappng",
    icon: "ni ni-bullet-list-67 text-red",
    component: RoleMenu,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-bullet-list-67 text-red",
    component: Login,
    layout: "/auth",
  },
];
export default routes;
