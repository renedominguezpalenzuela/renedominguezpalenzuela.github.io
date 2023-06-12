const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";




export class SendMoney extends Component {



  inputAvatar = useRef("inputAvatar");


  state = useState({
    firstName:"Rene",
    lastName:"Dominguez",
    avatar:"/img/photo-1534528741775-53994a69daeb.jpg",
    address:"",
    nameFull:""
  })

  static template = xml`    
    <div class="grid sm:grid-cols-[34%_64%] gap-2">
      <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
        <div class="card-title flex flex-col rounded-lg">
           

          

          
        </div>

        



        <div class="card-body items-center ">

        <div class="form-control  max-w-xs  ">
            <label class="label">
              <span class="label-text">You Send</span>  
            </label> 

            <div class="join">

              <div>
                <input class="input input-bordered join-item text-right" placeholder="0.00"/>
              </div>


              <select class="select select-bordered join-item">
                <option>Currency</option>
                <option>USD</option>
                <option>EUR</option>
                <option>CAD</option>
              </select>

            </div>
          </div>



          <div class="form-control  max-w-xs  ">
          <label class="label">
            <span class="label-text">Amount Received</span>  
          </label> 

          <div class="join">

            <div>
              <input class="input input-bordered join-item text-right" placeholder="0.00"/>
            </div>


            <select class="select select-bordered join-item">
              <option>Currency</option>
              <option>USD</option>
              <option>EUR</option>
              <option>CUP</option>
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
       this.state = {...userData};
      
    });
  }


  
 
  onSafeAllData() {
    Swal.fire('Not implemented yet,  more details about data is needed');
  }


  

}

