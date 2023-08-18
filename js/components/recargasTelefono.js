const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart, markup } = owl;
import { API, UImanager } from "../utils.js";
import { Paises } from "../../data/paises.js";
import { ListaTR } from "./listatr.js";


//TODO: refactorizar en un componente la parte de las monedas y el importe

export class RecargasTelefono extends Component {

    //static components = { Beneficiarios };

    //TODO: poner imagen de espera con una ventana

    promo_template=useState({
        title:'',
        description:'',
        content:''
    });

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
        promoTitle:'',
        promoContent:'',
        promoDescrip:''


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


    static components = { ListaTR };





    static template = xml`    
    <div class="sm:grid sm:grid-cols-[34%_64%] gap-2 ">
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
            <div class="card-title flex flex-col rounded-lg">
            
            </div>

            <div class="card-body items-center ">

            <div class="form-control w-full   ">
                <label class="label">
                    <span class="label-text">Currency to pay for recharge</span>
                </label>
                <select t-att-value="this.state.currency" class="select select-bordered join-item" t-on-input="onChangeCurrencySend"  >                    
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>            
                </select>
            </div>    

            <div class="form-control w-full sm:row-start-4 ">
            <label class="label">
             <span class="label-text">Phone to recharge</span>
            </label>
            <input t-att-value="this.state.phone"  id="phone" name="phone" type="tel" class="selectphone input input-bordered w-full" t-on-input="onChangePhone" />
            <!-- <span id="valid-phone-msg" class="hide">✓ Valid</span>
            <span id="error-phone-msg" class="hide"></span> -->
          </div> 
                                
          <!--  <div class="form-control w-full   ">  
                <label class="label">
                    <span class="label-text">Country to send recharge </span>
                </label>     
                <select   class="select select-bordered w-full"  name="people" id="people">            
                    <t t-foreach="this.seleccionPaises" t-as="unPais" t-key="unPais.id">
                        <option t-att-value="unPais.id" data-class="avatar" t-att-data-style="unPais.flag" >
                                <span class="countryname"><t t-esc="unPais.name"/> </span>                            
                        </option>
                    </t>             
                </select>
            </div>    
            --> 

           
            <div class="form-control w-full   ">  
                <label class="label">
                    <span class="label-text">Recharge type </span>
                </label>  
                <select  class="select select-bordered w-full" t-on-input="onChangeProduct" >  
                    <option  t-att-value="-1" >Select Product</option>          
                    <t t-foreach="this.state.listaProductos" t-as="unProducto" t-key="unProducto.id">
                        <option t-att-value="unProducto.id"   >
                                
                                      <t t-esc="unProducto.name"/> - <t t-esc="unProducto.label"/>
                                         
                                
                        </option>
                    </t>             
                </select>
            </div>   

        

<!--
                <div class="form-control w-full   ">
                <label class="label">
                  <span class="label-text">Phone to recharge</span>
                </label>
                <input type="text" t-att-value="this.state.phone"  maxlength="300" placeholder="" class="input input-bordered w-full " t-on-input="onChangePhone" />   
              </div>

              -->

              <div class="form-control w-full   ">
              <label class="label">
                <span class="label-text">Phone owner full name</span>
              </label>
              <input type="text" t-att-value="this.state.phoneOwnerName"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhoneOwnerName" />   
            </div>

              
            <div class="card-actions">
            <button class="btn btn-primary" t-on-click="onSendRecharge">Send Recharge</button>
          </div>
                
            </div>
        </div>

        <div class="card  w-full bg-base-100 shadow-xl rounded-lg ">
            <!-- <div class="card-title flex flex-col rounded-lg">
                
            </div> -->
            <div class="card-body items-center ">
                    <div>
                        <div t-if="this.state.operator">
                            <div class="text-[1rem] font-[500]">
                            Recharge Data  
                            </div>

                            <div class="ml-3">
                                Operator: <t t-esc="this.state.operator"/>
                            </div>
                            <div class="ml-3">
                            Description:  <t t-esc="this.state.productoDesc"/>
                            </div>                        
                            <div class="ml-3">
                                Cost:
                                <t t-esc="this.state.salePrice"/>
                                <span class="mr-2"></span>
                                <t t-esc="this.state.currency"/>
                                <span class="mr-2"></span>
                                <div>
                                <t t-esc="this.state.label"/>
                                </div>
                            </div>
                        </div>
                        <div  t-if="this.promo_template.title">
                          <div class="text-[1rem] font-[500] mt-2 ">
                             Promotions
                          </div>   
                          <div class="ml-3">
                          
                      
                          <!-- <t t-esc="this.state.promoTitle"/> -->
                          <!-- <t t-esc="this.promo_template.html_str"/> -->
                          <!-- JSON.stringify(this.state.stringData);-->
                          <!-- t-att-                        srcdoc -->
                          <!-- <div>title</div> -->
                          <t t-out="this.promo_template.title"/>

                          <!--
                          <div>description</div>
                          <t t-out="this.promo_template.description"/>

                          <div>content</div>
                          <t t-out="this.promo_template.content"/>
                          -->

        
                          </div>
                        </div>


                    </div>
               
            </div>
        </div>

    
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2  sm:col-span-2">
            <div class="card-body items-center  ">
            
            <ListaTR tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
            </div>
        </div>

    </div>

    

    
      


  `;


