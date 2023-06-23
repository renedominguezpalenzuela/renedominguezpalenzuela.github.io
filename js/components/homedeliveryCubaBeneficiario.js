const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API } from "../utils.js";
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
              

              <div class="w-full sm:grid  sm:grid-cols-3 sm:col-span-2  gap-x-2 ">  
                <div class="form-control  w-full">
                  <label class="label">
                    <span class="label-text">First Name</span>
                  </label>
                  <input type="text" t-on-input="onChangeFirstName"  maxlength="300" placeholder="First name" class="input input-bordered w-full " />   
                </div>

                <div class="form-control   w-full ">
                  <label class="label">
                  <span class="label-text">Last Name</span>
                  </label>
                  <input type="text" t-on-input="onChangeLastName"  maxlength="300" placeholder="Last name" class="input input-bordered  w-full " /> 
                </div>


                <div class="form-control w-full ">     
                  <label class="label">
                    <span class="label-text">Second Last Name</span>
                  </label>
                  <input type="text" t-on-input="onChangeSecondLastName"  maxlength="300" placeholder="Second last name" class="input input-bordered w-full " />  
                </div>                              
              </div>


              <div class="form-control w-full   ">
                <label class="label">
                  <span class="label-text">ID</span>
                </label>
                <input type="text"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeID" />   
              </div>

              <div class="form-control w-full   ">
                <label class="label">
                  <span class="label-text">Contact Phone</span>
                </label>
                <input type="text"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhone" />   
              </div>


               
              <div class="form-control  sm:col-span-2 w-full ">
                  <label class="label">
                    <span class="label-text">Delivery Address</span>
                  </label>
                
                  <textarea class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
              </div>

              

              <div class="form-control w-full ">
                  <label class="label">
                    <span class="label-text">Province</span>
                  </label>
                  <select class="select select-bordered w-full" t-on-input="onChangeProvince">
                    <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                       <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                    </t>             
                  </select>
              </div>

              <div class="form-control w-full ">
                  <label class="label">
                    <span class="label-text">City</span>
                  </label>
                  <select class="select select-bordered w-full" t-on-input="onChangeCity">
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

      this.state.deliveryCity  = this.provincias[0].municipios[0];
      this.state.deliveryArea = this.provincias[0].nombre;
      this.state.deliveryZona = this.provincias[0].id==="4" ? "Habana" : "Provincias";








    });

    onRendered(() => {

    });

    onMounted(() => {


    });




  }



  onSaveAllData() {

   
    this.props.onChangeDatosBeneficiarios(this.state);

  }









   //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  onChangeProvince = (event) => {
    console.log(event.target.value);
    const selectedProvinceId = event.target.value;
    let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
    this.municipios = selectedProvince.municipios;
    this.state.deliveryCity  = selectedProvince.municipios[0];
    this.state.deliveryArea = selectedProvince.nombre;
    this.state.deliveryZona = selectedProvince.id==="4" ? "Habana" : "Provincias";
    this.render();
    
    this.props.onChangeDatosBeneficiarios(this.state);

  };


  //Evento al cambiar de municipio
  onChangeCity = (event) => {   
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


  













}

