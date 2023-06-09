const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

//import useStore from "/js/store.js";
//import { getAPIStatus, login, getUsrInfo } from "/js/utils.js";
import useStore from "./store.js";
import { getAPIStatus, login, API } from "./utils.js";




class Root extends Component {

  inputUsr = useRef("input_user");
  inputPass = useRef("input_pass");


  count = useState({ value: 0 });

  increment() {
    this.count.value++;
  }



  static template = xml`
   

      <div class="main-back grid place-items-center  ">
        <div class="sm:hidden ">
            <img src="img/logo.png" alt="" class="img-size"/>
        </div>

        <div class=" h-[34rem] w-[80vw] sm:w-[62vw] bg-white shadow-lg flex border-rounded ">
          <div class="h-full w-[90%] sm:w-[45vw] left p-5  ">             
            <h3>SIGN IN</h3>
            <input type="text" placeholder="USERNAME" id="usr" t-ref="input_user"/>
            <input type="password" placeholder="PASSWORD" id="pass" t-ref="input_pass"/>                
            <div class="flex">                 
              <button id="test-data-btn"  t-on-click="setTest_data">Set Test Data</button>           
              <button id="test-api-btn"  t-on-click="getApi_Status">Test API</button>
            </div>
            <button id="login-btn" class="submit-btn" t-on-click="login_btn">LET'S GO</button>
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






  setup() {
    this.store = useStore();



    onMounted(async () => {




    });





    onRendered(async () => {



    });




  }

  async login_btn() {

    console.log("Login...");
    const loginOK = await login(this.inputUsr.el.value, this.inputPass.el.value);
    console.log(loginOK)

    if (loginOK) {
      const accessToken = window.sessionStorage.getItem('accessToken');
      console.log(accessToken)
      const api = new API(accessToken);

      
      //obteniendo todos los datos de los beneficiarios
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
  

      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }

      //const  allDatosBeneficiariosFromStorage =JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));      
      //console.log(allDatosBeneficiariosFromStorage);





      // const userInfo = await getUsrInfo();
      const userData = await api.getUserProfile();
     // console.log(userData);

          if (userData._id) {
            window.sessionStorage.setItem('userId', userData._id)
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


    /*datos = response.data;

    
*/



    // if (userInfo) window.location.assign("main.html");

  }

  setTest_data() {
    this.inputUsr.el.value = 'darian.alvarez.t@gmail.com';
    this.inputPass.el.value = 'Buvosic8*';
    Swal.fire('Test data is ready');
  }

  getApi_Status() {
    getAPIStatus()
  }



}

mount(Root, document.body);