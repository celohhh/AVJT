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


function destacarJanela(
	separar				= false,
	mensagem			= '',
	largura				= 1200,
	altura				= 900,
	horizontal		= 0,
	vertical			= 0
){

	if(separar){
		if(!CONFIGURACAO?.janela?.nova){
			browser.runtime.sendMessage(
				{
					mensagem:mensagem,
					largura:largura,
					altura:altura,
					horizontal:horizontal,
					vertical:vertical
				}
			)
			CONFIGURACAO.janela.nova = true			
		}
	}

}


function abrirPaginaOpcoesDaExtensao(){

	browser.runtime.openOptionsPage()

}


function abrirPaginaScriptDeUsuario(){

	criarJanela(
		caminho('navegador/sandbox/sandbox.htm'),
		'',
		700,
		600,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaTermosDeUso(){

	criarJanela(
		caminho('navegador/termos/termos.htm'),
		'',
		700,
		600,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaDesenvolvimento(){

	criarJanela(
		caminho('navegador/desenvolvimento/desenvolvimento.htm'),
		'',
		700,
		600,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaContadorDeEsforcosRepetitivos(){

	criarJanela(
		caminho('navegador/esforcos/esforcos.htm'),
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
		caminho(`navegador/link/link.htm?editar=${editar}&descricao=${descricao}`),
		'',
		800,
		600,
		0,
		0,
		'detached_panel'
	)

}


function abrirPaginaConfiguracaoDoTribunal(){

	criarJanela(
		caminho('navegador/tribunal/tribunal.htm'),
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
		browser.browserAction.setIcon({path:'/imagens/icones/extensao/colorido.svg'})
	else
		browser.browserAction.setIcon({path:'/imagens/icones/extensao/branco.svg'})

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


function obterConfiguracoesDaExtensao(){

	document.querySelectorAll('configuracoes').forEach(
		configuracoes => {

			let destino = definirDestinoDasConfiguracoes(configuracoes)

			configuracoes.querySelectorAll('input').forEach(
				configuracao => {

					let chave = configuracao.className
					if(!chave)
						return
					let dados = CONFIGURACAO[destino]
					if(configuracao.type === 'checkbox')
						configuracao.checked = dados[chave] || false
					if(configuracao.type === 'email')
						configuracao.value = dados[chave] || ('@' + obterDominioTribunal()) || configuracao.value || ''
					if(configuracao.type === 'number')
						configuracao.value = dados[chave] || configuracao.value || 0
					if(configuracao.type === 'text')
						configuracao.value = dados[chave] || configuracao.value || ''

				}
			)
		}
	)

}


function salvarConfiguracoesDaExtensao(){

	setTimeout(salvar,50)

	function salvar(){

		document.querySelectorAll('configuracoes').forEach(
			configuracoes => {

				let destino	= definirDestinoDasConfiguracoes(configuracoes)
				let dados		= CONFIGURACAO[destino]

				configuracoes.querySelectorAll('input').forEach(
					configuracao => {

						let chave = configuracao.className || ''
						if(!chave)
							return

						if(configuracao.type === 'checkbox')
							dados[chave] = configuracao.checked || false
						if(configuracao.type === 'number')
							dados[chave] = configuracao.value || 0
						if(
							configuracao.type === 'email'
							||
							configuracao.type === 'text'
						)
							dados[chave] = configuracao.value.trim() || ''

					}
				)

				browser.storage.local.set({[destino]:dados})

			}
		)

	}

}


function definirDestinoDasConfiguracoes(configuracoes){

	let destino = configuracoes.className || ''
	if(!destino)
		return

	if(CONFIGURACAO[destino] == undefined)
		CONFIGURACAO[destino] = {}

	return destino

}