


const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { API } from "../utils.js";

export class Balance extends Component {


  socketActivo = false;


  balance = useState({
    saldos: []
  });

  socket = null;
  subscriptionPath = "/api/subscription";


  static template = xml`  


    <div class=" bg-[#4F50E9] p-2 mt-1  text-[#ffffff]  rounded-md">
       <t t-if="balance.saldos">
        <t t-foreach="balance.saldos" t-as="undato" t-key="undato.currency">                
          <div class="flex flex-row  ">
                <div class="w-[30%] "> <t t-esc="undato.currency"/></div> 
                <div  class="w-[60%]  text-end"> <t t-esc="undato.amount"/></div> 
          
          </div>
        </t>
       </t> 
    </div>
`;

  async get_data_btn() {
    this.get_data(true).then((datos_saldos) => {
      console.log(JSON.stringify(datos_saldos));
      this.balance.saldos = datos_saldos;
    });
  }

  async get_data(update) {

    if (!this.socketActivo) return; 

    const accessToken = window.sessionStorage.getItem('accessToken');
    const walletAddress = window.sessionStorage.getItem('walletAddress');

    const api = new API(accessToken);
    let datos = await api.getBalance(walletAddress);
    console.log(datos)

    if (update) {
      datos.balance.map((unDato, i) => {
        if (unDato.currency == "USD") {
          let n = (Math.floor(Math.random() * 10) + 1) * 100
          datos.balance[i].amount = parseFloat(datos.balance[i].amount) + n;
        }
      })
    }

    return datos.balance;
  }



  setup() {
    if (!this.socketActivo) return; 

    const accessToken = window.sessionStorage.getItem('accessToken');

    const walletAddress = window.sessionStorage.getItem('walletAddress');
    const userId = window.sessionStorage.getItem('userId');
    const subscriptionPath = "/api/subscription";

   



    const query = {
      token: accessToken
    }

    this.socket = io(API.baseSocketURL, {
      path: subscriptionPath,
      query: query,
    });


    this.socket.on("connect", (datos) => {
      console.log("Socket conectado correctamente");
      console.log("socket id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx

      // this.socket.emit('subscribe', ['TRANSACTIONS']); //recibe todas las transacciones ok
      this.socket.emit('subscribe', [`TRANSACTION_${walletAddress}`]);
    });


    this.socket.on('reconnect', () => {
      console.log('Socket RE conectado ', this.socket.connected);
    });

    this.socket.on('error', (error) => {
      console.log('ERROR: _testSocket', {
        event: 'error',
        data: error
      });
    });

    this.socket.on('TRANSACTION_UPDATE', async (data) => {
      console.log('TRANSACTION_UPDATE datos servidor2', data);
      console.log('TR Status ' + data.transactionStatus);
      if (data.transactionStatus == "confirmed") {
        this.balance.saldos = await this.get_data(true);
        console.log(JSON.stringify(this.balance));
      }
    });


    onWillStart(async () => {

      if (!this.socketActivo) return; 

      this.balance.saldos = await this.get_data(false);
      console.log(JSON.stringify(this.balance));







    });

    onMounted(async () => {


    });
  }
}