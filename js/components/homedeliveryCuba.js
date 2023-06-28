const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;

import { API, UImgr } from "../utils.js";
import { Beneficiarios } from "./homedeliveryCubaBeneficiario.js";

import { Provincias } from "../../data/provincias_cu.js";

//TODO: Desacoplar la vista de los calculos para poder implementar prubas unitarias
export class HomeDeliveryCuba extends Component {

  static components = { Beneficiarios };

  inputAvatar = useRef("inputAvatar");
  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");
  concept = useRef("concept");
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

  beneficiario = useState({

  })

  conversionRateSTR = useState({ value: "" });
  conversionRate = useState({ value: 0 });

  feeSTR = useState({ value: "" });
  fee = useState({ value: 0 });

  // <!-- step="0.01" min="-9999999999.99" max="9999999999.99" -->
  static template = xml`    
    <div class="sm:grid sm:grid-cols-[34%_64%] gap-y-0 gap-x-2">
      
      <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
        <div class="card-title flex flex-col rounded-lg">
          <div>Amount to Send</div> 
          
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
                  
                  <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"   
                   class="input input-bordered join-item text-right" placeholder="0.00"/>    

                </div>
                
                <select class="select select-bordered join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                  <option value="cup">CUP</option>
                  <option value="usd">USD</option>
                </select>

              </div>

              <div class="form-control   row-start-4 col-span-2 w-full ">
              <label class="label">
                <span class="label-text">Concept</span>
              </label>
            
              <textarea t-ref="concept" class="textarea textarea-bordered" placeholder=""  ></textarea>
            </div>
            </div>
       
          <div class="card-actions">
            
          </div>
        </div>
     
      </div>

        <Beneficiarios  onChangeDatosBeneficiarios.bind="onChangeDatosBeneficiarios" beneficiariosNames="beneficiariosNames" />
        <button class="btn btn-primary mt-2 sm:row-start-2 row-start-3 w-[30%]" t-on-click="onSendMoney">Send</button>   
    </div>
      
  `;

  onChangeDatosBeneficiarios(datosBeneficiario) {
    this.beneficiario = datosBeneficiario;
  }

  setup() {
    const accessToken = window.sessionStorage.getItem('accessToken');
    const walletAddress = window.sessionStorage.getItem('walletAddress');
    const userId = window.sessionStorage.getItem('userId');

    onWillStart(async () => {
      const api = new API(accessToken);
      const exchangeRate = await api.getExchangeRate("usd");
      this.feeSTR.value = '-';
      this.conversionRate.value = exchangeRate["CUP"];
      this.conversionRateSTR.value = `1 USD = ${this.conversionRate.value} CUP`;

      //obteniendo todos los datos de los beneficiarios
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }
      this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
      this.beneficiariosNames = this.allDatosBeneficiariosFromStorage.map(el => ({
        beneficiaryFullName: el.beneficiaryFullName,
        _id: el._id
      }));

    });

    onRendered(() => {

    });

    onMounted(() => {

    })


  }


  async onChangeCurrency() {

    this.inputReceiveRef.el.value = (0).toFixed(2);
    this.inputSendRef.el.value = (0).toFixed(2);

    const accessToken = window.sessionStorage.getItem('accessToken');
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
/*
  async getFee(service, zone, amount) {
    const accessToken = window.sessionStorage.getItem('accessToken');
    const api = new API(accessToken);
    const fee = await api.getFee(service, zone, amount)
    return fee;
  }*/

  onChangeSendInput = API.debounce(async () => {


    if (this.changingReceiveAmount) { return; }
    this.changingSendAmount = true;
    this.changingReceiveAmount = false;

    

    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await UImanager.onChangeSendInput(this.inputReceiveCurrencyRef.el.value,
      this.inputSendCurrencyRef.el.value,
      this.inputSendRef.el.value,
      this.conversionRate.value,
      accessToken
    )
    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;
    this.inputReceiveRef.el.value = resultado.receiveAmount;
    this.inputSendRef.el.value = UImgr.roundDec(this.inputSendRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);

  onChangeReceiveInput = API.debounce(async () => {

    if (this.changingSendAmount) { return; }
    this.changingSendAmount = false;
    this.changingReceiveAmount = true;

    

    //LLAMADA
    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await API.onChangeReceiveInput(
      this.inputReceiveCurrencyRef.el.value,
      this.inputSendCurrencyRef.el.value,
      this.inputReceiveRef.el.value,
      this.conversionRate.value,
      accessToken
    )

   

    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;
    this.inputSendRef.el.value = resultado.sendAmount;
    this.inputReceiveRef.el.value = UImgr.roundDec(this.inputReceiveRef.el.value);


    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);


  async onSendMoney() {
    const service = `delivery${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

    //TODO: Validaciones
    const datosTX = {
      service: service,
      amount: this.inputSendRef.el.value,                                           //Cantidad a enviar, incluyendo el fee
      currency: this.inputSendCurrencyRef.el.value.toUpperCase(),                   //moneda del envio
      deliveryAmount: this.inputReceiveRef.el.value,                                //Cantidad que recibe el beneficiario
      deliveryCurrency: this.inputReceiveCurrencyRef.el.value.toUpperCase(),        //moneda que se recibe      
      concept: this.concept.el.value,                                               //Concepto del envio  
      merchant_external_id: API.generateRandomID(),
      paymentLink: true,
      ...this.beneficiario
    };

    if (!this.validarDatos(datosTX)) {
      console.log("Validation Errors");
      return;
    }

    console.log(datosTX);

    try {
      const accessToken = window.sessionStorage.getItem('accessToken');
      const api = new API(accessToken);
      const resultado = await api.createTXHomeDeliveryCuba(datosTX);

      //TODO OK
      if (resultado.data) {
        if (resultado.data.status === 200) {
          Swal.fire(resultado.data.payload);
        }
      }

      //Error pero aun responde el API
      if (resultado.response) {
        Swal.fire(resultado.response.data.message);
      }

    } catch (error) {
      console.log(error);
      // Swal.fire(resultado.response.data.message);
    }

  }


  validarDatos(datos) {
    console.log(datos)
    //--------------------- Sending amount --------------------------------------------
    if (!datos.amount) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the sending amount'
      })
      return false;
    } else if (datos.amount <= 0) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Sending amount must be greater than zero'
      })
      return false;
    }

    //--------------------- Receivers amount --------------------------------------------
    if (datos.amount <= 0) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'The received amount must be greater than zero'
      })
      return false;
    }

    //--------------------- Municipio --------------------------------------------
    if (!datos.deliveryCity || datos.deliveryCity === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please select city'
      })
      return false;
    }

    //--------------------- Nombre --------------------------------------------
    if (!datos.deliveryFirstName || datos.deliveryFirstName === '' || !datos.deliveryLastName || datos.deliveryLastName === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the full name of receiver First name and Last name at least'
      })
      return false;
    }

    //--------------------- id --------------------------------------------
    if (!datos.deliveryID || datos.deliveryID === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the ID'
      })
      return false;
    }

    //--------------------- address --------------------------------------------
    if (!datos.deliveryAddress || datos.deliveryAddress === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the address'
      })
      return false;
    }

    //--------------------- Phone --------------------------------------------
    if (!datos.deliveryPhone || datos.deliveryPhone === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the phone number'
      })
      return false;
    }

    return true;

  }

}

