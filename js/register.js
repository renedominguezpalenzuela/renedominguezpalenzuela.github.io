const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { Profile } from "./components/profile.js";



class Root extends Component {
  static components = { Profile};

  


  static template = xml` 

  
<div class="  w-full bg-[#F1F2F7]   ">
   

    <div class="p-2   ">
      
      <main class="flex  justify-center  rounded-lg   ">       
        <div class="p-3 bg-[#FFFFFF] rounded-lg    w-full h-full ">       
        
         
            <Profile/>
         
            
          
        </div>
      </main>

    </div>

</div>  


 
  




    

  `;



  setup() {
    //const accessToken = window.localStorage.getItem('accessToken');
    //const walletAddress = window.localStorage.getItem('walletAddress');
    //const userId = window.localStorage.getItem('userId');

    





    onWillStart(() => {
   
  
    });

    onMounted(() => {
      
    });


    onRendered(() => {
      
   
      
    });

  }



    
  



}

mount(Root, document.body);
