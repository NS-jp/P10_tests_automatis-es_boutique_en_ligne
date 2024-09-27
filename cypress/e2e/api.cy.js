import {faker} from '@faker-js/faker'; 

const apiOrders = `${Cypress.env("apiUrl")}/orders`; 
const apiProducts = `${Cypress.env("apiUrl")}/products`;
const apiLogin = `${Cypress.env("apiUrl")}/login`;
const apiReviews = `${Cypress.env("apiUrl")}/reviews`;

const fakeEmail = faker.internet.email(); 
const fakePassword = faker.internet.password ({length:10}); 

context ("GET /orders", ()=>{
    it("gets a list of ordered products from an unauthorized user", () => {
        cy.request ({
            method: "GET",
            url: apiOrders,
            failOnStatusCode: false, 
        }).then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body.message).to.eq("JWT Token not found")
        })
    })
})


let productId; 
context ("GET /products", () => {
    it ("get a list of all products and extract the product ID", ()=> {
        cy.request("GET", apiProducts).then((response)=>{
            productId= response.body [Math.floor(Math.random()*response.body.length)].id;  
        })
    })

    it ("gets the details of a product by ID", ()=> {
        expect(productId).to.be.a("number"); 

        cy.request (apiProducts + `/${productId}`)
            .its("status").should ("eq",200); 
    })
})


describe("testing for autheticated users", () => {
let token;  

    before(()=> {
        cy.request({
            method: "Post", 
            url: apiLogin, 
            body:{ 
            "username": "test2@test.fr",
            "password": "testtest",
            }, 
        }).then ((response) => {
            expect(response.status).to.eq(200);
            token = response.body.token;
        })
    })
 
    it ("gets a list of ordered products from an authorized user", () => {
        cy.request({
            method: "GET",
            url: apiOrders, 
            headers: {
                "Authorization":"Bearer "+ token
            },
            failOnStatusCode: false,
        }).then ((response) => {
        expect(response.status).to.eq(200)
        })
    })

    it ("add a review", () => {
        cy.request({
            method: "Post", 
            url: apiReviews, 
            headers: {
            "Authorization":"Bearer " + token
            },
            body: {
                "title": "test",
                "comment": "test",  
                "rating": "5", 
            }, 
            failOnStatusCode: false, 
        }).then ((response) => {
        expect(response.status).to.eq(200);
        })
    })

    context ("POST /orders", () => {
        it ("add an available product to the cart", () => {
            cy.request({
                method: "Post", 
                url: apiOrders + "/add", 
                headers: {
                "Authorization":"Bearer " + token
                },
                body: {
                    "product": 6,
                    "quantity": 1 
                }, 
                failOnStatusCode: false, 
            }).then ((response) => {
                expect(response.status).to.eq(200);
            })
        })

        it ("add an unavailable product to the cart", () => {
            cy.request({
                method: "Post", 
                url: apiOrders + "/add", 
                headers: {
                "Authorization":"Bearer " + token
                },
                body: {
                    "product": 3,
                    "quantity": 1 
                }, 
                failOnStatusCode: false, 
            }).then ((response) => {
                expect(response.status).to.eq(400);
            })
        })
    })
    
})


it ("returns 401 for an unknown user", () => {
    cy.request({
        method: "Post", 
        url: apiLogin, 
        body:{ 
        "username": fakeEmail,
        "password": fakePassword,
        }, 
        failOnStatusCode: false, 
    }).then ((response) => {
        expect(response.status).to.eq(401);
    })
})













