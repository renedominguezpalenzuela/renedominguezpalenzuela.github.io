const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;

import { API, UImanager } from "../utils.js";
import { Beneficiarios } from "./homedeliveryCubaBeneficiario.js";

import { Provincias } from "../../data/provincias_cu.js";
import { ListaTR } from "./listatr.js";
//ERROR: si se selecciona desde la lista de transacciones no pone bien el tipo de cambio
//el total a enviar
//TODO: Desacoplar la vista de los calculos para poder implementar prubas unitarias
export class HomeDeliveryCuba extends Component {

  tipo_operacion = {
    name: "DELIVERY_TRANSACTION"
  }

  static components = { Beneficiarios, ListaTR };

  inputAvatar = useRef("inputAvatar");
  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");
  concept = useRef("concept");
  inputSendCurrencyRef = useRef("inputSendCurrencyRef");
  inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");

  //changingSendAmount = false;
  //changingReceiveAmount = false;


  datosSelectedTX = useState({
    txID: "",
    allData: null
  })

  state = useState({
    firstName: "Rene",
    lastName: "Dominguez",
    avatar: "/img/photo-1534528741775-53994a69daeb.jpg",
    address: "",
    nameFull: "",
  })



  //Contendra los datos del beneficiario al que se le envia la transferencia
  beneficiario = useState({

  })


  //moneda_vs_USD = 1;


  totalSendCost = useState({ value: 0 });
  totalSendCostSTR = useState({ value: "0" });


  //conversionRateSTR = useState({ value: "" });
  conversionRate = useState({ value: 0 });


  feeSTR = useState({ value: "0" });
  fee = useState({ value: 0 });

  monedas = useState({
    enviada: "USD",
    recibida: "CUP"
  })



  static template = xml` 
  <div class="sm:grid sm:grid-cols-[34%_64%] gap-y-0 gap-x-2">
      <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
          <div class="card-title flex flex-col rounded-lg">
              <div>Amount to Send</div>       
          </div>
          <div class="card-body items-center  ">
              <div class="form-control  w-full ">
                  <label class="label">
                    <span class="label-text">You Send</span>  
                  </label> 

                  <div class="join">
                    
                      

                      <input type="text" t-ref="inputSendRef" t-on-input="onChangeSendInput"    class="input w-full input-bordered join-item text-right" placeholder="0.00"/>


                      

                      <select class="select select-bordered join-item" t-on-input="onChangeCurrencySend" t-ref="inputSendCurrencyRef" >                    
                          <option value="usd">USD</option>
                          <option value="eur">EUR</option>
                          <option value="cad">CAD</option>

                      </select>

                  </div>
                  <div class="text-[0.8rem]  pr-[3vw] mt-[0.5rem]">
                  
                      <div class=" text-right ">  
                          <span > Exchange rate: 1 <t t-esc="this.monedas.enviada"/> = </span>
                          <t t-esc="this.conversionRate.value"/> 
                          <span class="ml-1"> 
                          <t t-esc="this.monedas.recibida"/> 
                          </span>
                      </div>                    
                      <div class=" text-right "> 
                          <span class="mr-2"> Send Fee: </span>
                          <t t-esc="this.feeSTR.value"/> 
                          <span class="ml-1"> <t t-esc="this.monedas.enviada"/> </span>
                      </div>
                     
                      <div class=" text-right  "> 
                          <span class="mr-2"> Total Sending Cost (plus fee): </span>
                          <t t-esc="this.totalSendCostSTR.value"/>
                          <span class="ml-1"> <t t-esc="this.monedas.enviada"/> </span>
                      </div>
                      
                  </div>

                  <div class="form-control    w-full">
                      <label class="label">
                        <span class="label-text">Received Amount</span>  
                      </label> 
        
                      <div class="join">                     
                        <div>                                
                          <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"   
                          class="input input-bordered join-item text-right w-full" placeholder="0.00"/>    
                        </div>
                        
                        <select class="select select-bordered join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                          <option value="cup">CUP</option>
                          <option value="usd">MLC(USD)</option>
                        </select>
                      </div>
        
                      <div class="form-control   row-start-4 col-span-2 w-full ">
                        <label class="label">
                          <span class="label-text">Concept</span>
                        </label>
                  
                        <textarea t-ref="concept" class="textarea textarea-bordered" placeholder=""  ></textarea>
                      </div>
                </div>
           
             
              </div>
              <div class="card-actions">
                    
              </div>
              <select class="select">
  <option value="1" data-mdb-icon="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg"
    >One</option
  >
  <option value="2" data-mdb-icon="https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg"
    >Two</option
  >
  <option value="3" data-mdb-icon="https://mdbootstrap.com/img/Photos/Avatars/avatar-3.jpg"
    >Three</option
  >
  <option value="4" data-mdb-icon="https://mdbootstrap.com/img/Photos/Avatars/avatar-4.jpg"
    >Four</option
  >
  <option value="5" data-mdb-icon="https://mdbootstrap.com/img/Photos/Avatars/avatar-5.jpg"
    >Five</option
  >
</select>
          </div>
      </div>

    



    


      <Beneficiarios  onChangeDatosBeneficiarios.bind="onChangeDatosBeneficiarios" beneficiariosNames="beneficiariosNames" datosSelectedTX="this.datosSelectedTX" />
      <button class="btn btn-primary mt-2 sm:row-start-2 row-start-3 w-[30%]" t-on-click="onSendMoney">Send</button>  
        
      

      <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2 sm:row-start-3 row-start-4 sm:col-span-2 p-3">     
          <ListaTR tipooperacion="this.tipo_operacion.name" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
      </div>
  

  </div>
      
  `;

