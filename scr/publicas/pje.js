async function pjeSelecionarOpcaoPorTexto(texto=''){
	if(!texto)
		return ''
	await esperar('mat-option',true,true)
	let opcao = [...document.querySelectorAll('mat-option')].filter(opcao => opcao.innerText == texto)[0] || ''
	clicar(opcao)
	return opcao
}


function pjeObterProcessoId(){

	EXPRESSAO.processoId = new RegExp(/(processo.*?[/](audiencias|detalhe|documento|pericias|tarefa)|pjekz.gigs.abrir.gigs.*)/,'gi')

	let caminho = window.location.pathname.match(EXPRESSAO.processoId) || ''
	let id = ''

	if(!caminho)
		return id

	id = numeros(caminho.join()) || ''

	return id

}


function pjeObterMandadoId(){

	EXPRESSAO.mandadoId = new RegExp(/(centralmandados[/]mandados[/]\d+$)/,'gi')

	let caminho = window.location.pathname.match(EXPRESSAO.mandadoId) || ''
	let id = ''

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

		processo.ordenador = campos[0]
		processo.digito = campos[1]
		processo.ano = campos[2]
		processo.jurisdicao = campos[3]
		processo.tribunal = campos[4]
		processo.origem = campos[5]

	}

	if(processo.ordenador){
		let	paridade = Number(processo.ordenador) % 2
		if(paridade === 1)
			processo.paridade = 'ímpar'
		if(paridade === 0)
			processo.paridade = 'par'
	}

	if(processo.ordenador){
		let	final = processo.ordenador.substr(-1)
		processo.digitoFinal = final
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

	let campo = Object.keys(consulta)[0]
	let conteudo = consulta[campo]

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

	if(JANELA.match(/processo[/]\d+[/]documento[/]anexar/i))
		return 'pje-anexar'

	if(JANELA.match(/processo[/]\d+[/]audiencias/i))
		return 'pje-audiencias'
	
	if(JANELA.match(/processo[/]\d+[/]comunicacoesprocessuais[/]minutas/i))
		return 'pje-comunicacoes'

	if(JANELA.match(/jus.br.consultaprocessual.detalhe.processo/i))
		return 'pje-consulta-publica'

	if(JANELA.match(/navegador[/]processo[/]processo[.]htm/i))
		return 'pje-dados-do-processo'

	if(JANELA.match(/processo[/]\d+[/]detalhe/i))
		return 'pje-detalhes'

	if(JANELA.match(/processo[/]\d+[/]documento[/]\d+[/]conteudo/i))
		return 'pje-documento'

	if(JANELA.match(/processo.*?tarefa.*?minutar/i))
		return 'pje-editor'

	if(JANELA.match(/pjekz.gigs.abrir-gigs/i))
		return 'pje-gigs'

	if(JANELA.match(/centralmandados[/]mandados[/]\d+$/i))
		return 'pje-mandados'

	if(JANELA.match(/processo[/]\d+[/]pericias/i))
		return 'pje-pericias'

	if(JANELA.match(/sif[/]consultar[/]\d+[/]saldo/i))
		return 'pje-sif'

	if(JANELA.match(/processo[/]\d+[/]tarefa[/]\d+[/]registrar.transito.julgado/i))
		return 'pje-tarefa-registrar-transito-julgado'

	if(JANELA.match(/processo[/]\d+[/]tarefa/i))
		return 'pje-tarefa'

	if(JANELA.match(/primeirograu.Processo.ConsultaProcesso.Detalhe.list.seam/i))
		return 'pje-versao1'

	return ''

}


function pjeObterDocumentoCabecalhoTexto(){
	let cabecalho = selecionar('.cabecalho-conteudo')
	if(!cabecalho)
		return ''
	return cabecalho.innerText || ''
}


function pjeObterDocumentoTitulo(){
	let titulo = selecionar('.cabecalho-conteudo mat-card-title')
	if(!titulo)
		return ''
	return titulo.innerText.trim() || ''
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

function pjeObterDocumentoLink(){
	let texto = pjeObterDocumentoCabecalhoTexto()
	if(!texto)
		return ''
	let link = texto.match(/http.*/gi)
	if(!link)
		return ''
	return link.join().trim() || ''
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

			let descricao = ''
			let editar = ''
			let contexto = pjeObterContexto()

			if(contexto.includes('pje-anexar')){
				descricao = 'Anexar Documento'
				editar = 'pjeAnexar'
			}

			if(contexto.includes('pje-audiencias')){
				descricao = 'Audiências do Processo'
				editar = 'pjeAudiencias'
			}

			if(contexto.includes('pje-consulta-publica')){
				descricao = 'Consulta Pública'
				editar = 'pjeConsultaPublica'
			}

			if(contexto.includes('pje-dados-do-processo')){
				descricao = 'Dados do Processo'
				editar = 'pjeDados'
			}

			if(contexto.includes('pje-detalhes')){
				descricao = 'Detalhes do Processo'
				editar = 'pjeDetalhes'
			}

			if(contexto.includes('pje-gigs')){
				descricao = 'GIGS'
				editar = 'pjeGigs'
			}

			if(contexto.includes('pje-pericias')){
				descricao = 'Perícias do Processo'
				editar = 'pjePericias'
			}

			if(contexto.includes('pje-sif')){
				descricao = 'SIF'
				editar = 'sif'
			}

			if(contexto.includes('pje-tarefa')){
				descricao = 'Tarefa do Processo'
				editar = 'pjeTarefa'
			}

			if(contexto.includes('pje-versao1')){
				descricao = 'Versão 1 do Processo'
				editar = 'pjeLegado'
			}

			abrirPagina(caminho(`navegador/link/link.htm?editar=${editar}&descricao=${descricao}`),800,500,0,0,'link','popup')

		}
	)

}


