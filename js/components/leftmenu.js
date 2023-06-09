const { Component , xml} = owl;




class MenuItemCollapsable extends Component {
    static  template=xml`
    <div class="collapse  collapse-arrow ">
        <input type="checkbox" class="peer" /> 
        
        <div class="collapse-title pl-4 ">
             <t t-esc="props.name"/>
        </div>

        <div class="collapse-content"> 
            <div t-foreach="props.items" t-as="unitem" t-key="unitem.id" class="pl-2" >
                 <t t-esc="unitem.name"/>
            </div>
        </div>
        
    </div>
    `;
}



/*
<div class="collapse collapse-arrow ">
<input type="radio" name="my-accordion-2" checked="checked" /> 

<div class="collapse-title ">
     <t t-esc="props.name"/>
</div>

<div class="collapse-content"> 
    <div t-foreach="props.items" t-as="unitem" t-key="unitem.id" >
        <t t-esc="unitem.name"/>
    </div>
    
</div>
</div>
*/

class MenuItemSingle extends Component {
    static  template=xml`
    
        <div class="pl-4 ">
             <t t-esc="props.name"/>
        </div>

        
    `;
}



export class LeftMenu extends Component {


    static components = { MenuItemCollapsable, MenuItemSingle };


    static template=xml`       
            <div class="bg-[#009AFF] rounded-lg text-white text-[1rem] h-full">            

                <a class="flex items-center justify-center p-3" href="/userdata.html">
                    <img src="../img/logo-white.png" height="16px"  alt="Logo" loading="lazy"  class="img-logo"  />
                </a>

                <div t-foreach="props.items" t-as="unitem" t-key="unitem.id" >
                   <t t-if="unitem.type === 1">                       
                      <MenuItemCollapsable  name="unitem.name" items="unitem.subitems"/>                         
                   </t>
                   <t t-if="unitem.type === 2">                       
                     <MenuItemSingle  name="unitem.name" />                         
                   </t>
                </div>
               
            </div>  
    `;


 
    setup() {
       
    
       console.log(this.props)
    }
}


