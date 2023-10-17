const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { Profile } from "./components/profile.js";



class Root extends Component {
  static components = { Profile};

  


  static template = xml` 

  
<div class="  tw-w-full tw-bg-[#F1F2F7]   ">
   

    <div class="tw-p-2   ">
      
      <main class="tw-flex  tw-justify-center  tw-rounded-lg   ">       
        <div class="tw-p-3 tw-bg-[#FFFFFF] tw-rounded-lg    tw-w-full tw-h-full ">       
        
         
            <Profile newUser="true"/>
         
            
          
        </div>
      </main>

    </div>

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



    
  



}

mount(Root, document.body);
