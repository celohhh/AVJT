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


async function pjeApiObterProcessoTarefaMaisRecente(id){

	let url = LINK.pje.api.comum + 'processos/id/' + id + '/tarefas?maisRecente=true'

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