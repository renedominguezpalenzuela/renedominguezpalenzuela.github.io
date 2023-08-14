const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API } from "../utils.js";
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
    <thead class="bg-[#3750D1]">
        <tr>
                <th data-priority="1">Transaction ID</th>    
                <th>UserType</th>
                <th >Type</th>
                <th>Type2</th>
               
                <th>Status</th>
            
            
                <th data-priority="2">Amount</th>
                <th data-priority="2">Fee</th>
            
                <th data-priority="3" >Currency</th>
                <th >Created</th>    
                <th >Fee (USD)</th>   
                
           
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

        
        if ((this.props.tipooperacion) && (this.props.tipooperacion!=0)) {
            this.tipos_operacion = tipos_operaciones.filter((una_operacion)=>una_operacion.cod_tipo===this.props.tipooperacion)[0]
         
           
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

            console.log(raw_datos)

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

          

            console.log("Tipo operacion a filtrar")
            console.log(this.props.tipooperacion)


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



            //CCreando la tabla
            this.tabla = $(tableId).DataTable({
                data: this.datos,
                columns: [
                    { data: 'transactionID', width: '8%' },
                    { data: 'userTextType', width: '5%' },
                    { data: 'type', width: '15%' },
                    { data: 'type2', width: '17%' },
                    

                    { data: 'transactionStatus', width: '3%' },
                    { data: 'transactionAmount', width: '3%' },

                    { data: 'feeusercurr', width: '3%' },
                    //{ data: 'transactionAmount', width: '3%'  },

                    { data: 'currency', width: '5%' },
                    { data: 'createdAt', width: '13%' },
                    { data: 'feeusd', width: '13%' },




                ],
                autoWidth: false,
                "pageLength": 10,
                order: [[0, 'desc']],
                select: true,
                responsive: true,
                destroy: true,
                //footer: false


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

    /*async get_data() {
          console.log("Iniciar button");
          this.datos = await getTrData(this.total_tx_a_solicitar);
      
          this.grid.config.plugin.remove("pagination");
          this.grid.config.plugin.remove("search");
          
      
          this.grid.updateConfig({
            search: true,
            pagination: true,
            data: this.datos
          }).forceRender();


        console.log("fin");
    }*/


    transformarRawDatos(raw_datos) {

        const raw_datos1 = raw_datos.map((unDato) => {



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

            let userTextTypeObj = tipos_operaciones.filter((unTipo)=>(unTipo.type1.includes(unDato.type) && unTipo.type2.includes(type2) ))[0];
            console.log('userTextyp')
            
            let userTextType='';
            if (userTextTypeObj) {
                //console.log(userTextTypeObj)
                userTextType = userTextTypeObj.usertext;

            }



            // console.log(unDato)

            return {
                fecha_creada: fecha,
                type2: type2,
                feeusd: feeUSD,
                feeusercurr: feeUserCurr,
                ...unDato,
                transactionAmount: txAmount,
                userTextType: userTextType
            }
        })

       


        if (this.props.tipooperacion) {
            console.log("filtro")
            //Filtrar solo para un tipo de operacion
            //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))

            
            //console.log('Datos filtrador')
            //console.log(d)
            return  raw_datos1.filter(
                (unaOperacion) => {                                       
                    return (this.tipos_operacion.type1.includes(unaOperacion.type) && this.tipos_operacion.type2.includes(unaOperacion.type2) );                                                       
                }          
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

        /*
                this.tabla.updateConfig({
                    search: true,
                    pagination: true,
                    data: datos
                  }).forceRender();*/
    }




}


