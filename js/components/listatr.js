const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;




import { API, UImanager } from "../utils.js";
import { tipos_operaciones } from "../../data/tipos_operacion.js";





export class ListaTR extends Component {




    datos = [];
    //grid = null;
    tabla = null;
    api = null;
    accessToken = null;
    walletAddress = null;
    userId = null;
    // senderName = '-';

    //Variables para el socket
    socketActivo = true;
    socket = null;
    subscriptionPath = "/api/subscription";

    balance = useState({
        saldos: []
    });



    total_tx_a_solicitar = 100;

    minDateFiltro = null;
    maxDateFiltro = null;
    selectedBeneficiaryName = ''

    state = useState(
        {
            tipoOperacionFiltro: '-1',
            beneficiaryID: '-1'

        }
    )

    beneficiarios = useState({
        nameList: []
    })

    spinner = useState({
        show: true
    })










    static template = xml`  

    <div class="tw-card  tw-w-full tw-bg-base-100 tw-shadow-xl tw-rounded-lg tw-mt-2 ">
    <div class="tw-card-body tw-items-center  "> 

    <t t-if="this.datos and this.datos.length>0">


                

        <div class="sm:tw-grid sm:tw-grid-cols-3 tw-gap-2 tw-mb-4">
           
        
            <div class="tw-w-[22rem] sm:tw-row-start-1 sm:tw-col-start-1">
                
                <div>
                    <span>From:</span>
                    <span class="tw-ml-2">
                        <input type="text" id="min" name="min"  placeholder="yyyy-mm-dd" class="tw-input tw-input-bordered" />
                    </span> 
                </div>
            </div>
                
            
            <div class="tw-w-[22rem] sm:tw-row-start-2 sm:tw-col-start-1">
                <div>
                    <span>To:</span>
                    <span class="tw-ml-2">
                        <input type="text" id="max" name="max"  placeholder="yyyy-mm-dd" class="tw-input tw-input-bordered"/>
                    </span>
                </div>

                
            </div>

            <div class="tw-w-[22rem] sm:tw-row-start-1 sm:tw-col-start-2">
                    <button  class="tw-btn"  t-on-click="resetRange" >Reset range </button>
            </div>
                
                

              

            <!-- Seleccionar Tipo de Operacion -->
            <div class="tw-w-[22rem] sm:tw-row-start-1 sm:tw-col-start-3" t-if="this.props.tipoVista=='' || this.props.tipoVista==null">
                <span>Type:</span>
                <span class="tw-ml-2">
                    <select class="tw-select tw-select-bordered tw-join-item" t-att-value="this.state.tipoOperacionFiltro"  t-on-input="onChangeType" t-ref="inputType" >                    
                    <option  t-att-value="-1" >All types</option>
                    <t t-if="(this.tipos_operaciones) and (this.tipos_operaciones.length>0) ">
                    <t  t-foreach="this.tipos_operaciones" t-as="unTipo" t-key="unTipo.cod_tipo">
                            <option t-att-value="unTipo.cod_tipo">
                                <t t-esc="unTipo.usertext"/>                                  
                            </option>
                    </t>       
                    </t>        
                    </select> 
                </span> 
            </div>


            <!-- Seleccionar beneficiario -->
            
            <div class="tw-w-[22rem] sm:tw-row-start-2 sm:tw-col-start-3" t-if="this.props.tipoVista=='' || this.props.tipoVista==null">
                <select  id="listaBeneficiarios" t-att-value="this.state.beneficiaryID" class="tw-select tw-select-bordered tw-w-full" t-on-input="onChangeSelectedBeneficiario">
                    <option  t-att-value="-1" >All beneficiaries</option>
                    <t  t-if="this.beneficiarios and  this.beneficiarios.nameList.length > 0">
                        <t t-foreach="this.beneficiarios.nameList" t-as="unBeneficiario" t-key="unBeneficiario.id">
                            <option t-att-value="unBeneficiario.id">
                            <t t-esc="unBeneficiario.beneficiaryFullName"/>
                            </option>
                        </t>  
                    </t>          
                </select> 
            </div>   
                  
                

            

        </div>


    </t>

 
    <t t-else="">
   
        <span  class="display nowrap responsive "    >
            Requesting data
        </span>

        <t t-if="this.spinner.show==true">
            <span>
                 <img src="img/Spinner-1s-200px.png" width="35rem"/>
            </span>
        </t>
    </t>  
   

    
    <table  id="container-listtr" class="display nowrap responsive " style="width:100%; visibility: hidden;" cellspacing="0"  >

        <thead class="tw-bg-[#0652ac] tw-text-[#FFFFFF] tw-text-[1.05rem] tw-mt-1">

            <tr >
                <th   >Transaction ID</th>    
                <th   class="centrar">Type</th> 


                <th  class="centrar">Status</th>


                <th class="amount-value">Amount <br/> (No fee)</th>
                <th >Fee: <br/> </th>

                <th >Curr.</th>
                <th  class="centrar">Created <br/> (yyyy/mm/dd) </th>    
                <th  >  Beneficiary Name  </th>  
                <th >  Beneficiary Phone  </th>  
                <th >  Beneficiary Card  </th> 
                <th >  Sender Name </th>
                <th >  Received Amount </th>
                <th >  Received Currency </th>

                <th>Type</th>
                <th>Type2</th> 
                <th>External ID</th>

            </tr>

        </thead>

    </table>
    


</div>
</div>





   
  `;



