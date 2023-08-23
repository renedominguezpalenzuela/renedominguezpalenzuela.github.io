const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";
import { Paises } from "../../data/paises.js";




export class Profile extends Component {

  // /api/private/users


  inputAvatar = useRef("inputAvatar");




  state = useState({


    appVersion: "0.1",
    language: "EN",
    defaultCurrency: "USD",

    firstName: "",
    lastName: "",
    phone: "+1-202-555-0106",
    providerValue: "john.doe@test.ducapp.net",  //Correo
    identityNumber: "035742265",
    avatar: "/img/avatar.png",   //Variable temporal no enviar al endpoint

    //direccion
    street: "Schoenersville Rd",
    houseNumber: "2118",
    city: "PA",
    country: "United States",
    country_iso_code: "US",
    province: "Pennsylvania",
    zipcode: "18017",




    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATQAAAEzCAIAAAAw5mh...",
    source1: {
      url: "https://www.someimage.com/url/passportImage.jpg",
      name: "passportPicture",
      type: "mime/jpg",
      size: "50"
    },
    source2: {
      url: "https://www.someimage.com/url/licenceImage.jpg",
      name: "drivingLicence",
      type: "mime/jpg",
      size: "50"
    },

    birthDate: "1984-11-20",

    password: "$2y$10$EiZYJxdFvdTBfY97uTfU1e11U5vAFmxTnAQ5M.d0q8zU9",
    areConditionsAccepted: true
  })

  static template = xml`    
    <div class="sm:tw-grid sm:tw-grid-cols-[50%_50%] tw-gap-2 tw-h-[100vh]">
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
            <!--               Nombre y primer apellido                                    -->
            <!-- ************************************************************************* -->
            <div class="sm:tw-flex sm:tw-flex-row  tw-w-full">
                <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">
                       <span class="tw-label-text">First Name</span>
                    </label>
                    <input class="tw-input tw-input-bordered tw-w-full " type="text" t-model="this.state.firstName" placeholder="First Name"   /> 
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                       <span class="tw-label-text">Last Name</span>
                    </label>
                    <input type="text" t-model="this.state.lastName" placeholder="Last Name" class="tw-input tw-input-bordered tw-w-full"  />   
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
                    <input t-model="this.state.phone"  id="phone" name="phone" type="tel" class="tw-selectphone tw-input tw-input-bordered tw-w-full"  />
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">eMail</span>
                    </label>
                    <input type="text" t-model="this.state.providerValue" placeholder="eMail" class="tw-input tw-input-bordered tw-w-full "  />   
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
                    <input type="text" t-model="this.state.identityNumber" placeholder="ID Number" class="tw-input tw-input-bordered tw-w-full "  />                       
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">Birth Date</span>
                    </label>
                    <input type="date" t-model="this.state.birthDate" placeholder="Birth Date" class="tw-input tw-input-bordered tw-w-full "  /> 
                    <!-- <input type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" />  -->
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
                    <input type="text" t-model="this.state.street" placeholder="Street" class="tw-input tw-input-bordered tw-w-full "  />                       
                </div>

                <div class="tw-form-control tw-w-[20%]  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">House Number</span>
                    </label>
                    <input type="text" t-model="this.state.houseNumber" placeholder="House Number" class="tw-input tw-input-bordered tw-w-full "  /> 
                    
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
                    <input type="text" t-model="this.state.province" placeholder="Province" class="tw-input tw-input-bordered tw-w-full "  />                       
                </div>

                <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">Country</span>
                    </label>
                    <input type="text" t-model="this.state.country" placeholder="Country" class="tw-input tw-input-bordered tw-w-full "  /> 
                    
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
                    <input type="text" t-model="this.state.zipcode" placeholder="Zip Code" class="tw-input tw-input-bordered tw-w-full "  />                       
                </div>

               <!-- <div class="tw-form-control tw-w-full  tw-pl-1">
                    <label class="tw-label">
                      <span class="tw-label-text">Country</span>
                    </label>
                    <input type="text" t-model="this.state.country" placeholder="Country" class="tw-input tw-input-bordered tw-w-full "  /> 
                    
                </div> -->
            </div>  


           <!-- <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg tw-mt-5">
             Passport and License
            </div> -->


            </div>
        </div>


        <button class="tw-btn tw-btn-primary tw-w-[30%]" t-on-click="onSafeAllData">Save</button>

    </div>
      

      



        
     
    

  `;



  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');


    onWillStart(async () => {

      this.seleccionCodigosPaises = [];
      this.paises = Paises.filter(unPais => unPais.show).map((unPais, i) => {

          this.seleccionCodigosPaises.push(unPais.isoAlpha2)
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
 
      if (this.props.modificar === true) {
        const accessToken = window.localStorage.getItem('accessToken');
        const api = new API(accessToken);
        const userData = await api.getUserProfile();
        console.log(userData)

        //this.state = { ...userData }; //linea original
        //var {this.state.firstName, lastName} = userData;
        //this.state = { ...userData }; //linea original
        //const {c, d, ...partialObject} = object;

        this.state.firstName = userData.firstName
        this.state.lastName = userData.lastName;

        this.state.phone = userData.phone;
        this.state.providerValue = userData.providerValue;
        this.state.identityNumber = userData.identityNumber;

        //direccion
        this.state.street = userData.street;
        this.state.houseNumber = userData.houseNumber;
        this.state.city = userData.city;
        this.state.country = userData.country;
        this.state.country_iso_code = userData.country_iso_code;
        this.state.province = userData.province;
        this.state.zipcode = userData.zipcode;

        this.state.birthDate = userData.birthDate;
        //this.state.areConditionsAccepted = userData.areConditionsAccepted;

        //this.state.source1 = userData.source1;
        //this.state.source2 = userData.source2;
        this.state.avatar = userData.safeImage.image;
        this.state.image = userData.safeImage.image;

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

   //   this.phoneInput.addEventListener('countrychange', this.handleCountryChange);

  

  })
  }



  changeAvatarImage(newImage) {
    this.state.avatar = newImage;
    this.render();
  }

  onChangeAvatarInput() {

    let file = this.inputAvatar.el.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      this.changeAvatarImage(reader.result);
    }
    reader.readAsDataURL(file);


  }

  onSafeAllData() {
    delete this.state["beneficiaries"];
    console.log(this.state)

    Swal.fire('Not implemented yet,  more details about data is needed');
  }




}

//mount(Root, document.body);