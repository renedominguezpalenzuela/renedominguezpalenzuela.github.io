const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


export class Menu extends Component {

    state = useState({
        firstName: "",
        lastName: "",
        avatar: "/img/avatar.png",
        nameFull:""
      })

      

    static template = xml`


            <div class="tw-navbar tw-hidden sm:tw-flex ">
                <div class="tw-navbar-start ">
                    
                    <div class="tw-text-[1.5rem]  tw-font-[600] tw-pl-1 ">
                        <t t-esc="props.title"/>
                    </div>
                            
                              
                </div>

                <div class="tw-navbar-center ">
              
                    
                </div>

                <div class="tw-navbar-end  ">

                    <ul class="tw-menu tw-menu-horizontal tw-px-1 tw-z-50">

                     
                        <li>
                            
                            <details >
                            <summary>
                           
                                <span class="tw-avatar">                                   
                                    <div class="tw-w-6 tw-mask tw-mask-squircle">   
                                      <t t-if="this.state.avatar">             
                                        <img t-att-src="this.state.avatar" />
                                      </t>                                      
                                    </div>
                                </span>  

                                <span>
                                  <t t-esc="this.state.nameFull"/>
                                </span>
                            
                            </summary>
                            <ul>
                              <li><a>Option 01</a></li>
                              <li><a>Option 02</a></li>
                              <li>
                                 <a class="tw-dropdown-item" href="#" t-on-click="logout">Logout</a>
                              </li>
                            </ul>
                          </details>
                        </li>
                    </ul>

          

                      
                          
                
                    
                 
                  
                </div>
        </div>


    
    `;



    setup() {

        

        onWillStart(() => {

            this.state.avatar = window.localStorage.getItem('avatar');

            this.state.firstName = window.localStorage.getItem('firstName');
            this.state.lastName = window.localStorage.getItem('lastName');
            this.state.nameFull = window.localStorage.getItem('nameFull');

            
            
            

        });

        onMounted(() => {
            
        });


        onRendered(() => {
            
        });

    }

    logout () {
        console.log("Logout")
        window.localStorage.clear();
        window.location.assign("index.html");

    }
}
