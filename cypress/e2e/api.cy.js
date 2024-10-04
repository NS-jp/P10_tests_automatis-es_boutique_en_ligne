import {faker} from '@faker-js/faker'; 

const apiOrders = `${Cypress.env("apiUrl")}/orders`; 
const apiProducts = `${Cypress.env("apiUrl")}/products`;
const apiLogin = `${Cypress.env("apiUrl")}/login`;
const apiReviews = `${Cypress.env("apiUrl")}/reviews`;

const fakeEmail = faker.internet.email(); 
const fakePassword = faker.internet.password ({length:10}); 

let productId;
let token; 

const loginUser = (username, password) => {
    return cy.request({
       method: "POST",
       url: apiLogin,
       body:{ username, password}, 
       failOnStatusCode: false,
    })
}

describe ("unknown user requests", () =>{
    
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

    context ("GET /products", () => {
    
        before (()=> {
        cy.request("GET", apiProducts).then((response)=>{
            productId = response.body [Math.floor(Math.random()*response.body.length)].id;  
        })
        })
    
    it ("gets the details of a product by ID", ()=> {
        expect(productId).to.be.a("number"); 

        cy.request (apiProducts + `/${productId}`)
            .its("status").should ("eq",200); 
    })
    })

    context ("POST /login", () => {
    it ("should return 401 for unknown user", () => {
        loginUser(fakeEmail, fakePassword).then ((response) => {
        expect(response.status).to.eq(401);
        })
    })
    })
})


describe ("Authenticated user requests", () => {

    before(() => {
    return loginUser("test2@test.fr", "testtest").then((response) => {
        expect(response.status).to.eq(200);
        token = response.body.token; 
        });
    });

    context ("GET /orders", ()=>{

        it ("should retrieve orders for an authorized user", () => {
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
    })

    context ("POST /reviews", () => {
    it ("should add a review", () => {
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
    })

    context ("POST /orders", () => {     
    it ("should add an available product to the cart", () => {
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

    it ("should add an unavailable product to the cart", () => {
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













