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

	abrirPagina(url,'','','','','pjeDetalhes')

	esforcosPoupados(4,4,contarCaracteres(numero))

}


function pjeAbrirPainelDeConsultaProcessual(consulta = {}){

	if(vazio(consulta))
		return

	let campo			= Object.keys(consulta)[0]
	let conteudo	= consulta[campo]

	let url = LINK.pje.consulta.processos + '?' + campo + '=' + conteudo

	abrirPagina(url,'','','','','pjePainel')

	esforcosPoupados(3,3,contarCaracteres(conteudo))

}


function pjeAbrirPaginaDeConsultaProcessual(numero=''){

	if(!numero)
		return

	let url = LINK.pje.painel.global + '?processo=' + numero

	abrirPagina(url,'','','','','pjePainel')

	esforcosPoupados(3,3,contarCaracteres(conteudo))

}


function pjeObterContexto(){

	if(JANELA.match(/navegador[/]processo[/]processo[.]htm/i))
		return 'pje-dados-do-processo'

	if(JANELA.match(/processo[/]\d+[/]detalhe/i))
		return 'pje-detalhes'

	if(JANELA.match(/pjekz.gigs.abrir-gigs/i))
		return 'pje-gigs'

	if(JANELA.match(/processo[/]\d+[/]tarefa/i))
		return 'pje-tarefa'

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


function copiarDadosDoProcesso(){
	copiar(JSON.stringify(PROCESSO))
}


function pjeCriarBotaoFixoConfigurarDimensoesDaJanela(){

	pjeCriarBotaoFixo(
		'botao-dimensoes',
		'Definir dimensões padrão para a janela',
		() => {

			let descricao	= ''
			let editar		= ''
			let contexto	= pjeObterContexto()

			if(contexto.includes('pje-dados-do-processo')){
				descricao	= 'Dados do Processo'
				editar		= 'pjeDados'
			}

			if(contexto.includes('pje-detalhes')){
				descricao	= 'Detalhes do Processo'
				editar		= 'pjeDetalhes'
			}

			if(contexto.includes('pje-gigs')){
				descricao	= 'GIGS'
				editar		= 'pjeGigs'
			}

			if(contexto.includes('pje-tarefa')){
				descricao	= 'Tarefa do Processo'
				editar		= 'pjeTarefa'
			}

			abrirPagina(caminho(`navegador/link/link.htm?editar=${editar}&descricao=${descricao}`),800,500,0,0,'link','popup')

		}
	)

}


function pjeCriarBotaoFixoDestacarDadosDoProcesso(){

	pjeCriarBotaoFixo(
		'botao-dados-do-processo',
		'Destacar dados do processo em uma nova janela',
		() => {
			
			let dados = {}
			dados.mandado = {}
			dados.orgaoJulgador = {}

			dados.mandado.id = pjeObterDocumentoId()
			dados.mandado.data = pjeObterDocumentoData()

			dados.orgaoJulgador.descricao = PROCESSO?.orgaoJulgador?.descricao || ''

			dados.id			= PROCESSO?.id || ''
			dados.numero	= PROCESSO?.numero || ''
			dados.partes	= PROCESSO?.partes || ''
			dados.valor		= PROCESSO?.valor || ''

			abrirPagina(caminho('navegador/processo/processo.htm')+'?processo='+encodeURIComponent(JSON.stringify(dados)),'','','','','pjeDados')

		}
	)

}


function pjeCriarBotaoFixo(
	id				= '',
	legenda		= '',
	aoClicar	= ''
){
	criarBotao('avjt-'+id,'avjt-botao-fixo informacoes','','',legenda,aoClicar)
}


function obterPoloPassivo(texto){
	let polo = texto.replace(/^.*?\sx\s/gi,'') || ''
	if(polo)
		polo = maiusculas(polo.trim())
	return polo
}