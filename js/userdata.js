const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import useStore from "./store";
import { getBalance } from "./utils";




class Root extends Component {



    balance = useState({
        saldos: []
    });





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