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
              <div class="grid grid-cols-1 sm:grid-cols-2 w-full gap-y-0 gap-x-2 ">

                  <div class="form-control w-full sm:row-start-1 ">
                    <label class="label">
                      <span class="label-text">Select Beneficiary</span>
                    </label>
                    <select class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario">
                      <t t-foreach="this.props.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                        <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                      </t>             
                    </select>
                  </div>   
              

                  <div class="form-control w-full  sm:row-start-2 ">
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

                


                  <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                      <span class="label-text">Card Number</span>
                    </label>
                    <input type="text" t-att-value="this.state.cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                  </div>

                  <div class=" flex items-center w-full row-start-3 mt-1">
                      <img t-att-src="this.state.cardBankImage" alt="" class="ml-3  sm:w-[10vw] w-[30vw]"/>
                  </div>

                  
                <div class="form-control w-full  sm:row-start-4 ">
                  <label class="label">
                    <span class="label-text">Card Holder Name</span>
                  </label>
                  <input type="text"   t-att-value="this.state.cardHolderName" maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangeCardHolderInput" />   
                </div>

                <div class="form-control w-full sm:row-start-4 ">
                  <label class="label">
                    <span class="label-text">Contact Phone</span>
                  </label>
                  <input type="text" t-att-value="this.state.contactPhone"  maxlength="300" placeholder="" class="input input-bordered w-full "  t-on-input="onChangePhoneInput" />   
                </div>

                <div class="form-control  sm:col-span-2 w-full sm:row-start-5">
                  <label class="label">
                    <span class="label-text">Delivery Address</span>
                  </label>
                
                  <textarea t-att-value="this.state.deliveryAddress" class="textarea textarea-bordered" placeholder="" t-on-input="onChangeAddressInput" ></textarea>
                </div>

               
                <div class="form-control w-full sm:row-start-6 ">
                  <label class="label">
                    <span class="label-text">Province</span>
                  </label>
                  <select t-att-value="this.state.deliveryAreaID" class="select select-bordered w-full" t-on-input="onChangeProvince">
                    <t t-foreach="this.provincias" t-as="unaProvincia" t-key="unaProvincia.id">
                      <option t-att-value="unaProvincia.id"><t t-esc="unaProvincia.nombre"/></option>
                    </t>             
                  </select>
                </div>

                <div class="form-control w-full sm:row-start-6 ">
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



                <div class="form-control w-full max-w-xs sm:row-start-7 ">
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
      /*this.provincias = Provincias;
      this.municipios = this.provincias[0].municipios;
      this.state.deliveryCity  = this.provincias[0].municipios[0];
      this.state.receiverCity = this.provincias[0].municipios[0];
      this.state.deliveryZona = this.provincias[0].id==="4" ? "Habana" : "Provincias";*/

      this.provincias = Provincias;
      console.log(this.provincias[0].municipios)

      this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);

      console.log(this.municipios)






    });

    onRendered(() => {

    });

    onMounted(() => {
      this.inicializarDatosBeneficiario(this.props.beneficiariosNames[0]._id);
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
      this.props.onChangeDatosBeneficiarios(this.state);
      //TODO: si es un card nuevo agregarlo?
    }
  }, API.tiempoDebounce);

  onChangeCardInput(event) {
    // this.inputCardNumber.el.value = UImanager.formatCardNumber(event.target.value);
  };



  onChangeCardHolderInput = API.debounce(async (event) => {
    this.state.cardHolderName = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangeAddressInput = API.debounce(async (event) => {
    this.state.deliveryAddress = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);

  onChangePhoneInput = API.debounce(async (event) => {
    this.state.contactPhone = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);


  onChangeSelectedBeneficiario = (event) => {
    const selectedBeneficiaryId = event.target.value;
    this.state.cardBankImage = "";
    this.state.bankName = "";
    this.inicializarDatosBeneficiario(selectedBeneficiaryId);
  }


  /*
  onChangeCityInput = API.debounce(async (event) => {
    this.state.receiverCity = event.target.value;

    this.props.onChangeDatosBeneficiarios(this.state);
  }, API.tiempoDebounce);*/



  //Evento al cambiar de provincia, se setea delivery area, se modifica la lista de municipips
  /* onChangeProvince = (event) => {
    console.log(event.target.value);
    const selectedProvinceId = event.target.value;
    let selectedProvince = this.provincias.filter(unaProvincia => unaProvincia.id === selectedProvinceId)[0];
    this.municipios = selectedProvince.municipios;
    this.state.deliveryCity  = selectedProvince.municipios[0];
    this.state.receiverCity = selectedProvince.municipios[0];
    this.state.deliveryZona = selectedProvince.id==="4" ? "Habana" : "Provincias";
    this.render();
    this.state.deliveryArea = selectedProvince.nombre;
    this.props.onChangeDatosBeneficiarios(this.state);
  };*/


  //Evento al cambiar de municipio
  /*onChangeCity = (event) => {   
    const selectedCity = event.target.value;
    this.state.deliveryCity = selectedCity;
    this.state.receiverCity = selectedCity;
    this.props.onChangeDatosBeneficiarios(this.state);
  };*/


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
      this.props.onChangeDatosBeneficiarios(this.state);
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
      this.props.onChangeDatosBeneficiarios(this.state);
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
      this.state.cardHolderName='' ;
    }
    
    this.props.onChangeDatosBeneficiarios(this.state);
  }


  inicializarDatosBeneficiario = async (idBeneficiario) => {
    const allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
    const selectedBenefiarioData = allDatosBeneficiariosFromStorage.filter(unDato => unDato._id === idBeneficiario)[0];



    if (selectedBenefiarioData) {
      this.inicializando = true;
            
       this.state.contactPhone = selectedBenefiarioData.deliveryPhone;
       this.state.deliveryAddress = selectedBenefiarioData.houseNumber + ', ' + selectedBenefiarioData.streetName + '. ZipCode: ' + selectedBenefiarioData.zipcode;


       
       this.state.cardHolderName ='';

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
 
      




      this.props.onChangeDatosBeneficiarios(this.state);
      this.inicializando = false;

    }

  }











}

