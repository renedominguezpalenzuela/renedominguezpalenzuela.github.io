const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API, UImanager } from "../utils.js";
import { tipos_operaciones } from "../../data/tipos_operacion.js";





export class ListaTR extends Component {




    datos = null;
    //grid = null;
    tabla = null;
    // senderName = '-';

    //Variables para el socket
    socketActivo = true;
    socket = null;
    subscriptionPath = "/api/subscription";

    balance = useState({
        saldos: []
    });

    total_tx_a_solicitar = 50;

    minDateFiltro = null;
    maxDateFiltro = null;

    tipoOperacionFiltro = -1;




  





    static template = xml`  


    <table class="inputs tw-mb-2">
        <tbody>
            <tr  >

               <td class="tw-w-[22rem] ">
                    <div>
                        <span>From:</span>
                        <span class="tw-ml-2">
                           <input type="text" id="min" name="min"  placeholder="yyyy-mm-dd" class="tw-input tw-input-bordered" />
                        </span> 
                    </div>
                    
                    <div>
                        <span>To:</span>
                        <span class="tw-ml-2">
                            <input type="text" id="max" name="max"  placeholder="yyyy-mm-dd" class="tw-input tw-input-bordered"/>
                        </span>
                    </div>
                    
                </td>

                <td>
                    <button  class="tw-btn"  t-on-click="resetRange" >Reset range </button>
                </td>

                <td t-if="this.props.tipoVista=='' || this.props.tipoVista==null" class="tw-w-[16rem] ">
                <div>
                    <span>Type:</span>
                    <span class="tw-ml-2">
                         <select class="tw-select tw-select-bordered tw-join-item" t-att-value="this.tipos_operaciones"  t-on-input="onChangeType" t-ref="inputType" >                    
                        <option  t-att-value="-1" >Select Tr. Type</option>
                          <t t-if="(this.tipos_operaciones) and (this.tipos_operaciones.length>0) ">
                           <t  t-foreach="this.tipos_operaciones" t-as="unTipo" t-key="unTipo.cod_tipo">
                                <option t-att-value="unTipo.cod_tipo">
                                    <t t-esc="unTipo.usertext"/>                                  
                                </option>
                          </t>       
                        </t>        
                        </select> 
                    </span> 
                </div>
                  
                </td>

            </tr>
        </tbody>
    </table>

   
    
    <table  id="container-listtr" class="display nowrap responsive " style="width:100%" cellspacing="0"  >
    <thead class="tw-bg-[#0652ac] tw-text-[#FFFFFF] tw-text-[1.05rem] tw-mt-1">
        <tr>
                <th >Transaction ID</th>    
                 <th class="centrar">Type</th> 
                
               
                <th  class="centrar">Status</th>
            
            
                <th class="amount-value">Amount <br/> (No fee)</th>
                <th >Fee: <br/> </th>
            
                <th >Curr.</th>
                <th  class="centrar">Created <br/> (yyyy/mm/dd) </th>    
                <th  >  Beneficiary Name  </th>  
                <th >  Beneficiary Phone  </th>  
                <th >  Beneficiary Card  </th> 
                <th >  Sender Name </th>
                <th >  Received Amount </th>
                <th >  Received Currency </th>

                <th>Type</th>
                <th>Type2</th> 
                <th>External ID</th>

                


                
                
           
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

        this.tipos_operaciones = tipos_operaciones;

   

        API.setRedirectionURL(this.props.urlHome);









        onWillStart(async () => {

          



        });



        onMounted(async () => {
            // do something here

      





            // console.log("Operacion")
            // console.log(this.datos[0])



            const accessToken = API.getTokenFromsessionStorage();
            if (!accessToken) { return }


            /* if (!accessToken) {
                 console.error("NO ACCESS TOKEN - Lista TX")
                 window.location.assign(API.redirectURLLogin);
                 return;
             }*/

            this.api = new API(accessToken);


            const walletAddress = window.sessionStorage.getItem('walletAddress');
            const userId = window.sessionStorage.getItem('userId');
            //this.senderName = window.sessionStorage.getItem('nameFull');
            //console.log(this.senderName);


            const query = {
                token: accessToken
            }


            if ((this.props.tipooperacion) && (this.props.tipooperacion != 0)) {
                this.tipos_operacion = tipos_operaciones.filter((una_operacion) => una_operacion.cod_tipo === this.props.tipooperacion)[0]



            }





            
            const raw_datos = await this.api.getTrData(this.total_tx_a_solicitar);
            console.log(raw_datos)







            this.datos = [];


            this.datos = await this.transformarRawDatos(raw_datos);







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

                    // Create date inputs

             
                }







                //this.tabla.config.plugin.remove("pagination");
                //this.tabla.config.plugin.remove("search");





                /*if (data.transactionStatus == "confirmed") {
                  const saldos = await this.get_data(true);
                  if (saldos) {
                    this.balance.saldos = saldos;
                    console.log(JSON.stringify(this.balance));
                  }
                }*/
            }


            );




            var tableId = "#container-listtr";







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

            function colorStatus(status) {
                let color = ""
                switch (status) {
                    case "requested":
                        color = "#658DF7"
                        break;

                    case "confirmed":
                        color = "#78D1B5"
                        break;

                    case "pending":
                        color = "#C07E00"
                        break;

                    case "failed":
                        color = "#D70707"
                        break;

                    case "canceled":
                        color = "#F83E54"
                        break;

                    case "processed":
                        color = "#3750D1"
                        break;

                    case "rejected":
                        color = "#F83E54"
                        break;

                    case "accepted":
                        color = "#28A745"
                        break;

                    case "queued":
                        color = "#28A215"
                        break;


                    default:
                        color = "#A0AFD6"
                        break;
                }

                return color;

            }

            //CCreando la tabla
            const showCol = await this.mostrarColumnas(this.props.tipoVista)


            this.minDateFiltro = new DateTime('#min', {
                format: 'YYYY-MM-DD',

            });
            this.maxDateFiltro = new DateTime('#max', {
                format: 'YYYY-MM-DD',

            });


            //https://phppot.com/jquery/responsive-datatables-with-automatic-column-hiding
            this.tabla = $(tableId).DataTable({
                data: this.datos,

                columns: [
                    { data: 'transactionID', width: '25%', visible: showCol.transactionID },
                    { data: 'userTextType', width: '30%', visible: showCol.userTextType },
                    {
                        data: 'transactionStatus', width: '23%',
                        render: function (data, type, row) {
                            let color = colorStatus(data)
                            return `<span class="state" style="background-color:${color};"> ${data} </span>`;
                        },
                        visible: showCol.transactionID
                    },
                    {
                        data: 'transactionAmount', width: '18%', className: "amount-value",
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        },
                        visible: showCol.transactionStatus

                    },
                    {
                        data: 'feeusercurr', width: '10%', className: "amount-value",
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        },
                        visible: showCol.feeusercurr
                    },
                    { data: 'currency', width: '8%', className: "centrar", visible: showCol.currency },
                    {
                        data: 'createdAt', width: '30%',
                        render: function (data, type, row) {
                            //const options = { year: 'numeric', month: 'long', day: 'numeric' };
                            const fecha = new Date(data);
                            return format(fecha)
                            //fecha.toLocaleTimeString('en-EN', options)
                            //event.toLocaleDateString(undefined, options)
                            //moment(data).format("MM/DD/YYYY");
                        },
                        visible: showCol.createdAt
                    },
                    { data: 'beneficiaryName', width: '35%', visible: showCol.beneficiaryName },
                    { data: 'beneficiaryPhone', width: '35%', visible: showCol.beneficiaryPhone },
                    { data: 'beneficiaryCardNumber', width: '35%', visible: showCol.beneficiaryCardNumber },
                    { data: 'senderName', width: '35%', visible: showCol.senderName },
                    { data: 'receivedAmount', width: '35%', visible: showCol.receivedAmount },
                    { data: 'receivedCurrency', width: '35%', visible: showCol.receivedCurrency },
                    { data: 'type', width: '15%', visible: showCol.type },
                    { data: 'type2', width: '15%', visible: showCol.type2 },
                    { data: 'externalID', width: '13%', visible: showCol.externalID }

                    /*{
                        data: 'feeusd', width: '4%', className: "amount-value",
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="" > ${valor} </span>`;
                        }
                    },
                    { data: 'type', width: '15%' },
                    { data: 'type2', width: '15%' },
                    { data: 'externalID', width: '13%' },*/






                ],
                /* dom: 'Bfrtip',
                 buttons: [
 
                     'copy', 'csv', 'excel', 'pdf', 'print'
                     'copy','excel', 'csv',
                     
                     {
                         extend: 'pdf',
                         messageTop: 'TX List'
                     },
                     // {
                     //     extend: 'print',
                     //     messageTop: 'TX List'
                     // }
 
                 ],*/
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
                "pageLength": 10,
                order: [[6, 'desc']],
                select: true,
                responsive: true,
                destroy: true,
                language: {
                    emptyTable: "No data",
                    infoEmpty: "No entries to show"
                }
                //footer: false

                /*'rowCallback': function(row, data, index){
                    console.log(data.transactionStatus)
                    console.log($(row).find('td:eq(3)')[0])
                    if(data.transactionStatus==="pending"){
                        $(row).find('td:eq(4)').css('color', 'white');
                        $(row).find('td:eq(4)').css('background-color', 'blue');
                        $(row).find('td:eq(4)').css('margin', '3px');
                       // $(row).find('td:eq(3)').addClass('state-requested');
                        //row.querySelector(':nth-child(3)').classList.add('state-requested');
                    }
                   // if(data[2].toUpperCase() == 'EE'){
                   //     $(row).find('td:eq(2)').css('color', 'blue');
                   // }
                  }*/

                /* createdRow: (row, data, index) => {
                     //console.log(data.transactionStatus)
                     console.log("-------")
                     console.log(row.querySelector('tr.child'))
                     // console.log($(row).find('td:eq(3)'))
                     if (data.transactionStatus === "confirmed") {
                         row.querySelector(':nth-child(5)').classList.add('state-requested');
                         //   row.querySelector('li:nth-child(1) > span.dtr-data').classList.add('state-requested');
                         //tr.child > td > ul > li:nth-child(1) > span.dtr-data
 
                     }
                 }*/

                /* "createdRow": function (row, data, dataIndex) {
                     console.log($('td', row).child)
                     if (data.transactionStatus==="pending") {
                         $('td', row).eq(4).addClass('state-requested');
                     }
                 }*/


            });







            // this.tabla.columns.adjust().draw();


            //console.log(this.tabla)

            if (this.tabla) {
                this.tabla.on('select', (e, dt, type, indexes) => {
                    if (type === 'row') {
                        if (this.props.onChangeSelectedTX) {
                            this.props.onChangeSelectedTX(this.tabla.rows(indexes).data()[0])
                        }
                    }
                });
            }

            if (!this.datos || this.datos.length <= 0) {
                //$('#container-listtr').DataTable().clear().destroy();

                // this.tabla.clear();
                //this.tabla.destroy();
                //2nd empty html
                $(tableId + " tbody").empty();  //LIMPIA EL CUERPO
                $(tableId + " thead").empty(); //LIMPIA EL HEADER
                $(tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?


            }


                

                    //Refilter the table
                    document.querySelectorAll('#min, #max').forEach((el) => {
                        el.addEventListener('change', () => this.tabla.draw());
                    })


                    // Filtro para las fechas
                    DataTable.ext.search.push( (settings, data, dataIndex) => {

                        if ((this.minDateFiltro==null || this.maxDateFiltro == null)) {
                            return true;
                        } 
                      
                        //UImanager.timeZoneTransformer(userData.birthDate).fromUtc
                        let min = UImanager.timeZoneTransformer(this.minDateFiltro.val()).fromUtc;
                        let max = UImanager.timeZoneTransformer(this.maxDateFiltro.val()).fromUtc;

                        if (min.getFullYear() < 1980) {
                            min = null;
                        } else {
                            min = new Date(min).setHours(0,0,0,0)

                        }

                        if (max.getFullYear() < 1980) {
                            max = null;
                        } else {
                            max = new Date(max).setHours(0,0,0,0)

                        }

                        let date = new Date(data[6]).setHours(0,0,0,0);
                   
                        if (
                            (min === null && max === null) ||
                            (min === null && date <= max) ||
                            (date >= min && max === null) || 
                            (date >= min  && date <= max) 
                            
                        ) {
                            return true;
                        }
                        return false;
                    });

                    // Filtro para los tipos de operacion
                    DataTable.ext.search.push( (settings, data, dataIndex) => {

                        if (this.tipoOperacionFiltro=='-1' ) {
                            return true;
                        }
                       
                        let tipoOperacion = data[1];

                        const codigoOperacion = this.tipos_operaciones.filter(unTipo =>unTipo.usertext === tipoOperacion);
                        if (codigoOperacion && codigoOperacion.length>0) {
      
                            if ( codigoOperacion[0].cod_tipo == this.tipoOperacionFiltro ) {                            
                                return true;
                            }
                            
                        }
                       
                        return false;
                    });








        });


        onRendered(async () => {


            const base_name_otra_table = "#container-listbeneficiary"
            //                                           container-listbeneficiary_wrapper


            const otra_table = $(`${base_name_otra_table}_wrapper`)


            //if (otra_table) {
            // console.log("Existe otra tabla")
            //console.log(otra_table)
            //              $(`${base_name_otra_table}_length`).empty();
            //              $(`${base_name_otra_table}_filter`).empty();
            $(`${base_name_otra_table}_wrapper`).remove();
            //    $(tableId + "tbody").empty();  //LIMPIA EL CUERPO
            //   $(tableId + "thead").empty(); //LIMPIA EL HEADER
            //otra_table.empty(); //LIMPIA TODO, EL FOOTER?
            //  $(tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?
            //}



        });





    }

    getBeneficiaryData(type2, unDato) {
        /*console.log("DATOS")
        console.log(unDato.type)
        console.log(type2)
        console.log(unDato)*/

        const type = unDato.type;

        let otrosDatos = {
            beneficiaryName: '-',
            beneficiaryPhone: '-',
            beneficiaryCardNumber: '-',
            senderName: '-',
            receivedAmount: '-',
            receivedCurrency: '-'
        }

        //type2 == metadata.method
        //type = PAYMENT_REQUEST | type2 = PAYMENT_LINK -- no data
        //type = CASH_OUT_TRANSACTION | type2 = THUNES_TRANSACTION -- no data
        //type = DYNAMIC_PAYMENT  --- no data
        //type = TOKEN_EXCHANGE   --- no data
        //type = P2P_TRANSFER     --- no data
        //type = CASH_OUT_TRANSACTION | type2 = CREDIT_CARD_TRANSACTION  ---- Envio a tarjeta
        /*
          metadata
            cardHolderName   :        "Darian Alvarez Tamayo"
            cardNumber       :        "9225959870121891"
            contactName      :        "Darian Alvarez Tamayo"
            contactPhone     :        "52552615"
        */
        //type = CASH_OUT_TRANSACTION |  type2 = DELIVERY_TRANSACTION  ---- Envio a casa
        /*
         metadata 
            contactName : "Darian Alvarez Tamayo"
            contactPhone : "52552615"
        */

        //type = CASH_OUT_TRANSACTION | type2 = DELIVERY_TRANSACTION_USD ---- Envio a casa USD
        /*
         metadata
            contactName : "Darian Alvarez Tamayo"
            contactPhone : "52552615"
        */

        //type = TOPUP_RECHARGE | type2 = DIRECT_TOPUP 
        /* 
          metadata 
              receiverName
            
        
        */

        //type = PAYMENT_REQUEST | type2 = DIRECT_TOPUP
        /**
          metadata 
            receiver_name : "Pepe Cuenca" 
          
         */



        if (type === 'CASH_OUT_TRANSACTION' && type2 === 'CREDIT_CARD_TRANSACTION') {
            otrosDatos.beneficiaryName = unDato.metadata.contactName ? unDato.metadata.contactName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.contactPhone ? unDato.metadata.contactPhone : '-';
            otrosDatos.beneficiaryCardNumber = unDato.metadata.cardNumber ? unDato.metadata.cardNumber : '-';
            otrosDatos.receivedAmount = unDato.metadata.deliveryAmount ? unDato.metadata.deliveryAmount : '-';
            otrosDatos.receivedCurrency = unDato.metadata.deliveryCurrency ? unDato.metadata.deliveryCurrency : '-'
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName + ' ' + unDato.metadata.senderLastName : '-';
            otrosDatos.senderName = senderName;
        } else if (type === 'CASH_OUT_TRANSACTION' && type2 === 'DELIVERY_TRANSACTION') {
            otrosDatos.beneficiaryName = unDato.metadata.contactName ? unDato.metadata.contactName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.contactPhone ? unDato.metadata.contactPhone : '-';
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName + ' ' + unDato.metadata.senderLastName : '-';
            otrosDatos.senderName = senderName;
            otrosDatos.receivedAmount = unDato.metadata.deliveryAmount ? unDato.metadata.deliveryAmount : '-';
            otrosDatos.receivedCurrency = unDato.metadata.deliveryCurrency ? unDato.metadata.deliveryCurrency : '-'
        } else if (type === 'CASH_OUT_TRANSACTION' && type2 === 'DELIVERY_TRANSACTION_USD') {
            otrosDatos.beneficiaryName = unDato.metadata.contactName ? unDato.metadata.contactName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.contactPhone ? unDato.metadata.contactPhone : '-';
        } else if (type === 'TOPUP_RECHARGE' && type2 === 'DIRECT_TOPUP') {
            otrosDatos.beneficiaryName = unDato.metadata.receiverName ? unDato.metadata.receiverName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.destination ? unDato.metadata.destination : '-';
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName : '-';
            otrosDatos.senderName = senderName;
            otrosDatos.receivedAmount = unDato.metadata.amount ? unDato.metadata.amount : '-';
        } else if (type === 'PAYMENT_REQUEST' && type2 === 'DIRECT_TOPUP') {
            otrosDatos.beneficiaryName = unDato.metadata.receiver_name ? unDato.metadata.receiver_name : '-';
        } else if (type === 'PAYMENT_REQUEST' && type2 === 'PAYMENT_LINK') {
            otrosDatos.beneficiaryName = unDato.metadata.cardHolderName ? unDato.metadata.cardHolderName : '-';
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName + ' ' + unDato.metadata.senderLastName : '-';
            otrosDatos.senderName = senderName;
        } else if (type === 'CASH_OUT_TRANSACTION' && type2 === 'THUNES_TRANSACTION') {
            otrosDatos.receivedAmount = unDato.metadata.destinationAmount ? unDato.metadata.destinationAmount : '-';
            otrosDatos.receivedCurrency = unDato.metadata.destinationCurrency ? unDato.metadata.destinationCurrency : '-';
        }






        return otrosDatos;








    }

    transformarRawDatos(raw_datos) {




        if (!raw_datos || !raw_datos.status) {
            return [];
        } else if (!(raw_datos.status != 200 || raw_datos.status != 201)) {
            return [];
        } else if (!raw_datos.data) {
            return [];
        }






        const raw_datos1 = raw_datos.data.data.map((unDato) => {



            //const fecha = new Date(unDato.createdAt).toLocaleDateString('en-US');
            const fecha = new Date(unDato.createdAt).
                toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })

            //const fecha2 = fecha.substring(0, 10) + " " + fecha.substring(11, 20);
            // console.log(fecha2)

            let type2 = '-';
            if (unDato.metadata) {
                type2 = !unDato.metadata.method ? "-" : unDato.metadata.method
            }


            let feeUSD = 0;
            if (unDato.metadata) {
                feeUSD = !unDato.metadata.feeAmount ? 0 : unDato.metadata.feeAmount
            }

            let feeUserCurr = 0;
            if (unDato.metadata) {
                feeUserCurr = !unDato.metadata.feeAmountInUserCurrency ? 0 : unDato.metadata.feeAmountInUserCurrency
            }

            let txAmount = 0;
            if (unDato.metadata) {

                let totalAmount = 0;
                if (unDato.metadata.totalAmount) {
                    totalAmount = !unDato.metadata.totalAmount ? 0 : unDato.metadata.totalAmount;
                } else {
                    totalAmount = unDato.transactionAmount;
                }

                let feeAmountInUserCurrency = 0
                if (unDato.metadata.feeAmountInUserCurrency) {
                    feeAmountInUserCurrency = !unDato.metadata.feeAmountInUserCurrency ? 0 : unDato.metadata.feeAmountInUserCurrency;
                }




                txAmount = totalAmount - feeAmountInUserCurrency;
            }

            let txtExternalID = '-'
            if (unDato.externalID) {
                txtExternalID = unDato.externalID;
            }

            //Poniendole nombre a las operaciones


            let userTypeObj = null;
            if (unDato.type === "MLC_PAYMENT_REQUEST") {
                userTypeObj = tipos_operaciones.filter((unTipo) => unTipo.type1.includes(unDato.type))[0];
            } else {

                userTypeObj = tipos_operaciones.filter((unTipo) => unTipo.type1.includes(unDato.type) && unTipo.type2.includes(type2))[0];
                //console.log(userTypeObj)        

            }

            const userTextType = userTypeObj ? userTypeObj.usertext : '-'
            const tipoOperacion = userTypeObj ? userTypeObj.cod_tipo : '-'


            const beneficiaryData = this.getBeneficiaryData(type2, unDato);
            //console.log(beneficiaryData)





            return {
                fecha_creada: fecha,
                type2: type2,
                feeusd: feeUSD,
                feeusercurr: feeUserCurr,
                ...unDato,
                ...beneficiaryData,
                transactionAmount: txAmount,
                userTextType: userTextType,
                tipoOperacion: tipoOperacion,
                externalID: txtExternalID
            }
        })





        //filtrando las operaciones
        //this.props.tipooperacion --- arreglo de tipos_operacion
        //ejemplp [1,2]

        console.log(this.props.tipooperacion)
        if (this.props.tipooperacion && this.props.tipooperacion.length > 0) {
            //console.log("filtro")
            //Filtrar solo para un tipo de operacion
            //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))



            return raw_datos1.filter((unaOperacion) => {

                return this.props.tipooperacion.includes(unaOperacion.tipoOperacion)

            }


                /*(unaOperacion) => {

                    console.log(unaOperacion)

                    if (this.tipos_operacion.type2 && this.tipos_operacion.type2.length > 0) {
                        return (this.tipos_operacion.type1.includes(unaOperacion.type) && this.tipos_operacion.type2.includes(unaOperacion.type2));
                    } else {
                        return (this.tipos_operacion.type1.includes(unaOperacion.type))
                    }
                }*/
            )
        } else {
            //mostrar todas las operaciones de la wallet

            return raw_datos1;
        }

    }


    actualizarDatos = async (datos) => {

        if (this.tabla) {

            this.tabla.clear();
            this.tabla.rows.add(datos);
            this.tabla.draw();
        }


    }

    //se le pasa de parametro un string con el nombre de la columna y el tipo de vista
    // devuelve
    // objeto donde cada elemento indica si se muestra o no la columna correspondiente
    // true -- mostrar  | false -- no mostrar
    mostrarColumnas = async (tipoVista) => {

        console.log("Tipo de vista")
        console.log(tipoVista);

        let showCol = {
            transactionID: true,
            userTextType: true,
            transactionStatus: true,
            transactionAmount: true,
            feeusercurr: true,
            currency: true,
            createdAt: true,
            beneficiaryName: true,
            beneficiaryPhone: true,
            beneficiaryCardNumber: true,
            senderName: true,
            receivedAmount: true,
            receivedCurrency: true,
            type: true,
            type2: true,
            externalID: true,
        }


        switch (tipoVista) {
            case 'SEND_MONEY':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.beneficiaryCardNumber = false;

                break;

            case 'SEND_MONEY_CUBA':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;

                break;

            case 'HOME_DELIVERY':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.beneficiaryCardNumber = false;

                break;

            case 'PHONE_RECHARGE':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.beneficiaryCardNumber = false;

                break;

            default:
                break;
        }




        return showCol;
    }

    resetRange() {
        this.minDateFiltro.val(null);
        this.maxDateFiltro.val(null);
        this.tabla.draw();

    }

    onChangeType(value) {

        console.log(value.target.value)
        this.tipoOperacionFiltro = value.target.value;
        this.tabla.draw();
    }


}


