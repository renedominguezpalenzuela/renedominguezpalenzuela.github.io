const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";
import { Paises } from "../../data/paises.js";
import { UImanager } from "../utils.js";




export class ForgotPassChange extends Component {


  inputPass1 = useRef("inputPass1");
  inputPass2 = useRef("inputPass2");

  iconPassVisibility1 = useRef("iconPassVisibility1");
  iconPassVisibility2 = useRef("iconPassVisibility2");


  state = useState({
    otpCode: '',
    password: ''
  })


  errores = useState({
    otpCode: false,
    password: false
  })

  showSpinner = useState({
    boton: true
  })


  static template = xml`    
   
        <div class="tw-card  tw-w-[50%] tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
    
        <div class="tw-card-body tw-items-center ">


        <!-- ************************************************************************* -->
        <!--               OTP Code                                                    -->
        <!-- ************************************************************************* -->
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">           
                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">Code</span>
                    </label>
                    <input type="text" t-model="this.state.otpCode" placeholder="OTP Code" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangeCode" t-on-blur="onBlurCode"   />   
                    <span t-if="this.errores.otpCode==true" class="error">
                      Required field!!!
                    </span>
                </div>
            </div>  



        <!-- ************************************************************************* -->
        <!--               Password                                                    -->
        <!-- ************************************************************************* -->
       
          <div  class="sm:tw-flex sm:tw-flex-row  tw-w-full">
     

            <div class="tw-form-control tw-w-full  ">
              <label class="tw-label">
                <span class="tw-label-text">Password</span>
              </label>
                <div class="tw-join ">
                      <input  type="password"  class="tw-input tw-input-bordered tw-join-item tw-w-[85%] " placeholder="Password" t-ref="inputPass1"  t-model="this.state.password" t-on-input="onChangePass" t-on-blur="onBlurPass" />
                      <button class="tw-btn tw-join-item tw-w-[15%]" t-on-click="toggler_visibility">
                        <i id="toggler1" class="far  fa-eye " t-ref="iconPassVisibility1"></i>
                      </button>                  
                </div>
                <span t-if="this.errores.password==true" class="error">
                      Error!!!
                    </span>
            </div>

            <div class="tw-form-control tw-w-full  tw-pl-1">
              <label class="tw-label">
              <span class="tw-label-text">Confirm Password</span>
              </label>
              <div class="tw-join  ">
                  <input type="password"  class="tw-input tw-input-bordered tw-join-item tw-w-[85%]" placeholder="Confirm Password" t-ref="inputPass2" t-on-input="onChangePass" t-on-blur="onBlurPass"/>
                  <button class="tw-btn tw-join-item tw-w-[15%]" t-on-click="toggler_visibility" >
                    <i id="toggler2" class="far fa-eye " t-ref="iconPassVisibility2"></i>
                  </button>
              </div>
              <span t-if="this.errores.password==true" class="error">
              Error!!!
            </span>
            </div>
        </div>       

     





         

            <div class="tw-card-actions tw-mt-5">
              <button class="tw-btn tw-btn-primary tw-w-full" t-on-click="onSaveAllData">
              <!-- <span> -->
              Save
            <!-- </span>
              <span t-if="this.showSpinner.boton==true">
                <img src="img/Spinner-1s-200px.png" width="45rem"/>
              </span> -->
            
              </button>             
            </div>
        </div>
        </div>


     


      

      



        
     
    

  `;



  setup() {


    onWillStart(async () => {



    });

    onMounted(() => {


    });








  }














  validarDatos(datos) {



    if ((this.inputPass1.el.value || this.inputPass2.el.value) && (this.inputPass1.el.value != this.inputPass2.el.value)) {

      console.log("ERROR EN PASS")
      /*Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Passwords are not the same or are empty, please check'
      })*/
      this.errores.password = true;
      return false;
    }






    this.errores.password = UImanager.validarSiVacio(datos.password)
    this.errores.otpCode = UImanager.validarSiVacio(datos.otpCode)

    console.log(this.errores)

    for (let clave in this.errores) {
      if (this.errores[clave] == true) {
        console.log(clave)
        return false;

      }

    }

    return true;

  }


