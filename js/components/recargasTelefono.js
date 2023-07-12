const { Component, xml, useState, useRef, onMounted, onRendered, onWillStart } = owl;
import { API, UImanager } from "../utils.js";
import { Paises } from "../../data/paises.js";


//TODO: refactorizar en un componente la parte de las monedas y el importe

export class RecargasTelefono extends Component {

    //static components = { Beneficiarios };



    state = useState({
        pais: -1

    })





    static template = xml`    
    <div class="sm:grid sm:grid-cols-[34%_64%] gap-2 h-[100vh]">
        <div class="card  w-full bg-base-100 shadow-xl rounded-lg">
            <div class="card-title flex flex-col rounded-lg">
            
            </div>

            <div class="card-body items-center ">
                             
                
                    <select t-att-value="this.state.pais" class="select select-bordered w-full" t-on-input="onChangePais" name="people" id="people">            
                        <t t-foreach="this.seleccionPaises" t-as="unPais" t-key="unPais.id">
                            <option t-att-value="unPais.id" data-class="avatar" t-att-data-style="unPais.flag" >
                                 <span class="countryname"><t t-esc="unPais.name"/> </span>
                                
                            </option>
                        </t>             
                </select>
            </div>
        </div>

        <div class="card  w-full bg-base-100 shadow-xl rounded-lg ">
            <div class="card-title flex flex-col rounded-lg">
                Other Data
            </div>
            <div class="card-body items-center ">
                <div class="ui-widget">
                    <label for="tags">Tags: </label>
                    <input id="tags"/>
                </div>
                <fieldset>
                    <label for="people">Select a Person:</label>
                    <select name="people" id="people1">
                    
                    <option value="1" data-class="avatar" data-style="background-image: url(&apos;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQkE2MUNDQTE3NzUxMUUyODY3Q0FBOTFCQzlGNjlDRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQkE2MUNDQjE3NzUxMUUyODY3Q0FBOTFCQzlGNjlDRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFCQTYxQ0M4MTc3NTExRTI4NjdDQUE5MUJDOUY2OUNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFCQTYxQ0M5MTc3NTExRTI4NjdDQUE5MUJDOUY2OUNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9/ZNdQAAAztJREFUeNq8ll9oHFUUxn+zM7OT3c3spMlus8kS3RL/RU1JokglJrRaFH3pg2+C+CAICq0PRqigVYrStFhEfBEVXwQRn0RQEESsT2KqjUhrpaR/NFmbpNlsdjO7m/l3PZsWRXxK2PXCMHDnzj33nO/7zne19/v3LxxL77MvWrsgrEK0DsRo99Dcrj61FOvgw877OG4/gGf0QLACymvrAbSZzHClO6rbhXCVH8w8b6cn+CQ1JjHjsPon+EF7Ap/J3FVRYEeS3UBYwYlqfGHdxpv2OBdGHyTyqgSLy6hItTSwsRldHp2Ied2mqHfyUGOOkbVzVO+tkp9+EWdoF76sCV2vtRnL2/5nRiOS7DpUgFG6gjVQIDf1HNahgy3N+D/s0bQYqlymUfdp9N3J8kKF088f4peh+yl9+lmLM9Y0G6WI6g18d5HuRw/gC67rP/2I6WSIWQkaSxdR1Ol55AD51w5zaeQeUrJBd7ghUGnbDBxFNrqOmeuldu5ndp+fYfXzr/jj6Ksk+4fwrhaJmZYQLSAoz+HoXXw9OMEJZx9XzF46RH6m8rckv+usDiM7qJXJPvkEuReepeOOQZGxx9o3p5h/6Q0av81hpJwb4Ogo1yXrXmNZS/BRapS3RIIQv6H9LWCsGTpGMk3xg5O4M2eunygeZ/HYu6zPzkjQrn/9pGLCAymvoxqkow2Z2KacmvhqcgYzuRMVBBSPniQ5Oow1eBPad80lsrOQTiDBX7qAQ5Jvb53geHovZ60BKfWqlLqZbWLrclK+j5HZiZF1KH//JVaiQHJsmNrZ8+jxBN7SvGi5xI49+7n59Zf5fXxy89RZIVds2+Rq6jimoaQ9hmtVjJ4dRG5NMmyCoVGvzZHK303+yBTZZ55qUwOREUlZLRViXruMmcnSe/BpkkcOyxeztS3zb9JIyZo8KXgl1hsuK489Tv8rUxh7douCxbRq/iYfWmoSoSCVEy/uFU8+FS8w3TnO7MjDssLDL15FJNdadzotttipNuxbghK/GhneEVd6T7wZXfpSWWzR89tji2td/aqu6dIIxpi2J1mJ90lNy1LSensvAh/nJhdOpPfas4nbhVXC5LDyv1x9/hJgAIwQQwS2sEaJAAAAAElFTkSuQmCC&apos;);">John Resig</option>
                    <option value="2" data-class="avatar" data-style="background-image: url(&apos;http://www.gravatar.com/avatar/e42b1e5c7cfd2be0933e696e292a4d5f?d=monsterid&amp;r=g&amp;s=16&apos;);">Tauren Mills</option>
                    <option value="3" data-class="avatar" data-style="background-image: url(&apos;http://www.gravatar.com/avatar/bdeaec11dd663f26fa58ced0eb7facc8?d=monsterid&amp;r=g&amp;s=16&apos;);">Jane Doe</option>
                    </select>
                </fieldset>
            </div>
        </div>
    </div>

    
      


  `;


