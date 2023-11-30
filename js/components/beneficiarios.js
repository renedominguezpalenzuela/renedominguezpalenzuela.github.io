const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";

import { ListaBeneficiarios } from "./listaBeneficiarios.js";

import { Paises } from "../../data/paises.js";

//TEST: agregar nuevo beneficiario, comprobar que esta en la lista, que esta el localstorage
/*
IDs
benListaBeneficiarios
benfirstName
benlastName
benSecondLastName
benID
phone
benAddress
benhouseNo
benZipCode
benEmail
benProvincia
benMunicipio
benSelectedCard
benCardNumber
benCardHolderName
benSaveBeneficiario
benSaveCard
*/

export class Beneficiarios extends Component {

    static components = { ListaBeneficiarios };

    tiempoDebounce = 1000; //milisegundos

    accessToken = '';

    creandoNuevoBeneficiario = true;


    inputCardNumber = useRef("inputCardNumber");
    inputCardHolderName = useRef("inputCardHolderName");

    //"creditCards": ["9225 1234 1234 1234"]

    state = useState({
        _id: '',
        identityNumber: '',
        firstName: '',
        lastName: '',
        secondLastName: '',
        phone: '',
        streetName: '',
        houseNumber: '',
        zipcode: '',
        email: '',
        zone: '',
        province: '',
        municipality: '',
        countryIsoCode: "CU",
        country: "Cuba",
        selectedBeneficiaryId: '-1',
        selectedCardId: '-1',
        creditCards: [],

    })

    errores = useState({
        identityNumber: false,
        firstName: false,
        lastName: false,
        secondLastName: false,
        phone: false,
        streetName: false,
        houseNumber: false,
        zipcode: false,
        email: false,
        province: false,
        municipality: false,
        card: false

    })

    allDatosBeneficiariosFromStorage = useState({
        datos: []
    })




    cardsList = useState({});

