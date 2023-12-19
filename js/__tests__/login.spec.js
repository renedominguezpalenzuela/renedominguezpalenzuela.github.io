

import { API, UImanager , login} from "../utils";



const user = 'renedsoft@gmail.com';
const pass = 'Abcd1234';

let accessToken = null;





describe("Login", () => {
    test('Debe loguearse correctamente', async () => {

        console.log("login...");
        const resultado = await login(user, pass, true)

        if (resultado) {
            accessToken = resultado;
        }
        console.log('login complete');
        console.log(accessToken)

        expect(accessToken).toBeTruthy()  //comprueba que existe un token
    });
})





