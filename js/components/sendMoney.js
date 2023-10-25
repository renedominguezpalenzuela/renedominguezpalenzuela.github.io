const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart, markup } = owl;
import { API, UImanager } from "../utils.js";
import { Paises } from "../../data/paises.js";
import { ListaTR } from "./listatr.js";
import { SendMoneyFieldsName } from "../../data/sendmoneyfields.js";




export class SendMoney extends Component {

    showSpinner = useState({
        paises: true,
        servicios: false,
        payers: false
    })

    errores = useState({
        paises: false,
        servicios: false,
        payers: false,
        sendAmount: false
    })





    // selectProduct = useRef("selectProduct");

    /*pais: 53,                   //codigo telefonico del pais
     currency: "USD",
     producto: -1,
     listaProductos: [],
     productoDesc: "",
     salePrice: 0,
     operator: '',
     label: '',
     phone: '',
     phoneOwnerName: '',
     promoTitle: '',
     promoContent: '',
     promoDescrip: '',*/

    state = useState({
        cod_servicio: null,
        cod_pais_iso3: null,
        listaServicios: [],
        listaPayers: [],
        listaMonedasARecibir: []
    })

    extraFieldLists = useState({
        credit_party_identifiers_accepted: [],
        required_documents: [],
        required_receiving_entity_fields: [],
        required_sending_entity_fields: []
    })

    extraFieldLists = useState({
        fields: []
    })





    datosSelectedTX = useState({
        txID: "",
        allData: null
    })





    tipo_operacion = [1, 2];


    static components = { ListaTR };


    inputSendRef = useRef("inputSendRef");
    //inputReceiveRef = useRef("inputReceiveRef");
    //concept = useRef("concept");
    inputSendCurrencyRef = useRef("inputSendCurrencyRef");
    //inputReceiveCurrencyRef = useRef("inputReceiveCurrencyRef");

    conversionRate = useState({ value: 0 });


    feeSTR = useState({ value: "0" });
    fee = useState({ value: 0 });


    monedas = useState({
        enviada: "",
        recibida: ""
    })


    totalSendCost = useState({ value: 0 });
    totalSendCostSTR = useState({ value: "0" });





