const apiOrders = `${Cypress.env("apiUrl")}/orders`; 

const apiLogin = `${Cypress.env("apiUrl")}/login`;

describe ("Verify cart functionality", ()=> {
   
    beforeEach(()=> {
        cy.request({
            method: "Post", 
            url: apiLogin, 
            body:{ 
            "username": "test2@test.fr",
            "password": "testtest",
            }, 
        }).then ((response) => {
            window.localStorage.setItem('authToken', response.body.token);
        })

        cy.login('test2@test.fr', 'testtest')
    })

    it ("check for the product availability", ()=>{

        cy.visit('/#/')
        cy.get ('[data-cy="product-home-link"]').first().click()

        cy.wait(1000)

        cy.get ('[data-cy="detail-product-stock"]')
            .should('be.visible')
            .should('contain', 'en stock')    
            .invoke('text')
            .then ((text) => {
                const matches = text.match(/-?\d+/);
                if (matches) {
                    const stockCount = parseInt(matches[0], 10);
                    expect(stockCount).to.not.be.NaN;
                    expect (stockCount).to.be.at.least(1);
                    cy.log(stockCount);
                } else {
                    throw new Error('stock number not found');
                }
            })
    })

    it ("check for adding product to cart", ()=>{
        
        const token = window.localStorage.getItem('authToken')
        
        cy.visit('/#/products')
        cy.get ('[data-cy="product-home-link"]').first().click()
        cy.get ('[data-cy="detail-product-add"]').click()

        cy.request ({
            method: "GET",
            url: apiOrders,
            headers: {
                "Authorization":"Bearer " + token
            },
            failOnStatusCode: false, 
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.orderLines).to.not.be.null;
        })
    })

    it ("check if stock is updated when adding product to cart", ()=>{

        const token = window.localStorage.getItem('authToken')
        
        cy.visit('/#/')

        cy.get ('[data-cy="product-home-link"]').first().then((firstProduct) => {
            const routerLink = firstProduct.attr('ng-reflect-router-link');
            const productId = routerLink.split(',').pop(); 
            cy.log('Product ID:', productId)
            cy.wrap(firstProduct).click(); 

            cy.wait (1000);

            cy.get ('[data-cy="detail-product-stock"]')
            .should('be.visible')
            .should('contain', 'en stock')
            .invoke('text')
            .then ((text) => {
                const matches = text.match(/-?\d+/);
                if (matches){
                    const stockInitial = parseInt(matches[0], 10);
                    cy.log('initial stock:', stockInitial)
                
                    cy.get('[data-cy= "detail-product-add"]').click();

                    cy.url().should('include', '/cart')

                    cy.visit(`/#/products/${productId}`); 

                    cy.wait(1000)

                    cy.get('[data-cy="detail-product-stock"]')
                        .should('be.visible')
                        .invoke('text')
                        .then((text) => {
                            const matches = text.match(/-?\d+/); 
                            if (matches){
                                const stockUpdated = parseInt(matches[0], 10);
                                expect (stockUpdated).to.equal(stockInitial - 1);
                            } else {
                                throw new Error ('Updated stock not found');
                            }
                        });
                } else {
                    throw new Error ('Initial stock not found'); 
                }
            })
    })
})



    it ("can't access to cart when entering negative quantities", ()=> {

        cy.visit('/#/products/4')

        cy.get('[data-cy="detail-product-quantity"]')
            .should('be.visible')
            .clear()
            .type(-1);

        cy.get('[data-cy= "detail-product-add"]').click()
        cy.url().should('not.include', '/cart')
    })

    it ("can't access to cart when entering quantities >= 20 ", ()=> {

        cy.visit('/#/products/4')

        cy.get('[data-cy="detail-product-quantity"]')
            .should('be.visible')
            .clear()
            .type(20);

        cy.get('[data-cy= "detail-product-add"]').click()
        cy.url().should('include', '/cart')
    })


})
