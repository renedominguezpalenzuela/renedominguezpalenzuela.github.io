const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./menu.js";
import { LeftMenu } from "./leftmenu.js";
import { API } from "../utils.js";




export class Profile extends Component {

  // /api/private/users


  inputAvatar = useRef("inputAvatar");


  state = useState({
    firstName:"Rene",
    lastName:"Dominguez",
    avatar:"/img/photo-1534528741775-53994a69daeb.jpg",
    address:"",
    nameFull:""
  })

  static template = xml`    
    <div>
      <div class="card sm:w-[30vw] w-full bg-base-100 shadow-xl rounded-lg">
        <div class="card-title flex flex-col rounded-lg">
            <div class="px-10 pt-10 ">
                <t t-if="this.state.avatar">
                  <div class="avatar">
                    <div class="w-24 mask mask-squircle">                
                        <img t-att-src="this.state.avatar" />
                    </div>
                  </div>  
                </t>
                
                <t t-else="">
                  <div class="avatar placeholder">
                    <div class="bg-neutral-focus text-neutral-content rounded-full w-24">
                      <span class="text-3xl">?</span>
                    </div>
                  </div>
                </t>

            </div>

            <div class="form-control  max-w-xs  ">
              <label class="label">
                <span class="label-text">Pick a file</span>  
              </label>       
                <input t-on-input="onChangeAvatarInput" t-ref="inputAvatar"  type="file" class="file-input file-input-sm file-input-bordered w-full max-w-xs"  accept="image/jpeg, image/png, image/jpg"/>            
            </div>
        </div>

        



        <div class="card-body items-center ">
        <div class="flex flex-row ">
          <div class="form-control w-full max-w-xs ">
        
              <label class="label">
                <span class="label-text">First Name</span>
              </label>
              <input type="text" t-att-value="this.state.firstName" placeholder="First Name" class="input input-bordered w-full max-w-xs"  /> 
        
          </div>

          <div class="form-control w-full max-w-xs pl-1">
        
              <label class="label">
                <span class="label-text">Last Name</span>
              </label>
              <input type="text" t-att-value="this.state.lastName" placeholder="Last Name" class="input input-bordered w-full max-w-xs"  />   
          
          </div>
        </div>  
        
          <div class="card-actions">
            <button class="btn btn-primary" t-on-click="onSafeAllData">Save</button>
          </div>
        </div>
      </div>
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
       this.state.avatar = userData.safeImage.image;
    });
  }


  
  changeAvatarImage(newImage) {
    this.state.avatar = newImage;
    this.render();
  }

  onChangeAvatarInput(){

    let file = this.inputAvatar.el.files[0];
    let reader = new FileReader();
    reader.onloadend = ()=> {
       this.changeAvatarImage(reader.result);    
    }
    reader.readAsDataURL(file);


  }

  onSafeAllData() {
    Swal.fire('Not implemented yet,  more details about data is needed');
  }


  

}

//mount(Root, document.body);