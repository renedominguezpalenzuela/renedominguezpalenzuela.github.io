const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";
import { Paises } from "../../data/paises.js";




export class Profile extends Component {

  // /api/private/users


  inputAvatar = useRef("inputAvatar");
  inputPassport = useRef("inputPassport");
  inputDriverLicence = useRef("inputDriverLicence");


  inputPass1 = useRef("inputPass1");
  inputPass2 = useRef("inputPass2");

  iconPassVisibility1 = useRef("iconPassVisibility1");
  iconPassVisibility2 = useRef("iconPassVisibility2");

  errores = useState({
    phoneField: false,
    firstName: false,
    lastName: false,
    providerValue: false,
    identityNumber: false,
    street: false,
    houseNumber: false,
    city: false,
    country: false,
    country_iso_code: false,
    province: false,
    zipcode: false,
    password: false,
    image: false,
    source1: false,
    source2: false,
    birthDate: false
  })

  state = useState({

    appVersion: "0.1",
    language: "EN",
    defaultCurrency: "USD",

    firstName: "",
    lastName: "",
    phone: "",
    phoneToShow: "",
    providerValue: "",  //Correo
    identityNumber: "",
    avatar: "/img/avatar.png",   //Variable temporal no enviar al endpoint

    //direccion
    street: "",
    houseNumber: "",
    city: "",
    country: "",
    country_iso_code: "",
    province: "",
    zipcode: "",
    password: "",


    image: "",
    source1: {
      url: "",
      name: "",
      type: "",
      size: ""
    },
    source2: {
      url: "",
      name: "",
      type: "",
      size: ""
    },

    passportImg: "",
    driverlicenseImg: "",


    birthDate: "",
    password: '',
    // password: "$2y$10$EiZYJxdFvdTBfY97uTfU1e11U5vAFmxTnAQ5M.d0q8zU9",
    areConditionsAccepted: true
  })