    setup() {
        const accessToken = window.sessionStorage.getItem('accessToken');
        const walletAddress = window.sessionStorage.getItem('walletAddress');
        const userId = window.sessionStorage.getItem('userId');

        onWillStart(async () => {
            const api = new API(accessToken);
            //const exchangeRate = await api.getExchangeRate("usd");

            this.paises = Paises.map((unPais, i) => ({
                id: unPais.id,
                name: unPais.name,
                flag: "background-image: url('data:image/png;base64," + unPais.flag +"');",
                currency: unPais.currency.code,
                number: unPais.number,
                show: unPais.show
            }));

            this.seleccionPaises = this.paises.filter(unPais => (
                (unPais.show)
            )
            );


            this.cuba = this.paises.filter(unPais => (
                (unPais.id == 53)
            )
            )[0];



            console.log(this.seleccionPaises);
            //console.log(this.paises)




        });

        onRendered(() => {

        });

        onMounted(() => {
            var availableTags = [
                "ActionScript",
                "AppleScript",
                "Asp",
                "BASIC",
                "C",
                "C++",
                "Clojure",
                "COBOL",
                "ColdFusion",
                "Erlang",
                "Fortran",
                "Groovy",
                "Haskell",
                "Java",
                "JavaScript",
                "Lisp",
                "Perl",
                "PHP",
                "Python",
                "Ruby",
                "Scala",
                "Scheme"
            ];

            $("#tags").autocomplete({
                source: availableTags
            });

            $.widget("custom.iconselectmenu", $.ui.selectmenu, {
                _renderItem: function (ul, item) {
                    var li = $("<li>"), wrapper = $("<div>", { text: item.label });

                    if (item.disabled) {
                        li.addClass("ui-state-disabled");
                    }

                    $("<span>", {
                        style: item.element.attr("data-style"),
                        "class": "ui-icon " + item.element.attr("data-class")
                    }).appendTo(wrapper);

                    return li.append(wrapper).appendTo(ul);
                }
            });

           // $("#filesA").iconselectmenu().iconselectmenu("menuWidget").addClass("ui-menu-icons");

           // $("#filesB").iconselectmenu().iconselectmenu("menuWidget").addClass("ui-menu-icons customicons");

            $("#people").iconselectmenu().iconselectmenu("menuWidget").addClass("ui-menu-icons avatar");

        })

    }


    async onChangePais() {

    }



    async onRecargar() {
        return;
        //cardCUP	cardUSD
        const service = `card${this.inputReceiveCurrencyRef.el.value.toUpperCase()}`;

        //TODO: Validaciones
        const datosTX = {
            //   service: service,
            //   amount: this.inputSendRef.el.value,                                           //Cantidad a enviar, incluyendo el fee
            //   currency: this.inputSendCurrencyRef.el.value.toUpperCase(),                   //moneda del envio
            //   deliveryAmount: this.inputReceiveRef.el.value,                                //Cantidad que recibe el beneficiario
            //   deliveryCurrency: this.inputReceiveCurrencyRef.el.value.toUpperCase(),        //moneda que se recibe      
            //   concept: this.concept.el.value,                                               //Concepto del envio
            //   merchant_external_id: API.generateRandomID(),
            //   paymentLink: true,
            //   ...this.beneficiario
        }


        console.log(datosTX);

        if (!this.validarDatos(datosTX)) {
            console.log("Validation Errors");
            return;
        }


        try {

            const accessToken = window.sessionStorage.getItem('accessToken');
            const api = new API(accessToken);
            const resultado = await api.createTX(datosTX);

            //TODO OK
            if (resultado.data) {
                if (resultado.data.status === 200) {
                    Swal.fire(resultado.data.payload);
                }
            }

            //Error pero aun responde el API
            if (resultado.response) {
                Swal.fire(resultado.response.data.message);
            }

        } catch (error) {
            console.log(error);
            // Swal.fire(resultado.response.data.message);
        }

    }


    validarDatos(datos) {
        console.log(datos)
        //--------------------- Sending amount --------------------------------------------
        if (!datos.amount) {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please enter the sending amount'
            })
            return false;
        } else if (datos.amount <= 0) {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Sending amount must be greater than zero'
            })
            return false;
        }

        //--------------------- Receivers amount --------------------------------------------
        if (datos.deliveryAmount <= 0) {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'The received amount must be greater than zero'
            })
            return false;
        }

        //--------------------- Municipio --------------------------------------------
        if (!datos.receiverCity || datos.receiverCity === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please select city'
            })
            return false;
        }

        //--------------------- Nombre --------------------------------------------
        if (!datos.cardHolderName || datos.cardHolderName === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please enter the full name of receiver First name and Last name at least'
            })
            return false;
        }



        //--------------------- address --------------------------------------------
        if (!datos.deliveryAddress || datos.deliveryAddress === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please enter the address'
            })
            return false;
        }

        //--------------------- Phone --------------------------------------------
        if (!datos.contactPhone || datos.contactPhone === '') {
            Swal.fire({
                icon: 'error', title: 'Error',
                text: 'Please enter the phone number'
            })
            return false;
        }

        return true;

    }

}

