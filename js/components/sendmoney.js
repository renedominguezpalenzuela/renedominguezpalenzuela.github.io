const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";




export class SendMoney extends Component {

  tiempoDebounce = 1000; //milisegundos

  inputAvatar = useRef("inputAvatar");

  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");

  inputSendCurrencyRef = useRef("inputSendCurrencyRef");
  inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");

  changingSendAmount = false;
  changingReceiveAmount = false;


  state = useState({
    firstName: "Rene",
    lastName: "Dominguez",
    avatar: "/img/photo-1534528741775-53994a69daeb.jpg",
    address: "",
    nameFull: "",
    // sendValue: 0,
    // receiveValue: 0,
    // conversionRateSTR: "",
    // conversionRate: 0,
    // feeSTR: "",
    // fee: 0
  })

  conversionRateSTR = useState({ value: "" });
  conversionRate = useState({ value: 0 });

  feeSTR = useState({ value: "" });
  fee = useState({ value: 0 });




  // <!-- step="0.01" min="-9999999999.99" max="9999999999.99" -->
  static template = xml`    
    <div class="grid sm:grid-cols-[34%_64%] gap-2">
      <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
        <div class="card-title flex flex-col rounded-lg">
          
        </div>

        <div class="card-body items-center  ">
           
            <div class="form-control  max-w-xs  ">
                <label class="label">
                  <span class="label-text">You Send</span>  
                </label> 

                <div class="join">
                              
                  <div>
                    
                    <input type="text" t-ref="inputSendRef" t-on-input="onChangeSendInput"    class="input input-bordered join-item text-right" placeholder="0.00"/>

                    <label class="label">
                      <span class="label-text-alt"></span>
                      <span class="label-text-alt ">
                        <div class=" text-right">
                          Send Fee: <t t-esc="this.feeSTR.value"/> 
                        </div>  
                        <div class=" text-right">  
                           <t t-esc="this.conversionRateSTR.value"/> 
                        </div>
                      </span>
                    </label>
                  </div>
                 

                  <select class="select select-bordered join-item" t-on-input="onChangeCurrencySend" t-ref="inputSendCurrencyRef" >                    
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="cad">CAD</option>
                    
                  </select>
                
                </div>
              </div>


             
              <div class="form-control  max-w-xs   ">
              <label class="label">
                <span class="label-text">Received Amount</span>  
              </label> 

              <div class="join">
               
                <div>           
                  
                  <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"    class="input input-bordered join-item text-right" placeholder="0.00"/>             
                </div>
                

                <select class="select select-bordered join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                  <option value="cup">CUP</option>
                  <option value="usd">USD</option>
                </select>

              </div>
            </div>


        
        
          <div class="card-actions">
            
          </div>
        </div>
      </div>

      <button class="btn btn-primary mt-2 row-start-2 w-[30%]" t-on-click="onSaveAllData">Send</button>



    
    </div>
      

      



        
     
    

  `;



  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');


    onWillStart(async () => {
      const accessToken = window.localStorage.getItem('accessToken');
      const api = new API(accessToken);
      const userData = await api.getUserProfile();
      //console.log(userData);

      const exchangeRate = await api.getExchangeRate("usd");


      this.state = { ...userData };

      this.feeSTR.value = '-';

      this.conversionRate.value = exchangeRate["CUP"];
      this.conversionRateSTR.value = `1 USD = ${this.conversionRate.value} CUP`;

      // console.log("Will Start");
      // console.log(exchangeRate);
      // console.log(this.conversionRate.value);
      // console.log(this.conversionRateSTR.value);


    });

    onRendered(() => {

    });

    onMounted(() => {
      // this.inputSendRef.el.value = 0;
      // this.inputReceiveRef.el.value = 0;
    })
  }



  debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  onSaveAllData() {
    Swal.fire('Not implemented yet,  more details about data is needed');
  }




  async onChangeCurrency() {

    this.inputReceiveRef.el.value = (0).toFixed(2);
    this.inputSendRef.el.value = (0).toFixed(2);

    const accessToken = window.localStorage.getItem('accessToken');
    const api = new API(accessToken);
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;

    console.log("Enviar en: " + sendCurrency);
    console.log("Recibir en: " + receiveCurrency);

    if (receiveCurrency && sendCurrency) {

      const exchangeRate = await api.getExchangeRate(sendCurrency);
      this.conversionRate.value = exchangeRate[receiveCurrency.toUpperCase()];
      this.conversionRateSTR.value = `1 ${sendCurrency.toUpperCase()} = ${this.conversionRate.value} ${receiveCurrency.toUpperCase()}`;
      this.feeSTR.value = '-';

      console.log(exchangeRate);
      console.log(this.conversionRate.value);
      console.log(this.conversionRateSTR.value);
    }


  }

  onChangeCurrencySend() {
    this.onChangeCurrency();
  }

  onChangeCurrencyRecib() {
    this.onChangeCurrency();
  }

  async getFee(service, zone, amount) {
    const accessToken = window.localStorage.getItem('accessToken');
    const api = new API(accessToken);
    const fee = await api.getFee(service, zone, amount)

    return fee;
    ///this.fee.value = 10;
    ///this.feeSTR.value = '-';
  }








  onChangeSendInput = this.debounce(async () => {

    if (this.changingReceiveAmount) { return; }

    this.changingSendAmount = true;
    this.changingReceiveAmount = false;

   
    const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos

    const sendAmount = this.inputSendRef.el.value;
    const conversionRate = this.conversionRate.value;

    this.getFee(service, zone, sendAmount).then((feeData) => {

      const fee = feeData.fee;
    
      //const receiveAmount = (sendAmount * conversionRate);
      // this.inputReceiveRef.el.value = (this.conversionRate.value * (this.inputSendRef.el.value - this.fee.value));
      //console.log(`Receive Amount sin fee ${receiveAmount}`)

      const receiveAmount = ((sendAmount - fee) * conversionRate).toFixed(2);
      if (receiveAmount>0) this.inputReceiveRef.el.value =receiveAmount;
      
      this.fee.value = fee;
      const feeSTR = fee.toFixed(2);
      const CurrencySTR = this.inputSendCurrencyRef.el.value.toUpperCase();
      this.feeSTR.value = `${feeSTR} ${CurrencySTR}`; //TODO convertir a 2 decimales  

      this.changingSendAmount = false;
      this.changingReceiveAmount = false;

    }
    );

  }, this.tiempoDebounce);




  onChangeReceiveInput = this.debounce(async () => {

    if (this.changingSendAmount) { return; }

    this.changingSendAmount = false;
    this.changingReceiveAmount = true;

  
    const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;
   
    const zone = "Habana"; //TODO: obtener de datos

    const receiveAmount = this.inputReceiveRef.el.value;
    const conversionRate = this.conversionRate.value;


    const sendAmount = (receiveAmount / conversionRate);
  

    this.getFee(service, zone, sendAmount).then((feeData) => {


      const fee = feeData.fee;

      this.inputSendRef.el.value = (sendAmount + fee).toFixed(2);
     
      this.fee.value = fee;
      const feeSTR = fee.toFixed(2);
      const CurrencySTR = this.inputSendCurrencyRef.el.value.toUpperCase();
      this.feeSTR.value = `${feeSTR} ${CurrencySTR}`; //TODO convertir a 2 decimales  

      this.changingSendAmount = false;
      this.changingReceiveAmount = false;

    }
    );

  }, this.tiempoDebounce);


}

