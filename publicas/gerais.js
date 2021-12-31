/**
 * Verifica se a variável global ${MODO} contém chaves (relatar, diagnostico) ativadas, caso em que executará console.debug em todos os escopos em que esta função foi chamada - isso permite fazer debug tanto em ambiente de desenvolvimento (MODO.relatar = true/false), quanto em ambiente de produção (MODO.diagnosticar = true), onde o valor da chave poderá ser modificado por acionamento de imput na intyerface de usuário:
 * @param  {string} texto
 * @param  {object} objeto
 * @example
 * MODO.relatar = true
 * relatar('Rótulo 1:',objeto1)
 * relatar('Rótulo 2:',objeto2)
 * MODO.relatar = false
 */
 function relatar(
	texto		= '',
	objeto	= false
){

	MODO.diagnosticar = CONFIGURACAO?.diagnosticar || false

	if(
		MODO.diagnosticar
		||
		MODO.relatar
	){
		if(!objeto)
			console.debug(texto)
		else
			console.debug(texto,objeto)
	}

}


/**
 * Verifica se um objeto está vazio:
 * @param {object}	objeto
 */
function vazio(objeto){

	relatar('Verificando se o parametro existe:',objeto)
	if(!objeto)
		return true

	relatar('Verificando o tipo do parametro:',(typeof objeto))
	if(typeof objeto != 'object')
		return false

	relatar('Verificando se o objeto contém alguma chave:',objeto)
	for(let chave in objeto){
		if(objeto.hasOwnProperty(chave))
			return false
	}

	relatar('-> objeto:',objeto)

	return true

}


/**
 * Retorna apenas os números de uma string:
 * @param {string}	texto
 */
function numeros(texto){

	relatar('-> Obtendo números de:',texto)

	if(!texto)
		return ''

	let resultado = texto.replace(/\D/g,'').toString() || ''
	relatar('-> resultado:',resultado)

	return resultado

}


/**
 * Retorna o valor de um parametro de URL:
 * @param {string}	parametro
 */
function obterParametroDeURL(parametro){

	relatar('Instanciando objeto...')

	let url = new URL(window.location.href)
	if(!url)
		return
	relatar('-> url:',url)

	let parametros = new URLSearchParams(url.search)
	relatar('-> parametros:',parametros)

	let valor = parametros.get(parametro) || ''
	relatar('-> valor:',valor)

	return valor

}


/**
 * Abre uma URL, por meio do ${browser.runtime} (navegador/navegador.js), utilizando o método ${criarJanela()} (publicas/navegador.js).
 * É preferível ao ${window.open}, pois permite configurar opções da janela a nível de navegador.
 * @param  {string}		url
 * @param  {string}		chave				Será usada para extrair configurações de ${CONFIGURACAO.janela[chave]}
 * @param  {integer}	largura
 * @param  {integer}	altura
 * @param  {integer}	horizontal	Distância da esquerda
 * @param  {integer}	vertical		Distância do topo
 * @param  {string} 	tipo				Ver https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/CreateType
 */

function abrirPagina(
	url,
	chave				= 'nova',
	largura			= 1000,
	altura			= 700,
	horizontal	= 0,
	vertical		= 0,
	tipo				= 'normal'
){

	let opcoes				= {}
	opcoes.chave			= chave
	opcoes.url				= url
	opcoes.largura		= largura
	opcoes.altura			= altura
	opcoes.horizontal	= horizontal
	opcoes.vertical		= vertical
	opcoes.tipo				= tipo

	relatar('Mensagem para o navegador:',opcoes)
	browser.runtime.sendMessage(opcoes)

}


function clicar(seletor){

	let elemento = selecionar(seletor)

	if(elemento){
		elemento.click()
		esforcosPoupados(1,1)
	}

}


function copiar(texto){

	relatar('Copiando texto... ',texto)

	navigator.clipboard.writeText(texto).then(
		() => {
			relatar('Conteúdo copiado:',texto)
			esforcosPoupados(1,2,2)
			return
		},
		erro => {
			relatar('x Não foi possível copiar: ',erro)
			return
		}
	)

}


function fechar(){

	relatar('Fechando a janela...')
	window.close()
	relatar('Janela fechada!')

}


function saudacao(){

	let data	= new Date()
	let hora	= data.getHours()
	let texto	= 'Bo'
	
	switch(true){
		case(hora < 12):
			texto += 'm dia!'
			break
		case(hora >= 12 && hora < 18):
			texto += 'a tarde!'
			break
		case(hora >= 18 && hora < 24):
			texto += 'a noite!'
			break
	}

	return texto

}





function obterValorMonetario(texto){

	if(!texto)
		return ''

	let valor = texto.match(EXPRESSAO.valorMonetario) || ''
	if(!valor)
		return ''

	return valor.join()

}