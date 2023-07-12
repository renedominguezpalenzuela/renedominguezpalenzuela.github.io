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
        productoDesc: ""
    })







    static template = xml`    
    <div class="sm:grid sm:grid-cols-[34%_64%] gap-2 h-[100vh]">
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
            <div class="card-title flex flex-col rounded-lg">
            
            </div>

            <div class="card-body items-center ">

                <select t-att-value="this.state.currency" class="select select-bordered join-item" t-on-input="onChangeCurrencySend"  >                    
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>            
                </select>
                                
                    
                <select   t-att-value="this.state.pais" class="select select-bordered w-full"  name="people" id="people">            
                    <t t-foreach="this.seleccionPaises" t-as="unPais" t-key="unPais.id">
                        <option t-att-value="unPais.id" data-class="avatar" t-att-data-style="unPais.flag" >
                                <span class="countryname"><t t-esc="unPais.name"/> </span>
                            
                        </option>
                    </t>             
                </select>

           

                <select  class="select select-bordered w-full" t-on-input="onChangeProduct" >            
                    <t t-foreach="this.state.listaProductos" t-as="unProducto" t-key="unProducto.id">
                        <option t-att-value="unProducto.id"   >
                                <span><t t-esc="unProducto.name"/> </span>     
                        </option>
                    </t>             
                </select>

                <div>
                   <t t-esc="this.state.productoDesc"/>
                </div>

                
            </div>
        </div>

        <div class="card  w-full bg-base-100 shadow-xl rounded-lg ">
            <div class="card-title flex flex-col rounded-lg">
                Other Data
               
                
            </div>
            <div class="card-body items-center ">
               
               
            </div>
        </div>
    </div>

    
      


  `;


    setup() {
        const accessToken = window.sessionStorage.getItem('accessToken');
        const walletAddress = window.sessionStorage.getItem('walletAddress');
        const userId = window.sessionStorage.getItem('userId');



        onWillStart(async () => {
            const api = new API(accessToken);
            //const exchangeRate = await api.getExchangeRate("usd");

            this.paises = Paises.map((unPais, i) => ({
                id: unPais.id,
                name: unPais.name,
                flag: "background-image: url('data:image/png;base64," + unPais.flag + "');",
                currency: unPais.currency.code,
                number: unPais.number,
                show: unPais.show
            }));

            this.seleccionPaises = this.paises.filter(unPais => (
                (unPais.show)
            )
            );


            this.cuba = this.paises.filter(unPais => (
                (unPais.id == 53)
            )
            )[0];



            console.log(this.seleccionPaises);
            //console.log(this.paises)




        });

        onRendered(() => {


        });

        onMounted(() => {
            var availableTags = [
                "ActionScript",
                "AppleScript",
                "Asp",
                "BASIC",
                "C",
                "C++",
                "Clojure",
                "COBOL",
                "ColdFusion",
                "Erlang",
                "Fortran",
                "Groovy",
                "Haskell",
                "Java",
                "JavaScript",
                "Lisp",
                "Perl",
                "PHP",
                "Python",
                "Ruby",
                "Scala",
                "Scheme"
            ];

            $("#tags").autocomplete({
                source: availableTags
            });

            $.widget("custom.iconselectmenu", $.ui.selectmenu, {
                _renderItem: function (ul, item) {


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


            //$("#people").iconselectmenu().iconselectmenu("menuWidget").addClass("ui-menu-icons avatar");

            $("#people").iconselectmenu({
                change: (event, ui) => {
                    //alert("Hi"); 
                    //console.log(event)
                    const idPais = ui.item.value;
                    this.onChangePais(idPais);



                }
            }
            ).iconselectmenu("menuWidget").addClass("ui-menu-icons");
            //$("#people").iconselectmenu('setValue',53);


            // $('#people').val(this.state.pais);

            const nombre_pais = this.seleccionPaises.filter((unPais) => unPais.id == this.state.pais)[0].name
            console.log(nombre_pais)

            $('.ui-selectmenu-text').html(nombre_pais)


            this.onChangePais(this.state.pais)

        })


    }


    onChangeProduct(event) {
        this.state.producto = event.target.value;
        console.log(this.state.producto)
        console.log(this.listaProductos)





        const productoDesc = this.listaProductos.filter((unProducto) => unProducto.id == this.state.producto)[0]
        console.log("DESCR")
        this.state.productoDesc = productoDesc.description
        console.log(productoDesc);




    }

    onChangePais = async (idPAis) => {
        console.log("PAis" + idPAis);
        const accessToken = window.sessionStorage.getItem('accessToken');
        const api = new API(accessToken);



        const paisDatos = this.paises.find(unPais => unPais.id == idPAis);



       

        Swal.fire({
            title: 'Please Wait..!',
            text: 'Retrieving product list...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen :async () => {
                swal.showLoading()
                console.log("SSS")
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
    }



    async onRecargar() {
        return;
        //cardCUP	cardUSD
        const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

        //TODO: Validaciones
        const datosTX = {
            //   service: service,
            //   amount: this.inputSendRef.el.value,                                           //Cantidad a enviar, incluyendo el fee
            //   currency: this.inputSendCurrencyRef.el.value.toUpperCase(),                   //moneda del envio
            //   deliveryAmount: this.inputReceiveRef.el.value,                                //Cantidad que recibe el beneficiario
            //   deliveryCurrency: this.inputReceiveCurrencyRef.el.value.toUpperCase(),        //moneda que se recibe      
            //   concept: this.concept.el.value,                                               //Concepto del envio
            //   merchant_external_id: API.generateRandomID(),
            //   paymentLink: true,
            //   ...this.beneficiario
        }


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
                text: 'Please enter the full name of receiver First name and Last name at least'
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

}

