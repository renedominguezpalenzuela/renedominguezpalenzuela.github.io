



import { API, UImanager } from "../utils.js";


const user = 'darian.alvarez.t@gmail.com';
const pass = 'Buvosic8*';



fdescribe ('Weather map test', function(){
     it("prueba",async function () {
        const resultado = await API.openweatherforTest();
        //console.log("RE")        
        //console.log(resultado)
        expect(resultado.status).toBe(200);
    });
})




xdescribe("Card Validation:", function () {

    let accessToken = null;
   
    beforeAll(async function() { 
        console.log("login..."); 
        const resultado = await API.login(user, pass)

        if (resultado.accessToken) {
            accessToken = resultado.accessToken;
        }
        console.log('login complete');
        console.log(resultado)
    });

    


    it("Tarjetas de BANDEC 1", function () {

        console.log("access token")
        console.log(accessToken)

        const Bandec_ER = new RegExp('^((92)\\d{0,2})(0699)\\d{0,8}');
        const Bandec_Card = "9225 0699 9511 7619".replace(/ /g, "");

        const Bandec_Card_error = "1225 0699 9511 7610".replace(/ /g, "");


        console.log(Bandec_Card)
        //console.log(Bandec_ER.test(Bandec_Card));
        expect(Bandec_ER.test(Bandec_Card)).toBe(true)

        //console.log(Bandec_ER.test(Bandec_Card));
        expect(Bandec_ER.test(Bandec_Card_error)).toBe(false)
    })

    it("Otras tarjetas BANDEC", function () {

        const Bandec_ER = new RegExp('^((92)\\d{0,2})(0699)\\d{0,8}');
        const Bandec_Card = "9225 0699 9511 7619".replace(/ /g, "");

        const Bandec_Card_error = "1225 0699 9511 7610".replace(/ /g, "");


        console.log(Bandec_Card)
        //console.log(Bandec_ER.test(Bandec_Card));
        expect(Bandec_ER.test(Bandec_Card)).toBe(true)

        //console.log(Bandec_ER.test(Bandec_Card));
        expect(Bandec_ER.test(Bandec_Card_error)).toBe(false)
    })

    it("Tarjetas Metropolitano", function(){
        const Metro_ER = new RegExp('^((92)\\d{0,2})(9598)\\d{0,8}');

        const Metro_Card = "9227 9598 7350 8787".replace(/ /g, "");

    })
});


/*
describe("Tarjeta:", function () {
    fit("Prueba expresiones regulare1", function () {

        const Bandec_ER = new RegExp('^((92)\\d{0,2})(0699)\\d{0,8}');
        const Bandec_Card = "9225 0699 9511 7619".replace(/ /g, "");

        const Bandec_Card_error = "1225 0699 9511 7610".replace(/ /g, "");


        console.log(Bandec_Card)
        //console.log(Bandec_ER.test(Bandec_Card));
        expect(Bandec_ER.test(Bandec_Card)).toBe(true)

        //console.log(Bandec_ER.test(Bandec_Card));
        expect(Bandec_ER.test(Bandec_Card_error)).toBe(false)
    })
});
*/
