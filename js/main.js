const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";
import { Profile } from "./components/profile.js";
import { SendMoney } from "./components/sendmoney.js";


class Root extends Component {
  static components = { Menu, LeftMenu, Profile, SendMoney};

  state = useState({menuId: 4, title:'Send Money To Cuba'});
   

  leftmenuItems = [
    { id: 1, name: "Profile", type: 2 },
    { id: 2, name: "Beneficiaries", type: 2 },
    {
      id: 3, name: "Send Money To Cuba", type: 1, subitems: [
        { id: 4, name: "To Credit Card" },
        { id: 5, name: "Home Delivery" },
    
      ]
    },

   
  ];

  static template = xml` 

  
<div class="grid  sm:grid-cols-[17%_82%]   w-full bg-[#F1F2F7] h-screen">
    <div class="p-2 sm:h-screen ">
      <LeftMenu  items="leftmenuItems" leftMenuController.bind="leftMenuController"/>
    </div>

    <div class="p-2 sm:h-screen  ">
      <div class="sm:h-[10%]">
         <Menu title="this.state.title"/>
      </div>
      <main class="flex  justify-center  rounded-lg  sm:h-[90%]  h-full ">       
        <div class="p-3 bg-[#FFFFFF] rounded-lg    w-full  ">       
        
          <t t-if="this.state.menuId === 1">
            <Profile/>
          </t>

          <t t-elif="this.state.menuId === 4">
            <SendMoney/>
          </t>

          <t t-else="">
            <div>No component defined for this menu option yet</div>
          </t>
            
          
        </div>
      </main>

    </div>

</div>  


 
  




    

  `;



  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');





    onWillStart(() => {
  
    });

    onMounted(() => {
      
    });


    onRendered(() => {
      
    });

  }



    
  

  leftMenuController(menuId, menuName) {
    console.log("Menu controller ");
    console.log(menuName);

    this.state.menuId = menuId;
    this.state.title = menuName;
   
  }





}

mount(Root, document.body);
