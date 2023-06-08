const { Component , xml} = owl;




export class LeftMenu extends Component {
    static template=xml`       
            <div class="bg-[#009AFF] rounded-lg text-white text-[1rem] h-full"> 
            
                
                <a class="flex items-center justify-center p-3" href="/userdata.html">
                    <img src="../img/logo-white.png" height="16px"  alt="Logo" loading="lazy"  class="img-logo"  />
                </a>
                
                <div class="collapse collapse-arrow ">
                    <input type="radio" name="my-accordion-2" checked="checked" /> 
                    <div class="collapse-title text-xl font-medium">
                        TX List
                    </div>
                    <div class="collapse-content"> 
                        <p>hello</p>
                    </div>
                </div>
                <div class="collapse collapse-arrow ">
                    <input type="radio" name="my-accordion-2" /> 
                    <div class="collapse-title text-xl font-medium">
                    Send Money
                    </div>
                    <div class="collapse-content"> 
                    <p>Send Money Cuba</p>
                    </div>
                </div>
                <div class="collapse collapse-arrow ">
                    <input type="radio" name="my-accordion-2" /> 
                    <div class="collapse-title text-xl font-medium">
                    User Balance
                    </div>
                    <div class="collapse-content"> 
                    <p>hello</p>
                    </div>
                </div>    
            </div>  
    `;
}

