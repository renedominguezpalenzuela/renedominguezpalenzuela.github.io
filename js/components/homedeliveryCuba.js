const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;

import { API, UImanager } from "../utils.js";
import { Beneficiarios } from "./homedeliveryCubaBeneficiario.js";

import { Provincias } from "../../data/provincias_cu.js";
import { ListaTR } from "./listatr.js";
//ERROR: si se selecciona desde la lista de transacciones no pone bien el tipo de cambio
//el total a enviar
//TODO: Desacoplar la vista de los calculos para poder implementar prubas unitarias
export class HomeDeliveryCuba extends Component {

  /*tipo_operacion = {
    name: "DELIVERY_TRANSACTION"
  }*/

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

  
  errores = useState({
    sendAmount: false,
    receiveAmount: false,    
    concept: false,
    
    deliveryFirstName: false,
    deliveryLastName: false,
    deliverySecondLastName: false,
    deliveryID:false,
    deliveryAddress: false,

    deliveryPhone:false,      

    selectedBeneficiary: false,
       
    province: false,
    city: false,    
    
    
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

  tipo_operacion = [3,4,5];

  beneficiariosNames =[]



  static template = xml` 
  <div class="sm:tw-grid sm:tw-grid-cols-[34%_64%] tw-gap-y-0 tw-gap-x-2">
      <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
          <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
              <div>Amount to Send</div>       
          </div>
          <div class="tw-card-body tw-items-center  ">
              <div class="tw-form-control  tw-w-full ">
                  <label class="tw-label">
                    <span class="tw-label-text">You Send</span>  
                  </label> 

                  <div class="tw-join">
                    
                      

                      <input type="text" t-ref="inputSendRef" t-on-blur="onBlurSendInput" t-on-input="onChangeSendInput" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"   class="tw-input tw-w-full tw-input-bordered tw-join-item tw-text-right" placeholder="0.00"/>


                      

                      <select class="tw-select tw-select-bordered tw-join-item" t-on-input="onChangeCurrencySend" t-ref="inputSendCurrencyRef" >                    
                          <option value="usd">USD</option>
                          <option value="eur">EUR</option>
                          <option value="cad">CAD</option>

                      </select>

                  </div>

                  
                <span t-if="this.errores.sendAmount==true" class="error">
                   Error in field!!!
                </span>  
             
                  <div class="tw-text-[0.8rem]  tw-pr-[3vw] tw-mt-[0.5rem]">
                  
                      <div class=" tw-text-right ">  
                          <span > Exchange rate: 1 <t t-esc="this.monedas.enviada"/> = </span>
                          <t t-esc="this.conversionRate.value"/> 
                          <span class="tw-ml-1"> 
                          <t t-esc="this.monedas.recibida"/> 
                          </span>
                      </div>                    
                      <div class=" tw-text-right "> 
                          <span class="tw-mr-2"> Send Fee: </span>
                          <t t-esc="this.feeSTR.value"/> 
                          <span class="tw-ml-1"> <t t-esc="this.monedas.enviada"/> </span>
                      </div>
                     
                      <div class=" tw-text-right  "> 
                          <span class="tw-mr-2"> Total Sending Cost (plus fee): </span>
                          <t t-esc="this.totalSendCostSTR.value"/>
                          <span class="tw-ml-1"> <t t-esc="this.monedas.enviada"/> </span>
                      </div>
                      
                  </div>

                  <div class="tw-form-control    tw-w-full">
                      <label class="tw-label">
                        <span class="tw-label-text">Received Amount</span>  
                      </label> 
        
                      <div class="tw-join">                     
                        <div>                                
                          <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"  onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')" 
                          class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00"/>    
                        </div>
                        
                        <select class="tw-select tw-select-bordered tw-join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                          <option value="cup">CUP</option>
                          <option value="usd">USD</option>
                        </select>
                      </div>

                      <span t-if="this.errores.receiveAmount==true" class="error">
                         Error in field!!!
                      </span> 
        
                      <div class="tw-form-control   tw-row-start-4 tw-col-span-2 tw-w-full ">
                        <label class="tw-label">
                          <span class="tw-label-text">Concept</span>
                        </label>
                  
                        <textarea t-ref="concept" class="tw-textarea tw-textarea-bordered" placeholder=""  ></textarea>
                         <span t-if="this.errores.concept==true" class="error">
                            Error in field!!!
                         </span> 
                      </div>
                </div>
           
             
              </div>
              <div class="tw-card-actions">
                    
              </div>
             
          </div>
      </div>

    



    


       <Beneficiarios errores="this.errores"  onChangeDatosBeneficiarios.bind="onChangeDatosBeneficiarios" beneficiariosNames="beneficiariosNames" datosSelectedTX="this.datosSelectedTX" /> 
      <button class="tw-btn tw-btn-primary tw-mt-2 sm:tw-row-start-2 tw-row-start-3 tw-w-[30%]" t-on-click="onSendMoney">Send</button>  
        
    


      <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2 sm:tw-row-start-3 tw-row-start-4 sm:tw-col-span-2 tw-p-3">     
          <ListaTR tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
      </div>

  </div>
      
  `;

  onChangeDatosBeneficiarios(datosBeneficiario) {
    this.beneficiario = datosBeneficiario;

    

  }

  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    
    if (!accessToken) { return }
    //const walletAddress = window.localStorage.getItem('walletAddress');
    //const userId = window.localStorage.getItem('userId');


    onWillStart(async () => {
     
      const api = new API(accessToken);
     

      //Pidiendo las tasas de conversion de monedas
      //await this.pedirTasadeCambio("usd", "cup");

      //obteniendo todos los datos de los beneficiarios
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
      // console.log(allDatosBeneficiarios)

      if (allDatosBeneficiarios) {
        window.localStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }
      this.allDatosBeneficiariosFromStorage = JSON.parse(window.localStorage.getItem('beneficiariesFullData'));


      this.beneficiarioData =[]
      
      
      if (this.allDatosBeneficiariosFromStorage  && this.allDatosBeneficiariosFromStorage.length>0 )  {
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


  onChangeCurrencySend() {
    //this.onChangeCurrency();
    this.onChangeSendInput()
  }

  onChangeCurrencyRecib() {
    //this.onChangeCurrency();
    this.onChangeReceiveInput();
  }

  

  onBlurSendInput = (event) => {
    this.errores.sendAmount = UImanager.validarSiMenorQueCero(event.target.value);
  }

  onChangeSendInput = API.debounce(async () => {

    const cantidadEnviada = this.inputSendRef.el.value;
    this.errores.sendAmount = UImanager.validarSiMenorQueCero(cantidadEnviada);

    const monedaEnviada = this.inputSendCurrencyRef.el.value;
    const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

    console.log(`Send input, moneda enviada`)
    this.monedas.enviada = monedaEnviada.toUpperCase()


    this.monedas.recibida = monedaRecibida.toUpperCase()
    

    const cantidadRecibida = UImanager.calcularCantidadRecibida(cantidadEnviada, this.tiposCambio, monedaEnviada, monedaRecibida);
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(cantidadRecibida);

    this.inputReceiveRef.el.value = UImanager.roundDec(cantidadRecibida);


    //Comun
//    const feeMonedaEnviada = await this.calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio, this.beneficiario.deliveryZona);
    const feeOBJ = await UImanager.calculateAndShowFee('delivery',cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio, this.beneficiario.deliveryZona);
    console.log("FEE OBJ")
console.log(feeOBJ)
    this.fee.value  =  feeOBJ.feeMonedaEnviada;
    this.conversionRate.value =feeOBJ.conversionRate;
    this.feeSTR.value = feeOBJ.feeSTR;


    this.totalSendCost.value = Number(cantidadEnviada) + Number(this.fee.value);
    this.totalSendCostSTR.value = UImanager.roundDec(this.totalSendCost.value);

  }, 700);


  
  onBlurReceiveInput = (event) => {
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(event.target.value);
  }

  onChangeReceiveInput = API.debounce(async () => {

    const cantidadRecibida = this.inputReceiveRef.el.value;
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(cantidadRecibida);


    const monedaEnviada = this.inputSendCurrencyRef.el.value;
    const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

    this.monedas.enviada = monedaEnviada.toUpperCase()
    this.monedas.recibida = monedaRecibida.toUpperCase()

    const cantidadEnviada = UImanager.calcularCantidadEnviada(cantidadRecibida, this.tiposCambio, monedaEnviada, monedaRecibida);
    this.errores.sendAmount = UImanager.validarSiMenorQueCero(cantidadEnviada);

    this.inputSendRef.el.value = UImanager.roundDec(cantidadEnviada);


    //Comun

    //const feeMonedaEnviada = await this.calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio);
    const feeOBJ = await UImanager.calculateAndShowFee('delivery', cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio, this.beneficiario.deliveryZona);
    console.log("FEE OBJ")
    console.log(feeOBJ)
    this.fee.value  =  feeOBJ.feeMonedaEnviada;
    this.conversionRate.value =feeOBJ.conversionRate;
    this.feeSTR.value = feeOBJ.feeSTR;



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


  
    
    delete datosTX["deliveryCityID"];


    console.log("DATOS")


    console.log(datosTX);

    const validacionOK =await this.validarDatos(datosTX)
    console.log("Errores en validacion")
    console.log(validacionOK)

    if (!validacionOK) {
      console.log("Validation Errors");
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Validation errors'
      })

      return;
    }

 





    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const api = new API(accessToken);
      const resultado = await api.createTXHomeDeliveryCuba(datosTX);
      
      const urlHome = this.props.urlHome ? this.props.urlHome : null;

      UImanager.gestionResultado(resultado, urlHome, this.props.menuController);

    } catch (error) {
      console.log(error);
      // Swal.fire(resultado.response.data.message);
    }

  }




  async validarDatos(datos) {

    this.errores.sendAmount = UImanager.validarSiMenorQueCero(datos.amount);
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(datos.deliveryAmount);

    this.errores.deliveryFirstName = UImanager.validarSiVacio(datos.deliveryFirstName)
    this.errores.deliveryLastName = UImanager.validarSiVacio(datos.deliveryLastName)
	  this.errores.deliverySecondLastName = UImanager.validarSiVacio(datos.deliverySecondLastName)

    this.errores.deliveryID = UImanager.validarCI(datos.deliveryID)
    this.errores.deliveryAddress = UImanager.validarSiVacio(datos.deliveryAddress)


    console.log(this.errores)
    



    let hayErrores = false;


    for (let clave in this.errores) {
      if (this.errores[clave] == true) {
        console.log("Error en validacion")
        console.log(clave)
        
        hayErrores = true;

      }

    }
  

    return !hayErrores;

    /*
    this.errores.sendAmount = UImanager.validarSiMenorQueCero(datos.amount);
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(datos.deliveryAmount);


    for (let clave in this.errores) {
      if (this.errores[clave] == true) {
        console.log(clave)
        return false;

      }

    }

    return true;*/

    /*
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

    return true;*/

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