  static template = xml`    
    <div class="sm:tw-grid sm:tw-grid-cols-[49%_49%] tw-gap-2 tw-h-full">
        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
        <!-- ************************************************************************* -->
        <!--                 Foto                                                      -->
        <!-- ************************************************************************* -->
        <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
            <div class="tw-px-10 tw-pt-10 ">
                <t t-if="this.state.avatar">
                  <div class="tw-avatar">
                    <div class="tw-w-24 tw-mask tw-mask-squircle">                
                        <img t-att-src="this.state.avatar" />
                    </div>
                  </div>  
                </t>
                <t t-else="">
                  <div class="tw-avatar tw-placeholder">
                    <div class="tw-bg-neutral-focus tw-text-neutral-content tw-rounded-full tw-w-24">
                      <span class="tw-text-3xl">?</span>
                    </div>
                  </div>
                </t>
            </div>

            <div class="tw-form-control  tw-max-w-xs  ">
                <label class="tw-label">
                  <span class="tw-label-text">Pick a file</span>  
                </label>       
                <input class="tw-file-input tw-file-input-sm tw-file-input-bordered tw-w-full tw-max-w-xs" t-on-input="onChangeAvatarInput" t-ref="inputAvatar"  type="file"   accept="image/jpeg, image/png, image/jpg"/>            
            </div>
        </div>

      


        <div class="tw-card-body tw-items-center ">

        <!-- ************************************************************************* -->
        <!--               Password                                                    -->
        <!-- ************************************************************************* -->
       
          <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
     

          <div class="tw-form-control tw-w-full  ">
          <label class="tw-label">
             <span class="tw-label-text">Password</span>
          </label>
            <div class="tw-join ">
                  <input  type="password"  class="tw-input tw-input-bordered tw-join-item tw-w-[85%] " placeholder="Password" t-ref="inputPass1"  t-model="this.state.password"/>
                  <button class="tw-btn tw-join-item tw-w-[15%]" t-on-click="toggler_visibility">
                    <i id="toggler1" class="far  fa-eye " t-ref="iconPassVisibility1"></i>
                  </button>
                    
              
            </div>
          </div>

          <div class="tw-form-control tw-w-full  tw-pl-1">
            <label class="tw-label">
            <span class="tw-label-text">Confirm Password</span>
            </label>
            <div class="tw-join  ">

            <input type="password"  class="tw-input tw-input-bordered tw-join-item tw-w-[85%]" placeholder="Confirm Password" t-ref="inputPass2"/>
            <button class="tw-btn tw-join-item tw-w-[15%]" t-on-click="toggler_visibility" >
            <i id="toggler2" class="far fa-eye " t-ref="iconPassVisibility2"></i>
            </button>


            </div>
          </div>
        </div>       

     



            <!-- ************************************************************************* -->
            <!--               Nombre y primer apellido                                    -->
            <!-- ************************************************************************* -->
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">
                       <span class="tw-label-text">First Name</span>
                    </label>
                    <input class="tw-input tw-input-bordered tw-w-full " type="text" t-model="this.state.firstName" placeholder="First Name"   t-on-input="onChangeFirstName" t-on-blur="onBlurFirstName" /> 
                    <span t-if="this.errores.firstName==true" class="error">
                      Required field!!!
                    </span>
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                       <span class="tw-label-text">Last Name</span>
                    </label>
                    <input type="text" t-model="this.state.lastName" placeholder="Last Name" class="tw-input tw-input-bordered tw-w-full"  t-on-input="onChangeLastName" t-on-blur="onBlurLastName"  />   
                    <span t-if="this.errores.lastName==true" class="error">
                       Required field!!!
                    </span>
                </div>
            </div>  

            <!-- ************************************************************************* -->
            <!--               Telefono e Email                                            -->
            <!-- ************************************************************************* -->
           
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">
                      <span class="tw-label-text">Phone</span>
                    </label>                    
                    <input t-model="this.state.phoneToShow"  id="phone" name="phone" type="tel" class="tw-selectphone tw-input tw-input-bordered tw-w-full" t-on-input="onChangePhone" />
                    <span t-if="this.errores.phoneField==true" class="error">
                       Invalid number!!!
                    </span>
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">eMail</span>
                    </label>
                    <input type="text" t-model="this.state.providerValue" placeholder="eMail" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangeProviderValue" t-on-blur="onBlurProviderValue"   />   
                    <span t-if="this.errores.providerValue==true" class="error">
                      Required field!!!
                    </span>
                </div>
            </div>  


            <!-- ************************************************************************* -->
            <!--              ID y BirthDay                                                -->
            <!-- ************************************************************************* -->
     
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">
                      <span class="tw-label-text">ID Number</span>
                    </label>                    
                    <input type="text" t-model="this.state.identityNumber" placeholder="ID Number" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangeIdentityNumber" t-on-blur="onBlurIdentityNumber"   />                       
                    <span t-if="this.errores.identityNumber==true" class="error">
                       Required field!!!
                    </span>
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">Birth Date</span>
                    </label>
                    <input type="date" t-model="this.state.birthDate" placeholder="Birth Date" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangebirthDate" t-on-blur="onBlurbirthDate" /> 
                 
                    <span t-if="this.errores.birthDate==true" class="error">
                    Required field!!!
                    </span>
                </div>
            </div>  

            <div class="tw-card-actions">
              
            </div>
        </div>
        </div>


        <!-- Card de la derecha -->
        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg ">
            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
                Address
            </div>
            <div class="tw-card-body tw-items-center ">
            <!-- ************************************************************************* -->
            <!--             Street and number                                             -->
            <!-- ************************************************************************* -->
     
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-[80%]  ">
                    <label class="tw-label">
                      <span class="tw-label-text">Street</span>
                    </label>                    
                    <input type="text" t-model="this.state.street" placeholder="Street" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangestreet" t-on-blur="onBlurstreet" />                       
                    <span t-if="this.errores.street==true" class="error">
                       Required field!!!
                    </span>
                </div>

                <div class="tw-form-control tw-w-auto  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">House Number</span>
                    </label>
                    <input type="text" t-model="this.state.houseNumber" placeholder="House Number" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangehouseNumber" t-on-blur="onBlurhouseNumber"  /> 
                    <span t-if="this.errores.houseNumber==true" class="error">
                       Required field!!!
                    </span>
                </div>
            </div>  

            <!-- ************************************************************************* -->
            <!--            Country and Province                                           -->
            <!-- ************************************************************************* -->
     
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">
                      <span class="tw-label-text">Province</span>
                    </label>                    
                    <input type="text" t-model="this.state.province" placeholder="Province" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeprovince" t-on-blur="onBlurprovince"  />                       
                    <span t-if="this.errores.province==true" class="error">
                       Required field!!!
                    </span>
                </div>
        

                <div class="tw-form-control tw-w-full  tw-pl-1">
                  <label class="tw-label">
                    <span class="tw-label-text">Country</span>
                  </label>  
                  <input type="text" id="country" class=" tw-input tw-input-bordered tw-w-full" t-on-input="onChangecountry" t-on-blur="onBlurcountry"  />      
                  <input type="hidden" id="country_code" />  
                  <span t-if="this.errores.country==true" class="error">
                     Required field!!!
                  </span>        
              
                
                </div>
            </div>  

            <!-- ************************************************************************* -->
            <!--            Zip Code    and Currency                                       -->
            <!-- ************************************************************************* -->
     
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-[30%]  ">
                    <label class="tw-label">
                      <span class="tw-label-text">Zip Code</span>
                    </label>                    
                    <input type="text" t-model="this.state.zipcode" placeholder="Zip Code" class="tw-input tw-input-bordered tw-w-full " t-on-input="onChangezipcode" t-on-blur="onBlurzipcode"   />   
                    <span t-if="this.errores.zipcode==true" class="error">
                    Required field!!!
                  </span>                    
                </div>

            
            </div>  


           <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg tw-mt-5">
             Passport and License
            </div> 

            <!-- ************************************************************************* -->
            <!--                 Passport                                                    -->
            <!-- ************************************************************************* -->
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                      <div class="tw-p-1 tw-text-center">
                        
                        <div class="tw-px-10 tw-pt-10 ">
                            <t t-if="this.state.passportImg">
                                <div class="tw-avatar">
                                    <div class="tw-w-24 tw-mask tw-mask-squircle">                
                                      <img t-att-src="this.state.passportImg" />
                                    </div>
                                </div>  
                            </t>
                            <t t-else="">
                                <div class="tw-avatar tw-placeholder">
                                    <div class="tw-bg-neutral-focus tw-text-neutral-content tw-rounded-md tw-w-24">
                                      <span class="tw-text-3xl">?</span>
                                    </div>
                                </div>
                            </t>
                            
                        </div>

                        <div class="tw-form-control  tw-max-w-xs  ">
                            <label class="tw-label">
                            <span class="tw-label-text">Pick a file</span>  
                            </label>       
                            <input class="tw-file-input tw-file-input-sm tw-file-input-bordered tw-w-full tw-max-w-xs" t-on-input="onChangePassportImg" t-ref="inputPassport"  type="file"   accept="image/jpeg, image/png, image/jpg"/>            
                        </div>

                        <div> Passport </div>
                      </div>

                      <div class="tw-p-1 tw-text-center">
                        
                          <div class="tw-px-10 tw-pt-10 ">
                              <t t-if="this.state.driverlicenseImg">
                                  <div class="tw-avatar">
                                      <div class="tw-w-24 tw-mask tw-mask-squircle">                
                                        <img t-att-src="this.state.driverlicenseImg" />
                                      </div>
                                  </div>  
                              </t>
                              <t t-else="">
                                  <div class="tw-avatar tw-placeholder">
                                      <div class="tw-bg-neutral-focus tw-text-neutral-content tw-rounded-md tw-w-24">
                                        <span class="tw-text-3xl">?</span>
                                      </div>
                                  </div>
                              </t>
                              
                          </div>

                          <div class="tw-form-control  tw-max-w-xs  ">
                              <label class="tw-label">
                              <span class="tw-label-text">Pick a file</span>  
                              </label>       
                              <input class="tw-file-input tw-file-input-sm tw-file-input-bordered tw-w-full tw-max-w-xs" t-on-input="onChangeDriverLicenceImg" t-ref="inputDriverLicence"  type="file"   accept="image/jpeg, image/png, image/jpg"/>            
                          </div>

                          <div> Driver License </div>
                    </div>

                      

               
            </div>
    


            </div>
        </div>


        <button class="tw-btn tw-btn-primary tw-w-[30%]" t-on-click="onSaveAllData">Save</button>

    </div>
      

      



        
     
    

  `;



  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');


