import {test as setup} from '@playwright/test'
import fs from 'fs'

const authFile = '.auth/user.json'

setup('Authentication setup', async({request})=>{

    const response =  await request.post('http://localhost:5000/api/auth/signin', {
        data:{
            email:'Osamasaeed@gmail.com',
            password:'osamasaeed1122**'
        }
    })
 const responseBody = await response.json();
 const token = responseBody.user.token

 const userAuthState = {
    cookies:[],
    origin:[
        {
            origin:('http://localhost:5000/api/auth/signin'),
            localStorage:[
                {
                  name:"jwtToken",
                  value:token
                }
            ]
        }
    ]
 }
 fs.writeFileSync(authFile, JSON.stringify(userAuthState , null,2))
})