    //TODO: Formatear la fecha
    //TODO: Formatear el importe

    static props = ["urlHome"];

    static defaultProps = {
        urlHome: '/',
    };


    setup() {

        this.tipos_operaciones = tipos_operaciones;

        API.setRedirectionURL(this.props.urlHome);


        onWillStart(async () => {
            this.accessToken = API.getTokenFromsessionStorage();
            if (!this.accessToken) { return }

            this.api = new API(this.accessToken);

            //CCreando los filtros de la tabla
            this.showCol = await this.mostrarColumnas(this.props.tipoVista)

            this.walletAddress = window.sessionStorage.getItem('walletAddress');
            this.userId = window.sessionStorage.getItem('userId');
        });


        onMounted(async () => {

            if ((this.props.tipooperacion) && (this.props.tipooperacion != 0)) {
                this.tipos_operacion = tipos_operaciones.filter((una_operacion) => una_operacion.cod_tipo === this.props.tipooperacion)[0]
            }

            this.minDateFiltro = new DateTime('#min', {
                format: 'YYYY-MM-DD',
            });
            this.maxDateFiltro = new DateTime('#max', {
                format: 'YYYY-MM-DD',
            });

            //Obteniendo datos por primera ves
            this.getDatosdeTX().then(async (misDatos) => {
                await this.crearTabla(misDatos)
                this.datos = misDatos;
                // this.actualizarDatos(misDatos)
                this.spinner.show = false;
                this.crearSocket();
            });

           

        });


        onRendered(async () => {

            const base_name_otra_table = "#container-listbeneficiary"
            //                             container-listbeneficiary_wrapper
            //                             container-listgift-cards_wrapper

            const otra_table = $(`${base_name_otra_table}_wrapper`)

            $(`${base_name_otra_table}_wrapper`).remove();

            $('#container-listbeneficiary_wrapper').remove();

            if (this.props.tipoVista != 'GIFT_CARDS') {
                $('#container-listgift-cards_wrapper').remove();
            }

            $('#container-listbeneficiary').DataTable().clear().destroy();

            if (this.props.tipoVista != 'GIFT_CARDS') {
                $('#container-listgift-cards').DataTable().clear().destroy();
            }


            //style="visibility: hidden;"
            // $("#container-listtr").css('visibility', 'visible');
            //$("#container-listtr").css('visibility', 'hidden');




        });


    }

