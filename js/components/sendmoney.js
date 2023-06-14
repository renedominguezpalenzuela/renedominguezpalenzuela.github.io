const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";




export class SendMoney extends Component {



  inputAvatar = useRef("inputAvatar");

  inputSendRef = useRef("inputSendRef");
  inputReceiveRef = useRef("inputReceiveRef");


  state = useState({
    firstName:"Rene",
    lastName:"Dominguez",
    avatar:"/img/photo-1534528741775-53994a69daeb.jpg",
    address:"",
    nameFull:"",
    sendValue:0,
    receiveValue:0
  })



  static template = xml`    
    <div class="grid sm:grid-cols-[34%_64%] gap-2">
      <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
        <div class="card-title flex flex-col rounded-lg">
           

          

          
        </div>

        



        <div class="card-body items-center  ">

            <div class="form-control  max-w-xs  ">
                <label class="label">
                  <span class="label-text">You Send</span>  
                </label> 

                <div class="join">

                  <div>
                    <input type="number" t-ref="inputSendRef" t-on-input="onChangeSendInput"  t-att-value="state.sendValue" step="0.01" min="-9999999999.99" max="9999999999.99" class="input input-bordered join-item text-right" placeholder="0.00"/>
                    <label class="label">
                      <span class="label-text-alt"></span>
                      <span class="label-text-alt ">
                        <div class=" text-right">
                          Send Fee: 0.00 USD
                        </div>  
                        <div class=" text-right">  
                          Conversion Rate: 0.00 USD
                        </div>
                      </span>
                    </label>
                  </div>


                  <select class="select select-bordered join-item">
                    <option t-att-disabled="true">Currency</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>CAD</option>
                    
                  </select>
                
                </div>
              </div>



              <div class="form-control  max-w-xs   ">
              <label class="label">
                <span class="label-text">Received Amount</span>  
              </label> 

              <div class="join">

                <div>
              
                  <input type="number" t-ref="inputReceiveRef" t-on-input="onChangeReceiveInput" t-att-value="state.receiveValue"  step="0.01" min="-9999999999.99" max="9999999999.99" class="input input-bordered join-item text-right" placeholder="0.00"/>
              
                </div>


                <select class="select select-bordered join-item">
                  <option t-att-disabled="true">Currency</option>
                  <option>CUP</option>
                  <option>USD</option>
                </select>

              </div>
            </div>


        
        
          <div class="card-actions">
            
          </div>
        </div>
      </div>

      <button class="btn btn-primary mt-2 row-start-2 w-[30%]" t-on-click="onSafeAllData">Send</button>



    
    </div>
      

      



        
     
    

  `;



  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');
  
    
    onWillStart(async () => {
       const accessToken = window.localStorage.getItem('accessToken');
       const api = new API(accessToken);
       const userData = await api.getUserProfile();
       console.log(userData);
       this.state = {...userData};
      
    });
  }


  
   debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  onSafeAllData() {
    Swal.fire('Not implemented yet,  more details about data is needed');
  }


   onChangeReceiveInput= this.debounce( async ()=> {
    console.log("Cambio 1")
    this.inputSendRef.el.value = this.inputReceiveRef.el.value   ;
    
   
  }, 1000);

  onChangeSendInput= this.debounce(async ()=> {
    console.log("Cambio 2")
    this.inputReceiveRef.el.value =  this.inputSendRef.el.value;
  }, 1000);


  

}

