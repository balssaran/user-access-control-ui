import React, { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Pagination,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Button,
  Table,
  PaginationItem,
  PaginationLink,
  Label,
} from "reactstrap";
import UserHeader from "components/Headers/Header.js";
import api from "components/api";
import { jwtDecode } from "jwt-decode";

const Menu = () => {
  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [menuList, setMenuList] = useState([]);

  // const [menuName, setMenuName] = useState("");
  // const [parentMenu, setParentMenu] = useState("");
  // const [backgroundUrlPath, setBackgroundUrlPath] = useState("");
  // const [uiUrlPath, setUiUrlPath] = useState("");
  // const [displayOrder, setDisplayOrder] = useState("");
  // const [isActive, setIsActive] = useState(true);
  const [parentMenuOptions, setParentMenuOptions] = useState([]);
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    parentMenuid: null,
    backendPath: "",
    frontendPath: "",
    displayOrder: null,
    enabled: true,
    createBy: null,
  });

  const handleClear = () => {
    debugger;
    setFormData({
      id: null,
      name: "",
      parentMenuid: null,
      backendPath: "",
      frontendPath: "",
      displayOrder: "",
      enabled: true,
      createBy: null,
    });
  };
  useEffect(() => {
    const fetchParentMenus = async () => {
      try {
        const response = await api.get("menu/parentmenulist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allMenus = response.data;
        const filteredMenus = formData.id
          ? allMenus.filter((menu) => menu.id !== formData.id)
          : allMenus;
        setParentMenuOptions(filteredMenus);
      } catch (error) {
        console.error("Error fetching parent menus:", error);
      }
    };

    fetchParentMenus();
  }, [token, formData.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Menu Name is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // clear previous errors
    // const newMenu = {
    //   name: menuName,
    //   parentId: parentMenu || null,
    //   backendPath: backgroundUrlPath,
    //   frontendPath: uiUrlPath,
    //   displayOrder,
    //   enabled: isActive,
    // };
    if (token) {
      debugger;
      const decoded = jwtDecode(token);
      const userId = decoded.userid; // depends on your token structure
      console.log("User ID from token:", userId);
      formData.createBy = userId;
      let response = {};
      if (formData.id == null || formData.id === 0) {
        try {
          await api.post("menu/create", formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message || "Error saving menu.";
          console.error("Error saving menu:", errorMessage);
          alert(errorMessage);
        }
      } else {
        try {
          await api.put(`menu/update/${formData.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message || "Error saving menu.";
          console.error("Error saving menu:", errorMessage);
          alert(errorMessage);
        }
      }
      alert("Menu saved successfully!");
      fetchMenus(); // Refresh list
      handleClear();
    }
  };

  const handleEdit = (menu) => {
    debugger;
    setFormData({
      id: menu.id,
      name: menu.name,
      parentMenuid: menu.parentMenuid,
      backendPath: menu.backendPath,
      frontendPath: menu.frontendPath,
      displayOrder: menu.displayOrder,
      enabled: menu.enabled,

      createBy: menu.createBy,
    });
  };

  const handleDelete = async (menuId) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;

    try {
      await api.delete(`menu/delete/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Menu deleted successfully");
      fetchMenus(); // Refresh list
    } catch (error) {
      console.error("Delete failed:", error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const fetchMenus = async (page = 1, size = 5) => {
    try {
      const response = await api.get(
        `menu/list?page=${page - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      debugger;
      setMenuList(response.data.content); // Assuming response is an array of users
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setCurrentPage(response.data.number + 1); // Spring returns 0-based
    } catch (error) {
      debugger;
      console.error("Failed to fetch menus:", error);
    }
  };
  useEffect(() => {
    fetchMenus(currentPage, pageSize);
  }, [currentPage, pageSize]);
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
                    <h3 className="mb-0">Menu</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSave}>
                  <h6 className="heading-small text-muted mb-4">
                    Menu information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-menuname"
                          >
                            Menu Name<span style={{ color: "red" }}>*</span>
                          </label>

                          <Input
                            className={`form-control-alternative ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            id="input-menuname"
                            placeholder="Menu Name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              })
                            }
                          />
                          {errors.name && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.name}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-role">Parent Menu</Label>
                          <Input
                            type="select"
                            value={formData.parentMenuid?.id || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              if (!selectedId) {
                                // If nothing is selected, set to null
                                setFormData({
                                  ...formData,
                                  parentMenuid: null,
                                });
                              } else {
                                const selectedMenu = parentMenuOptions.find(
                                  (menu) => menu.id === parseInt(selectedId, 10)
                                );
                                setFormData({
                                  ...formData,
                                  parentMenuid: selectedMenu,
                                });
                              }
                            }}
                          >
                            <option value="">Select Parent Menu</option>
                            {parentMenuOptions.map((menu) => (
                              <option key={menu.id} value={menu.id}>
                                {menu.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-background-url-path"
                          >
                            Background URL Path (Java API)
                          </label>
                          <Input
                            id="input-background-url-path"
                            placeholder="/api/admin/users"
                            type="text"
                            value={formData.backendPath}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                backendPath: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-ui-url-path"
                          >
                            UI URL Path (React Route)
                          </label>
                          <Input
                            id="input-ui-url-path"
                            placeholder="/admin/users"
                            type="text"
                            value={formData.frontendPath}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                frontendPath: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-display-order"
                          >
                            Display Order
                          </label>
                          <Input
                            id="input-display-order"
                            placeholder="0"
                            type="text"
                            value={formData.displayOrder}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                displayOrder: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <div className="custom-control custom-checkbox mt-4">
                          <input
                            className="custom-control-input"
                            id="customCheck1"
                            type="checkbox"
                            checked={formData.enabled}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                enabled: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheck1"
                          >
                            Active
                          </label>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col className="text-right" lg="12">
                        <Button color="primary" onClick={handleSave}>
                          Save
                        </Button>
                        <Button color="secondary" onClick={handleClear}>
                          Cancel
                        </Button>
                      </Col>
                    </Row>

                    <br />
                    <Row>
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
                                <th>Menu Name</th>
                                <th>Parent Menu</th>
                                <th>BackGround URL Path</th>
                                <th>UI URL Path</th>

                                <th>Display Order</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {menuList.map((menu) => (
                                <tr key={menu.id}>
                                  <td>{menu.name}</td>
                                  <td>
                                    {menu.parentMenuid
                                      ? menu.parentMenuid.name
                                      : ""}
                                  </td>
                                  <td>{menu.backendPath}</td>
                                  <td>{menu.frontendPath}</td>
                                  <td>{menu.displayOrder}</td>

                                  <td>
                                    <Button
                                      color="info"
                                      size="sm"
                                      className="mr-2"
                                      onClick={() => handleEdit(menu)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleDelete(menu.id)}
                                    >
                                      Delete
                                    </Button>
                                  </td>
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

                                <PaginationItem
                                  disabled={currentPage === totalPages}
                                >
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
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Menu;
