const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import useStore from "./store";
import { getBalance, baseSocketURL } from "./utils";











class Root extends Component {



    balance = useState({
        saldos: []
    });

    socket = null;
    subscriptionPath = "/api/subscription";
    // transports: ['websocket'],
    // transport:'polling'





    static template = xml`  
   
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
            // this.render();
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

        // console.log(datos.balance);
        return datos.balance;
    }

    setup() {

        // setInterval(async () => {
        //     this.balance.saldos = await this.get_data(true);
        // }, 5000);

        const accessToken = window.localStorage.getItem('accessToken');
        const walletAddress = window.localStorage.getItem('walletAddress');
        //TRANSACTION_0x0F673BAF2C67eb6165CC526df5386032d653fbB5
        const userId = window.localStorage.getItem('userId');
        const subscriptionPath = "/api/subscription";
        // const roomName = `TRANSACTION_${walletAddress}`;
        //const roomName = {entity: `TRANSACTION_${walletAddress}`};
        const roomName = {entity: `TRANSACTION_${userId}`};
       // const roomName = { entity: 'TRANSACTIONS'};

        console.log(roomName);
        const query = {
            token: accessToken,
             roomName: roomName,
        }

        //inicializando el socket
        this.socket = io(baseSocketURL, {
            path: subscriptionPath,
            query: query,
        });


        this.socket.on("connect", () => {
            console.log("Socket conectado correctamente");
            console.log("socket id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx


            //this.socket.join(roomName);

            this.socket.emit("subscribe", roomName);

            this.socket.on('TRANSACTION_CREATED', async function (datos_servidor) {
                console.log('TRANSACTION_CREATED datos servidor1', datos_servidor);
                this.balance.saldos = await this.get_data(false);
                console.log(JSON.stringify(this.balance));
            });

            this.socket.on('TRANSACTION_UPDATE', async function (datos_servidor) {
                console.log('TRANSACTION_UPDATE datos servidor1', datos_servidor);
                this.balance.saldos = await this.get_data(false);
                console.log(JSON.stringify(this.balance));
            });

            //cualquier usario que se conecte al servidor es detectado por este evento
            this.socket.on('USER-CONNECTED', function (datos_servidor) {
                console.log('USER-CONNECTED datos servidor1', datos_servidor);
            });

        });


        this.socket.on('reconnect', () => {
            //Your Code Here
            console.log('Socket RE conectado ', this.socket.connected);
        });





        onWillStart(async () => {
            this.balance.saldos = await this.get_data(false);
            console.log(JSON.stringify(this.balance));

           


            
        });
    }



}

mount(Root, document.body);