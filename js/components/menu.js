const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


// <nav class="navbar navbar-expand-lg navbar-light bg-light">
//             <div class="container-fluid">
//             <a class="navbar-brand me-2" href="/userdata.html">
//                <img src="../img/logo.png" height="16px"  alt="MDB Logo" loading="lazy"  class="img-logo"  />
//             </a>

//             <ul class="navbar-nav">
//             <!-- Dropdown -->
//             <li class="nav-item dropdown">
//                 <a class="nav-link dropdown-toggle"  href="#"  id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown"  aria-expanded="false" >
//                   Send Money
//                 </a>
//                 <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
//                     <li>
//                         <a class="dropdown-item" href="/sendmoney.html">Send Money Cuba</a>
//                     </li>
                   
//                 </ul>

//             </li>
//             </ul>
//         </div>
//     </nav>


export class Menu extends Component {
    static template=xml`


            <div class="navbar hidden sm:flex ">
                <div class="navbar-start ">
                    
                <div class="text-[1.5rem]  font-[600] pl-1 ">
                    <t t-esc="props.title"/>
                </div>
                        
                              
                </div>
                <div class="navbar-center ">
                    
                </div>
                <div class="navbar-end">
                    <ul class="menu menu-horizontal px-1">
                    
                        <li><a class="dropdown-item" href="/listatr.html">TX List</a></li>
                        <li tabindex="0">
                            <details>
                                <summary>Send Money</summary>
                                <ul class="p-2">
                                    <li><a class="dropdown-item" href="/sendmoney.html">Send Money Cuba</a></li>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li><a class="dropdown-item" href="/userdata.html">User Balance</a></li>
                    </ul>
                  
                </div>
        </div>


    
    `;


    
  setup() {
  


    onWillStart(() => {
        // console.logs(props)

    });

    onMounted(() => {
      
    });


    onRendered(() => {
      
    });

  }
}


// <nav class="mx-auto block w-full   border border-white/80 bg-white bg-opacity-80 py-2 
// px-4 text-white shadow-md backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">

// <div class="container mx-auto flex items-center justify-between text-gray-900">
// <a class="navbar-brand me-2" href="/userdata.html">
//     <img src="../img/logo.png" height="16px"  alt="Logo" loading="lazy"  class="img-logo"  />
// </a>
// <ul class="navbar-nav">
//     <!-- Dropdown -->
//     <li class="nav-item dropdown">
//         <a class="nav-link dropdown-toggle"  href="#"  id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown"  aria-expanded="false" >
//          Send Money
//         </a>
//         <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
//             <li>
//                 <a class="dropdown-item" href="/sendmoney.html">Send Money Cuba</a>
//             </li>
//         </ul>
//     </li>
// </ul>
// </div>
// </nav>