function pjeCriarBotaoFixoCopiarNumeroDoProcesso(){

	pjeCriarBotaoFixo(
		'botao-copiar-numero-do-processo',
		'Copiar Número do Processo',
		() => {
			if(PROCESSO?.numero){
				copiar(PROCESSO.numero)
				esforcosPoupados(2,3)
			}
		}
	)

}


async function pjeCriarBotaoFixoCopiarDadosTabuladosDoProcesso(){

	pjeCriarBotaoFixo(
		'botao-copiar-dados-tabulados-do-processo',
		'Copiar Dados Tabulados do Processo',
		() => {

			let contexto = pjeObterContexto()

			let data = DATA?.hoje?.curta || ''
			let responsavel = CONFIGURACAO?.usuario?.nome || ''
			let processo = PROCESSO?.numero || ''
			let tarefa = PROCESSO?.tarefa?.nomeTarefa || ''
			let desde = PROCESSO?.data?.ultimoMovimento || DATA.hoje.curta || ''
			let fase = PROCESSO?.faseProcessual || ''
			let poloPassivo = PROCESSO?.partes?.PASSIVO[0]?.nome?.trim() || ''
			let id = PROCESSO?.id || ''

			if(contexto.includes('pje-tarefa')){
				tarefa = 'Análise'
				data = 'FEITO	' + data
				pjeApiObterProcessoTarefaMaisRecente(id).then(
					dados => {
						let tarefaFinal = dados?.nomeTarefa?.trim() || ''
						poloPassivo = poloPassivo + '		' + tarefaFinal
						copiarLinha()
					}
				)
			}
			else
				copiarLinha()

			function copiarLinha(){
				let linha = pjeTabularLinha(data,responsavel,processo,tarefa,desde,fase,'','',poloPassivo) || ''
				copiar(linha)
				esforcosPoupados(14,21,14)
			}

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

			dados.id = PROCESSO?.id || ''
			dados.numero = PROCESSO?.numero || ''
			dados.partes = PROCESSO?.partes || ''
			dados.valor = PROCESSO?.valor || ''

			abrirPagina(caminho('navegador/processo/processo.htm')+'?processo='+encodeURIComponent(JSON.stringify(dados)),'','','','','pjeDados')

		}
	)

}


function pjeCriarBotaoFixoCopiarIdDoDocumento(){

	pjeCriarBotaoFixo(
		'botao-copiar-id-do-documento',
		'Copiar Id do Documento',
		() => {
			copiar(' (Id ' + pjeObterDocumentoId() + ')')
			esforcosPoupados(1,2)
		}
	)

}


function pjeCriarBotaoFixoCopiarDataDoDocumento(){

	pjeCriarBotaoFixo(
		'botao-copiar-data-do-documento',
		'Copiar Data do Documento',
		() => {
			copiar(pjeObterDocumentoData())
			esforcosPoupados(1,2)
		}
	)

}


function pjeCriarBotaoFixoCopiarLinkDoDocumento(){

	pjeCriarBotaoFixo(
		'botao-copiar-link-do-documento',
		'Copiar Link do Documento',
		() => {
			copiar(pjeObterDocumentoLink())
			esforcosPoupados(1,2)
		}
	)

}


function pjeCriarBotaoFixoEnviarDocumentoPorEmail(){

	let botao = pjeCriarBotaoFixo(
		'botao-enviar-documento-por-email',
		'Enviar Documento por E-Mail',
		() => {
			emailEscreverBaixarDocumentoAtivo()
		}
	)

	botao.classList.add('webmail')

}


function pjeCriarBotaoFixoEnviarDocumentoPorWhatsapp(){

	let botao = pjeCriarBotaoFixo(
		'botao-enviar-documento-por-whatsapp',
		'Enviar Documento por WhatsApp',
		() => {
			whatsappMontarMensagem()
		}
	)

	botao.classList.add('whatsapp')

}

function pjeCriarBotaoFixoNotificar(){

	let botao = pjeCriarBotaoFixo(
		'botao-documento-notificar',
		'Notificar',
		() => {
			clicar('#avjt-botao-copiar-link-do-documento')
			pjeAbrirComunicacoes('')
		}
	)

	botao.classList.add('comunicacoes')

}




