const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API, UImanager } from "../utils.js";






export class ListaBeneficiarios extends Component {


    datos = null;
    //grid = null;
    tabla = null;












    static template = xml`  

    
    <table  id="container-listbeneficiary" class="display nowrap tw-mt-2 " style="width:100%" >
        <thead class="tw-bg-[#3750D1] tw-text-[#FFFFFF] tw-text-[1.05rem] tw-mt-1">
            <tr>
                    <th data-priority="1">Beneficiary</th>    
                    <th>ID</th>        
                    <th class="">EMail</th>
                    <th class="">Phone</th>
                    <th class="">Country</th>
            </tr>
        </thead>
    </table>



   
  `;



    setup() {


        // console.log("ListaBeneficiarios")
        // console.log(this.props.listaBeneficiarios)


        const accessToken = API.getTokenFromlocalStorage();
        if (!accessToken) { return }

        this.api = new API(accessToken);


        //this.datos = await this.transformarRawDatos(raw_datos);
        //this.actualizarDatos(this.datos);





        /*onWillDestroy(() => {
            console.log("Destroy")
          });*/






        onWillStart(async () => {

            // this.datos = this.props.listaBeneficiarios;



            const raw_datos1 = this.props.listaBeneficiarios.map((unDato) => {


                const email = !unDato.email ? "-" : unDato.email
                return {

                    ...unDato,
                    email
                }

            });


            this.datos = raw_datos1;


        });



        onMounted(async () => {
            // do something here


            var tableId = "#container-listbeneficiary";




            //CCreando la tabla
            this.tabla = $(tableId).DataTable({
                data: this.datos,
                columns: [
                    { data: 'beneficiaryFullName', width: '30%' },
                    { data: 'deliveryCI', width: '15%' },
                    { data: 'email', width: '15%' },
                    { data: 'deliveryPhone', width: '15%' },
                    { data: 'country', width: '14%' },
                ],
                autoWidth: false,
                "pageLength": 10,
                order: [[0, 'asc']],
                select: true,
                responsive: true,
                //destroy: true,
                //footer: false




            });





            this.tabla.on('select', (e, dt, type, indexes) => {
                if (type === 'row') {
                    if (this.props.onChangeSelectedBeneficiary) {
                        this.props.onChangeSelectedBeneficiary(this.tabla.rows(indexes).data()[0])
                    }
                }
            });

            /* if (!this.datos || this.datos.length<=0) {
                 //$('#container-listtr').DataTable().clear().destroy();
 
                 // this.tabla.clear();
                 //this.tabla.destroy();
                 //2nd empty html
                 // $(tableId + " tbody").empty();  //LIMPIA EL CUERPO
                 // $(tableId + " thead").empty(); //LIMPIA EL HEADER
                 $(tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?
 
 
             }*/


        });


        onRendered(async () => {
            console.log("Rendering")
            console.log(this.props.listaBeneficiarios)
            const raw_datos1 = this.props.listaBeneficiarios.map((unDato) => {


                const email = !unDato.email ? "-" : unDato.email
                return {

                    ...unDato,
                    email
                }

            });


            this.datos = raw_datos1;

            //  this.tabla.clear();    
            if (this.tabla) {
                this.tabla.clear();
                this.tabla.rows.add(this.datos).draw();

            }

            const base_name_otra_table = "#container-listtr"



            const otra_table = $(`${base_name_otra_table}_wrapper`)
            console.log(otra_table)

            //if (otra_table) {
            console.log("Existe otra tabla")
            //  console.log(otra_table)
            //$(`${base_name_otra_table}_length`).empty();
            //$(`${base_name_otra_table}_filter`).empty();
            $(`${base_name_otra_table}_wrapper`).remove();
            //    $(tableId + "tbody").empty();  //LIMPIA EL CUERPO
            //   $(tableId + "thead").empty(); //LIMPIA EL HEADER
            //otra_table.empty(); //LIMPIA TODO, EL FOOTER?
            //  $(tableId + "_wrapper").empty(); //LIMPIA TODO, EL FOOTER?
            //}



            // container-listtr_wrapper


        });




    }



