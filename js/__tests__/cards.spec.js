

import { API, UImanager } from "../utils";

// const setDatos = [
//     { card: '9225 0699 9511 7615', expect: true, bank: 'BANDEC' },

// ]

const user = 'darian.alvarez.t@gmail.com';
const pass = 'Buvosic8*';

let accessToken = null;

describe("Card Test: Describe", () => {
    beforeAll(async () => {

  
        const resultado = await API.login(user, pass)

        if (resultado.accessToken) {
            accessToken = resultado.accessToken;
        }
    });

    test('Card Test: Se loguea correctamente', () => {
        expect(accessToken).toBeTruthy()  //comprueba que existe un token
    });

    
    test('Card Test: tarjeta bandec USD OK', async () => {
        const tarjeta = await UImanager.buscarLogotipoBanco('9225 0699 9511 7615', accessToken);
        expect(tarjeta.tarjetaValida).toBe(true);
        expect(tarjeta.bankName).toBe('BANDEC');
    })

    test('Card Test: tarjeta bandec CUP ok', async () => {
        const tarjeta = await UImanager.buscarLogotipoBanco('9204 0699 9950 2453', accessToken);
        expect(tarjeta.tarjetaValida).toBe(true);
        expect(tarjeta.bankName).toBe('BANDEC');
    })

    test('Card Test: tarjeta Metropolitano CUP ok', async () => {
        const tarjeta = await UImanager.buscarLogotipoBanco('9227 9598 7350 8787', accessToken);
        expect(tarjeta.tarjetaValida).toBe(true);
        expect(tarjeta.bankName).toBe('METROPOLITANO');
    })




})





