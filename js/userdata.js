const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import useStore from "./store";
import { getBalance } from "./utils";




class Root extends Component {



    balance = useState({
        saldos: []
    });





    static template = xml`  
    <div class="container-fluid no-padding">
    <div>Account Balance:</div>
    <button id="getdata-btn" class="other-btn" t-on-click="get_data_btn">Refresh Data </button>
    <div class="row tx-container">
        <t t-foreach="balance.saldos" t-as="undato" t-key="undato.currency">                
           <t t-esc="undato.currency"/>
           <t t-esc="undato.amount"/>
           <br/>
        </t>
    </div>

   
    </div>
  `;


    async get_data_btn() {
        this.get_data().then((datos_saldos) => {
            console.log(JSON.stringify(datos_saldos));
            this.balance.saldos = datos_saldos;
            this.render();
        });
    }

    async get_data() {
        const datos = await getBalance();
        return datos.balance;
    }

    setup() {
        onWillStart(async () => {
            this.balance.saldos = await this.get_data();
            console.log(JSON.stringify(this.balance));
        });
    }

}

mount(Root, document.body);