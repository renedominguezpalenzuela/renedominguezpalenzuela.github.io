const { Component, mount, xml, useState} = owl;





class MagicButton extends Component {
  static template = xml`
    <button t-on-click="changeText">
      <t t-esc="props.initialText.texto"/> [<t t-esc="state.value"/>]
    </button>`;

  state = useState({ value: 0 });

  changeText() {
    this.state.value = "This is Magic";
  }

   static props = ["initialText"];
   setup() {
    console.log("SSS");
   }
}


// Owl Components
class Root extends Component {

  initialText = {texto: 'Dont click on me.'};
  static template = xml`
   <div class="p-3 ">
     <span class="ml-1">
        todo app hh
     </span>
     <div>
        <MagicButton initialText="initialText"/>
     </div>
   </div>
  `;

  static components = { MagicButton };
}

mount(Root, document.body);