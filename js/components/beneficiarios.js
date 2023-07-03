const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";




export class Beneficiarios extends Component {

    tiempoDebounce = 1000; //milisegundos

    accessToken = '';

    state = useState({
        cardNumber: '',
        cardHolderName: '',
        cardBankImage: '',
        bankName: '',
        contactPhone: '',
        deliveryAddress: '',
        receiverCity: '',          //Municipio
        receiverCityID: '',        //Municipio id 
        deliveryArea: '',           //Provincia
        deliveryAreaID: '',         //Provincia id
        deliveryCountry: 'Cuba',
        deliveryCountryCode: 'CU',
        receiverCountry: 'CUB'
    })

    cardsList = useState({});

    //TODO: mask in input 0000-0000-0000-0000
    static template = xml`  
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg mt-2">
            <div class="card-title flex flex-col rounded-lg pt-2">
               <div>Beneficiary</div> 
            </div>

            <div class="card-body items-center   ">
                <div class="grid grid-cols-1 sm:grid-cols-2 w-full sm:grid-rows-10  gap-y-0 gap-x-2 ">

                    <div class="form-control w-full sm:row-start-1 sm:col-start-1  ">
                        <label class="label">
                            <span class="label-text">Select  Beneficiary</span>
                        </label>
                        <select class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario">
                            <option t-att-disabled="true" t-att-value="-1" >Select Beneficiary</option>
                            <t t-foreach="this.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                                <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                            </t>             
                        </select>
                    </div> 

                    <div class=" w-full sm:row-start-1 sm:col-start-2 flex justify-start items-end mt-3  ">
                        <button class="btn btn-primary  w-[28%] mr-3" t-on-click="onNew">New</button>
                        <button class="btn btn-primary  w-[28%] mr-3" t-on-click="onSave">Save</button>
                        <button class="btn btn-primary  w-[28%]" t-on-click="onDelete">Delete</button>
                    </div>

                    
             

                    <div class="w-full  flex justify-start items-end  sm:col-start-1  sm:col-span-2 sm:row-start-3 ">
                        <div class="form-control  w-full">
                            <label class="label">
                                <span class="label-text">First Name</span>
                            </label>
                            <input type="text" t-att-value="this.state.deliveryFirstName" t-on-input="onChangeFirstName"  maxlength="300" placeholder="First name" class="input input-bordered w-full " />   
                        </div>

                        <div class="form-control   w-full ml-2 ">
                            <label class="label">
                                <span class="label-text">Last Name</span>
                            </label>
                            <input type="text" t-att-value="this.state.deliveryLastName"  t-on-input="onChangeLastName"  maxlength="300" placeholder="Last name" class="input input-bordered  w-full " /> 
                        </div>

                        <div class="form-control w-full ml-2">     
                            <label class="label">
                                <span class="label-text">Second Last Name</span>
                            </label>
                            <input type="text" t-att-value="this.state.deliverySecondLastName" t-on-input="onChangeSecondLastName"  maxlength="300" placeholder="Second last name" class="input input-bordered w-full " />  
                        </div> 
                    </div>

                    <div class="form-control w-full  sm:row-start-4 sm:col-start-1">
                        <label class="label">
                            <span class="label-text">Select Card</span>
                        </label>
                        <select class="select select-bordered w-full" t-on-input="onChangeSelectedCard">
                            <option  t-att-value="-1" >Select Card</option>
                            <t t-foreach="cardsList" t-as="unCard" t-key="unCard.number">
                                <option t-att-value="unCard.number"><t t-esc="unCard.cardHolderName"/>: <t t-esc="unCard.currency"/><t t-esc="unCard.number"/></option>
                            </t>             
                        </select>
                    </div>

                    <div class=" w-full sm:row-start-4 sm:col-start-2 flex justify-start items-end mt-3  ">
                        <button class="btn btn-primary  w-[28%] mr-3" t-on-click="onNew">Add Card</button>
                        <button class="btn btn-primary  w-[28%] mr-3" t-on-click="onSave">Save Card</button>
                        <button class="btn btn-primary  w-[28%]" t-on-click="onDelete">Delete Card</button>
                    </div>

                    <div class="form-control w-full  sm:row-start-5 sm:col-start-1">
                        <label class="label">
                            <span class="label-text">Card Number</span>
                        </label>
                        <input type="text" t-att-value="this.state.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                    </div>

                    <div class="form-control w-full  sm:row-start-5 sm:col-start-2 ">
                        <label class="label">
                            <span class="label-text">Card Holder Name</span>
                        </label>
                        <input type="text"   t-att-value="this.state.cardHolderName" maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeCardHolderInput" />   
                    </div>
                    
                    <div class=" flex items-center w-full sm:row-start-6 sm:col-start-2 mt-1">
                        <img t-att-src="this.state.cardBankImage" alt="" class="ml-3  sm:w-[10vw] w-[30vw]"/>
                    </div>

                   
                    
                    <div class="form-control w-full sm:row-start-7 sm:col-start-2">
                        <label class="label">
                            <span class="label-text">Contact Phone</span>
                        </label>
                        <input type="text" t-att-value="this.state.contactPhone"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhoneInput" />   
                    </div>

                    <div class="form-control   w-full sm:row-start-7 sm:col-start-1">
                        <label class="label">
                            <span class="label-text">Delivery Address</span>
                        </label>

                        <textarea t-att-value="this.state.deliveryAddress" class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                    </div>

                    

                    <div class="form-control w-full sm:row-start-9 ">
                    <label class="label">
                        <span class="label-text">Province</span>
                    </label>
                    <select t-att-value="this.state.deliveryAreaID" class="select select-bordered w-full" t-on-input="onChangeProvince">
                    <option t-att-disabled="true" t-att-value="-1" >Select Province</option>
                        <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                        <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                        </t>             
                    </select>
                    </div>

                    <div class="form-control w-full sm:row-start-9 ">
                    <label class="label">
                        <span class="label-text">City</span>
                    </label>
                    <select t-att-value="this.state.receiverCityID" class="select select-bordered w-full" t-on-input="onChangeCity">
                        <option t-att-disabled="true" t-att-value="-1" >Select city</option>
                        <t t-foreach="this.municipios" t-as="unMunicipio" t-key="unMunicipio.id">
                        <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
                        </t>             
                    </select>
                    </div>

                    <div class="form-control w-full  sm:row-start-10 sm:col-start-1 ">
                        <label class="label">
                            <span class="label-text">Country</span>
                        </label>
                        <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="input input-bordered w-full"  t-on-input="onChangeCountryInput" />   
                    </div>  

                  
                  

                    
           

                </div>
            </div>         
        </div>     
  `;


