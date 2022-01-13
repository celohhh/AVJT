/**
 * Verifica a existência de um elemento no momento da chamada; se não existir, inicia um ${MutationObserver} no ${document.body}:
 * @param {string}	seletor			Seletor  CSS
 * @param {boolean}	atributos		Verifica os atributos dos elementos
 * @param {boolean}	caracteres	Verifica mudança nos caracteres
 * @return elemento
 * @example
 * esperar('#id').then(elemento => console.log(elemento))
 */
async function esperar(
	seletor			= '',
	atributos		= false,
	caracteres	= false
){
	return new Promise(
		resolver => {
			let elemento = selecionar(seletor)
			if(elemento){
				relatar('-> Elemento encontrado: ',elemento)
				resolver(elemento)
				return
			}
			let observador = new MutationObserver(
				mudanca => {
					relatar('-> Mudança: ',mudanca)
					relatar('-> Aguardando elemento "'+seletor+'"...',)
					let observado = selecionar(seletor)
					if(observado){
						relatar('-> Elemento encontrado: ',observado)
						observador.disconnect()
						resolver(observado)
					}
				}
			)
			observador.observe(
				document.body,
				{
					childList:			true,
					subtree:				true,
					attributes:			atributos,
					characterData:	caracteres
				}
			)

		}
	)
}


/**
 * Retorna elemento(s) com base no seletor CSS:
 * @param {string}	seletor		Seletor  CSS
 * @param {object}	ancestral	Elemento ancestral (se vazio, utilizará ${document.body})
 * @param {boolean}	todos			Se true, executará querySelectotAll
 * @return elemento
 */
function selecionar(
	seletor		= '',
	ancestral	= {},
	todos			= false
){

	relatar('Procurando elemento:',seletor)

	if(!seletor){
		relatar('Seletor vazio:',seletor)
		return ''
	}

	let elemento = null

	if(vazio(ancestral))
		ancestral = document

	if(todos){
		elemento = ancestral.querySelectorAll(seletor)
		if(vazio(elemento)){
			relatar('Não encontrado:',seletor)
			return ''
		}
	}
	else{
		elemento = ancestral.querySelector(seletor) || ''
		if(!elemento){
			relatar('Não encontrado:',seletor)
			return ''
		}
	}
	relatar('-> elemento: ',elemento)

	return elemento

}


/**
 * Remove um elemento elemento pelo id:
 * @param {string} id
 */
function remover(id=''){

	if(!id)
		return

	let elemento = document.getElementById(id) || ''
	if(!elemento){
		relatar('Elemento não encontrado:',id)
		return
	}

	relatar('Removendo:',elemento)

	elemento.remove()

}


/**
 * Cria um elemento HTML básico e insere em ${document.body} ou em um ancestral específico:
 * @param {string} tag
 * @param {string} id
 * @param {string} classe
 * @param {object} ancestral
 * @param {object} antesDe
 * @param {object} depoisDe
 * @return elemento
 * @example
 * const elemento = criar('div','id')
 */
function criar(
	tag				= '',
	id				= '',
	classe		= '',
	ancestral	= false,
	antesDe		= false,
	depoisDe	= false
){

	remover(id)

	if(!tag)
		tag = 'div'

	if(!ancestral)
		ancestral = document.body

	let elemento = document.createElement(tag)

	if(id)
		elemento.id = id

	if(classe)
		elemento.className = classe

	relatar('Elemento criado:',elemento)

	if(antesDe)
		ancestral.insertBefore(elemento,antesDe)
	else if(depoisDe)
		ancestral.insertAfter(elemento,depoisDe)
	else
		ancestral.appendChild(elemento)

	relatar('Elemento inserido:',elemento)

	return elemento || ''

}


/**
 * Cria um <style scoped> e insere em ${document.head} ou em um ancestral específico:
 * @param {string} id
 * @param {object} ancestral
 * @param {string} css
 * @return elemento
 * @example
 * const estilo = estilizar(
 *  '',
 *  document.querySelector('#id'),
 *  `
 *   #id{
 *    color:black;
 *   }
 *  `
 * )
 */
function estilizar(
	id				= '',
	ancestral	= '',
	css				= ''
){

	let escopo = ancestral || ''

	if(!ancestral)
		ancestral = document.head

	let elemento = criar(
		'style',
		id,
		'',
		ancestral
	)

	if(escopo)
		elemento.scoped = true

	elemento.textContent = css

	return elemento

}

/**
 * Cria um <a> e insere no ${document.body} ou em um ancestral específico:
 * @param  {string}	id
 * @param  {string}	classe
 * @param  {object}	ancestral
 * @param  {string}	endereco	URL
 * @param  {string} texto
 * @param  {string}	titulo
 * @param  {method}	aoClicar	Função a ser executada ao clicar
 * @return a
 */
function criarLink(
	id				= '',
	classe		= '',
	ancestral = '',
	endereco	= '',
	texto			= '',
	titulo		= '',
	aoClicar	= ''
){

	let a					= criar('a',id,classe,ancestral)

	if(endereco)
		a.href			= endereco

	if(texto)
		a.innerText	= texto

	if(titulo)
		a.setAttribute('aria-label',titulo)

	if(aoClicar)
		a.addEventListener('click',aoClicar)

	a.target	= '_blank'

	return a

}


/**
 * Cria um <dl> e insere no ${document.body} ou em um ancestral específico:
 * @param  {string}	id
 * @param  {string}	classe
 * @param  {object}	ancestral
 * @param  {array}	itens
 * @return dl
 * @example
 *
 * const elemento = criarListaDeDefinicoes(
 *   '',
 *   '',
 *   ancestral,
 *   [
 *    {
 *     dt:"Titulo 1",
 *     dd:"Texto 1"
 *    },
 *    {
 *     dt:"Titulo 2",
 *     dd:"Texto 2"
 *    }
 *   ]
 * )
 */
function criarListaDeDefinicoes(
	id				= '',
	classe		= '',
	ancestral = '',
	itens			= []
){

	let dl	= criar('dl',id,classe,ancestral)

	itens.forEach(
		item => {
			let dt				= criar('dt','','',dl)
			dt.innerText	= item.dt
			let dd				= criar('dd','','',dl)
			dd.innerText	= item.dd
		}
	)

	return dl

}