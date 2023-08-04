const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API } from "../utils.js";





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

    total_tx_a_solicitar = 30;







    static template = xml`  

    <div class="container-fluid no-padding">
    <div>TX List:</div>
    <button id="getdata-btn" class="other-btn" t-on-click="get_data">Refresh Data </button>
        <div class="row tx-container">
            <div class="col">
                <table  id="container-listtr" class="table table-striped table-bordered  table-responsive dataTable_width_auto display" style="width:100%" >
                    <thead>
                        <tr>
                            <th>Created</th>
                            <th>Transaction Status</th>
                            <th>Transaction Amount</th>
                            
                            <th>Currency</th>
                            <th>Type</th>
                            <th>Type2</th>
                            <th>Transaction ID</th>
                           
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
   
  `;


    async get_data() {
        console.log("Iniciar button");
        this.datos = await getTrData(this.total_tx_a_solicitar);
        console.log("fin");
    }


    //TODO: Formatear la fecha
    //TODO: Formatear el importe

    setup()  {


        const accessToken = API.getTokenFromSessionStorage();
        if (!accessToken) { return }

        this.api = new API(accessToken);


        const walletAddress = window.sessionStorage.getItem('walletAddress');
        const userId = window.sessionStorage.getItem('userId');


        const query = {
            token: accessToken
        }



        // -----   Creando el socket  ------------------------------------------------
        this.socket =  io(API.baseSocketURL, {
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

            //console.log(raw_datos)

            if (!raw_datos) { return }

            this.datos = await this.transformarRawDatos(raw_datos);




            // console.log("Operacion")
            // console.log(this.datos[0])







        });

        onMounted(async () => {
            // do something here





            //CCreando la tabla
            this.tabla = $('#container-listtr').DataTable({
                data: this.datos,
                columns: [
                    { data: 'createdAt' },
                    { data: 'transactionStatus' },
                    { data: 'transactionAmount' },

                    { data: 'currency' },
                    { data: 'type' },
                    { data: 'type2' },
                    { data: 'transactionID' },

                ],
                "pageLength": 10,
                order: [[0, 'desc']],
                select: true
            });


            //console.log(this.tabla)


            this.tabla.on('select', (e, dt, type, indexes) => {
                if (type === 'row') {
                    if ( this.props.onChangeSelectedTX) {
                       this.props.onChangeSelectedTX(this.tabla.rows(indexes).data()[0])
                    }
                }
            });
        });


        onRendered(async () => {

        });

    }

    async get_data() {
        /*  console.log("Iniciar button");
          this.datos = await getTrData(this.total_tx_a_solicitar);
      
          this.grid.config.plugin.remove("pagination");
          this.grid.config.plugin.remove("search");
          
      
          this.grid.updateConfig({
            search: true,
            pagination: true,
            data: this.datos
          }).forceRender();*/


        console.log("fin");
    }


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

            return {
                fecha_creada: fecha,
                type2: type2,
                ...unDato
            }
        })


        
        if (this.props.tipooperacion) {
            //Filtrar solo para un tipo de operacion
            //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))
            return  raw_datos1.filter((unaOperacion) => (unaOperacion.type2 == this.props.tipooperacion))
        } else {
             //mostrar todas las operaciones de la wallet
            return  raw_datos1;
        }

    }


    actualizarDatos = async(datos)=>{

        this.tabla.clear();
        this.tabla.rows.add(datos);
        this.tabla.draw();

/*
        this.tabla.updateConfig({
            search: true,
            pagination: true,
            data: datos
          }).forceRender();*/
    }




}


