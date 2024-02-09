const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import { Menu } from "./components/menu.js";
import { LeftMenu } from "./components/leftmenu.js";
import { Profile } from "./components/profile.js";
import { SendMoneyCuba } from "./components/sendmoneyCuba.js";
import { HomeDeliveryCuba } from "./components/homedeliveryCuba.js";
import { Beneficiarios } from "./components/beneficiarios.js";
import { RecargasTelefono } from "./components/recargasTelefono.js";
import { SendMoney } from "./components/sendMoney.js";
import { SendAll } from "./components/sendAll.js";
import { ListaTR } from "./components/listatr.js";
import { API } from "./utils.js";
import { ListaGiftCards } from "./components/giftCards.js";
import { PaymentLinks } from "./components/paymentLinks.js";



class Root extends Component {
  static components = { Menu, LeftMenu, Profile, SendMoneyCuba, ListaGiftCards, PaymentLinks, HomeDeliveryCuba, Beneficiarios, SendMoney, SendAll, RecargasTelefono, ListaTR };

  //Opcion inicial del menu


  state = useState({ menuId: 10, title: 'Gift Cards' });

  // tipo_operacion = {
  //   name: "CASH_OUT_TRANSACTION"
  // }

  leftmenuItems = [
    { id: 1, name: "Profile", type: 2 },
    { id: 2, name: "Beneficiaries", type: 2 },
    { id: 3, name: "Send Money Old", type: 2 },
    {
      id: 4, name: "Send Money To Cuba", type: 1, subitems: [
        { id: 5, name: "To Credit Card" },
        { id: 6, name: "Home Delivery" },
      ]
    },
    { id: 7, name: "Phone Recharge", type: 2 },
    { id: 9, name: "Send Money", type: 2 },
    { id: 8, name: "Transactions List", type: 2 },
    { id: 10, name: "Gift Cards", type: 2 },
    { id: 11, name: "Payment Links", type: 2 },
  ];

  static template = xml` 
  
  <div class="sm:tw-grid  sm:tw-grid-cols-[19%_82%]   tw-w-full tw-bg-[#F1F2F7]   ">
     <div class="tw-p-2 sm:tw-h-full "> 
        <LeftMenu  items="leftmenuItems" leftMenuController.bind="leftMenuController"/>
     </div> 

    <div class="tw-p-2">
      <div class="sm:tw-h-[4rem]">
         <Menu title="state.title"/>
      </div>
      <main class="tw-flex  tw-justify-center  tw-rounded-lg   ">       
        <div class="tw-p-3 tw-bg-[#FFFFFF] tw-rounded-lg    tw-w-full tw-h-full ">       
      
          <t t-if="this.state.menuId === 1">
            <Profile newUser="false"/>
          </t>

          <t t-elif="this.state.menuId === 2">
             <Beneficiarios/>
          </t>
         
          <t t-elif="this.state.menuId === 3">
             <SendMoney/>
          </t>

          <t t-elif="this.state.menuId === 5">
             <SendMoneyCuba menuController.bind="leftMenuController" urlHome=""/>
          </t>

          <t t-elif="this.state.menuId === 6">
             <HomeDeliveryCuba/>
          </t>

          <t t-elif="this.state.menuId === 7">
             <RecargasTelefono/>
          </t>

          <t t-elif="this.state.menuId === 8">
             <ListaTR />
          </t>

          <t t-elif="this.state.menuId === 9">
             <SendAll />
          </t>

          <t t-elif="this.state.menuId === 10">
             <ListaGiftCards />
          </t>

          <t t-elif="this.state.menuId === 11">
             <PaymentLinks />
          </t>
      
          

          <t t-else="">           
            <div class="sm:tw-grid sm:tw-grid-cols-[34%_64%] tw-gap-2 tw-h-[100vh]">
            <div class="tw-h-[100vh]">No component defined for this menu option yet</div>              
            </div>                
          </t>
            
          
        </div>
      </main>

    </div>

</div>  
   

  `;



  setup() {
    const accessToken = API.getTokenFromsessionStorage();
    const walletAddress = window.sessionStorage.getItem('walletAddress');
    const userId = window.sessionStorage.getItem('userId');

    onWillStart(() => {


    });


    onRendered(() => {
      if (this.state.menuId != 8) {
        // console.log(this.state)
        var tableId = "#container-listtr";
        $(tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?
      }
    }
    );


    onMounted(() => {


    });


  }






  leftMenuController(menuId, menuName) {
    this.state.menuId = menuId;
    this.state.title = menuName;
  }


  //   const menuInicial = 1;

  // const menu_inicial = this.leftmenuItems.filter((unItem)=>unItem.id==menuInicial)[0]
  // console.log(menu_inicial)
  // this.state.title = menu_inicial.name;
  // this.state.id = menuInicial.id;







}

mount(Root, document.body);
