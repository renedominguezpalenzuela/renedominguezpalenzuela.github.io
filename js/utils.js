
/***************************************************************************************************** 
  Rene Dominguez Palenzuela
  28/05/2023 
 ******************************************************************************************************/

//TODO: minificar, ofuscar
//TODO: Crear funcion para mostrar mensajes, pasar solo el texto como parametro

const base_url = 'https://backend.ducapp.net';
const x_api_key = 'test.c6f50414-cc7f-5f00-bbb5-2d4eb771c41a';


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
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong requesting API Status',
        footer: '<h5> Inspect console for details </h5>'
      })
    });
}

//-------------------------------------------------------------------------------
//  Login
//-------------------------------------------------------------------------------

export async function  login(usr, pass) {
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