    transformarRawDatos(raw_datos) {


        //se busca el nombre de la operacoin
        //this.props.tipooperacion
        //let userTextTypeObj = tipos_operaciones.filter((unTipo) => unTipo.cod_tipo === this.props.tipooperacion)[0];

        /*this.userTextType = '';
        if (userTextTypeObj) {
            //console.log(userTextTypeObj)
            this.userTextType = userTextTypeObj.usertext;

        }*/


        const raw_datos1 = raw_datos.map((unDato) => {

            // console.log(unDato)



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

            let type2 = '-';
            if (unDato.metadata) {
                type2 = !unDato.metadata.method ? "-" : unDato.metadata.method
            }


            let feeUSD = 0;
            if (unDato.metadata) {
                feeUSD = !unDato.metadata.feeAmount ? 0 : unDato.metadata.feeAmount
            }

            let feeUserCurr = 0;
            if (unDato.metadata) {
                feeUserCurr = !unDato.metadata.feeAmountInUserCurrency ? 0 : unDato.metadata.feeAmountInUserCurrency
            }

            let txAmount = 0;
            if (unDato.metadata) {

                let totalAmount = 0;
                if (unDato.metadata.totalAmount) {
                    totalAmount = !unDato.metadata.totalAmount ? 0 : unDato.metadata.totalAmount;
                } else {
                    totalAmount = unDato.transactionAmount;
                }

                let feeAmountInUserCurrency = 0
                if (unDato.metadata.feeAmountInUserCurrency) {
                    feeAmountInUserCurrency = !unDato.metadata.feeAmountInUserCurrency ? 0 : unDato.metadata.feeAmountInUserCurrency;
                }




                txAmount = totalAmount - feeAmountInUserCurrency;
            }

            let txtExternalID = '-'
            if (unDato.externalID) {
                txtExternalID = unDato.externalID;
            }

            //Poniendole nombre a las operaciones


            let userTypeObj = null;
            if (unDato.type === "MLC_PAYMENT_REQUEST") {
                userTypeObj = tipos_operaciones.filter((unTipo) => unTipo.type1.includes(unDato.type))[0];
            } else {

                userTypeObj = tipos_operaciones.filter((unTipo) => unTipo.type1.includes(unDato.type) && unTipo.type2.includes(type2))[0];
                //console.log(userTypeObj)        

            }

            const userTextType = userTypeObj ? userTypeObj.usertext : '-'
            const tipoOperacion = userTypeObj ? userTypeObj.cod_tipo : '-'





            return {
                fecha_creada: fecha,
                type2: type2,
                feeusd: feeUSD,
                feeusercurr: feeUserCurr,
                ...unDato,
                transactionAmount: txAmount,
                userTextType: userTextType,
                tipoOperacion: tipoOperacion,
                externalID: txtExternalID
            }
        })





        //filtrando las operaciones
        //this.props.tipooperacion --- arreglo de tipos_operacion
        //ejemplp [1,2]
        if (this.props.tipooperacion) {
            //console.log("filtro")
            //Filtrar solo para un tipo de operacion
            //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))



            return raw_datos1.filter(
                (unaOperacion) => {

                    return this.props.tipooperacion.includes(unaOperacion.tipoOperacion)

                }


                /*(unaOperacion) => {

                    console.log(unaOperacion)

                    if (this.tipos_operacion.type2 && this.tipos_operacion.type2.length > 0) {
                        return (this.tipos_operacion.type1.includes(unaOperacion.type) && this.tipos_operacion.type2.includes(unaOperacion.type2));
                    } else {
                        return (this.tipos_operacion.type1.includes(unaOperacion.type))
                    }
                }*/
            )
        } else {
            //mostrar todas las operaciones de la wallet
            return raw_datos1;
        }

    }


    actualizarDatos = async (datos) => {

        if (this.tabla) {

            this.tabla.clear();
            this.tabla.rows.add(datos);
            this.tabla.draw();
        }


    }




}


