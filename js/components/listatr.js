const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API, UImanager } from "../utils.js";
import { tipos_operaciones } from "../../data/tipos_operacion.js";





export class ListaTR extends Component {


    //static props = ["tipooperacion"];

    datos = null;
    //grid = null;
    tabla = null;

    //Variables para el socket
    socketActivo = true;
    socket = null;
    subscriptionPath = "/api/subscription";

    balance = useState({
        saldos: []
    });

    total_tx_a_solicitar = 130;










    static template = xml`  

    
    <table  id="container-listtr" class="display nowrap " style="width:100%" >
    <thead class="bg-[#3750D1] text-[#FFFFFF] text-[1.05rem]">
        <tr>
                <th data-priority="1">Transaction ID</th>    
                <th>UserType</th>
                
               
                <th class="centrar">Status</th>
            
            
                <th data-priority="2">Amount <br/> (No fee)</th>
                <th data-priority="2">Fee <br/> </th>
            
                <th data-priority="3" >Curr.</th>
                <th class="centrar">Created <br/> (yyyy/mm/dd) </th>    
                <th class="centrar">Fee <br/> (USD)</th>   
              
                <th >Type</th>
                <th>Type2</th> 
                <th>External ID</th>
                
           
        </tr>
    </thead>
</table>



   
  `;

    /*
        async get_data() {
            console.log("Iniciar button");
            this.datos = await getTrData(this.total_tx_a_solicitar);
            console.log("fin");
        }*/


    //TODO: Formatear la fecha
    //TODO: Formatear el importe

    setup() {


        const accessToken = API.getTokenFromlocalStorage();
        if (!accessToken) { return }

        this.api = new API(accessToken);


        const walletAddress = window.localStorage.getItem('walletAddress');
        const userId = window.localStorage.getItem('userId');


        const query = {
            token: accessToken
        }


        if ((this.props.tipooperacion) && (this.props.tipooperacion != 0)) {
            this.tipos_operacion = tipos_operaciones.filter((una_operacion) => una_operacion.cod_tipo === this.props.tipooperacion)[0]



        }





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





            if (!raw_datos) { return }

            //console.log(raw_datos)

            this.datos = await this.transformarRawDatos(raw_datos);
            this.actualizarDatos(this.datos);







            //this.tabla.config.plugin.remove("pagination");
            //this.tabla.config.plugin.remove("search");





            /*if (data.transactionStatus == "confirmed") {
              const saldos = await this.get_data(true);
              if (saldos) {
                this.balance.saldos = saldos;
                console.log(JSON.stringify(this.balance));
              }
            }*/
        });




        onWillStart(async () => {
            console.log("Solicitando lista de TX al servidor")

            const raw_datos = await this.api.getTrData(this.total_tx_a_solicitar);
            console.log("lista de TX recibidas")



            //console.log("Tipo operacion a filtrar")
            //console.log(this.props.tipooperacion)


            if (!raw_datos) { return }

            this.datos = await this.transformarRawDatos(raw_datos);




            // console.log("Operacion")
            // console.log(this.datos[0])







        });

        onMounted(async () => {
            // do something here


            var tableId = "#container-listtr";


            if (!this.tabla) {
                //$('#container-listtr').DataTable().clear().destroy();

                // this.tabla.clear();
                //this.tabla.destroy();
                //2nd empty html
                // $(tableId + " tbody").empty();  //LIMPIA EL CUERPO
                // $(tableId + " thead").empty(); //LIMPIA EL HEADER
                $(tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?


            }


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
            this.tabla = $(tableId).DataTable({
                data: this.datos,
                columns: [
                    { data: 'transactionID', width: '12%' },
                    { data: 'userTextType', width: '14%' },



                    {
                        data: 'transactionStatus', width: '8%',
                        render: function (data, type, row) {
                            let color = colorStatus(data)
                            return `<span class="state" style="background-color:${color};"> ${data} </span>`;
                        }
                    },
                    {
                        data: 'transactionAmount', width: '7%',className:"amount-value",
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        }

                    },

                    {
                        data: 'feeusercurr', width: '3%',className:"amount-value",
                        render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="amount-value" > ${valor} </span>`;
                        }
                    },

                    { data: 'currency', width: '5%', className:"centrar" },
                    {
                        data: 'createdAt', width: '13%',
                        render: function (data, type, row) {


                            //const options = { year: 'numeric', month: 'long', day: 'numeric' };

                            const fecha = new Date(data);
                            return format(fecha)
                            //fecha.toLocaleTimeString('en-EN', options)
                            //event.toLocaleDateString(undefined, options)
                            //moment(data).format("MM/DD/YYYY");
                        },
                    },
                    {
                        data: 'feeusd', width: '4%', className:"amount-value",
                            render: function (data, type, row) {
                            let valor = UImanager.roundDec(data);
                            return `<span class="" > ${valor} </span>`;
                        }
                    },
                    { data: 'type', width: '15%' },
                    { data: 'type2', width: '15%' },
                    { data: 'externalID', width: '13%' },






                ],
                autoWidth: false,
                "pageLength": 10,
                order: [[0, 'desc']],
                select: true,
                responsive: true,
                destroy: true,
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


            this.tabla.on('select', (e, dt, type, indexes) => {
                if (type === 'row') {
                    if (this.props.onChangeSelectedTX) {
                        this.props.onChangeSelectedTX(this.tabla.rows(indexes).data()[0])
                    }
                }
            });
        });


        onRendered(async () => {

        });

    }



    transformarRawDatos(raw_datos) {


        //se busca el nombre de la operacoin
        //this.props.tipooperacion
        //let userTextTypeObj = tipos_operaciones.filter((unTipo) => unTipo.cod_tipo === this.props.tipooperacion)[0];

        /*this.userTextType = '';
        if (userTextTypeObj) {
            //console.log(userTextTypeObj)
            this.userTextType = userTextTypeObj.usertext;

        }*/


        const raw_datos1 = raw_datos.map((unDato) => {

            // console.log(unDato)



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





            return {
                fecha_creada: fecha,
                type2: type2,
                feeusd: feeUSD,
                feeusercurr: feeUserCurr,
                ...unDato,
                transactionAmount: txAmount,
                userTextType: userTextType,
                tipoOperacion: tipoOperacion,
                externalID: txtExternalID
            }
        })





        //filtrando las operaciones
        //this.props.tipooperacion --- arreglo de tipos_operacion
        //ejemplp [1,2]
        if (this.props.tipooperacion) {
            //console.log("filtro")
            //Filtrar solo para un tipo de operacion
            //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))



            return raw_datos1.filter(
                (unaOperacion) => {

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




}