    onWillStart(async () => {

      this.seleccionCodigosPaises = [];
      this.paises = Paises.filter(unPais => unPais.show).map((unPais, i) => {

        this.seleccionCodigosPaises.push(unPais.isoAlpha2.toLowerCase())
        return {
          id: unPais.id,
          name: unPais.name,
          // flag: "background-image: url('data:image/png;base64," + unPais.flag + "');",
          currency: unPais.currency.code,
          number: unPais.number,
          show: unPais.show,
          iso2: unPais.isoAlpha2,
          prefijo: unPais.prefijo
        }
      }

      );

      if (this.props.newUser === false) {
        const accessToken = window.localStorage.getItem('accessToken');
        const api = new API(accessToken);
        const userData = await api.getUserProfile();
        console.log("User profile")
        console.log(userData)


        const kyc = JSON.parse(userData.kyc.gatheredInfo);
        console.log(kyc);

        this.state.firstName = userData.firstName
        this.state.lastName = userData.lastName;

        this.state.phoneToShow = userData.phone;
        this.state.providerValue = userData.email;
        this.state.identityNumber = userData.identityNumber;

        //direccion
        this.state.street = userData.street;
        this.state.houseNumber = userData.houseNumber;
        this.state.city = userData.city;
        this.state.country = userData.country;
        this.state.country_iso_code = userData.country_iso_code;
        this.state.province = kyc.Location.City;
        this.state.zipcode = userData.zipcode;

        this.state.birthDate = userData.birthDate;
        //this.state.areConditionsAccepted = userData.areConditionsAccepted;

        //this.state.source1 = userData.source1;
        //this.state.source2 = userData.source2;
        this.state.avatar = userData.safeImage.image;

        this.state.birthDate = kyc.PersonInfo.YearOfBirth + "-" + kyc.PersonInfo.MonthOfBirth + "-" + kyc.PersonInfo.DayOfBirth;



      } else {
        window.localStorage.clear();
      }
    });

