const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";




class Root extends Component {
  static components = { Menu, LeftMenu };
  static template = xml`  

    <div class="grid  grid-cols-[15%_85%]   w-full bg-[#F1F2F7] h-screen">
      <div class="p-2">
       <LeftMenu/>
      </div>
      <div class="p-2 h-full ">
      <Menu/>
        <main class="flex items-center justify-center h-[80%] rounded-lg ">
        
        <div class="p-3 bg-[#FFFFFF] rounded-lg w-[90vw] h-full ">
        
          Contenido principal
        </div>
        </main>
        
      </div>
    </div>  

  `;



  setup() {
    const accessToken = window.localStorage.getItem('accessToken');
    const walletAddress = window.localStorage.getItem('walletAddress');
    const userId = window.localStorage.getItem('userId');


    onWillStart(async () => {
      


    });
  }

}

mount(Root, document.body);