const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;
import { API, UImanager } from "../utils.js";
//import { Beneficiarios } from "./sendmoneyCubaBeneficiario.js";
import { ListaTR } from "./listatr.js";
import { Provincias } from "../../data/provincias_cu.js";
import { HomeDeliveryCuba } from "./homedeliveryCuba.js";
// import  "../libs/utils.js"

//TODO: refactorizar en un componente la parte de las monedas y el importe

export class SendMoneyCuba extends Component {

  static components = { ListaTR };

  inputAvatar = useRef("inputAvatar");
  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");
  concept = useRef("concept");
  inputSendCurrencyRef = useRef("inputSendCurrencyRef");
  inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");

  inputContactPhone = useRef("inputContactPhone");
  inputdeliveryAddress = useRef("inputdeliveryAddress");
  inputCardNumber = useRef("inputCardNumber");
  inputcardHolderName = useRef("inputcardHolderName");

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
    card: false,
    concept: false,
    cardHolderName: false,
    phoneField: false,
    deliveryAddress: false,
    province: false,
    city: false


  })

  monedas = useState({
    enviada: "USD",
    recibida: "CUP"
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



  totalSendCost = useState({ value: 0 });
  totalSendCostSTR = useState({ value: "0" });



  conversionRate = useState({ value: 0 });


  feeSTR = useState({ value: "0" });
  fee = useState({ value: 0 });




  tipo_operacion = [1, 2];
  tipoVista = 'SEND_MONEY_CUBA';


  beneficiariosNames = useState({
    names: []
  })


  cardsList = useState({
    cards: []
  });

  municipios = useState({
    names: []
  })

  beneficiarioData = useState({


    selectedBeneficiaryId: '-1',
    selectedCard: '-1',
    cardBankImage: '',
    cardNumber: '',
    cardHolderName: '',
    contactPhone: '',
    deliveryAddress: '',
    receiverCity: '',          //Municipio
    receiverCityID: '',        //Municipio id 
    deliveryArea: '',           //Provincia
    deliveryAreaID: '',         //Provincia id
    deliveryCountry: 'Cuba',
    deliveryCountryCode: 'CU',
    receiverCountry: 'CUB',
    deliveryZona: 'Habana'



  })



  static template = xml`    
    <div class="sm:tw-grid sm:tw-grid-cols-[34%_66%] tw-gap-y-0 tw-gap-x-2">   
      <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
        <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
          <div>Amount to Send</div>         
        </div>

        <div class="tw-card-body tw-items-center  ">
            <div class="tw-form-control  tw-w-full ">
                <label class="tw-label">
                  <span class="tw-label-text">You Send (before fee)</span>  
                </label> 

                <div class="tw-join">                        
        
                    <input type="text" t-ref="inputSendRef"  t-on-input="onChangeSendInput" t-on-blur="onBlurSendInput"  onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"   class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00"/>
                         
                 
                  <select class="tw-select tw-select-bordered tw-join-item" t-on-input="onChangeCurrencySend" t-ref="inputSendCurrencyRef" >                    
                    <option value="usd" selected="selected">USD</option>
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
            </div>
          
              <div class="tw-form-control tw-w-full   ">
                  <label class="tw-label">
                    <span class="tw-label-text">Received Amount</span>  
                  </label> 

                  <div class="tw-join">        
                                              
                      <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"   t-on-blur="onBlurReceiveInput"  onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"  
                      class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00"/>    
                   
                    
                    <select class="tw-select tw-select-bordered tw-join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                      <option value="cup" selected="selected">CUP</option>
                      <option value="usd">MLC</option>
                    </select>
                  </div>

                  <span t-if="this.errores.receiveAmount==true" class="error">
                      Error in field!!!
                  </span> 

                  <div class="tw-form-control   row-start-4 col-span-2 w-full ">
                  <label class="tw-label">
                    <span class="tw-label-text">Concept</span>
                  </label>
                
                  <textarea t-ref="concept" class="tw-textarea tw-textarea-bordered" placeholder="" t-on-input="onChangeConcept" ></textarea>
                  <span t-if="this.errores.concept==true" class="error">
                    Required field!!!
                  </span> 
                </div>
              </div>
    
          <div class="tw-card-actions">         
          </div>
          
        </div>
   
    </div>
       <!-- Beneficiario -->

      
          <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg ">
            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg ">
              <div>Beneficiary</div>                         
            </div>

            <div class="tw-card-body tw-items-center   ">
              <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-w-full tw-gap-y-0 tw-gap-x-2 ">

                  <div class="tw-form-control tw-w-full sm:tw-row-start-1 sm:tw-row-col-1 ">
                    <label class="tw-label">
                      <span class="tw-label-text">Select Beneficiary</span>
                    </label>
                    
                    <select t-att-value="this.beneficiarioData.selectedBeneficiaryId"  class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeSelectedBeneficiario" >
                      <option  t-att-value="-1" >Select Beneficiary</option>
                      <t t-if="this.beneficiariosNames.names.length>0">
                        <t  t-foreach="this.beneficiariosNames.names" t-as="unBeneficiario" t-key="unBeneficiario._id">
                              <option t-att-value="unBeneficiario._id">
                                  <t t-esc="unBeneficiario.beneficiaryFullName"/>                                  
                              </option>
                        </t>     
                      </t>                                     
                    </select>
                    
                  </div> 

                  

                  <div class="tw-form-control tw-w-full tw-max-w-xs sm:tw-row-start-1 sm:tw-row-col-1  tw-row-start-10">
                  <label class="tw-label">
                    <span class="tw-label-text">Country</span>
                  </label>
                  <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="tw-input tw-input-bordered tw-w-full"  t-on-input="onChangeCountryInput" />   
                </div> 
                  
                  <div class="tw-form-control tw-w-full  sm:tw-row-start-2 ">
                    <label class="tw-label">
                        <span class="tw-label-text">Select Card</span>
                    </label>
                  
                    <select t-att-value="this.beneficiarioData.selectedCard" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeSelectedCard">
                      <option  t-att-value="-1" >Select Card</option>
                      
                      <t t-if="this.cardsList.cards.length>0">
                          <t t-foreach="this.cardsList.cards" t-as="unCard" t-key="unCard.number">
                            <option t-att-value="unCard.number">
                              
                              <t t-esc="unCard.currency"/> -
                              <t t-esc="unCard.number"/>
                            </option>
                          </t>
                      </t>
                                  
                  </select>
                  
                </div>


                <div class="tw-form-control tw-w-full  sm:tw-row-start-2 ">
                    <label class="tw-label">
                      <span class="tw-label-text">Card Number</span>
                    </label>
                    <input t-ref="inputCardNumber" type="text" t-att-value="this.beneficiarioData.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="tw-input tw-input-bordered tw-w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                    <span t-if="this.errores.card==true" class="error">
                       Card Number Error!!!
                    </span>
                </div>

                <div class=" tw-flex tw-items-center tw-w-full tw-row-start-3 tw-mt-1">
                  <img t-att-src="this.beneficiarioData.cardBankImage" alt="" class="tw-ml-3  sm:tw-w-[10vw] tw-w-[30vw]"/>
                 
                </div>

                
                <div class="tw-form-control tw-w-full  sm:tw-row-start-4 ">
                <label class="tw-label">
                  <span class="tw-label-text">Card Holder Name</span>
                </label>
                
                <input type="text" t-ref="inputcardHolderName"  t-att-value="this.beneficiarioData.cardHolderName" maxlength="300" 
                placeholder="" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeCardHolderInput" t-on-blur="onBlurCardHolderInput"  />   
                <span t-if="this.errores.cardHolderName==true" class="error">
                   Required field!!!
                </span>
               </div>

    

              <div class="tw-form-control tw-w-full sm:tw-row-start-4 ">
                <label class="tw-label">
                 <span class="tw-label-text">Contact Phone</span>
                </label>
                <input t-ref="inputContactPhone" t-att-value="this.beneficiarioData.contactPhone"  id="phone" name="phone" type="tel" class="selectphone tw-input tw-input-bordered tw-w-full" t-on-input="onChangePhoneInput" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"/>
                <span t-if="this.errores.phoneField==true" class="error">
                  Invalid number!!!
                </span>

                
              </div> 

              
              <div class="tw-form-control  sm:tw-col-span-2 tw-w-full sm:tw-row-start-5">
              <label class="tw-label">
                <span class="tw-label-text">Delivery Address</span>
              </label>           
              <textarea t-ref="inputdeliveryAddress" t-att-value="this.beneficiarioData.deliveryAddress" class="tw-textarea tw-textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
              
              <span t-if="this.errores.deliveryAddress==true" class="error">
                 Required field!!!
              </span>

             </div>



             <div class="tw-form-control tw-w-full sm:tw-row-start-6 ">
             <label class="tw-label">
               <span class="tw-label-text">Province</span>
             </label>
             
             <select t-att-value="this.beneficiarioData.deliveryAreaID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeProvince">
             <option t-att-disabled="true" t-att-value="-1" >Select Province</option>  
             <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                 <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
               </t>             
             </select>
            
             <span t-if="this.errores.province==true" class="error">
              Required field!!!
             </span>
           </div>

           <div class="tw-form-control tw-w-full sm:tw-row-start-6 ">
             <label class="tw-label">
               <span class="tw-label-text">City</span>
             </label>
             
             <select t-att-value="this.beneficiarioData.receiverCityID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeCity">
               <option t-att-disabled="true" t-att-value="-1" >Select city</option>
               <t t-foreach="this.municipios.names" t-as="unMunicipio" t-key="unMunicipio.id">
                 <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
               </t>             
             </select>
            

             <span t-if="this.errores.city==true" class="error">
              Required field!!!
             </span>
           </div>

        

              
                          
                
            </div>
          </div>
         
        
        </div>    

       
        <!-- Beneficiario END -->


       <button class="btn-primary  tw-mt-2 sm:tw-row-start-2 tw-row-start-3 tw-w-[40%]" t-on-click="onSendMoney">Send</button>


     <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2 sm:tw-row-start-3 tw-row-start-4 sm:tw-col-span-2 tw-p-3">
      
         <ListaTR  tipoVista="this.tipoVista" tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
      
     </div>
      
    </div>

  `;




  static props = ["urlHome"];

  static defaultProps = {
    urlHome: '/',
  };


  accessToken = '';

  //CASH_OUT_TRANSACTION
  setup() {

    this.beneficiariosNames.names = []
    this.cardsList.cards = []
    this.provincias = []
    this.municipios.names = []


    this.accessToken = API.getTokenFromsessionStorage();

    API.setRedirectionURL(this.props.urlHome);




    onWillStart(async () => {

      this.provincias = Provincias;
      this.municipios.names = UImanager.addKeyToMunicipios(this.provincias[0].municipios);

        // if (!this.accessToken) { return }


        if (!this.accessToken) {
          console.error("NO ACCESS TOKEN - Send Money cuba")
          window.location.assign(API.redirectURLLogin);
          return;
        }




    });

    onRendered(() => {

    });

    onMounted(async () => {

    


      const api = new API(this.accessToken);


      //obteniendo todos los datos de los beneficiarios desde el API
      const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();
      if (allDatosBeneficiarios) {
        window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
      }

      this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));

      this.beneficiarioData = []

      if (this.allDatosBeneficiariosFromStorage && this.allDatosBeneficiariosFromStorage.length > 0) {

        this.beneficiariosNames.names = this.allDatosBeneficiariosFromStorage.map(el => ({
          beneficiaryFullName: el.beneficiaryFullName,
          _id: el._id,
          CI: el.deliveryCI
        }));

        this.cardsList.cards = this.allDatosBeneficiariosFromStorage[0].creditCards;
      }
      console.log("Beneficiarios")
      console.log(this.beneficiarioData)


      this.cardRegExp = await api.getCardRegExp();

      this.tiposCambio = await api.getAllTiposDeCambio();




      const monedaEnviada = this.inputSendCurrencyRef.el.value;
      const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

      this.monedas.enviada = monedaEnviada.toUpperCase();
      this.monedas.recibida = monedaRecibida.toUpperCase();

      const tc = this.tiposCambio[monedaEnviada.toUpperCase()][monedaRecibida.toUpperCase()];
      this.conversionRate.value = tc;



      this.phoneInput = document.querySelector("#phone");
      this.phonInputSelect = window.intlTelInput(this.phoneInput, {
        separateDialCode: true,   //el codigo del pais solo esta en el select de las banderas
        autoInsertDialCode: true, //coloca el codigo del pais en el input
        formatOnDisplay: false,  //si se teclea el codigo del pais, se selecciona la bandera ej 53 -- cuba
        // autoPlaceholder: "polite",
        // don't insert international dial codes
        nationalMode: true, //permite poner 5465731 en ves de +53 54657331
        initialCountry: "cu",
        excludeCountries: ["in", "il"],
        preferredCountries: ["cu"],
        utilsScript: "js/libs/intlTelIutils.js"
      });

      //this.phoneInput.addEventListener('countrychange', this.handleCountryChange);

      if (this.beneficiariosNames.names.length > 0) {
        this.setearBeneficiario(this.beneficiariosNames.names[0].CI);
      }

    })

  }

  //  handleCountryChange = () => {
  //console.log(this.phonInputSelect.getSelectedCountryData().iso2)
  //console.log(this.phonInputSelect.getSelectedCountryData().name)
  // }

  //Evento al cambiar la moneda a enviar
  onChangeCurrencySend() {
    this.onChangeSendInput()
  }

  //Evento al cambiar la moneda a recibir
  onChangeCurrencyRecib() {
    this.onChangeReceiveInput();
  }

  onBlurSendInput = (event) => {
    this.errores.sendAmount = UImanager.validarSiMenorQueCero(event.target.value);
  }

  onChangeSendInput = API.debounce(async (event) => {

    const cantidadEnviada = this.inputSendRef.el.value;
    this.errores.sendAmount = UImanager.validarSiMenorQueCero(cantidadEnviada);


    const monedaEnviada = this.inputSendCurrencyRef.el.value;
    const monedaRecibida = this.inputReceiveCurrencyRef.el.value;

    this.monedas.enviada = monedaEnviada.toUpperCase()
    this.monedas.recibida = monedaRecibida.toUpperCase()

    console.log("Calcular calcularCantidadRecibida")
    console.log(monedaEnviada, monedaRecibida)
    console.log(this.tiposCambio)

    if (!this.tiposCambio) {
      const api = new API(this.accessToken);
      this.tiposCambio = await api.getAllTiposDeCambio();
    }

    const cantidadRecibida = UImanager.calcularCantidadRecibida(cantidadEnviada, this.tiposCambio, monedaEnviada, monedaRecibida);

    this.inputReceiveRef.el.value = UImanager.roundDec(cantidadRecibida);
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(cantidadRecibida);


    //Comun
    //const feeMonedaEnviada = await this.calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio);

    const feeOBJ = await UImanager.calculateAndShowFee('card', cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio, this.beneficiario.deliveryZona);
    this.fee.value = feeOBJ.feeMonedaEnviada;
    this.conversionRate.value = feeOBJ.conversionRate;
    this.feeSTR.value = feeOBJ.feeSTR;


    this.totalSendCost.value = Number(cantidadEnviada) + Number(this.fee.value);
    this.totalSendCostSTR.value = UImanager.roundDec(this.totalSendCost.value);



  }, 700);

  onChangeConcept = API.debounce(async (event) => {
    this.errores.concept = UImanager.validarSiVacio(event.target.value);
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

    this.inputSendRef.el.value = UImanager.roundDec(cantidadEnviada);

    this.errores.sendAmount = UImanager.validarSiMenorQueCero(cantidadEnviada);

    //Comun

    //const feeMonedaEnviada = await this.calculateAndShowFee(cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio);
    const feeOBJ = await UImanager.calculateAndShowFee('card', cantidadRecibida, monedaRecibida, monedaEnviada, this.tiposCambio, this.beneficiario.deliveryZona);
    this.fee.value = feeOBJ.feeMonedaEnviada;
    this.conversionRate.value = feeOBJ.conversionRate;
    this.feeSTR.value = feeOBJ.feeSTR;

    this.totalSendCost.value = Number(cantidadEnviada) + Number(this.fee.value);
    this.totalSendCostSTR.value = UImanager.roundDec(this.totalSendCost.value);



  }, 700);


  //Boton: Enviar transaccion
  async onSendMoney() {




    //cardCUP	cardUSD
    const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

    //Eliminar datos
    //

    const beneficiario = {
      cardNumber: this.beneficiarioData.selectedCard?this.beneficiarioData.selectedCard : this.beneficiarioData.cardNumber,
      cardHolderName: this.beneficiarioData.cardHolderName,
      contactPhone: this.beneficiarioData.contactPhone,
      deliveryAddress: this.beneficiarioData.deliveryAddress,
      receiverCity: this.beneficiarioData.receiverCity,          //Municipio      
      deliveryArea: this.beneficiarioData.deliveryArea,           //Provincia
      deliveryCountry: 'Cuba',
      deliveryCountryCode: 'CU',
      receiverCountry: 'CUB',
      bankName: this.beneficiarioData.bankName
    }

    //TODO: Validaciones
    const datosTX = {
      service: service,
      amount: UImanager.roundDec(this.totalSendCost.value),                         //Cantidad a enviar, incluyendo el fee
      currency: this.inputSendCurrencyRef.el.value.toUpperCase(),                   //moneda del envio
      deliveryAmount: this.inputReceiveRef.el.value,                                //Cantidad que recibe el beneficiario
      deliveryCurrency: this.inputReceiveCurrencyRef.el.value.toUpperCase(),        //moneda que se recibe      
      concept: this.concept.el.value,                                               //Concepto del envio
      merchant_external_id: API.generateRandomID(),
      paymentLink: true,
      ...beneficiario
    }

    delete datosTX["deliveryCityID"];

    console.log("DATOS")
    console.log(datosTX);

    const validacionOK = await this.validarDatos(datosTX)
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

      this.accessToken = API.getTokenFromsessionStorage();
      const api = new API(this.accessToken);
      const resultado = await api.createTX(datosTX);

      const urlHome = this.props.urlHome ? this.props.urlHome : null;

      UImanager.gestionResultado(resultado, urlHome, this.props.menuController);



    } catch (error) {
      console.log(error);
      // Swal.fire(resultado.response.data.message);
    }

  }

  /*
  Devuelve true si todos los datos ok
  */
  async validarDatos(datos) {
    console.log(datos)


    this.errores.sendAmount = UImanager.validarSiMenorQueCero(datos.amount);
    this.errores.receiveAmount = UImanager.validarSiMenorQueCero(datos.deliveryAmount);
    this.errores.cardHolderName = UImanager.validarSiVacio(datos.cardHolderName);
    this.errores.deliveryAddress = UImanager.validarSiVacio(datos.deliveryAddress);
    this.errores.concept = UImanager.validarSiVacio(datos.concept);

    if (this.beneficiarioData.receiverCityID == -1) {
      this.errores.city = true;
    } else {
      this.errores.city = false;
    }



    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
    // console.log(cod_pais)
    const telefono = cod_pais + datos.contactPhone;


    this.errores.phoneField = !libphonenumber.isValidNumber(telefono)


    console.log("CARD")
    console.log(datos)

    if (!datos.cardNumber  ) {
      this.errores.card = true;
      this.beneficiarioData.cardBankImage = '';
      this.beneficiarioData.bankName = '';

    } else {
      const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco(datos.cardNumber, this.accessToken);

      if (tarjeta) {
        this.beneficiarioData.cardBankImage = tarjeta.cardBankImage;
        this.beneficiarioData.bankName = tarjeta.bankName;
        this.errores.card = !tarjeta.tarjetaValida;
      } else {
        this.errores.card = true;
        this.beneficiarioData.cardBankImage = '';
        this.beneficiarioData.bankName = '';
      }


    }



    let hayErrores = false;


    for (let clave in this.errores) {
      if (this.errores[clave] == true) {
        console.log("Error en validacion")
        console.log(clave)

        hayErrores = true;

      }

    }
    console.log("NO hay Error en validacion")

    return !hayErrores;

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
    
    
        if (!datos.contactPhone || datos.contactPhone === '' || !this.phonInputSelect.isValidNumber()) {
          Swal.fire({
            icon: 'error', title: 'Error',
            text: 'Incorrect phone number'
          })
          return false;
        }
    
    
        return true;*/

  }


  onChangeSelectedTX = async (datos) => {
    console.log(datos)
    this.datosSelectedTX.txID = datos._id;
    this.datosSelectedTX.allData = { ...datos }
    this.inputSendRef.el.value = datos.transactionAmount.toFixed(2);
    if (datos.metadata.deliveryCurrency) {
      this.inputReceiveCurrencyRef.el.value = datos.metadata.deliveryCurrency.toLowerCase();
    }
    

    
    this.inputSendCurrencyRef.el.value = datos.currency.toLowerCase();
    this.concept.el.value = datos.concept;
    const CIBeneficiariodeTX = this.datosSelectedTX.allData.metadata.deliveryCI;
    this.setearBeneficiario(CIBeneficiariodeTX)
    await this.onChangeSendInput()
  }

  onChangeSelectedCard = async (event) => {
    console.log(event.target.value)
    if (event.target.value == -1 || event.target.value === '') {
      return;
    }

    this.beneficiarioData.selectedCard = event.target.value
    const formatedCardNumber = UImanager.formatCardNumber(event.target.value);
    const cardData = this.cardsList.cards.filter((unaCard) =>
      UImanager.formatCardNumber(unaCard.number) === formatedCardNumber
    )[0];

    console.log("change selected card")

    if (cardData) {
      console.log("Hay card data");
      console.log(cardData);
      this.beneficiarioData.cardNumber = formatedCardNumber;
      this.beneficiarioData.cardHolderName = cardData.cardHolderName;


      this.inputCardNumber.el.value = this.beneficiarioData.cardNumber;
      this.inputcardHolderName.el.value = this.beneficiarioData.cardHolderName;

      //await this.validarTarjetayObtenerLogoBanco(this.beneficiarioData.selectedCard);
      const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco(this.beneficiarioData.selectedCard, this.accessToken);
      console.log("Banco de tarjeta")
      console.log(tarjeta)
      console.log(this.beneficiarioData.selectedCard)
      if (tarjeta) {


        this.beneficiarioData.cardBankImage = tarjeta.cardBankImage;
        this.beneficiarioData.bankName = tarjeta.bankName;
        this.errores.card = !tarjeta.tarjetaValida;

        console.log("Imagen")
        console.log(this.beneficiarioData.cardBankImage)
      } else {
        this.errores.card = true;
      }

    } else {
      console.log("NO Hay card data");
      this.beneficiarioData.cardHolderName = '';
      this.beneficiarioData.cardNumber = '';
      this.inputcardHolderName.el.value = '';
      this.inputCardNumber.el.value = '';
    }

    this.errores.cardHolderName = UImanager.validarSiVacio(this.beneficiarioData.cardHolderName)

    this.render()

  }





  setearBeneficiario = async (CIBeneficiario) => {
    const beneficiarioName = this.beneficiariosNames.names.filter((unBeneficiario) => unBeneficiario.CI === CIBeneficiario)[0];
    if (!beneficiarioName) { return }
    this.beneficiarioData.selectedBeneficiaryId = beneficiarioName._id;
    this.setearDatosBeneficiario(beneficiarioName._id)
  }


  onChangeSelectedBeneficiario = async (event) => {
    const selectedBeneficiaryId = event.target.value;
    this.beneficiarioData.selectedBeneficiaryId = selectedBeneficiaryId;

    if (selectedBeneficiaryId != -1) {
      this.setearDatosBeneficiario(selectedBeneficiaryId);
    } else {
      this.cardsList.cards = []


      this.beneficiarioData.deliveryAreaID = "-1";  //Provincia
      this.beneficiarioData.deliveryArea = "";
      this.beneficiarioData.receiverCityID = -1;   //Municipio
      this.beneficiarioData.receiverCity = '';
    }




    this.beneficiarioData.selectedCard = '-1',
      this.beneficiarioData.cardBankImage = '',
      this.beneficiarioData.cardNumber = '',
      this.beneficiarioData.cardHolderName = ''

    this.render()

  }

  //TEST: seleccionar beneficiario X, comprobar que los datos del beneficiario X, se ponen en cada uno de los controles
  //IDEAL: Agregar los datos del beneficiario antes del test, eliminar datos beneficiario luego del test
  //REAL: no permite eliminar --> leer datos de un beneficiario, comprobar con los datos leidos desde la BD
  setearDatosBeneficiario = async (idBeneficiario) => {
    //Setear el select de tarjetas con la tarjeta de la operacion

    const beneficiarioSelected = this.allDatosBeneficiariosFromStorage.filter((unBeneficiario) => unBeneficiario._id === idBeneficiario)[0];

    this.cardsList.cards = beneficiarioSelected.creditCards;

    this.beneficiarioData.contactPhone = beneficiarioSelected.deliveryPhone;
    this.inputContactPhone.el.value = this.beneficiarioData.contactPhone;

    this.beneficiarioData.deliveryAddress = beneficiarioSelected.houseNumber + ', ' + beneficiarioSelected.streetName + '. ZipCode: ' + beneficiarioSelected.zipcode;
    this.inputdeliveryAddress.el.value = this.beneficiarioData.deliveryAddress

    this.errores.deliveryAddress = UImanager.validarSiVacio(this.beneficiarioData.deliveryAddress);

    //Inicializando provincia
    const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === beneficiarioSelected.deliveryArea)[0];

    if (selectedProvince) {
      this.beneficiarioData.deliveryAreaID = selectedProvince.id;
      this.beneficiarioData.deliveryArea = selectedProvince.nombre;
    } else {
      this.beneficiarioData.deliveryAreaID = "-1";
      this.beneficiarioData.deliveryArea = "";
      this.beneficiarioData.receiverCityID = -1;
      this.beneficiarioData.receiverCity = '';
      return;
    }



    //inicializando municipio
    //this.municipios = selectedProvince.municipios;
    this.municipios.names = UImanager.addKeyToMunicipios(selectedProvince.municipios);

    // console.log("Beneficiario municipio:")
    // console.log(selectedBenefiarioData.deliveryCity)
    // console.log(selectedBenefiarioData)

    const selectedMuncipio = this.municipios.names.filter((unMunicipio) => {
      const comparacion = UImanager.eliminarAcentos(beneficiarioSelected.deliveryCity) == UImanager.eliminarAcentos(unMunicipio.nombre);
      return comparacion
    })[0];



    if (selectedMuncipio) {
      this.beneficiarioData.receiverCityID = selectedMuncipio.id;
      this.beneficiarioData.receiverCity = selectedMuncipio.nombre;
      this.beneficiarioData.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
    } else {
      this.beneficiarioData.receiverCityID = -1;
      this.beneficiarioData.receiverCity = '';
    }

    if (!this.datosSelectedTX.allData) {
      this.beneficiarioData.cardHolderName = '';
      return

    }
    this.beneficiarioData.cardHolderName = this.datosSelectedTX.allData.metadata.cardHolderName;
    if (this.datosSelectedTX.allData.metadata.cardNumber) {
      this.beneficiarioData.selectedCard = this.datosSelectedTX.allData.metadata.cardNumber.replace(/ /g, "")
    }
    
    console.log("Operacion")

    console.log(this.datosSelectedTX.allData);


    const formatedCardNumber = UImanager.formatCardNumber(this.beneficiarioData.selectedCard);
    this.beneficiarioData.cardNumber = formatedCardNumber;

    //await this.validarTarjetayObtenerLogoBanco(this.beneficiarioData.selectedCard);
    const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco(this.beneficiarioData.cardNumber, this.accessToken);
    console.log("Setear datos de benficiario")
    console.log(tarjeta)
    if (tarjeta) {
      this.beneficiarioData.cardBankImage = tarjeta.cardBankImage;
      this.beneficiarioData.bankName = tarjeta.bankName;
      this.errores.card = !tarjeta.tarjetaValida;
    } else {
      this.errores.card = true;
    }

    this.render()



  }



  //Al teclear el card en el input
  onCardInputKeyDown = (event) => {

    const key = event.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
      this.backspace = true;
    } else {
      this.backspace = false
    }

    /*
    if (event.target.value.length === 19) {
      this.beneficiarioData.selectedCard = event.target.value.replace(/ /g, "");
      await this.validarTarjetayObtenerLogoBanco(this.beneficiarioData.selectedCard);
    }*/


  }


  async onChangeCardInput(event) {

    if (!event.target.value) {
      this.errores.card = false;
    }

    /*
      this.beneficiarioData.cardNumber = UImanager.formatCardNumber(event.target.value);
    */

    console.log("change card input")


    if (!this.backspace) {
      this.inputCardNumber.el.value = UImanager.formatCardNumber(event.target.value);

      console.log(`beneficiarioData.cardNumber ${this.beneficiarioData.cardNumber}`)
    }

    console.log(`input.cardNumber ${this.inputCardNumber.el.value}`)

    this.beneficiarioData.cardNumber = this.inputCardNumber.el.value;


    this.beneficiarioData.cardBankImage = '';
    this.beneficiarioData.bankName = '';

    if (event.target.value.length === 19) {
      const tarjeta = await UImanager.validarTarjetayObtenerLogoBanco(this.beneficiarioData.cardNumber, this.accessToken);
      if (tarjeta) {
        console.log("onChangeCardInput")
        this.beneficiarioData.cardBankImage = tarjeta.cardBankImage;
        this.beneficiarioData.bankName = tarjeta.bankName;
        this.errores.card = !tarjeta.tarjetaValida;
      } else {
        this.errores.card = true;
      }
    }

    this.render()




  };


  onChangeCardHolderInput = API.debounce(async (event) => {
    this.beneficiarioData.cardHolderName = event.target.value;
    this.errores.cardHolderName = UImanager.validarSiVacio(event.target.value);

    //this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);


  onBlurCardHolderInput = (event) => {
    this.errores.cardHolderName = UImanager.validarSiVacio(event.target.value);
  }

  onChangeAddressInput = API.debounce(async (event) => {
    this.beneficiarioData.deliveryAddress = event.target.value;
    this.errores.deliveryAddress = UImanager.validarSiVacio(this.beneficiarioData.deliveryAddress);


    //this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangePhoneInput = API.debounce(async (event) => {


    const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
    // console.log(cod_pais)
    const telefono = cod_pais + event.target.value;

    this.beneficiarioData.contactPhone = event.target.value;



    this.errores.phoneField = !libphonenumber.isValidNumber(telefono)
    console.log(this.beneficiarioData.contactPhone)

    //this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);




  //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  onChangeProvince = (event) => {
    //this.cambioBeneficiario = true;
    console.log("Cambio de provincia")
    //console.log(this.inicializando)

   // if (this.inicializando) return;

    
    const selectedProvinceId = event.target.value;
    this.beneficiarioData.deliveryAreaID = event.target.value;
    let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
    console.log("Selected province")
    console.log(selectedProvince)
    if (selectedProvince) {
      this.municipios.names = UImanager.addKeyToMunicipios(selectedProvince.municipios);
      console.log(this.municipios)

      this.beneficiarioData.deliveryArea = selectedProvince.nombre;
      this.beneficiarioData.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
      //this.props.onChangeDatosBeneficiarios(this.state);
    } else {

    }

    this.beneficiarioData.receiverCityID = -1; //Municipio id 
    this.beneficiarioData.receiverCity = '';    //Municipio
    this.errores.city = false;
  };

  //Evento al cambiar de municipio
  onChangeCity = (event) => {
    // this.cambioBeneficiario = true;
    //if (this.inicializando) return;
    const selectedCityId = event.target.value;
    let selectedMunicipio = this.municipios.names[selectedCityId];
    console.log(selectedMunicipio)
    if (selectedMunicipio) {
      this.beneficiarioData.receiverCity = selectedMunicipio.nombre;
      this.beneficiarioData.receiverCityID = selectedCityId;
      this.errores.city = false;
      // this.props.onChangeDatosBeneficiarios(this.state);
    } else {
      this.errores.city = true;
    }
  };





}

