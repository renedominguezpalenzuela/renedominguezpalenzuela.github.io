const { Component, mount, xml, useState} = owl;







// Owl Components
class Root extends Component {

  initialText = {texto: 'Dont click on me.'};
  static template = xml`
   

      <div class="main-back grid place-items-center h-screen ">
        <div class="d-sm-none ">
          <img src="img/logo.png" alt="" class="img-size"/>
        </div>

         <div class=" h-[34rem] w-[80vw] sm:w-[62vw] bg-white shadow-lg flex border-rounded ">
           <div class="h-full w-[90%] sm:w-[45vw] left p-5  ">             
                <h3>SIGN IN</h3>
                <input type="text" placeholder="USERNAME" id="usr"/>
                <input type="password" placeholder="PASSWORD" id="pass"/>                
                <div class="flex">                 
                  <button id="test-data-btn">Set Test Data</button>           
                  <button id="test-api-btn">Test API</button>
                </div>
                <button id="login-btn" class="submit-btn">LET'S GO</button>
               
           </div>

           <div class="h-full w-[100%] hidden sm:block right p-5 ">
            <div class="right-text">
            <h2>Volttus</h2>

            <h5>Lorem, ipsum dolor sit amet consectetur </h5>
              </div>
             
           </div>
            
         </div>  
      </div>

  `;

  //static components = { MagicButton };
}

mount(Root, document.body);