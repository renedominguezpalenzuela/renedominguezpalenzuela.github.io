const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;
import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";

export class Beneficiarios extends Component {
  tiempoDebounce = 1000; //milisegundos 
  accessToken = '';

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
    deliveryZona: 'Provincias',
    deliveryCountry: 'Cuba',
    deliveryCountryCode: 'CU',
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
                      <input type="text" t-att-value="this.state.deliveryFirstName" t-on-input="onChangeFirstName"  maxlength="300" placeholder="First name" class="input input-bordered w-full " />   
                    </div>

                    <div class="form-control   w-full ">
                      <label class="label">
                      <span class="label-text">Last Name</span>
                      </label>
                      <input type="text" t-att-value="this.state.deliveryLastName"  t-on-input="onChangeLastName"  maxlength="300" placeholder="Last name" class="input input-bordered  w-full " /> 
                    </div>

                    <div class="form-control w-full ">     
                      <label class="label">
                        <span class="label-text">Second Last Name</span>
                      </label>
                      <input type="text" t-att-value="this.state.deliverySecondLastName" t-on-input="onChangeSecondLastName"  maxlength="300" placeholder="Second last name" class="input input-bordered w-full " />  
                    </div>                              
                  </div>

                  <div class="form-control w-full   ">
                    <label class="label">
                      <span class="label-text">ID</span>
                    </label>
                    <input type="text" t-att-value="this.state.deliveryID"   maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeID" />   
                  </div>

                  <div class="form-control w-full   ">
                    <label class="label">
                      <span class="label-text">Contact Phone</span>
                    </label>
                    <input type="text" t-att-value="this.state.deliveryPhone"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhone" />   
                  </div>
                  
                  <div class="form-control  sm:col-span-2 w-full ">
                      <label class="label">
                        <span class="label-text">Delivery Address</span>
                      </label>
                    
                      <textarea  t-att-value="this.state.deliveryAddress" class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                  </div>

                  <div class="form-control w-full ">
                      <label class="label">
                        <span class="label-text">Province</span>
                      </label>
                      <select t-att-value="this.state.deliveryAreaID" class="select select-bordered w-full" t-on-input="onChangeProvince">
                        <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                          <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                        </t>             
                      </select>
                  </div>

                  <div class="form-control w-full ">
                      <label class="label">
                        <span class="label-text">City</span>
                      </label>
                      <select t-att-value="this.state.deliveryCityID" class="select select-bordered w-full" t-on-input="onChangeCity">
                      <option t-att-disabled="true" t-att-value="-1" >Select city</option>
                        <t t-foreach="this.municipios" t-as="unMunicipio" t-key="unMunicipio.id">
                          <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
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


  //"deliveryZone": "Provincias",| Habana
  setup() {
    this.accessToken = window.sessionStorage.getItem('accessToken');

    onWillStart(async () => {
      this.provincias = Provincias;
      this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);
    });

    onRendered(() => {

    });

    onMounted(() => {
      this.inicializarDatosBeneficiario(this.props.beneficiariosNames[0]._id);
    });

  }


  //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  onChangeProvince = (event) => {
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
    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangeAddressInput = API.debounce(async (event) => {
    this.state.deliveryAddress = event.target.value;
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
    const selectedBeneficiaryId = event.target.value;
    this.inicializarDatosBeneficiario(selectedBeneficiaryId);
  }

  //https://stackoverflow.com/questions/5700636/using-javascript-to-perform-text-matches-with-without-accented-characters
  //https://itqna.net/questions/514/how-do-search-ignoring-accent-javascript
  eliminarAcentos = (cadena) => {
    var string_norm = cadena.normalize('NFD').replace(/\p{Diacritic}/gu, ''); // Old method: .replace(/[\u0300-\u036f]/g, "");
    return string_norm.toLowerCase().split(" ").join("");
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

      //Inicializando provincia
      const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === selectedBenefiarioData.deliveryArea)[0];
      if (selectedProvince) {
        this.state.deliveryAreaID = selectedProvince.id;
        this.state.deliveryArea = selectedProvince.nombre;
      } else {
        this.state.deliveryAreaID = "-1";
        this.state.deliveryArea ="";
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
        const comparacion = this.eliminarAcentos(selectedBenefiarioData.deliveryCity) == this.eliminarAcentos(unMunicipio.nombre);
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

