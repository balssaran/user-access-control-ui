import React, { useEffect, useState, useRef } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import axios from "axios";
import { Container } from "reactstrap";

// Core components
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import PrivateRoute from "components/PrivateRoute";

// View components
import Dashboard from "views/Index.js";
import UserCreation from "views/examples/User.js";
import RoleMenuMapping from "views/examples/RoleMenu.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Menu from "views/examples/Menu.js";
import api from "components/api";
import { jwtDecode } from "jwt-decode";

// 🔹 Component mapping from string names returned by the API to actual components
const componentMap = {
  Dashboard,
  UserCreation,
  RoleMenuMapping,
  Register,
  Login,
  Menu,
};

const Admin = () => {
  const mainContent = useRef(null);
  const location = useLocation();
  const [routes, setRoutes] = useState([]);

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const userId = decoded.userid; // depends on your token structure
  // 🔹 Fetch dynamic routes from the backend
  const fetchRoutes = async () => {
    try {
      const res = await api.get(`users/${userId}/menu-info`, {
        headers: { Authorization: `Bearer ${token}` },
      }); // adjust URL as needed
      debugger;
      const dynamicRoutes = res.data.menu.map((r) => ({
        ...r,
        component: componentMap[r.component.replace(/\s+/g, "")], // map string name to actual component
      }));
      setRoutes(dynamicRoutes);
    } catch (err) {
      console.error("Failed to fetch routes", err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // 🔹 Render dynamic routes
  const getRoutes = (routes) =>
    routes.map((prop, key) =>
      prop.layout === "/admin" ? (
        <Route
          path={prop.path}
          element={
            <PrivateRoute>
              <prop.component />
            </PrivateRoute>
          }
          key={key}
        />
      ) : null
    );

  // 🔹 Get the page name based on route
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (path.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar brandText={getBrandText(location.pathname)} />
        <Routes>{getRoutes(routes)}</Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
