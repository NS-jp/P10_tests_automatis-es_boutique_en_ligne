describe ("Testing on the login page", () =>{
    it ("check for the presence of elements in login page", () => {
        cy.visit('/')
        cy.get('[data-cy="nav-link-login"]').click()
        cy.get ('[data-cy="login-input-username"]').should('be.visible')
        cy.get ('[data-cy="login-input-password"]').should('be.visible')
        cy.get ('[data-cy="login-submit"]').should('be.visible')
    }) 
})

describe ("Tesing on the product page", ()=> {
   beforeEach(()=> {
        cy.login('test2@test.fr', 'testtest')

        cy.url().should('not.include', 'login')
    })


    it ("check for the presence of add-to-cart button and the product availability field", ()=>{
        const checkProductDetails = (index, totalProducts)=> {
            cy.get ('[data-cy="product-link"]').eq(index).click()
            cy.get ('[data-cy="detail-product-add"]').should('be.visible')
            cy.get ('[data-cy="detail-product-stock"]').should('be.visible')
            cy.go('back')
            if (index + 1 < totalProducts) {
                checkProductDetails(index + 1, totalProducts )
            }
        }
        cy.visit('/#/products')
        cy.get ('[data-cy="product-link"]').then (($links) => {
            const totalProducts = $links.length;
            checkProductDetails(0, totalProducts)
        })
    })

})