    static template = xml`    
    <div class="sm:tw-grid sm:tw-grid-cols-2 tw-gap-2 ">
            <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg sm:tw-col-1">

                    
                <div class="tw-card-body tw-items-center "> 

                        <div class="tw-form-control  tw-w-full ">
                            <label class="tw-label">
                                <span class="tw-label-text">You Send (before fee)</span>  
                            </label> 

                            <div class="tw-join">                        
                         
                                <input type="text" t-ref="inputSendRef"  t-on-input="onChangeSendInput" t-on-blur="onBlurSendInput"  onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"   class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00"/>
                                        
                                
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
                    </div>
                
                   <div class="tw-form-control tw-w-full ">
                        <label class="tw-label">
                            <span class="tw-label-text">Received Amount</span>  
                        </label> 

                        <div class="tw-join">        
                                                    
                            <input type="text" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput"   t-on-blur="onBlurReceiveInput"  onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"  
                            class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00"/>    
                        
                            
                            <select class="tw-select tw-select-bordered tw-join-item" t-ref="inputReceiveCurrencyRef" t-on-input="onChangeCurrencyRecib" >     
                                    <t t-if="(this.state.listaMonedasARecibir) and (this.state.listaMonedasARecibir.length>0)">   
                                <t t-foreach="this.state.listaMonedasARecibir" t-as="unaMoneda" t-key="unaMoneda">
                                    <option t-att-value="unaMoneda"   >                                      
                                        <t t-esc="unaMoneda"/>                                                                                        
                                    </option>
                                </t>             
                                </t>
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
                    <button class="tw-btn tw-btn-primary" t-on-click="onSend">Send</button>
                </div>
                    
                    


                </div>
        </div>

        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg sm:tw-col-2">
            <div class="tw-card-body tw-items-center ">
                
                <!-- **************************************************** -->
                <!-- ***************  Countrys ***************** -->
                <!-- **************************************************** -->
                <div class="tw-form-control tw-w-full  ">
                    <label class="tw-label">                            
                        <span class="tw-label-text">
                        Country to send
                        </span>
                        <span t-if="this.showSpinner.paises==true">
                        <img src="img/Spinner-1s-200px.png" width="35rem"/>
                        </span>
                    </label>
                    
                    <input type="text"  maxlength="100" placeholder="Country" id="country" class="tw-input tw-input-bordered tw-w-full"   />   
                <span t-if="this.errores.paises==true" class="error">
                        Country is required!!!
                    </span>                       
                </div>       
                
                <!-- **************************************************** -->
                <!-- *************** Services *************************** -->
                <!-- **************************************************** -->
                <div class="tw-form-control tw-w-full   ">  
                    <label class="tw-label">
                        <span class="tw-label-text">Services </span>
                        <span t-if="this.showSpinner.servicios==true">
                        <img src="img/Spinner-1s-200px.png" width="35rem"/>
                    </span>
                    </label>  
                    <select  class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeService" >  
                        <option  t-att-value="-1" >Select Service</option>  
                            
                        <t t-if="(this.state.listaServicios) and (this.state.listaServicios.length>0)">   
                            <t t-foreach="this.state.listaServicios" t-as="unServicio" t-key="unServicio.id">
                                <option t-att-value="unServicio.id"   >                                      
                                    <t t-esc="unServicio.name"/>                                                                                        
                                </option>
                            </t>             
                        </t>
                    </select>
                    <span t-if="this.errores.servicios==true" class="error">
                        Service is required!!!
                    </span> 
                </div>  

                <!-- **************************************************** -->
                <!-- *************** Payers   *************************** -->
                <!-- **************************************************** -->
                <div class="tw-form-control tw-w-full   ">  
                    <label class="tw-label">
                        <span class="tw-label-text">Payers </span>
                        <span t-if="this.showSpinner.payers==true">
                        <img src="img/Spinner-1s-200px.png" width="35rem"/>
                    </span>
                    </label>  
                    <select  class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangePayer" >  
                        <option  t-att-value="-1" >Select Payers</option>  
                            
                        <t t-if="(this.state.listaPayers) and (this.state.listaPayers.length>0)">   
                            <t t-foreach="this.state.listaPayers" t-as="unPayer" t-key="unPayer.id">
                                <option t-att-value="unPayer.id"   >                                      
                                    <t t-esc="unPayer.name"/>                                                                                        
                                </option>
                            </t>             
                        </t>
                    </select>
                    <span t-if="this.errores.payers==true" class="error">
                        Payer is required!!!
                    </span> 
                </div>  


        

                
              

            </div>
        </div>


        <t t-if="((this.extraFieldLists.credit_party_identifiers_accepted) and (this.extraFieldLists.credit_party_identifiers_accepted.length>0)) or ((this.extraFieldLists.required_documents) and (this.extraFieldLists.required_documents>0))">
            <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2  sm:tw-col-span-2">
                
            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
                    <div> General Data </div>      
                </div>    
        
                <div class="tw-card-body tw-items-center  " id="general_data">      
                    <t t-foreach="this.extraFieldLists.credit_party_identifiers_accepted" t-as="unField" t-key="unField.name">   
                        <div class="tw-form-control tw-w-full  tw-pl-1">
                            <label class="tw-label">
                                <span class="tw-label-text"><t t-esc="unField.label"/> </span>
                            </label>
                            <input type="text" t-model="unField.value" t-att-placeholder="unField.label" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeExtraFields" />   
                            <!--  <span t-if="this.errores.unField.name==true" class="error">
                                    Required field!!!
                                </span>  -->
                        </div>                             
                    </t>     
                    
                    <t t-foreach="this.extraFieldLists.required_documents" t-as="unField" t-key="unField.name">   
                    <div class="tw-form-control tw-w-full  tw-pl-1">
                        <label class="tw-label">
                            <span class="tw-label-text"><t t-esc="unField.label"/> </span>
                        </label>
                        <input type="text" t-model="unField.value" t-att-placeholder="unField.label" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangeExtraFields"  />   
                        <!-- <span t-if="this.errores.unField.name==true" class="error">
                                    Required field!!!
                        </span>  -->
                    </div>                             
                </t>       

                
                </div>
            </div>
        </t>

        <t t-if="(this.extraFieldLists.required_receiving_entity_fields) and (this.extraFieldLists.required_receiving_entity_fields.length>0)">
            <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2  sm:tw-col-span-2">
                    
                <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
                    <div> Receiver Data </div>      
                </div>    
        
                <div class="tw-card-body tw-items-center  " id="reciver_data">   
                    <t t-foreach="this.extraFieldLists.required_receiving_entity_fields" t-as="unField" t-key="unField.name">   
                        <div class="tw-form-control tw-w-full  tw-pl-1">
                            <label class="tw-label">
                                <span class="tw-label-text"><t t-esc="unField.label"/> </span>
                            </label>
                            <input type="text" t-model="unField.value" t-att-placeholder="unField.label" class="tw-input tw-input-bordered tw-w-full "   t-on-input="onChangeExtraFields" />   
                            <!-- <span t-if="this.errores.unField.name==true" class="error">
                            Required field!!!
                            </span>  -->
                        </div>                             
                    </t>                 
                </div>
            </div>
        </t>

        <t t-if="(this.extraFieldLists.required_sending_entity_fields) and (this.extraFieldLists.required_sending_entity_fields.length>0)">
            <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2  sm:tw-col-span-2">
                    
            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
                <div> Sender Data </div>      
            </div>    

            <div class="tw-card-body tw-items-center"  id="sender_data" >            
                        <t t-foreach="this.extraFieldLists.required_sending_entity_fields" t-as="unField" t-key="unField.name">   
                            <div class="tw-form-control tw-w-full  tw-pl-1">
                                <label class="tw-label">
                                    <span class="tw-label-text"><t t-esc="unField.label"/> </span>
                                </label>
                                <input type="text" t-model="unField.value" t-att-placeholder="unField.label" class="tw-input tw-input-bordered tw-w-full "   t-on-input="onChangeExtraFields" />   
                                <!-- <span t-if="this.errores.unField.name==true" class="error">
                                    Required field!!!
                                </span>  -->
                            </div>                             
                        </t>            
            </div>
            </div>
        </t>

        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2  sm:tw-col-span-2">
            <div class="tw-card-body tw-items-center  ">            
                <ListaTR tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
            </div>
        </div>

    </div>

   

    

  `;


