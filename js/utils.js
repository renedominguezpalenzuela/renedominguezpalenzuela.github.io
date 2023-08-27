
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
  // Leer Token desde sesion Storage
  //------------------------------------------------------------------------------------------------
  static getTokenFromlocalStorage() {
    let token = '';
    try {
      token = window.localStorage.getItem('accessToken');
    } catch (error) {
      console.log("Token not found on session storage");
      console.log(error);
    }

    return token;

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
  // Crear usuario
  //------------------------------------------------------------------------------------------------
  static async createUser(datosUsuario) {

    var body = JSON.stringify(datosUsuario);


    const headers = {
      'x-api-key': this.x_api_key,
      'Content-Type': 'application/json',
    }

    var config = {
      method: 'post',
      url: `${this.base_url}/api/private/users/register`,
      headers: headers,
      data: body
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
  // Subir fichero a AWS
  //------------------------------------------------------------------------------------------------
  static async uploadFileToAWS(fileInput) {

    const fileSize = fileInput.files[0].size /  1024 / 1024;

    if (fileSize>5) {
      console.log("File to big")
      Swal.fire({
        icon: 'error',
        title:'Error',
        text: 'File size must be less then 5 Mb',
    
      })

      const respuesta = {
        cod_respuesta:"error"
      }
      return ;

    }


    var formdata = new FormData();
    formdata.append("name", "TestUpload"); //filename?
    //formdata.append("file", fileInput.files[0], "/E:/img/Rey Mono/c09c723d986141d2b36ce40e8dcb3c09.jpg");
    formdata.append("file", fileInput.files[0]);
    formdata.append("action", "user-avatars");
    formdata.append("userId", "0123456");


    const headers = {
      'x-api-key': this.x_api_key,
      'Content-Type': 'multipart/form-data',
    }

    
    var config = {
      method: 'post',
      url: `${base_url}/api/upload/`,
      headers: headers,
      data: formdata
    }

    let datos = null;
    await axios(config).then(function (response) {
      datos = response;
    }).catch(function (error) {
      datos = error;
    });

  

    return datos;

  }

  //------------------------------------------------------------------------------------------------
  // Obtiene Expresiones Regulares para validar tarjetas
  //------------------------------------------------------------------------------------------------
  async getCardRegExp() {

    if (!this.accessToken) return null;

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
  // Obtiene el fee a aplicar siempre lo devuelve en usd
  //------------------------------------------------------------------------------------------------
  // service: cardCUP |	cardUSD	| deliveryCUP | deliveryUSD --- moneda y servicio que se recibe
  // zone: Provincias | Habana
  // amount: Total a RECIBIR la moneda a recibir se especifica en service
  // devuelve fee en USD
  /*
    "fee": 6,
    "currencyFee": "USD"
  */
  async getFee(service, zone, amount) {

    var config = {
      method: 'get',
      url: `${this.base_url}/api/private/fees/cu/${service}/${zone}?amount=${amount}`,
      headers: this.headers,
    }

    if (amount <= 0) {
      return {
        fee: 0
      }
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

    if (!this.accessToken) return null;

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

  //Pide todos los tipos de cambio
  //1 usd = X CAD --> this.tiposCambio.USD.CAD
  async getAllTiposDeCambio() {
    const usdTC = await this.getExchangeRate('USD');
    const eurTC = await this.getExchangeRate('EUR');
    const cadTC = await this.getExchangeRate('CAD');

    const resultado = {
      'USD': usdTC,
      'EUR': eurTC,
      'CAD': cadTC
    }
    return resultado;
  }




  //-------------------------------------------------------------------------------
  //  createTX: Contabiliza transaccion
  //-------------------------------------------------------------------------------
  async createTX(datosTX) {
    //leer token desde local storage
    //const accessToken = window.localStorage.getItem('accessToken');


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
    // const accessToken = window.localStorage.getItem('accessToken');


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

    if (!this.accessToken) return null;
    //leer token desde local storage
    // const accessToken = window.localStorage.getItem('accessToken');
    // const walletAddress = window.localStorage.getItem('walletAddress');

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

    if (!this.accessToken) return null;

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
      headers: this.headers,
      data: body
    }

    let datos = null;
    await axios(config).then(function (response) {
      //console.log(response)
      datos = response;
    }).catch(function (error) {
      //console.log(error);
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


  //----------------------------------------------------------------------------------------------
  // Obtener lista de Transacciones
  //----------------------------------------------------------------------------------------------
  async getTrData(total_tx) {

    if (!total_tx) {
      total_tx = 10;
    }

    const parametros = {
      "filter": {
        "status": "queued"
      }
    }

    var body = JSON.stringify(parametros);

    var config = {
      method: 'get',
      url: `${base_url}/api/private/transactions?skip=0&limit=${total_tx}`,
      headers: this.headers,
      data: body
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
        window.localStorage.setItem('accessToken', datos.accessToken)
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
  const accessToken = window.localStorage.getItem('accessToken');

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
//  getUser info
//-------------------------------------------------------------------------------
export async function getUsrInfo() {
  //leer token desde local storage
  const accessToken = window.localStorage.getItem('accessToken');

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
      window.localStorage.setItem('userId', datos.user._id)
    }

    if (datos.user.walletAddress) {
      window.localStorage.setItem('walletAddress', datos.user.walletAddress)
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
  //--------------------------------------------------------------------------------------------------------------------
  //SendInput manejar eventos on change de Cantidad enviada, pide el Fee, en funcion de la cantidad a enviar
  //--------------------------------------------------------------------------------------------------------------------

  static async onChangeSendInputOLD(receiveCurrency, sendCurrency, sendAmount, conversionRate, accessToken, moneda_vs_USD) {

    const resultado = {
      fee: 0,
      feeSTR: '',
      receiveAmount: 0
    }

    if (conversionRate <= 0) {
      return resultado;
    }

    const service = `card${receiveCurrency.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos   

    if (sendAmount > 0) {
      const api = new API(accessToken);
      const feeData = await api.getFee(service, zone, sendAmount);

      const fee = feeData.fee / moneda_vs_USD;
      resultado.fee = fee;

      const feeSTR = fee.toFixed(2);

      resultado.feeSTR = `${feeSTR} ${sendCurrency.toUpperCase()}`; //TODO convertir a 2 decimales  

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


  }




  //----------------------------------------------------------------------------------
  //ReceiveInput: manejar eventos on change de inputs send
  //----------------------------------------------------------------------------------
  static async onChangeReceiveInput(receiveCurrency, sendCurrency, receiveAmount, conversionRate, accessToken, moneda_vs_USD) {

    const resultado = {
      fee: 0,
      feeSTR: '',
      sendAmount: 0
    }

    if (conversionRate <= 0) {
      return resultado;
    }

    const service = `card${receiveCurrency.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos  



    const sendAmount = (receiveAmount / conversionRate);

    if (receiveAmount > 0) {
      const api = new API(accessToken);
      const feeData = await api.getFee(service, zone, sendAmount)
      const fee = feeData.fee / moneda_vs_USD;
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



  //----------------------------------------------------------------------------------
  //ReceiveInput: manejar eventos on change de inputs send
  //----------------------------------------------------------------------------------
  static async onChangeReceiveInputOLD(receiveCurrency, sendCurrency, receiveAmount, conversionRate, accessToken, moneda_vs_USD) {

    const resultado = {
      fee: 0,
      feeSTR: '',
      sendAmount: 0
    }

    if (conversionRate <= 0) {
      return resultado;
    }

    const service = `card${receiveCurrency.toUpperCase()}`;
    const zone = "Habana"; //TODO: obtener de datos  



    const sendAmount = (receiveAmount / conversionRate);

    if (receiveAmount > 0) {
      const api = new API(accessToken);
      const feeData = await api.getFee(service, zone, sendAmount)
      const fee = feeData.fee / moneda_vs_USD;
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



  static calcularCantidadEnviada(cantidadRecibida, tipoCambio, monedaEnviada, monedaRecibida) {
    console.log(cantidadRecibida)
    console.log(tipoCambio)
    console.log(monedaEnviada)
    console.log(monedaRecibida)


    const cantidadEnviada = this.aplicarTipoCambio2(cantidadRecibida, tipoCambio, monedaEnviada, monedaRecibida);


    console.log(cantidadEnviada)
    return cantidadEnviada;
  }


  static aplicarTipoCambio2(cantidadMonedaBase, tipoCambio, monedaBase, monedaaConvertir) {

    const tc = tipoCambio[monedaBase.toUpperCase()][monedaaConvertir.toUpperCase()];
    console.log("tc2")
    console.log(tc)
    if (tc <= 0) return 0;
    const cantidadConvertida = cantidadMonedaBase / tc;
    console.log(cantidadConvertida)
    return cantidadConvertida
  }


  static calcularCantidadRecibida(cantidadRecibida, tipoCambio, monedaEnviada, monedaRecibida) {
    const cantidad = this.aplicarTipoCambio1(cantidadRecibida, tipoCambio, monedaEnviada, monedaRecibida);
    return cantidad;
  }


  static aplicarTipoCambio1(cantidadMonedaBase, tipoCambio, monedaBase, monedaaConvertir) {

    console.log(`Cantidad Moneda Base ${cantidadMonedaBase}`);
    console.log(`Moneda Base ${monedaBase}`);
    console.log(`Moneda Convertir ${monedaaConvertir}`);
    console.log(tipoCambio)



    const tc = tipoCambio[monedaBase.toUpperCase()][monedaaConvertir.toUpperCase()];
    const cantidadConvertida = tc * cantidadMonedaBase;
    return cantidadConvertida
  }



  static gestionResultado(resultado, urlHome, menuController) {



    //TODO: refactorizar
    if (resultado.data) {
      //se proceso correctamente la operacion
      if (resultado.data.status === 200 && !resultado.data.paymentLink) {
        Swal.fire(resultado.data.payload);
        return;
      }

      //El saldo no es suficiente, la operacion esta en espera y se envia payment link para completar
      if (resultado.data.status === 200 && resultado.data.paymentLink) {
        //redireccionar a otra pagina 
        const paymentLink = resultado.data.paymentLink.url;

        console.log("URL HOME")
        console.log(urlHome)
        //debugger

        UImanager.dialogoStripe(paymentLink, menuController, urlHome)
        return;
      }




    }

    //Error pero aun responde el API
    if (resultado.response) {
      console.log(resultado)
      /*"error": "BAD_REQUEST",
      "message": "The externalID field is required",
      "statusCode": 400*/
      Swal.fire(resultado.response.data.message);
    }

  }



  static dialogoStripe(paymentLink, menuController, homeURL) {

    Swal.fire({
      title: 'Insuficient Funds',
      text: "The transaction is pending, but your balance is insuficient to complete the transaction",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Clic to refund',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cerrando = false;
        const stripeWindows = window.open(paymentLink, 'popup', 'width=600,height=840');
        stripeWindows.focus();

        var timer = setInterval(function () {
          if (stripeWindows && stripeWindows.closed) {
            clearInterval(timer);
            Swal.fire({
              title: '',
              text: "Do you wan't to proccess another operation",
              icon: 'question',
              showCancelButton: true,
              // confirmButtonColor: '#3085d6',
              // cancelButtonColor: '#d33',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No'
            }).then((result) => {
              if (result.isConfirmed) {
                //no hacer nada
                console.log("No hacer nada, procesar otra operacion")

              } else {
                //redireccionar al home page
                if (!homeURL) {
                  console.log("Redireccionar al home page solo si no esta el prop homeURL")
                  const menuId = 7
                  const menuName = 'Transactions List';
                  if (menuController) {
                    menuController(menuId, menuName)
                  }
                } else {
                  console.log('redireccionar usando props')
                  console.log(homeURL)
                  window.location.assign(homeURL);
                }
              }

            });
          }
        }, 600);


        /*
        this.stripeWindows.onunload = function () {
          console.log("Cerrando")
          //if (this.cerrando) {
            this.cerrando = false;
            Swal.fire({
              title: '',
              text: "Do you wan't to proccess another operation",
              icon: 'question',
              showCancelButton: true,
              // confirmButtonColor: '#3085d6',
              // cancelButtonColor: '#d33',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No'
            }).then((result) => {
              if (result.isConfirmed) {
                //no hacer nada
                console.log("No hacer nada")
              } else {
                //redireccionar al home page
                console.log("Procesar otra operacion")
              }

            });
          //}

        };*/


      }
    })
  }



}




