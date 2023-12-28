const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";



export class ListaGiftCards extends Component {




    datos = null;
    //grid = null;
    tabla = null;
    // senderName = '-';

    tableId = "#container-listgift-cards";


    total_tx_a_solicitar = 50;

    minDateFiltro = null;
    maxDateFiltro = null;
    selectedBeneficiaryName = ''

    spinner = useState({
        show: true
    })






    /*
        <button class="submit-btn tw-w-[30%]" t-on-click="onCreate">Expire</button>
        <button class="submit-btn tw-w-[30%]" t-on-click="onCreate">Credit</button>
        <button class="submit-btn tw-w-[30%]" t-on-click="onCreate">Debit</button>*/

    //sm:tw-grid-cols-2
    static template = xml`  

   
  

        <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg sm:tw-col-2 tw-mb-4">
            <div class="tw-card-body ">
                
                <!-- **************************************************** -->
                <!-- ***************  Crear Gift Card   ***************** -->
                <!-- **************************************************** -->
                
                
               

               
              
             
                <button class="submit-btn tw-w-[30%]" t-on-click="onCreate">Create</button>
             
              
                
                
               
                 
            </div>
        </div>
   

    <t t-if="this.datos==null">
        <span  class="display nowrap responsive " style="width:100%"   >
               No data available yet            
        </span>

        <t t-if="this.spinner.show==true">
        <span>
          <img src="img/Spinner-1s-200px.png" width="35rem"/>
        </span>
        </t>
    </t> 

   
    
    <table  id="container-listgift-cards" class="display nowrap responsive " style="width:100%" cellspacing="0"  >
    
        <thead class="tw-bg-[#0652ac] tw-text-[#FFFFFF] tw-text-[1.05rem] tw-mt-1">

            <tr>
                    <th></th>
                    <th  > Gift Card</th>    
                    <th  class="centrar">Holder</th> 
                    <th  class="centrar">Cvv2</th>
                    <th  class="centrar">Exp. Date <br/> (yy/mm) </th>    
                    <th  class="centrar">Is Exp?</th>
                    <th  class="centrar">USD</th>
                    <th  class="centrar">EUR</th>
                    <th  class="centrar">CAD</th>
                    <th  class="centrar">CUP</th>  
                   

            </tr>
        
        </thead>
   
    </table>



   
  `;



    //TODO: Formatear la fecha
    //TODO: Formatear el importe

    static props = ["urlHome"];

    static defaultProps = {
        urlHome: '/',
    };


