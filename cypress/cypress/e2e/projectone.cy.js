describe("register on", () => {
  // it("register test", () => {
  //   cy.get('[data-cy="register"]').click();
  //   cy.url().should("include", "/register");
  //   cy.get('[data-cy="register-account"]')
  //     .type("fake")
  //   cy.get('[data-cy="register-userName"]')
  //     .type("fake")
  //   cy.get('[data-cy="register-email"]')
  //     .type("fake@email.com")
  //   cy.get('[data-cy="register-password"]')
  //     .type("1234567")
  //   cy.get('[data-cy="register-submit"]').click();
  //   cy.url().should("include", "/");
  // });
});

describe("project on", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.login("fake@email.com", "1234567");
  });

  afterEach(() => {
    // cy.logout();
  });

  it("test add comment", () => {
    cy.selectHomeFirstVideo();

    cy.get('[data-cy="add-comment-textarea"]').type("good");
    cy.get('[data-cy="add-comment-button"]').click();
  });
});
