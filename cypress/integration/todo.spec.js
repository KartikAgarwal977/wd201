describe('Todo Application', () => {
  it('should display the homepage', () => {
    cy.visit('http://localhost:4000')
    cy.title().should('include', 'Todo application')
  })
})
const url = "http://localhost:4000"
describe('Sign Up', () => {
  it('should display the signup', () => {

    cy.visit(`${url}/signup`)
    cy.title().should('include','Sign Up');
  })
  const userCredentials = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  }

  it('should sign up redirect the detail', () => {
    cy.visit(`${url}/signup`)
    cy.get('input[id="firstName"]').type(userCredentials.firstName)
    cy.get('input[id="lastName"]').type(userCredentials.lastName)
    cy.get('input[id="email"]').type(userCredentials.email)
    cy.get('input[name="password"]').type(userCredentials.password)

    // Get the CSRF token from the server
    cy.request(`${url}/signup`).then(response => {
      cy.getCookie("csrfToken").then(cs => {
        const csrfToken = cs.value
        // Include the CSRF token in the form submission
        cy.get('input[name="_csrf"]').type(csrfToken,{force: true})
      })
    })
    cy.get('input[name="signupbtn"]').click()
    cy.url().should('include', 'users')

  })
  
})
describe('Login', () => {
  it('should display the Login', () => {

    cy.visit(`${url}/login`)
    cy.title().should('include','Login');
  })
  const userCredentials = {
    email: 'john.doe@example.com',
    password: 'password123'
  }

  it('should sign up redirect the detail', () => {
    cy.visit(`${url}/login`)
    cy.get('input[id="email"]').type(userCredentials.email)
    cy.get('input[name="password"]').type(userCredentials.password)

    // Get the CSRF token from the server
    cy.request(`${url}/login`).then(response => {
      cy.getCookie("csrfToken").then(cs => {
        const csrfToken = cs.value
        // Include the CSRF token in the form submission
        cy.get('input[name="_csrf"]').type(csrfToken,{force: true})
      })
    })
    cy.get('input[name="signinbtn"]').click()
    cy.url().should('include', 'session')

  })
  
})

