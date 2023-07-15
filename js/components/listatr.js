const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API } from "../utils.js";





export class ListaTR extends Component {

    datos = null;
    grid = null;

    static template = xml`  

    <div class="container-fluid no-padding">
    <div>TX List:</div>
    <button id="getdata-btn" class="other-btn" t-on-click="get_data">Refresh Data </button>
        <div class="row tx-container">
            <div class="col">
                <table  id="container-listtr">
                    <thead>
                        <tr>
                            <th>Transaction Amount</th>
                            <th>Transaction Status</th>
                            <th>Currency</th>
                            <th>Type</th>
                            <th>Transaction ID</th>
                           
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
   
  `;


    async get_data() {
        console.log("Iniciar button");
        this.datos = await getTrData();




        console.log("fin");
    }


    setup() {


        const accessToken = window.sessionStorage.getItem('accessToken');


        onWillStart(async () => {
            const api = new API(accessToken);
            this.datos = await api.getTrData();
            console.log(this.datos)
        });

        onMounted(async () => {
            // do something here





           /* this.grid.config.plugin.remove("pagination");
            this.grid.config.plugin.remove("search");
      
            if (this.datos) {
              this.grid = new gridjs.Grid({
                pagination: true,
                search: true,
                columns: ["Transaction Amount", "Transaction Status", "Currency", "Type", "Concept", "Transaction ID", "Id"],
                data: this.datos
              }).render(document.getElementById("container-listtr"));
            }*/

            $('#container-listtr').DataTable({
                data:  this.datos,
                columns: [
                    { data: 'transactionAmount' },
                    { data: 'transactionStatus' },
                    { data: 'currency' },
                    { data: 'type' },
                    { data: 'transactionID' },
             
                ],
                "pageLength": 10
            });
    




        });


        onRendered(async () => {

        });

    }

    async get_data() {
        /*  console.log("Iniciar button");
          this.datos = await getTrData();
      
          this.grid.config.plugin.remove("pagination");
          this.grid.config.plugin.remove("search");
          
      
          this.grid.updateConfig({
            search: true,
            pagination: true,
            data: this.datos
          }).forceRender();*/


        console.log("fin");
    }




}