  onChangeExtraFields = API.debounce(async (event) => {

    console.log(event.target.id)
    console.log("ONCHange")
    ///this.errores.providerValue = this.validarSiVacio(event.target.value);
  }, 700);

    static props = ["urlHome"];
    static defaultProps = {
        urlHome: '/',
    };



    //Cuando selecciona el pais, debe setearse la moneda destino
    //inhabilitar todos los controls
    //Al inicio debe estar deshabilitada la entrada de la cantidad enviada / recibida

    setup() {
        this.accessToken = API.getTokenFromsessionStorage();

        API.setRedirectionURL(this.props.urlHome);




        if (!this.accessToken) {
            console.error("NO ACCESS TOKEN - Recargas")
            window.location.assign(API.redirectURLLogin);
            return;
        }


        this.api = new API(this.accessToken);


        onWillStart(async () => {





        });

        onRendered(() => {


        });

        onMounted(async () => {
            //--------------------------------------------------------------------------------------
            // 1. Get Countries {{baseURL}}/api/private/transactions/cash-out/countries
            //--------------------------------------------------------------------------------------
            const listaPaisesFromAPI = await this.api.getListaPaises();
            //console.log(listaPaisesFromAPI)
            this.seleccionCodigosPaises = [];
            this.state.listaMonedasARecibir = [];
            if (listaPaisesFromAPI) {
                this.seleccionCodigosPaises = await API.transformarISO2toISO3(listaPaisesFromAPI, Paises);


            } else {
                this.seleccionCodigosPaises = [];
            }
            // console.log(this.seleccionCodigosPaises)

            this.showSpinner.paises = false;


            $("#country").countrySelect({
                //defaultCountry: "jp",
                onlyCountries: this.seleccionCodigosPaises,//
                preferredCountries: ['fr', 'gb'], //en miusculas si es en mayusculas da error
                responsiveDropdown: true
            });

            this.monedas.recibida = this.getMonedaPaisFromList();
            this.state.listaMonedasARecibir.push(this.monedas.recibida)





            $('#country').on('change', async () => {
                const cod_iso3 = this.getCodigoPaisFromList();
                this.state.cod_pais_iso3 = cod_iso3
                this.state.listaMonedasARecibir = [];
                this.monedas.recibida = this.getMonedaPaisFromList();
                this.state.listaMonedasARecibir.push(this.monedas.recibida)
                this.state.listaPayers = [];
                this.extraFieldLists.required_receiving_entity_fields = [];
                this.extraFieldLists.required_sending_entity_fields = [];
                this.extraFieldLists.credit_party_identifiers_accepted = [];
                this.extraFieldLists.required_documents = [];

                await this.getListaServicios(cod_iso3);
            });




            //------------------------------------------------------------------------------ 
            //------------- 2. Pedir lista de servicios -------------------------------------
            //------------------------------------------------------------------------------

            const cod_iso3 = this.getCodigoPaisFromList();
            await this.getListaServicios(cod_iso3)

            //------------------------------------------------------------------------------ 
            //------------- 3. Pedir PAyers -------------------------------------
            //------------------------------------------------------------------------------
            //const service_id = this.state.cod_servicio
            //await this.getListaPayers(service_id, cod_iso3) 



        })

    }


