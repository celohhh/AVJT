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

	//idProcessoExterno
}


//https://pje.trt17.jus.br/pje-centralmandados-api/api/mandados/51928/detalhamentos