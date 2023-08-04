const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;
import { API, UImanager } from "../utils.js";
//import { Beneficiarios } from "./sendmoneyCubaBeneficiario.js";
import { ListaTR } from "./listatr.js";
import { Provincias } from "../../data/provincias_cu.js";

//TODO: refactorizar en un componente la parte de las monedas y el importe

export class SendMoneyCuba extends Component {

  static components = {  ListaTR };

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
  })

  datosSelectedTX = useState({
    txID: "",
    allData: null
  })



  beneficiario = useState({

  })

  cardList = useState({
    value: []

  })

 

  conversionRateSTR = useState({ value: "" });
  conversionRate = useState({ value: 0 });

  feeSTR = useState({ value: "" });
  fee = useState({ value: 0 });


  moneda_vs_USD = 1;

  tipo_operacion = {
    //name: "CASH_OUT_TRANSACTION"
    name: "CREDIT_CARD_TRANSACTION"
  }

  beneficiarioData = useState({
    beneficiariosNames:[],
    cardsList:[],
    selectedBeneficiaryId:'-1',
    selectedCard:'-1',
    cardBankImage:'',
    cardNumber:''



  })



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
       <!-- Beneficiario -->
          <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2">
            <div class="card-title flex flex-col rounded-lg pt-2">
              <div>Beneficiary</div> 
            </div>

            <div class="card-body items-center   ">
              <div class="grid grid-cols-1 sm:grid-cols-2 w-full gap-y-0 gap-x-2 ">

                  <div class="form-control w-full sm:row-start-1 ">
                    <label class="label">
                      <span class="label-text">Select Beneficiary</span>
                    </label>
                    <select t-att-value="this.beneficiarioData.selectedBeneficiaryId"  class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario" >
                      <option  t-att-value="-1" >Select Beneficiary</option>
                      <t t-foreach="this.beneficiarioData.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                        <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                      </t>    
                                
                    </select>
                  </div> 
                  
                  <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                        <span class="label-text">Select Card</span>
                    </label>
                  
                    <select t-att-value="this.beneficiarioData.selectedCard" class="select select-bordered w-full" t-on-input="onChangeSelectedCard">
                      <option  t-att-value="-1" >Select Card</option>
                      <t t-foreach="this.beneficiarioData.cardsList" t-as="unCard" t-key="unCard.number">
                        <option t-att-value="unCard.number">
                          
                          <t t-esc="unCard.currency"/> -
                          <t t-esc="unCard.number"/>
                        </option>
                      </t>             
                  </select>
                </div>


                <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                      <span class="label-text">Card Number</span>
                    </label>
                    <input type="text" t-att-value="this.beneficiarioData.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                </div>

                <div class=" flex items-center w-full row-start-3 mt-1">
                  <img t-att-src="this.beneficiarioData.cardBankImage" alt="" class="ml-3  sm:w-[10vw] w-[30vw]"/>
                </div>

              
                          
                
            </div>
          </div>
         
        
        </div>    
        <!-- Beneficiario END -->


       <button class="btn btn-primary mt-2 sm:row-start-2 row-start-3 w-[30%]" t-on-click="onSendMoney">Send</button>


     <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2 sm:row-start-3 row-start-4 sm:col-span-2">
       <div class="card-body items-center  ">
         <ListaTR tipooperacion="this.tipo_operacion.name" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
       </div>
     </div>
      
    </div>

  `;




  //CASH_OUT_TRANSACTION
  setup() {
    
    const accessToken = API.getTokenFromSessionStorage();
    //const walletAddress = window.sessionStorage.getItem('walletAddress');
    //const userId = window.sessionStorage.getItem('userId');

    onWillStart(async () => {
      const api = new API(accessToken);

      //Pidiendo las tasas de conversion de monedas
      await this.pedirTasadeCambio("usd", "cup");

      //obteniendo todos los datos de los beneficiarios desde el API
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }
      this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
      if (this.allDatosBeneficiariosFromStorage) {
        this.beneficiarioData.beneficiariosNames = this.allDatosBeneficiariosFromStorage.map(el => ({
          beneficiaryFullName: el.beneficiaryFullName,
          _id: el._id,
          CI: el.deliveryCI
        }));




        this.beneficiarioData.cardsList = this.allDatosBeneficiariosFromStorage[0].creditCards;

      }

      this.provincias = Provincias;
      this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);
     
      this.cardRegExp = await api.getCardRegExp();


    });

    onRendered(() => {

    });

    onMounted(async () => {
      this.setearBeneficiario(this.beneficiarioData.beneficiariosNames[0].CI);

    })

  }


  async pedirTasadeCambio(sendCurrency, receiveCurrency) {
    const accessToken = window.sessionStorage.getItem('accessToken');
    const api = new API(accessToken);

    if (receiveCurrency && sendCurrency) {
      const exchangeRate = await api.getExchangeRate(sendCurrency);
      if (exchangeRate) {
        this.conversionRate.value = exchangeRate[receiveCurrency.toUpperCase()];
        this.moneda_vs_USD = exchangeRate["USD"];
        this.conversionRateSTR.value = `1 ${sendCurrency.toUpperCase()} = ${this.conversionRate.value} ${receiveCurrency.toUpperCase()}`;
        this.feeSTR.value = '-';
      }
    }
  }


  async onChangeCurrency() {

    this.inputReceiveRef.el.value = (0).toFixed(2);
    this.inputSendRef.el.value = (0).toFixed(2);

    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;

    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);

  }

  onChangeCurrencySend() {
    this.onChangeCurrency();
  }

  onChangeCurrencyRecib() {
    this.onChangeCurrency();
  }



  onChangeSendInput = API.debounce(async () => {

    if (this.changingReceiveAmount) { return; }
    this.changingSendAmount = true;
    this.changingReceiveAmount = false;

    //ACtualizar variables de tasas de cambio
    const sendCurrency = this.inputSendCurrencyRef.el.value;
    const receiveCurrency = this.inputReceiveCurrencyRef.el.value;
    await this.pedirTasadeCambio(sendCurrency, receiveCurrency);

    //Pide el fee y Calcula el resultado
    //TODO: refactorizar, pedir el fee una funcion, calcular los resultados otra
    const accessToken = window.sessionStorage.getItem('accessToken');
    const resultado = await UImanager.onChangeSendInput(
      receiveCurrency,                            //moneda recibida
      sendCurrency,                               //moneda del que envia
      this.inputSendRef.el.value,                 //cantidad a enviar
      this.conversionRate.value,
      accessToken,
      this.moneda_vs_USD
    )
    // console.log(resultado)

    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;

    this.inputReceiveRef.el.value = resultado.receiveAmount;
    this.inputSendRef.el.value = UImanager.roundDec(this.inputSendRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);

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
    console.log(resultado)

    this.fee.value = resultado.fee;
    this.feeSTR.value = resultado.feeSTR;
    this.inputSendRef.el.value = resultado.sendAmount;
    this.inputReceiveRef.el.value = UImanager.roundDec(this.inputReceiveRef.el.value);

    this.changingSendAmount = false;
    this.changingReceiveAmount = false;

  }, 700);


  async onSendMoney() {
    //cardCUP	cardUSD
    const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

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
    }

    console.log("DATOS")


    console.log(datosTX);

    if (!this.validarDatos(datosTX)) {
      console.log("Validation Errors");
      return;
    }


    try {

      const accessToken = window.sessionStorage.getItem('accessToken');
      const api = new API(accessToken);
      const resultado = await api.createTX(datosTX);

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
    if (datos.deliveryAmount <= 0) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'The received amount must be greater than zero'
      })
      return false;
    }

    //--------------------- Municipio --------------------------------------------
    if (!datos.receiverCity || datos.receiverCity === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please select city'
      })
      return false;
    }

    //--------------------- Nombre --------------------------------------------
    if (!datos.cardHolderName || datos.cardHolderName === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the full name of receiver. First name and Last name at least'
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
    if (!datos.contactPhone || datos.contactPhone === '') {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: 'Please enter the phone number'
      })
      return false;
    }

    return true;

  }


  onChangeSelectedTX = async (datos) => {
    this.datosSelectedTX.txID = datos._id;
    this.datosSelectedTX.allData = { ...datos }
    this.inputSendRef.el.value = datos.transactionAmount.toFixed(2);
    this.inputReceiveCurrencyRef.el.value = datos.metadata.deliveryCurrency.toLowerCase();
    this.inputSendCurrencyRef.el.value = datos.currency.toLowerCase();
    this.concept.el.value = datos.concept;



    const CIBeneficiariodeTX = this.datosSelectedTX.allData.metadata.deliveryCI;
    console.log("Beneficiario seleccionado en TX")
    console.log(this.datosSelectedTX.allData.metadata)



    

    this.setearBeneficiario(CIBeneficiariodeTX)
  
   


    await this.onChangeSendInput()
    
  }

  onChangeDatosBeneficiarios(IDBeneficiarioSeleccionado) {

    console.log("ID Beneficiario Seleccionado")
    console.log(IDBeneficiarioSeleccionado)
    const beneficiarioSelected = this.allDatosBeneficiariosFromStorage.filter((unBeneficiario) => unBeneficiario._id === IDBeneficiarioSeleccionado)[0];
    console.log(beneficiarioSelected)

    //this.beneficiario = datosBeneficiario;
    this.beneficiarioData.cardsList = beneficiarioSelected.creditCards;

    console.log("Tarketas")
    console.log(this.beneficiarioData.cardsList)
    
  }


  
  setearBeneficiario = async (CIBeneficiario) => {

    console.log("CI")
    console.log(CIBeneficiario)
    console.log("Beneficiario name")
    console.log(this.beneficiarioData.beneficiariosNames)

    const beneficiarioName = this.beneficiarioData.beneficiariosNames.filter((unBeneficiario) => unBeneficiario.CI === CIBeneficiario)[0];

    if(!beneficiarioName) {return}
   
    console.log(beneficiarioName)
    this.beneficiarioData.selectedBeneficiaryId = beneficiarioName._id;

    this.setearDatosBeneficiario(beneficiarioName._id)





  }

  

  onChangeSelectedBeneficiario = async (event) => {
    const selectedBeneficiaryId = event.target.value;
    this.beneficiarioData.selectedBeneficiaryId = selectedBeneficiaryId;

    console.log("onChangeSelectedBeneficiario")
    console.log(selectedBeneficiaryId)

    //this.setearBeneficiario(selectedBeneficiaryId);
    //this.beneficiario.onChangeDatosBeneficiarios(selectedBeneficiaryId)




     this.setearDatosBeneficiario(selectedBeneficiaryId);

    // this.state.cardBankImage = "";
    // this.state.bankName = "";
    // this.cambioBeneficiario = true;
    // this.state.selectedBeneficiaryId = selectedBeneficiaryId;

    // this.inicializarDatosBeneficiario(selectedBeneficiaryId);


  }

  onChangeSelectedCard = async (event) => {


    console.log('Cambio de CARD')
    console.log(this.beneficiarioData.cardsList);
    

    this.beneficiarioData.selectedCard = event.target.value


    const formatedCardNumber = UImanager.formatCardNumber(event.target.value);
    console.log(formatedCardNumber)

    const cardData = this.beneficiarioData.cardsList.filter((unaCard) =>
      UImanager.formatCardNumber(unaCard.number) === formatedCardNumber
    )[0];



    if (cardData) {
      console.log("Hay card data");
      console.log(cardData);
      this.beneficiarioData.cardNumber = formatedCardNumber;
      

      //cardHolderName
      /*this.selectedCard.el.value = event.target.value; 
      
      this.state.cardNumber = formatedCardNumber;
      
      this.state.cardHolderName = cardData.cardHolderName;
      await this.buscarLogotipoBanco(this.state.cardNumber);*/
    } else {
      console.log("NO Hay card data");
      console.log(cardData);
      /*this.state.cardNumber = '';
      this.cardNumber.el.value='';
      this.state.cardHolderName = '';*/
    }



    //this.props.onChangeDatosBeneficiarios(this.state);
  }

  
  setearDatosBeneficiario = async (idBeneficiario) => {

     //Setear el select de tarjetas con la tarjeta de la operacion
    

     const beneficiarioSelected = this.allDatosBeneficiariosFromStorage.filter((unBeneficiario) => unBeneficiario._id === idBeneficiario)[0];
     console.log("Beneficiario selected")
     console.log(beneficiarioSelected)
     this.beneficiarioData.cardsList = beneficiarioSelected.creditCards;


     if (!this.datosSelectedTX.allData) {return}
     this.beneficiarioData.selectedCard =this.datosSelectedTX.allData.metadata.cardNumber.replace(/ /g, "")
     console.log(this.datosSelectedTX.allData);

    
   


    //const selectedCardNumber = this.props.datosSelectedTX.allData.metadata.cardNumber.replace(/ /g, "");

    console.log("Selected card " + this.beneficiarioData.selectedCard)
    //console.log(this.props.datosSelectedTX.allData.metadata.cardNumber)

    //const selectedCard = this.props.cardsList.filter((unCard)=>unCard.number ===selectedCardNumber )[0];
    //console.log(selectedCard.id)


    //console.log(this.selectedCard.el.value)
    //this.selectedCard.el.value = selectedCardNumber;

    //console.log(this.selectedCard.el.value)


    const formatedCardNumber = UImanager.formatCardNumber(this.beneficiarioData.selectedCard);
    this.beneficiarioData.cardNumber = formatedCardNumber;

    //await this.buscarLogotipoBanco(selectedCardNumber);
    //this.selectedCard.el.value="9225959875865500"





  }

}