    getBeneficiaryData(type2, unDato) {

        const type = unDato.type;



        let otrosDatos = {
            beneficiaryName: '-',
            beneficiaryPhone: '-',
            beneficiaryCardNumber: '-',
            senderName: '-',
            receivedAmount: '-',
            receivedCurrency: '-'
        }

        if (type === 'CASH_OUT_TRANSACTION' && type2 === 'CREDIT_CARD_TRANSACTION') {
            otrosDatos.beneficiaryName = unDato.metadata.contactName ? unDato.metadata.contactName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.contactPhone ? unDato.metadata.contactPhone : '-';
            otrosDatos.beneficiaryCardNumber = unDato.metadata.cardNumber ? unDato.metadata.cardNumber : '-';
            otrosDatos.receivedAmount = unDato.metadata.deliveryAmount ? unDato.metadata.deliveryAmount : '-';
            otrosDatos.receivedCurrency = unDato.metadata.deliveryCurrency ? unDato.metadata.deliveryCurrency : '-'
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName + ' ' + unDato.metadata.senderLastName : '-';
            otrosDatos.senderName = senderName;
        } else if (type === 'CASH_OUT_TRANSACTION' && type2 === 'DELIVERY_TRANSACTION') {
            otrosDatos.beneficiaryName = unDato.metadata.contactName ? unDato.metadata.contactName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.contactPhone ? unDato.metadata.contactPhone : '-';
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName + ' ' + unDato.metadata.senderLastName : '-';
            otrosDatos.senderName = senderName;
            otrosDatos.receivedAmount = unDato.metadata.deliveryAmount ? unDato.metadata.deliveryAmount : '-';
            otrosDatos.receivedCurrency = unDato.metadata.deliveryCurrency ? unDato.metadata.deliveryCurrency : '-'
        } else if (type === 'CASH_OUT_TRANSACTION' && type2 === 'DELIVERY_TRANSACTION_USD') {
            otrosDatos.beneficiaryName = unDato.metadata.contactName ? unDato.metadata.contactName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.contactPhone ? unDato.metadata.contactPhone : '-';
        } else if (type === 'TOPUP_RECHARGE' && type2 === 'DIRECT_TOPUP') {
            otrosDatos.beneficiaryName = unDato.metadata.receiverName ? unDato.metadata.receiverName : '-';
            otrosDatos.beneficiaryPhone = unDato.metadata.destination ? unDato.metadata.destination : '-';
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName : '-';
            otrosDatos.senderName = senderName;
            otrosDatos.receivedAmount = unDato.metadata.amount ? unDato.metadata.amount : '-';
        } else if (type === 'PAYMENT_REQUEST' && type2 === 'DIRECT_TOPUP') {
            otrosDatos.beneficiaryName = unDato.metadata.receiver_name ? unDato.metadata.receiver_name : '-';
        } else if (type === 'PAYMENT_REQUEST' && type2 === 'PAYMENT_LINK') {
            otrosDatos.beneficiaryName = unDato.metadata.cardHolderName ? unDato.metadata.cardHolderName : '-';
            const senderName = unDato.metadata.senderName ? unDato.metadata.senderName + ' ' + unDato.metadata.senderLastName : '-';
            otrosDatos.senderName = senderName;
        } else if (type === 'CASH_OUT_TRANSACTION' && type2 === 'THUNES_TRANSACTION') {
            otrosDatos.receivedAmount = unDato.metadata.destinationAmount ? unDato.metadata.destinationAmount : '-';
            otrosDatos.receivedCurrency = unDato.metadata.destinationCurrency ? unDato.metadata.destinationCurrency : '-';
        } else if (type === 'GIFT_CARD_SUB_TOKEN' || type === 'GIFT_CARD_ADD_TOKEN') {

            // otrosDatos.receivedAmount = unDato.metadata.destinationAmount ? unDato.metadata.destinationAmount : '-';
            otrosDatos.receivedCurrency = unDato.currency ? unDato.currency : '-';
            otrosDatos.receivedAmount = unDato.transactionAmount ? unDato.transactionAmount : '-';
        }

        return otrosDatos;

    }



    actualizarDatos = async (datos) => {

        if (this.tabla) {

            this.tabla.clear();
            this.tabla.rows.add(datos);
            this.tabla.draw();

        } else {
            console.log("Tabla no existe aun")
        }


    }