  onChangeDatosBeneficiarios(datosBeneficiario) {
    this.beneficiario = datosBeneficiario;

  }

  setup() {
    const accessToken = window.sessionStorage.getItem('accessToken');
    //const walletAddress = window.sessionStorage.getItem('walletAddress');
    //const userId = window.sessionStorage.getItem('userId');


    onWillStart(async () => {
      const api = new API(accessToken);

      //Pidiendo las tasas de conversion de monedas
      //await this.pedirTasadeCambio("usd", "cup");

      //obteniendo todos los datos de los beneficiarios
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
      // console.log(allDatosBeneficiarios)

      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }
      this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));


      if (this.allDatosBeneficiariosFromStorage) {
        this.beneficiariosNames = this.allDatosBeneficiariosFromStorage.map(el => ({
          beneficiaryFullName: el.beneficiaryFullName,
          _id: el._id,
          CI: el.deliveryCI
        }));
      }



      this.tiposCambio = await api.getAllTiposDeCambio();




    });

    onRendered(() => {

    });

    onMounted(() => {

      const monedaEnviada = this.inputSendCurrencyRef.el.value;
      const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

      this.monedas.enviada = monedaEnviada.toUpperCase();

      this.monedas.recibida = monedaRecibida.toUpperCase();




      const tc = this.tiposCambio[monedaEnviada.toUpperCase()][monedaRecibida.toUpperCase()];



      this.conversionRate.value = tc;




    })


  }

  /*
    async pedirTasadeCambio(sendCurrency, receiveCurrency) {
      const accessToken = window.sessionStorage.getItem('accessToken');
      const api = new API(accessToken);
  
      if (receiveCurrency && sendCurrency) {
        const exchangeRate = await api.getExchangeRate(sendCurrency);
        this.conversionRate.value = exchangeRate[receiveCurrency.toUpperCase()];
        this.moneda_vs_USD = exchangeRate["USD"];
        this.conversionRateSTR.value = `1 ${sendCurrency.toUpperCase()} = ${this.conversionRate.value} ${receiveCurrency.toUpperCase()}`;
        this.feeSTR.value = '-';
      }
    }*/

  /*
    async onChangeCurrency() {
  
      this.inputReceiveRef.el.value = (0).toFixed(2);
      this.inputSendRef.el.value = (0).toFixed(2);
  
      const sendCurrency = this.inputSendCurrencyRef.el.value;
      const receiveCurrency = this.inputReceiveCurrencyRef.el.value;
  
      await this.pedirTasadeCambio(sendCurrency, receiveCurrency);
    }*/

  onChangeCurrencySend() {
    //this.onChangeCurrency();
    this.onChangeSendInput()
  }

  onChangeCurrencyRecib() {
    //this.onChangeCurrency();
    this.onChangeReceiveInput();
  }

  /*
  onChangeSendInput = API.debounce(async () => {

    if (this.changingReceiveAmount) { return; }
    this.changingSendAmount = true;
    this.changingReceiveAmount = false;


    //ACtualizar variables de tasas de cambio
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;
    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);

    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await UImanager.onChangeSendInput(this.inputReceiveCurrencyRef.el.value,
      this.inputSendCurrencyRef.el.value,
      this.inputSendRef.el.value,
      this.conversionRate.value,
      accessToken,
      this.moneda_vs_USD
    )
    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;
    this.inputReceiveRef.el.value = resultado.receiveAmount;
    this.inputSendRef.el.value = UImanager.roundDec(this.inputSendRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);
  */

  /*
  onChangeReceiveInput = API.debounce(async () => {

    if (this.changingSendAmount) { return; }
    this.changingSendAmount = false;
    this.changingReceiveAmount = true;


    //ACtualizar variables de tasas de cambio
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;
    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);


    //LLAMADA
    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await UImanager.onChangeReceiveInput(
      this.inputReceiveCurrencyRef.el.value,
      this.inputSendCurrencyRef.el.value,
      this.inputReceiveRef.el.value,
      this.conversionRate.value,
      accessToken,
      this.moneda_vs_USD
    )
    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;
    this.inputSendRef.el.value = resultado.sendAmount;
    this.inputReceiveRef.el.value = UImanager.roundDec(this.inputReceiveRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);


  */



  async calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, tipoCambio) {

  

    const service = `delivery${monedaRecibida.toUpperCase()}`;
    const zone = this.beneficiario.deliveryZona;
    //TODO: el fee depende del zone, el zone de la provincia, recalcular el fee antes de hacer el envio
    //pues el usuario puede haber cambiado la provincia
    const accessToken = API.getTokenFromSessionStorage();

    console.log(service)
    console.log(zone)
    console.log(cantidadRecibida)

    const api = new API(accessToken);
    const feeResultUSD = await api.getFee(service, zone, cantidadRecibida)
    const feeUSD = feeResultUSD.fee;
    console.log("Fee USD")
    console.log(feeUSD)
    //Aplicar TC al fee en USD, para obtenerlo en la moneda enviada
    const monedaEnviadaUSD = 'USD';

    //Segun darian 
    /*
        monedaBase = monedaEnviada (EUR)
        monedaAconvertir = USD

         const feeMonedaEnviada = UImanager.aplicarTipoCambio1(feeUSD, tipoCambio,  monedaEnviada, monedaEnviadaUSD);


    */

    //Version original mia: const feeMonedaEnviada = UImanager.aplicarTipoCambio1(feeUSD, tipoCambio, monedaEnviadaUSD, monedaEnviada);
    const feeMonedaEnviada = UImanager.aplicarTipoCambio2(feeUSD, tipoCambio,  monedaEnviada, monedaEnviadaUSD);
    console.log(`Fee en moneda ${monedaEnviada}`)
    console.log(feeMonedaEnviada)

    const tc = tipoCambio[monedaEnviada.toUpperCase()][monedaRecibida.toUpperCase()];

    this.conversionRate.value = tc;
    this.fee.value = feeMonedaEnviada;
    this.feeSTR.value = UImanager.roundDec(this.fee.value)

    return feeMonedaEnviada;

  }

  onChangeSendInput = API.debounce(async () => {

    const cantidadEnviada = this.inputSendRef.el.value;
    const monedaEnviada = this.inputSendCurrencyRef.el.value;
    const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

    console.log(`Send input, moneda enviada`)
    this.monedas.enviada = monedaEnviada.toUpperCase()


    this.monedas.recibida = monedaRecibida.toUpperCase()

    const cantidadRecibida = UImanager.calcularCantidadRecibida(cantidadEnviada, this.tiposCambio, monedaEnviada, monedaRecibida);

    this.inputReceiveRef.el.value = UImanager.roundDec(cantidadRecibida);


    //Comun
    const feeMonedaEnviada = await this.calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio);

    this.totalSendCost.value = Number(cantidadEnviada) + Number(feeMonedaEnviada);
    this.totalSendCostSTR.value = UImanager.roundDec(this.totalSendCost.value);

  }, 700);


  onChangeReceiveInput = API.debounce(async () => {

    const cantidadRecibida = this.inputReceiveRef.el.value;
    const monedaEnviada = this.inputSendCurrencyRef.el.value;
    const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

    this.monedas.enviada = monedaEnviada.toUpperCase()
    this.monedas.recibida = monedaRecibida.toUpperCase()

    const cantidadEnviada = UImanager.calcularCantidadEnviada(cantidadRecibida, this.tiposCambio, monedaEnviada, monedaRecibida);

    this.inputSendRef.el.value = UImanager.roundDec(cantidadEnviada);


    //Comun

    const feeMonedaEnviada = await this.calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio);

    this.totalSendCost.value = Number(cantidadEnviada) + Number(feeMonedaEnviada);
    this.totalSendCostSTR.value = UImanager.roundDec(this.totalSendCost.value);



  }, 700);
  async onSendMoney() {
    const service = `delivery${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

    //Eliminar datos
    //delete this.beneficiario["deliveryCityID"];

    //TODO: Validaciones
    const datosTX = {
      service: service,
      amount: UImanager.roundDec(this.totalSendCost.value) ,                                           //Cantidad a enviar, incluyendo el fee
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

    delete datosTX["deliveryCityID"];


    console.log("DATOS")


    console.log(datosTX);




    try {
      const accessToken = window.sessionStorage.getItem('accessToken');
      const api = new API(accessToken);
      const resultado = await api.createTXHomeDeliveryCuba(datosTX);

      //TODO OK
      if (resultado.data) {
        //se proceso correctamente la operacion
        if (resultado.data.status === 200 && !resultado.data.paymentLink) {
          Swal.fire(resultado.data.payload);
        }

        //El saldo no es suficiente, la operacion esta en espera y se envia payment link para completar
        if (resultado.data.status === 200 && resultado.data.paymentLink) {
          //redireccionar a otra pagina 
          const paymentLink = resultado.data.paymentLink.url;

          Swal.fire({
            title: 'Insuficient Funds',
            text: "The transaction is pending, but your balance is insuficient to complete the transaction",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Clic to refund',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(paymentLink, 'popup', 'width=600,height=600');
            }
          })
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


  //Recibiendo los datos de la TX seleccionada
  onChangeSelectedTX = async (datos) => {

    this.datosSelectedTX.txID = datos._id;
    this.datosSelectedTX.allData = { ...datos }
    this.inputSendRef.el.value = datos.transactionAmount.toFixed(2);
    this.inputReceiveCurrencyRef.el.value = datos.metadata.deliveryCurrency.toLowerCase();
    this.inputSendCurrencyRef.el.value = datos.currency.toLowerCase();
    this.concept.el.value = datos.concept;
    await this.onChangeSendInput()

  }


  setearBeneficiario = async (CIBeneficiario) => {

    const beneficiarioName = this.beneficiarioData.beneficiariosNames.filter((unBeneficiario) => unBeneficiario.CI === CIBeneficiario)[0];

    if (!beneficiarioName) { return }

    this.beneficiarioData.selectedBeneficiaryId = beneficiarioName._id;

    this.setearDatosBeneficiario(beneficiarioName._id)

  }

}


