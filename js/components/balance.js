

//
const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { API } from "../utils.js";

export class Balance extends Component {




  socketActivo = true;


  balance = useState({
    saldos: []
  });

  socket = null;
  subscriptionPath = "/api/subscription";


  static template = xml`  


    <div class=" tw-bg-[#4F50E9] tw-p-2 tw-mt-1  tw-text-[#ffffff]  tw-rounded-md">
       <t t-if="balance.saldos">
        <t t-foreach="balance.saldos" t-as="undato" t-key="undato.currency">                
          <div class="tw-flex tw-flex-row  ">
                <div class="tw-w-[30%] "> <t t-esc="undato.currency"/></div> 
                <div  class="tw-w-[60%]  text-end"> <t t-esc="undato.amount"/></div> 
          
          </div>
        </t>
       </t> 
    </div>
`;

  async get_data_btn() {
    this.get_data(true).then((datos_saldos) => {
      //console.log(JSON.stringify(datos_saldos));
      this.balance.saldos = datos_saldos;
    });
  }

  async get_data(update) {

    if (!this.socketActivo) return;

    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');

    const api = new API(accessToken);
    let datos = await api.getBalance(walletAddress);
    // console.log(datos)
    if (datos) {
      if (update) {
        datos.balance.map((unDato, i) => {
          if (unDato.currency == "USD") {
            let n = (Math.floor(Math.random() * 10) + 1) * 100
            datos.balance[i].amount = parseFloat(datos.balance[i].amount) + n;
          }
        })
      }

      return datos.balance;
    } else {
      return null
    }
  }


  static props = ["urlHome"];

  static defaultProps = {
    urlHome: '/',
  };



  setup() {
    if (!this.socketActivo) return;

    const accessToken = window.localStorage.getItem('accessToken');


    if (!accessToken) { return }

    /*if (!accessToken) {
      console.error("NO ACCESS TOKEN - Balance")
      window.location.assign(API.redirectURLLogin);
      return;
    }*/

    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');
    const subscriptionPath = "/api/subscription";









    const query = {
      token: accessToken
    }



    //Inicializando 
    onWillStart(async () => {

      if (!this.socketActivo) return;







    });

    onMounted(async () => {




      // -----   Creando el socket  ------------------------------------------------
      this.socket = io(API.baseSocketURL, {
        path: subscriptionPath,
        query: query,
      });





      // ----- Socket conectado  ---------------------------------------------------
      this.socket.on("connect", (datos) => {
        //console.log("Socket Balance conectado correctamente");
        //console.log("socket Balance id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx

        // this.socket.emit('subscribe', ['TRANSACTIONS']); //recibe todas las transacciones ok
        //Creando subscripcion a todas las transacciones de la wallet
        this.socket.emit('subscribe', [`TRANSACTION_${walletAddress}`]);
      });

      // ----- Socket ReConectado  --------------------------------------------------- 
      this.socket.on('reconnect', () => {
        console.log('Socket Balance RE conectado ', this.socket.connected);
      });

      // ----- Si ocurre algun error --------------------------------------------------
      this.socket.on('error', (error) => {
        console.log('Socket Balance ERROR', {
          event: 'error',
          data: error
        });
      });


      // ----- Si recibe mensaje del tipo  TRANSACTION_UPDATE --------------------------------------------------
      this.socket.on('TRANSACTION_UPDATE', async (data) => {
        //console.log('TRANSACTION_UPDATE Socket Balance recibiendo datos servidor', data);
        //console.log('TR Status Socket Balance  ' + data.transactionStatus);
        if (data.transactionStatus == "confirmed") {
          const saldos = await this.get_data(true);
          if (saldos) {
            this.balance.saldos = saldos;
            //console.log(JSON.stringify(this.balance));
          }
        }
      });




      //console.log("Solicitando Balance al servidor")

      const saldos = await this.get_data(false);


      console.log("Balance recibido servidor")

      if (saldos) {
        this.balance.saldos = saldos;
        console.log(JSON.stringify(this.balance));
      }





    });
  }
}