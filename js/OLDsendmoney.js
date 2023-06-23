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

    <ul class="steps steps-vertical lg:steps-horizontal">
      <li class="step step-primary">Register</li>
      <li class="step step-primary">Choose plan</li>
      <li class="step">Purchase</li>
      <li class="step">Receive Product</li>
    </ul>

    <div class="grid grid-cols-2 h-[30rem] place-items-center border mt-2">
    <div class="card w-96 bg-base-100 shadow-xl">
      <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
      <div class="card-body">
      <h2 class="card-title">Shoes!</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">Buy Now</button>
      </div>
      </div>
    </div>
    

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
        const accessToken = window.sessionStorage.getItem('accessToken');
        const walletAddress = window.sessionStorage.getItem('walletAddress');
        const userId = window.sessionStorage.getItem('userId');


        onWillStart(async () => {
            console.log("DDDD");
            // this.balance.saldos = await this.get_data(false);
            // console.log(JSON.stringify(this.balance));


        });
    }

}

mount(Root, document.body);