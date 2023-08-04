const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";




export class Beneficiarios extends Component {

  inicializandoCardList = false;

  tiempoDebounce = 1000; //milisegundos

  accessToken = '';



  //Lista de beneficiarios y de tarjetas
  selectedBeneficiaryId = useRef("selectedBeneficiaryId");
  selectedCard = useRef("selectedCard");

  //resto de los datos
  cardNumber = useRef("cardNumber");

  state = useState({
    cardBankImage:'',
    bankName:''
  })







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
                    <select t-ref="selectedBeneficiaryId"  class="select select-bordered w-full" t-on-input="onChangeSelectedBeneficiario" >
                      <option  t-att-value="-1" >Select Beneficiary</option>
                      <t t-foreach="this.props.beneficiariosNames" t-as="unBeneficiario" t-key="unBeneficiario._id">
                        <option t-att-value="unBeneficiario._id"><t t-esc="unBeneficiario.beneficiaryFullName"/></option>
                      </t>    
                                 
                    </select>
                  </div> 
                  
                  <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                        <span class="label-text">Select Card</span>
                    </label>
                  
                    <select t-ref="selectedCard" class="select select-bordered w-full" t-on-input="onChangeSelectedCard">
                      <option  t-att-value="-1" >Select Card</option>
                      <t t-foreach="this.props.cardsList" t-as="unCard" t-key="unCard.number">
                        <option t-att-value="unCard.number">
                           
                          <t t-esc="unCard.currency"/> -
                          <t t-esc="unCard.number"/>
                        </option>
                      </t>             
                  </select>
                 </div>


                 <div class="form-control w-full  sm:row-start-2 ">
                    <label class="label">
                      <span class="label-text">Card Number</span>
                    </label>
                    <input type="text" t-ref="cardNumber" maxlength="19" placeholder="0000-0000-0000-0000" class="input input-bordered w-full "  t-on-keydown="onCardInputKeyDown" t-on-input="onChangeCardInput" />   
                 </div>

                 <div class=" flex items-center w-full row-start-3 mt-1">
                  <img t-att-src="this.state.cardBankImage" alt="" class="ml-3  sm:w-[10vw] w-[30vw]"/>
                 </div>

                
                             
                  <div class="hidden"> 
                     <t t-esc="this.props.datosSelectedTX.txID"/>
                  </div>
              </div>
            </div>
            
        </div>    
  `;

  setup() {

    console.log("Card LIST")
    console.log(this.props);



    this.accessToken = API.getTokenFromSessionStorage();

    onWillStart(async () => {
      this.provincias = Provincias;
      this.municipios = UImanager.addKeyToMunicipios(this.provincias[0].municipios);
      const api = new API(this.accessToken);
      this.cardRegExp = await api.getCardRegExp();



    });

    onMounted(() => {
      console.log("Mounted")
      //console.log(this.props.beneficiariosNames[0].CI)

      //Cargando los datos del primer beneficiario de la lista
      this.setearBeneficiario(this.props.beneficiariosNames[0].CI);

    });


    onRendered(async () => {
      console.log("RENDER")
      console.log("Datos que llegan a beneficiario")
      console.log(this.props.datosSelectedTX)



      if (this.props.datosSelectedTX.allData != null) {
        console.log("Render: Invocado desde el padre, al seleccionar una TX")
        const CI = this.props.datosSelectedTX.allData.metadata.deliveryCI;
        await this.setearBeneficiario(CI);
      } else {
        console.log("Render: Cargando ventana por primera ves")
      }



    });


  }



  setearBeneficiario = async (CIBeneficiario) => {

    const beneficiarioName = this.props.beneficiariosNames.filter((unBeneficiario) => unBeneficiario.CI === CIBeneficiario)[0];
    console.log("Beneficiario name")
    console.log(beneficiarioName)
    this.selectedBeneficiaryId.el.value = beneficiarioName._id;

    this.setearDatosBeneficiario(beneficiarioName._id)





  }








  setearDatosBeneficiario = async (idBeneficiario) => {


    if (this.props.datosSelectedTX.allData == null) { return }


    const selectedCardNumber = this.props.datosSelectedTX.allData.metadata.cardNumber.replace(/ /g, "");

    console.log("Selected card " + selectedCardNumber)
    console.log(this.props.datosSelectedTX.allData.metadata.cardNumber)

    //const selectedCard = this.props.cardsList.filter((unCard)=>unCard.number ===selectedCardNumber )[0];
    //console.log(selectedCard.id)


    console.log(this.selectedCard.el.value)
    this.selectedCard.el.value = selectedCardNumber;

    console.log(this.selectedCard.el.value)


    const formatedCardNumber = UImanager.formatCardNumber(selectedCardNumber);
    this.cardNumber.el.value = formatedCardNumber;

    await this.buscarLogotipoBanco(selectedCardNumber);
    //this.selectedCard.el.value="9225959875865500"





  }



  onChangeSelectedCard = async (event) => {


    console.log('Cambio de CARD')
    console.log(this.props.cardsList);
    console.log(event.target.value)


    const formatedCardNumber = UImanager.formatCardNumber(event.target.value);
    console.log(formatedCardNumber)

    const cardData = this.props.cardsList.filter((unaCard) =>
      UImanager.formatCardNumber(unaCard.number) === formatedCardNumber
    )[0];



    if (cardData) {
      console.log("Hay card data");
      console.log(cardData);
      this.cardNumber.el.value = formatedCardNumber;

      //cardHolderName
      /*this.selectedCard.el.value = event.target.value; 
      
      this.state.cardNumber = formatedCardNumber;
      
      this.state.cardHolderName = cardData.cardHolderName;
      await this.buscarLogotipoBanco(this.state.cardNumber);*/
    } else {
      console.log("NO Hay card data");
      console.log(cardData);
      /*this.state.cardNumber = '';
      this.cardNumber.el.value='';
      this.state.cardHolderName = '';*/
    }



    //this.props.onChangeDatosBeneficiarios(this.state);
  }



  onChangeSelectedBeneficiario = async (event) => {
    const selectedBeneficiaryId = event.target.value;
   // this.props.onChangeDatosBeneficiarios(selectedBeneficiaryId)




    //await this.setearDatosBeneficiario(selectedBeneficiaryId);

    // this.state.cardBankImage = "";
    // this.state.bankName = "";
    // this.cambioBeneficiario = true;
    // this.state.selectedBeneficiaryId = selectedBeneficiaryId;

    // this.inicializarDatosBeneficiario(selectedBeneficiaryId);


  }

  onCardInputKeyDown = API.debounce(async (event) => {
    if (event.target.value.length === 19) {
      this.state.cardNumber = event.target.value;
      this.cardNumber.el.value =  event.target.value;
      this.buscarLogotipoBanco(this.state.cardNumber);
      this.props.onChangeDatosBeneficiarios(this.state);
      //TODO: si es un card nuevo agregarlo?
    }
  }, API.tiempoDebounce);


  async buscarLogotipoBanco(CardNumber) {
   // const cardWithoutSpaces = this.state.cardNumber.replace(/ /g, "");

    // const api = new API(this.accessToken);
    //const cardRegExp = await api.getCardRegExp();

    //console.log(typeof (cardRegExp));

    for (const key in this.cardRegExp) {

      const regexp = new RegExp(this.cardRegExp[key]);
      //const card = this.state.cardNumber.replace(/ /g, "");
      const resultado = regexp.test(CardNumber);
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
            this.state.cardBankImage='';
            this.state.bankName='';

            break;
        }

      }




    }




  }


}

