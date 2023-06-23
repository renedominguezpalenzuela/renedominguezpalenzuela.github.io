const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API } from "../utils.js";




export class Beneficiarios extends Component {

  tiempoDebounce = 1000; //milisegundos 
  accessToken = '';

  state = useState({
    deliveryID: '',
    deliveryFirstName:'',
    deliveryLastName:'',
    deliverySecondLastName:'',
    deliveryAddress: '',
    deliveryPhone: '',
    deliveryArea: '',
    deliveryCity: '',
    deliveryZona: '',
    deliveryCountry: '',
    deliveryCurrency: '',
    deliveryCountryCode: ''
  })

  static template = xml`  
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2">
            <div class="card-title flex flex-col rounded-lg pt-2">
               <div>Beneficiaries</div> 
            </div>

            <div class="card-body items-center   ">
              <div class="grid grid-cols-1 sm:grid-cols-2 w-full gap-y-0 gap-x-2 ">
              

                  
                <div class="form-control w-full   ">
                  <label class="label">
                    <span class="label-text">First Name</span>
                  </label>
                  <input type="text" t-model="state.deliveryFirstName"  maxlength="300" placeholder="Firstname" class="input input-bordered w-full " />   
                </div>

               
                <div class="form-control  sm:col-span-2 w-full ">
                  <label class="label">
                    <span class="label-text">Delivery Address</span>
                  </label>
                
                  <textarea class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                </div>

                <div class="form-control w-full ">
                  <label class="label">
                    <span class="label-text">City</span>
                  </label>
                  <input type="text"  maxlength="100" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeCityInput" />   
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




    onWillStart(async () => {




    });

    onRendered(() => {

    });

    onMounted(() => {

    
    });




  }


  
  onSaveAllData() {
    
    console.log( this.state)
    this.props.onChangeDatosBeneficiarios(this.state);
    
  }










  onChangeCityInput = API.debounce(async (event) => {
    this.state.receiverCity = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);










}

