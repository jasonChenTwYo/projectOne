// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email, password) => {
  cy.get('[data-cy="login-link"]').click();
  cy.url().should("include", "/login");
  cy.get('[data-cy="login-email"]').click().type(email);
  cy.get('[data-cy="login-password"]').click().type(password);
  cy.get('[data-cy="login-submit"]').click();
  cy.get('[data-cy="video-upload-link"]');
});

Cypress.Commands.add("logout", () => {
  cy.get('[data-cy="logout-link"]').click();
  cy.url().should("include", "/");
  cy.get('[data-cy="video-upload-link"]').should("not.exist");
});

Cypress.Commands.add("selectHomeFirstVideo", () => {
  cy.intercept({
    method: "GET",
    url: "/api/home/get-video",
  }).as("getHomeVideo");

  cy.get('[data-cy="home-link"]').click();

  cy.wait("@getHomeVideo").then((interception) => {
    console.log(interception.response.body.video_list);
    cy.get(
      `[data-cy="link-${interception.response.body.video_list[0].video_id}"]`
    ).click();
  });
});
