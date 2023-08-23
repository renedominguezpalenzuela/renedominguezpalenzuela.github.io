const { Component , xml} = owl;

import {Balance} from "./balance.js";




class MenuItemCollapsable extends Component {
    static  template=xml`
    <div class="tw-collapse  tw-collapse-arrow ">
        <input type="checkbox" class="tw-peer" /> 
        
        <div class="tw-collapse-title ">
             <t t-esc="props.name"/>
        </div>

        <div class="tw-collapse-content"> 
            <div t-foreach="props.items" t-as="unitem" t-key="unitem.id" class="tw-pl-2 tw-cursor-pointer" t-on-click="()=>props.leftMenuController(unitem.id, unitem.name)">
                 <t t-esc="unitem.name"  />
            </div>
        </div>
        
    </div>
    `;
}


class MenuItemSingle extends Component {
    static  template=xml`
    
        <div class="tw-pl-4 tw-cursor-pointer" t-on-click="()=>props.leftMenuController(props.id, props.name)">
             <t t-esc="props.name"/><t />
        </div>

        
    `;
}



export class LeftMenu extends Component {


    static components = { MenuItemCollapsable, MenuItemSingle, Balance };


    static template=xml`       
            <div class="tw-bg-[#009AFF] tw-rounded-lg tw-text-white tw-text-[1rem] sm:tw-h-full tw-pb-5">            

                <a class="tw-flex tw-items-center tw-justify-center tw-p-3" href="/">
                    <img class="img-logo" src="../img/logo-white.png" height="1.6rem"  alt="Logo" loading="lazy"    />
                </a>

                
 

                <div class="tw-collapse  tw-collapse-arrow ">
                    <input type="checkbox" class="tw-peer" /> 
                    
                    <div class="tw-collapse-title ">
                         Balance
                    </div>
            
                    <div class="tw-collapse-content"> 
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


