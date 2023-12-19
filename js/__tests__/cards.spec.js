

import { API, UImanager , login} from "../utils";

// const setDatos = [
//     { card: '9225 0699 9511 7615', expect: true, bank: 'BANDEC' },

// ]

/*
Ejecucion
1) desomentar en utils.js
import axios from "axios";

2) En la consola
yarn test-jest
*/


const user = 'renedsoft@gmail.com';
const pass = 'Abcd1234';

let accessToken = null;

describe("Card Test: Describe", () => {
    beforeAll(async () => {

  
        const resultado = await login(user, pass, true)

        if (resultado) {
            accessToken = resultado;
        }
    });

    test('Card Test: Se loguea correctamente', () => {
        expect(accessToken).toBeTruthy()  //comprueba que existe un token
    });

    
    test('Card Test: tarjeta bandec USD OK', async () => {
        const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco('9225 0699 9511 7615', accessToken);
        expect(tarjeta.tarjetaValida).toBe(true);
        expect(tarjeta.bankName).toBe('BANDEC');
    })

    test('Card Test: tarjeta bandec CUP ok', async () => {
        const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco('9204 0699 9950 2453', accessToken);
        expect(tarjeta.tarjetaValida).toBe(true);
        expect(tarjeta.bankName).toBe('BANDEC');
    })

    test('Card Test: tarjeta Metropolitano CUP ok', async () => {
        const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco('9227 9598 7350 2340', accessToken);
        expect(tarjeta.tarjetaValida).toBe(true);
        expect(tarjeta.bankName).toBe('METROPOLITANO');
    })




})





