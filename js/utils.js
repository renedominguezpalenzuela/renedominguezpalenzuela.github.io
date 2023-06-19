
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


  constructor(accessToken) {

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


  // Obtiene datos del usuario
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

      return null;
    });

    return datos;

  }


  // Obtiene el fee a aplicar
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
      return null;
    });

    return datos;

  }

  // Obtiene todos los tipos de cambio
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
      return null;
    });

    return datos;

  }

  //https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  //TODO: Implementar pruebas  para ver todos los casos de uso posibles de conversion
  static roundDec(numero, dec_places = 2) {
    let negativo = 1;
    if (numero < 0) negativo = -1;
    const resultado = Number(Math.round(Math.abs(numero) + 'e' + dec_places) + 'e-' + dec_places)
    return (resultado * negativo).toFixed(dec_places);
  }

  // static roundNumber = (number, decimals = 2) => {
  //   try {
  //     if (!number) return 0;
  //     let modifier = Math.pow(10, decimals);
  //     return (Math.round(Number(number) * modifier) / modifier).toFixed(decimals);
  //   } catch (e) {
  //     return -1;
  //   }
  // };

  // Obtiene el fee a aplicar
  // service: cardCUP |	cardUSD	| deliveryCUP | deliveryUSD
  // zone: Provincias | Habana
  // amount: Total a enviar
  async getBeneficiarios() {

    // var config = {
    //   method: 'get',
    //   url: `${this.base_url}/api/private/beneficiaries`,
    //   headers: this.headers,
    // }

    // let datos = null;
    // await axios(config).then(function (response) {
    //   datos = response.data;
    // }).catch(function (error) {
    //   console.log(error);
    //   return null;
    // });

    const datos = [
      {
        "cardNumber": "9225 1299 7929 0027",
        "cardHolderName": "Deicy Johana Morales Cadavid",
        "bankName": "BPA",
        "contactPhone": "005353129327",
        "deliveryAddress": "Cll 48A #103BB31 23 , ESMERALDA, CAMAGUEY, Cuba",
        "deliveryCountry": "Cuba",
        "deliveryCountryCode": "CU",
        "receiverCity": "ESMERALDA",
        "receiverCountry": "CUB",
      },
      {
        "cardNumber": "9225 1299 4560 3450",
        "cardHolderName": "Maria Gonzalez Riera",
        "bankName": "BPA",
        "contactPhone": "005467223445",
        "deliveryAddress": "Cll 49A #103BB31 23 , VERTIENTES, CAMAGUEY, Cuba",
        "deliveryCountry": "Cuba",
        "deliveryCountryCode": "CU",
        "receiverCity": "VERTIENTES",
        "receiverCountry": "CUB",
      }

    ]

    return datos;

  }


  static tiempoDebounce = 1000; //milisegundos

  static debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
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
        console.log(datos.accessToken);
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
  });

  return datos;
}


//-------------------------------------------------------------------------------
//  getDatosTR
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
  });

  return datos;
}



//-------------------------------------------------------------------------------
//  getDatosTR
//-------------------------------------------------------------------------------
export async function getBalance() {
  //leer token desde local storage
  const accessToken = window.localStorage.getItem('accessToken');
  const walletAddress = window.localStorage.getItem('walletAddress');

  console.log(walletAddress);

  var body = JSON.stringify({
    "walletAddress": walletAddress
  });

  var config = {
    method: 'post',
    url: `${base_url}/api/private/users/get-balance`,
    headers: {
      'authorization': `Bearer ${accessToken}`,
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
  });

  return datos;
}


