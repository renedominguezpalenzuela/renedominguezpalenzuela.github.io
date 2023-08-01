const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API } from "../utils.js";





export class ListaTR extends Component {


    //static props = ["tipooperacion"];

    datos = null;
    grid = null;



    static template = xml`  

    <div class="container-fluid no-padding">
    <div>TX List:</div>
    <button id="getdata-btn" class="other-btn" t-on-click="get_data">Refresh Data </button>
        <div class="row tx-container">
            <div class="col">
                <table  id="container-listtr" class="table table-striped table-bordered  table-responsive dataTable_width_auto display" style="width:100%" >
                    <thead>
                        <tr>
                            <th>Created</th>
                            <th>Transaction Status</th>
                            <th>Transaction Amount</th>
                            
                            <th>Currency</th>
                            <th>Type</th>
                            <th>Type2</th>
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


    //TODO: Formatear la fecha
    //TODO: Formatear el importe

    setup() {


        const accessToken = window.sessionStorage.getItem('accessToken');


        onWillStart(async () => {
            const api = new API(accessToken);
            const raw_datos = await api.getTrData();

            //console.log(raw_datos)




            const raw_datos1 = raw_datos.map((unDato) => {

                //const fecha = new Date(unDato.createdAt).toLocaleDateString('en-US');
                const fecha = new Date(unDato.createdAt).
                    toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                //const fecha2 = fecha.substring(0, 10) + " " + fecha.substring(11, 20);
                // console.log(fecha2)
                return {
                    fecha_creada: fecha,
                    type2: !unDato.metadata.method ? "-" : unDato.metadata.method,
                    ...unDato
                }
            })

            if (this.props.tipooperacion) {
                //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))
                this.datos = raw_datos1.filter((unaOperacion) => (unaOperacion.type2 == this.props.tipooperacion))
            } else {
                this.datos = raw_datos1;
            }

           // console.log("Operacion")
           // console.log(this.datos[0])







        });

        onMounted(async () => {
            // do something here





            //CCreando la tabla
            this.tabla = $('#container-listtr').DataTable({
                data: this.datos,
                columns: [
                    { data: 'createdAt' },
                    { data: 'transactionStatus' },
                    { data: 'transactionAmount' },

                    { data: 'currency' },
                    { data: 'type' },
                    { data: 'type2' },
                    { data: 'transactionID' },

                ],
                "pageLength": 10,
                order: [[0, 'desc']],
                select: true
            });


            //console.log(this.tabla)


            this.tabla.on('select', (e, dt, type, indexes) => {
                if (type === 'row') {
                    this.props.onChangeSelectedTX(this.tabla.rows(indexes).data()[0])
                }
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


