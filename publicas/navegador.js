/**
 * Monta um caminho absoluto para um arquivo de uma string com um caminho partindo do manifest.json:
 * @param {string}	arquivo
 */
function caminho(arquivo=''){

	if(!arquivo)
		return ''
	return browser.runtime.getURL(arquivo)

}


/**
 * Cria uma janela com os parâmetros determinados:
 * @param  {string}		url
 * @param  {string}		chave				Será usada para extrair configurações de ${CONFIGURACAO.janela[chave]}
 * @param  {integer}	largura
 * @param  {integer}	altura
 * @param  {integer}	horizontal
 * @param  {integer}	vertical
 * @param  {string} 	tipo				Ver https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/CreateType
 */
 function criarJanela(
	url,
	chave				= 'nova',
	largura			= 1200,
	altura			= 900,
	horizontal	= 0,
	vertical		= 0,
	tipo				= 'normal'
){

	relatar('Obtendo configurações...')
	let janela = CONFIGURACAO?.janela || {}

	relatar('-> CONFIGURACAO.janela:',janela)

	relatar('Verificando se as configurações estão definiodas para a janela',chave)
	if(janela[chave]){
		relatar('Coniguração encopntrada:',janela[chave])
		let valor		= janela[chave]
		if(valor?.largura)
			largura			= valor.largura
		if(valor?.altura)
			altura			= valor.altura
		if(valor?.horizontal)
			horizontal	= valor.horizontal
		if(valor?.vertical)
			vertical		= valor.vertical
	}

	relatar('Definindo opções...')
	let opcoes = JSON.parse(
		`
		\{
			"url":		"${url}",
			"height":	${altura},
			"left":		${horizontal},
			"top":		${vertical},
			"width":	${largura},
			"type":		"${tipo}"
		\}
		`
	)

	relatar('Opções definidas:',opcoes)

	relatar('Criando janela:')
	browser.windows.create(opcoes)
	relatar('Janela criada!',chave)

}


function abrirPaginaOpcoesDaExtensao(){

	browser.runtime.openOptionsPage()

}


function abrirPaginaTermosDeUso(){

	criarJanela(
		caminho('navegador/termos.htm'),
		'',
		700,
		800,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaContadorDeEsforcosRepetitivos(){

	criarJanela(
		caminho('navegador/esforcos.htm'),
		'',
		700,
		400,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaConfiguracaoDeLink(
	editar		= '',
	descricao	= ''
){

	criarJanela(
		caminho(`navegador/link.htm?editar=${editar}&descricao=${descricao}`),
		'',
		800,
		775,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaConfiguracaoDoTribunal(){

	criarJanela(
		caminho('navegador/tribunal.htm'),
		'',
		700,
		500,
		0,
		0,
		'detached_panel'
	)

}


function reiniciarContadorDeEsforcosRepetitivos(){

	browser.storage.local.remove('esforcos')
	window.location.reload()

}


function definirIconeDaExtensaoPeloEstado(ativada){

	if(
		ativada != true
		&&
		ativada != false
	){
		ativada = false
		browser.storage.local.set({ativada:ativada})
	}

	if(ativada)
		browser.browserAction.setIcon({path:'../imagens/icones/extensao/colorido.svg'})
	else
		browser.browserAction.setIcon({path:'../imagens/icones/extensao/branco.svg'})

}


function definirEstadoDaExtensao(){

	EXTENSAO.ativador = selecionar('#ativador')
	if(!EXTENSAO.ativador)
		return

	EXTENSAO.ativador.addEventListener('change',salvarEstadoDaExtensao)

	browser.storage.local.get(
		'ativada',
		armazenamento => {
			EXTENSAO.ativador.checked = armazenamento.ativada
		}
	)

	function salvarEstadoDaExtensao(){

		let ativado		= EXTENSAO.ativador.checked || false
		browser.storage.local.set({ativada:ativado})
		definirIconeDaExtensaoPeloEstado(ativado)

	}

}


function recarregar(){

	relatar('Recarregando a extensão...')
	browser.runtime.reload()

}
