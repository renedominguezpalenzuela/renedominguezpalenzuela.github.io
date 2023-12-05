const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";
import { Paises } from "../../data/paises.js";
import { UImanager } from "../utils.js";




export class ForgotPassReq extends Component {

  // /api/private/users
 
  
  errores = useState({
    email: false,
  })

  showSpinner = useState({
    boton: true
  })


  state = useState({
    email: "",   
  })

  static template = xml`    
   
        <div class="tw-card  tw-w-[50%] tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-border">
       
      


        <div class="tw-card-body tw-items-center ">

     




            <!-- ************************************************************************* -->
            <!--               Telefono e Email                                            -->
            <!-- ************************************************************************* -->
           
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
               <!-- <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">
                      <span class="tw-label-text">Phone</span>
                    </label>                    
                    <input t-model="this.state.phoneToShow"  id="phone" name="phone" type="tel" class="tw-selectphone tw-input tw-input-bordered tw-w-full" t-on-input="onChangePhone" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"/>
                    <span t-if="this.errores.phoneField==true" class="error">
                       Invalid number!!!
                    </span>
                </div> -->

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">eMail</span>
                    </label>
                    <input type="text" t-model="this.state.email" placeholder="eMail" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangeEmail" t-on-blur="onBlurEmail"   />   
                    <span t-if="this.errores.email==true" class="error">
                      Required field!!!
                    </span>
                </div>
            </div>  


         

            <div class="tw-card-actions tw-mt-5">
            <button class="submit-btn tw-w-full" t-on-click="onSaveAllData">
            <!-- <span> -->
            Send
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
    this.errores.email = !UImanager.validMail(datos.email)
 
    for (let clave in this.errores) {
      if (this.errores[clave] == true) {
        console.log(clave)
        return false;

      }

    }
    return true;
  }






  async onSaveAllData() {

    if (!this.validarDatos(this.state)) {
      console.log("Validation Errors");
      return;
    } else {
      console.log("No hay error")
    }
    //this.showSpinner.boton = true;

    
    
    $.blockUI({ message: '<span> <img src="img/Spinner-1s-200px.png" /></span> ' });


    // A message with a verification code has been sent to your email address. Enter the code to continue. Didn’t get a verification code?


    var userID = null;


    try {


      let respuesta = null;
 
        //creando nuevo usuario
        respuesta = await API.requestOTPForChangePass(this.state.email)
        console.log("Respuesta  Request OTP for pass change")
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

        this.props.unafuncion(); 

        Swal.fire({
          icon: 'success',
          title: 'A verification code was sended to your email',
          text: 'Use it to change the password'
        })


       

      /*  Swal.fire({
          title: 'User data have been saved',
          text: this.props.newUser ? "A verification code is sended to your email" : "",
          icon: 'success',
          showCancelButton: false,
          // confirmButtonColor: '#3085d6',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'Ok',
          cancelButtonText: 'No'
        }).then(async (result) => {
          

        });*/


      } else {
        console.log("----ERROR: Respuesta del API----- ")
        console.log(respuesta)
        let respuestatxt = respuesta.response ? respuesta.response.data.message : "Not expected response, see console for details";
        if (!respuestatxt) {
          respuestatxt = respuesta.response.data
        }

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
     // $.unblockUI();
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: error.message
      })

    }

    this.showSpinner.boton = false;
    //$.unblockUI();

  }





  onBlurEmail = (event) => {
    this.errores.email = !UImanager.validMail(event.target.value);
  }

  onChangeEmail = API.debounce(async (event) => {
    this.errores.email =!UImanager.validMail(event.target.value);
  }, this.timeToBlur);








}

