

import { API, UImanager } from "../utils";



const user = 'darian.alvarez.t@gmail.com';
const pass = 'Buvosic8*';



describe('Weather map test', function () {
    test("prueba", async function () {
        const resultado = await API.openweatherforTest();
        console.log("RE")        
       // console.log(resultado)
        expect(resultado.status).toBe(200);
    });
})


/*
describe("Login", () => {
    test('Debe loguearse correctamente', async () => {

        console.log("login...");
        const resultado = await API.login(user, pass)

        if (resultado.accessToken) {
            accessToken = resultado.accessToken;
        }
        console.log('login complete');
        console.log(resultado.accessToken)

        expect(resultado.accessToken).toBeTruthy()  //comprueba que existe un token
    });
})*/





