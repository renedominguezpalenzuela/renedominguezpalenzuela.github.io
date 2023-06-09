const { Component , xml} = owl;

import {Balance} from "./balance.js";




class MenuItemCollapsable extends Component {
    static  template=xml`
    <div class="collapse  collapse-arrow ">
        <input type="checkbox" class="peer" /> 
        
        <div class="collapse-title ">
             <t t-esc="props.name"/>
        </div>

        <div class="collapse-content"> 
            <div t-foreach="props.items" t-as="unitem" t-key="unitem.id" class="pl-2 cursor-pointer" t-on-click="()=>props.leftMenuController(unitem.id, unitem.name)">
                 <t t-esc="unitem.name"  />
            </div>
        </div>
        
    </div>
    `;
}


class MenuItemSingle extends Component {
    static  template=xml`
    
        <div class="pl-4 cursor-pointer" t-on-click="()=>props.leftMenuController(props.id, props.name)">
             <t t-esc="props.name"/><t />
        </div>

        
    `;
}



export class LeftMenu extends Component {


    static components = { MenuItemCollapsable, MenuItemSingle, Balance };


    static template=xml`       
            <div class="bg-[#009AFF] rounded-lg text-white text-[1rem] sm:h-full pb-5">            

                <a class="flex items-center justify-center p-3" href="/">
                    <img src="../img/logo-white.png" height="1.6rem"  alt="Logo" loading="lazy"  class="img-logo"  />
                </a>

                
 

                <div class="collapse  collapse-arrow ">
                    <input type="checkbox" class="peer" /> 
                    
                    <div class="collapse-title ">
                         Balance
                    </div>
            
                    <div class="collapse-content"> 
                      <Balance/>
                    </div>
                
                </div>

                

                <div t-foreach="props.items" t-as="unitem" t-key="unitem.id"  >
                   <t t-if="unitem.type === 1">                       
                      <MenuItemCollapsable  name="unitem.name" items="unitem.subitems" leftMenuController="props.leftMenuController"/>                         
                   </t>
                   <t t-if="unitem.type === 2">                       
                     <MenuItemSingle  name="unitem.name" id="unitem.id" leftMenuController="props.leftMenuController"/>                         
                   </t>
                </div>

                
               
            </div>  
    `;


 
    setup() {
       
    
      
    }
}


