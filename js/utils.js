
/***************************************************************************************************** 
  Rene Dominguez Palenzuela
  28/05/2023 
 ******************************************************************************************************/

//TODO: minificar, ofuscar
//TODO: Crear funcion para mostrar mensajes, pasar solo el texto como parametro

const base_url = 'https://backend.ducapp.net';
const x_api_key = 'test.c6f50414-cc7f-5f00-bbb5-2d4eb771c41a';


export const baseSocketURL = "wss://backend.ducapp.net/";  //PRueba
//export const baseSocketURL = "https://backend.ducwallet.com"; //Produccion

//-------------------------------------------------------------------------------------------
//  Clase global para llamado al API
//-------------------------------------------------------------------------------------------
export class API {



  static baseSocketURL = "wss://backend.ducapp.net/";  //PRueba
  //static baseSocketURL = "https://backend.ducwallet.com"; //Produccion

  constructor(accessToken) {

    this.accessToken = accessToken;

    this.base_url = 'https://backend.ducapp.net';
    this.x_api_key = 'test.c6f50414-cc7f-5f00-bbb5-2d4eb771c41a';

    this.baseSocketURL = "wss://backend.ducapp.net/";  //PRueba
    //this.baseSocketURL = "https://backend.ducwallet.com"; //Produccion


    this.headers = {
      'authorization': `Bearer ${accessToken}`,
      'x-api-key': this.x_api_key,
      'Content-Type': 'application/json',
    }
  }

  //------------------------------------------------------------------------------------------------
  // Obtiene datos del usuario
  //------------------------------------------------------------------------------------------------
  async getUserProfile() {

    var config = {
      method: 'get',
      url: `${this.base_url}/api/private/users`,
      headers: this.headers,
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data.user;
    }).catch(function (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.message,
        text: 'Something went wrong requesting User Profile',
        footer: '<h5> Inspect console for details </h5>'
      })

