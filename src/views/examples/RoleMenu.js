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

// reactstrap components
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Input,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Row,
  Col,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Plus, Edit2, Trash } from "react-feather";
import UserHeader from "components/Headers/Header.js";
import api from "components/api";

const RoleMenu = () => {
  const [roles, setRoles] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState({});
  const [newRoleName, setNewRoleName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState(new Set());
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleEnabled, setRoleEnabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [popuperrors, setPopupErrors] = useState({});
  const token = localStorage.getItem("token");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setNewRoleName("");
    setRoleDescription("");
    setSelectedRoleId(null); // Reset
    setRoleEnabled(true);
    setPopupErrors({});
  };

  /* const handleAddRole = () => {
    const trimmedRole = newRoleName.trim();
    if (trimmedRole && !roles.includes(trimmedRole)) {
      setRoles([...roles, trimmedRole]);
      setSelectedRole(trimmedRole);
      setSelectedMenus({});
      toggleModal();
    } else {
      alert("Role name is empty or already exists.");
    }
  }; */
  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const handleCheckboxChange = (menuId) => {
    setSelectedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleAddMapping = async () => {
    const newErrors = {};
    debugger;
    if (!selectedRole && selectedMenuIds.size <= 0) {
      newErrors.role = "Role is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // clear previous errors

    if (selectedRole && selectedMenuIds.size > 0) {
      try {
        await api.post(
          "/role-menu/create",
          {
            role: { id: selectedRoleId },
            menu: Array.from(selectedMenuIds),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(`Mapped role "${selectedRole}" to menus successfully.`);
      } catch (error) {
        console.error("Error mapping menus:", error);
        alert("Failed to map role to menus.");
      }
    }
  };

  const handleDeleteRole = async (role) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete role: ${role}?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/roles/delete/${selectedRoleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(roles.filter((r) => r !== role));
      setSelectedRole("");
      setSelectedMenus({});
      fetchRoles();
      alert("Role deleted successfully!");
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role.");
    }
  };
  useEffect(() => {
    debugger;
    if (selectedRole) {
      const selected = roles.find((r) => r.name === selectedRole);
      if (selected) {
        setNewRoleName(selected.name);
        setRoleDescription(selected.description || "");
        setSelectedRoleId(selected.id); // Save role ID

        setRoleEnabled(selected.enabled);
      }
    }

    fetchMenus(currentPage, pageSize);
  }, [isModalOpen, selectedRole, currentPage, pageSize]);

  const fetchMenus = async (page = 1, size = 5) => {
    try {
      const token = localStorage.getItem("token"); // if using auth
      const response = await api.get(
        `menu/list?page=${page - 1}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMenus(response.data.content); // Assuming response is an array of menus
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setCurrentPage(response.data.number + 1); // Spring returns 0-based
    } catch (error) {
      console.error("Failed to load menus:", error);
    }
  };

  const fetchMappedMenusForRole = async (role) => {
    try {
      const selected = roles.find((r) => r.name === role);

      const response = await api.get(
        `/role-menu/getMenuIdsByRole/${selected.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      debugger;
      const menuIdSet = new Set(response.data); // Convert to Set for easier lookup
      setSelectedMenuIds(menuIdSet);
    } catch (error) {
      console.error("Failed to fetch mapped menus for role:", error);
      setSelectedMenuIds(new Set()); // fallback to empty set
    }
  };

  const handleSaveRole = async () => {
    const trimmedRole = newRoleName.trim();
    const newErrors = {};

    if (!trimmedRole) {
      newErrors.role = "Role Name is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setPopupErrors(newErrors);
      return;
    }

    setPopupErrors({}); // clear previous errors

    const token = localStorage.getItem("token");

    try {
      if (!selectedRole) {
        // New Role
        await api.post(
          "/roles/create",
          {
            name: trimmedRole,
            description: roleDescription.trim(),
            enabled: true,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchRoles();
        setRoles([
          ...roles,
          { name: trimmedRole, description: roleDescription.trim() },
        ]);
        setSelectedRole(trimmedRole);
        alert("Role added successfully!");
      } else {
        debugger;
        // Update existing Role
        await api.put(
          `/roles/update/${selectedRoleId}`,
          {
            name: trimmedRole,
            description: roleDescription.trim(),
            enabled: roleEnabled,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchRoles();
        setRoles(
          roles.map((r) =>
            r.name === selectedRole
              ? { ...r, name: trimmedRole, description: roleDescription.trim() }
              : r
          )
        );
        setSelectedRole(trimmedRole);
        alert("Role updated successfully!");
      }
    } catch (error) {
      console.error("Error saving role:", error.response.data.message);
      alert("Failed to save role. " + error.response.data.message);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles/listAllActiveRoles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data); // assuming response.data is an array of roles
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Role Menu</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Role selection with Add button */}
                <Row className="mb-4 align-items-end">
                  <Col md="6">
                    <FormGroup>
                      <Label for="roleSelect">Select Role</Label>
                      <span style={{ color: "red" }}>*</span>
                      <div
                        className="d-flex align-items-start"
                        style={{ gap: "8px" }}
                      >
                        <div style={{ flexGrow: 1 }}>
                          <Input
                            id="roleSelect"
                            type="select"
                            className={`form-control w-100 ${
                              errors.role ? "is-invalid" : ""
                            }`}
                            value={selectedRole}
                            onChange={(e) => {
                              const role = e.target.value;
                              setSelectedRole(role);
                              setSelectedMenus({});
                              setSelectedMenuIds(new Set());
                              if (role) {
                                fetchMappedMenusForRole(role);
                              }
                            }}
                          >
                            <option value="">-- Select Role --</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.name}>
                                {role.name}
                              </option>
                            ))}
                          </Input>
                          {errors.role && (
                            <div className="invalid-feedback d-block">
                              {errors.role}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            width: "100px",
                            display: "flex",
                            marginLeft: "8px",
                            justifyContent: "space-between",
                          }}
                        >
                          {!selectedRole ? (
                            <Button
                              color="success"
                              className="d-flex align-items-center justify-content-center"
                              onClick={toggleModal}
                            >
                              <Plus size={18} />
                            </Button>
                          ) : (
                            <>
                              <Button
                                color="warning"
                                className="d-flex align-items-center justify-content-center"
                                onClick={toggleModal}
                              >
                                <Edit2 size={18} />
                              </Button>
                              <Button
                                color="danger"
                                className="d-flex align-items-center justify-content-center"
                                onClick={() => handleDeleteRole(selectedRole)}
                              >
                                <Trash size={18} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Menu checkbox grid */}
                {/* <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>
                        <Input
                          type="checkbox"
                          checked={
                            selectedRole &&
                            menus.every((menu) => selectedMenus[menu.id])
                          }
                          onChange={() => {
                            if (!selectedRole) return;
                            const allSelected = menus.every(
                              (menu) => selectedMenus[menu.id]
                            );
                            const updated = {};
                            menus.forEach((menu) => {
                              updated[menu.id] = !allSelected;
                            });
                            setSelectedMenus(updated);
                          }}
                          disabled={!selectedRole}
                        />
                      </th>
                      <th>Menu Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((menu) => (
                      <tr key={menu.id}>
                        <td>
                          <Input
                            type="checkbox"
                            checked={!!selectedMenus[menu.id]}
                            onChange={() => handleCheckboxChange(menu.id)}
                            disabled={!selectedRole}
                          />
                        </td>
                        <td>{menu.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table> */}
                <div className="col">
                  <Card className="shadow">
                    <CardHeader className="border-0">
                      <h3 className="mb-0">Menu List</h3>
                    </CardHeader>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th>
                            <Input
                              type="checkbox"
                              checked={
                                menus.length > 0 &&
                                menus.every((menu) =>
                                  selectedMenuIds.has(menu.id)
                                )
                              }
                              onChange={(e) => {
                                const newSet = new Set(selectedMenuIds);
                                if (e.target.checked) {
                                  menus.forEach((menu) => newSet.add(menu.id));
                                } else {
                                  menus.forEach((menu) =>
                                    newSet.delete(menu.id)
                                  );
                                }
                                setSelectedMenuIds(newSet);
                              }}
                            />
                          </th>
                          <th>Menu Name</th>
                          <th>Parent Menu</th>
                          <th>BackGround URL Path</th>
                          <th>UI URL Path</th>
                          <th>Display Order</th>
                          {/* <th>Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {menus.map((menu) => (
                          <tr key={menu.id}>
                            <td>
                              <Input
                                type="checkbox"
                                checked={selectedMenuIds.has(menu.id)}
                                onChange={() => {
                                  const newSet = new Set(selectedMenuIds);
                                  if (newSet.has(menu.id)) {
                                    newSet.delete(menu.id);
                                  } else {
                                    newSet.add(menu.id);
                                  }
                                  setSelectedMenuIds(newSet);
                                }}
                              />
                            </td>
                            <td>{menu.name}</td>
                            <td>
                              {menu.parentMenuid ? menu.parentMenuid.name : ""}
                            </td>
                            <td>{menu.backendPath}</td>
                            <td>{menu.frontendPath}</td>
                            <td>{menu.displayOrder}</td>
                            {/* <td>
                              <Button
                                color="info"
                                size="sm"
                                className="mr-2"
                                // onClick={() => handleEdit(menu)}
                              >
                                Edit
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                // onClick={() => handleDelete(menu.id)}
                              >
                                Delete
                              </Button>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <CardFooter className="py-4">
                      <nav aria-label="...">
                        <Pagination className="pagination justify-content-end mb-0">
                          <Label>Rows per page:</Label>
                          <Input
                            type="select"
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setCurrentPage(1); // Reset to first page
                            }}
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                          </Input>
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                  setCurrentPage(currentPage - 1);
                              }}
                            >
                              <i className="fas fa-angle-left" />
                            </PaginationLink>
                          </PaginationItem>

                          {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem
                              key={i}
                              active={i + 1 === currentPage}
                            >
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(i + 1);
                                }}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages)
                                  setCurrentPage(currentPage + 1);
                              }}
                            >
                              <i className="fas fa-angle-right" />
                            </PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      </nav>
                    </CardFooter>
                  </Card>
                </div>
                {/* Add Mapping Button */}
                <div className="mt-4 text-right">
                  <Button color="primary" size="sm" onClick={handleAddMapping}>
                    Add Mapping
                  </Button>
                </div>

                {/* Modal to add new role */}
                <Modal isOpen={isModalOpen} toggle={toggleModal}>
                  <ModalHeader toggle={toggleModal}>Add New Role</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label for="roleName">Role Name</Label>
                      <span style={{ color: "red" }}>*</span>
                      <Input
                        id="roleName"
                        type="text"
                        className={`${popuperrors.role ? "is-invalid" : ""}`}
                        placeholder="Enter role name"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveRole();
                          }
                        }}
                      />
                      {popuperrors.role && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {popuperrors.role}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="roleDescription">Description</Label>
                      <Input
                        id="roleDescription"
                        type="text"
                        placeholder="Enter role description"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <div className="custom-control custom-checkbox mt-4">
                        <Input
                          className="custom-control-input"
                          id="customCheck"
                          type="checkbox"
                          checked={roleEnabled}
                          onChange={(e) => setRoleEnabled(e.target.checked)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheck"
                        >
                          Active
                        </label>
                      </div>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleSaveRole}>
                      Save
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RoleMenu;
