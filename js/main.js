const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";
import { Profile } from "./profile.js";


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
  static components = { Menu, LeftMenu, ComponenteA,  ComponenteB, Profile};

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

  
<div class="grid  sm:grid-cols-[15%_85%]   w-full bg-[#F1F2F7] sm:h-screen">
    <div class="p-2 sm:h-screen ">
      <LeftMenu  items="leftmenuItems" leftMenuController.bind="leftMenuController"/>
    </div>

    <div class="p-2 sm:h-screen  ">
      <div class="sm:h-[10%]">
      <Menu/>
      </div>
      <main class="flex  justify-center  rounded-lg  sm:h-[90%]  h-[30rem] ">       
        <div class="p-3 bg-[#FFFFFF] rounded-lg    w-full  ">       
        
          <t t-if="this.state.menuId === 1">
            <Profile/>
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
  
    });

    onMounted(() => {
      
    });


    onRendered(() => {
      
    });

  }



  leftMenuController(menuId) {
    console.log("Menu controller ");
    console.log(menuId);

    this.state.menuId = menuId;
   
  }





}

mount(Root, document.body);
/**
 * 
 * <div class="p-2 ">
    <LeftMenu  items="leftmenuItems" leftMenuController.bind="leftMenuController"/>
  </div>

  <div class="p-2 ">

    <Menu/>
    <main class="flex  justify-center  rounded-lg  ">       
      <div class="p-3 bg-[#FFFFFF] rounded-lg w-[90vw] border ">       
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
 */

/*

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
*/


/***********************
  
  
 

  <input id="my-drawer-3" type="checkbox" class="drawer-toggle"/> 

  <div class="flex flex-col drawer-content">
    <div class="w-full navbar bg-base-300">
    
      <div class="flex-none lg:hidden">
        <label for="my-drawer-3" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div> 

      <div class="flex-1 px-2 mx-2">
             <span>
                Change screen size to show/hide menu
            </span>
      </div> 

     
    </div>
  </div> 


  <div class="drawer-side">
    <label for="my-drawer-3" class="drawer-overlay"></label> 
    <ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
      <li>
        <a>Item 1z</a>
      </li> 
      <li>
        <a>Item 2</a>
      </li>
    </ul>
  </div>
 */