    //se le pasa de parametro un string con el nombre de la columna y el tipo de vista
    // devuelve
    // objeto donde cada elemento indica si se muestra o no la columna correspondiente
    // true -- mostrar  | false -- no mostrar
    mostrarColumnas = async (tipoVista) => {



        let showCol = {
            transactionID: true,
            userTextType: true,
            transactionStatus: true,
            transactionAmount: true,
            feeusercurr: true,
            currency: true,
            createdAt: true,
            beneficiaryName: true,
            beneficiaryPhone: true,
            beneficiaryCardNumber: true,
            senderName: true,
            receivedAmount: true,
            receivedCurrency: true,
            type: true,
            type2: true,
            externalID: true,
        }


        switch (tipoVista) {
            case 'SEND_MONEY':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.beneficiaryCardNumber = false;

                break;

            case 'SEND_MONEY_CUBA':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;

                break;

            case 'HOME_DELIVERY':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.beneficiaryCardNumber = false;

                break;

            case 'PHONE_RECHARGE':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.beneficiaryCardNumber = false;

                break;
            case 'GIFT_CARDS':
                showCol.userTextType = false;
                showCol.type = false;
                showCol.type2 = false;
                showCol.senderName = false;
                //showCol.beneficiaryCardNumber = false;
                //showCol.beneficiaryName = false;
                showCol.beneficiaryPhone = false;


                break;
                case 'PAYMENT_LINK':
                    showCol.userTextType = false;
                    showCol.type = false;
                    showCol.type2 = false;
                    showCol.beneficiaryCardNumber = false;
                    showCol.beneficiaryPhone = false;
    
                    break;    

            default:
                break;
        }




        return showCol;
    }

    resetRange() {
        this.minDateFiltro.val(null);
        this.maxDateFiltro.val(null);
        this.tabla.draw();

    }

    onChangeType(value) {


        this.state.tipoOperacionFiltro = value.target.value;
        this.tabla.draw();
    }

    onChangeSelectedBeneficiario(value) {

        this.state.beneficiaryID = value.target.value;

        const beneficiario = this.beneficiarios.nameList.find(unBeneficiario => unBeneficiario.id == this.state.beneficiaryID);

        if (beneficiario) {
            this.selectedBeneficiaryName = beneficiario.beneficiaryFullName
        }


        this.tabla.draw();
    }


    colorStatus = (status) => {
        let color = ""
        switch (status) {
            case "requested":
                color = "#658DF7"
                break;

            case "confirmed":
                color = "#78D1B5"
                break;

            case "pending":
                color = "#C07E00"
                break;

            case "failed":
                color = "#D70707"
                break;

            case "canceled":
                color = "#F83E54"
                break;

            case "processed":
                color = "#3750D1"
                break;

            case "rejected":
                color = "#F83E54"
                break;

            case "accepted":
                color = "#28A745"
                break;

            case "queued":
                color = "#28A215"
                break;


            default:
                color = "#A0AFD6"
                break;
        }

        return color;

    }


    formatFecha = (inputDate) => {
        let date, month, year, segundos, minutos, horas;
        date = inputDate.getDate();

        segundos = inputDate.getSeconds().toString().padStart(2, '0');
        minutos = inputDate.getMinutes().toString().padStart(2, '0');;
        horas = inputDate.getHours().toString().padStart(2, '0');;




        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();
        date = date.toString().padStart(2, '0');
        month = month.toString().padStart(2, '0');


        return `${year}/${month}/${date} ${horas}:${minutos}:${segundos}`;
    }


