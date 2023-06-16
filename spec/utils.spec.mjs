
import { API } from "../js/utils.js";




describe("A suite", function() {
    it("contains spec with an expectation", function() {

        console.log(API);
       

        const uno = API.roundDec(10.25678);
        console.log(uno);
        expect(uno).toBe("10.26");
        
    });
});
