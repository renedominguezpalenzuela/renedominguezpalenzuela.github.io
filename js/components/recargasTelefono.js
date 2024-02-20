const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart, markup } = owl;
import { API, UImanager } from "../utils.js";
import { Paises } from "../../data/paises.js";
import { ListaTR } from "./listatr.js";


//TODO: refactorizar en un componente la parte de las monedas y el importe

export class RecargasTelefono extends Component {

    //static components = { Beneficiarios };

    //TODO: poner imagen de espera con una ventana

    promo_template = useState({
        title: '',
        description: '',
        content: ''
    });


    selectedCountryCuba = true;
    pedirProductos = true;

    selectProduct = useRef("selectProduct");

    state = useState({
        pais: 53,                   //codigo telefonico del pais
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
        promoDescrip: ''


    })

    errores = useState({
        phoneField: false
    })


    datosSelectedTX = useState({
        txID: "",
        allData: null
    })



    //
    /*
    tipo_operacion = {
        //name: "CASH_OUT_TRANSACTION"
        name: "DIRECT_TOPUP"
    }*/

    tipo_operacion = [6, 7];
    tipoVista = 'PHONE_RECHARGE';


    static components = { ListaTR };





    static template = xml`    
    <div class="sm:tw-grid sm:tw-grid-cols-[34%_66%] tw-gap-2 ">
        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
            <div class="tw-card-title tw-flex tw-flex-col tw-rounded-lg">
            
            </div>

            <div class="tw-card-body tw-items-center ">

            <div class="tw-form-control tw-w-full   ">
                <label class="tw-label">
                    <span class="tw-label-text">Currency to pay for recharge</span>
                </label>
                <select t-att-value="this.state.currency" class="tw-select tw-select-bordered tw-join-item" t-on-input="onChangeCurrencySend"  >                    
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>            
                </select>
            </div>    

            <div class="tw-form-control tw-w-full sm:tw-row-start-4 ">
            <label class="tw-label">
             <span class="tw-label-text">Phone to recharge</span>
            </label>
            <input   t-att-value="this.state.phone"  id="phone" name="phone" type="phone" class="selectphone tw-input tw-input-bordered tw-w-full" t-on-input="onChangePhone" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"/>

            <span t-if="this.errores.phoneField==true" class="error">
              Invalid number!!!
            </span>
            <!-- <span id="valid-phone-msg" class="tw-hide">✓ Valid</span> -->
            
          </div> 
                                
         

           
            <div class="tw-form-control tw-w-full   ">  
                <label class="tw-label">
                    <span class="tw-label-text">Recharge type </span>
                </label>  
                <select t-ref="selectProduct"  class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeProduct" >  
                    <option  t-att-value="-1" >Select Product</option>          
                    <t t-foreach="this.state.listaProductos" t-as="unProducto" t-key="unProducto.id">
                        <option t-att-value="unProducto.id"   >
                                
                                      <t t-esc="unProducto.name"/> - <t t-esc="unProducto.label"/>
                                         
                                
                        </option>
                    </t>             
                </select>
            </div>   

        



              <div class="tw-form-control tw-w-full   ">
              <label class="tw-label">
                <span class="tw-label-text">Phone owner full name</span>
              </label>
              <input type="text" t-att-value="this.state.phoneOwnerName"  maxlength="300" placeholder="" class="tw-input tw-input-bordered tw-w-full "  t-on-input="onChangePhoneOwnerName" />   
            </div>

              
           
            <button class=" btn-primary tw-w-[60%]" t-on-click="onSendRecharge">Send Recharge</button>
        
                
            </div>
        </div>

        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg ">

            <div class="tw-card-body tw-items-center ">
                    <div class="tw-form-control tw-w-full">
                        <div t-if="this.state.operator">
                            <div class="tw-text-[1rem] tw-font-[500]">
                            Recharge Data  
                            </div>

                            <div class="tw-ml-3">
                                Operator: <t t-esc="this.state.operator"/>
                            </div>
                            <div class="tw-ml-3">
                            Description:  <t t-esc="this.state.productoDesc"/>
                            </div>                        
                            <div class="tw-ml-3">
                                Cost:
                                <t t-esc="this.state.salePrice"/>
                                <span class="tw-mr-2"></span>
                                <t t-esc="this.state.currency"/>
                                <span class="tw-mr-2"></span>
                                <div>
                                <t t-esc="this.state.label"/>
                                </div>
                            </div>
                        </div>

                        </div>


                        <div class="tw-form-control tw-w-full ">
                        <div  t-if="this.promo_template.title">
                          <div class="tw-text-[1rem] tw-font-[500] tw-mt-2 ">
                             Promotions
                          </div>   
                          <div class="tw-ml-3 promotion-overflow" >
                          
                      
                       
                          <t t-out="this.promo_template.title"/>

                         

        
                          </div>
                        </div>


                    </div>
               
            </div>
        </div>

    
        <!-- <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2  sm:tw-col-span-2">
            <div class="tw-card-body tw-items-center  ">
            
            <ListaTR tipoVista="this.tipoVista" tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
            </div>
        </div> -->

        <div class="  tw-w-full sm:tw-col-span-2  ">
           <ListaTR tipoVista="this.tipoVista" tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
        </div>

    </div>

    

    
      


  `;


