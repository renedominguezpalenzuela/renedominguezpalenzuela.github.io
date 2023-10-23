
/***************************************************************************************************** 
  Rene Dominguez Palenzuela
  28/05/2023 
 ******************************************************************************************************/
/*
   Para correr las pruebas con jest descomentar esta linea:   
   Para correr las pruebas con cypress no es necesario
   import axios  from "axios";
   sPara la aplicacion web, comentar la linea
*/
//import axios from "axios";

const base_url = 'https://backend.ducapp.net';
//const x_api_key = 'test.c6f50414-cc7f-5f00-bbb5-2d4eb771c41a';
const x_api_key = 'test.874a5fc8-609a-5bae-ade2-e933bcb2721d';




/*
const axios_using_interceptors = axios.create();

axios_using_interceptors.interceptors.request.use((config) => {
  config.baseURL = base_url;
  config.headers['x-api-key'] = x_api_key;
  config.headers['Content-Type'] = "application/json";
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config
})*/

/*
axios.interceptors.response.use(response => response, error => {
  const status = error.response ? error.response.status : null;


  console.log("Axios Interceptor")

  if (status === 401) {
    // Handle unauthorized access
    window.location.assign(API.redirectURLLogin);
    return Promise.reject(error);

  } else if (status === 400) {
    console.log(`Error CODE 400: ${error.code}, Error MSG: ${error.message}`)
    return
    // Promise.resolve();

  } else if (status === 404) {
    // Handle not found errors

    console.log(`Error CODE 404: ${error.code}, Error MSG: ${error.message}`)
    Swal.fire({
      icon: 'error 404',
      title: `Error CODE 404: ${error.code}, Error MSG: ${error.message}`

    })
    return Promise.reject(error);

  } else {
    // Handle other errors

    console.log(`Error CODE Other ERRORS: ${error.code}, Error MSG: ${error.message}`)
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: `Error CODE Other ERRORS: ${error.code}, Error MSG: ${error.message}`

    })
    return Promise.reject(error);
  }


});*/


