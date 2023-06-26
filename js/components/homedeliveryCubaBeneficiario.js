const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";




export class Beneficiarios extends Component {

  tiempoDebounce = 1000; //milisegundos 
  accessToken = '';




  refDeliveryFirstName = useRef("refDeliveryFirstName");
  refDeliveryLastName = useRef("refDeliveryLastName");
  refDeliverySecondLastName = useRef("refDeliverySecondLastName");
  refDeliveryAddress = useRef("refDeliveryAddress");
  refDeliveryPhone = useRef("refDeliveryPhone");

  refDeliveryArea = useRef("refDeliveryArea");
  refDeliveryCity = useRef("refDeliveryCity");

  refDeliveryID = useRef("refDeliveryID");




  state = useState({
    deliveryID: '',
    deliveryFirstName: '',
    deliveryLastName: '',
    deliverySecondLastName: '',
    deliveryAddress: '',
    deliveryPhone: '',
    deliveryArea: '',
    deliveryCity: '',
    deliveryZona: 'Provincias',
    deliveryCountry: 'Cuba',
    deliveryCountryCode: 'CU'
  })

  static template = xml`  
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2">
            <div class="card-title flex flex-col rounded-lg pt-2">
               <div>Beneficiary</div> 
            </div>

            <div class="card-body items-center   ">


               
              <div class="grid grid-cols-1 sm:grid-cols-2 w-full gap-y-0 gap-x-2 ">

                
                  <div class="form-control w-full ">
                    <label class="label">
                      <span class="label-text">Select Beneficiary</span>
                    </label>
                    <select class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario">
                      <t t-foreach="this.props.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                        <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                      </t>             
                    </select>
                  </div>
                  

                  <div class="w-full sm:grid  sm:grid-cols-3 sm:col-span-2  gap-x-2 ">  
                    <div class="form-control  w-full">
                      <label class="label">
                        <span class="label-text">First Name</span>
                      </label>
                      <input type="text" t-ref="refDeliveryFirstName" t-on-input="onChangeFirstName"  maxlength="300" placeholder="First name" class="input input-bordered w-full " />   
                    </div>

                    <div class="form-control   w-full ">
                      <label class="label">
                      <span class="label-text">Last Name</span>
                      </label>
                      <input type="text" t-ref="refDeliveryLastName" t-on-input="onChangeLastName"  maxlength="300" placeholder="Last name" class="input input-bordered  w-full " /> 
                    </div>


                    <div class="form-control w-full ">     
                      <label class="label">
                        <span class="label-text">Second Last Name</span>
                      </label>
                      <input type="text" t-ref="refDeliverySecondLastName" t-on-input="onChangeSecondLastName"  maxlength="300" placeholder="Second last name" class="input input-bordered w-full " />  
                    </div>                              
                  </div>


                  <div class="form-control w-full   ">
                    <label class="label">
                      <span class="label-text">ID</span>
                    </label>
                    <input type="text" t-ref="refDeliveryID"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeID" />   
                  </div>

                  <div class="form-control w-full   ">
                    <label class="label">
                      <span class="label-text">Contact Phone</span>
                    </label>
                    <input type="text"  t-ref="refDeliveryPhone" maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhone" />   
                  </div>


                  
                  <div class="form-control  sm:col-span-2 w-full ">
                      <label class="label">
                        <span class="label-text">Delivery Address</span>
                      </label>
                    
                      <textarea  t-ref="refDeliveryAddress" class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                  </div>

                  

                  <div class="form-control w-full ">
                      <label class="label">
                        <span class="label-text">Province</span>
                      </label>
                      <select t-ref="refDeliveryArea" class="select select-bordered w-full" t-on-input="onChangeProvince">
                     
                        <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                          <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                        </t>             
                      </select>
                  </div>

                  <div class="form-control w-full ">
                      <label class="label">
                        <span class="label-text">City</span>
                      </label>
                      <select t-ref="refDeliveryCity" class="select select-bordered w-full" t-on-input="onChangeCity">
                        <option t-att-selected="true" t-att-disabled="true">Select City</option>
                        <t t-foreach="municipios" t-as="unMunicipio" t-key="unMunicipio">
                          <option><t t-esc="unMunicipio"/></option>
                        </t>             
                      </select>
                  </div>


                  <div class="form-control w-full max-w-xs ">
                      <label class="label">
                        <span class="label-text">Country</span>
                      </label>
                      <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="input input-bordered w-full"  t-on-input="onChangeCountryInput" />   
                  </div>
      

     
              

              </div>
            </div>




            
        </div>    


        










  `;