    onMounted(() => {

      this.phoneInput = document.querySelector("#phone");
      this.phonInputSelect = window.intlTelInput(this.phoneInput, {
        separateDialCode: true,   //el codigo del pais solo esta en el select de las banderas
        autoInsertDialCode: true, //coloca el codigo del pais en el input
        formatOnDisplay: false,  //si se teclea el codigo del pais, se selecciona la bandera ej 53 -- cuba
        // autoPlaceholder: "polite",
        // don't insert international dial codes
        nationalMode: false, //permite poner 5465731 en ves de +53 54657331
        initialCountry: "cu",
        //excludeCountries: ["in", "il"],
        preferredCountries: ["cu"],
        // display only these countries

        onlyCountries: this.seleccionCodigosPaises,

        utilsScript: "js/libs/intlTelIutils.js"
      });



      this.country = $("#country").countrySelect({

        /*        initialCountry: "cu",    
                preferredCountries: ["cu"],
                onlyCountries: this.seleccionCodigosPaises,
                preferredCountries: ['ca', 'gb', 'us']*/
        defaultCountry: "cu",
        onlyCountries: this.seleccionCodigosPaises,
        preferredCountries: ['ca', 'cu'],
        responsiveDropdown: true
      });








      //  this.countryInput.addEventListener('countrychange', this.handleCountryChange);

      //   this.phoneInput.addEventListener('countrychange', this.handleCountryChange);



    })
  }



  changeAvatarImage(newImage) {
    this.state.avatar = newImage;
    this.render();
  }

  handleCountryChange = () => {
    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData()


  }

  onChangeAvatarInput() {

    let file = this.inputAvatar.el.files[0];
    const fileInput = this.inputAvatar.el;

    const fileSize = fileInput.files[0].size / 1024 / 1024;

    if (fileSize > 5) {
      console.log("File to big")
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'File size must be less then 5 Mb',

      })
      return;
    }



    //this.state.image = "";

    let reader = new FileReader();
    reader.onloadend = () => {
      this.changeAvatarImage(reader.result);


      this.state.image = reader.result;
    }

    reader.readAsDataURL(file);


  }


  changePassportImg(newImage) {
    this.state.passportImg = newImage;
    this.render();
  }

  async onChangePassportImg() {

    let file = this.inputPassport.el.files[0];
    const fileInput = this.inputPassport.el;
    const respuesta = await API.uploadFileToAWS(fileInput);

    if (respuesta.status != 200) {
      return;
    }



    this.state.source1.url = respuesta.data.defaultUrl;
    this.state.source1.name = respuesta.data.fileName;
    this.state.source1.type = respuesta.data.type;
    this.state.source1.size = respuesta.data.size;



    let reader = new FileReader();
    reader.onloadend = () => {
      this.changePassportImg(reader.result);
    }

    reader.readAsDataURL(file);

  }


  changeDriverLicenceImg(newImage) {
    this.state.driverlicenseImg = newImage;
    this.render();
  }

  async onChangeDriverLicenceImg() {

    let file = this.inputDriverLicence.el.files[0];
    const fileInput = this.inputDriverLicence.el;
    const respuesta = await API.uploadFileToAWS(fileInput);

    if (respuesta.status != 200) {
      return;
    }

    this.state.source2.url = respuesta.data.defaultUrl;
    this.state.source2.name = respuesta.data.fileName;
    this.state.source2.type = respuesta.data.type;
    this.state.source2.size = respuesta.data.size;


    let reader = new FileReader();
    reader.onloadend = () => {
      this.changeDriverLicenceImg(reader.result);
    }
    reader.readAsDataURL(file);


  }






  validarDatos(datos) {


    //Validaciones si es update
    if (!this.props.newUser) {

      if (this.inputPass1.el.value || this.inputPass2.el.value && (this.inputPass1.el.value != this.inputPass2.el.value)) {
        Swal.fire({
          icon: 'error', title: 'Error',
          text: 'Passwords are not the same or are empty, please check'
        })
        return false;
      }



      return true;

    }






    //--------------------- Phone number --------------------------------------------
    //TODO: Validar que sea un numero correcto

    if (!libphonenumber.isValidNumber(datos.phone)) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Phone number is not correct'
      })
      return false;
    }

    if ((this.inputPass1.el.value != this.inputPass2.el.value) || !this.state.password.trim()) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Passwords are not the same or are empty, please check'
      })
      return false;
    }


    if (!this.state.firstName.trim()) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: "First Name can't be empty, please check"
      })
      return false;
    }

    if (!this.state.lastName.trim()) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: "Last Name can't be empty, please check"
      })
      return false;
    }



    /*
    if (!datos.destinations[0] || datos.destinations[0] === '') {
        Swal.fire({
            icon: 'error', title: 'Error',
            text: 'Please enter the phone number to recharge'
        })
        return false;
    }

    //--------------------- Receiver Name --------------------------------------------
    if (!datos.receiverName || datos.receiverName === '') {
        Swal.fire({
            icon: 'error', title: 'Error',
            text: "Please enter receiver's name"
        })
        return false;
    }

    //--------------------- Currency --------------------------------------------
    if (!datos.currency || datos.currency === '') {
        Swal.fire({
            icon: 'error', title: 'Error',
            text: 'Please select currency'
        })
        return false;
    }
    */




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


  onChangePhone = API.debounce(async (event) => {
    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;

    this.state.phoneToShow = event.target.value
    this.state.phone = cod_pais + event.target.value

    const isValidNumber = libphonenumber.isValidNumber(this.state.phone)

    if (!isValidNumber) {
      this.errores.phoneField = true;
      return;
    } else {
      this.errores.phoneField = false;
    }

  }, 400);





  async onSaveAllData() {

    var countryData = $("#country").countrySelect("getSelectedCountryData");
    this.state.country = countryData.name;
    this.state.country_iso_code = countryData.iso2;
    this.state.city = this.state.province ? this.state.province.substring(0, 2) : "";

    const datosAEnviar = this.prepararDatosaEnviar(this.state);
    console.log(datosAEnviar)

    console.log("Datos enviados 2:")
    console.log(this.state)

    


    if (!this.validarDatos(datosAEnviar)) {
      console.log("Validation Errors");
      return;
    }
    // A message with a verification code has been sent to your email address. Enter the code to continue. Didn’t get a verification code?




    try {


      let respuesta = null;
      if (this.props.newUser) {
        //creando nuevo usuario
        respuesta = await API.createUser(datosAEnviar)
      } else {
        //modificando usuario
        //Solo enviar campos que no estan vacios

        //respuesta = await API.actualizarUser(datosparaUpdate)



      }

      // console.log(respuesta)

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

      if (cod_respuesta == 200) {
        console.log("---- Respuesta OK ----- ")
        console.log(respuesta)

      
        Swal.fire('User data have been saved');
        /*if (this.props.newUser) {
          this.verificarUsuario();
        }*/
        //ir hacia el login si es crear usuario





      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error: ' + cod_respuesta,
          text: respuesta.response.data.message
        })
        console.log("----ERROR: Respuesta del API----- ")
        console.log(respuesta)
      }

    } catch (error) {
      console.log("----ERROR: Sin Respuesta del API----- ")
      console.log(error)

      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: error.message
      })

    }

    //Swal.fire('Not implemented yet,  more details about data is needed');
  }

  verificarUsuario(IDUsuario) {
    Swal.fire({
      title: 'A message with a verification code has been sent to your email address. Enter the code to continue',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      preConfirm: (verificationCode) => {

        console.log("Obtener dato")
        console.log(verificationCode)

        return {

          code: verificationCode
        }

        /*
         return fetch(`//api.github.com/users/${login}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText)
            }
            console.log("preConfirm")
            console.log(response)
            return response.json()
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
          */

      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      console.log("then")
      console.log(result.value.code)
      console.log(IDUsuario)
      if (result.isConfirmed) {
        //si usuario le dio al boton confirmar
        /*value: {
          contiene la respuesta del paso anterior
          result.value.code
        }*/

        Swal.fire({
          title: `Codigo de verificacion: ${result.value.code}`

        })
      }
    })
  }


  prepararDatosaEnviar(datosIniciales) {
    let datos = { ...datosIniciales }

    delete datos["beneficiaries"];
    delete datos["avatar"];

    delete datos["driverlicenseImg"];
    delete datos["passportImg"];
    delete datos["phoneToShow"];

    if (!datos.firstName) delete datos["firstName"];
    if (!datos.lastName) delete datos["lastName"];

    if (!datos.phone) delete datos["phone"];
    if (!datos.providerValue) delete datos["providerValue"];
    if (!datos.identityNumber) delete datos["identityNumber"];

    if (!datos.street) delete datos["street"];
    if (!datos.houseNumber) delete datos["houseNumber"];
    if (!datos.country) delete datos["country"];
    if (!datos.country_iso_code) delete datos["country_iso_code"];
    if (!datos.province) delete datos["province"];
    if (!datos.zipcode) delete datos["zipcode"];

    if (!datos.password) delete datos["password"];
    if (!datos.image) delete datos["image"];


    if (datos.source1 && !datos.source1.url) delete datos["source1"];
    if (datos.source2 && !datos.source2.url) delete datos["source2"];

    if (!datos.birthDate) delete datos["birthDate"];




    return datos
  }


  
  validarSiVacio(dato) {
    let error = false;
    if (this.props.newUser && !dato) {
       error = true;
    }
    return error;

  }


  timeToBlur = 500;
  onBlurFirstName = (event)=>{  
      this.errores.firstName = this.validarSiVacio(event.target.value);
  }

  onChangeFirstName = API.debounce(async (event) => {
    this.errores.firstName = this.validarSiVacio(event.target.value);
  }, this.timeToBlur);


  
  onBlurLastName = (event)=>{  
    this.errores.lastName = this.validarSiVacio(event.target.value);
  }

  onChangeLastName = API.debounce(async (event) => {
    this.errores.lastName = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


    
  onBlurProviderValue = (event)=>{  
    this.errores.providerValue = this.validarSiVacio(event.target.value);
  }

  onChangeProviderValue = API.debounce(async (event) => {
    this.errores.providerValue = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  
    
  onChangeIdentityNumber = API.debounce(async (event) => {
    this.errores.identityNumber = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurIdentityNumber = (event)=>{  
    this.errores.identityNumber = this.validarSiVacio(event.target.value);
  }

    
  onChangebirthDate = API.debounce(async (event) => {
    this.errores.birthDate = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurbirthDate = (event)=>{  
    this.errores.birthDate = this.validarSiVacio(event.target.value);
  }

  onChangestreet = API.debounce(async (event) => {
    this.errores.street = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurstreet = (event)=>{  
    this.errores.street = this.validarSiVacio(event.target.value);
  }


  onChangehouseNumber = API.debounce(async (event) => {
    this.errores.houseNumber = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurhouseNumber = (event)=>{  
    this.errores.houseNumber = this.validarSiVacio(event.target.value);
  }

  
  onChangeprovince = API.debounce(async (event) => {
    this.errores.province = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurprovince = (event)=>{  
    this.errores.province = this.validarSiVacio(event.target.value);
  }

  onChangecountry = API.debounce(async (event) => {
    this.errores.country = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurcountry = (event)=>{  
    this.errores.country = this.validarSiVacio(event.target.value);
  }


  onChangezipcode = API.debounce(async (event) => {
    this.errores.zipcode = this.validarSiVacio(event.target.value);
  },  this.timeToBlur);


  onBlurzipcode = (event)=>{  
    this.errores.zipcode = this.validarSiVacio(event.target.value);
  }










}