    getCodigoPaisFromList() {

        const pais_seleccionado = $("#country").countrySelect("getSelectedCountryData");//.dialCode;
        const cod_iso2 = pais_seleccionado.iso2.toUpperCase();
        const pais_datos = Paises.filter((unPais) => unPais.isoAlpha2 === cod_iso2)[0];
        //console.log(pais_datos)
        const cod_iso3 = pais_datos.isoAlpha3;



        return cod_iso3;



    }


    getMonedaPaisFromList() {
        const pais_seleccionado = $("#country").countrySelect("getSelectedCountryData");//.dialCode;
        const cod_iso2 = pais_seleccionado.iso2.toUpperCase();
        const pais_datos = Paises.filter((unPais) => unPais.isoAlpha2 === cod_iso2)[0];



        return pais_datos.currency.code;
    }

    //------------------------------------------------------------------------------ 
    //------------- 3. Pedir PAyers -------------------------------------
    //------------------------------------------------------------------------------
    //   Get Payers {{baseURL}}/api/private/transactions/cash-out/payers
    // Datos: iso, servicio
    async onChangeService(event) {
        this.state.listaPayers = [];

        this.extraFieldLists.required_receiving_entity_fields = [];
        this.extraFieldLists.required_sending_entity_fields = [];
        this.extraFieldLists.credit_party_identifiers_accepted = [];
        this.extraFieldLists.required_documents = [];

       
        const service_id = event.target.value;
        if (service_id != -1) {
            const cod_iso3 = this.getCodigoPaisFromList();

            console.log(service_id)
            console.log(cod_iso3)
            await this.getListaPayers(service_id, cod_iso3)

        }

    }

    async onChangePayer(event) {


   

        this.extraFieldLists.required_receiving_entity_fields = [];
        this.extraFieldLists.required_sending_entity_fields = [];
        this.extraFieldLists.credit_party_identifiers_accepted = [];
        this.extraFieldLists.required_documents = [];

        console.log("Change Payer")
        console.log(event.target.value)
        const id_payer = event.target.value;

        const payer_seleccionado = this.state.listaPayers.filter(unPayer => unPayer.id == id_payer)[0];
        console.log(payer_seleccionado)

        this.crearExtraFields(payer_seleccionado);


    }