      datos = error;
    });

    return datos;

  }


  //------------------------------------------------------------------------------------------------
  // Obtiene Expresiones Regulares para validar tarjetas
  //------------------------------------------------------------------------------------------------
  async getCardRegExp() {

    var config = {
      method: 'get',
      url: `${this.base_url}/api/private/delivery-card-regex`,
      headers: this.headers,
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;

    }).catch(function (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.message,
        text: 'Something went wrong requesting Card Regular Expressions',
        footer: '<h5> Inspect console for details </h5>'
      })

      datos = error;
    });

    return datos;

  }

  //------------------------------------------------------------------------------------------------
  // Obtiene el fee a aplicar
  //------------------------------------------------------------------------------------------------
  // service: cardCUP |	cardUSD	| deliveryCUP | deliveryUSD
  // zone: Provincias | Habana
  // amount: Total a enviar
  async getFee(service, zone, amount) {

    var config = {
      method: 'get',
      url: `${this.base_url}/api/private/fees/cu/${service}/${zone}?amount=${amount}`,
      headers: this.headers,
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
    }).catch(function (error) {
      console.log(error);
      datos = error;
    });

    return datos;

  }

  //------------------------------------------------------------------------------------------------
  // Obtiene todos los tipos de cambio
  //------------------------------------------------------------------------------------------------
  async getExchangeRate(moneda_base) {

    var config = {
      method: 'get',
      url: `${this.base_url}/api/private/rates?base=${moneda_base}`,
      headers: this.headers,
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data.rates;

      return datos;



    }).catch(function (error) {
      console.log(error);
      datos = error;
    });

    return datos;

  }



  //-------------------------------------------------------------------------------
  //  createTX: Contabiliza transaccion
  //-------------------------------------------------------------------------------
  async createTX(datosTX) {
    //leer token desde local storage
    //const accessToken = window.sessionStorage.getItem('accessToken');


    var body = JSON.stringify(datosTX);

    var config = {
      method: 'post',
      url: `${base_url}/api/private/transactions/cash-out/creditcard`,
      headers: {
        'authorization': `Bearer ${this.accessToken}`,
        'x-api-key': x_api_key,
        'Content-Type': 'application/json',
      },
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
      console.log(datos);
    }).catch(function (error) {
      console.log("ERRROR")
      console.log(error);
      datos = error;
    });

    return datos;
  }



  //-------------------------------------------------------------------------------
  //  createTX: Contabiliza transaccion
  //-------------------------------------------------------------------------------
  async createTXHomeDeliveryCuba(datosTX) {
    //leer token desde local storage
    // const accessToken = window.sessionStorage.getItem('accessToken');


    var body = JSON.stringify(datosTX);

    var config = {
      method: 'post',
      url: `${base_url}/api/private/transactions/cash-out/delivery`,
      headers: {
        'authorization': `Bearer ${this.accessToken}`,
        'x-api-key': x_api_key,
        'Content-Type': 'application/json',
      },
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
      console.log(datos);
    }).catch(function (error) {
      console.log("ERRROR")
      console.log(error);
      datos = error;
    });

    return datos;
  }



 

  static tiempoDebounce = 300; //milisegundos

  static debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }


  static generateRandomID() {
    var date = new Date();
    date = date.toJSON().slice(0, 19).split`-`.join``.split`:`.join``;
    const randomSTR = Math.random().toString(36).substring(2, 10);
    const randomId = 'TR' + date + randomSTR;
    return randomId;
  }



  //-------------------------------------------------------------------------------
  //  getDatosTR
  //-------------------------------------------------------------------------------
  async getBalance(walletAddress) {
    //leer token desde local storage
    // const accessToken = window.sessionStorage.getItem('accessToken');
    // const walletAddress = window.sessionStorage.getItem('walletAddress');

    //console.log(walletAddress);

    var body = JSON.stringify({
      "walletAddress": walletAddress
    });


    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/get-balance`,
      headers: {
        'authorization': `Bearer ${this.accessToken}`,
        'x-api-key': x_api_key,
        'Content-Type': 'application/json',
      },
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
      // console.log(JSON.stringify(datos));  
    }).catch(function (error) {
      console.log(error);
      datos = error;

    });

    return datos;
  }


  
  //-------------------------------------------------------------------------------
  //  Modificar datos de un beneficiario
  //-------------------------------------------------------------------------------
  async updateBeneficiario(beneficiarioDatos) {


    var body = JSON.stringify(beneficiarioDatos);


    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/beneficiary/update`,
      headers: {
        'authorization': `Bearer ${this.accessToken}`,
        'x-api-key': x_api_key,
        'Content-Type': 'application/json',
      },
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response;
      console.log(response); 
    }).catch(function (error) {
   
      console.log(error);
      datos = error;

    });

    return datos;
  }


  
  //-------------------------------------------------------------------------------
  //  Crear nuevo  beneficiario
  //-------------------------------------------------------------------------------
  async createBeneficiario(beneficiarioDatos) {

    delete beneficiarioDatos["_id"];
   
   
    var body = JSON.stringify(beneficiarioDatos);


    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/beneficiary/create`,
      headers: {
        'authorization': `Bearer ${this.accessToken}`,
        'x-api-key': x_api_key,
        'Content-Type': 'application/json',
      },
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response;
       console.log(response);  
    }).catch(function (error) {
   
      console.log(error);
      datos = error;

    });

    return datos;
  }


  //------------------------------------------------------------------------------------------------
  // Obtiene todos los datos de los beneficiarios
  //------------------------------------------------------------------------------------------------

  async getAllDatosBeneficiarios() {

    var config = {
      method: 'post',
      url: `${this.base_url}/api/private/users/beneficiary`,
      headers: this.headers,
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
    }).catch(function (error) {
      console.log(error);
      datos = error;
    });

    return datos;

  }

  
  //------------------------------------------------------------------------------------------------
  // Obtiene datos de tipos de recargas de telefonos
  //------------------------------------------------------------------------------------------------

  async getProductosRecargaTelefon(countryPhone, currency) {

    const parametros = {
      destination: countryPhone,
      currency: currency
    }
    
    var body = JSON.stringify(parametros);

    var config = {
      method: 'post',
      url: `${this.base_url}/api/private/transactions/topup/operators`,
      headers:this.headers,
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
    }).catch(function (error) {
      console.log(error);
      datos = error;
    });

    return datos;

  }

  
  //-------------------------------------------------------------------------------
  //  sendPhoneRecharge: envia recarga de telefono
  //-------------------------------------------------------------------------------
  async sendPhoneRecharge(datosTX) {
  

    var body = JSON.stringify(datosTX);

    var config = {
      method: 'post',
      url: `${base_url}/api/private/transactions/topup/send`,
      headers: this.headers,
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response.data;
      console.log(datos);
    }).catch(function (error) {
      console.log("ERRROR")
      console.log(error);
      datos = error;
    });

    return datos;
  }

 

  /*
  if (this.changingSendAmount) { return; }

    this.changingSendAmount = false;
    this.changingReceiveAmount = true;

    const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos
    const receiveAmount = this.inputReceiveRef.el.value;
    const conversionRate = this.conversionRate.value;
    const sendAmount = (receiveAmount / conversionRate);

    if (receiveAmount > 0) {
      this.getFee(service, zone, sendAmount).then((feeData) => {
        const fee = feeData.fee;
        this.inputSendRef.el.value = UImgr.roundDec(sendAmount + fee);
        this.inputReceiveRef.el.value = UImgr.roundDec(receiveAmount);

        this.fee.value = fee;
        const feeSTR = fee.toFixed(2);
        const CurrencySTR = this.inputSendCurrencyRef.el.value.toUpperCase();
        this.feeSTR.value = `${feeSTR} ${CurrencySTR}`; //TODO convertir a 2 decimales  

        this.changingSendAmount = false;
        this.changingReceiveAmount = false;

      });
    } else {
      this.inputSendRef.el.value = UImgr.roundDec(0);
    }
  */


}




//-------------------------------------------------------------------------------
//  Solicitar estado del API
//-------------------------------------------------------------------------------
export function getAPIStatus() {
  axios.get(`${base_url}/api/health`)
    .then(response => {
      const api_status = response.data.status;
      console.log(`API Status`, api_status);

      Swal.fire({
        icon: api_status ? 'info' : 'error',
        title: 'API Status: ',
        text: api_status ? 'API is UP and runnig OK' : 'API is Down',
        footer: `<h5>Base URL: ${base_url}</h5>`
      });

    })
    .catch(error => {
      console.error(error.message);

      Swal.fire({
        icon: 'error',
        title: error.message,
        text: 'Something went wrong requesting API Status',
        footer: '<h5> Inspect console for details </h5>'
      })

    });
}

//-------------------------------------------------------------------------------
//  Login
//-------------------------------------------------------------------------------

export async function login(usr, pass) {
  const config = {
    headers: {
      "x-api-key": x_api_key,
      "Content-Type": "application/json"
    }
  };

  const datos = { "email": usr, "password": pass };

  let resultado = false;
  await axios.post(`${base_url}/api/auth/login`, datos, config)
    .then(response => {
      const datos = response.data;
      if (datos.accessToken) {
        resultado = true;
        //console.log(datos.accessToken);
        window.sessionStorage.setItem('accessToken', datos.accessToken)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login error',
          text: 'Check your credential data',
          footer: '<div>Press "Set Test Data" Button to get Test User credentials</div>'
        });
      }
    }).catch(error => {
      console.log('Login Error ');
      if (error.response) {
        console.error(error.response);
        Swal.fire({
          icon: 'error',
          title: error.response.data.error + ' code ' + error.response.data.statusCode,
          text: error.response.data.message,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong in login process',
          footer: '<h5> Inspect console for details </h5>'
        })
      }
      return error;

    });

  return resultado;
}



//TODO: minificar, ofuscar
//TODO: Crear funcion para mostrar mensajes, pasar solo el texto como parametro
//TODO: Poner animacion mientras no se reciban los datos
//TODO: Poner el maximo de records a pedir desde el api al lado del boton Refresh Data en un ComboBox

//-------------------------------------------------------------------------------
//  getDatosTR
//-------------------------------------------------------------------------------
export async function getTrData() {
  //leer token desde local storage
  const accessToken = window.sessionStorage.getItem('accessToken');

  var data = JSON.stringify({
    "filter": {
      "status": "queued"
    }
  });

  var config = {
    method: 'get',
    url: `${base_url}/api/private/transactions?skip=0&limit=100`,
    headers: {
      'authorization': `Bearer ${accessToken}`,
      'x-api-key': x_api_key,
      'Content-Type': 'application/json',
    },
    data: data
  }

  let datos = null;
  await axios(config).then(function (response) {
    datos = response.data.data;
  }).catch(function (error) {
    console.log(error);
    datos = error;
  });

  return datos;
}


//-------------------------------------------------------------------------------
//  getDatosTR
//-------------------------------------------------------------------------------
export async function getUsrInfo() {
  //leer token desde local storage
  const accessToken = window.sessionStorage.getItem('accessToken');

  var data = JSON.stringify({
    "filter": {
      "status": "queued"
    }
  });

  var config = {
    method: 'get',
    url: `${base_url}/api/private/users`,
    headers: {
      'authorization': `Bearer ${accessToken}`,
      'x-api-key': x_api_key,
      'Content-Type': 'application/json',
    },
    data: data
  }

  let datos = null;
  await axios(config).then(function (response) {
    datos = response.data;

    if (datos.user._id) {
      window.sessionStorage.setItem('userId', datos.user._id)
    }

    if (datos.user.walletAddress) {
      window.sessionStorage.setItem('walletAddress', datos.user.walletAddress)
    }

  }).catch(function (error) {
    console.log(error);
    datos = error;
  });

  return datos;
}

//---------------------------------------------------------------------------------------
// User interface manager
//--------------------------------------------------------------------------------------
export class UImanager {
   //----------------------------------------------------------------------------------
  //SendInput manejar eventos on change de 
  //----------------------------------------------------------------------------------
  static async onChangeSendInput(receiveCurrency, sendCurrency, sendAmount, conversionRate, accessToken) {

    const resultado = {
      fee: 0,
      feeSTR: '',
      receiveAmount: 0
    }

    if (conversionRate<=0) {
      return resultado;
    }

    const service = `card${receiveCurrency.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos   

    if (sendAmount > 0) {
      const api = new API(accessToken);
      const feeData = await api.getFee(service, zone, sendAmount);
        const fee = feeData.fee;
        resultado.fee = fee;
        const feeSTR = fee.toFixed(2);
        const CurrencySTR = sendCurrency.toUpperCase();
        resultado.feeSTR = `${feeSTR} ${CurrencySTR}`; //TODO convertir a 2 decimales  

        const receiveAmount = (sendAmount - fee) * conversionRate;
        if (receiveAmount > 0) {
          resultado.receiveAmount = this.roundDec(receiveAmount);
        } else {
          resultado.receiveAmount = this.roundDec(0);
        }      
    } else {
      resultado.receiveAmount = this.roundDec(0);
    }

    return resultado;



    /*if (this.changingReceiveAmount) { return; }
  
      this.changingSendAmount = true;
      this.changingReceiveAmount = false;
  
      const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;
      const zone = "Habana"; //TODO: obtener de datos
  
      const conversionRate = this.conversionRate.value;
      const sendAmount = this.inputSendRef.el.value;
      this.inputSendRef.el.value = UImgr.roundDec(sendAmount);
  
      if (sendAmount > 0) {
        this.getFee(service, zone, sendAmount).then((feeData) => {
          const fee = feeData.fee;
          this.fee.value = fee;
          const feeSTR = fee.toFixed(2);
          const CurrencySTR = this.inputSendCurrencyRef.el.value.toUpperCase();
          this.feeSTR.value = `${feeSTR} ${CurrencySTR}`; //TODO convertir a 2 decimales  
  
          const receiveAmount = (sendAmount - fee) * conversionRate;
  
          if (receiveAmount > 0) {
            this.inputReceiveRef.el.value = UImgr.roundDec(receiveAmount);
            this.changingSendAmount = false;
            this.changingReceiveAmount = false;
          } else {
            this.inputReceiveRef.el.value = UImgr.roundDec(0);
          }
  
        });
      } else {
        this.inputReceiveRef.el.value = UImgr.roundDec(0);
      }*/
  }




  
  //----------------------------------------------------------------------------------
  //ReceiveInput: manejar eventos on change de inputs send
  //----------------------------------------------------------------------------------
  static async onChangeReceiveInput(receiveCurrency, sendCurrency, receiveAmount, conversionRate, accessToken) {

    const resultado = {
      fee: 0,
      feeSTR: '',
      sendAmount: 0
    }

    if (conversionRate<=0) {
      return resultado;
    }

    const service = `card${receiveCurrency.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos  

  
    
    const sendAmount = (receiveAmount / conversionRate);

    if (receiveAmount > 0) {
      const api = new API(accessToken);
      const feeData = await api.getFee(service, zone, sendAmount)
        const fee = feeData.fee;
        resultado.sendAmount = this.roundDec(sendAmount + fee);        
        resultado.fee = fee;

        const feeSTR = fee.toFixed(2);
        const CurrencySTR = sendCurrency.toUpperCase();
        resultado.feeSTR = `${feeSTR} ${CurrencySTR}`; //TODO convertir a 2 decimales  

               
    } else {
      resultado.receiveAmount = this.roundDec(0);
      resultado.sendAmount = this.roundDec(0);
    }

    return resultado;

  }

  //https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  //TODO: Implementar pruebas  para ver todos los casos de uso posibles de conversion
  static roundDec(numero, dec_places = 2) {
    let negativo = 1;
    if (numero < 0) negativo = -1;
    const resultado = Number(Math.round(Math.abs(numero) + 'e' + dec_places) + 'e-' + dec_places)
    return (resultado * negativo).toFixed(dec_places);
  }
  
  static addKeyToMunicipios(municipios) {
    return municipios.map((unMunicipio, i) => ({
      id: i,
      nombre: unMunicipio
    }));
  }


    //https://stackoverflow.com/questions/5700636/using-javascript-to-perform-text-matches-with-without-accented-characters
  //https://itqna.net/questions/514/how-do-search-ignoring-accent-javascript
  static eliminarAcentos = (cadena) => {
    var string_norm = cadena.normalize('NFD').replace(/\p{Diacritic}/gu, ''); // Old method: .replace(/[\u0300-\u036f]/g, "");
    return string_norm.toLowerCase().split(" ").join("");
  }


  static formatCardNumber(value) {
    if (!value) return "0000-0000-0000-0000";
    var value = value.replace(/\D/g, '');
    if ((/^\d{0,16}$/).test(value)) {
      return value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    }
  }



}




