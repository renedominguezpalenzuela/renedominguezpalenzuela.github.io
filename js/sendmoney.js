const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";




class Root extends Component {
    static components = { Menu };

    balance = useState({
        saldos: []
    });

    socket = null;
    subscriptionPath = "/api/subscription";
   

    static template = xml`  
    <Menu/>

    <div class="grid grid-cols-2 h-[30rem] place-items-center border mt-2">
    

    <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
    <button class="btn btn-primary bg-[red]">Button</button>

    </div>
    
    
  



   
  

 

    


      
   
  `;

    async get_data_btn() {
        this.get_data(true).then((datos_saldos) => {
            console.log(JSON.stringify(datos_saldos));
            this.balance.saldos = datos_saldos;
        });
    }

    // async get_data(update) {
    //     let datos = await getBalance();
    //     if (update) {
    //         datos.balance.map((unDato, i) => {
    //             if (unDato.currency == "USD") {
    //                 let n = (Math.floor(Math.random() * 10) + 1) * 100
    //                 datos.balance[i].amount = parseFloat(datos.balance[i].amount) + n;
    //             }
    //         })
    //     }

    //     return datos.balance;
    // }



    setup() {
        const accessToken = window.localStorage.getItem('accessToken');
        const walletAddress = window.localStorage.getItem('walletAddress');
        const userId = window.localStorage.getItem('userId');


        onWillStart(async () => {
            console.log("DDDD");
            // this.balance.saldos = await this.get_data(false);
            // console.log(JSON.stringify(this.balance));


        });
    }

}

mount(Root, document.body);