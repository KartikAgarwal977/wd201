/* eslint-disable no-undef */

describe("Todo Application", () => {
  const url = "http://localhost:3000";

  it("should display the homepage", () => {
    cy.visit(url);
    cy.title().should("include", "Todo application");
  });

  describe("Sign Up", () => {
    const userCredentials = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    it("should display the signup page", () => {
      cy.visit(`${url}/signup`);
      cy.title().should("include", "Sign Up");
    });

    it("should sign up and redirect to the user detail page", () => {
      cy.visit(`${url}/signup`);

      cy.get('input[id="firstName"]').type(userCredentials.firstName);
      cy.get('input[id="lastName"]').type(userCredentials.lastName);
      cy.get('input[id="email"]').type(userCredentials.email);
      cy.get('input[name="password"]').type(userCredentials.password);

      cy.request(`${url}/signup`).then(() => {
        cy.getCookie("csrfToken").then((cs) => {
          const csrfToken = cs.value;
          cy.get('input[name="_csrf"]').type(csrfToken, { force: true });
          cy.get('input[name="signupbtn"]').click();
        });
      });

      cy.url().should("include", "users");
    });
  });

  describe("Login", () => {
    const userCredentials = {
      email: "john.doe@example.com",
      password: "password123",
    };

    it("should display the login page", () => {
      cy.visit(`${url}/login`);
      cy.title().should("include", "Login");
    });

    it("should log in and redirect to the session page", () => {
      cy.visit(`${url}/login`);

      cy.get('input[id="email"]').type(userCredentials.email);
      cy.get('input[name="password"]').type(userCredentials.password);

      cy.request(`${url}/login`).then(() => {
        cy.getCookie("csrfToken").then((cs) => {
          const csrfToken = cs.value;
          cy.get('input[name="_csrf"]').type(csrfToken, { force: true });
          cy.get('input[name="signinbtn"]').click();
        });
      });

      cy.url().should("include", "session");
    });
  });
});
