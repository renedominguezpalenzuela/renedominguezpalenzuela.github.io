const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";




export class SendMoney extends Component {



  inputAvatar = useRef("inputAvatar");

  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");

  inputSendCurrencyRef = useRef("inputSendCurrencyRef");
  inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");


  state = useState({
    firstName: "Rene",
    lastName: "Dominguez",
    avatar: "/img/photo-1534528741775-53994a69daeb.jpg",
    address: "",
    nameFull: "",
    /*sendValue: 0,
    receiveValue: 0,
    conversionRateSTR: "",
    conversionRate: 0,
    feeSTR: "",
    fee: 0*/
  })

  conversionRateSTR = useState({value:""});
  conversionRate = useState({value:0});

  feeSTR = useState({value:""});
  fee = useState({value:0});

  



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
                    <input type="number" t-ref="inputSendRef" t-on-input="onChangeSendInput"  t-att-value="state.sendValue" step="0.01" min="-9999999999.99" max="9999999999.99" class="input input-bordered join-item text-right" placeholder="0.00"/>
                    <label class="label">
                      <span class="label-text-alt"></span>
                      <span class="label-text-alt ">
                        <div class=" text-right">
                          Send Fee: <t t-esc="feeSTR.value"/> 
                        </div>  
                        <div class=" text-right">  
                           <t t-esc="conversionRateSTR.value"/> 
                        </div>
                      </span>
                    </label>
                  </div>


                  <select class="select select-bordered join-item" t-on-input="onChangeCurrencySend" t-ref="inputSendCurrencyRef" >                    
                    <option t-att-selected="true" value="usd">USD</option>
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
              
                  <input type="number" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput" t-att-value="state.receiveValue"  step="0.01" min="-9999999999.99" max="9999999999.99" class="input input-bordered join-item text-right" placeholder="0.00"/>
              
                </div>
                

                <select class="select select-bordered join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >
              
                  <option  t-att-selected="true"  value="cup">CUP</option>
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
      //this.state.conversionRateSTR = '-';
      this.feeSTR.value = '-';

      this.conversionRate.value = exchangeRate["CUP"];

      console.log(exchangeRate);

      console.log(this.conversionRate.value);

      this.conversionRateSTR.value = `1 USD = ${this.conversionRate.value} CUP`;

      console.log(this.conversionRateSTR.value);


    });

    onRendered(async () => {





    });
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


  onChangeReceiveInput = this.debounce(async () => {
    console.log("Cambio 1")
    //this.inputSendRef.el.value = this.inputReceiveRef.el.value;
     
     //this.inputSendRef.el.value= (this.inputReceiveRef.el.value / this.conversionRate.value  );

  }, 1000);

  onChangeSendInput = this.debounce(async () => {
   
    //this.inputReceiveRef.el.value = (this.conversionRate.value * this.inputSendRef.el.value);
    //this.inputReceiveRef.el.value = this.inputSendRef.el.value;
  }, 1000);



  async onChangeCurrency() {
    
    const accessToken = window.localStorage.getItem('accessToken');
    const api = new API(accessToken);
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;

    console.log("Enviar en: " + sendCurrency);
    console.log("Recibir en: " + receiveCurrency);

    if (receiveCurrency && sendCurrency ) {

      const exchangeRate = await api.getExchangeRate(sendCurrency);
      this.conversionRate.value = exchangeRate[receiveCurrency.toUpperCase()];

      console.log(exchangeRate);

      console.log(this.conversionRate.value);

      this.conversionRateSTR.value = `1 ${sendCurrency.toUpperCase()} = ${this.conversionRate.value} ${receiveCurrency.toUpperCase()}`;

      console.log(this.conversionRateSTR.value);
    }


  }

  onChangeCurrencySend() {
    this.onChangeCurrency();
  }

  onChangeCurrencyRecib() {
    this.onChangeCurrency();
  }







}