function pjeCriarBotaoFixo(
	id = '',
	legenda = '',
	aoClicar = ''
){
	let botao = criarBotao('avjt-'+id,'avjt-botao-fixo informacoes','','',legenda,aoClicar)
	if(id.includes('documento'))
		botao.classList.add('avjt-botao-documento')
	if(id.includes('copiar')){
		botao.addEventListener(
			'click',
			() => {
				botao.classList.toggle('copiado')
				setTimeout(
					() => botao.classList.toggle('copiado'),
					1000
				)
			}
		)
	}
	return botao
}


function obterPoloAtivo(texto){
	let polo = texto.replace(/\s+x\s+.*/gi,'') || ''
	if(polo)
		polo = maiusculas(polo)
	return polo.trim()
}

function obterPoloPassivo(texto){
	let polo = texto.replace(/^.*?\s+x\s+/gi,'') || ''
	if(polo)
		polo = maiusculas(polo)
	return polo.trim()
}


function pjeConsultaPublicaProcessoInstancia(
	processo = '',
	instancia = '1'
){

	if(!processo)
		return

	let url = LINK.pje.consulta.instancia2 + encodeURI(processo) + '/' + instancia

	abrirPagina(url,'','','','','pjeConsultaPublica')
	esforcosPoupados(1,1,contarCaracteres(processo))

}


function pjeFiltrarDocumentosDoProcessoPorTipo(tipo){
	if(!PROCESSO.documentos)
		return ''
	let lista = PROCESSO.documentos.reverse() || ''
	if(!lista)
		return ''
	let documentos = lista.filter(
		item => item.tipo.includes(tipo)
	)
	return documentos || ''
}


function pjeAbrirDocumentoEmNovaPagina(
	id,
	largura,
	altura,
	horizontal,
	vertical
){

	let url = LINK.pje.processo + PROCESSO.id + '/documento/' + id + '/conteudo'

	esforcosPoupados(1,3)

	abrirPagina(url,largura,altura,horizontal,vertical)

}


function pjeAoAbrirDetalhesDoProcessoConsultarDepositosJudiciais(){

	//if(!autenticado())
	//	return

	if(CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.siscondjConsultar)
		siscondjConsultarProcesso(PROCESSO.numero)
	if(CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.bbConsultar)
		bbConsultarProcesso(PROCESSO.numero)
	if(CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.cefDepositosJudiciaisConsultar)
		cefConsultarDepositosJudiciaisProcesso(PROCESSO.numero)
	if(CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.cefDepositosRecursaisConsultar)
		cefConsultarDepositosRecursaisPorNomeDoPoloAtivo(PROCESSO.numero)

}

function pjeAoAbrirDetalhesDoProcessoAbrirDocumentos(){

	//if(!autenticado())
		//return

	let largura = 900
	let altura = 800
	let horizontal = 50
	let vertical = 0

	abrirPeticaoInicial()
	abrirUltimaAtaDeAudiencia()
	abrirAtasDeAudiencia()
	abrirSentencas()
	abrirAcordaos()

	function abrirPeticaoInicial(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirPeticaoInicial)
			return
		if(!PROCESSO?.peticaoInicial)
			return
		PROCESSO.peticaoInicial.forEach(
			documento => {
				pjeAbrirDocumentoEmNovaPagina(documento.id,largura,altura,horizontal,vertical)
				horizontal	+= 100
				vertical		+= 50
			}
		)
	}

	function abrirUltimaAtaDeAudiencia(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirUltimaAtaDeAudiencia)
			return
		if(!PROCESSO?.atas)
			return
		let atas = PROCESSO.atas.reverse()
		let ultimaAta = atas[0] || ''
		if(!ultimaAta)
			return
		horizontal += 100
		vertical = 0
		pjeAbrirDocumentoEmNovaPagina(atas[0].id,largura,altura,horizontal,vertical)
	}

	function abrirAtasDeAudiencia(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirAtasDeAudiencia)
			return
		if(!PROCESSO?.atas)
			return
		horizontal += 100
		vertical = 0
		PROCESSO.sentencas.forEach(
			documento => {
				pjeAbrirDocumentoEmNovaPagina(documento.id,largura,altura,horizontal,vertical)
				horizontal	+= 100
				vertical		+= 50
			}
		)
	}

	function abrirSentencas(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirSentencas)
			return
		if(!PROCESSO?.sentencas)
			return
		horizontal += 100
		vertical = 0
		PROCESSO.sentencas.forEach(
			documento => {
				pjeAbrirDocumentoEmNovaPagina(documento.id,largura,altura,horizontal,vertical)
				horizontal	+= 100
				vertical		+= 50
			}
		)
	}

	function abrirAcordaos(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirAcordaos)
			return
		if(!PROCESSO?.acordaos)
			return
		horizontal += 100
		vertical = 0
		PROCESSO.acordaos.forEach(
			documento => {
				pjeAbrirDocumentoEmNovaPagina(documento.id,largura,altura,horizontal,vertical)
				horizontal	+= 100
				vertical		+= 50
			}
		)
	}

}


async function pjeRemoverChip(texto){

	let chip = texto.trim() || ''
	if(!chip)
		return
	clicar('button[name="Remover Chip '+chip+'"]')
	let botao = await esperar('ng-component button')
	if(!botao)
		return
	clicar(botao)

}