const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API } from "../utils.js";




export class Beneficiarios extends Component {

  tiempoDebounce = 1000; //milisegundos

  inputCardNumber = useRef("inputCardNumber");
  

  accessToken = '';




  state = useState({
    cardNumber: '',
    cardHolderName: '',
    cardBankImage: '',
    bankName: '',
    contactPhone: '',
    deliveryAddress: '',
    receiverCity: '',
    deliveryCountry: 'Cuba',
    deliveryCountryCode: 'CU',
    receiverCountry: 'CUB'
  })




  //TODO: mask in input 0000-0000-0000-0000

  static template = xml`  
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg ">
            <div class="card-title flex flex-col rounded-lg">
               <div>Beneficiaries</div> 
            </div>

            <div class="card-body items-center   ">
              <div class="grid sm:grid-cols-[45%_45%]  w-full gap-y-0 gap-x-2">

                <div class="form-control w-full  ">
                  <label class="label">
                    <span class="label-text">Card Number</span>
                  </label>
                  <input type="text" t-ref="inputCardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                </div>

                <div class=" flex items-center ">
                   <img t-att-src="this.state.cardBankImage" alt="" class="ml-3 sm:mt-9 sm:w-[10vw] w-[30vw]"/>
                </div>


                <div class="form-control w-full max-w-xs  ">
                  <label class="label">
                    <span class="label-text">Card Holder Name</span>
                  </label>
                  <input type="text"  maxlength="300" placeholder="" class="input input-bordered w-full max-w-xs"  t-on-input="onChangeCardHolderInput" />   
                </div>

                <div class="form-control w-full max-w-xs ">
                  <label class="label">
                    <span class="label-text">Contact Phone</span>
                  </label>
                  <input type="text"  maxlength="300" placeholder="" class="input input-bordered w-full max-w-xs"  t-on-input="onChangePhoneInput" />   
                </div>

                <div class="form-control   row-start-3 col-span-2 w-full ">
                  <label class="label">
                    <span class="label-text">Delivery Address</span>
                  </label>
                
                  <textarea class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                </div>

                <div class="form-control w-full max-w-xs ">
                <label class="label">
                  <span class="label-text">City</span>
                </label>
                <input type="text"  maxlength="100" placeholder="" class="input input-bordered w-full max-w-xs"  t-on-input="onChangeCityInput" />   
              </div>

              <div class="form-control w-full max-w-xs ">
              <label class="label">
                <span class="label-text">Country</span>
              </label>
              <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="XXX" class="input input-bordered w-full max-w-xs"  t-on-input="onChangeCountryInput" />   
            </div>

             

               
              

              </div>
            </div>




            
        </div>    


        










  `;



  setup() {


    this.accessToken = window.localStorage.getItem('accessToken');




    onWillStart(async () => {




    });

    onRendered(() => {

    });

    onMounted(() => {

      // this.inputSendRef.el.value = 0;
      // this.inputReceiveRef.el.value = 0;



    });




  }


  /* <div class="card-actions p-2">
                 <button class="btn btn-primary mt-2  w-[15%]" t-on-click="onSaveAllData">Save</button>
  
              </div> */
  onSaveAllData() {
    //this.beneficiarioDatos.cardNumber="FFFF"
    // console.log( this.state)
    this.props.onChangeDatosBeneficiarios(this.state);
    // Swal.fire('Not implemented yet,  more details about data is needed');
  }






  onCardInputKeyDown = API.debounce(async (event) => {

    //TODO validar el card
    if (event.target.value.length === 19) {
      //VALIDAR card
      this.state.cardNumber = event.target.value;
      const cardWithoutSpaces = this.state.cardNumber.replace(/ /g, "");

      const api = new API(this.accessToken);
      const cardRegExp = await api.getCardRegExp();

      console.log(typeof (cardRegExp));

      for (const key in cardRegExp) {

        const regexp = new RegExp(cardRegExp[key]);
        const card = this.state.cardNumber.replace(/ /g, "");
        const resultado = regexp.test(card);
        if (resultado) {
          console.log(key)
          switch (key) {
            case 'BANDEC_CARD':
              //Poner imagen
              this.state.cardBankImage = "img/logo-bandec.png";
              this.state.bankName = "BANDEC";

              break;

            case 'BANMET_CARD':
              //Poner imagen
              this.state.cardBankImage = "img/logo-metro.png";
              this.state.bankName = "METROPOLITANO";

              break;

            case 'BPA_CARD':
              //Poner imagen
              this.state.cardBankImage = "img/logo-bpa.png";
              this.state.bankName = "BPA";

              break;

            default:
              break;
          }

        }




      }







      this.props.onChangeDatosBeneficiarios(this.state);
    }

  }, API.tiempoDebounce);

  onChangeCardInput(event) {

    this.inputCardNumber.el.value = this.formatCardNumber(event.target.value);

  };

  formatCardNumber(value) {
    var value = value.replace(/\D/g, '');
    if ((/^\d{0,16}$/).test(value)) {
      return value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    }
  }


  onChangeCardHolderInput = API.debounce(async (event) => {
    this.state.cardHolderName = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangeAddressInput = API.debounce(async (event) => {
    this.state.deliveryAddress = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangePhoneInput = API.debounce(async (event) => {
    this.state.contactPhone = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangeCityInput = API.debounce(async (event) => {
    this.state.receiverCity = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);










}

