describe ("Testing before login", () =>{
    it ("check for the presence of elements in login page", () => {
        cy.visit('/')
        cy.get('[data-cy="nav-link-login"]').click()
        cy.get ('[data-cy="login-input-username"]').should('be.visible')
        cy.get ('[data-cy="login-input-password"]').should('be.visible')
        cy.get ('[data-cy="login-submit"]').should('be.visible')
    }) 
})

describe ("Tesing after login", ()=> {
   beforeEach(()=> {
        cy.login('test2@test.fr', 'testtest')

        cy.url().should('not.include', 'login')
    })


    it ("check for the presence of add-to-cart button and the product availability field", ()=>{
        cy.visit('/#/products')
        cy.get ('[data-cy="product-link"]').first().click()
        cy.get ('[data-cy="detail-product-add"]').should('be.visible')
        cy.get ('[data-cy="detail-product-stock"]').should('be.visible')
    })
})
