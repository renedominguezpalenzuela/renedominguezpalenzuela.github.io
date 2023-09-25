//var axios = require('axios');
//import  axios from 'axios';
import  '../libs/axios.min.js';
import { API, UImanager } from "../utils.js";

describe("Funcion de aproximacion:", function () {
    it("Funcion de aproximacion", function () {

        const setDatos = [
            { in: 10.25878, digits: 2, expect: "10.26" },
            { in: 10.25178, digits: 2, expect: "10.25" },
            { in: 10.2, digits: 2, expect: "10.20" },
            { in: 1.005, digits: 2, expect: "1.01" },
            { in: 99.004, digits: 2, expect: "99.00" },
            { in: -99.004, digits: 2, expect: "-99.00" },
            { in: 175.00000001, digits: 2, expect: "175.00" },
            { in: 1.225, digits: 2, expect: "1.23" },
            { in: 1.3555, digits: 2, expect: "1.36" },
            { in: 1.5550, digits: 2, expect: "1.56" },
            { in: 1.5551, digits: 2, expect: "1.56" },
            { in: 1.55499994, digits: 2, expect: "1.55" },
            { in: 56.1963, digits: 2, expect: "56.20" },
            { in: -1.225, digits: 2, expect: "-1.23" },
            { in: -1.005, digits: 2, expect: "-1.01" },
        
            { in: 1.55499994, digits: 3, expect: "1.555" },
            { in: 12.4253, digits: 2, expect: "12.43" },
            { in: 9.7, digits: 0, expect: "10" },
            { in: 8.714282448981457, digits: 2, expect: "8.71" },        
        ]

        const uno = UImanager.roundDec(10.25678, 2);
        expect(typeof (uno)).toEqual('string');

        setDatos.forEach((unDato) => {
            expect(UImanager.roundDec(unDato.in, unDato.digits)).toBe(unDato.expect);
        });

        // setDatos.forEach((unDato) => {
        //     expect(API.roundNumber(unDato.in, unDato.digits)).toBe(unDato.expect);
        // })

        // expect(API.roundNumber(1.005, 2)).toBe("1.01");
        // expect(API.roundNumber(-1.005, 2)).toBe("-1.01");

      //https://shopify.engineering/eight-tips-for-hanging-pennies
        //https://www.sqlservercentral.com/articles/bankers-rounding-what-is-it-good-for
        //https://www.sumup.com/en-gb/invoices/dictionary/rounding/
        //BEST:
        //https://rounding.to/understanding-the-bankers-rounding/
        //https://www.youtube.com/watch?v=yZLAE2KdTT8
        //https://www.youtube.com/watch?v=KkswD4iPyO0
        //Banking rounding implementation in JS
        //https://www.youtube.com/watch?v=UC0G2Zr9myk

        //Banking roundig explain
        //https://www.youtube.com/watch?v=yZLAE2KdTT8

        //Round in JS
        //https://www.youtube.com/watch?v=4ykEphpAG58

    });


    
});




describe("Correos Validos:", ()=>{    

    it ("Correo valido", ()=>{
        const correo = 'correo@ddd.com';
        expect(UImanager.validMail(correo)).toBe(true)            
    }) 


    it ("Correo terminado en punto debe ser falso", ()=>{
        const correo = 'correo@ddd.';
        expect(UImanager.validMail(correo)).toBe(false)            
    }) 
})



describe("CI Validos:", ()=>{    

    it ("CI del 1975 debe ser Valido", ()=>{
        const CI = '75033036829';
        expect(UImanager.validarCI(CI)).toBe(false); //validarCI --- devuelve false si ok
    })


    it ("CI del 2001 debe ser valido", ()=>{
        const CI = '01022312345';
        expect(UImanager.validarCI(CI)).toBe(false); //validarCI --- devuelve false si ok
    }) 

    it ("CI de menor de edad debe dar error", ()=>{
        const CI = '13022312345';
        expect(UImanager.validarCI(CI)).toBe(true); //validarCI --- devuelve true si hay errores                    
    }) 
})
