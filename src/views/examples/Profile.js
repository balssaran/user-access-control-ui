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
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Label,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/Header.js";

const Profile = () => {
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
                    <h3 className="mb-0">User Profile</h3>
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
                            className="form-control-alternative"
                            id="input-role"
                          >
                            <option>User</option>
                            <option>Admin</option>
                            <option>Manager</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-branch">Branch</Label>
                          <Input
                            type="select"
                            className="form-control-alternative"
                            id="input-branch"
                          >
                            <option>New York</option>
                            <option>London</option>
                            <option>Tokyo</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" defaultChecked /> Active
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" /> MFA Enabled
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg="6">
                        <FormGroup>
                          <Label htmlFor="input-mfa-method">MFA Method</Label>
                          <Input
                            type="select"
                            className="form-control-alternative"
                            id="input-mfa-method"
                          >
                            <option>None</option>
                            <option>SMS</option>
                            <option>Email</option>
                            <option>Authenticator App</option>
                          </Input>
                        </FormGroup>
                      </Col>
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