    setup() {

        this.accessToken = window.sessionStorage.getItem('accessToken');


        onWillStart(async () => {
            this.provincias = Provincias;
            this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);

            //obteniendo todos los datos de los beneficiarios desde el API
            const api = new API(this.accessToken);
            const allDatosBeneficiarios = await api.getAllDatosBeneficiarios();

            console.log(allDatosBeneficiarios)

            if (allDatosBeneficiarios) {
                window.sessionStorage.setItem('beneficiariesFullData', JSON.stringify(allDatosBeneficiarios));
            }
            this.allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
            this.beneficiariosNames = this.allDatosBeneficiariosFromStorage.map(el => ({
                beneficiaryFullName: el.beneficiaryFullName,
                _id: el._id
            }));

            console.log(this.beneficiariosNames);


        });

        onRendered(() => {

        });

        onMounted(() => {
           // this.inicializarDatosBeneficiario(this.beneficiariosNames[0]._id);
        });

    }


    async buscarLogotipoBanco(CardNumber) {
        const cardWithoutSpaces = this.state.cardNumber.replace(/ /g, "");

        const api = new API(this.accessToken);
        const cardRegExp = await api.getCardRegExp();

        console.log(typeof (cardRegExp));

        for (const key in cardRegExp) {

            const regexp = new RegExp(cardRegExp[key]);
            const card = this.state.cardNumber.replace(/ /g, "");
            const resultado = regexp.test(card);
            if (resultado) {
                console.log(key)
                switch (key) {
                    case 'BANDEC_CARD':
                        //Poner imagen
                        this.state.cardBankImage = "img/logo-bandec.png";
                        this.state.bankName = "BANDEC";

                        break;

                    case 'BANMET_CARD':
                        //Poner imagen
                        this.state.cardBankImage = "img/logo-metro.png";
                        this.state.bankName = "METROPOLITANO";

                        break;

                    case 'BPA_CARD':
                        //Poner imagen
                        this.state.cardBankImage = "img/logo-bpa.png";
                        this.state.bankName = "BPA";

                        break;

                    default:
                        break;
                }
            }
        }
    }


    onCardInputKeyDown = API.debounce(async (event) => {
        if (event.target.value.length === 19) {
            this.state.cardNumber = event.target.value;
            this.buscarLogotipoBanco(this.state.cardNumber);
            
            //TODO: si es un card nuevo agregarlo?
        }
    }, API.tiempoDebounce);

    onChangeCardInput(event) {
         this.inputCardNumber.el.value = UImanager.formatCardNumber(event.target.value);
    };

    onChangeCardHolderInput = API.debounce(async (event) => {
        this.state.cardHolderName = event.target.value;       
    }, API.tiempoDebounce);

    onChangeAddressInput = API.debounce(async (event) => {
        this.state.deliveryAddress = event.target.value;       
    }, API.tiempoDebounce);

    onChangePhoneInput = API.debounce(async (event) => {
        this.state.contactPhone = event.target.value;       
    }, API.tiempoDebounce);


    onChangeSelectedBeneficiario = (event) => {
        const selectedBeneficiaryId = event.target.value;
        this.state.cardBankImage = "";
        this.state.bankName = "";
        this.inicializarDatosBeneficiario(selectedBeneficiaryId);
    }

    //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
    onChangeProvince = (event) => {
        if (this.inicializando) return;
        const selectedProvinceId = event.target.value;
        this.state.deliveryAreaID = event.target.value;
        let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
        if (selectedProvince) {
            this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);
            this.state.receiverCityID = -1;
            this.state.receiverCity = '';
            this.state.deliveryArea = selectedProvince.nombre;
            this.state.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";      
        }
    };

    //Evento al cambiar de municipio
    onChangeCity = (event) => {
        if (this.inicializando) return;
        const selectedCityId = event.target.value;
        let selectedMunicipio = this.municipios[selectedCityId];
        console.log(selectedMunicipio)
        if (selectedMunicipio) {
            this.state.receiverCity = selectedMunicipio.nombre;
            this.state.receiverCityID = selectedCityId;   
        }
    };


    onChangeSelectedCard = async (event) => {
        // //Lista de tarjetas
        console.log('lista')
        console.log(this.cardsList);
        const formatedCardNumber = UImanager.formatCardNumber(event.target.value);

        const cardData = this.cardsList.filter((unaCard) =>
            UImanager.formatCardNumber(unaCard.number) === formatedCardNumber
        )[0];

        if (cardData) {
            console.log(cardData);
            //cardHolderName

            this.state.cardNumber = formatedCardNumber;
            this.state.cardHolderName = cardData.cardHolderName;
            await this.buscarLogotipoBanco(this.state.cardNumber);
        } else {
            console.log(cardData);
            this.state.cardNumber = '';
            this.state.cardHolderName = '';
        }

        
    }


    inicializarDatosBeneficiario = async (idBeneficiario) => {
        const allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
        const selectedBenefiarioData = allDatosBeneficiariosFromStorage.filter(unDato => unDato._id === idBeneficiario)[0];




        if (selectedBenefiarioData) {
            this.inicializando = true;

            this.state.contactPhone = selectedBenefiarioData.deliveryPhone;
            this.state.deliveryAddress = selectedBenefiarioData.houseNumber + ', ' + selectedBenefiarioData.streetName + '. ZipCode: ' + selectedBenefiarioData.zipcode;



            this.state.cardHolderName = '';

            //Inicializando provincia
            const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === selectedBenefiarioData.deliveryArea)[0];
            if (selectedProvince) {
                this.state.deliveryAreaID = selectedProvince.id;
                this.state.deliveryArea = selectedProvince.nombre;
            } else {
                this.state.deliveryAreaID = "-1";
                this.state.deliveryArea = "";
                this.state.receiverCityID = -1;
                this.state.receiverCity = '';
                return;
            }

            //inicializando municipio
            //this.municipios = selectedProvince.municipios;
            this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);

            // console.log("Beneficiario municipio:")
            // console.log(selectedBenefiarioData.deliveryCity)
            // console.log(selectedBenefiarioData)

            const selectedMuncipio = this.municipios.filter((unMunicipio) => {
                const comparacion = UImanager.eliminarAcentos(selectedBenefiarioData.deliveryCity) == UImanager.eliminarAcentos(unMunicipio.nombre);
                return comparacion
            })[0];



            if (selectedMuncipio) {
                this.state.receiverCityID = selectedMuncipio.id;
                this.state.receiverCity = selectedMuncipio.nombre;
                this.state.deliveryZona = selectedProvince.id === "4" ? "Habana" : "Provincias";
            } else {
                this.state.receiverCityID = -1;
                this.state.receiverCity = '';
            }




            this.cardsList = selectedBenefiarioData.creditCards;
            this.state.cardNumber = '';          
            this.inicializando = false;

        }

    }

}