    //TODO: mask in input 0000-0000-0000-0000
    static template = xml`  
    <div class="sm:tw-grid sm:tw-grid-cols-[54%_44%] sm:tw-gap-2 tw-h-full">
    <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
      <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
          
      </div>

      



      <div class="tw-card-body tw-items-center  ">
       
        
                    <div class="sm:tw-grid sm:tw-grid-cols-1 sm:tw-grid-cols-2 tw-w-full sm:tw-grid-rows-10  tw-gap-y-0 sm:tw-gap-x-2 ">
                                
                        <!-- Seleccionar beneficiario -->
                        <div class="tw-form-control tw-w-full sm:tw-row-start-1 sm:tw-col-start-1  ">
                            <label class="tw-label">
                                <span class="tw-label-text">Select  Beneficiary</span>
                            </label>
                            <select  id="benListaBeneficiarios" t-att-value="this.state.selectedBeneficiaryId" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeSelectedBeneficiario">
                                <option  t-att-value="-1" >Select or enter new data</option>
                                <t t-foreach="this.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                                    <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                                </t>             
                            </select>
                        </div> 

                        <div class=" tw-w-full sm:tw-row-start-1 sm:tw-col-start-2 tw-flex tw-justify-start tw-items-end tw-mt-3  ">
                            <button class="tw-btn btn-secundary  tw-w-[38%] tw-mr-3" t-on-click="onNewBeneficiario">New</button>
                            
                          
                            
                        </div>

                        
                
                        <!-- Nombre -->
                    
                        <div class="tw-w-full  sm:tw-row-start-3 sm:tw-col-span-2 sm:tw-col-start-1 sm:tw-flex sm:tw-justify-start      ">
                            <div class="tw-form-control  ">
                                <label class="tw-label">
                                    <span class="tw-label-text">First Name</span>
                                </label>
                                <input id="benfirstName" type="text" t-att-value="this.state.firstName" t-on-input="onChangeFirstName" t-on-blur="onBlurFirstName"   maxlength="300" placeholder="First name" class="tw-input tw-input-bordered tw-w-full " />   
                                <span t-if="this.errores.firstName==true" class="error">
                                  Required field!!!
                                </span>
                            </div>

                            <div class="tw-form-control   sm:tw-ml-2 ">
                                <label class="tw-label">
                                    <span class="tw-label-text">Last Name</span>
                                </label>
                                <input id="benlastName" type="text" t-att-value="this.state.lastName"  t-on-input="onChangeLastName"  t-on-blur="onBlurLastName" maxlength="300" placeholder="Last name" class="tw-input tw-input-bordered  tw-w-full " /> 
                                <span t-if="this.errores.lastName==true" class="error">
                                  Required field!!!
                                </span>
                            </div>

                            <div class="tw-form-control sm:tw-ml-2">     
                                <label class="tw-label">
                                    <span class="tw-label-text">Second Last Name</span>
                                </label>
                                <input id="benSecondLastName" type="text" t-att-value="this.state.secondLastName" t-on-input="onChangeSecondLastName" t-on-blur="onBlurSecondLastName" maxlength="300" placeholder="Second last name" class="tw-input tw-input-bordered tw-w-full " />  
                                <span t-if="this.errores.secondLastName==true" class="error">
                                  Required field!!!
                                </span>
                            </div> 
                        </div>

                        <!-- Identificacion -->
                        <div class="tw-form-control tw-w-full sm:tw-row-start-4 sm:tw-col-start-1">
                            <label class="tw-label">
                                <span class="tw-label-text">ID</span>
                            </label>
                            <input id="benID" type="text" t-att-value="this.state.identityNumber"  maxlength="300" placeholder="ID" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeIDInput"  t-on-blur="onBlurIDInput" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" />   
                            <span t-if="this.errores.identityNumber==true" class="error">
                              Required field or not valid format!!!
                            </span>

                        </div>
                    
                        <!-- Telefono -->
                        <div class="tw-form-control tw-w-full sm:tw-row-start-4 sm:tw-col-start-2">
                            <label class="tw-label">
                                <span class="tw-label-text">Contact Phone</span>
                            </label>
                            <input   id="phone" name="phone" type="tel"   t-att-value="this.state.phone"  maxlength="300" placeholder="" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangePhoneInput"  t-on-blur="onBlurPhone" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" />   
                            <span t-if="this.errores.phone==true" class="error">
                               Incorrect Phone number!!!
                            </span>
                        </div>

                    
                        <!-- Address -->
                        <div class="tw-w-full  sm:tw-row-start-5 sm:tw-col-span-2 sm:tw-col-start-1 sm:tw-flex sm:tw-justify-start ">
                            <div class="tw-form-control  sm:tw-w-[70%]">
                                <label class="tw-label">
                                    <span class="tw-label-text">Street Name</span>
                                </label>
                                <input id="benAddress" type="text" t-att-value="this.state.streetName" t-on-input="onChangeStreetName"  t-on-blur="onBlurStreetName"  maxlength="300" placeholder="Street Name" class="tw-input tw-input-bordered tw-w-full " />   
                                <span t-if="this.errores.streetName==true" class="error">
                                    Required field!!!
                                </span>

                            </div>

                            <div class="tw-form-control    sm:tw-ml-2 ">
                                <label class="tw-label">
                                    <span  id="benhouseNo" class="tw-label-text">House Number</span>
                                </label>
                                <input type="text" t-att-value="this.state.houseNumber"  t-on-input="onChangeHouseNumber"  t-on-blur="onBlurHouseNumber" maxlength="300" placeholder="House Number" class="tw-input tw-input-bordered  tw-w-full " /> 
                                <span t-if="this.errores.houseNumber==true" class="error">
                                    Required field!!!
                                </span>
                            </div>

                            <div class="tw-form-control  sm:tw-ml-2">     
                                <label class="tw-label">
                                    <span class="tw-label-text">Zip Code</span>
                                </label>
                                <input id="benZipCode" type="text" t-att-value="this.state.zipcode" t-on-input="onChangeZipCode"  t-on-blur="onBlurZipCode" maxlength="300" placeholder="Zip Code" class="tw-input tw-input-bordered tw-w-full " />  
                                <span t-if="this.errores.zipcode==true" class="error">
                                    Required field!!!
                                </span>

                            </div> 
                        </div>

                        <!-- Email -->
                        <div class="tw-form-control tw-w-full sm:tw-row-start-6 sm:tw-col-start-1">
                            <label class="tw-label">
                                <span class="tw-label-text">Email Address</span>
                            </label>
                            <input id="benEmail" type="email" t-att-value="this.state.email"  maxlength="300" placeholder="Email Address" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeEmail"  t-on-blur="onBlurEmail" />   
                            <span t-if="this.errores.email==true" class="error">
                              Incorrect email!!!
                            </span>

                        </div>


                        
                        <!-- Provincia -->
                        <div class="tw-form-control tw-w-full sm:tw-row-start-7 sm:tw-col-start-1">
                        <label class="tw-label">
                            <span class="tw-label-text">Province</span>
                        </label>
                        <select id="benProvincia" t-att-value="this.state.provinceID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeProvince">
                        <option t-att-disabled="true" t-att-value="-1" >Select Province</option>
                            <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                            <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                            </t>             
                        </select>
                        <span t-if="this.errores.province==true" class="error">
                           Required field!!!
                        </span>
                        </div>

                        <!-- Municipio -->
                        <div class="tw-form-control tw-w-full sm:tw-row-start-7 sm:tw-col-start-2">
                        <label class="tw-label">
                            <span class="tw-label-text">City</span>
                        </label>
                        <select id="benMunicipio" t-att-value="this.state.municipalityID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeCity">
                            <option t-att-disabled="true" t-att-value="-1" >Select city</option>
                            <t t-foreach="this.municipios" t-as="unMunicipio" t-key="unMunicipio.id">
                            <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
                            </t>             
                        </select>
                        <span t-if="this.errores.municipality==true" class="error">
                           Required field!!!
                        </span>
                        </div>

                        <!-- Pais -->
                        <div class="tw-form-control tw-w-full  sm:tw-row-start-8 sm:tw-col-start-2 ">
                            <label class="tw-label">
                                <span class="tw-label-text">Country</span>
                            </label>
                            <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="tw-input tw-input-bordered tw-w-full"  t-on-input="onChangeCountryInput" />   
                        </div>  
                    </div> 

                   
      </div>
    </div>



        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg ">
            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
                Card Data (optional)
            </div>
            <div class="tw-card-body tw-items-center ">
                <div class="tw-form-control tw-w-full  sm:tw-row-start-8 sm:tw-col-start-1">
                    <label class="tw-label">
                        <span class="tw-label-text">Select Card</span>
                    </label>
                    <select  id="benSelectedCard" t-att-value="this.state.selectedCardId" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeSelectedCard">
                        <option  t-att-value="-1" >Select or enter new data</option>
                        <t t-foreach="this.cardsList" t-as="unCard" t-key="unCard.id">
                           <option t-att-value="unCard.id">
                            <t t-esc="unCard.cardHolderName"/>  <t t-esc="unCard.number"/>
                           </option>
                          
                        </t>             
                    </select>
                </div>
                <!-- <t t-esc="unCard.currency"/> -->
                

                <div class="tw-form-control tw-w-full  sm:tw-row-start-9 sm:tw-col-start-1">
                    <label class="tw-label">
                        <span class="tw-label-text">Card Number</span>
                    </label>
                    <input id="benCardNumber" type="text" t-ref="inputCardNumber" t-att-value="this.state.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="tw-input tw-input-bordered tw-w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                    <span t-if="this.errores.card==true" class="error">
                     Card Number Error!!!
                    </span>
                </div>

                <div class=" tw-flex tw-items-center tw-w-full sm:tw-row-start-9 sm:tw-col-start-2 tw-mt-1">
                <img t-att-src="this.state.cardBankImage" alt="" class="tw-ml-3  sm:tw-w-[10vw] tw-w-[30vw]"/>
            </div>

                <div class="tw-form-control tw-w-full  sm:tw-row-start-10 sm:tw-col-start-2 ">
                    <label class="tw-label">
                        <span class="tw-label-text">Card Holder Name</span>
                    </label>
                    <input id="benCardHolderName" type="text" t-ref="inputCardHolderName" t-att-value="this.state.cardHolderName" maxlength="300" placeholder="" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeCardHolderInput" />   
                   
                </div>

               

                <div class="tw-card-actions">
                    <div class="tw-flex">    
                        <button id="benNewCard" class="tw-btn   tw-mr-3" t-on-click="onNewCard">New Card </button>             
                        <button id="benSaveCard" class="tw-btn  tw-mr-3" t-on-click="onSaveCard">Save Card </button>                    
                    </div>
                
                  
                </div>

            </div>
        </div>

        <div class="tw-card-actions">
                <div class=" tw-w-full tw-flex tw-justify-start  tw-mt-3 tw-mb-2  ">
                      <button id="benSaveBeneficiario" class="btn-primary  tw-w-[30%] tw-mr-3" t-on-click="onSaveBeneficiario">Save</button>
                </div>

      
        </div>


      

  </div>


  <ListaBeneficiarios  listaBeneficiarios="this.allDatosBeneficiariosFromStorage.datos" 
        onChangeSelectedBeneficiary.bind="this.onChangeSelectedBeneficiary"/>
        
    

    

  `;