    setup() {
        const accessToken = window.localStorage.getItem('accessToken');
        const walletAddress = window.localStorage.getItem('walletAddress');
        const userId = window.localStorage.getItem('userId');



        onWillStart(async () => {
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


    onChangeProduct(event) {
        this.state.producto = event.target.value;
        this.promo_template.title='';
        if (this.listaProductos) {
            const producto = this.listaProductos.filter((unProducto) => unProducto.id == this.state.producto)[0]

            if (producto) {

            this.state.productoDesc = producto.description
            this.state.salePrice = producto.salePrice.amount;
            this.state.operator = producto.operator;
            this.state.label = producto.label;
            console.log("Productos")
            console.log(producto)
             if (producto.promotions[0]) {
                console.log("Promociones")
                console.log(producto.promotions[0])
                //this.state.promoTitle = producto.promotions[0].title
                this.promo_template.title = markup(producto.promotions[0].title);
               // this.promo_template.description = markup(producto.promotions[0].description);
               // this.promo_template.content = markup(producto.promotions[0].content);
                
                //this.render()
             }
            }
        }

        // console.log(this.state.producto)
        // console.log(this.listaProductos)

        // console.log("Costo")
        // console.log(producto.salePrice.amount)
        // console.log(producto.salePrice.currency)


    }

    onChangePhone = API.debounce(async (event) => {

        this.state.phone = event.target.value
        console.log(this.state)

        if (!this.listaProductos) {
            console.log("pidiendo por primera ves los productos")
            await this.onChangePais(this.phonInputSelect.getSelectedCountryData().dialCode)
        }

    }, 700);


    handleCountryChange = () => {
        console.log(this.phonInputSelect.getSelectedCountryData().dialCode)
        console.log(this.phonInputSelect.getSelectedCountryData().iso2)
        console.log(this.phonInputSelect.getSelectedCountryData().name)
        console.log("AAA");

        this.state.operator='';

        this.onChangePais(this.phonInputSelect.getSelectedCountryData().dialCode)
    }


    //se ejecuta al cambiar el pais, para pedir la lista de productos  
    //prefijo  --- codigo telefonico del pais
    //coincide con id en lista de paises 
    onChangePais = async (prefijo) => {
        console.log("PAis " + prefijo);

        this.promo_template.title='';

        this.state.productoDesc = ""
        this.state.salePrice = 0


        const accessToken = window.localStorage.getItem('accessToken');
        const api = new API(accessToken);
        const paisDatos = this.paises.find(unPais => unPais.prefijo == prefijo);

        console.log(paisDatos)



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

                console.log(this.state.currency);
                console.log(paisDatos.number)
                try {
                    
                    const operadores = await api.getProductosRecargaTelefon(paisDatos.number, this.state.currency);
                    console.log("---- Operador ----- ")
                    console.log(operadores);
                    this.listaProductos = operadores.data.operators[0].products;
                    this.state.listaProductos = this.listaProductos;
                    swal.close();
                } catch (error) {
                    console.log(error)
                    this.state.listaProductos=[];
                    this.listaProductos=[];
                    
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


    onChangeCurrencySend(event) {
        this.state.currency = event.target.value
        console.log("Prefio Pais")
        console.log(this.phonInputSelect.getSelectedCountryData().dialCode)
        this.onChangePais(this.phonInputSelect.getSelectedCountryData().dialCode)
    }


    async onSendRecharge() {
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

            const accessToken = window.localStorage.getItem('accessToken');
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





    /*onChangePhone(event) {
        this.state.phone = event.target.value
    }*/

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

}


