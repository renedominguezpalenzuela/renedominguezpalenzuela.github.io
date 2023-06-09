const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";




class ComponenteA extends Component {
  static  template=xml`
    <div>This is the profile component</div>   
  `;
}

class ComponenteB extends Component {
  static  template=xml`
  <div>This is the receivers component</div>
  `;
}

class Root extends Component {
  static components = { Menu, LeftMenu, ComponenteA,  ComponenteB};

  state = useState({menuId: 1});
   

  leftmenuItems = [
    { id: 1, name: "Profile", type: 2 },
    { id: 2, name: "Receivers", type: 2 },
    {
      id: 3, name: "Send Money", type: 1, subitems: [
        { id: 4, name: "Send Money To Cuba" },
        { id: 5, name: "Send Money To Mexico" },
      ]
    },

    {
      id: 6, name: "Send Money 2", type: 1, subitems: [
        { id: 7, name: "Send Money To Cuba 2" },
        { id: 8, name: "Send Money To Mexico 2" },
      ]
    },
  ];

  static template = xml`  

    <div class="grid  grid-cols-[15%_85%]   w-full bg-[#F1F2F7] h-screen">
      <div class="p-2">
       <LeftMenu  items="leftmenuItems" leftMenuController.bind="leftMenuController"/>
      </div>
      <div class="p-2 h-full ">
      <Menu/>
        <main class="flex items-center justify-center h-[80%] rounded-lg ">       
        <div class="p-3 bg-[#FFFFFF] rounded-lg w-[90vw] h-full ">       
          Contenido principal
    

          <t t-if="this.state.menuId === 1">
             <ComponenteA/>
          </t>
          <t t-elif="this.state.menuId === 2">
             <ComponenteB/>
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


   // this.leftMenuController = this.leftMenuController.bind(this);


    onWillStart(() => {
      console.log("1) WillStart");
    });

    onMounted(() => {
      console.log("2) Mounted");
    });


    onRendered(() => {
      console.log("3) Rendered");
    });

  }



  leftMenuController(menuId) {
    console.log("Menu controller ");
    console.log(menuId);

    this.state.menuId = menuId;
   
  }





}

mount(Root, document.body);