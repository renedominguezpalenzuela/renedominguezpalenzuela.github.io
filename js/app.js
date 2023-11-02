const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

//import useStore from "/js/store.js";
//import { getAPIStatus, login, getUsrInfo } from "/js/utils.js";

import { getAPIStatus, login, API } from "./utils.js";





class Root extends Component {

  inputUsr = useRef("input_user");
  inputPass = useRef("input_pass");




  static template = xml`
   

      <div class="main-back tw-grid tw-place-items-center  ">
        <div class="sm:tw-hidden ">
            <img src="img/logo.png" alt="" class="img-size"/>
        </div>

        <div class=" tw-h-[34rem] tw-w-[80vw] sm:tw-w-[62vw] tw-bg-white tw-shadow-lg tw-flex border-rounded ">
          <div class="tw-h-full  sm:tw-w-[45vw] left tw-p-5 border-rounded-2 ">             
            <h3>SIGN IN</h3>
            <input type="text" placeholder="USERNAME" id="usr" t-ref="input_user"/>
            <input type="password" placeholder="PASSWORD" id="pass" t-ref="input_pass"/> 
            <div class="tw-flex ">                 
               <a class="tw-ml-1" href="/forgotpass.html">Forgot password?</a>
            </div>

            <div class="tw-flex tw-pt-2">                 
              <button id="test-data-btn"  t-on-click="setTest_data">Set Test Data</button>           
              <button id="test-api-btn"  t-on-click="getApi_Status">Test API</button>
            </div>
            <button id="login-btn" class="submit-btn" t-on-click="login_btn">LET'S GO</button>

            <div class="tw-mt-6 tw-flex tw-justify-center">Don't have an account yet?
             <a class="tw-ml-1" href="/register.html">Sign Up</a>
            </div>
          </div>

          <div class="tw-h-full tw-w-[100%] tw-hidden sm:tw-block right tw-p-5 ">
            <div class="right-text">
              <h2>Volttus</h2>
              <h5>Lorem, ipsum dolor sit amet consectetur </h5>
            </div>
          </div>

        </div>  
      </div>

  `;






  setup() {

    window.sessionStorage.clear();
  



    onMounted(async () => {




    });





    onRendered(async () => {



    });




  }

  async login_btn() {
    window.sessionStorage.clear();
  

    console.log("Login a... ");
    const loginOK = await login(this.inputUsr.el.value, this.inputPass.el.value);
    console.log(loginOK)


    if (loginOK) {
      
      const accessToken = API.getTokenFromsessionStorage();
      
      const api = new API(accessToken);


      //obteniendo todos los datos de los beneficiarios
      /*const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();


      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }*/

      //const  allDatosBeneficiariosFromStorage =JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));      
      //console.log(allDatosBeneficiariosFromStorage);





      // const userInfo = await getUsrInfo();
      const userData = await api.getUserProfile();
      console.log("User Data")
      console.log(userData);

      
      if (userData._id) {
        window.sessionStorage.setItem('userId', userData._id)
      }


      if (userData.verified) {
        /*
          status : "To Verify"
          validatedUser: true
          verified :  false
        */
         console.log("Usuario verificado")
        window.sessionStorage.setItem('verified', userData.verified)
      } else {
        console.log("Usuario NO verificado")
      // const ususarioVerificadoOK = await API.verificarUsuario(userData._id);

        /*if (!ususarioVerificadoOK) {
          return;
        }*/

      }

     



      if (userData.firstName) {
        window.sessionStorage.setItem('firstName', userData.firstName)
      }

      if (userData.lastName) {
        window.sessionStorage.setItem('lastName', userData.lastName)
      }

      if (userData.nameFull) {
        window.sessionStorage.setItem('nameFull', userData.nameFull)
      }




      if (userData.avatar) {
        //https://lh3.googleusercontent.com/a-/AOh14GiiEcL0fUG0CEdQb3V5X3Y21KYu3Q6QW4tFaNr2HA
        window.sessionStorage.setItem('avatar', userData.avatar)

        //userData.safeImage.image;
      }
      if (userData.safeImage) {
        window.sessionStorage.setItem('safeImage', userData.safeImage.image)
      }





      if (userData.walletAddress) {
        window.sessionStorage.setItem('walletAddress', userData.walletAddress)
      }

      //obteniendo lista de ids de beneficiarios
      if (userData.beneficiaries) {
        window.sessionStorage.setItem('beneficiariesID', userData.beneficiaries)
      }

      const beneficiariosIDList = userData.beneficiaries;
      console.log(beneficiariosIDList);


      window.location.assign("main.html");


    }




  }

  setTest_data() {
    this.inputUsr.el.value = 'darian.alvarez.t@gmail.com';
    this.inputPass.el.value = 'Buvosic8*';
    
    //Swal.fire('Test data is ready');
  }

  getApi_Status() {

    getAPIStatus()
  }



}

mount(Root, document.body);

// or alternatively
/*
const env = {
  _t: myTranslateFunction,
  user: {...},
  services: {
      ...
  },
};
*/

//mount(App, document.body, { env });