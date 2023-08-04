const { Component, mount, xml, useState, useRef, onMounted, onRendered, onWillStart, onWillUpdateProps } = owl;


import { API, UImanager } from "../utils.js";
import { Provincias } from "../../data/provincias_cu.js";




export class Beneficiarios extends Component {

  inicializandoCardList = false;

  tiempoDebounce = 1000; //milisegundos

  accessToken = '';

  selectedCard = useRef("selectedCard");
  cardNumber = useRef("cardNumber");

  selectedBeneficiaryId = useRef("selectedBeneficiaryId");



 


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

      /*  if (this.inicializandoCardList) {
          console.log("Inicializando cardList")
          this.inicializandoCardList = false;
          return;
        }*/

      /*if (cambiandoBeneficiario) {
        console.log("Cambiando beneficiario");
        this.cambiandoBeneficiario = false;
        return;
      }*/



      if (this.props.datosSelectedTX.allData != null) {


        const CI = this.props.datosSelectedTX.allData.metadata.deliveryCI;

       // await this.setearBeneficiario(CI);

        console.log("Render: Invocado desde el padre, al seleccionar una TX")


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

   // this.setearDatosBeneficiario(beneficiarioName._id)





  }








  setearDatosBeneficiario = async (idBeneficiario) => {


    const allDatosBeneficiariosFromStorage = JSON.parse(window.sessionStorage.getItem('beneficiariesFullData'));
    const selectedBenefiarioData = allDatosBeneficiariosFromStorage.filter(unDato => unDato._id === idBeneficiario)[0];
    console.log(selectedBenefiarioData)

    //seteando lista de tarjetas del beneficiario
    this.inicializandoCardList = true;
    //this.cardsList.value = selectedBenefiarioData.creditCards;
    //await this.render();



    //await this.setearDatosBeneficiario(beneficiario._id);
    if (!selectedBenefiarioData) return;
    console.log("allData")
    console.log(this.props.datosSelectedTX.allData)
    if (!this.props.datosSelectedTX.allData) return;

 


    console.log("Selected Beneficiary Data")
    console.log(selectedBenefiarioData)
    //console.log("Card List")
    //console.log(this.cardsList.value)



    const selectedCardNumber = this.props.datosSelectedTX.allData.metadata.cardNumber;
    const selectedCardID = selectedCardNumber.replace(/ /g, "");
    console.log("Selected card " + selectedCardID)


    //this.selectedCard.value = selectedCardID;
    // this.inicializandoCardList = false;



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
      //cardHolderName
      /*this.selectedCard.el.value = event.target.value; 
      
      this.state.cardNumber = formatedCardNumber;
      this.cardNumber.el.value = formatedCardNumber;
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
    this.props.onChangeDatosBeneficiarios(selectedBeneficiaryId)

    


    //await this.setearDatosBeneficiario(selectedBeneficiaryId);

    // this.state.cardBankImage = "";
    // this.state.bankName = "";
    // this.cambioBeneficiario = true;
    // this.state.selectedBeneficiaryId = selectedBeneficiaryId;

    // this.inicializarDatosBeneficiario(selectedBeneficiaryId);


  }

}

