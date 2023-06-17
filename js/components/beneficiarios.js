const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API } from "../utils.js";




export class Beneficiarios extends Component {

  tiempoDebounce = 1000; //milisegundos

  inputAvatar = useRef("inputAvatar");

  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");

  inputSendCurrencyRef = useRef("inputSendCurrencyRef");
  inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");

  changingSendAmount = false;
  changingReceiveAmount = false;




  conversionRateSTR = useState({ value: "" });
  conversionRate = useState({ value: 0 });

  feeSTR = useState({ value: "" });
  fee = useState({ value: 0 });


  state = useState({
    cardNumber: "0000",
    cardHolderName:"JUAN PEREZ"
  })




  //TODO: mask in input 0000-0000-0000-0000

  static template = xml`  
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
            <div class="card-title flex flex-col rounded-lg">
               <div>Beneficiaries</div> 
            </div>

            <div class="card-body items-center  ">
              <div class="grid sm:grid-cols-[34%_64%] gap-2">

                <div class="form-control w-full max-w-xs">
                  <label class="label">
                  <span class="label-text">Card Number</span>
                
                  </label>
                  <input type="text" placeholder="0000-0000-0000-0000" class="input input-bordered w-full max-w-xs" t-on-input="onChangeCardInput" />

         
                  </div>

                  <input type="text" placeholder="Name" class="input input-bordered w-full max-w-xs" t-on-input="onChangeNameInput" />


              </div>
            </div>




            <div class="card-actions p-2">
               <button class="btn btn-primary mt-2  w-[15%]" t-on-click="onSaveAllData">Save</button>

            </div>
        </div>    


        










  `;



  setup() {



    onWillStart(async () => {




    });

    onRendered(() => {

    });

    onMounted(() => {
      // this.inputSendRef.el.value = 0;
      // this.inputReceiveRef.el.value = 0;
    });




  }



  onSaveAllData() {
    //this.beneficiarioDatos.cardNumber="FFFF"
    // console.log( this.state)
    this.props.onChangeDatosBeneficiarios(this.state);
    // Swal.fire('Not implemented yet,  more details about data is needed');
  }



  onChangeCardInput = API.debounce(async (event) => {

    //TODO validar el card

    this.state.cardNumber = event.target.value;
    this.props.onChangeDatosBeneficiarios(this.state);



  }, API.tiempoDebounce);


  
  onChangeNameInput = API.debounce(async (event) => {

    //TODO validar el card

    this.state.cardHolderName = event.target.value;
    this.props.onChangeDatosBeneficiarios(this.state);



  }, API.tiempoDebounce);

















}

