const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;
import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";

export class Beneficiarios extends Component {
  tiempoDebounce = 1000; //milisegundos 
  accessToken = '';
  cambioBeneficiario = false;





  state = useState({
    deliveryID: '',
    deliveryFirstName: '',
    deliveryLastName: '',
    deliverySecondLastName: '',
    deliveryAddress: '',
    deliveryPhone: '',
    deliveryArea: '',
    deliveryAreaID: '',
    deliveryCity: '',
    deliveryCityID: '',
    deliveryZona: 'Habana',
    deliveryCountry: 'Cuba',
    deliveryCountryCode: 'CU',
    selectedBeneficiaryId: "-1"
  })

  


  static template = xml`  
        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg ">


            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg ">
               <div>Beneficiary</div> 
            </div>

            <div class="tw-card-body tw-items-center   ">              
              <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-w-full tw-gap-y-0 tw-gap-x-2 ">
          
                  <div class="tw-form-control tw-w-full sm:tw-row-start-1 sm:tw-row-col-1 ">
                    <label class="tw-label">
                      <span class="tw-label-text">Select Beneficiary</span>
                    </label>
                    <select t-att-value="this.state.selectedBeneficiaryId" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeSelectedBeneficiario">
                      <option  t-att-value="-1" >Select Beneficiary</option>
                      <t t-if="this.props.beneficiariosNames.length>0">
                          <t t-foreach="this.props.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                            <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                          </t>              
                      </t>
                    </select>
                  </div>     
                  
                 
                  <div class="tw-form-control tw-w-full sm:tw-row-start-1 sm:tw-row-col-1  tw-row-start-10 ">
                      <label class="tw-label">
                        <span class="tw-label-text">Country</span>
                      </label>
                      <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="tw-input tw-input-bordered tw-w-full"  t-on-input="onChangeCountryInput" />   
                  </div>


                  <div class="tw-w-full sm:tw-grid  sm:tw-grid-cols-3 sm:tw-col-span-2  tw-gap-x-2 ">  
                    <div class="tw-form-control  tw-w-full">
                      <label class="tw-label">
                        <span class="tw-label-text">First Name</span>
                      </label>
                      <input type="text" t-att-value="this.state.deliveryFirstName" t-on-blur="onBlurFirstName"  t-on-input="onChangeFirstName"  maxlength="300" placeholder="First name" class="tw-input tw-input-bordered tw-w-full " />   
                      <span t-if="this.props.errores.deliveryFirstName==true" class="error">
                         Required field!!!
                      </span> 
                    </div>

                    <div class="tw-form-control   tw-w-full ">
                      <label class="tw-label">
                      <span class="tw-label-text">Last Name</span>
                      </label>
                      <input type="text" t-att-value="this.state.deliveryLastName" t-on-blur="onBlurLastName"  t-on-input="onChangeLastName"  maxlength="300" placeholder="Last name" class="tw-input tw-input-bordered  tw-w-full " /> 
                       <span t-if="this.props.errores.deliveryLastName==true" class="error">
                         Required field!!!
                      </span> 
                    </div>

                    <div class="tw-form-control tw-w-full ">     
                      <label class="tw-label">
                        <span class="tw-label-text">Second Last Name</span>
                      </label>
                      <input type="text" t-att-value="this.state.deliverySecondLastName" t-on-blur="onBlurSecondLastName"  t-on-input="onChangeSecondLastName"  maxlength="300" placeholder="Second last name" class="tw-input tw-input-bordered tw-w-full " />  
                      <span t-if="this.props.errores.deliverySecondLastName==true" class="error">
                          Required field!!!
                       </span> 
                    </div>                              
                  </div>

                  <div class="tw-form-control tw-w-full   ">
                    <label class="tw-label">
                      <span class="tw-label-text">ID</span>
                    </label>
                    <input type="text" t-att-value="this.state.deliveryID"  t-on-blur="onBlurdeliveryID"   maxlength="300" placeholder="" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeID"  onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" />   
                    <span t-if="this.props.errores.deliveryID==true" class="error">
                         Error in ID!!!
                       </span> 
                  </div>

                  <div class="tw-form-control tw-w-full  ">
                  <label class="tw-label">
                   <span class="tw-label-text">Contact Phone</span>
                  </label>
                  <input t-att-value="this.state.deliveryPhone"  id="phone" name="phone" type="tel" class="selectphone tw-input tw-input-bordered tw-w-full" t-on-input="onChangePhone" t-on-blur="onBlurPhone" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')" />
                   <span t-if="this.props.errores.deliveryPhone==true" class="error">
                          Invalid number!!!
                       </span> 
                </div>
                  
                  <div class="tw-form-control  sm:tw-col-span-2 tw-w-full ">
                      <label class="tw-label">
                        <span class="tw-label-text">Delivery Address</span>
                      </label>
                    
                      <textarea  t-att-value="this.state.deliveryAddress" t-on-blur="onBlurAddressInput" class="tw-textarea tw-textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                      <span t-if="this.props.errores.deliveryAddress==true" class="error">
                         Required field!!!
                      </span>  
                  </div>

                  <div class="tw-form-control tw-w-full ">
                      <label class="tw-label">
                        <span class="tw-label-text">Province</span>
                      </label>
                      <select t-att-value="this.state.deliveryAreaID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeProvince">
                        <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                          <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                        </t>             
                      </select>
                  </div>

                  <div class="tw-form-control tw-w-full ">
                      <label class="tw-label">
                        <span class="tw-label-text">City</span>
                      </label>
                      <select t-att-value="this.state.deliveryCityID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeCity">
                      <option t-att-disabled="true" t-att-value="-1" >Select city</option>
                        <t t-foreach="this.municipios" t-as="unMunicipio" t-key="unMunicipio.id">
                          <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
                        </t>             
                      </select>
                  </div>


                   <div class="tw-hidden"> 
                  <t t-esc="this.props.datosSelectedTX.txID"/>
                  </div>
                 



              </div>
             
            </div>    
            
           
        </div>    
  `;


