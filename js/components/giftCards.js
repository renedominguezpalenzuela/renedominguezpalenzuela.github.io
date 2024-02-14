const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";
import { ListaTR } from "./listatr.js";
import { Paises } from "../../data/paises.js";

//TODO: Cada X segundo pedir el balance
//TODO-DONE: validar parametro del usuario  el nuevo campo es isMerchant y el valor va a ser true or false


export class ListaGiftCards extends Component {


    static components = { ListaTR };

    datos = null;
    tabla = null;

    api = null;
    accessToken = null;
    walletAddress = null;
    userId = null;


    // senderName = '-';

    tableId = "#container-listgift-cards";


    total_tx_a_solicitar = 50;

    minDateFiltro = null;
    maxDateFiltro = null;
    selectedBeneficiaryName = ''

    spinner = useState({
        show: true,
        showSecond: false
    })

    tipo_operacion = [14, 15];
    tipoVista = 'GIFT_CARDS';









    static template = xml`  

   
  

        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg sm:tw-col-2 tw-mb-4">
            <div class="tw-card-body tw-flex tw-flex-row  ">
                
                <!-- **************************************************** -->
                <!-- ***************  Crear Gift Card   ***************** -->
                <!-- **************************************************** -->
                
                
               

               
              
             <!-- tw-w-[30%] -->
                <button class="submit-btn2 tw-ml-auto tw-p-4" t-on-click="onCreate">Create</button>

               
               
                <button class="submit-btn2  tw-ml-auto tw-p-4" t-on-click="onRefresh">
               
                    Refresh   
                    <img   t-if="this.spinner.showSecond==true" src="img/Spinner-1s-200px.png" width="35rem" class="tw-mb-2 colornew tw-ml-4"/>               

                
                </button>
               
              
             
               
                
               
                
             
              
                
                
               
                 
            </div>
        </div>
   

    <t t-if="this.datos==null">
    <div class="tw-items-center"> 
        <span  class="display nowrap responsive "    >
        Requesting data
        </span>

        <t t-if="this.spinner.show==true">
        <span>
          <img src="img/Spinner-1s-200px.png" width="35rem"/>
        </span>
        </t>
     </div>   
    </t> 

   
    <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2  sm:tw-col-span-2">
    <div class="tw-card-body tw-items-center  "> 
            
    <table  id="container-listgift-cards" class="display nowrap responsive " style="width:100%; visibility: hidden;" cellspacing="0"  >
    
        <thead class="tw-bg-[#0652ac] tw-text-[#FFFFFF] tw-text-[1.05rem] tw-mt-1">

            <tr>
                    <th></th>
                    <th data-priority="1" > Gift Card</th>    
                    <th  data-priority="1" class="centrar">Holder</th> 
                    <th  data-priority="1" class="centrar">Cvv2</th>
                    <th  class="centrar">Exp. Date <br/> (yy/mm) </th>    
                    <th  class="centrar">Is Exp?</th>
                    <th  class="centrar">USD</th>
                    <th  class="centrar">EUR</th>
                    <th  class="centrar">CAD</th>
                    <th  class="centrar">CUP</th>  
                   

            </tr>
        
        </thead>
   
    </table>
    </div>
    </div>


        
        <ListaTR tipoVista="this.tipoVista" tipooperacion="this.tipo_operacion"  />
   



   
  `;



    //TODO: Formatear la fecha
    //TODO: Formatear el importe

    static props = ["urlHome"];

    static defaultProps = {
        urlHome: '/',
    };



    consultarSaldoTarjetas = async () => {



        this.spinner.showSecond = true;

        //Actualizar table
        const raw_datos = await this.api.getGiftCardData();


        this.datos = [];
        this.datos = await this.transformarRawDatos(raw_datos);

        if (this.datos) {
            this.actualizarDatos(this.datos);
        }
        this.spinner.showSecond = false;




    }

    formatRetention = (label, dato) => {
        let cadena = '';


        if (dato) {
            cadena = `<div class="tw-ml-8"> ${label}:  ${dato} </div>`;
        }

        return cadena;
    }

