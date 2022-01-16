function pjeObterProcessoId(){

	EXPRESSAO.processoId = new RegExp(/(processo.*?[/](detalhe|documento|tarefa))/,'gi')

	let caminho = window.location.pathname.match(EXPRESSAO.processoId) || ''
	let id      = ''

	if(!caminho)
		return id

	id = numeros(caminho.join()) || ''

	return id

}

function pjeObterMandadoId(){

	EXPRESSAO.mandadoId = new RegExp(/(centralmandados[/]mandados[/]\d+$)/,'gi')

	let caminho = window.location.pathname.match(EXPRESSAO.mandadoId) || ''
	let id      = ''

	if(!caminho)
		return id

	id = numeros(caminho.join()) || ''

	return id

}


function obterDadosDoNumeroDoProcesso(numero){

	if(!numero)
		return ''

	let processo = {}

	processo.numeros = numeros(numero)

	if(numero.length === 25){

		let campos = numero.replace(/\D/g,'.').split('.')

		processo.ordenador	= campos[0]
		processo.digito			= campos[1]
		processo.ano				= campos[2]
		processo.jurisdicao	= campos[3]
		processo.tribunal		= campos[4]
		processo.origem			= campos[5]

	}

	if(processo.ordenador){
		let	paridade = Number(processo.ordenador) % 2
		if(paridade === 1)
			processo.paridade = 'ímpar'
		if(paridade === 0)
			processo.paridade = 'par'
	}

	return processo

}


function pjeSalvarDadosDoProcesso(){

	let id = 'json-dados-do-processo'

	let elemento = criar(
		'meta',
		id,
		'',
		document.head
	)

	elemento.name = id
	elemento.content = JSON.stringify(PROCESSO)

}


async function pjeApiObterProcessoDadosPrimarios(id){

	let url = LINK.pje.api.comum + 'processos/id/' + id

	relatar('Consultando API do PJe:',url)

	let resposta  = await fetch(url)
	let dados     = await resposta.json()

	return dados

}


async function pjeApiObterProcessoTarefa(id){

	let url = LINK.pje.api.comum + 'processos/id/' + id + '/tarefas'

	relatar('Consultando API do PJe:',url)

	let resposta = await fetch(url)
	let dados = await resposta.json()

	return dados[0]

}


async function pjeApiObterProcessoPartes(id){

	let url = LINK.pje.api.comum + 'processos/id/' + id + '/partes'

	relatar('Consultando API do PJe:',url)

	let resposta  = await fetch(url)
	let dados     = await resposta.json()

	return dados

}

async function pjeApiCentralDeMandadosObterMandadoDadosPrimarios(id){

	let url = LINK.pje.api.mandados + 'mandados/' + id + '/detalhamentos'

	relatar('Consultando API do PJe:',url)

	let resposta  = await fetch(url)
	let dados     = await resposta.json()

	return dados

}


async function pjeApiCentralDeMandadosObterProcessoId(id){

	let url = LINK.pje.api.comum + 'processos/id/' + id + '/partes'

	relatar('Consultando API do PJe:',url)

	let resposta  = await fetch(url)
	let dados     = await resposta.json()

	return dados

}


async function pjeConsultarDetalhesDoProcesso(numero=''){

	if(!numero)
		return

	let dados = await pjeApiConsultaPublicaObterProcessoId(numero) || ''
	let id = dados[0]?.id || ''

	if(
		!id
		||
		!dados
		||
		dados?.codigoErro
	){

		pjeAbrirPaginaDeConsultProcessual(numero)
		return

	}

	let url = LINK.pje.processo + id + '/detalhe?janela=destacada'

	let janela			= CONFIGURACAO?.janela?.pjeDetalhes || ''
	let largura			=	janela?.largura			|| 1200
	let altura			= janela?.altura			|| 900
	let horizontal	= janela?.horizontal	|| 0
	let vertical		= janela?.vertical		|| 0

	abrirPagina(
		url,
		largura,
		altura,
		horizontal,
		vertical
	)

}


function pjeAbrirPainelDeConsultaProcessual(consulta = {}){

	if(vazio(consulta))
		return

	let campo			= Object.keys(consulta)[0]
	let conteudo	= consulta[campo]

	let url = LINK.pje.consulta.processos + '?' + campo + '=' + conteudo

	let janela			= CONFIGURACAO?.janela?.pjePainel || ''

	let largura			=	janela?.largura			|| 1200
	let altura			= janela?.altura			|| 900
	let horizontal	= janela?.horizontal	|| 0
	let vertical		= janela?.vertical		|| 0

	abrirPagina(
		url,
		largura,
		altura,
		horizontal,
		vertical
	)

	esforcosPoupados(3,3,contarCaracteres(conteudo))

}


function pjeAbrirPaginaDeConsultaProcessual(numero=''){

	if(!numero)
		return

	let url = LINK.pje.painel.global + '?processo=' + numero

	abrirPagina(url)

}


async function pjeApiConsultaPublicaObterProcessoId(numero){

	let url = LINK.pje.api.consulta + 'processos/dadosbasicos/' + numero

	let resposta = 	await fetch(
		url,
		{
			"credentials": "include",
			"headers": {
					"X-Grau-Instancia": CONFIGURACAO?.instituicao?.instancia || 1
			},
			"method": "GET",
			"mode": "cors"
		}
	)

	let dados = await resposta.json()

	return dados || ''

}


function pjeObterContexto(){

	if(JANELA.match(/processo[/]\d+[/]detalhe/i))
		return 'pje-detalhes'

	if(JANELA.match(/centralmandados[/]mandados[/]\d+$/i))
		return 'pje-mandados'

	return ''

}



function pjeObterDocumentoCabecalhoTexto(){
	let cabecalho = selecionar('.cabecalho-conteudo')
	if(!cabecalho)
		return ''
	return cabecalho.innerText || ''
}

function pjeObterDocumentoId(){
	let texto = pjeObterDocumentoCabecalhoTexto()
	if(!texto)
		return ''
	let id = texto.match(/^Id\s.*?\s/g)
	if(!id)
		return ''
	return id.join().replace(/Id/g,'').trim() || ''
}


function pjeObterDocumentoData(){
	let texto = pjeObterDocumentoCabecalhoTexto()
	if(!texto)
		return ''
	return obterData(texto) || ''
}