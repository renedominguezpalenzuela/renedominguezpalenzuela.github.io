const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart, markup } = owl;
import { API, UImanager } from "../utils.js";
import { Paises } from "../../data/paises.js";
import { ListaTR } from "./listatr.js";


//TODO: refactorizar en un componente la parte de las monedas y el importe

export class PaymentLinks extends Component {

    //static components = { Beneficiarios };

    //TODO: poner imagen de espera con una ventana



    amount = useRef("amount");
    currency = useRef("currency");
    productName = useRef("productName");
    description = useRef("description");

    // state = useState({
    //     pais: 53,                   //codigo telefonico del pais
    //     currency: "USD",
    //     producto: -1,
    //     listaProductos: [],
    //     productoDesc: "",
    //     salePrice: 0,
    //     operator: '',
    //     label: '',
    //     phone: '',
    //     phoneOwnerName: '',
    //     promoTitle: '',
    //     promoContent: '',
    //     promoDescrip: ''


    // })

    errores = useState({
        amount: false,
        productName: false,
        description: false
    })


    // datosSelectedTX = useState({
    //     txID: "",
    //     allData: null
    // })



    //
    /*
    tipo_operacion = {
        //name: "CASH_OUT_TRANSACTION"
        name: "DIRECT_TOPUP"
    }*/

    tipo_operacion = [8];
    tipoVista = 'PAYMENT_LINK';


    static components = { ListaTR };





    static template = xml`    
    <div class="sm:tw-grid sm:tw-grid-cols-[45%_45%] tw-gap-y-0 tw-gap-x-2">
      <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">
          
          <div class="tw-card-body tw-items-center  ">
              <div class="tw-form-control  tw-w-full ">
                  <label class="tw-label">
                    <span class="tw-label-text">Amount</span>  
                  </label> 

                  <div class="tw-join">
                    
                      

                      <input type="text" t-ref="amount" t-on-blur="onChangeAmount" t-on-input="onChangeAmount" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"   class="tw-input tw-w-full tw-input-bordered tw-join-item tw-text-right" placeholder="0.00"/>


                      

                      <select class="tw-select tw-select-bordered tw-join-item"  t-ref="currency" >                    
                          <option value="usd" selected="selected">USD</option>
                          <option value="eur">EUR</option>
                          <option value="cad">CAD</option>

                      </select>

                  </div>

                  
                <span t-if="this.errores.amount==true" class="error">
                   Error in field!!!
                </span>  
             
                
           
             
              </div>
              <div class="tw-card-actions">
             
                    
              </div>
             
          </div>
      </div>

      <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg">


      
        <div class="tw-card-body tw-items-center  ">

        <div class="tw-form-control  tw-w-full  ">
            <label class="tw-label">
                <span class="tw-label-text">Product Name</span>
            </label>
            <input type="text"  t-ref="productName" t-on-input="onProductName" t-on-blur="onProductName"   maxlength="300"  class="tw-input tw-input-bordered tw-w-full " />   
            <span t-if="this.errores.productName==true" class="error">
                Required field!!!
            </span>
        </div>

        <div class="tw-form-control    tw-w-full ">
                <label class="tw-label">
                    <span class="tw-label-text">Description</span>
                </label>
                
                <textarea t-ref="description" class="tw-textarea tw-textarea-bordered" placeholder=""  ></textarea>
                <span t-if="this.errores.description==true" class="error">
                    Required field!!!
                </span> 
            </div>
        </div>
      </div>

      <button class=" btn-primary tw-mt-2  tw-w-[30%] " t-on-click="crearPaymentLink">Create </button>  

    



    


    
  
        
    
      <div class="  tw-w-full tw-col-span-2">
          <ListaTR class="tw-w-full" tipoVista="this.tipoVista" tipooperacion="this.tipo_operacion" onChangeSelectedTX.bind="this.onChangeSelectedTX" />
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






        });

        onRendered(() => {


        });

        onMounted(() => {

        })

    }










    async onChangeCurrencySend(event) {

        const moneda = event.target.value


    }




    async crearPaymentLink() {
        console.log("Creando Payment Link")



        //TODO: Validaciones
        const datosTX = {

            product: {
                name: this.productName.el.value,
                description: this.description.el.value
            },

            amount: this.amount.el.value,
            currency: this.currency.el.value.toUpperCase(),


            paymentLink: true,
            merchant_external_id: API.generateRandomID(),
            //redirectUrl: 'https://ducapp.net'

        }

        console.log(datosTX);


        // if (!this.validarDatos(datosTX)) {
        //     console.log("Validation Errors");
        //     return;
        // }


        try {

            const accessToken = API.getTokenFromsessionStorage();
            const api = new API(accessToken);

            let resultado = null;

          

            Swal.fire({
                title: 'Please Wait..!',
                html: 'Creating Payment Link operation...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                //showCancelButton: true,
                showCloseButton: true,
                didOpen: async () => {

                    function onCopyLink  ()  {
                        console.log('COPY')
                        navigator.clipboard.writeText($('#paymentLink').text());
                        $("#urlcopied").show();
                        console.log("DDD");
        
                        
                    }


                  

                    swal.showLoading()
                    resultado = await api.crearPaymentLink(datosTX);
                    console.log("Payment link results")
                    console.log(resultado);
                    Swal.hideLoading();



                    if (resultado.data.status == 200) {
                        const id = resultado.data.payload.id;
                        const link = resultado.data.payload.link;
                        const qrCode = resultado.data.payload.qrCode;

                        $("#swal2-title").text('Payment Link, created.');
                        $("#swal2-html-container").html(`
                        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-16">
                            <div>
                                <span> ID: </span> <span> ${id} </span>
                            </div>

