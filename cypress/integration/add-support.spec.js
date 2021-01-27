beforeEach(() => {
    cy.login();

    cy.intercept('GET', '/api/proxy/v3/help-requests/callbacks', {
        fixture: 'callbacks'
    });

    cy.intercept('POST', '/api/proxy/v4/residents/3/help-requests', {
        statusCode: 201,
        body: { Id: 1 }
    });

    cy.intercept('GET', `/api/proxy/v4/residents/3/help-requests`, {
        fixture: 'helpRequests/resident3'
    });

    cy.intercept('GET', `/api/proxy/v4/residents/3`, {
        fixture: 'residents/3'
    });

    cy.visit(`http://localhost:3000/dashboard`);
});

context('When you view a helpcase profile', () => {
    it('it allows you to naviagte to the add support page', () => {
        cy.visit(`http://localhost:3000/callback-list`);
        cy.get('[data-testid=callbacks-list-view_link-0]').click({ force: true });
        cy.url().should('match', /\/helpcase-profile\/\d+$/);
        cy.get('[data-testid=add-support-button]').click({ force: true });
        cy.url().should('match', /\/add-support/);
    });
});

context('When required fields are not filled in', () => {
    it('it displays validation error', () => {
        cy.visit(`http://localhost:3000/callback-list`);
        cy.get('[data-testid=callbacks-list-view_link-0]').click({ force: true });
        cy.get('[data-testid=add-support-button]').click({ force: true });
        cy.get('[data-testid=add-support-update_button]').click({ force: true });
        cy.get('[data-testid=add-support-validation-error]').should('be.visible');

        cy.get('[data-testid=call-type-radio-button]').first().click({ force: true });
        cy.get('[data-testid=add-support-update_button]').click({ force: true });
        cy.get('[data-testid=add-support-validation-error]').should('be.visible');

        cy.get('[data-testid=call-type-no-radio-button]').click({ force: true });
        cy.get('[data-testid=add-support-update_button]').click({ force: true });
        cy.get('[data-testid=add-support-validation-error]').should('be.visible');
    });
});

context('When required fields are filled in', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:3000/callback-list`);
        cy.get('[data-testid=callbacks-list-view_link-0]').click({ force: true });
        cy.get('[data-testid=add-support-button]').click({ force: true });
        cy.get('[data-testid=call-type-radio-button]').first().click({ force: true });
        cy.get('[data-testid=call-type-no-radio-button]').click({ force: true });
        cy.get('[data-testid=followup-required-radio-button]').first().click({ force: true });
        cy.get('[data-testid=add-support-update_button]').click({ force: true });
    });

    it('it redirects to the resident page', () => {
        cy.get('[data-testid=add-support-validation-error]').should('not.exist');
        cy.url().should('match', /\/helpcase-profile/);
    });
});

context('When add support gets cancelled', () => {
    it('it returns to the resident page', () => {
        cy.visit(`http://localhost:3000/callback-list`);
        cy.get('[data-testid=callbacks-list-view_link-0]').click({ force: true });
        cy.get('[data-testid=add-support-button]').click({ force: true });
        cy.get('[data-testid=add-support-cancel_button]').click({ force: true });
        cy.get('[data-testid=add-support-validation-error]').should('not.exist');
        cy.url().should('match', /\/helpcase-profile/);
    });
});

export {};