    static props = ["urlHome"];

    static defaultProps = {
        urlHome: '/',
    };

    accessToken = '';
    setup() {
        this.accessToken = API.getTokenFromsessionStorage();

        API.setRedirectionURL(this.props.urlHome);

        //if (!accessToken) { return }


       


        //  this.select_product.el.value=-1;



        onWillStart(async () => {
            if (!this.accessToken) {
                console.error("NO ACCESS TOKEN - Recargas")
                window.location.assign(API.redirectURLLogin);
                return;
            }
    
            const walletAddress = window.sessionStorage.getItem('walletAddress');
            const userId = window.sessionStorage.getItem('userId');

            this.seleccionCodigosPaises = [];
            this.paises = Paises.filter(unPais => unPais.show).map((unPais, i) => {

                this.seleccionCodigosPaises.push(unPais.isoAlpha2)
                return {
                    id: unPais.id,
                    name: unPais.name,
                    // flag: "background-image: url('data:image/png;base64," + unPais.flag + "');",
                    currency: unPais.currency.code,
                    number: unPais.number,
                    show: unPais.show,
                    iso2: unPais.isoAlpha2,
                    prefijo: unPais.prefijo
                }
            }

            );





        });

        onRendered(() => {


        });

        onMounted(() => {
            this.phoneInput = document.querySelector("#phone");
            this.phonInputSelect = window.intlTelInput(this.phoneInput, {
                separateDialCode: true,   //el codigo del pais solo esta en el select de las banderas
                autoInsertDialCode: true, //coloca el codigo del pais en el input
                formatOnDisplay: false,  //si se teclea el codigo del pais, se selecciona la bandera ej 53 -- cuba
                // autoPlaceholder: "polite",
                // don't insert international dial codes
                nationalMode: false, //permite poner 5465731 en ves de +53 54657331
                initialCountry: "cu",
                //excludeCountries: ["in", "il"],
                preferredCountries: ["cu"],
                // display only these countries
                onlyCountries: this.seleccionCodigosPaises,
                utilsScript: "js/libs/intlTelIutils.js"
            });
            this.phoneInput.addEventListener('countrychange', this.handleCountryChange);
        })

    }

    handleCountryChange = (event) => {

        const cod_pais = this.phonInputSelect.getSelectedCountryData().dialCode;

        //selectedContryCuba = true;
        //productosCubaPedidos = false;


        if (cod_pais == 53) {

            if (!this.selectedCountryCuba) {
                this.pedirProductos = true;
            }

            this.selectedCountryCuba = true;
        } else {
            this.selectedCountryCuba = false;
            this.pedirProductos = true;
        }

        console.log(`Selected Cuba ${this.selectedCountryCuba}`)
        console.log(`Pedir productos ${this.pedirProductos}`)

    }


    onChangePhone = API.debounce(async (event) => {

        // if  (event.charCode < 48 || event.charCode > 57){
        //     return false;
        //    }




        const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;
        // console.log(cod_pais)

        this.state.phone = event.target.value
        //console.log(this.state)

        const moneda = this.state.currency;
        const telefono = cod_pais + this.state.phone;
        //console.log(telefono)

        const isValidNumber = libphonenumber.isValidNumber(telefono)

        if (!isValidNumber) {
            this.errores.phoneField = true;

            return;
            //console.log(respuesta)
        } else {
            this.errores.phoneField = false;
        }

        await this.handlePhoneChange(telefono, moneda)


    }, 1100);

