const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";
import { Profile } from "./components/profile.js";
import { SendMoneyCuba } from "./components/sendmoneyCuba.js";
import { HomeDeliveryCuba } from "./components/homedeliveryCuba.js";
import { Beneficiarios } from "./components/beneficiarios.js";
import { RecargasTelefono } from "./components/recargasTelefono.js";
import { ListaTR } from  "./components/listatr.js";



class Root extends Component {
  static components = { Menu, LeftMenu, Profile, SendMoneyCuba, HomeDeliveryCuba, Beneficiarios, RecargasTelefono, ListaTR};

  //Opcion inicial del menu
  state = useState({menuId: 7, title:'Transactions List'});
   

  leftmenuItems = [
    { id: 1, name: "Profile", type: 2 },
    { id: 2, name: "Beneficiaries", type: 2 },
    {
      id: 3, name: "Send Money To Cuba", type: 1, subitems: [
        { id: 4, name: "To Credit Card" },
        { id: 5, name: "Home Delivery" },    
      ]
    },
    { id: 6, name: "Phone Recharge", type: 2 },
    { id: 7, name: "Transactions List", type: 2 },

   
  ];

  static template = xml` 

  
<div class="sm:grid  sm:grid-cols-[17%_82%]   w-full bg-[#F1F2F7]   ">
    <div class="p-2 sm:h-full ">
      <LeftMenu  items="leftmenuItems" leftMenuController.bind="leftMenuController"/>
    </div>

    <div class="p-2   ">
      <div class="sm:h-[10%]">
         <Menu title="state.title"/>
      </div>
      <main class="flex  justify-center  rounded-lg   ">       
        <div class="p-3 bg-[#FFFFFF] rounded-lg    w-full h-full ">       
        
          <t t-if="this.state.menuId === 1">
            <Profile/>
          </t>

          <t t-elif="this.state.menuId === 2">
             <Beneficiarios/>
          </t>


          <t t-elif="this.state.menuId === 4">
            <SendMoneyCuba/>
          </t>

          <t t-elif="this.state.menuId === 5">
            <HomeDeliveryCuba/>
          </t>

          <t t-elif="this.state.menuId === 6">
             <RecargasTelefono/>
          </t>

          <t t-elif="this.state.menuId === 7">
           <ListaTR/>
          </t>

      
          

          <t t-else="">
            
            <div class="sm:grid sm:grid-cols-[34%_64%] gap-2 h-[100vh]">
            <div class="h-[100vh]">No component defined for this menu option yet</div>
              
            </div>  
              
          </t>
            
          
        </div>
      </main>

    </div>

</div>  


 
  




    

  `;



  setup() {
    const accessToken = window.sessionStorage.getItem('accessToken');
    const walletAddress = window.sessionStorage.getItem('walletAddress');
    const userId = window.sessionStorage.getItem('userId');





    onWillStart(() => {
  
    });

    onMounted(() => {
      
    });


    onRendered(() => {
      
    });

  }



    
  

  leftMenuController(menuId, menuName) { 
    this.state.menuId = menuId;
    this.state.title = menuName;   
  }





}

mount(Root, document.body);
