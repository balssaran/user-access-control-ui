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
import {
  Button,
  Card,
  Badge,
  CardHeader,
  CardBody,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Media,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Row,
  Col,
  Label,
  UncontrolledTooltip,
} from "reactstrap";

import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
// core components
import UserHeader from "components/Headers/Header.js";
import api from "components/api";

const Profile = () => {
  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // const initialFormData = useState({
  //   userId: null, // 👈 Add this line
  //   username: "",
  //   firstname: "",
  //   lastname: "",
  //   email: "",
  //   role: { id: null, name: "" },
  //   branch: { id: null, name: "" },
  //   gender: "",
  //   enabled: true,
  //   mfaEnabled: false,
  //   mfaMethod: "",
  //   createBy: "",
  // });

  const [formData, setFormData] = useState({
    userId: null, // 👈 Add this line
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    role: { id: null, name: "" },
    branch: { id: null, name: "" },
    gender: "",
    enabled: true,
    mfaEnabled: false,
    mfaMethod: "",
    createBy: "",
  });

  const [roleList, setRoleList] = useState([]);
  const [branchList, setBranchList] = useState([]);

  const [userList, setUserList] = useState([]);

  const handleEdit = (user) => {
    debugger;
    setFormData({
      userId: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      branch: user.branch,
      gender: user.gender,
      enabled: user.enabled,
      mfaEnabled: user.mfaEnabled,
      mfaMethod: user.mfaMethod,
      createBy: user.createBy,
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`users/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user.");
    }
  };

  const fetchUsers = async (page = 1, size = 5) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `users/list?page=${page - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      debugger;
      setUserList(response.data.content); // Assuming response is an array of users
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setCurrentPage(response.data.number + 1); // Spring returns 0-based
    } catch (error) {
      debugger;
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    debugger;

    const fetchRolesAndBranches = async () => {
      try {
        const [roleRes, branchRes] = await Promise.all([
          api.get("roles/listAllRoles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("branch/list", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        debugger;
        setRoleList(roleRes.data);
        setBranchList(branchRes.data);
        debugger;
      } catch (error) {
        console.error("Failed to load roles/branches:", error);
      }
    };

    fetchRolesAndBranches();
  }, []);

  const handleClear = () => {
    debugger;
    setFormData({
      userId: null, // 👈 Add this line
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      role: { id: null, name: "" },
      branch: { id: null, name: "" },
      gender: "",
      enabled: true,
      mfaEnabled: false,
      mfaMethod: "",
      createBy: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      debugger;
      const decoded = jwtDecode(token);
      const userId = decoded.userid; // depends on your token structure
      console.log("User ID from token:", userId);
      formData.createBy = userId;

      try {
        debugger;
        let response = {};
        if (formData.userId == null || formData.userId === 0) {
          response = await api.post("users/create", formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          response = await api.put(
            `users/update/${formData.userId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        fetchUsers();
        handleClear();
        alert("User saved successfully!");
        debugger;

        console.log("User saved:", response.data);
      } catch (error) {
        debugger;
        if (
          error.response &&
          error.response.data &&
          error.response.data.validationErrors
        ) {
          const validationErrors = error.response.data.validationErrors;
          console.error("Validation Errors:", validationErrors);

          // Optionally, display them in alert or on the form
          alert("Validation failed: " + JSON.stringify(validationErrors));
        } else if (error.response.data.fieldErrors) {
          alert(
            "Validation failed: " +
              JSON.stringify(error.response.data.fieldErrors)
          );
        } else {
          console.error("Error saving user:", error);
          alert("Failed to save user.");
        }
      }
    }
  };
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">User Creation</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-username">Username</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Username"
                            type="text"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-email">Email</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-first-name">First Name</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="First Name"
                            type="text"
                            value={formData.firstname}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstname: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-last-name">Last Name</Label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="Last Name"
                            type="text"
                            value={formData.lastname}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastname: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-role">Role</Label>
                          <Input
                            type="select"
                            value={JSON.stringify(formData.role)}
                            onChange={(e) => {
                              const selectedRole = JSON.parse(e.target.value);
                              setFormData({
                                ...formData,
                                role: selectedRole,
                              });
                            }}
                          >
                            <option value="">Select Role</option>
                            {roleList.map((role) => (
                              <option
                                key={role.id}
                                value={JSON.stringify(role)}
                              >
                                {role.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-branch">Branch</Label>
                          <Input
                            type="select"
                            value={JSON.stringify(formData.branch)}
                            onChange={(e) => {
                              const selectedBranch = JSON.parse(e.target.value);
                              setFormData({
                                ...formData,
                                branch: selectedBranch,
                              });
                            }}
                          >
                            <option value="">Select Branch</option>
                            {branchList.map((branch) => (
                              <option
                                key={branch.id}
                                value={JSON.stringify(branch)}
                              >
                                {branch.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-gender">Gender</Label>
                          <Input
                            type="select"
                            id="input-gender"
                            value={formData.gender}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            checked={formData.mfaEnabled}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mfaEnabled: e.target.checked,
                              })
                            }
                          />
                          <label className="form-check-label ml-2">
                            MFA Enabled
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col lg="6">
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            checked={formData.enabled}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                enabled: e.target.checked,
                              })
                            }
                          />
                          <label className="form-check-label ml-2">
                            Active
                          </label>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-mfa-method">MFA Method</Label>
                          <Input
                            type="select"
                            value={formData.mfaMethod}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mfaMethod: e.target.value,
                              })
                            }
                          >
                            <option value="">Select MFA Method</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="app">Authenticator App</option>
                          </Input>
                        </FormGroup>
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
                            <h3 className="mb-0">Users List</h3>
                          </CardHeader>
                          <Table
                            className="align-items-center table-flush"
                            responsive
                          >
                            <thead className="thead-light">
                              <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Role</th>
                                <th>Branch</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userList.map((user) => (
                                <tr key={user.id}>
                                  <td>{user.username}</td>
                                  <td>{user.email}</td>
                                  <td>{user.firstname}</td>
                                  <td>{user.lastname}</td>
                                  <td>{user.role.name}</td>
                                  <td>{user.branch.name}</td>
                                  <td>
                                    <Button
                                      color="info"
                                      size="sm"
                                      className="mr-2"
                                      onClick={() => handleEdit(user)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleDelete(user.id)}
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

export default Profile;
