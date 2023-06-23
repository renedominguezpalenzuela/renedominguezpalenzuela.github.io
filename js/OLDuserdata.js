const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import useStore from "./store.js";
import { getBalance, baseSocketURL } from "./utils.js";
import { Menu } from "./components/menu.js";



class Root extends Component {

    balance = useState({
        saldos: []
    });

    socket = null;
    subscriptionPath = "/api/subscription";

    static components = { Menu };

    static template = xml`  
    <Menu/>
    <div class="ml-5">Account Balance:</div>
    <button id="getdata-btn" class="other-btn ml-5" t-on-click="get_data_btn">Refresh Data </button>
    <div class="p-2 bg-[#4F50E9] mt-2 ml-5 text-[#ffffff] w-[17vw] ">
        <t t-foreach="balance.saldos" t-as="undato" t-key="undato.currency">                
           <div class="flex flex-row  ">
                <div class="w-[10vw] ml-1"> <t t-esc="undato.currency"/></div> 
                <div  class="w-[5vw]  text-end"> <t t-esc="undato.amount"/></div> 
           
           </div>
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
        let datos = await getBalance();
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
        const accessToken = window.sessionStorage.getItem('accessToken');
        const walletAddress = window.sessionStorage.getItem('walletAddress');
        const userId = window.sessionStorage.getItem('userId');
        const subscriptionPath = "/api/subscription";

        const query = {
            token: accessToken
        }

        //inicializando el socket
        this.socket = io(baseSocketURL, {
            path: subscriptionPath,
            query: query,
        });

        this.socket.on("connect", (datos) => {
            console.log("Socket conectado correctamente");
            console.log("socket id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx
            //console.log(datos)
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
                this.balance.saldos = await this.get_data(false);
                console.log(JSON.stringify(this.balance));
            }
        });

        onWillStart(async () => {
            this.balance.saldos = await this.get_data(false);
            console.log(JSON.stringify(this.balance));


        });
    }

}

mount(Root, document.body);