    // Formatting function for row details - modify as you need
    formatTuplaOculta = (d) => {
        // `d` is the original data object for the row

        console.log("Tupla seleccionada")
        console.log(d)




        const numero = d.number;
        const id = d._id;




        let cadenaBotonDEBIT = '';
        let cadenaBotonExpire = '';

        if (this.isMerchant == true) {

            cadenaBotonDEBIT = `<button  class="tw-btn  tw-mr-3 debitfn btn-gift-cards" card-number="${numero}">Debit</button>`;
            cadenaBotonExpire = `<button  class="tw-btn  tw-mr-3 cancelfn btn-gift-cards" card-number="${numero}">Expire</button>`;
        } else {

        }







        return (
            '<dl>' +
            '<dt>Actions:</dt>' +

            '<dd>' +

            '<div class="tw-flex tw-flex-row">' +
            '<div> ' +
            '<div class="tw-flex">' +
            '<button  class="tw-btn   tw-mr-3 creditfn btn-gift-cards" card-number="' + numero + '">Credit </button>' +
            cadenaBotonDEBIT +
            cadenaBotonExpire +
            '</div>' +
            '<div class="tw-ml-8"> ID: ' + id + '</div>' +
            '</div>' +

            '<div class="tw-ml-12"> Positive Retentions' +
            this.formatRetention('USD', d.retencion_pos_usd) +
            this.formatRetention('EUR', d.retencion_pos_eur) +
            this.formatRetention('CAD', d.retencion_pos_cad) +
            this.formatRetention('CUP', d.retencion_pos_cup) +
            '</div>' +

            '<div class="tw-ml-12"> Negative Retentions' +
            this.formatRetention('USD', d.retencion_neg_usd) +
            this.formatRetention('EUR', d.retencion_neg_eur) +
            this.formatRetention('CAD', d.retencion_neg_cad) +
            this.formatRetention('CUP', d.retencion_neg_cup) +
            '</div>' +
            '</div>' +


            '</dd>' +





            '</dl>'
        );
    }


    rowDataGet = (e) => {
        console.log("DDDD")
        console.log(e)




    }


