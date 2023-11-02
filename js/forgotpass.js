const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { ForgotPassReq } from "./components/forgotPassReq.js";
import { ForgotPassChange } from "./components/forgotPassChange.js";


class Root extends Component {
  static components = { ForgotPassReq, ForgotPassChange };

 state = useState({
  iniciando : true
 })
  


  static template = xml` 

  
<div class="  tw-w-full tw-bg-[#F1F2F7]   ">
   

    <!--  <div class="tw-p-2   "> -->
      
      <main class="tw-flex    tw-rounded-lg  ">       
         <div class="tw-p-3 tw-bg-[#FFFFFF] tw-rounded-lg    tw-w-full tw-h-full ">       
        
            <div t-if="this.state.iniciando" class="tw-flex    tw-justify-center tw-items-center tw-mt-10">
             
              <ForgotPassReq  unafuncion.bind="doSomething"/>  
            </div>

            <div t-if="!this.state.iniciando" class="tw-flex   tw-justify-center  tw-items-center tw-mt-10  ">
              <ForgotPassChange/>
            </div>
         
            
          
       </div> 
      </main>

   <!--  </div> -->

</div>  


 
  




    

  `;



  setup() {








    onWillStart(() => {


    });

    onMounted(() => {

    });


    onRendered(() => {



    });

  

  }

  doSomething() {
    this.state.iniciando = false;
    console.log("funcion del padre");
  }









}

mount(Root, document.body);
