const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";





class Root extends Component {
  static components = { Menu, LeftMenu };


  leftmenuItems = [
    { id: 1, name: "Profile", type: 2 },
    { id: 2, name: "Receivers", type: 2 },
    {
      id: 3, name: "Send Money", type: 1, subitems: [
        { id: 4, name: "Send Money To Cuba" },
        { id: 4, name: "Send Money To Mexico" },
      ]
    },

    {
      id: 4, name: "Send Money 2", type: 1, subitems: [
        { id: 5, name: "Send Money To Cuba 2" },
        { id: 6, name: "Send Money To Mexico 2" },
      ]
    },
  ];

  static template = xml`  

    <div class="grid  grid-cols-[15%_85%]   w-full bg-[#F1F2F7] h-screen">
      <div class="p-2">
       <LeftMenu  items="leftmenuItems"/>
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




}

mount(Root, document.body);