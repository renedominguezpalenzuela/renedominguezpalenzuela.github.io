

import { suma } from '../suma'
//import axios from "axios";
//import '../libs/axios.min.js'
//const axios = require('axios');

import { API, UImanager } from "../utils";

//const suma = require('../utils');


describe("Suma function", () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(suma(1, 2)).toBe(3);
    });
})












describe('Weather map test', function () {
    test("prueba", async function () {
        const resultado = await API.openweatherforTest();
        //console.log("RE")        
        //console.log(resultado)
        expect(resultado.status).toBe(200);
    });
})