  setup() {


    this.accessToken = window.sessionStorage.getItem('accessToken');

    //"deliveryZone": "Provincias",| Habana


    onWillStart(async () => {

      this.provincias = Provincias;

      this.municipios = this.provincias[0].municipios;

      this.state.deliveryCity = this.provincias[0].municipios[0];
      this.state.deliveryArea = this.provincias[0].nombre;
      this.state.deliveryZona = this.provincias[0].id === "4" ? "Habana" : "Provincias";










    });

    onRendered(() => {


    });

    onMounted(() => {
      this.inicializarDatosBeneficiario(this.props.beneficiariosNames[0]._id);

    });




  }



  onSaveAllData() {


    this.props.onChangeDatosBeneficiarios(this.state);

  }









  //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  onChangeProvince = (event) => {
    if (this.inicializando) return;
    console.log(event.target.value);
    const selectedProvinceId = event.target.value;
    let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
    this.municipios = selectedProvince.municipios;
    this.state.deliveryCity = selectedProvince.municipios[0];
    this.state.deliveryArea = selectedProvince.nombre;
    this.state.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
    this.render();

    this.props.onChangeDatosBeneficiarios(this.state);

  };



  //Evento al cambiar de municipio
  onChangeCity = (event) => {
    if (this.inicializando) return;
    const selectedCity = event.target.value;
    this.state.deliveryCity = selectedCity;
    this.props.onChangeDatosBeneficiarios(this.state);
  };




  onChangeAddressInput = API.debounce(async (event) => {
    this.state.deliveryAddress = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);



  onChangeFirstName = API.debounce(async (event) => {
    this.state.deliveryFirstName = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);



  onChangeLastName = API.debounce(async (event) => {
    this.state.deliveryLastName = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);


  onChangeSecondLastName = API.debounce(async (event) => {
    this.state.deliverySecondLastName = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);



  onChangeID = API.debounce(async (event) => {
    this.state.deliveryID = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);


  onChangePhone = API.debounce(async (event) => {
    this.state.deliveryPhone = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);









  onChangeSelectedBeneficiario = (event) => {
    console.log(event.target.value);
    const selectedBeneficiaryId = event.target.value;
    //Recuperando los datos de los beneficiarios

    this.inicializarDatosBeneficiario(selectedBeneficiaryId);

  }

  //https://stackoverflow.com/questions/5700636/using-javascript-to-perform-text-matches-with-without-accented-characters
  //https://itqna.net/questions/514/how-do-search-ignoring-accent-javascript
  eliminarAcentos = (cadena) => {
    var string_norm = cadena.normalize('NFD').replace(/\p{Diacritic}/gu, ''); // Old method: .replace(/[\u0300-\u036f]/g, "");
    return string_norm.toLowerCase();
  }



  inicializarDatosBeneficiario = (idBeneficiario) => {
    const allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
    const selectedBenefiarioData = allDatosBeneficiariosFromStorage.filter(unDato => unDato._id === idBeneficiario)[0];
    console.log(selectedBenefiarioData);

    if (selectedBenefiarioData) {
      this.inicializando = true;
      this.refDeliveryFirstName.el.value = selectedBenefiarioData.deliveryContact;
      this.refDeliveryLastName.el.value = selectedBenefiarioData.deliveryLastName;
      this.refDeliverySecondLastName.el.value = selectedBenefiarioData.deliverySecondLastName;
      this.refDeliveryID.el.value = selectedBenefiarioData.deliveryCI;
      this.refDeliveryPhone.el.value = selectedBenefiarioData.deliveryPhone;
      this.refDeliveryAddress.el.value = selectedBenefiarioData.houseNumber + ', '+selectedBenefiarioData.streetName+'. ZipCode: '+selectedBenefiarioData.zipcode;


      let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === selectedBenefiarioData.deliveryArea)[0];
      this.refDeliveryArea.el.value = selectedProvince.id;



      this.municipios = selectedProvince.municipios;


      //this.render();

      // this.props.onChangeDatosBeneficiarios(this.state);

      let selectedMuncipioNormalizado = this.municipios.filter((unMunicipio) =>
        this.eliminarAcentos(selectedBenefiarioData.deliveryCity) === this.eliminarAcentos(unMunicipio)
      )[0];

      console.log(selectedMuncipioNormalizado)

      if (selectedMuncipioNormalizado) {     
        this.refDeliveryCity.el.value = selectedMuncipioNormalizado;
      }

      this.render();

      this.state.deliveryCity = selectedMuncipioNormalizado;
      this.state.deliveryArea = selectedProvince.nombre;
      this.state.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";

      this.inicializando = false;

    }



  }







}