  //"deliveryZone": "Provincias",| Habana
  setup() {



    this.accessToken = API.getTokenFromsessionStorage();

  

   // console.log(this.props.errores.deliveryFirstName)

    onWillStart(async () => {

      this.provincias = Provincias;
      this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);

      if (!this.accessToken) {
       // console.error("NO ACCESS TOKEN - Balance")
       // await window.location.assign(API.redirectURLLogin);
        return;
      }
    });

    onRendered(() => {


     // if (!this.accessToken) { return }

      if (this.cambioBeneficiario) {
        this.cambioBeneficiario = false;
        return;
      }



      //Buscar el CI
      if (this.props.datosSelectedTX.allData) {
        const CI = this.props.datosSelectedTX.allData.metadata.deliveryCI;
        console.log(CI)

        const beneficiario = this.props.beneficiariosNames.filter((unBeneficiario) =>
          unBeneficiario.CI === CI
        )[0]



        if (beneficiario) {
          this.inicializarDatosBeneficiario(beneficiario._id);
          //ERROR: no inicializa correctamente el SELECT -- DONE

        } else {
          //TODO: inicializar todos los controles
        }


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
        nationalMode: true, //permite poner 5465731 en ves de +53 54657331
        initialCountry: "cu",




        excludeCountries: ["in", "il"],
        preferredCountries: ["cu"],
        utilsScript: "js/libs/intlTelIutils.js"
      });



      if (this.props.beneficiariosNames.length > 0) {
        this.inicializarDatosBeneficiario(this.props.beneficiariosNames[0]._id);
      }

    });



  }


  //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  onChangeProvince = (event) => {
    this.cambioBeneficiario = true;
    if (this.inicializando) return;
    const selectedProvinceId = event.target.value;
    this.state.deliveryAreaID = event.target.value;
    let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
    if (selectedProvince) {
      this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);
      this.state.deliveryCityID = -1;
      this.state.deliveryCity = '';
      this.state.deliveryArea = selectedProvince.nombre;
      this.state.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
      this.props.onChangeDatosBeneficiarios(this.state);
    }
  };

  //Evento al cambiar de municipio
  onChangeCity = (event) => {
    this.cambioBeneficiario = true;
    if (this.inicializando) return;
    const selectedCityId = event.target.value;
    let selectedMunicipio = this.municipios[selectedCityId];
    if (selectedMunicipio) {
      this.state.deliveryCity = selectedMunicipio.nombre;
      this.state.deliveryCityID = selectedCityId;
      this.props.onChangeDatosBeneficiarios(this.state);
    }
  };

  onChangeFirstName = API.debounce(async (event) => {
    this.state.deliveryFirstName = event.target.value;
   
    this.props.errores.deliveryFirstName = UImanager.validarSiVacio(event.target.value)
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onBlurFirstName = (event) => {
    this.props.errores.deliveryFirstName = UImanager.validarSiVacio(event.target.value)
  }

  onChangeLastName = API.debounce(async (event) => {
    this.state.deliveryLastName = event.target.value;
    this.props.errores.deliveryLastName = UImanager.validarSiVacio(event.target.value)
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onBlurLastName = (event) => {
    this.props.errores.deliveryLastName = UImanager.validarSiVacio(event.target.value)
  }

  onChangeSecondLastName = API.debounce(async (event) => {
    this.state.deliverySecondLastName = event.target.value;
    this.props.errores.deliverySecondLastName = UImanager.validarSiVacio(event.target.value)
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  
  onBlurSecondLastName = (event) => {
    this.props.errores.deliverySecondLastName = UImanager.validarSiVacio(event.target.value)
  }




  



  onChangeID = API.debounce(async (event) => {
    this.state.deliveryID = event.target.value;
    this.props.errores.deliveryID = UImanager.validarCI(event.target.value)
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  
  onBlurdeliveryID = (event) => {
    this.props.errores.deliveryID = UImanager.validarCI(event.target.value)
  }


  
  onChangeAddressInput = API.debounce(async (event) => {
    this.state.deliveryAddress = event.target.value;
    this.props.errores.deliveryAddress = UImanager.validarSiVacio(event.target.value)
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  
  onBlurAddressInput = (event) => {
    this.props.errores.deliveryAddress = UImanager.validarSiVacio(event.target.value)
  }

  onChangePhone = API.debounce(async (event) => {
    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
    const telefono = cod_pais + event.target.value;

    this.state.deliveryPhone = event.target.value;

    
    this.props.errores.deliveryPhone = !libphonenumber.isValidNumber(telefono)
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onBlurPhone = (event) => {
    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
    const telefono = cod_pais + event.target.value;

    this.props.errores.deliveryPhone =!libphonenumber.isValidNumber(telefono)
  }
  

  onChangeSelectedBeneficiario = (event) => {
    const selectedBeneficiaryId = event.target.value;
    this.cambioBeneficiario = true;
    this.state.selectedBeneficiaryId = selectedBeneficiaryId;
    this.inicializarDatosBeneficiario(selectedBeneficiaryId);
  }


  inicializarDatosBeneficiario = (idBeneficiario) => {


    const allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
    const selectedBenefiarioData = allDatosBeneficiariosFromStorage.filter(unDato => unDato._id === idBeneficiario)[0];

    if (selectedBenefiarioData) {
      this.inicializando = true;
      this.state.deliveryFirstName = selectedBenefiarioData.deliveryContact;
      this.state.deliveryLastName = selectedBenefiarioData.deliveryLastName;
      this.state.deliverySecondLastName = selectedBenefiarioData.deliverySecondLastName;
      this.state.deliveryID = selectedBenefiarioData.deliveryCI;
      this.state.deliveryPhone = selectedBenefiarioData.deliveryPhone;
      this.state.deliveryAddress = selectedBenefiarioData.houseNumber + ', ' + selectedBenefiarioData.streetName + '. ZipCode: ' + selectedBenefiarioData.zipcode;
      this.state.selectedBeneficiaryId = idBeneficiario;


      
    this.props.errores.deliveryFirstName = UImanager.validarSiVacio(this.state.deliveryFirstName)
    this.props.errores.deliveryLastName = UImanager.validarSiVacio(this.state.deliveryLastName)
    this.props.errores.deliverySecondLastName = UImanager.validarSiVacio(this.state.deliverySecondLastName)

    this.props.errores.deliveryID = UImanager.validarCI(this.state.deliveryID)

    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
    const telefono = cod_pais + selectedBenefiarioData.deliveryPhone;

    this.props.errores.deliveryPhone =!libphonenumber.isValidNumber(telefono)

    //this.props.errores.deliveryAddress = UImanager.validarSiVacio(this.state.deliveryAddress)


      //Inicializando provincia
      const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === selectedBenefiarioData.deliveryArea)[0];
      if (selectedProvince) {
        this.state.deliveryAreaID = selectedProvince.id;
        this.state.deliveryArea = selectedProvince.nombre;
      } else {
        this.state.deliveryAreaID = "-1";
        this.state.deliveryArea = "";
        this.state.deliveryCityID = -1;
        this.state.deliveryCity = '';
        return;
      }

      //inicializando municipio
      //this.municipios = selectedProvince.municipios;
      this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);

      console.log("Beneficiario municipio:")
      console.log(selectedBenefiarioData.deliveryCity)
      console.log(selectedBenefiarioData)

      const selectedMuncipio = this.municipios.filter((unMunicipio) => {
        const comparacion = UImanager.eliminarAcentos(selectedBenefiarioData.deliveryCity) == UImanager.eliminarAcentos(unMunicipio.nombre);
        return comparacion
      })[0];

      if (selectedMuncipio) {
        console.log("Municipio")
        console.log(selectedMuncipio.nombre)
        this.state.deliveryCityID = selectedMuncipio.id;
        this.state.deliveryCity = selectedMuncipio.nombre;
        this.state.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
      } else {
        this.state.deliveryCityID = -1;
        this.state.deliveryCity = '';
      }

      this.props.onChangeDatosBeneficiarios(this.state);
      this.inicializando = false;



    }

  }



}