    /*
     "service_id": 2,
    "country_iso_code": "IND",
    "per_page": 100
    */
    async getListaPayers(service_id, country_iso_code) {
        this.state.listaPayers = [];
        this.extraFieldLists.required_receiving_entity_fields = [];
        this.extraFieldLists.required_sending_entity_fields = [];
        this.extraFieldLists.credit_party_identifiers_accepted = [];
        this.extraFieldLists.required_documents = [];



        this.showSpinner.payers = true;


        this.state.listaPayers = await this.api.getListaPayers(service_id, country_iso_code)
        console.log(this.state.listaPayers)



        this.showSpinner.payers = false;


    }

    getFieldLabel(field_name) {
        const nombre = SendMoneyFieldsName.filter((unField) => unField.name === field_name)[0];
        if (nombre) {
            return nombre.label
        } else {
            return field_name
        }
    }

    crearExtraFields(payerSeleccionado) {


        let tipo_transaccion = '';

        if (payerSeleccionado.transaction_types.B2B) {
            console.log("B2B")
            tipo_transaccion = 'B2B';
        } else if (payerSeleccionado.transaction_types.C2C) {
            console.log("C2C")
            tipo_transaccion = 'C2C';
        }

        //console.log("PAYER SELECCIONADO")


        //console.log(payerSeleccionado.transaction_types[tipo_transaccion].required_receiving_entity_fields)


        this.extraFieldLists.required_receiving_entity_fields = payerSeleccionado.transaction_types[tipo_transaccion].required_receiving_entity_fields.map(
            (unField) => {
                return {
                    name: unField,
                    label: this.getFieldLabel(unField),
                    value: ''
                }
            }
        );

        this.extraFieldLists.required_sending_entity_fields = payerSeleccionado.transaction_types[tipo_transaccion].required_sending_entity_fields.map(
            (unField) => {
                return {
                    name: unField,
                    label: this.getFieldLabel(unField),
                    value: ''
                }
            }
        );


        


        this.extraFieldLists.credit_party_identifiers_accepted = payerSeleccionado.transaction_types[tipo_transaccion].credit_party_identifiers_accepted.map(
            (unField) => {
                return {
                    name: unField,
                    label: this.getFieldLabel(unField),
                    value: ''
                }
            }
        );

        this.extraFieldLists.required_documents = payerSeleccionado.transaction_types[tipo_transaccion].required_documents.map(
            (unField) => {
                return {
                    name: unField,
                    label: this.getFieldLabel(unField),
                    value: ''
                }
            }
        );

        



        

        console.log(this.extraFieldLists)

        //this.render()



    }



    //--------------------------------------------------------------------------------------
    // 2. Get Services {{baseURL}}/api/private/transactions/cash-out/services
    //--------------------------------------------------------------------------------------
    async getListaServicios(cod_iso3) {

        this.state.listaServicios = []
        this.extraFieldLists.required_receiving_entity_fields = [];
        this.extraFieldLists.required_sending_entity_fields = [];
        this.extraFieldLists.credit_party_identifiers_accepted = [];
        this.extraFieldLists.required_documents = [];

        this.showSpinner.servicios = true;

        if (cod_iso3) {
            this.state.cod_pais_iso3 = cod_iso3;
            this.state.listaServicios = await this.api.getListaServicios(cod_iso3);
            if (this.state.listaServicios && this.state.listaServicios.length > 0) {
                this.state.cod_servicio = this.state.listaServicios[0].id
            }

        }
        this.showSpinner.servicios = false;

    }







    async ejecutarEnvio() {
        console.log("Ejecutando recarga")
        console.log(this.state);


        //TODO: Validaciones
        const datosTX = {

            /* productId: this.state.producto,
             receiverName: this.state.phoneOwnerName,
             destinations: [this.state.phone],
             currency: this.state.currency,
             isScheduled: false,
             scheduledDate: null,*/
            paymentLink: true,
            merchant_external_id: API.generateRandomID()

        }

        console.log(datosTX);

        if (!this.validarDatos(datosTX)) {
            console.log("Validation Errors");
            return;
        }


        try {



            let resultado = null;

            Swal.fire({
                title: 'Please Wait..!',
                text: 'Creating recharge operation...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                //showCancelButton: true,
                showCloseButton: true,
                didOpen: async () => {
                    swal.showLoading()
                    resultado = await this.api.sendPhoneRecharge(datosTX);

                    /*  if (resultado.code) {
                          if (resultado.code === "ERR_BAD_REQUEST") {
  
                              Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: resultado.response.data.message
                              })
  
  
                          }
                          console.log(resultado.code)
                      }*/




                    const urlHome = this.props.urlHome ? this.props.urlHome : null;

                    UImanager.gestionResultado(resultado, urlHome, this.props.menuController);
                    //swal.close();
                }
            })



        } catch (error) {
            console.log(error);
            // Swal.fire(resultado.response.data.message);
        }
    }