//-----------------------------------------------------------------------------------------
// Login
//-----------------------------------------------------------------------------------------

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
    //await axios_using_interceptors.post("/api/auth/login", datos)
    .then(response => {
      const datos = response.data;
      if (datos.accessToken) {
        resultado = true;
        console.log(datos);
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



//export const baseSocketURL = "wss://backend.ducapp.net/";  //PRueba
//export const baseSocketURL = "https://backend.ducwallet.com"; //Produccion

//-------------------------------------------------------------------------------------------
//  Clase global para llamado al API
//-------------------------------------------------------------------------------------------
export class API {


  static baseSocketURL = "wss://backend.ducapp.net/";  //PRueba

  //direccion a donde se redireccionara cuando no existe token 
  static redirectURLLogin = '/login';

  //direccion a donde se redireccionara cuando se termina una operacion correctamente
  static redirectURLHome = '/';

  //--------------------------------------------------------------------------
  // devuelve true si esta en ambiente local
  //--------------------------------------------------------------------------

  static ambienteLocal() {


    let esLocal = false;

    const host_url = window.location.origin;
    if (host_url === "http://localhost:3000") {
      esLocal = true;
    }
    return esLocal;

  }

  //--------------------------------------------------------------------------------
  // setRedirectionURL
  //--------------------------------------------------------------------------------

  //se llama en cada uno de los componentes
  //pasandole como parametro this.props.urlHome
  //si no se le pasa ese parametro redireccionaa ala url por defecto
  //si esta en local, la url por defecto para redireccionar seria '/'
  //si no esta en local la url por defecto para redireccionar seria '/login'
  static setRedirectionURL(urlHome) {
    //console.log(urlHome)
    // console.log(this.ambienteLocal())
    this.redirectURLLogin = this.ambienteLocal() ? '/' : '/login'
    this.redirectURLHome = urlHome ? urlHome : '/';
  }

  //static baseSocketURL = "https://backend.ducwallet.com"; //Produccion

  constructor(accessToken) {

    this.accessToken = accessToken;

    // this.base_url = 'https://backend.ducapp.net';
    // this.x_api_key = 'test.c6f50414-cc7f-5f00-bbb5-2d4eb771c41a';

    // this.baseSocketURL = "wss://backend.ducapp.net/";  //PRueba
    //this.baseSocketURL = "https://backend.ducwallet.com"; //Produccion


    this.headers = {
      'authorization': `Bearer ${accessToken}`,
      'x-api-key': x_api_key,
      'Content-Type': 'application/json',
    }

    console.log("Constructor")
    console.log(this.headers)


  }




  // //-------------------------------------------------------------------------------
  // //  Login
  // //-------------------------------------------------------------------------------
  // //Devuelve
  // /*

  //   const resultado = {
  //     accessToken: null,
  //     cod_respuesta: null,
  //     msg_respuesta: null
  //   }


  // */
  // static async login(usr, pass) {
  //   const config = {
  //     headers: {
  //       "x-api-key": x_api_key,
  //       "Content-Type": "application/json"
  //     }
  //   };

  //   const datos = { "email": usr, "password": pass };

  //   const resultado = {
  //     accessToken: null,
  //     cod_respuesta: null,
  //     msg_respuesta: null
  //   }





  //  await axios.post(`${base_url}/api/auth/login`, datos, config)

  //     .then(response => {
  //       const datos = response.data;
  //       if (datos.accessToken) {
  //         // console.log(datos);
  //         resultado.accessToken = datos.accessToken;
  //       } else {
  //         console.log(response)
  //         //resultado.cod_respuesta = 
  //       }
  //     }).catch(error => {
  //       console.log('Login Error ');
  //       if (error.response) {
  //         console.error(error.response);
  //       }
  //     });

  //   return resultado;
  // }




  //------------------------------------------------------------------------------------------------
  // Leer Token desde sesion Storage
  //------------------------------------------------------------------------------------------------
  static getTokenFromsessionStorage() {
    let token = '';
    try {
      token = window.sessionStorage.getItem('accessToken');
    } catch (error) {
      console.log("Token not found on local storage");
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
      url: `${base_url}/api/private/users`,
      headers: this.headers,
    }


    let datos = null;
    await axios(config)
      //await axios_using_interceptors.get('/api/private/users')
      .then(function (response) {
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
  // 1. Paises
  //------------------------------------------------------------------------------------------------
  async getListaPaises() {

    var config = {
      method: 'get',
      url: `${base_url}/api/private/transactions/cash-out/countries`,
      headers: this.headers,
    }


    let datos = null;
    await axios(config)
      .then(function (response) {

        datos = response.data.data;


      }).catch(function (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error.message,
          text: 'Something went wrong requesting Country List',
          footer: '<h5> Inspect console for details </h5>'
        })

        datos = error;
      });

    return datos;

  }

  //Devuelve arreglo con codigos ISO3, listo para ser usado en el control del telegono
  static async transformarISO2toISO3(listaPaisesFromAPI, listaPaisesISO3) {

    let seleccionCodigosPaises = []

    listaPaisesFromAPI.map((unPais) => {

      const paisConISO2 = listaPaisesISO3.filter((paisISO3) => paisISO3.isoAlpha3 === unPais.iso_code)[0]

      if (paisConISO2) {

        seleccionCodigosPaises.push(paisConISO2.isoAlpha2.toLowerCase())
      }
    })

    //  
    return seleccionCodigosPaises;


  }


  //------------------------------------------------------------------------------------------------
  // 2. Services 
  //------------------------------------------------------------------------------------------------
  async getListaServicios(iso_code) {


    let datos = null;

    const config = {
      headers: this.headers,
      // data: {"country_iso_code": iso_code},
      params: {
        "country_iso_code": iso_code
      }
    }
   await axios.get(`${base_url}/api/private/transactions/cash-out/services`, config).then((response) => {
      datos = response.data.data;      
    }).catch((error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.message,
        text: 'Something went wrong requesting Service List',
        footer: '<h5> Inspect console for details </h5>'
      })

      datos = error;
    });



    /*
        const parametros = {
          params: {
            "country_iso_code": iso_code
          }     
        }
    
        const vdatos = { "country_iso_code": iso_code }
    
        const mheaders = {   
          headers: this.headers
        }
    
        let datos = null;
        await axios.get(
          `${base_url}/api/private/transactions/cash-out/services`,
      
          mheaders,
          {params: vdatos}
       
    
    
        ).then((response) => {
          datos = response.data.data;
          console.log("Servicios obtenidos")
          console.log(response.data)
        }).catch((error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: error.message,
            text: 'Something went wrong requesting Service List',
            footer: '<h5> Inspect console for details </h5>'
          })
    
          datos = error;
        });
    
    */



    /*
        const parametros = {
          "country_iso_code": iso_code
        }
    
    
        var body = JSON.stringify(parametros);
    
        var config = {
          method: 'get',
          url: `${base_url}/api/private/transactions/cash-out/services`,
          headers: this.headers,
          data: body
        }
    
        console.log(config)
    
    
    
    
        let datos = null;
        await axios(config).then((response) => {
          datos = response.data.data;
          console.log("Servicios obtenidos")
          console.log(response.data)
        }).catch((error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: error.message,
            text: 'Something went wrong requesting Service List',
            footer: '<h5> Inspect console for details </h5>'
          })
    
          datos = error;
        });
        */


    /*
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            let datos = null;
        var myHeaders = new Headers();
        myHeaders.append("authorization", `Bearer ${this.accessToken}`);
        myHeaders.append("x-api-key", x_api_key);
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
          "country_iso_code": "NPL"
        });
    
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
    
        fetch("https://backend.ducapp.net/api/private/transactions/cash-out/services", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    */

    /*
    ---------------------------------------------------------------------------------------
        
    let datos = null;
    var myHeaders = new Headers();
    myHeaders.append("authorization", `Bearer ${this.accessToken}`);
    myHeaders.append("x-api-key", x_api_key);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
    "country_iso_code": iso_code
    });
    
    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    
    fetch(`${base_url}/api/private/transactions/cash-out/services`, requestOptions)
    .then(response => response.text())
    .then(result => {
      datos = result
      console.log(result)
    })
    .catch(error => console.log('error', error));
    
    */
    return datos;

  }



  //------------------------------------------------------------------------------------------------
  // 3. Get Payers  
  //------------------------------------------------------------------------------------------------
  async getListaPayers(service_id, country_iso_code) {

    const per_page = 50;

    var raw = JSON.stringify({
      "service_id": service_id,
      "country_iso_code": iso_code,
      "per_page": per_page
    });


    //                 /api/private/transactions/cash-out/payers
    var config = {
      method: 'get',
      url: `${base_url}/api/private/transactions/cash-out/payers`,
      headers: this.headers,
      data: raw
    }

    // console.log("Countr code Pidiendo lista servicios")
    // console.log(iso_code)

    //console.log(config)


    let datos = null;
    await axios(config)
      .then(function (response) {
        datos = response.data.data;
        console.log("Payers obtenidos")
        console.log(datos)
      }).catch(function (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error.message,
          text: 'Something went wrong requesting Payers List',
          footer: '<h5> Inspect console for details </h5>'
        })

        datos = error;
      });

    return datos;

  }


  //------------------------------------------------------------------------------------------------
  // Confirmar usuario
  //------------------------------------------------------------------------------------------------
  static async confirmUser(userID, verificationCode) {




    var raw = JSON.stringify({
      "userID": userID,
      "activationCode": verificationCode
    });

    const headers = {
      'x-api-key': x_api_key,
      'Content-Type': 'application/json',
    }

    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/verify`,
      headers: headers,
      data: raw
    }

    let datos = null;
    //await axios_using_interceptors.post('/api/private/users/verify', raw).then(function (response) {
    await axios(config).then(function (response) {
      console.log(response)
      datos = response;
    }).catch(function (error) {
      console.log(error);
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
      'x-api-key': x_api_key,
      'Content-Type': 'application/json',
    }

    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/register`,
      headers: headers,
      data: body
    }

    let datos = null;
    /*await axios(config).then(function (response) {
      datos = response.data.user;
    }).catch(function (error) {

      datos = error;
    });*/

    try {
      datos = await axios(config);
    } catch (error) {
      datos = error;

    }



    return datos;

  }

  //------------------------------------------------------------------------------------------------
  // request OTP (One time password)
  //------------------------------------------------------------------------------------------------
  static async requestOTP(id, email) {

    const datosUsuario = {
      userID: id,
      value: email
    }

    var body = JSON.stringify(datosUsuario);


    const headers = {
      'x-api-key': x_api_key,
      'Content-Type': 'application/json',
    }

    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/otp`,
      headers: headers,
      data: body
    }

    let datos = null;

    try {
      datos = await axios(config);
      console.log("OTP")
      console.log(datos)
    } catch (error) {
      datos = error;

    }



    return datos;

  }


  //------------------------------------------------------------------------------------------------
  // Update usuario
  //------------------------------------------------------------------------------------------------
  async updateUser(datosUsuario) {


    var body = JSON.stringify(datosUsuario);


    var config = {
      method: 'patch',
      url: `${base_url}/api/private/users/update`,
      headers: this.headers,
      data: body
    }

    let datos = null;
    /*await axios(config).then(function (response) {
      datos = response.data.user;
    }).catch(function (error) {

      datos = error;
    });*/

    try {
      datos = await axios(config);
    } catch (error) {
      datos = error;

    }



    return datos;

  }



  //------------------------------------------------------------------------------------------------
  // Subir fichero a AWS
  //------------------------------------------------------------------------------------------------
  static async uploadFileToAWS(fileInput) {

    const fileSize = fileInput.files[0].size / 1024 / 1024;

    if (fileSize > 5) {
      console.log("File to big")
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'File size must be less then 5 Mb',

      })

      const respuesta = {
        cod_respuesta: "error"
      }
      return;

    }


    var formdata = new FormData();
    formdata.append("name", "TestUpload"); //filename?
    //formdata.append("file", fileInput.files[0], "/E:/img/Rey Mono/c09c723d986141d2b36ce40e8dcb3c09.jpg");
    formdata.append("file", fileInput.files[0]);
    formdata.append("action", "user-avatars");
    formdata.append("userId", "0123456");


    const headers = {
      'x-api-key': x_api_key,
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
      url: `${base_url}/api/private/delivery-card-regex`,
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
      url: `${base_url}/api/private/fees/cu/${service}/${zone}?amount=${amount}`,
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
      url: `${base_url}/api/private/rates?base=${moneda_base}`,
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

    if (!this.accessToken) return null;
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

    if (!this.accessToken) return null;

    var config = {
      method: 'post',
      url: `${base_url}/api/private/users/beneficiary`,
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
      url: `${base_url}/api/private/transactions/topup/operators`,
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
      //datos = response.data.data;
      datos = response;
    }).catch(function (error) {
      //console.log(error);
      datos = error;
    });

    return datos;





  }

  //----------------------------------------------------------------------------------------------
  // Verificar usuario
  //----------------------------------------------------------------------------------------------
  static async verificarUsuario(IDUsuario) {

    var respuesta_api = null;

    Swal.fire({
      title: 'User has not been verified',
      text: 'A message with a verification code has been sent to your email address. Enter the code to continue',
      input: 'text',
      inputAttributes: { autocapitalize: 'off' },
      showCancelButton: true,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      preConfirm: async (verificationCode) => {

        console.log("Obtener dato")
        console.log(verificationCode)

        /*return {
          code: verificationCode
        }*/

        respuesta_api = await API.confirmUser(IDUsuario, verificationCode)

        return respuesta_api;



      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      //console.log("then")
      //console.log(result.value.code)
      //console.log(IDUsuario)
      if (result.isConfirmed) {   //si usuario le dio al boton confirmar



        // const respuesta = result.value;
        console.log(result)
        console.log(respuesta_api)


        if (respuesta_api.data.validatedUser && respuesta_api.data.validatedUser == true) {

          Swal.fire({
            icon: 'success',
            title: 'Activating user',
            text: respuesta_api.message
          })


          return true;


        } else {

          const cod_error = respuesta_api.response ? respuesta_api.response.data.message : "Error activating user"

          Swal.fire({
            icon: 'error',
            title: 'Activating user error',
            text: cod_error
          })

          return false;
        }




        /*value: {
          contiene la respuesta del paso anterior
          result.value.code
        }*/

        /*Swal.fire({
          title: `Codigo de verificacion: ${result.value.code}`

        })*/
      }
    })
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
//  Login OK before interceptor
//-------------------------------------------------------------------------------
/*
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
        console.log(datos);
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
}*/





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
//  getUser info
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

  static validarSiVacio(dato) {
    let error = false;
    if (!dato) {
      error = true;
    }
    return error;

  }

  static validarSiMenorQueCero(dato) {
    let error = false;
    if (!dato || dato <= 0) {
      error = true;
    }
    return error;

  }



  //DEvuelve true si hay error en la longitud del ci
  static validarCI(ci) {
    if (!ci) return true;

    const ciwithoutspaces = ci.replace(/ /g, "");

    const limiteInferiorEdad = 15; //menores de 15 annos no pueden usar la app

    const year = parseInt(ciwithoutspaces.substring(0, 2));
    const month = parseInt(ciwithoutspaces.substring(2, 4));
    const day = parseInt(ciwithoutspaces.substring(4, 6));

    //  console.log(`${year} \ ${month} \ ${day}`)


    const current_year2Digit = new Date().getFullYear() - 2000 + 5; //en 2023 daria 28
    const current_year4Digits = new Date().getFullYear();

    let year4digit = 0;
    //console.log(`Current year ${current_year} `)



    if (year <= current_year2Digit) {
      year4digit = 2000 + year
    } else {
      year4digit = 1900 + year
    }

    const edad = current_year4Digits - year4digit;
    console.log(`Edad ${edad}`)
    console.log(`current_year4Digits ${current_year4Digits}`)
    console.log(`4 digit year ${year4digit}`)
    if (edad > limiteInferiorEdad) {
      console.log("Mayor")

    } else {
      console.log("Menor")
      return true; //CI no valido es menor de edad
    }




    if (month <= 0 || month > 12) {
      return true; //CI no valido mes no permitido
    }

    if (day <= 0 || day > 31) {
      return true; //CI no valido dia no permitido
    }

    // console.log(`Card Length ${cardWithoutSpaces.length}`)
    if (ciwithoutspaces.length != 11) {
      return true; //CI no valido longitud diferente de 11
    } else {
      return false;
    }

  }



  //CardNumber --- se le pasa el numero de tarjeta sin espacios
  static async buscarLogotipoBanco(CardNumber, accessToken) {
    // const cardWithoutSpaces = this.state.cardNumber.replace(/ /g, "");
    const cardWithoutSpaces = CardNumber.replace(/ /g, "");

    console.log(`Card Length ${cardWithoutSpaces.length}`)
    if (cardWithoutSpaces.length != 16) {

      return {
        tarjetaValida: false,
        cardBankImage: "",
        bankName: ""
      }

    }

    const api = new API(accessToken);
    const cardRegExp = await api.getCardRegExp();
    console.log(cardRegExp)

    if (!cardRegExp) {
      return {
        tarjetaValida: false,
        cardBankImage: "",
        bankName: ""
      }

    }



    for (const key in cardRegExp) {

      const expresionregular = cardRegExp[key];
      /*console.log(key) 
      console.log(expresionregular);*/



      const regexp = new RegExp(expresionregular);
      //const card = this.state.cardNumber.replace(/ /g, "");
      const card = cardWithoutSpaces;
      const resultado = regexp.test(card);
      if (resultado) {

        switch (key) {
          case 'BANDEC_CARD':
            //console.log("Match: BANDEC")
            return {
              tarjetaValida: true,
              cardBankImage: "img/logo-bandec.png",
              bankName: "BANDEC"
            }
            break;

          case 'BANMET_CARD':
            //console.log("Match: METRO")
            return {
              tarjetaValida: true,
              cardBankImage: "img/logo-metro.png",
              bankName: "METROPOLITANO"
            }
            break;

          case 'BPA_CARD':
            //console.log("Match: BPA")
            return {
              tarjetaValida: true,
              cardBankImage: "img/logo-bpa.png",
              bankName: "BPA"
            }
            break;

          case 'MLC_CREDIT_CARD':
            // console.log("Match: MLC")
            return {
              tarjetaValida: true,
              cardBankImage: "",
              bankName: "MLC"
            }
            break;

          case 'CREDIT_CARD':
            break;
            // console.log("Match: Credit Card")
            return {
              tarjetaValida: true,
              cardBankImage: "",
              bankName: "Credit Card"
            }
            break;


          default:
            return {
              tarjetaValida: false,
              cardBankImage: "",
              bankName: ""
            }
            break;
        }
      }
    }
  }


  static validMail(mail) {
    if (!mail) {
      return false;
    }

    const correo_valido1 = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
    const correo_valido2 = mail.charAt(mail.length - 1) != '.' ? true : false;

    return correo_valido1 && correo_valido2;

    ///^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
  }
  //--------------------------------------------------------------------------------------------------------------------
  //SendInput manejar eventos on change de Cantidad enviada, pide el Fee, en funcion de la cantidad a enviar
  //--------------------------------------------------------------------------------------------------------------------
  //delivery
  static async calculateAndShowFee(servicio, cantidadRecibida, monedaRecibida, monedaEnviada, tipoCambio, zone) {
    const service = `${servicio}${monedaRecibida.toUpperCase()}`;
    if (!zone) {
      zone = "Habana"
    }
    //const zone = this.beneficiario.deliveryZona;  
    //TODO: el fee depende del zone, el zone de la provincia, recalcular el fee antes de hacer el envio
    //pues el usuario puede haber cambiado la provincia
    const accessToken = API.getTokenFromsessionStorage();
    console.log(service)
    console.log(zone)
    console.log(cantidadRecibida)
    const api = new API(accessToken);
    const feeResultUSD = await api.getFee(service, zone, cantidadRecibida)
    const feeUSD = feeResultUSD.fee;
    console.log("Fee USD")
    console.log(feeUSD)
    //Aplicar TC al fee en USD, para obtenerlo en la moneda enviada
    const monedaEnviadaUSD = 'USD';
    //Segun darian    
    //    monedaBase = monedaEnviada (EUR)
    //    monedaAconvertir = USD
    //    const feeMonedaEnviada = UImanager.aplicarTipoCambio1(feeUSD, tipoCambio,  monedaEnviada, monedaEnviadaUSD);
    //Version original mia: const feeMonedaEnviada = UImanager.aplicarTipoCambio1(feeUSD, tipoCambio, monedaEnviadaUSD, monedaEnviada);
    const feeMonedaEnviada = UImanager.aplicarTipoCambio2(feeUSD, tipoCambio, monedaEnviada, monedaEnviadaUSD);
    console.log(`Fee en moneda ${monedaEnviada}`)
    console.log(feeMonedaEnviada)
    const tc = tipoCambio[monedaEnviada.toUpperCase()][monedaRecibida.toUpperCase()];
    // this.conversionRate.value = tc;
    // this.fee.value = feeMonedaEnviada;
    // this.feeSTR.value = UImanager.roundDec(this.fee.value)
    return {
      feeMonedaEnviada: feeMonedaEnviada,
      conversionRate: tc,
      feeSTR: UImanager.roundDec(feeMonedaEnviada)
    }

  }

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
                if (!this.redirectURLHome) {
                  console.log("Redireccionar al home page solo si no esta el prop homeURL")
                  const menuId = 7
                  const menuName = 'Transactions List';
                  if (menuController) {
                    menuController(menuId, menuName)
                  }
                } else {
                  console.log('redireccionar usando props')
                  console.log(this.redirectURLHome)
                  window.location.assign(this.redirectURLHome);
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



  static formatDate(inputDate) {
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



}



export function suma(a, b) {
  return a + b;
}








