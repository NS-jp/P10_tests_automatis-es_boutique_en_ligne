describe ("login test", () =>{
    it ("Redirect to the login page", () => {
        cy.visit('/')
        cy.get('[data-cy="nav-link-login"]').click()
        cy.url().should('include', '/login')
        cy.get('.content-login')
            cy.contains('h1','Se connecter')
            cy.contains('.subtitle', 'Welcome back !')
        cy.get('[data-cy="login-input-username"]').should('be.visible')
        cy.get('[data-cy="login-input-password"]').should('be.visible')
        cy.get('[data-cy="login-submit"]').should('be.visible')
    }) 

    it ("vefify login", () => {
        cy.login('test2@test.fr', 'testtest')
        cy.get ('[data-cy="nav-link-cart"]').should('be.visible')
        cy.url().should('not.include', '/login')
    })
})