    async onSend() {
        console.log(this.extraFieldLists)

        return;


        Swal.fire({
            title: 'do you really want to send this recharge',
            icon: 'warning',
            html: `
            <div> To: ${this.state.phoneOwnerName}</div>
            <div>


            
                                Operator: ${this.state.operator}
                            </div>
                            <div class="tw-ml-3">
                            Description:  ${this.state.productoDesc}
                            </div>                        
                            <div class="tw-ml-3">
                                Cost:
                                ${this.state.salePrice}
                                <span class="tw-mr-2"></span>
                                ${this.state.currency}
                                <span class="tw-mr-2"></span>
                                <div>
                                ${this.state.label}
                                </div>
                            </div>
              
            
            
            
            `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            reverseButtons: false,

            cancelButtonText: `No`,
            confirmButtonText: `Yes`
        }).then((result) => {
            if (result.value) {

                this.ejecutarEnvio()
            }
        });






    }








    validarDatos(datos) {
        console.log(datos)
        //--------------------- Product ID --------------------------------------------
        if (!datos.productId || datos.productId == -1) {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please select the product'
            })
            return false;
        }

        //--------------------- Phone number --------------------------------------------
        //TODO: Validar que sea un numero correcto
        if (datos.destinations.length <= 0) {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please enter the phone number to recharge'
            })
            return false;
        }

        if (!datos.destinations[0] || datos.destinations[0] === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please enter the phone number to recharge'
            })
            return false;
        }

        //--------------------- Receiver Name --------------------------------------------
        if (!datos.receiverName || datos.receiverName === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: "Please enter receiver's name"
            })
            return false;
        }

        //--------------------- Currency --------------------------------------------
        if (!datos.currency || datos.currency === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please select currency'
            })
            return false;
        }




        return true;

    }

    onChangeSelectedTX = async (datos) => {
        //this.datosSelectedTX.txID = datos._id;
        //this.datosSelectedTX.allData = { ...datos }
        //console.log(datos)
        /*this.inputSendRef.el.value = datos.transactionAmount.toFixed(2);
        this.inputReceiveCurrencyRef.el.value = datos.metadata.deliveryCurrency.toLowerCase();
        this.inputSendCurrencyRef.el.value = datos.currency.toLowerCase();
        this.concept.el.value = datos.concept;
    
        const CIBeneficiariodeTX = this.datosSelectedTX.allData.metadata.deliveryCI;
    
        this.setearBeneficiario(CIBeneficiariodeTX)
    
    */

    }



    onChangeSendInput = API.debounce(async (event) => {

        /*const cantidadEnviada = this.inputSendRef.el.value;
        this.errores.sendAmount = UImanager.validarSiMenorQueCero(cantidadEnviada);
    
    
        const monedaEnviada = this.inputSendCurrencyRef.el.value;
        const monedaRecibida = this.inputReceiveCurrencyRef.el.value;
    
        this.monedas.enviada = monedaEnviada.toUpperCase()
        this.monedas.recibida = monedaRecibida.toUpperCase()
    
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
    
    */

    }, 700);


    onBlurSendInput = (event) => {
        this.errores.sendAmount = UImanager.validarSiMenorQueCero(event.target.value);
    }


    //Evento al cambiar la moneda a enviar
    onChangeCurrencySend() {
        this.onChangeSendInput()
    }

    //Evento al cambiar la moneda a recibir
    onChangeCurrencyRecib() {
        this.onChangeReceiveInput();
    }





}


