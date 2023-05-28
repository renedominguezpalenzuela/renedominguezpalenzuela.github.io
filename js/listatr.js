const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;

import useStore from "./store";
import { getTrData } from "./utils";




class Root extends Component {

  datos = null;
  grid = null;

  static template = xml`  
    <div class="container-fluid no-padding">
    <div>TX List:</div>
    <button id="getdata-btn" class="other-btn" t-on-click="get_data">Refresh Data </button>
    <div class="row tx-container">
        <div class="col">
            <div id="container-listtr"></div>
        </div>
    </div>
    </div>
  `;


  async get_data() {
    console.log("Iniciar button");
    this.datos = await getTrData();

    this.grid.config.plugin.remove("pagination");
    this.grid.config.plugin.remove("search");
    

    this.grid.updateConfig({
      search: true,
      pagination: true,
      data: this.datos
    }).forceRender();


    console.log("fin");
  }


  setup() {
    this.store = useStore();

    onMounted(async () => {
      // do something here
      console.log("Inici");
      this.datos = await getTrData();

      console.log(this.datos);
      if (this.datos) {
        this.grid = new gridjs.Grid({
          pagination: true,
          search: true,
          columns: ["Transaction Amount", "Transaction Status", "Currency", "Type", "Concept", "Transaction ID", "Id"],
          data: this.datos
        }).render(document.getElementById("container-listtr"));
      }



      console.log("fin");
    });


    onRendered(async () => {

    });

  }



}

mount(Root, document.body);