    //se ejecuta al cambiar el pais, para pedir la lista de productos  
    //prefijo  --- codigo telefonico del pais
    //coincide con id en lista de paises 
    handlePhoneChange = async (telefono, moneda) => {

        if (!this.pedirProductos) {
            console.log("No pedir productos")
            return;
        }

        console.log("Pidiendo productos")

        // console.log(libphonenumber.parsePhoneNumber('9098765432', 'IN'))

        this.promo_template.title = '';

        this.state.productoDesc = ""
        this.state.salePrice = 0
        this.state.operator = null;
        this.state.producto = -1;
        this.selectProduct.el.value = -1;

        const accessToken = API.getTokenFromsessionStorage();
        const api = new API(accessToken);

        Swal.fire({
            title: 'Please Wait..!',
            text: 'Retrieving product list...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            //showCancelButton: true,
            showCloseButton: true,
            didOpen: async () => {
                swal.showLoading()

                //console.log(this.state.currency);
                //console.log(paisDatos.number)
                try {

                    const respuesta = await api.getProductosRecargaTelefon(telefono, moneda);
                    //console.log(respuesta)

                    let cod_respuesta = 0;

                    if (respuesta.status) {
                        cod_respuesta = respuesta.status;
                    } else if (respuesta.response && respuesta.response.status) {
                        cod_respuesta = respuesta.response.status;
                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Unspected error, see browser logs for details'
                        })
                        console.log(respuesta)

                    }
                    //console.log(respuesta.response.status)


                    if (cod_respuesta == 200) {

                        if (this.selectedCountryCuba && this.pedirProductos) {
                            this.pedirProductos = false;
                        }
                        //console.log(respuesta)
                        //console.log("---- Respuesta OK ----- ")
                        this.listaProductos = respuesta.data.data.operators[0].products;
                        this.state.listaProductos = this.listaProductos;
                        //console.log(this.listaProductos);
                        swal.close();
                    } else if (cod_respuesta == 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: respuesta.response.data.message
                        })
                        //console.log(respuesta)
                    }

                } catch (error) {
                    console.log(error)
                    this.state.listaProductos = [];
                    this.listaProductos = [];

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error
                    })

                }


            }
        })




        //const exchangeRate = await api.getProductosRecargaTelefon("usd");

    }

    //Evento disparado al selecionar un producto
    onChangeProduct(event) {
        this.state.producto = event.target.value;
        this.promo_template.title = '';





        if (this.listaProductos) {
            const producto = this.listaProductos.filter((unProducto) => unProducto.id == this.state.producto)[0]

            if (producto) {

                this.state.productoDesc = producto.description
                this.state.salePrice = producto.salePrice.amount;
                this.state.operator = producto.operator;
                this.state.label = producto.label;
                //console.log("Productos")
                //console.log(producto)
                if (producto.promotions && producto.promotions.zize > 0 && producto.promotions[0]) {
                    // console.log("Promociones")
                    // console.log(producto.promotions[0])
                    //this.state.promoTitle = producto.promotions[0].title

                    if (producto.promotions[0].content) {
                        this.promo_template.title = markup(producto.promotions[0].content);
                    } else if (producto.promotions[0].description) {
                        this.promo_template.title = markup(producto.promotions[0].description);
                    } else if (producto.promotions[0].title) {
                        this.promo_template.title = markup(producto.promotions[0].title);

                    }
                    //this.promo_template.title = markup(producto.promotions[0].title);
                    // this.promo_template.description = markup(producto.promotions[0].description);
                    // this.promo_template.content = markup(producto.promotions[0].content);

                    //this.render()
                }
            }
        }

        // this.promo_template.title = '';

        // this.state.productoDesc = ""
        // this.state.salePrice = 0
        // this.state.operator = null;


        // console.log(this.state.producto)
        // console.log(this.listaProductos)

        // console.log("Costo")
        // console.log(producto.salePrice.amount)
        // console.log(producto.salePrice.currency)


    }






    async onChangeCurrencySend(event) {

        const moneda = event.target.value
        if (this.state.currency != moneda) {
            this.pedirProductos = true;
        }
        this.state.currency = moneda;
        const cod_pais = '+' + this.phonInputSelect.getSelectedCountryData().dialCode;

        const telefono = cod_pais + this.state.phone;
        console.log(telefono)


        const isValidNumber = libphonenumber.isValidNumber(telefono)


        if (isValidNumber) {

            // if (!this.listaProductos) {
            //   console.log("pidiendo por primera ves los productos")
            await this.handlePhoneChange(telefono, moneda)
        }

    }




    async ejecutarRecarga() {
        console.log("Ejecutando recarga")
        console.log(this.state);


        //TODO: Validaciones
        const datosTX = {

            productId: this.state.producto,
            receiverName: this.state.phoneOwnerName,
            destinations: [this.state.phone],
            currency: this.state.currency,
            isScheduled: false,
            scheduledDate: null,
            paymentLink: true,
            merchant_external_id: API.generateRandomID()

        }

        console.log(datosTX);

        if (!this.validarDatos(datosTX)) {
            console.log("Validation Errors");
            return;
        }


        try {

            const accessToken = API.getTokenFromsessionStorage();
            const api = new API(accessToken);

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
                    resultado = await api.sendPhoneRecharge(datosTX);

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


    async onSendRecharge() {

        //this.state.productoDesc = producto.description
        //        this.state.salePrice = producto.salePrice.amount;

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

                this.ejecutarRecarga()
            }
        });






    }




    onChangePhoneOwnerName(event) {
        this.state.phoneOwnerName = event.target.value
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
        this.datosSelectedTX.txID = datos._id;
        this.datosSelectedTX.allData = { ...datos }
        console.log(datos)
        /*this.inputSendRef.el.value = datos.transactionAmount.toFixed(2);
        this.inputReceiveCurrencyRef.el.value = datos.metadata.deliveryCurrency.toLowerCase();
        this.inputSendCurrencyRef.el.value = datos.currency.toLowerCase();
        this.concept.el.value = datos.concept;
    
        const CIBeneficiariodeTX = this.datosSelectedTX.allData.metadata.deliveryCI;
    
        this.setearBeneficiario(CIBeneficiariodeTX)
    
        await this.onChangeSendInput()*/

    }


    /*
        onPhoneKeyPress = (event)=> {
            console.log(event.charCode)
            if(event.charCode >= 48 && event.charCode <= 57){
                return true;
               }
               return false;
        }*/


}