    crearTabla = async (datos) => {





        var tableId = "#container-listtr";

        // $(tableId).DataTable().clear().destroy();

        //https://phppot.com/jquery/responsive-datatables-with-automatic-column-hiding
        this.tabla = $(tableId).DataTable({
            data: datos,

            columns: [
                { data: 'transactionID', width: '25%', visible: this.showCol.transactionID },
                { data: 'userTextType', width: '30%', visible: this.showCol.userTextType },
                {
                    data: 'transactionStatus', width: '23%',
                    render: (data, type, row) => {
                        let color = this.colorStatus(data)
                        return `<span class="state" style="background-color:${color};"> ${data} </span>`;
                    },
                    visible: this.showCol.transactionID
                },
                {
                    data: 'transactionAmount', width: '18%', className: "amount-value",
                    render: function (data, type, row) {
                        let valor = UImanager.roundDec(data);
                        return `<span class="amount-value" > ${valor} </span>`;
                    },
                    visible: this.showCol.transactionStatus

                },
                {
                    data: 'feeusercurr', width: '10%', className: "amount-value",
                    render: function (data, type, row) {
                        let valor = UImanager.roundDec(data);
                        return `<span class="amount-value" > ${valor} </span>`;
                    },
                    visible: this.showCol.feeusercurr
                },
                { data: 'currency', width: '8%', className: "centrar", visible: this.showCol.currency },
                {
                    data: 'createdAt', width: '30%',
                    render: (data, type, row) => {

                        const fecha = new Date(data);
                        return this.formatFecha(fecha)

                    },
                    visible: this.showCol.createdAt
                },
                { data: 'beneficiaryName', width: '35%', visible: this.showCol.beneficiaryName },
                { data: 'beneficiaryPhone', width: '35%', visible: this.showCol.beneficiaryPhone },
                { data: 'beneficiaryCardNumber', width: '35%', visible: this.showCol.beneficiaryCardNumber },
                { data: 'senderName', width: '35%', visible: this.showCol.senderName },
                { data: 'receivedAmount', width: '35%', visible: this.showCol.receivedAmount },
                { data: 'receivedCurrency', width: '35%', visible: this.showCol.receivedCurrency },
                { data: 'type', width: '15%', visible: this.showCol.type },
                { data: 'type2', width: '15%', visible: this.showCol.type2 },
                { data: 'externalID', width: '13%', visible: this.showCol.externalID }






            ],

            dom: 'lBfrtip',
            buttons: [
                'copy',
                'csv',
                {
                    extend: 'excelHtml5',
                    text: 'Save EXCEL'
                },
                {
                    extend: 'pdf',
                    messageTop: 'TX List'
                },
                'print'
            ],

            autoWidth: false,
            pageLength: 10,
            order: [[6, 'desc']],
            select: true,
            responsive: true,
            destroy: true,
            language: {
                emptyTable: "No data to show",
                infoEmpty: "No entries to show",
                zeroRecords: "No data match the filter"
            },
            initComplete: function (settings, json) {
                $("#container-listtr").css('visibility', 'visible');
            }





        });







        // this.tabla.columns.adjust().draw();




        if (this.tabla) {
            this.tabla.on('select', (e, dt, type, indexes) => {
                if (type === 'row') {
                    if (this.props.onChangeSelectedTX) {
                        this.props.onChangeSelectedTX(this.tabla.rows(indexes).data()[0])
                    }
                }
            });
        }


        //Refilter the table
        document.querySelectorAll('#min, #max').forEach((el) => {
            el.addEventListener('change', () => this.tabla.draw());
        })


        // Filtro para las fechas
        DataTable.ext.search.push((settings, data, dataIndex) => {

            if ((this.minDateFiltro == null || this.maxDateFiltro == null)) {
                return true;
            }

            //UImanager.timeZoneTransformer(userData.birthDate).fromUtc
            let min = UImanager.timeZoneTransformer(this.minDateFiltro.val()).fromUtc;
            let max = UImanager.timeZoneTransformer(this.maxDateFiltro.val()).fromUtc;

            if (min.getFullYear() < 1980) {
                min = null;
            } else {
                min = new Date(min).setHours(0, 0, 0, 0)

            }

            if (max.getFullYear() < 1980) {
                max = null;
            } else {
                max = new Date(max).setHours(0, 0, 0, 0)

            }

            let date = new Date(data[6]).setHours(0, 0, 0, 0);

            if (
                (min === null && max === null) ||
                (min === null && date <= max) ||
                (date >= min && max === null) ||
                (date >= min && date <= max)

            ) {
                return true;
            }
            return false;
        });

        // Filtro para los tipos de operacion
        DataTable.ext.search.push((settings, data, dataIndex) => {

            if (this.state.tipoOperacionFiltro == '-1') {
                return true;
            }

            let tipoOperacion = data[1];

            const codigoOperacion = this.tipos_operaciones.filter(unTipo => unTipo.usertext === tipoOperacion);
            if (codigoOperacion && codigoOperacion.length > 0) {

                if (codigoOperacion[0].cod_tipo == this.state.tipoOperacionFiltro) {
                    return true;
                }

            }

            return false;
        });

        //Filtro para el beneficiario
        //this.state.beneficiaryID
        DataTable.ext.search.push((settings, data, dataIndex) => {

            if (this.state.beneficiaryID == '-1') {
                return true;
            }

            let beneficiarioNombre = data[7];



            if (beneficiarioNombre === this.selectedBeneficiaryName) {


                return true;


            }

            return false;
        });



    }
    transformarRawDatos(raw_datos) {




        if (!raw_datos || !raw_datos.status) {
            return [];
        } else if (!(raw_datos.status != 200 || raw_datos.status != 201)) {
            return [];
        } else if (!raw_datos.data) {
            return [];
        }






        const raw_datos1 = raw_datos.data.data.map((unDato) => {




            //const fecha = new Date(unDato.createdAt).toLocaleDateString('en-US');
            const fecha = new Date(unDato.createdAt).
                toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })



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


            }