    static props = ["urlHome"];

    static defaultProps = {
        urlHome: '/',
    };


    setup() {

        this.accessToken = API.getTokenFromsessionStorage();

        API.setRedirectionURL(this.props.urlHome);

        this.beneficiariosNames = [];
        this.provincias = []
        this.municipios = []
        this.cardsList = []





        onWillStart(async () => {
            this.provincias = Provincias;
            this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);

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


            //obteniendo todos los datos de los beneficiarios desde el API
            if (this.accessToken) {

                const api = new API(this.accessToken);
                const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();

                //console.log(allDatosBeneficiarios)

                if (allDatosBeneficiarios) {
                    window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
                }
                this.allDatosBeneficiariosFromStorage.datos = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));

                if (this.allDatosBeneficiariosFromStorage.datos) {
                    this.beneficiariosNames = this.allDatosBeneficiariosFromStorage.datos.map(el => ({
                        beneficiaryFullName: el.beneficiaryFullName,
                        _id: el._id
                    }));
                }

            } else {


                console.error("NO ACCESS TOKEN - Beneficiario")
                await window.location.assign(API.redirectURLLogin);
                return;

            }





        });

        onRendered(() => {

        });

        onMounted(() => {

            //this.state.selectedCardId = "-1";

            //this.inicializarDatosBeneficiario(this.beneficiariosNames[0]._id);
            this.onNewBeneficiario();

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
                //preferredCountries: ["cu"],
                // display only these countries
                //  onlyCountries: this.seleccionCodigosPaises,
                onlyCountries: ["cu"],
                utilsScript: "js/libs/intlTelIutils.js"
            });

        });

    }





    onChangeSelectedBeneficiario = (event) => {
        this.onNewBeneficiario();
        const selectedBeneficiaryId = event.target.value;
        this.selectedBeneficiaryId = selectedBeneficiaryId;

        this.state.cardBankImage = "";
        this.state.bankName = "";
        this.creandoNuevoBeneficiario = false;
        this.inicializarDatosBeneficiario(selectedBeneficiaryId);
    }




    validarSiVacio(dato) {
        let error = false;
        if (!dato) {
            error = true;
        }
        return error;

    }




    onChangeFirstName = API.debounce(async (event) => {
        this.state.firstName = event.target.value;
        this.errores.firstName = this.validarSiVacio(event.target.value);
    }, API.tiempoDebounce);

    onBlurFirstName = (event) => {
        this.errores.firstName = this.validarSiVacio(event.target.value);
    }

    onChangeLastName = API.debounce(async (event) => {
        this.state.lastName = event.target.value;
        this.errores.lastName = this.validarSiVacio(event.target.value);
    }, API.tiempoDebounce);

    onBlurLastName = (event) => {
        this.errores.lastName = this.validarSiVacio(event.target.value);
    }

    onChangeSecondLastName = API.debounce(async (event) => {
        this.state.secondLastName = event.target.value;
        this.errores.secondLastName = this.validarSiVacio(event.target.value);
    }, API.tiempoDebounce);

    onBlurSecondLastName = (event) => {
        this.errores.secondLastName = this.validarSiVacio(event.target.value);
    }




    onChangeIDInput = API.debounce(async (event) => {
        this.state.identityNumber = event.target.value;
        this.errores.identityNumber = UImanager.validarCI(event.target.value)


    }, API.tiempoDebounce);

    onBlurIDInput = (event) => {
        this.errores.identityNumber = UImanager.validarCI(event.target.value);

    }

    onChangePhoneInput = API.debounce(async (event) => {
        this.state.phone = event.target.value;
        const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
        const moneda = this.state.currency;
        const telefono = cod_pais + this.state.phone;
        const isValidNumber = libphonenumber.isValidNumber(telefono)
        if (!isValidNumber) {
            this.errores.phone = true;
            return;
        } else {
            this.errores.phone = false;
        }
    }, API.tiempoDebounce);

    onBlurPhone = (event) => {
        this.state.phone = event.target.value;
        const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
        const moneda = this.state.currency;
        const telefono = cod_pais + this.state.phone;
        const isValidNumber = libphonenumber.isValidNumber(telefono)
        if (!isValidNumber) {
            this.errores.phone = true;
            return;
        } else {
            this.errores.phone = false;
        }
    }

    onChangeStreetName = API.debounce(async (event) => {
        this.state.streetName = event.target.value;
        this.errores.streetName = this.validarSiVacio(this.state.streetName);
    }, API.tiempoDebounce);

    onBlurStreetName = (event) => {
        this.errores.streetName = this.validarSiVacio(event.target.value);
    }

    onChangeHouseNumber = API.debounce(async (event) => {
        this.state.houseNumber = event.target.value;
        this.errores.houseNumber = this.validarSiVacio(this.state.houseNumber);
    }, API.tiempoDebounce);

    onBlurHouseNumber = (event) => {
        this.errores.houseNumber = this.validarSiVacio(event.target.value);
    }



    onChangeZipCode = API.debounce(async (event) => {
        this.state.zipcode = event.target.value;
        this.errores.zipcode = this.validarSiVacio(this.state.zipcode);
    }, API.tiempoDebounce);

    onBlurZipCode = (event) => {
        this.errores.zipcode = this.validarSiVacio(event.target.value);
    }

    onChangeEmail = API.debounce(async (event) => {

        this.state.email = event.target.value;
        this.errores.email = !UImanager.validMail(this.state.email);
    }, API.tiempoDebounce);

    onBlurEmail = (event) => {

        this.errores.email = !UImanager.validMail(this.state.email);
    }



    //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
    onChangeProvince = (event) => {
        if (this.inicializando) return;
        const selectedProvinceId = event.target.value;
        this.state.provinceID = event.target.value;
        let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
        if (selectedProvince) {
            this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);
            this.state.municipalityID = -1;
            this.state.municipality = '';
            this.state.province = selectedProvince.nombre;
            this.state.zone = selectedProvince.id === "4" ? "Habana" : "Provincias";
            this.errores.province = false;

        }
    };

    //Evento al cambiar de municipio
    onChangeCity = (event) => {
        if (this.inicializando) return;
        const selectedCityId = event.target.value;
        let selectedMunicipio = this.municipios[selectedCityId];
        //console.log(selectedMunicipio)
        if (selectedMunicipio) {
            this.state.municipality = selectedMunicipio.nombre;
            this.state.municipalityID = selectedCityId;
            this.state.zone = this.state.provinceID === "4" ? "Habana" : "Provincias";
            this.errores.municipality = false;
        }
    };





    //t-on-keydown="onCardInputKeyDown"
    /*  onCardInputKeyDown = API.debounce(async (event) => {
          console.log(event)
  
          this.state.cardNumber = event.target.value;
  
  
          this.inputCardNumber.el.value = UImanager.formatCardNumber(event.target.value);
          if (event.target.value.length === 19) {
  
  
              this.buscarLogotipoBanco(this.state.cardNumber);
  
              //TODO: si es un card nuevo agregarlo?
          }
      }, API.tiempoDebounce);*/


    //t-on-keydown="onCardInputKeyDown"
    onCardInputKeyDown = (event) => {

        const key = event.key; // const {key} = event; ES6+
        if (key === "Backspace" || key === "Delete") {
            this.backspace = true;
        } else {
            this.backspace = false
        }


    }



    //t-on-input
    async onChangeCardInput(event) {

        console.log(event)
        console.log(`state.cardNumber ${this.state.cardNumber}`)
        console.log(`input.cardNumber ${this.inputCardNumber.el.value}`)
        if (!this.backspace) {
            this.inputCardNumber.el.value = UImanager.formatCardNumber(event.target.value);

        }

        this.state.cardNumber = this.inputCardNumber.el.value;


        if (event.target.value.length === 19) {
            const tarjeta = await UImanager.buscarLogotipoBanco(this.state.cardNumber, this.accessToken);
            this.state.cardBankImage = tarjeta.cardBankImage;
            this.state.bankName = tarjeta.bankName;
            this.errores.card = !tarjeta.tarjetaValida;
        } else {
            this.state.cardBankImage = '';
            this.state.bankName = '';
            this.errores.card = true;
        }

        if (event.target.value==='') {
            this.errores.card = false;
        }


    };




    onChangeCardHolderInput = API.debounce(async (event) => {
        this.state.cardHolderName = event.target.value;
    }, API.tiempoDebounce);





    onChangeSelectedCard = async (event) => {
        const id = event.target.value;
        this.state.selectedCardId = id;
        console.log('Card Seleccionado')
        console.log(id)

        if (id === '-1') {
            return
        }



        const cardData = this.cardsList.filter((unaCard) => unaCard.id == id)[0];

        if (cardData) {
            const formatedCardNumber = UImanager.formatCardNumber(cardData.number)
            this.state.cardNumber = formatedCardNumber;
            this.state.cardHolderName = cardData.cardHolderName;
            // await this.buscarLogotipoBanco(this.state.cardNumber);

            const tarjeta = await UImanager.buscarLogotipoBanco(this.state.cardNumber, this.accessToken);
            this.state.cardBankImage = tarjeta.cardBankImage;
            this.state.bankName = tarjeta.bankName;
            this.errores.card = !tarjeta.tarjetaValida;
        }
        //else {
        //    this.state.cardNumber = '';
        //    this.state.cardHolderName = '';
        //}
    }


    inicializarDatosBeneficiario = async (idBeneficiario) => {
        this.state.selectedBeneficiaryId = idBeneficiario;


        if (idBeneficiario === '-1') {
            this.creandoNuevoBeneficiario = true;
            this.state.identityNumber = '';
            this.state.firstName = '';
            this.state.lastName = '';
            this.state.secondLastName = '';
            this.state.phone = '';
            this.state.streetName = '';
            this.state.houseNumber = '';
            this.state.zipcode = '';
            this.state.email = '';
            this.state._id = '';
            this.state.provinceID = "-1";
            this.state.province = "";
            this.state.municipalityID = -1;
            this.state.municipality = '';
            this.state.creditCards = [];

            return;

        }
        this.allDatosBeneficiariosFromStorage.datos = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
        const selectedBenefiarioData = this.allDatosBeneficiariosFromStorage.datos.filter(unDato => unDato._id === idBeneficiario)[0];




        if (selectedBenefiarioData) {
            this.inicializando = true;


            this.state.identityNumber = selectedBenefiarioData.deliveryCI;
            this.state.firstName = selectedBenefiarioData.deliveryContact;
            this.state.lastName = selectedBenefiarioData.deliveryLastName;
            this.state.secondLastName = selectedBenefiarioData.deliverySecondLastName;
            this.state.phone = selectedBenefiarioData.deliveryPhone;
            this.state.streetName = selectedBenefiarioData.streetName;
            this.state.houseNumber = selectedBenefiarioData.houseNumber;
            this.state.zipcode = selectedBenefiarioData.zipcode;
            this.state.email = selectedBenefiarioData.email;
            this.state._id = selectedBenefiarioData._id;


            //this.state.deliveryAddress = selectedBenefiarioData.houseNumber + ', ' + selectedBenefiarioData.streetName + '. ZipCode: ' + selectedBenefiarioData.zipcode;


            this.errores.email = !UImanager.validMail(this.state.email);


            this.state.cardHolderName = '';

            //Inicializando provincia
            const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === selectedBenefiarioData.deliveryArea)[0];
            //console.log(selectedProvince)
            if (selectedProvince) {
                this.state.provinceID = selectedProvince.id;
                this.state.province = selectedProvince.nombre;
            } else {
                this.state.provinceID = "-1";
                this.state.province = "";
                this.state.municipalityID = -1;
                this.state.municipality = '';
                return;
            }

            //inicializando municipio
            //this.municipios = selectedProvince.municipios;
            this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);

            // console.log("Beneficiario municipio:")
            // console.log(selectedBenefiarioData.deliveryCity)
            // console.log(selectedBenefiarioData)

            const selectedMuncipio = this.municipios.filter((unMunicipio) => {
                const comparacion = UImanager.eliminarAcentos(selectedBenefiarioData.deliveryCity) == UImanager.eliminarAcentos(unMunicipio.nombre);
                return comparacion
            })[0];



            if (selectedMuncipio) {
                this.state.municipalityID = selectedMuncipio.id;
                this.state.municipality = selectedMuncipio.nombre;
                this.state.zone = selectedProvince.id === "4" ? "Habana" : "Provincias";
            } else {
                this.state.municipalityID = -1;
                this.state.municipality = '';
            }

            //this.cardsList = selectedBenefiarioData.creditCards;
            this.cardsList = [];
            this.cardsList = selectedBenefiarioData.creditCards.map(
                (el, i) => ({
                    id: i,
                    ...el
                })
            )

            console.log('Cards del beneficiario')
            console.log(this.cardsList)
            this.state.cardNumber = '';

            this.inicializando = false;

        }

    }


    onNewBeneficiario() {
        this.creandoNuevoBeneficiario = true;
        this.state.identityNumber = '';
        this.state.firstName = '';
        this.state.lastName = '';
        this.state.secondLastName = '';
        this.state.phone = '';
        this.state.streetName = '';
        this.state.houseNumber = '';
        this.state.zipcode = '';
        this.state.email = '';
        this.state._id = '';
        this.state.provinceID = "-1";
        this.state.province = "";
        this.state.municipalityID = -1;
        this.state.municipality = '';
        this.state.selectedBeneficiaryId = '-1';
        this.state.creditCards = [];
        this.cardsList = [];
        this.state.cardHolderName = '';


        this.state.cardNumber = '';
        this.state.cardBankImage = '';
        this.state.selectedCardId = '-1'



    }



    validarDatos(datos) {

        //this.errores.identityNumber = this.validarSiVacio(datos.identityNumber)
        this.errores.identityNumber = UImanager.validarCI(datos.identityNumber);
        this.errores.firstName = this.validarSiVacio(datos.firstName);
        this.errores.lastName = this.validarSiVacio(datos.lastName);
        this.errores.secondLastName = this.validarSiVacio(datos.secondLastName);

        this.errores.streetName = this.validarSiVacio(this.state.streetName);
        this.errores.houseNumber = this.validarSiVacio(this.state.houseNumber);
        this.errores.zipcode = this.validarSiVacio(this.state.zipcode);

        this.errores.municipality = this.state.municipalityID == -1 ? true : false;
        this.errores.province = this.state.provinceID == -1 ? true : false;

        const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
        const telefono = cod_pais + this.state.phone;
        //console.log(telefono)

        const isValidNumber = libphonenumber.isValidNumber(telefono)

        if (!isValidNumber) {
            this.errores.phone = true;
        }



        this.errores.email = !UImanager.validMail(datos.email);


        for (let clave in this.errores) {
            if (this.errores[clave] == true) {
                console.log(clave)
                return false;

            }

        }

        return true;
    }


    async salvar() {

        if (!this.validarDatos(this.state)) {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Validation errors'
            })


            console.log("Validation Errors");

            return;
        }


        console.log('Modificando datos de beneficiario')
        console.log(this.state)
        let respuesta = false;
        try {
            const api = new API(this.accessToken);
            let resultado = null;


            if (this.creandoNuevoBeneficiario) {
                console.log("Nuevo")
                console.log(this.state)
                resultado = await api.createBeneficiario(this.state);
            } else {
                console.log("Actualizandro")
                resultado = await api.updateBeneficiario(this.state);
            }



            console.log(resultado)
            //TODO OK
            if (resultado.status === 200 || resultado.status === 201) {

                respuesta = true;

                // if (resultado.data.status === 200) {
                Swal.fire("Beneficiary data saved correctly");
                // }
            }

            //Error  responde el API
            if (resultado.response) {
                Swal.fire({
                    icon: 'error', title: 'Error',
                    text: resultado.response.data.message
                })
            }
        } catch (error) {
            console.log(error);
            Swal.fire("Error saving data");
        }

        return respuesta;
    }



    //Boton salvar datos del beneficiario
    //mantener inactivo hasta que se haga un cambio en un campo
    async onSaveBeneficiario() {

        // const nuevaCard = this.state.cardNumber;
        // this.salvarNuevaCard(nuevaCard)



        const respuesta = await this.salvar();

        if (respuesta) {

            console.log('Pidiendo beneficiarios en usuario ')

            const api = new API(this.accessToken);
            const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();

            console.log(allDatosBeneficiarios)

            if (allDatosBeneficiarios) {
                window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
            }

            this.allDatosBeneficiariosFromStorage.datos = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
            if (this.allDatosBeneficiariosFromStorage.datos) {
                this.beneficiariosNames = this.allDatosBeneficiariosFromStorage.datos.map(el => ({
                    beneficiaryFullName: el.beneficiaryFullName,
                    _id: el._id
                }));
            }


            if (this.creandoNuevoBeneficiario) {
                this.creandoNuevoBeneficiario = false;
                console.log('nuevo')
                console.log(this.beneficiariosNames.length)
                this.inicializarDatosBeneficiario(this.beneficiariosNames[this.beneficiariosNames.length - 1]._id);
                //this.state.selectedBeneficiaryId =this.beneficiariosNames.length - 1;
            } else {
                this.inicializarDatosBeneficiario(this.selectedBeneficiaryId);
            }

            this.render()

        }

    }


    onChangeSelectedBeneficiary = async (datos) => {
        // this.datosSelectedTX.txID = datos._id;
        // this.state = { ...datos }
        this.inicializarDatosBeneficiario(datos._id);
        //console.log(datos)
    }

    //al iniciar mantener todos los campos disabled hasta que se presione el boton new
    onNewCard() {
        this.state.selectedCardId = '-1'
        this.state.cardNumber = '';
        this.state.cardBankImage = '';
        this.inputCardHolderName.el.value = '';
        this.state.cardHolderName = ''
        //this.inputCardNumber.el.value

    }

    async onSaveCard() {

        if (!this.state.cardHolderName) {
            Swal.fire({
                icon: 'error',
                title: 'Card holder name is needed',

                // currency: this.state.currency

            })

            return;
        }

        this.state.cardNumber = this.inputCardNumber.el.value;
        const nuevaCard = this.state.cardNumber;
        console.log(`Salvando card ${nuevaCard}`)

        if (await UImanager.buscarLogotipoBanco(nuevaCard, this.accessToken).tarjetaValida) {
            if (this.salvarNuevaCard(nuevaCard)) {
                Swal.fire({
                    icon: 'success',
                    title: 'Card can be saved ',
                    text: 'Save beneficiary to save the new card'
                })
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Card exist, not need to save again',
                    text: nuevaCard
                })

            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Incorrect card format',
                text: nuevaCard
            })

        }
    }



    addCardToComboBox(card) {

        this.cardsList.push({
            id: this.cardsList.length + 1,
            number: card.split(" ").join(""),
            bankName: this.state.bankName,
            cardHolderName: this.state.cardHolderName
        })
        console.log("Combo box")
        console.log(this.cardsList)
    }


    salvarNuevaCard(nuevaCard) {

        console.log('Card  a salvar')
        console.log(nuevaCard);
        if (nuevaCard) {
            if (this.cardsList && this.cardsList.length > 0) {

                //la busco en cardList
                const cardExisteenLista = this.cardsList.filter(unCard => UImanager.formatCardNumber(unCard.number) === UImanager.formatCardNumber(nuevaCard))[0];
                console.log('Comprobando si Card Existe:')
                console.log(cardExisteenLista)

                if (!cardExisteenLista) { //no existe puede salvarse

                    this.state.creditCards = this.cardsList.map((unCard) => unCard.number);
                    this.state.creditCards.push(nuevaCard.split(" ").join(""))
                    this.addCardToComboBox(nuevaCard)
                    return true;

                } else {
                    return false; //ya existe no se puede salvar
                }

            } else {

                this.state.creditCards.push(nuevaCard.split(" ").join(""))
                console.log("Salvando")
                console.log(this.state.creditCards)
                this.addCardToComboBox(nuevaCard)
                return true;

            }
        }
    }

}