                            <span style="margin-top: 1rem;"> Payment link url: </span>
                            <div class="tw-flex tw-items-center  ">

                                <span id="paymentLink"> ${link} </span>
                               
                                <span class="tw-ml-4"> 
                                    <img src="img/copy_icon.png" style="width: 2rem;" onclick="$('#urlcopied').show(); navigator.clipboard.writeText($('#paymentLink').text()); console.log('ddd');"/>
                                </span>

                               


                               
                            

                            </div>
                            <div id="urlcopied" style="font-size: 0.9rem; display: none;">
                            Payment link copied to clipboard 

                         </div>
                            <div>

                                 <img src="${qrCode}" style="width: 20rem;"/>
                            </div>
                        </div>
                      
                   `);

                    }







                    // const urlHome = this.props.urlHome ? this.props.urlHome : null;

                    // UImanager.gestionResultadosPaymentLink(resultado, urlHome, this.props.menuController);

                }
            })



        } catch (error) {
            console.log(error);
            // Swal.fire(resultado.response.data.message);
        }
    }

    onChangeAmount() {

    }

    onProductName() {

    }




    // async onCreateButton() {

    //     Swal.fire({
    //         title: 'do you really want to create Payment Link',
    //         icon: 'warning',
    //         html: `
    //         <div> To: ${this.state.phoneOwnerName}</div>
    //         <div>



    //                             Operator: ${this.state.operator}
    //                         </div>
    //                         <div class="tw-ml-3">
    //                         Description:  ${this.state.productoDesc}
    //                         </div>                        
    //                         <div class="tw-ml-3">
    //                             Cost:
    //                             ${this.state.salePrice}
    //                             <span class="tw-mr-2"></span>
    //                             ${this.state.currency}
    //                             <span class="tw-mr-2"></span>
    //                             <div>
    //                             ${this.state.label}
    //                             </div>
    //                         </div>




    //         `,
    //         showCloseButton: true,
    //         showCancelButton: true,
    //         focusConfirm: true,
    //         reverseButtons: false,

    //         cancelButtonText: `No`,
    //         confirmButtonText: `Yes`
    //     }).then((result) => {
    //         if (result.value) {

    //             this.crearPaymentLink()
    //         }
    //     });






    // }







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
        console.log(datos)

        
        this.productName.el.value = datos.metadata.requestParams.product.name;
        this.description.el.value = datos.metadata.requestParams.product.description; 
        this.amount.el.value = UImanager.roundDec(datos.metadata.requestParams.price.amount);
        this.currency.el.value= datos.metadata.requestParams.price.currency.toLowerCase();


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