    setup() {


        this.accessToken = API.getTokenFromsessionStorage();

        API.setRedirectionURL(this.props.urlHome);

        this.isMerchant = false;


        if (window.sessionStorage.getItem('isMerchant')) {
            this.isMerchant = JSON.parse(window.sessionStorage.getItem('isMerchant'));
        }










        this.walletAddress = window.sessionStorage.getItem('walletAddress');






        onWillStart(async () => {

            if (!this.accessToken) {
                console.error("NO ACCESS TOKEN - Recargas")
                window.location.assign(API.redirectURLLogin);
                return;
            }


            this.api = new API(this.accessToken);
            this.inicioContadorTiempo = Date.now();

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
            });





        });



        onMounted(async () => {




            const raw_datos = await this.api.getGiftCardData();



            this.datos = [];


            this.datos = await this.transformarRawDatos(raw_datos);
            if (this.datos) {
                this.actualizarDatos(this.datos);
            }



            //obteniendo todos los datos de los beneficiarios desde el API
            if (this.accessToken) {

                const allDatosBeneficiarios = await this.api.getAllDatosBeneficiarios();

                if (allDatosBeneficiarios) {
                    window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
                }

                this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));

                if (this.allDatosBeneficiariosFromStorage) {
                    this.beneficiariosNames = this.allDatosBeneficiariosFromStorage.map(el => ({
                        beneficiaryFullName: el.beneficiaryFullName,
                        _id: el._id
                    }));
                }

            } else {
                console.error("NO ACCESS TOKEN - Beneficiario")
            }

            this.spinner.show = false;



            //https://phppot.com/jquery/responsive-datatables-with-automatic-column-hiding

            this.tableId = '#container-listgift-cards';



            this.tabla = $(this.tableId).DataTable({
                data: this.datos,

                columns: [
                    {
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '',
                        width: '5%'
                    },
                    { data: 'number', width: '25%' },
                    { data: 'holder', width: '25%' },
                    { data: 'cvv2', width: '8%' },
                    { data: 'expiry', width: '14%' },
                    { data: 'isExpired', width: '10%' },
                    {
                        data: 'usd', width: '10%',
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        }
                        , className: "amount-value"
                    },
                    {
                        data: 'eur', width: '10%',
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        }
                        , className: "amount-value"
                    },
                    {
                        data: 'cad', width: '10%',
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        }
                        , className: "amount-value"
                    },
                    {
                        data: 'cup', width: '10%',
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        },
                        className: "amount-value"
                    },
                    // {
                    //     data: null,
                    //     render: (data, type, row) => {

                    //         let numero_tarjeta = data.number;

                    //         return `<div class="btn-group sm:tw-hidden">

                    //                 <button type="button" card-number="${numero_tarjeta}"  class="tw-btn   tw-mr-3 creditfn btn-gift-cards" >
                    //                   Credit
                    //                 </button>
                    //             </div>` },
                    //     visible: true
                    // },

                    {
                        data: null,
                        render: (data, type, row) => {

                            let numero_tarjeta = data.number;
                            let display = this.isMerchant ? 'block' : 'none';


                            return `<div class="btn-group sm:tw-hidden tw-flex tw-flex-row tw-justify-center">

                                    <button type="button" card-number="${numero_tarjeta}"  class="tw-btn   tw-mr-3 creditfn btn-gift-cards" >
                                       Credit
                                    </button>
                                     
                                    <button    style="display:${display};"  type="button" card-number="${numero_tarjeta}"  class="tw-btn   tw-mr-3 debitfn btn-gift-cards" >
                                      Debit
                                    </button>

                                    <button style="display:${display};" type="button" card-number="${numero_tarjeta}"  class="tw-btn   tw-mr-3 cancelfn btn-gift-cards" >
                                      Expire
                                    </button>

                                </div>` },

                    },

                    // {
                    //     data: null,
                    //     render: (data, type, row) => {

                    //         let numero_tarjeta = data.number;
                    //         let display =  this.isMerchant ? 'block' : 'none';

                    //         return `<div class="btn-group sm:tw-hidden">

                    //                 <button style="display:${display};" type="button" card-number="${numero_tarjeta}"  class="tw-btn   tw-mr-3 cancelfn btn-gift-cards" >
                    //                   Expire
                    //                 </button>
                    //             </div>` },
                    //     //visible: this.isMerchant
                    // },

                    // {
                    //     data: null,
                    //     defaultContent: '<button>Click!</button>',
                    //     targets: -1
                    // }

                ],

                responsive: true,
                autoWidth: false,

                dom: 'lBfrtip',

                buttons: [
                    'copy',
                    'csv',
                    {
                        extend: 'excelHtml5',
                        text: 'Save EXCEL'
                    },
                    {
                        extend: 'pdf',
                        messageTop: 'TX List'
                    },
                    'print'
                ],


                pageLength: 10,
                order: [],  //[6, 'desc']
                select: true,

                destroy: true,
                language: {
                    emptyTable: "No data",
                    infoEmpty: "No entries to show",
                    zeroRecords: "No data match the filter"
                },

                initComplete: function (settings, json) {
                    $("#container-listgift-cards").css('visibility', 'visible');
                }





            });

            //this.tabla.columns( [ 0, 1, 2, 3 ] ).visible( false, false );
            //this.tabla.columns.adjust().draw( false ); // adjust column sizing and redraw







            this.tabla.columns.adjust().draw();




            if (this.tabla) {
                /* this.tabla.on('select', (e, dt, type, indexes) => {
                     if (type === 'row') {
                         if (this.props.onChangeSelectedTX) {
                             this.props.onChangeSelectedTX(this.tabla.rows(indexes).data()[0])
                         }
                     }
                 });*/

                // Add event listener for opening and closing details
                this.tabla.on('click', 'td.dt-control', (e) => {
                    let tr = e.target.closest('tr');

                    let row = this.tabla.row(tr);
                    console.log("td.dt-control")





                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                    }
                    else {
                        // Open this row
                        row.child(this.formatTuplaOculta(row.data())).show();
                    }
                });





                // this.tabla.on('click', 'button', function (e) {
                //     let data =  this.tabla.row(e.target.closest('tr')).data();

                //     alert(data[0] + "'s salary is: " + data[5]);
                // });





                this.tabla.on('click', '.creditfn', (e) => {
                    let tr = e.target.closest('tr');

                    let row = this.tabla.row(tr);

                    const cardNumber = $(e.target)[0].attributes['card-number'].value;

                    this.creditCard(cardNumber);



                });

                this.tabla.on('click', '.debitfn', (e) => {
                    let tr = e.target.closest('tr');

                    let row = this.tabla.row(tr);
                    const cardNumber = $(e.target)[0].attributes['card-number'].value;

                    this.debitCard(cardNumber);


                });

                this.tabla.on('click', '.cancelfn', (e) => {
                    let tr = e.target.closest('tr');

                    let row = this.tabla.row(tr);
                    const cardNumber = $(e.target)[0].attributes['card-number'].value;

                    this.cancelCard(cardNumber);


                });
            }

            if (!this.datos || this.datos.length <= 0) {


                //this.tabla.clear();
                //this.tabla.destroy();
                //2nd empty html
                $(this.tableId + " tbody").empty();  //LIMPIA EL CUERPO
                $(this.tableId + " thead").empty(); //LIMPIA EL HEADER
                $(this.tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?


            }




            this.crearSocket();






        });


        onRendered(async () => {



            const base_name_otra_table = "#container-listbeneficiary"

            const otra_table = $(`${base_name_otra_table}_wrapper`)


            $('#container-listbeneficiary_wrapper').remove();
            // $('#container-listtr_wrapper').remove();
            //$('#container-listgift-cards_wrapper').remove();

            //$('#container-listtr').DataTable().clear().destroy();
            $('#container-listbeneficiary').DataTable().clear().destroy();
            //            $('#container-listgift-cards').DataTable().clear().destroy();


            if (this.tabla) {
                this.tabla.draw();
            }




        });





    }

    async transformarRawDatos(raw_datos) {



        if (!raw_datos || !raw_datos.status) {

            return [];
        } else if (!(raw_datos.status != 200 || raw_datos.status != 201)) {

            return [];
        } else if (!raw_datos.data) {

            return [];

        }









        //Extrayendo datos
        const datosOK = await raw_datos.data.data.map((unDato) => {

            let balance_usd = null
            let balance_eur = null
            let balance_cad = null
            let balance_cup = null

            let retencion_neg_usd = null;
            let retencion_neg_eur = null;
            let retencion_neg_cad = null;
            let retencion_neg_cup = null;

            let retencion_pos_usd = null;
            let retencion_pos_eur = null;
            let retencion_pos_cad = null;
            let retencion_pos_cup = null;

            let balance_usd_obj = null
            let balance_eur_obj = null
            let balance_cad_obj = null
            let balance_cup_obj = null

            let retencion_neg_usd_obj = null;
            let retencion_neg_eur_obj = null;
            let retencion_neg_cad_obj = null;
            let retencion_neg_cup_obj = null;

            let retencion_pos_usd_obj = null;
            let retencion_pos_eur_obj = null;
            let retencion_pos_cad_obj = null;
            let retencion_pos_cup_obj = null;

            if (unDato.balance) {



                balance_usd_obj = unDato.balance.find(unSaldo => unSaldo.currency == 'USD');
                balance_eur_obj = unDato.balance.find(unSaldo => unSaldo.currency == 'EUR');
                balance_cad_obj = unDato.balance.find(unSaldo => unSaldo.currency == 'CAD');
                balance_cup_obj = unDato.balance.find(unSaldo => unSaldo.currency == 'CUP');

                retencion_pos_usd_obj = unDato.positiveRetentions.find(unSaldo => unSaldo.currency == 'USD');
                retencion_pos_eur_obj = unDato.positiveRetentions.find(unSaldo => unSaldo.currency == 'EUR');
                retencion_pos_cad_obj = unDato.positiveRetentions.find(unSaldo => unSaldo.currency == 'CAD');
                retencion_pos_cup_obj = unDato.positiveRetentions.find(unSaldo => unSaldo.currency == 'CUP');

                retencion_neg_usd_obj = unDato.negativeRetentions.find(unSaldo => unSaldo.currency == 'USD');
                retencion_neg_eur_obj = unDato.negativeRetentions.find(unSaldo => unSaldo.currency == 'EUR');
                retencion_neg_cad_obj = unDato.negativeRetentions.find(unSaldo => unSaldo.currency == 'CAD');
                retencion_neg_cup_obj = unDato.negativeRetentions.find(unSaldo => unSaldo.currency == 'CUP');


                balance_usd = balance_usd_obj ? balance_usd_obj.amount : null;
                balance_eur = balance_eur_obj ? balance_eur_obj.amount : null;
                balance_cad = balance_cad_obj ? balance_cad_obj.amount : null;
                balance_cup = balance_cup_obj ? balance_cup_obj.amount : null;

                retencion_pos_usd = retencion_pos_usd_obj ? retencion_pos_usd_obj.amount : null;
                retencion_pos_eur = retencion_pos_eur_obj ? retencion_pos_eur_obj.amount : null;
                retencion_pos_cad = retencion_pos_cad_obj ? retencion_pos_cad_obj.amount : null;
                retencion_pos_cup = retencion_pos_cup_obj ? retencion_pos_cup_obj.amount : null;

                retencion_neg_usd = retencion_neg_usd_obj ? retencion_neg_usd_obj.amount : null;
                retencion_neg_eur = retencion_neg_eur_obj ? retencion_neg_eur_obj.amount : null;
                retencion_neg_cad = retencion_neg_cad_obj ? retencion_neg_cad_obj.amount : null;
                retencion_neg_cup = retencion_neg_cup_obj ? retencion_neg_cup_obj.amount : null;












            }



            return {

                number: unDato.number,
                holder: unDato.holder,
                cvv2: unDato.cvv2,
                expiry: unDato.expiry.year + ' / ' + unDato.expiry.month,
                isExpired: unDato.isExpired,
                usd: balance_usd ? balance_usd : '',
                eur: balance_eur ? balance_eur : '',
                cad: balance_cad ? balance_cad : '',
                cup: balance_cup ? balance_cup : '',
                retencion_pos_usd: retencion_pos_usd ? retencion_pos_usd : '',
                retencion_pos_eur: retencion_pos_eur ? retencion_pos_eur : '',
                retencion_pos_cad: retencion_pos_cad ? retencion_pos_cad : '',
                retencion_pos_cup: retencion_pos_cup ? retencion_pos_cup : '',

                retencion_neg_usd: retencion_neg_usd ? retencion_neg_usd : '',
                retencion_neg_eur: retencion_neg_eur ? retencion_neg_eur : '',
                retencion_neg_cad: retencion_neg_cad ? retencion_neg_cad : '',
                retencion_neg_cup: retencion_neg_cup ? retencion_neg_cup : '',
                _id: unDato._id


            }
        })






        //mostrar todas las operaciones de la wallet

        return datosOK;

    }


    actualizarDatos = async (datos) => {


        if (this.tabla) {

            this.tabla.clear();
            this.tabla.rows.add(datos);
            this.tabla.draw();
        }


    }


    debitCard = async (number) => {

        const ownerObj = this.datos.find((unCard) => unCard.number === number);



        const { value: formValues } = await Swal.fire({
            title: "Gift Card Debit Token",

            html: `
            <div class="tw-form-control tw-w-full tw-p-2">
                <div>
                    <label class="tw-label">
                        <span class="tw-label-text">Gift Card to Debit: ${number}</span>
                    </label>
                </div>
                <div>
                    <label class="tw-label">
                        <span class="tw-label-text">Owner: ${ownerObj.holder}</span>
                    </label>
                </div>
            </div>

           
               <div class="tw-form-control tw-w-full tw-p-2">
                    <div class="sm:tw-grid sm:tw-grid-cols-[19%_70%] tw-w-full tw-items-center tw-justify-items-start tw-pb-2 !tw-text-left">
                        <div class="tw-label-text ">CVV2</div>
                        <input type="text" id="cvv2"  class="tw-input tw-input-bordered sm:tw-w-[30%] tw-w-[20%] "  />
                    </div>    

                    <div class="sm:tw-grid sm:tw-grid-cols-[19%_70%] tw-w-full tw-items-center tw-justify-items-start !tw-text-left">
                        <div class="tw-label-text  ">Exp Date</div>
                        <div class="tw-flex tw-flex-row  tw-w-full tw-items-center">
                          <input type="text" id="year"  class="tw-input tw-input-bordered sm:tw-w-[30%] tw-w-[20%] "  placeholder='YY' />
                          <span class="tw-ml-1 tw-mr-1">/</span>                          
                          <input type="text" id="month"  class="tw-input tw-input-bordered sm:tw-w-[30%] tw-w-[20%] tw-mr-2  " placeholder='MM'  />
                        </div>  
                    </div>    
                </div>
           

            <div class="tw-form-control tw-w-full tw-p-2">
                <label class="tw-label">
                        <span class="tw-label-text">Debit Amount</span>
                </label>
        
                <div class="tw-join">                        
                 
                    <input type="text" id="amount"  class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00" />
                            
                    
                    <select id="currency" class="tw-select tw-select-bordered tw-join-item"   >                    
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="CAD">CAD</option>   
                    </select>

                </div>

                <div class="">
                    <label class="tw-label">
                        <span class="tw-label-text">Concept</span>
                    </label>
                    
                    <textarea id="concept" class="tw-textarea tw-textarea-bordered tw-w-full" placeholder="" rows="3"  maxlength="200" style="resize:none;" ></textarea>
                </div>            
            </div>


            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const resultado = {
                    amount: document.getElementById("amount").value,
                    currency: document.getElementById("currency").value,
                    concept: document.getElementById("concept").value,
                    cvv2: document.getElementById("cvv2").value,
                    expiry: {
                        month: document.getElementById("month").value,
                        year: document.getElementById("year").value,
                    }


                }
                return resultado;
            }
        });

        let respuesta = null;

        if (formValues) {


            try {

                let datos = {
                    number: number,
                    externalID: API.generateRandomID(),
                    paymentMethod: {
                        paymentLink: true,
                    },
                    ...formValues
                }

                $.blockUI({ message: '<span> <img src="img/Spinner-1s-200px.png" /></span> ' });
                respuesta = await this.api.giftCardDebit(datos);


                $.unblockUI();



                if (respuesta.status == 200) {


                    Swal.fire({
                        icon: 'info', text: respuesta.payload
                    })

                } else {
                    Swal.fire({
                        icon: 'error', text: "Error creating Debit to Card"
                    })
                }


                //const urlHome = this.props.urlHome ? this.props.urlHome : null;

                // UImanager.gestionResultado(respuesta, urlHome, this.props.menuController);

            } catch (error) {
                console.log(error);
            }




        }







    }



    creditCard = async (number) => {

        const ownerObj = this.datos.find((unCard) => unCard.number === number);



        const { value: formValues } = await Swal.fire({
            title: "Gift Card Credit Token",

            html: `
            <div class="tw-form-control tw-w-full tw-p-2">
                <div>
                    <label class="tw-label">
                        <span class="tw-label-text">Gift Card to Credit: ${number}</span>
                    </label>
                </div>
                <div>
                    <label class="tw-label">
                        <span class="tw-label-text">Owner: ${ownerObj.holder}</span>
                    </label>
                </div>
            </div>
            <div class="tw-form-control tw-w-full tw-p-2">
                <label class="tw-label">
                        <span class="tw-label-text">Credit Amount</span>
                </label>
        
              <div class="tw-join">                        
                 
                <input type="text" id="amount"  class="tw-input tw-input-bordered tw-join-item tw-text-right tw-w-full" placeholder="0.00" />
                        
                
                <select id="currency" class="tw-select tw-select-bordered tw-join-item"   >                    
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>   
                </select>

              </div>

              <div class="">
                    <label class="tw-label">
                        <span class="tw-label-text">Concept</span>
                    </label>
                    
                    <textarea id="concept" class="tw-textarea tw-textarea-bordered tw-w-full" placeholder="" rows="4" cols="10" maxlength="200" style="resize:none;" ></textarea>
                </div>

             

            </div>


            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const resultado = {
                    amount: document.getElementById("amount").value,
                    currency: document.getElementById("currency").value,
                    concept: document.getElementById("concept").value
                }
                return resultado;
            }
        });

        let respuesta = null;

        if (formValues) {


            try {

                let datos = {
                    number: number,
                    externalID: API.generateRandomID(),
                    paymentMethod: {
                        paymentLink: true,
                    },
                    ...formValues
                }

                $.blockUI({ message: '<span> <img src="img/Spinner-1s-200px.png" /></span> ' });
                respuesta = await this.api.giftCardCredit(datos);
                $.unblockUI();


                const urlHome = this.props.urlHome ? this.props.urlHome : null;

                UImanager.gestionResultado(respuesta, urlHome, this.props.menuController);

            } catch (error) {
                console.log(error);
            }




        }







    }


    cancelCard = async (number) => {




        const cardObj = this.datos.find((unCard) => unCard.number === number);



        const { value: formValues } = await Swal.fire({
            title: "Gift Card Expire",

            html: `
            <div class="tw-form-control tw-w-full tw-p-2">
                <div>
                    <label class="tw-label">
                        <span class="tw-label-text">Gift Card to Expire: ${number}</span>
                    </label>
                </div>
                <div>
                    <label class="tw-label">
                        <span class="tw-label-text">Owner: ${cardObj.holder}</span>
                    </label>
                </div>
            </div>

            <div class="tw-form-control tw-w-full tw-p-2">
                <label class="tw-label">
                        <span class="tw-label-text">Do you really want to expire this card?</span>
                </label>
            </div>


            `,
            focusConfirm: false,
            showCancelButton: true,

        });

        let respuesta = null;




        try {



            $.blockUI({ message: '<span> <img src="img/Spinner-1s-200px.png" /></span> ' });
            respuesta = await this.api.giftCardExpire(cardObj._id);
            $.unblockUI();


            const urlHome = this.props.urlHome ? this.props.urlHome : null;
            if (respuesta.status == 200) {

                Swal.fire({
                    icon: 'info', text: respuesta.data.message
                })

            } else {
                console.log("ERROR Expiring Card")
                console.log(respuesta)
                Swal.fire({
                    icon: 'error', text: "Error expiring Card"
                })
            }



        } catch (error) {
            console.log(error);
        }









    }



    onRefresh = async () => {
        this.consultarSaldoTarjetas();

    }

    onCreate = async () => {


        /* let optionsBeneficiario = '';
 
         this.beneficiariosNames.map((el) => {
             optionsBeneficiario = optionsBeneficiario + `<option value="${el.beneficiaryFullName}">${el.beneficiaryFullName}</option>`
 
         })*/


        /*<select id="beneficiary" class="tw-select tw-select-bordered tw-join-item"   > 
        ${optionsBeneficiario}                                        
     </select>     */


        //    TODO:
        //  POST /api/private/cards/create
        // {
        //   "holderName": "Pepito Perez",
        //   "email": "pepito.perez@email.com",
        //   "phone": "+5355555555",
        //   "idNumber": "92051540268"
        // }

        var TelefonoValido = false;
        var telefono = null;
        
        const { value: datosCardOwner } = await Swal.fire({
            title: "Create Gift Card",

            html: `
        
            <div class="tw-form-control tw-w-full tw-p-2">
                <label class="tw-label">
                        <span class="tw-label-text">Card holder name</span>
                </label>                
                <input id="beneficiary" type="text" class="tw-input tw-input-bordered tw-w-full tw-join-item" />  
                
                

                <span id="beneficiarioerror" class="error" style="display:none;">
                  Card holder name can't be empty!!!
                </span>


                <label class="tw-label">
                    <span class="tw-label-text">Phone </span>
                </label>
                <input   id="phone" name="phone" type="phone" class="selectphone tw-input tw-input-bordered tw-w-full"
                         onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"/>   
                <span id="phoneerror" class="error" style="display:none;">
                    Invalid phone number!!!
                </span>

                <label class="tw-label">
                        <span class="tw-label-text">Email address</span>
                </label>                                
                <input id="email" type="text" class="tw-input tw-input-bordered tw-w-full tw-join-item" /> 
                <span id="emailerror" class="error" style="display:none;">
                  Invalid email address!!!
                </span>

                

                <label class="tw-label">
                    <span class="tw-label-text">ID number</span>
                </label>                
                <input id="id" type="text" class="tw-input tw-input-bordered tw-w-full tw-join-item" /> 
                <span id="iderror" class="error" style="display:none;">
                ID number can't be empty!!!
              </span>

                
            </div>


            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {

                const beneficiario =  document.getElementById("beneficiary").value;

                if (UImanager.validarSiVacio(beneficiario)) {
                    $('#beneficiarioerror').show();
                    return false;                    
                }


                if (!TelefonoValido) {
                    $('#phoneerror').show();
                    return false;
                }

                const correoElectronico =  document.getElementById("email").value;

                if (!UImanager.validMail(correoElectronico)) {
                    $('#emailerror').show();
                    return false;                    
                }

                const id =  document.getElementById("id").value;

                if (UImanager.validarSiVacio(id)) {
                    $('#iderror').show();  
                    return false;
                }    
                

                const resultado = {
                    selectedBeneficiary: beneficiario,
                    email: correoElectronico,
                    phone: telefono,
                    id: document.getElementById("id").value
                }

                return resultado;
            },
            didOpen: () => {

                console.log("Opening");
                const phoneInput = document.querySelector("#phone");
                const phonInputSelect = window.intlTelInput(phoneInput, {
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
                // this.phoneInput.addEventListener('countrychange', this.handleCountryChange);



                $('#phone').on('input', (e) => {
                    const phoneNumber = e.target.value;


                    const cod_pais = '+' + phonInputSelect.getSelectedCountryData().dialCode;

                    telefono = cod_pais + phoneNumber;

                    TelefonoValido = libphonenumber.isValidNumber(telefono);

                    console.log(telefono)
                    console.log(TelefonoValido);
                    if (TelefonoValido) {
                        $('#phoneerror').hide();
                    } else {
                        $('#phoneerror').show();
                    }

                });

                $('#email').on('input', (e) => {

                    if (UImanager.validMail(e.target.value)) {
                        $('#emailerror').hide();                                                           
                    } else {                        
                        $('#emailerror').show();   
                    }

                 });


                 $('#beneficiary').on('input', (e) => {

                    if (UImanager.validarSiVacio(e.target.value)) {
                        $('#beneficiarioerror').show();                                         
                    } else {
                        $('#beneficiarioerror').hide();
                    }

                   

                 });

                 $('#id').on('input', (e) => {

                    if (UImanager.validarSiVacio(e.target.value)) {
                        $('#iderror').show();                                         
                    } else {
                        $('#iderror').hide();
                    }

                   

                 });


            }
        });




        if (!datosCardOwner) {
            return;
        }
        this.spinner.show = true;

        const creandoGiftCardRespuesta = await this.api.createGiftCard(datosCardOwner);



        //Actualizar table

        /* const raw_datos = await this.api.getGiftCardData();
  
  
  
          this.datos = [];
  
  
          this.datos = await this.transformarRawDatos(raw_datos);
          if (this.datos) {
              this.actualizarDatos(this.datos);
          }
  */
        this.spinner.show = false;


        // await this.createGiftCard(holderName) ;
    }




    crearSocket = () => {




        const query = {
            token: this.accessToken
        }

        this.subscriptionPath = "/api/subscription";

        // -----   Creando el socket  ------------------------------------------------
        this.socket = io(API.baseSocketURL, {
            path: this.subscriptionPath,
            query: query,
        });

        // ----- Si ocurre algun error --------------------------------------------------
        this.socket.on('error', (error) => {
            console.log('Socket GiftCards ERROR: ', {
                event: 'error',
                data: error
            });
        });



        // ----- Socket conectado  ---------------------------------------------------
        this.socket.on("connect", (datos) => {
            console.log("Socket  GiftCards conectado correctamente");
            console.log("socket  GiftCards id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx



            this.socket.emit('subscribe', [`GIFT_CARD`]);
        });

        // ----- Socket ReConectado  --------------------------------------------------- 
        this.socket.on('reconnect', () => {
            console.log('Socket  GiftCards RE conectado ', this.socket.connected);
        });




        // ----- Si recibe mensaje del tipo  GIFT_CARD_UPDATE --------------------------------------------------
        this.socket.on('GIFT_CARD_UPDATE', async (data) => {
            console.log('Socket GIFT_CARD_UPDATE Recibiendo datos ');

            console.log(data)
            const raw_datos = {
                status: 200,
                data: {
                    data: new Array(data)
                }
            }



            const datoNuevo = await this.transformarRawDatos(raw_datos);  //podria ser que llegue mas de un dato
            console.log("Dato nuevo recibido")
            console.log(datoNuevo[0])


            for (let v of this.datos) {
                if (v.number === datoNuevo[0].number) {


                    v.cad = datoNuevo[0].cad;
                    v.cup = datoNuevo[0].cup;
                    v.eur = datoNuevo[0].eur;
                    v.usd = datoNuevo[0].usd;

                    v.retencion_neg_cad = datoNuevo[0].retencion_neg_cad;
                    v.retencion_neg_cup = datoNuevo[0].retencion_neg_cup;
                    v.retencion_neg_eur = datoNuevo[0].retencion_neg_eur;
                    v.retencion_neg_usd = datoNuevo[0].retencion_neg_usd;

                    v.retencion_pos_cad = datoNuevo[0].retencion_pos_cad;
                    v.retencion_pos_cup = datoNuevo[0].retencion_pos_cup;
                    v.retencion_pos_eur = datoNuevo[0].retencion_pos_eur;
                    v.retencion_pos_usd = datoNuevo[0].retencion_pos_usd;

                }


            }



            console.log(this.datos);


            if (this.datos) {
                this.actualizarDatos(this.datos);
            }


            /* this.datos.filter(unDatoEnLista => unDatoEnLista.id === datoNuevo.id)
                 .forEach((unDatoEnLista2) => {
                     
                     
                     
                     unDatoEnLista2.cad = datoNuevo.cad;
                     unDatoEnLista2.cup = datoNuevo.cup;
                     unDatoEnLista2.eur = datoNuevo.eur;
                     unDatoEnLista2.usd = datoNuevo.usd;

                     unDatoEnLista2.retencion_neg_cad = datoNuevo.retencion_neg_cad;
                     unDatoEnLista2.retencion_neg_cup = datoNuevo.retencion_neg_cup;
                     unDatoEnLista2.retencion_neg_eur = datoNuevo.retencion_neg_eur;
                     unDatoEnLista2.retencion_neg_usd = datoNuevo.retencion_neg_usd;

                     unDatoEnLista2.retencion_pos_cad = datoNuevo.retencion_pos_cad;
                     unDatoEnLista2.retencion_pos_cup = datoNuevo.retencion_pos_cup;
                     unDatoEnLista2.retencion_pos_eur = datoNuevo.retencion_pos_eur;
                     unDatoEnLista2.retencion_pos_usd = datoNuevo.retencion_pos_usd;


                 })

     

     console.log(this.datos);


     if (this.datos) {
         this.actualizarDatos(this.datos);
     }*/


        });


        // ----- Si recibe mensaje del tipo  GIFT_CARD_CREATED --------------------------------------------------
        this.socket.on('GIFT_CARD_CREATED', async (data) => {
            console.log('Socket GIFT_CARD_CREATED Recibiendo datos ');



            const raw_datos = {
                status: 200,
                data: {
                    data: new Array(data)
                }
            }



            const unDato = await this.transformarRawDatos(raw_datos);
            console.log(unDato)
            if (unDato && unDato.length > 0) {

                unDato.forEach(element => {
                    this.datos.push(element);
                });


            }

            console.log(this.datos);


            if (this.datos) {
                this.actualizarDatos(this.datos);
            }

        });


        // ----- Si recibe mensaje del tipo  GIFT_CARD_CREATED --------------------------------------------------
        this.socket.on('GIFT_CARD_REMOVED', async (data) => {
            console.log('Socket GIFT_CARD_REMOVED Recibiendo datos ');
            console.log(data)

        });


    }






}