    setup() {

        API.setRedirectionURL(this.props.urlHome);
        onWillStart(async () => {


        });



        onMounted(async () => {

            const accessToken = API.getTokenFromsessionStorage();
            if (!accessToken) { return }


            const query = {
                token: accessToken
            }


            this.api = new API(accessToken);

            //const newCard =await this.api.createGiftCard("Juan Perez");
            //console.log(newCard)

            const raw_datos = await this.api.getGiftCardData();



            this.datos = [];


            this.datos = await this.transformarRawDatos(raw_datos);
            if (this.datos) {
                this.actualizarDatos(this.datos);
            }

            console.log("DATOS del TX")
            console.log(this.datos)

            this.spinner.show = false;


            /*
        
                    // -----   Creando el socket  ------------------------------------------------
                    this.socket = io(API.baseSocketURL, {
                        path: this.subscriptionPath,
                        query: query,
                    });
        
                    // ----- Si ocurre algun error --------------------------------------------------
                    this.socket.on('error', (error) => {
                        console.log('Socket ListTX ERROR: ', {
                            event: 'error',
                            data: error
                        });
                    });
        
        
            
                    // ----- Socket conectado  ---------------------------------------------------
                    this.socket.on("connect", (datos) => {
                        console.log("Socket LIST TX conectado correctamente");
                        console.log("socket LIST TX id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx
        
                        // this.socket.emit('subscribe', ['TRANSACTIONS']); //recibe todas las transacciones ok
                        //Creando subscripcion a todas las transacciones de la wallet
                        this.socket.emit('subscribe', [`TRANSACTION_${walletAddress}`]);
                    });
        
                    // ----- Socket ReConectado  --------------------------------------------------- 
                    this.socket.on('reconnect', () => {
                        console.log('Socket LIST TX RE conectado ', this.socket.connected);
                    });
        
        
        
        
                    // ----- Si recibe mensaje del tipo  TRANSACTION_UPDATE --------------------------------------------------
                    this.socket.on('TRANSACTION_UPDATE', async (data) => {
                        console.log('TRANSACTION_UPDATE LIST TX recibiendo datos de servidor', data);
                        console.log('TR Status LIST TX ' + data.transactionStatus);
                        console.log("Solicitando lista de TX al servidor en SOCKET")
                        const raw_datos = await this.api.getTrData(this.total_tx_a_solicitar);
                        console.log("lista de TX recibidas en SOCKET")
        
                        //console.log(raw_datos)
                        this.datos = [];
        
                        this.datos = await this.transformarRawDatos(raw_datos);
                        if (this.datos) {
                            this.actualizarDatos(this.datos);
                        }
        
                    }
        
        
                    );
        
                    */







            function format(inputDate) {
                let date, month, year, segundos, minutos, horas;
                date = inputDate.getDate();

                segundos = inputDate.getSeconds().toString().padStart(2, '0');
                minutos = inputDate.getMinutes().toString().padStart(2, '0');;
                horas = inputDate.getHours().toString().padStart(2, '0');;

                month = inputDate.getMonth() + 1;
                year = inputDate.getFullYear();
                date = date.toString().padStart(2, '0');
                month = month.toString().padStart(2, '0');

                return `${year}/${month}/${date} ${horas}:${minutos}:${segundos}`;
            }



            function creditFn(event){
                console.log(event);

            }

            // Formatting function for row details - modify as you need
            function format(d) {
                // `d` is the original data object for the row


              
               const numero=d.number;

                return (
                    '<dl>' +
                    '<dt>Actions:</dt>' +
                    '<dd>' +
                    '<div class="tw-flex">' +
                    '<button  class="tw-btn   tw-mr-3 creditfn" card-number="'+numero +'">Credit </button>' +
                    '<button  class="tw-btn  tw-mr-3 debitfn" card-number="'+numero +'">Debit</button>' +
                    '<button  class="tw-btn  tw-mr-3 cancelfn" card-number="'+numero +'">Cancel</button>' +
                    '</div>' +

                    '</dd>' +


                    /* '<dt>Full name:</dt>' +
                         '<dd>' +
                         d.name +
                         '</dd>' +
                     '<dt>Extension number:</dt>' +
                         '<dd>' +
                         d.extn +
                         '</dd>' +
                     '<dt>Extra info:</dt>' +
                         '<dd>And any further details here (images etc)...</dd>' +*/
                    '</dl>'
                );
            }




            //https://phppot.com/jquery/responsive-datatables-with-automatic-column-hiding
            console.log(this.tableId)
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
                    /*{
                        "mData": null,
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                          return '<a class="btn btn-info btn-sm" href=#/' + full[0] + '>' + 'Edit' + '</a>';
                        }
                      }*/









                ],

                responsive: true,

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

                autoWidth: false,
                pageLength: 10,
                order: [],  //[6, 'desc']
                select: true,

                destroy: true,
                language: {
                    emptyTable: "No data",
                    infoEmpty: "No entries to show",
                    zeroRecords: "No data match the filter"
                },






            });

            //this.tabla.columns( [ 0, 1, 2, 3 ] ).visible( false, false );
            //this.tabla.columns.adjust().draw( false ); // adjust column sizing and redraw








            this.tabla.columns.adjust().draw();


            //console.log(this.tabla)

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


                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                    }
                    else {
                        // Open this row
                        row.child(format(row.data())).show();
                    }
                });


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






        });


        onRendered(async () => {

            const base_name_otra_table = "#container-listbeneficiary"

            const otra_table = $(`${base_name_otra_table}_wrapper`)


            $('#container-listbeneficiary_wrapper').remove();
            $('#container-listtr_wrapper').remove();
            //$('#container-listgift-cards_wrapper').remove();

            $('#container-listtr').DataTable().clear().destroy();
            $('#container-listbeneficiary').DataTable().clear().destroy();
            //            $('#container-listgift-cards').DataTable().clear().destroy();


            if (this.tabla) {
                this.tabla.draw();
            }




        });





    }

    transformarRawDatos(raw_datos) {


        console.log(raw_datos)

        if (!raw_datos || !raw_datos.status) {
            return [];
        } else if (!(raw_datos.status != 200 || raw_datos.status != 201)) {
            return [];
        } else if (!raw_datos.data) {
            return [];
        }






        const datosOK = raw_datos.data.data.map((unDato) => {

            return {

                number: unDato.number,
                holder: unDato.holder,
                cvv2: unDato.cvv2,
                expiry: unDato.expiry.year + ' / ' + unDato.expiry.month,
                isExpired: unDato.isExpired,
                usd: unDato.usd ? unDato.usd : '',
                eur: unDato.eur ? unDato.eur : '',
                cad: unDato.cad ? unDato.cad : '',
                cup: unDato.cad ? unDato.cad : ''

            }
        })






        //mostrar todas las operaciones de la wallet

        return datosOK;

    }


    actualizarDatos = async (datos) => {
        console.log(this.tabla)

        if (this.tabla) {

            this.tabla.clear();
            this.tabla.rows.add(datos);
            this.tabla.draw();
        }


    }


    debitCard = (number) => {
        console.log(number)
    }

    creditCard = (number) => {
        console.log(number)
    }


    cancelCard = (number) => {
        console.log(number)
    }










}


