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
    <div class="sm:grid sm:grid-cols-[50%_50%] gap-2 h-[100vh]">
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
        <!-- ************************************************************************* -->
        <!--                 Foto                                                      -->
        <!-- ************************************************************************* -->
        <div class="card-title flex flex-col rounded-lg">
            <div class="px-10 pt-10 ">
                <t t-if="this.state.avatar">
                  <div class="avatar">
                    <div class="w-24 mask mask-squircle">                
                        <img t-att-src="this.state.avatar" />
                    </div>
                  </div>  
                </t>
                <t t-else="">
                  <div class="avatar placeholder">
                    <div class="bg-neutral-focus text-neutral-content rounded-full w-24">
                      <span class="text-3xl">?</span>
                    </div>
                  </div>
                </t>
            </div>

            <div class="form-control  max-w-xs  ">
                <label class="label">
                  <span class="label-text">Pick a file</span>  
                </label>       
                <input t-on-input="onChangeAvatarInput" t-ref="inputAvatar"  type="file" class="file-input file-input-sm file-input-bordered w-full max-w-xs"  accept="image/jpeg, image/png, image/jpg"/>            
            </div>
        </div>





        <div class="card-body items-center ">
            <!-- ************************************************************************* -->
            <!--               Nombre y primer apellido                                    -->
            <!-- ************************************************************************* -->
            <div class="sm:flex sm:flex-row  w-full">
                <div class="form-control w-full  ">
                    <label class="label">
                       <span class="label-text">First Name</span>
                    </label>
                    <input type="text" t-model="this.state.firstName" placeholder="First Name" class="input input-bordered w-full "  /> 
                </div>

                <div class="form-control w-full  pl-1">
                    <label class="label">
                       <span class="label-text">Last Name</span>
                    </label>
                    <input type="text" t-model="this.state.lastName" placeholder="Last Name" class="input input-bordered w-full"  />   
                </div>
            </div>  

            <!-- ************************************************************************* -->
            <!--               Telefono e Email                                            -->
            <!-- ************************************************************************* -->
            <!-- t-on-input="onChangePhone" -->
            <div class="sm:flex sm:flex-row  w-full">
                <div class="form-control w-full  ">
                    <label class="label">
                      <span class="label-text">Phone</span>
                    </label>                    
                    <input t-model="this.state.phone"  id="phone" name="phone" type="tel" class="selectphone input input-bordered w-full"  />
                </div>

                <div class="form-control w-full  pl-1">
                    <label class="label">
                      <span class="label-text">eMail</span>
                    </label>
                    <input type="text" t-model="this.state.providerValue" placeholder="eMail" class="input input-bordered w-full "  />   
                </div>
            </div>  


            <!-- ************************************************************************* -->
            <!--              ID y BirthDay                                                -->
            <!-- ************************************************************************* -->
     
            <div class="sm:flex sm:flex-row  w-full">
                <div class="form-control w-full  ">
                    <label class="label">
                      <span class="label-text">ID Number</span>
                    </label>                    
                    <input type="text" t-model="this.state.identityNumber" placeholder="ID Number" class="input input-bordered w-full "  />                       
                </div>

                <div class="form-control w-full  pl-1">
                    <label class="label">
                      <span class="label-text">Birth Date</span>
                    </label>
                    <input type="date" t-model="this.state.birthDate" placeholder="Birth Date" class="input input-bordered w-full "  /> 
                    <!-- <input type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" />  -->
                </div>
            </div>  

            <div class="card-actions">
              
            </div>
        </div>
        </div>


        <!-- Card de la derecha -->
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg ">
            <div class="card-title flex flex-col rounded-lg">
                Address
            </div>
            <div class="card-body items-center ">
            <!-- ************************************************************************* -->
            <!--             Street and number                                             -->
            <!-- ************************************************************************* -->
     
            <div class="sm:flex sm:flex-row  w-full">
                <div class="form-control w-[80%]  ">
                    <label class="label">
                      <span class="label-text">Street</span>
                    </label>                    
                    <input type="text" t-model="this.state.street" placeholder="Street" class="input input-bordered w-full "  />                       
                </div>

                <div class="form-control w-[20%]  pl-1">
                    <label class="label">
                      <span class="label-text">House Number</span>
                    </label>
                    <input type="text" t-model="this.state.houseNumber" placeholder="House Number" class="input input-bordered w-full "  /> 
                    
                </div>
            </div>  

            <!-- ************************************************************************* -->
            <!--            Country and Province                                           -->
            <!-- ************************************************************************* -->
     
            <div class="sm:flex sm:flex-row  w-full">
                <div class="form-control w-full  ">
                    <label class="label">
                      <span class="label-text">Province</span>
                    </label>                    
                    <input type="text" t-model="this.state.province" placeholder="Province" class="input input-bordered w-full "  />                       
                </div>

                <div class="form-control w-full  pl-1">
                    <label class="label">
                      <span class="label-text">Country</span>
                    </label>
                    <input type="text" t-model="this.state.country" placeholder="Country" class="input input-bordered w-full "  /> 
                    
                </div>
            </div>  

            <!-- ************************************************************************* -->
            <!--            Zip Code    and Currency                                       -->
            <!-- ************************************************************************* -->
     
            <div class="sm:flex sm:flex-row  w-full">
                <div class="form-control w-[30%]  ">
                    <label class="label">
                      <span class="label-text">Zip Code</span>
                    </label>                    
                    <input type="text" t-model="this.state.zipcode" placeholder="Zip Code" class="input input-bordered w-full "  />                       
                </div>

               <!-- <div class="form-control w-full  pl-1">
                    <label class="label">
                      <span class="label-text">Country</span>
                    </label>
                    <input type="text" t-model="this.state.country" placeholder="Country" class="input input-bordered w-full "  /> 
                    
                </div> -->
            </div>  


           <!-- <div class="card-title flex flex-col rounded-lg mt-5">
             Passport and License
            </div> -->


            </div>
        </div>


        <button class="btn btn-primary w-[30%]" t-on-click="onSafeAllData">Save</button>

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