            const userTextType = userTypeObj ? userTypeObj.usertext : '-'
            const tipoOperacion = userTypeObj ? userTypeObj.cod_tipo : '-'


            const beneficiaryData = this.getBeneficiaryData(type2, unDato);


            return {
                fecha_creada: fecha,
                type2: type2,
                feeusd: feeUSD,
                feeusercurr: feeUserCurr,
                ...unDato,
                ...beneficiaryData,
                transactionAmount: txAmount,
                userTextType: userTextType,
                tipoOperacion: tipoOperacion,
                externalID: txtExternalID
            }
        })





        //filtrando las operaciones
        //this.props.tipooperacion --- arreglo de tipos_operacion
        //ejemplp [1,2]


        if (this.props.tipooperacion && this.props.tipooperacion.length > 0) {

            //Filtrar solo para un tipo de operacion
            //this.datos = raw_datos.filter((unaOperacion) => (unaOperacion.type == this.props.tipooperacion))



            return raw_datos1.filter((unaOperacion) => {

                return this.props.tipooperacion.includes(unaOperacion.tipoOperacion)

            }


                /*(unaOperacion) => {

                    

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


    getDatosdeTX = async () => {
        //const accessToken = API.getTokenFromsessionStorage();

        //this.api = new API(accessToken);


        const raw_datos = await this.api.getTrData(this.total_tx_a_solicitar);
        //console.log("DATOS RAW TR LIST")
        //console.log(raw_datos)

        let datos = [];
        datos = await this.transformarRawDatos(raw_datos);

        //console.log("DATOS normalizados TR LIST")
        //console.log(datos)





        //obteniendo lista de beneficiarios
        //this.beneficiarios.nameList
        await datos.map((unDato, i) => {

            if (unDato.beneficiaryName === '-') {
                return;
            }


            const existe = this.beneficiarios.nameList.filter(unNombre => unNombre.beneficiaryFullName === unDato.beneficiaryName)[0];



            if (!existe) {
                const nuevoObjeto = {
                    id: i,
                    beneficiaryFullName: unDato.beneficiaryName
                }
                this.beneficiarios.nameList.push(
                    nuevoObjeto
                )
            } else {
                //console.log(existe)
            }

        })

        return new Promise((resolve, reject) => {



            resolve(datos);


            /*
                        if(somethingSuccesfulHappened) {
                           const successObject = {
                              msg: 'Success',
                              data,//...some data we got back
                           }
                           resolve(successObject); 
                        } else {
                           const errorObject = {
                              msg: 'An error occured',
                              error, //...some error we got back
                           }
                           reject(errorObject);
                        }
                    
            
                    
            */
        }
        );






    }


    crearSocket = () => {

   

        const query = {
            token: this.accessToken
        }

        // -----   Creando el socket  ------------------------------------------------
        this.socket = io(API.baseSocketURL, {
            path: this.subscriptionPath,
            query: query,
        });

        // ----- Si ocurre algun error --------------------------------------------------
        this.socket.on('error', (error) => {
            console.log('Socket ListTX ERROR: ', {
                event: 'error',
                data: error
            });
        });



        // ----- Socket conectado  ---------------------------------------------------
        this.socket.on("connect", (datos) => {
            console.log("Socket LIST TX conectado correctamente");
            console.log("socket LIST TX id:" + this.socket.id); // x8WIv7-mJelg7on_ALbx

            // this.socket.emit('subscribe', ['TRANSACTIONS']); //recibe todas las transacciones ok
            //Creando subscripcion a todas las transacciones de la wallet
            this.socket.emit('subscribe', [`TRANSACTION_${this.walletAddress}`]);
        });

        // ----- Socket ReConectado  --------------------------------------------------- 
        this.socket.on('reconnect', () => {
            console.log('Socket LIST TX RE conectado ', this.socket.connected);
        });




        // ----- Si recibe mensaje del tipo  TRANSACTION_UPDATE --------------------------------------------------
        this.socket.on('TRANSACTION_UPDATE', async (data) => {
            console.log('SOCKET: TRANSACTION_UPDATE LIST TX recibiendo datos de servidor');

            //console.log(data)
            //console.log(data.transactionStatus)
            //console.log(data.transactionID)
          

            if (!data) {
                //console.log("Solicitando lista de TX al servidor en SOCKET")
                const raw_datos = await this.api.getTrData(this.total_tx_a_solicitar);
                //console.log("TRANSACTION_UPDATE: lista de TX recibidas en SOCKET por getTrData")
                //console.log(raw_datos)
                this.datos = [];
                this.datos = await this.transformarRawDatos(raw_datos);
               

            } else {

                //console.log("Hay datos de websocket en lista de TX Update")
                //console.log(data)
                //console.log(data.transactionStatus)
                //console.log(data.transactionID)
            
               
                for (let v of this.datos) {
                    if (v.transactionID === data.transactionID) {
                        v.transactionStatus = data.transactionStatus;                     
                    }
                }
               
            }

            if (this.datos) {

              // console.log("DATOS ")
              //  console.log(this.datos)
                this.actualizarDatos(this.datos);
            }


        });

        // ----- Si recibe mensaje del tipo  'TRANSACTION_CREATED' --------------------------------------------------
        this.socket.on('TRANSACTION_CREATED', async (data) => {
            console.log('SOCKET: TRANSACTION_CREATED LIST TX recibiendo datos de servidor');

         
          

            if (!data) {
                //console.log("Solicitando lista de TX al servidor en SOCKET")
                const raw_datos = await this.api.getTrData(this.total_tx_a_solicitar);
//                console.log("TRANSACTION_CREATED: lista de TX recibidas en SOCKET por getTrData")
  //              console.log(raw_datos)
                this.datos = [];
                this.datos = await this.transformarRawDatos(raw_datos);


            } else {

       
               

                
                //console.log("Hay datos de websocket en lista de TX Create")
                //console.log(data);

                const raw_datos = {
                    status: 200,
                    data: {
                        data: new Array(data)
                    }
                }

                const unDato = await this.transformarRawDatos(raw_datos);
          

                //console.log("Un Dato")
                //console.log(unDato)
                if (unDato && unDato.length > 0) {                    
                    unDato.forEach(element => {
                        //console.log(element);
                        this.datos.push(element);
                    });
                }



            }

      
            if (this.datos) {
                
               this.actualizarDatos(this.datos);
            }


        });

    }


}


