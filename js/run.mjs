
import Jasmine from 'jasmine';

let jasmine = new Jasmine();
// modify this line to point to your jasmine.json
// jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.loadConfig({
  
    "spec_dir": "js",
    "spec_files": [
      "**/*[sS]pec.?(m)js"
      
    ],
    "helpers": [
      "helpers/**/*.?(m)js"
    ],
    "env": {
      "stopSpecOnExpectationFailure": false,
      "random": true
    }
    ,"jsLoader": "require"
  });

jasmine.execute();