  toggler_visibility() {

    if (this.inputPass1.el.type == 'password') {
      this.inputPass1.el.setAttribute('type', 'text');
      this.inputPass2.el.setAttribute('type', 'text');
      this.iconPassVisibility1.el.classList.add('fa-eye-slash');
      this.iconPassVisibility2.el.classList.add('fa-eye-slash');

    } else {
      this.inputPass1.el.setAttribute('type', 'password');
      this.inputPass2.el.setAttribute('type', 'password');
      this.iconPassVisibility1.el.classList.remove('fa-eye-slash');
      this.iconPassVisibility2.el.classList.remove('fa-eye-slash');

    }


  }







  async onSaveAllData() {


    console.log("Datos a enviar")
    console.log(this.state)



    if (!this.validarDatos(this.state)) {
      console.log("Validation Errors");
      return;
    } else {
      console.log("No hay error")
    }


    //    this.showSpinner.boton = true;

    $.blockUI({ message: '<span> <img src="img/Spinner-1s-200px.png" /></span> ' });







    try {


      let respuesta = null;

      //creando nuevo usuario
      respuesta = await API.changePass(this.state.otpCode, this.state.password)
      console.log("Respuesta  Change pass ")
      console.log(respuesta)


      $.unblockUI();



      let cod_respuesta = 0;

      if (respuesta.status) {
        cod_respuesta = respuesta.status;
      } else if (respuesta.response && respuesta.response.status) {
        cod_respuesta = respuesta.response.status;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unspected response, see browser logs for details'
        })
      }

      if (cod_respuesta == 200 || cod_respuesta == 201) {
        console.log("---- Respuesta OK ----- ")
        console.log(respuesta)


        if (respuesta.data.changeCompleted) {
         await Swal.fire({
            icon: 'success',
            title: 'Password changed successfully!!!',
            //text: 'Use it to change the password'
          })

          console.log("Redireccionar")



        } else {
          await Swal.fire({
            icon: 'error',
            title: respuesta.data.message
            //text: 'Use it to change the password'
          })

          console.log("NO Redireccionar")
        }




        /*
                Swal.fire({
                  title: 'User data have been saved',
                  text: this.props.newUser ? "A verification code is sended to your email" : "",
                  icon: 'success',
                  showCancelButton: false,
                  // confirmButtonColor: '#3085d6',
                  // cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok',
                  cancelButtonText: 'No'
                }).then(async (result) => {
                  if (this.props.newUser) {
        
                    const ususarioVerificadoOK = await API.verificarUsuario(userID);
        
                    console.log("RESPUESTA Verificar usuario")
                    console.log(ususarioVerificadoOK)
                    if (ususarioVerificadoOK) {
                      window.location.assign(API.redirectURLLogin);
                      this.showSpinner.boton = false;
        
                    }
        
                  }
        
                });
        */

      } else {
        console.log("----ERROR: Respuesta del API----- ")
        console.log(respuesta)
        const respuestatxt = respuesta.response ? respuesta.response.data.message : "Not expected response, see console for details";
        this.showSpinner.boton = false;

        Swal.fire({
          icon: 'error',
          title: 'Error: ' + cod_respuesta,
          text: respuestatxt
        })

      }

    } catch (error) {
      console.log("----ERROR: Sin Respuesta del API----- ")
      console.log(error)
      this.showSpinner.boton = false;

      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: error.message
      })

    }

    this.showSpinner.boton = false;


  }





  timeToBlur = 500;
  onBlurCode = (event) => {
    this.errores.otpCode = UImanager.validarSiVacio(event.target.value);
  }

  onChangeCode = API.debounce(async (event) => {
    this.errores.otpCode = UImanager.validarSiVacio(event.target.value);
  }, this.timeToBlur);


  onBlurPass = (event) => {
    // this.errores.password = UImanager.validarSiVacio(event.target.value);

    console.log("ERROR EN PASS BLUR")
    console.log(this.inputPass1.el.value)
    console.log(this.inputPass2.el.value)
    if (this.inputPass1.el.value != this.inputPass2.el.value) {


      this.errores.password = true;

    } else {
      this.errores.password = false;
    }


  }

  onChangePass = API.debounce(async (event) => {
    console.log("ERROR EN PASS chnange")
    console.log(this.inputPass1.el.value)
    console.log(this.inputPass2.el.value)

    if (this.inputPass1.el.value != this.inputPass2.el.value) {


      this.errores.password = true;

    } else {
      this.errores.password = false;
    }

  }, this.timeToBlur);




}

