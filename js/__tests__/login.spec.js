

import { API, UImanager } from "../utils";



const user = 'darian.alvarez.t@gmail.com';
const pass = 'Buvosic8*';

let accessToken = null;





describe("Login", () => {
    test('Debe loguearse correctamente', async () => {

        //console.log("login...");
        const resultado = await API.login(user, pass)

        if (resultado.accessToken) {
            accessToken = resultado.accessToken;
        }
       // console.log('login complete');
       // console.log(resultado.accessToken)

        expect(accessToken).toBeTruthy()  //comprueba que existe un token
    });
})





