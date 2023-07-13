const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;
import { API, UImanager } from "../utils.js";
import { Paises } from "../../data/paises.js";


//TODO: refactorizar en un componente la parte de las monedas y el importe

export class RecargasTelefono extends Component {

    //static components = { Beneficiarios };

    //TODO: poner imagen de espera con una ventana

    state = useState({
        pais: 53,
        currency: "USD",
        producto: -1,
        listaProductos: [],
        productoDesc: "",
        salePrice: 0,
        operator: '',
        label: '',
        phone: '',
        phoneOwnerName: ''


    })







    static template = xml`    
    <div class="sm:grid sm:grid-cols-[34%_64%] gap-2 h-[100vh]">
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
                                
            <div class="form-control w-full   ">  
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


                <div class="form-control w-full   ">
                <label class="label">
                  <span class="label-text">Phone to recharge</span>
                </label>
                <input type="text" t-att-value="this.state.phone"  maxlength="300" placeholder="" class="input input-bordered w-full " t-on-input="onChangePhone" />   
              </div>

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
            <div class="card-title flex flex-col rounded-lg">
                Recharge Data
               
                
            </div>
            <div class="card-body items-center ">
            <div>

            <div>
            Operator:                   
             <t t-esc="this.state.operator"/>
            </div>
           <div>
           Description:                   
                <t t-esc="this.state.productoDesc"/>
           </div>
           <div>                   
                
           </div>
           <div>
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
               
            </div>
        </div>
    </div>

    
      


  `;


    setup() {
        const accessToken = window.sessionStorage.getItem('accessToken');
        const walletAddress = window.sessionStorage.getItem('walletAddress');
        const userId = window.sessionStorage.getItem('userId');



        onWillStart(async () => {

            this.paises = Paises.map((unPais, i) => ({
                id: unPais.id,
                name: unPais.name,
                flag: "background-image: url('data:image/png;base64," + unPais.flag + "');",
                currency: unPais.currency.code,
                number: unPais.number,
                show: unPais.show
            }));

            //solo mostrar los que tienen show = true
            this.seleccionPaises = this.paises.filter(unPais => ((unPais.show)));


            console.log(this.seleccionPaises);




        });

        onRendered(() => {


        });

        onMounted(() => {


            $.widget("custom.iconselectmenu", $.ui.selectmenu, {
                _renderItem: function (ul, item) {

                    console.log("SSSSSSS")


                    var li = $("<li>"), wrapper = $("<div>", { text: item.label });

                    if (item.disabled) {
                        li.addClass("ui-state-disabled");
                    }

                    $("<span>", {
                        style: item.element.attr("data-style"),
                        "class": "ui-icon " + item.element.attr("data-class")
                    }).appendTo(wrapper);

                    return li.append(wrapper).appendTo(ul);
                }
            });

            //Creando Select Menu de Easy UI 
            //Creando Evento cuando se cambia de pais
            $("#people").iconselectmenu({
                change: (event, ui) => {
                    const idPais = ui.item.value;
                    this.onChangePais(idPais);

                }
            }
            ).iconselectmenu("menuWidget").addClass("ui-menu-icons");





            //Inicializando
            this.onChangePais(this.state.pais)

        })


    }


    onChangeProduct(event) {
        this.state.producto = event.target.value;
        console.log(this.state.producto)
        console.log(this.listaProductos)





        const producto = this.listaProductos.filter((unProducto) => unProducto.id == this.state.producto)[0]

        this.state.productoDesc = producto.description

        console.log("Costo")
        console.log(producto.salePrice.amount)
        console.log(producto.salePrice.currency)

        this.state.salePrice = producto.salePrice.amount;
        this.state.operator = producto.operator;
        this.state.label = producto.label;





    }

    onChangePais = async (idPAis) => {
        console.log("PAis" + idPAis);
        this.state.pais = idPAis;
        this.state.productoDesc = ""
        this.state.salePrice = 0

        //Poniendo el nombre del pais en el control EasyUI
        const nombre_pais = this.seleccionPaises.filter((unPais) => unPais.id == idPAis)[0].name
        console.log(nombre_pais)
        $('.ui-selectmenu-text').html(nombre_pais)


        const accessToken = window.sessionStorage.getItem('accessToken');
        const api = new API(accessToken);



        const paisDatos = this.paises.find(unPais => unPais.id == idPAis);





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
                console.log("SSS")
                console.log(this.state.currency);
                const operadores = await api.getProductosRecargaTelefon(paisDatos.number, this.state.currency);
                console.log(operadores);
                this.listaProductos = operadores.data.operators[0].products;
                this.state.listaProductos = this.listaProductos;
                swal.close();
            }
        })












        //const exchangeRate = await api.getProductosRecargaTelefon("usd");

    }


    onChangeCurrencySend(event) {
        this.state.currency = event.target.value
        console.log("Pais")
        console.log(this.state.pais)
        this.onChangePais(this.state.pais)
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

            const accessToken = window.sessionStorage.getItem('accessToken');
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

                    if (resultado.code) {
                        if (resultado.code==="ERR_BAD_REQUEST") {
                          
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: resultado.response.data.message
                            })

                            
                        }
                        console.log(resultado.code)
                    }

                   //TODO OK
                    if (resultado.data) {
                        if (resultado.data.status === 200) {
                            Swal.fire(resultado.data.payload);
                        }
                    }

                
                    //Error pero aun responde el API
                    if (resultado.error) {
                        Swal.fire(resultado.message);
                    }


                console.log(resultado)
                //swal.close();
            }
        })


         
        } catch (error) {
            console.log(error);
            // Swal.fire(resultado.response.data.message);
        }



    }


    onChangePhone(event) {
        this.state.phone = event.target.value
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

}

