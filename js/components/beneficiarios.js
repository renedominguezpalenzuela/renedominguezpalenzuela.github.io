const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";




export class Beneficiarios extends Component {

    tiempoDebounce = 1000; //milisegundos

    accessToken = '';

    creandoNuevoBeneficiario = true;


    inputCardNumber = useRef("inputCardNumber");

    //"creditCards": ["9225 1234 1234 1234"]

    state = useState({
        _id: '',
        identityNumber: '',
        firstName: '',
        lastName: '',
        secondLastName: '',
        phone: '',
        streetName: '',
        houseNumber: '',
        zipcode: '',
        email: '',
        zone: '',
        province: '',
        municipality: '',
        countryIsoCode: "CU",
        country: "Cuba",
        selectedBeneficiaryId: '-1',
        selectedCardId: '-1',
        creditCards: []


    })

    cardsList = useState({});

    //TODO: mask in input 0000-0000-0000-0000
    static template = xml`  
    <div class="sm:grid sm:grid-cols-[54%_44%] sm:gap-2 h-[100vh]">
    <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
      <div class="card-title flex flex-col rounded-lg">
          
      </div>

      



      <div class="card-body items-center  ">
       
        
                    <div class="sm:grid sm:grid-cols-1 sm:grid-cols-2 w-full sm:grid-rows-10  gap-y-0 sm:gap-x-2 ">
                                
                        <!-- Seleccionar beneficiario -->
                        <div class="form-control w-full sm:row-start-1 sm:col-start-1  ">
                            <label class="label">
                                <span class="label-text">Select  Beneficiary</span>
                            </label>
                            <select t-att-value="this.state.selectedBeneficiaryId" class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario">
                                <option  t-att-value="-1" >Select Beneficiary</option>
                                <t t-foreach="this.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                                    <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                                </t>             
                            </select>
                        </div> 

                        <div class=" w-full sm:row-start-1 sm:col-start-2 flex justify-start items-end mt-3  ">
                            <button class="btn btn-primary  w-[38%] mr-3" t-on-click="onNewBeneficiario">New</button>
                            <button class="btn btn-primary  w-[38%] mr-3" t-on-click="onSaveBeneficiario">Save</button>
                            
                        </div>

                        
                
                        <!-- Nombre -->
                    
                        <div class="w-full  sm:row-start-3 sm:col-span-2 sm:col-start-1 sm:flex sm:justify-start      ">
                            <div class="form-control  ">
                                <label class="label">
                                    <span class="label-text">First Name</span>
                                </label>
                                <input type="text" t-att-value="this.state.firstName" t-on-input="onChangeFirstName"  maxlength="300" placeholder="First name" class="input input-bordered w-full " />   
                            </div>

                            <div class="form-control   sm:ml-2 ">
                                <label class="label">
                                    <span class="label-text">Last Name</span>
                                </label>
                                <input type="text" t-att-value="this.state.lastName"  t-on-input="onChangeLastName"  maxlength="300" placeholder="Last name" class="input input-bordered  w-full " /> 
                            </div>

                            <div class="form-control sm:ml-2">     
                                <label class="label">
                                    <span class="label-text">Second Last Name</span>
                                </label>
                                <input type="text" t-att-value="this.state.secondLastName" t-on-input="onChangeSecondLastName"  maxlength="300" placeholder="Second last name" class="input input-bordered w-full " />  
                            </div> 
                        </div>

                        <!-- Identificacion -->
                        <div class="form-control w-full sm:row-start-4 sm:col-start-1">
                            <label class="label">
                                <span class="label-text">ID</span>
                            </label>
                            <input type="text" t-att-value="this.state.identityNumber"  maxlength="300" placeholder="ID" class="input input-bordered w-full "  t-on-input="onChangeIDInput"  />   
                        </div>
                    
                        <!-- Telefono -->
                        <div class="form-control w-full sm:row-start-4 sm:col-start-2">
                            <label class="label">
                                <span class="label-text">Contact Phone</span>
                            </label>
                            <input type="text" t-att-value="this.state.phone"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhoneInput" />   
                        </div>

                    
                        <!-- Address -->
                        <div class="w-full  sm:row-start-5 sm:col-span-2 sm:col-start-1 sm:flex sm:justify-start ">
                            <div class="form-control  sm:w-[70%]">
                                <label class="label">
                                    <span class="label-text">Street Name</span>
                                </label>
                                <input type="text" t-att-value="this.state.streetName" t-on-input="onChangeStreetName"  maxlength="300" placeholder="Street Name" class="input input-bordered w-full " />   
                            </div>

                            <div class="form-control    sm:ml-2 ">
                                <label class="label">
                                    <span class="label-text">House Number</span>
                                </label>
                                <input type="text" t-att-value="this.state.houseNumber"  t-on-input="onChangeHouseNumber"  maxlength="300" placeholder="House Number" class="input input-bordered  w-full " /> 
                            </div>

                            <div class="form-control  sm:ml-2">     
                                <label class="label">
                                    <span class="label-text">Zip Code</span>
                                </label>
                                <input type="text" t-att-value="this.state.zipcode" t-on-input="onChangeZipCode"  maxlength="300" placeholder="Zip Code" class="input input-bordered w-full " />  
                            </div> 
                        </div>

                        <!-- Email -->
                        <div class="form-control w-full sm:row-start-6 sm:col-start-1">
                            <label class="label">
                                <span class="label-text">Email Address</span>
                            </label>
                            <input type="text" t-att-value="this.state.email"  maxlength="300" placeholder="Email Address" class="input input-bordered w-full "  t-on-input="onChangeEmail" />   
                        </div>


                        
                        <!-- Provincia -->
                        <div class="form-control w-full sm:row-start-7 sm:col-start-1">
                        <label class="label">
                            <span class="label-text">Province</span>
                        </label>
                        <select t-att-value="this.state.provinceID" class="select select-bordered w-full" t-on-input="onChangeProvince">
                        <option t-att-disabled="true" t-att-value="-1" >Select Province</option>
                            <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                            <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                            </t>             
                        </select>
                        </div>

                        <!-- Municipio -->
                        <div class="form-control w-full sm:row-start-7 sm:col-start-2">
                        <label class="label">
                            <span class="label-text">City</span>
                        </label>
                        <select t-att-value="this.state.municipalityID" class="select select-bordered w-full" t-on-input="onChangeCity">
                            <option t-att-disabled="true" t-att-value="-1" >Select city</option>
                            <t t-foreach="this.municipios" t-as="unMunicipio" t-key="unMunicipio.id">
                            <option  t-att-value="unMunicipio.id"><t t-esc="unMunicipio.nombre"/></option>
                            </t>             
                        </select>
                        </div>

                        <!-- Pais -->
                        <div class="form-control w-full  sm:row-start-8 sm:col-start-2 ">
                            <label class="label">
                                <span class="label-text">Country</span>
                            </label>
                            <input type="text" value="Cuba" readonly="true" maxlength="100" placeholder="Country" class="input input-bordered w-full"  t-on-input="onChangeCountryInput" />   
                        </div>  
                    </div> 
          
      </div>
    </div>



        <div class="card  w-full bg-base-100 shadow-xl rounded-lg ">
            <div class="card-title flex flex-col rounded-lg">
                Card Data
            </div>
            <div class="card-body items-center ">
                <div class="form-control w-full  sm:row-start-8 sm:col-start-1">
                    <label class="label">
                        <span class="label-text">Select Card</span>
                    </label>
                    <select  t-att-value="this.state.selectedCardId" class="select select-bordered w-full" t-on-input="onChangeSelectedCard">
                        <option  t-att-value="-1" >Select Card</option>
                        <t t-foreach="cardsList" t-as="unCard" t-key="unCard.id">
                           <option t-att-value="unCard.id">
                            <t t-esc="unCard.cardHolderName"/>: <t t-esc="unCard.currency"/><t t-esc="unCard.number"/>
                           </option>
                        </t>             
                    </select>
                </div>

                

                <div class="form-control w-full  sm:row-start-9 sm:col-start-1">
                    <label class="label">
                        <span class="label-text">Card Number</span>
                    </label>
                    <input type="text" t-ref="inputCardNumber" t-att-value="this.state.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                </div>

                <div class="form-control w-full  sm:row-start-9 sm:col-start-2 ">
                    <label class="label">
                        <span class="label-text">Card Holder Name</span>
                    </label>
                    <input type="text" readonly="true"  t-att-value="this.state.cardHolderName" maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeCardHolderInput" />   
                </div>

                <div class=" flex items-center w-full sm:row-start-10 sm:col-start-2 mt-1">
                    <img t-att-src="this.state.cardBankImage" alt="" class="ml-3  sm:w-[10vw] w-[30vw]"/>
                </div>

                <div class="card-actions">
                    <div class=" w-full flex justify-start  mt-3  ">
                    
                        <button class="btn  w-[60%] mr-3" t-on-click="onNewCard">New Card </button>
                        <button class="btn  w-[60%] " t-on-click="onSaveCard">Save </button>
                    </div>
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



        for (const key in cardRegExp) {

            const regexp = new RegExp(cardRegExp[key]);
            const card = this.state.cardNumber.replace(/ /g, "");
            const resultado = regexp.test(card);
            if (resultado) {

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



    onChangeSelectedBeneficiario = (event) => {
        const selectedBeneficiaryId = event.target.value;

        this.state.cardBankImage = "";
        this.state.bankName = "";
        this.creandoNuevoBeneficiario = false;
        this.inicializarDatosBeneficiario(selectedBeneficiaryId);
    }






    onChangeFirstName = API.debounce(async (event) => {
        this.state.firstName = event.target.value;
    }, API.tiempoDebounce);

    onChangeLastName = API.debounce(async (event) => {
        this.state.lastName = event.target.value;
    }, API.tiempoDebounce);

    onChangeSecondLastName = API.debounce(async (event) => {
        this.state.secondLastName = event.target.value;
    }, API.tiempoDebounce);

    onChangeIDInput = API.debounce(async (event) => {
        this.state.identityNumber = event.target.value;
    }, API.tiempoDebounce);

    onChangePhoneInput = API.debounce(async (event) => {
        this.state.phone = event.target.value;
    }, API.tiempoDebounce);

    onChangeStreetName = API.debounce(async (event) => {
        this.state.streetName = event.target.value;
    }, API.tiempoDebounce);

    onChangeHouseNumber = API.debounce(async (event) => {
        this.state.houseNumber = event.target.value;
    }, API.tiempoDebounce);

    onChangeZipCode = API.debounce(async (event) => {
        this.state.zipcode = event.target.value;
    }, API.tiempoDebounce);

    onChangeEmail = API.debounce(async (event) => {
        this.state.email = event.target.value;
    }, API.tiempoDebounce);


    //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
    onChangeProvince = (event) => {
        if (this.inicializando) return;
        const selectedProvinceId = event.target.value;
        this.state.provinceID = event.target.value;
        let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
        if (selectedProvince) {
            this.municipios = UImanager.addKeyToMunicipios(selectedProvince.municipios);
            this.state.municipalityID = -1;
            this.state.municipality = '';
            this.state.province = selectedProvince.nombre;
            this.state.zone = selectedProvince.id === "4" ? "Habana" : "Provincias";

        }
    };

    //Evento al cambiar de municipio
    onChangeCity = (event) => {
        if (this.inicializando) return;
        const selectedCityId = event.target.value;
        let selectedMunicipio = this.municipios[selectedCityId];
        console.log(selectedMunicipio)
        if (selectedMunicipio) {
            this.state.municipality = selectedMunicipio.nombre;
            this.state.municipalityID = selectedCityId;
            this.state.zone = this.state.provinceID === "4" ? "Habana" : "Provincias";
        }
    };











    onCardInputKeyDown = API.debounce(async (event) => {
        this.state.cardNumber = event.target.value;
        if (event.target.value.length === 19) {

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





    onChangeSelectedCard = async (event) => {
        const id = event.target.value;
        this.state.selectedCardId = id;
        console.log('Seleccionado')
        console.log(id)

        if (id === '-1') {
            return
        }



        const cardData = this.cardsList.filter((unaCard) =>

            unaCard.id == id

        )[0];


        if (cardData) {
            const formatedCardNumber = UImanager.formatCardNumber(cardData.number)


            this.state.cardNumber = formatedCardNumber;
            this.state.cardHolderName = cardData.cardHolderName;
            await this.buscarLogotipoBanco(this.state.cardNumber);
        } else {

            this.state.cardNumber = '';
            this.state.cardHolderName = '';
        }


    }


    inicializarDatosBeneficiario = async (idBeneficiario) => {
        this.state.selectedBeneficiaryId = idBeneficiario;

        if (idBeneficiario === '-1') {
            this.creandoNuevoBeneficiario = true;
            this.state.identityNumber = '';
            this.state.firstName = '';
            this.state.lastName = '';
            this.state.secondLastName = '';
            this.state.phone = '';
            this.state.streetName = '';
            this.state.houseNumber = '';
            this.state.zipcode = '';
            this.state.email = '';
            this.state._id = '';
            this.state.provinceID = "-1";
            this.state.province = "";
            this.state.municipalityID = -1;
            this.state.municipality = '';
            this.state.creditCards = [];
            return;

        }
        const allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
        const selectedBenefiarioData = allDatosBeneficiariosFromStorage.filter(unDato => unDato._id === idBeneficiario)[0];




        if (selectedBenefiarioData) {
            this.inicializando = true;


            this.state.identityNumber = selectedBenefiarioData.deliveryCI;
            this.state.firstName = selectedBenefiarioData.deliveryContact;
            this.state.lastName = selectedBenefiarioData.deliveryLastName;
            this.state.secondLastName = selectedBenefiarioData.deliverySecondLastName;
            this.state.phone = selectedBenefiarioData.deliveryPhone;
            this.state.streetName = selectedBenefiarioData.streetName;
            this.state.houseNumber = selectedBenefiarioData.houseNumber;
            this.state.zipcode = selectedBenefiarioData.zipcode;
            this.state.email = selectedBenefiarioData.email;
            this.state._id = selectedBenefiarioData._id;


            //this.state.deliveryAddress = selectedBenefiarioData.houseNumber + ', ' + selectedBenefiarioData.streetName + '. ZipCode: ' + selectedBenefiarioData.zipcode;





            this.state.cardHolderName = '';

            //Inicializando provincia
            const selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.nombre === selectedBenefiarioData.deliveryArea)[0];
            console.log(selectedProvince)
            if (selectedProvince) {
                this.state.provinceID = selectedProvince.id;
                this.state.province = selectedProvince.nombre;
            } else {
                this.state.provinceID = "-1";
                this.state.province = "";
                this.state.municipalityID = -1;
                this.state.municipality = '';
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
                this.state.municipalityID = selectedMuncipio.id;
                this.state.municipality = selectedMuncipio.nombre;
                this.state.zone = selectedProvince.id === "4" ? "Habana" : "Provincias";
            } else {
                this.state.municipalityID = -1;
                this.state.municipality = '';
            }




            //this.cardsList = selectedBenefiarioData.creditCards;

            this.cardsList = selectedBenefiarioData.creditCards.map(
                (el, i) => ({
                    id: i,
                    ...el


                })
            )

            console.log('Inicializando beneficiario')
            console.log(this.cardsList)
            this.state.cardNumber = '';
            this.inicializando = false;

        }

    }


    onNewBeneficiario() {
        this.creandoNuevoBeneficiario = true;
        this.state.identityNumber = '';
        this.state.firstName = '';
        this.state.lastName = '';
        this.state.secondLastName = '';
        this.state.phone = '';
        this.state.streetName = '';
        this.state.houseNumber = '';
        this.state.zipcode = '';
        this.state.email = '';
        this.state._id = '';
        this.state.provinceID = "-1";
        this.state.province = "";
        this.state.municipalityID = -1;
        this.state.municipality = '';
        this.state.selectedBeneficiaryId = '-1';
        this.state.creditCards = [];



    }



    async salvar() {
        console.log('Modificando datos de beneficiario')
        console.log(this.state)
        let respuesta = false;
        try {
            const api = new API(this.accessToken);
            let resultado = null;


            if (this.creandoNuevoBeneficiario) {
                console.log("Nuevo")
                console.log(this.state)
                resultado = await api.createBeneficiario(this.state);
            } else {
                console.log("Actualizandro")
                resultado = await api.updateBeneficiario(this.state);
            }



            console.log(resultado)
            //TODO OK
            if (resultado.status === 200 || resultado.status === 201) {

                respuesta = true;

                // if (resultado.data.status === 200) {
                Swal.fire("Beneficiary data saved correctly");
                // }
            }

            //Error  responde el API
            if (resultado.response) {
                Swal.fire({
                    icon: 'error', title: 'Error',
                    text: resultado.response.data.message
                })
            }
        } catch (error) {
            console.log(error);
            Swal.fire("Error saving data");
        }

        return respuesta;
    }
    //Boton salvar datos del beneficiario
    //mantener inactivo hasta que se haga un cambio en un campo
    async onSaveBeneficiario() {
        const nuevaCard = this.state.cardNumber;
        console.log('Card  a salvar')
        console.log(nuevaCard);
        if (nuevaCard) {
            if (this.cardsList && this.cardsList.length > 0) {

                //la busco en cardList
                const cardExisteenLista = this.cardsList.filter(unCard => UImanager.formatCardNumber(unCard.number) === UImanager.formatCardNumber(nuevaCard))[0];
                console.log('Card Existe')
                console.log(cardExisteenLista)

                if (!cardExisteenLista && cardExisteenLista != '') {
                    this.state.creditCards = this.cardsList.map((unCard) => unCard.number);
                    this.state.creditCards.push(nuevaCard.split(" ").join(""))

                }

            } else {

                this.state.creditCards.push(nuevaCard.split(" ").join(""))
                console.log("Salvando")
                console.log(this.state.creditCards)

            }
        }


        const respuesta = await this.salvar();

        if (respuesta) {

            console.log('Pidiendo beneficiarios en usuario ')

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

            if (this.creandoNuevoBeneficiario) {
                this.creandoNuevoBeneficiario = false;
                console.log('nuevo')
                console.log(this.beneficiariosNames.length)
                this.inicializarDatosBeneficiario(this.beneficiariosNames[this.beneficiariosNames.length - 1]._id);
                //this.state.selectedBeneficiaryId =this.beneficiariosNames.length - 1;
            }
        }

    }

    //al iniciar mantener todos los campos disabled hasta que se presione el boton new
    async onNewCard() {
        this.state.cardNumber = '';
        this.state.cardBankImage = '';
        this.state.selectedCardId = '-1'
    }

    async onSaveCard() {

        const nuevaCard = this.state.cardNumber;
        console.log('Card  a salvar')
        console.log(nuevaCard);
        if (nuevaCard) {

            console.log('Lista')
            console.log(this.cardsList)
            console.log(this.cardsList.length)

            if (!this.cardsList || !this.cardsList.length) {

                return
            }

            //la busco en cardList
            const cardExisteenLista = this.cardsList.filter(unCard => UImanager.formatCardNumber(unCard.number) === UImanager.formatCardNumber(nuevaCard))[0];
            console.log('Card Existe')
            console.log(cardExisteenLista)


            if (!cardExisteenLista && cardExisteenLista != '') {
                this.state.creditCards = this.cardsList.map((unCard) => unCard.number);

                this.state.creditCards.push(nuevaCard.split(" ").join(""))
                console.log("Salvando")
                console.log(this.state.creditCards)
            } else {
                return
            }
        }





        //this.state.creditCards

        const respuesta = await this.salvar();

        //this.cardsList = selectedBenefiarioData.creditCards;
        if (respuesta) {
            console.log('Pidiendo beneficiarios en cards ')

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

            if (this.creandoNuevoBeneficiario) {
                this.creandoNuevoBeneficiario = false;

                this.inicializarDatosBeneficiario(this.beneficiariosNames.length - 1);
                this.state.selectedBeneficiaryId = this.beneficiariosNames.length - 1;
            }
        }

    }



}



