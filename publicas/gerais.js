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


function maiusculas(texto){
	if(!texto)
		return ''
	return texto?.toUpperCase() || ''
}


function minusculas(texto){
	if(!texto)
		return ''
	return texto?.toLowerCase() || ''
}


function titularizar(texto){

	if(!texto)
		return ''

	let textoEmMinusculas = minusculas(texto)

	let titulo = textoEmMinusculas.split(' ').map(
		palavra => {
			if(palavra)
				return palavra.replace(
					palavra[0],
					maiusculas(palavra[0])
				)
		}
	).join(' ')


	return titulo.replace(
		/\s(E|(A|O)(s)|D(e|a|as|o|os))\s/g,
		correspondencia => minusculas(correspondencia)
	)

}



/**
 * Retorna o valor de um parametro de URL:
 * @param {string}	parametro
 */
function obterParametroDeUrl(parametro){

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
	largura			= '',
	altura			= '',
	horizontal	= '',
	vertical		= '',
	chave				= '_blank',
	tipo				= 'normal'
){

	let opcoes				= {}
	opcoes.chave			= chave
	opcoes.url				= url
	opcoes.largura		= largura || 1000
	opcoes.altura			= altura || 700
	opcoes.horizontal	= horizontal || 0
	opcoes.vertical		= vertical || 0
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


function focar(seletor){

	let elemento = selecionar(seletor)

	if(elemento){
		elemento.focus()
		esforcosPoupados(1,1)
	}

}


function copiar(texto){

	relatar('Copiando texto... ',texto)

	navigator.clipboard.writeText(texto).then(
		() => {
			esforcosPoupados(1,2,2)
			relatar('Conteúdo copiado:',texto)
			return
		},
		erro => {
			relatar('x Não foi possível copiar: ',erro)
			return
		}
	)

}


function copiarConteudo(){

	this.select()
	copiar(this.value)
	esforcosPoupados(0,0,2)

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


function obterData(texto){

	let data = texto.match(EXPRESSAO.data) || ''
	if(!data)
		return ''

	return data[0]

}


function obterHora(texto){

	let hora = texto.match(EXPRESSAO.hora) || ''
	if(!hora)
		return ''

	return hora[0]

}


function obterValorMonetario(texto){

	let valor = texto.match(EXPRESSAO.valorMonetario) || ''
	if(!valor)
		return ''

	return valor[0]

}


function obterCPF(texto){
	let cpf = texto.match(EXPRESSAO.cpf) || ''
	if(!cpf)
		return ''
	return cpf[0]
}

function obterCNPJ(texto){
	let cnpj = texto.match(EXPRESSAO.cnpj) || ''
	if(!cnpj)
		return ''
	return cnpj[0]
}

function obterRaizCNPJ(texto){
	return texto.replace(/[/].*/gi,'') || ''
}

function obterDocumento(texto){
	let cnpj = obterCNPJ(texto)
	let cpf = obterCPF(texto)
	return cnpj+cpf
}

function obterNumeroDoProcessoPadraoCNJ(texto){
	let numero = texto.match(EXPRESSAO.processoNumero) || ''
	if(!numero)
		return ''
	return numero[0] || ''
}

function obterNumeroDoProcessoParcial(texto){
	let numero = texto.match(EXPRESSAO.processoNumeroParcial) || ''
	if(!numero)
		return ''
	return String(numero[0])?.padStart(15,'0') || ''
}

function obterChassi(texto){
	let chassi = texto.match(EXPRESSAO.chassi) || ''
	if(!chassi)
		return ''
	return chassi[0]
}

function obterPlacaDeVeiculoAutomotor(texto){
	let placa = texto.match(/[A-Za-z]{3}\d{4}/gi) || texto.match(/[A-Za-z]{3}(-|–|\s|[.])\d{4}/gi) || texto.match(/[A-Za-z]{3}\d{1}[A-Za-z]\d{2}/gi) || ''
	if(!placa)
		return ''
	return placa[0].replace(/(-|–|\s|[.])/,'')
}

function obterNomeCompleto(texto){
	let nome = texto.match(EXPRESSAO.nomeCompleto) || ''
	if(!nome)
		return ''
	return nome[0].trim()
}


function alterarValorDeCampo(
	campo = '',
	texto = '',
	change = false,
	input = true
){

	if(!campo)
		return

	campo.focus()

	let propriedade = Object.getOwnPropertyDescriptor(
		window.HTMLInputElement.prototype,
		'value'
	).set

	propriedade.call(campo,texto)

	if(change)
		dispararEvento('change',campo)

	if(input)
		dispararEvento('input',campo)

	esforcosPoupados(1,1,contarCaracteres(texto))

}


function contarCaracteres(texto){
	if(!texto)
		return 0
	if(texto?.length){
		let caracteres = texto.length || 0
		if(caracteres > 0)
			return caracteres
	}
	else
		return 0
}