import {test,expect} from '@playwright/test'
import { faker } from '@faker-js/faker'



test.describe("Authentication flow Setup", () => {
    let authToken ;
    let userEmail ;
    let userPassword = 'Password123!'


    test("Signing up for through API using faker ",async({request})=>{
        userEmail = faker.internet.email();
        const payLoad = {
            name:faker.person.fullName(),
            age: faker.number.int({min:18 ,max:70}),
            email:userEmail,
            password:userPassword,
            confirmPassword:userPassword,
            trustedEmail:faker.internet.email()
        }

        const userSignupResponse = await request.post('http://localhost:5000/api/auth/signup',{
           data:payLoad,
           headers:{'Content-Type': 'application/json'}
        }) 
        expect(userSignupResponse.status()).toBe(201)
        const body = await userSignupResponse.json();
        console.log('Successfully signedin for email',userEmail);
        
    })
    test("SigningIn with the user we created", async({request})=>{
        const response = await request.post('http://localhost:5000/api/auth/signin',{
            data:{
                email:userEmail,
                password:userPassword
            },
            headers:{'Content-Type': 'application/json'}
        })

        const body = await response.json()
        expect(response.status()).toBe(200);
        console.log("Ye raha apka email ",userEmail)
        // Extracting Token
        authToken = body.token || body.accessToken;
        expect(authToken).toBeDefined();
        console.log("SignIn Successful here is your token ",authToken);
        
    })

})