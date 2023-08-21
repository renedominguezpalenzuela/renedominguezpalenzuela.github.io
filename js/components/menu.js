const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


export class Menu extends Component {

    state = useState({
        firstName: "",
        lastName: "",
        avatar: "/img/avatar.png",
        nameFull:""
      })

      

    static template = xml`


            <div class="navbar hidden sm:flex ">
                <div class="navbar-start ">
                    
                    <div class="text-[1.5rem]  font-[600] pl-1 ">
                        <t t-esc="props.title"/>
                    </div>
                            
                              
                </div>

                <div class="navbar-center ">
              
                    
                </div>

                <div class="navbar-end  ">

                    <ul class="menu menu-horizontal px-1 z-50">

                      <!--  <li>
                            <a class="dropdown-item" href="#">TX List</a>
                        </li>

                        <li tabindex="0">
                            <details>
                                <summary>Send Money</summary>
                                <ul class="p-2">
                                    <li><a class="dropdown-item" href="#">Send Money Cuba</a></li>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li> -->

                        <li>
                            
                            <details >
                            <summary>
                           
                                <span class="avatar">
                                    
                                    <div class="w-6 mask mask-squircle">   
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
                                 <a class="dropdown-item" href="#" t-on-click="logout">Logout</a>
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
