
import { API } from "./utils.js";




describe("Probando API", function() {
    it("Funcion de aproximacion", function() {

        
       

        const uno = API.roundDec(10.25678, 2);    
        expect(typeof(uno)).toEqual('string');

        expect(API.roundDec(10.25678, 2)).toBe("10.26");    
        expect(API.roundDec(10.25178, 2)).toBe("10.25");
        expect(API.roundDec(10.2, 2)).toBe("10.20");
        expect(API.roundDec(1.005, 2)).toBe("1.01");
        expect(API.roundDec(99.004, 2)).toBe("99.00");
        expect(API.roundDec(-99.004, 2)).toBe("-99.00");
        expect(API.roundDec(175.00000001, 2)).toBe("175.00");
     
        expect(API.roundDec(1.225, 2)).toBe("1.23");
    
        expect(API.roundDec(1.3555, 2)).toBe("1.36");
        

        
        
        expect(API.roundDec(1.5550, 2)).toBe("1.56");
        expect(API.roundDec(1.5551, 2)).toBe("1.56");
        expect(API.roundDec(1.55499994, 2)).toBe("1.55");
        expect(API.roundDec(56.1963, 2)).toBe("56.20");
 
        //ERROR:
        expect(API.roundDec(-1.225, 2)).toBe("-1.23");
        expect(API.roundDec(-1.005, 2)).toBe("-1.01");
        expect(API.roundDec(1.005, 2)).toBe("1.01");
   

        expect(API.roundDec(1.55499994, 3)).toBe("1.555");

        expect(API.roundDec(12.4253, 2)).toBe("12.43");
        expect(API.roundDec(9.7, 0)).toBe("10");

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
