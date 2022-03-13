//publicas/pje.js
//publicas/pje-api.js
//publicas/pje-listas.js

function pje(){

	if(!JANELA.includes(LINK.pje.dominio))
		return

	pjeRedirecionarPaginaAcessoNegado()
	pjePesquisarProcesso()
	pjeOtimizarLegado()
	pjeOtimizarPaginaConsultaPublica()
	pjeOtimizarPaginaSif()
	pjeOtimizarPaginaComunicacoes()
	pjeOtimizarPaginaDocumento()
	pjeOtimizarPaginaEditor()
	pjeOtimizarPaginaVersao1()
	pjeOtimizarPainelConsultaProcessos()
	pjeOtimizarPainelInicial()
	pjeOtimizarPainelGlobal()
	pjeOtimizarPerfilUsuario()
	pjeOtimizarPerfilOficialDeJustica()

	function pjePesquisarProcesso(){

		let processo =  obterParametroDeUrl('processo')
		if(!processo)
			return

		esperar('#inputNumeroProcesso',true).then(
			campo => {
				preencher(campo,processo)
				campo.click()
			}

		)

	}


}


function pjeRedirecionarPaginaAcessoNegado(){

	esperar('pje-acesso-negado').then(redirecionar)

	esforcosPoupados(2,2,2)

	function redirecionar(){
		window.location = LINK.pje.raiz
	}

}


function pjeOtimizarPainelInicial(){

	esperar('pje-menu-acesso-rapido').then(pjeListarProcessos)

}


function pjeOtimizarPainelConsultaProcessos(){

	if(JANELA.includes('administracao/consulta/processo'))
		pjeListarProcessos()

}


function pjeOtimizarPainelGlobal(){

	if(
		!JANELA.match(/global.todos.lista.processos/gi)
		||
		JANELA.href.match(EXPRESSAO.processoNumero)
	)
		return

}


async function pjeOtimizarPerfilUsuario(){

	let id = pjeObterProcessoId()

	if(id){

		PROCESSO = await pjeObterDadosPrincipaisDoProcesso(id)

		console.info('PROCESSO:',PROCESSO)

		pjeOtimizarPaginaAnexarDocumento()
		pjeOtimizarPaginaAudiencias()
		pjeOtimizarPaginaDetalhesDoProcesso()
		pjeOtimizarPaginaGigs()
		pjeOtimizarPaginaPericias()
		pjeOtimizarPaginaTarefaDoProcesso()

	}

}


async function pjeOtimizarPerfilOficialDeJustica(){

	let id = pjeObterMandadoId()

	if(id){

		mandado = await pjeApiCentralDeMandadosObterMandadoDadosPrimarios(id)
		if(!mandado?.idProcessoExterno)
			return

		PROCESSO = await pjeObterDadosPrincipaisDoProcesso(mandado.idProcessoExterno)

		pjeOtimizarDetalhesDoMandado()

	}

}


function pjeOtimizarDetalhesDoMandado(){

	let contexto = pjeObterContexto()

	if(!contexto.includes('mandados'))
		return

	pjeCriarBotaoFixoDestacarDadosDoProcesso()

}


function pjeOtimizarPaginaAnexarDocumento(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-anexar'))
		return

	pjeCriarBotoesFixos()
	aoAbrir()

	function aoAbrir(){
		pjeAnexarDocumentoPreencherCertidao()
	}

}


function pjeOtimizarPaginaAudiencias(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-audiencias'))
		return

	pjeCriarBotoesFixos()
	aoAbrir()

	function aoAbrir(){
		return
	}

}


function pjeOtimizarPaginaConsultaPublica(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-consulta-publica'))
		return

	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()
	aoAbrir()

	function aoAbrir(){
		setTimeout(pjeDocumentoOtimizarRolagem,500)
	}

}




async function pjeOtimizarPaginaComunicacoes(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-comunicacoes'))
		return

	aoAbrir()

	async function aoAbrir(){
		filtrarModelosDeComunicacao()
		await expandirPartes()
		await selecionarTipoDeDocumento()
		await selecionarPrazo()
		setTimeout(confeccionarAtoAgrupado,500)
	}

	async function expandirPartes(){

		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.expandirPartes)
			return
		
		await esperar('[name="btnIntimarSomentePoloPassivo"]',true)
		
		let partes = document.querySelectorAll('mat-expansion-panel-header')
		partes.forEach(item => clicar(item))
	
	}

	async function selecionarTipoDeDocumento(){
		let configuracao = CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.comunicacaoTipoDeDocumento || ''
		if(!configuracao)
			return
		await esperar('[name="btnIntimarSomentePoloPassivo"]',true)
		clicar('[placeholder="Tipo de Expediente"]')
		await pjeSelecionarOpcaoPorTexto(configuracao)
	}
	
	async function selecionarPrazo(){
		let configuracao = CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.comunicacaoPrazo || ''
		if(!configuracao)
			return
		await esperar('[name="btnIntimarSomentePoloPassivo"]',true)
		let opcoes = [...document.querySelectorAll('mat-radio-button')].filter(opcao => opcao.textContent.includes(minusculas(configuracao)))[0] || ''
		
		if(!opcoes)
			return
		let opcao = opcoes.querySelector('input') || ''
		
		clicar(opcao)

		if(configuracao.includes(('Dias Úteis')))
			await definirDias()

		if(configuracao.includes(('Data Certa')))
			await definirData()

	}

	async function definirDias(){
		let configuracao = CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.comunicacaoDias || ''
		if(!configuracao)
			return
		let campo = await esperar('[aria-label="Prazo em dias úteis"]',true)
		preencher(campo,configuracao)
	}
	
	async function definirData(){
		let configuracao = CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.comunicacaoData || ''
		if(!configuracao)
			return
		let campo = await esperar('[aria-label="Prazo em data certa"]',true)
		preencher(campo,configuracao)
	}
	
	function confeccionarAtoAgrupado(){
		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.confeccionar)
			return
		clicar('[aria-label="Confeccionar ato agrupado"]')
	}

	async function filtrarModelosDeComunicacao(){
		let configuracao = CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.filtrarModelosComunicacao || ''
		if(!configuracao)
			return
		esperar('[aria-label="Buscar pelo nome da pasta ou modelo ao digitar"]',true,true).then(
			campo => {
				preencher(campo,configuracao,true,true,'keyup')
				setTimeout(
					() => focar(campo),
					1000
				)
			}
		)
	}

}


function pjeOtimizarPaginaDocumento(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-documento'))
		return

	//if(!autenticado())
		//return

	aoAbrir()

	function aoAbrir(){
		pjeCriarBotaoFixoCopiarIdDoDocumento()
		pjeCriarBotaoFixoCopiarDataDoDocumento()
		pjeCriarBotaoFixoCopiarIdDoDocumento()
		pjeCriarBotaoFixoCopiarLinkDoDocumento()
		pjeCriarBotaoFixoEnviarDocumentoPorEmail()
		pjeCriarBotaoFixoEnviarDocumentoPorWhatsapp()
		pjeCriarBotaoFixoNotificar()

		pjeDocumentoOtimizarRolagem()
	}

}


function pjeOtimizarPaginaGigs(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-gigs'))
		return

	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()
	pjeOtimizarGigs()

	aoAbrir()

	function aoAbrir(){
		return
	}

}


async function pjeOtimizarPaginaPericias(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-pericias'))
		return

	pjeCriarBotoesFixos()
	pjeCriarPainelSuperior()
	aoAbrir()

	function aoAbrir(){
		alterarTituloDaNotificacao()
		alterarPrazoDaNotificacao()
	}


	async function alterarPrazoDaNotificacao(){

		let configuracao = CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.laudoEsclarecimentoDias || ''

		if(!configuracao)
			return
	
		let campo = await esperar('mat-form-field input[formcontrolname="prazoDias"]',true)
		preencher(campo,configuracao)

	}

	async function alterarTituloDaNotificacao(){

		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.descreverEsclarecimentosLaudo)
			return
	
		let campo = await esperar('mat-form-field input[aria-label="Descrição"]',true)
		let solicitarEsclarecimentos = selecionar('pje-documento-solicitar-esclarecimentos')
		if(solicitarEsclarecimentos?.textContent?.includes('Solicitar Esclarecimentos'))
			preencher(campo,'Apresentar Esclarecimentos Sobre o Laudo Pericial')

	}


}


function pjeOtimizarPaginaSif(){

	let contexto = pjeObterContexto()

	if(!contexto.includes('pje-sif'))
		return

	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()
	aoAbrir()

	function aoAbrir(){
		return
	}

}


function pjeOtimizarPaginaTarefaDoProcesso(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-tarefa'))
		return

	pjeCriarBotoesFixos()

	//if(!autenticado())
		//return

	pjeCriarPainelSuperior()
	aoAbrir()

	function aoAbrir(){
		pjeRegistrarTransitoEmJulgado()
		pjeOtimizarConclusaoAoMagistrado()
	}

}


function pjeOtimizarPaginaVersao1(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-versao1'))
		return

	setTimeout(pjeCriarBotaoFixoConfigurarDimensoesDaJanela,1000)
	aoAbrir()

	function aoAbrir(){
		return
	}

}


async function pjeObterDadosPrincipaisDoProcesso(id){

	let contexto = pjeObterContexto()

	PROCESSO = await pjeApiObterProcessoDadosPrimarios(id)

	if(!PROCESSO?.numero)
		return

	Object.assign(
		PROCESSO,
		obterDadosDoNumeroDoProcesso(PROCESSO.numero)
	)

	PROCESSO.data = {}
	PROCESSO.valor = pjeObterValoresDoProcesso()
	PROCESSO.tarefa = await pjeApiObterProcessoTarefa(id)
	PROCESSO.partes = await pjeApiObterProcessoPartes(id)

	LINK.pje.anexar = LINK.pje.processo + id + '/documento/anexar'
	LINK.pje.audiencias = LINK.pje.processo + id + '/audiencias-sessoes'
	LINK.pje.bndt = LINK.pje.processo + id + '/bndt'
	LINK.pje.calculos = LINK.pje.processo + id + '/detalhe/calculo'
	LINK.pje.comunicacoes = LINK.pje.processo + id + '/comunicacoesprocessuais/minutas'
	LINK.pje.copiarDocumentos = LINK.pje.processo + id + '/copiar-documento'
	LINK.pje.gigs = LINK.pje.kz + 'gigs/abrir-gigs/' + id
	LINK.pje.historico = LINK.pje.processo + id + '/historicotarefa'
	LINK.pje.legado.processo = LINK.pje.legado.processo + id
	LINK.pje.pagar = LINK.pje.kz + 'obrigacao-pagar/' + id
	LINK.pje.pagamento = LINK.pje.kz + 'pagamento/' + id
	LINK.pje.pericias = LINK.pje.processo + id + '/pericias'
	LINK.pje.recursos = LINK.pje.processo + id + '/quadro-recursos'
	LINK.pje.retificarAutuacao = LINK.pje.processo + id + '/retificar'
	LINK.pje.sif = LINK.pje.raiz + 'sif/consultar/' + PROCESSO.numeros + '/saldo'
	LINK.pje.tarefa = LINK.pje.processo + id + '/tarefa/' + PROCESSO.tarefa.idTarefa

	pjeSalvarDadosDoProcesso()

	pjeApiObterProcessoMovimentos(id).then(
		movimentos => {
			PROCESSO.movimentos = movimentos
			pjeObterDatas()
		}
	)

	if(
		contexto.includes('pje-detalhes')
	){
		pjeApiObterProcessoDocumentos(id).then(
			documentos => {
				PROCESSO.documentos = documentos || ''
				PROCESSO.acordaos = pjeFiltrarDocumentosDoProcessoPorTipo('Acórdão')
				PROCESSO.atas = pjeFiltrarDocumentosDoProcessoPorTipo('Ata da Audiência')
				PROCESSO.decisoes = pjeFiltrarDocumentosDoProcessoPorTipo('Decisão')
				PROCESSO.despachos = pjeFiltrarDocumentosDoProcessoPorTipo('Despacho')
				PROCESSO.sentencas = pjeFiltrarDocumentosDoProcessoPorTipo('Sentença')
				PROCESSO.peticaoInicial = pjeFiltrarDocumentosDoProcessoPorTipo('Petição Inicial')
				pjeSalvarDadosDoProcesso()
				pjeAoAbrirDetalhesDoProcessoAbrirDocumentos()
			}
		)
	}

	return PROCESSO

}


async function pjeObterDatas(){

	let ultimoMovimento = PROCESSO?.movimentos[0]?.data || ''
	if(ultimoMovimento)
		PROCESSO.data.ultimoMovimento = new Date(ultimoMovimento)?.toLocaleDateString() || DATA.hoje.curta || ''

}


function pjeObterValoresDoProcesso(){

	let valor = {}

	if(PROCESSO?.valorDaCausa)
		valor.causa = Number(PROCESSO.valorDaCausa).toLocaleString('pt-BR',{minimumFractionDigits:2}) || ''

	return valor

}


function pjeCriarBotoesFixos(){

	let contexto = pjeObterContexto()

	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()
	pjeCriarBotaoFixoDestacarDadosDoProcesso()
	pjeCriarBotaoFixoCopiarNumeroDoProcesso()
	pjeCriarBotaoFixoCopiarDadosTabuladosDoProcesso()
	pjeExpandirMenuDoProcessoso()

	function pjeExpandirMenuDoProcessoso(){

		remover('menu-do-processo-expandido')

		if(contexto.includes('pje-anexar')){
			if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.expandirMenu)
				return
			estilizar(
				'',
				`
				pje-anexar-documento h1{
					padding:20px 0 0 0 !important;
				}
				`
			)
		}

		if(
			contexto.includes('pje-detalhes')
			||
			contexto.includes('pje-pericias')
		){
			if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.expandirMenu)
				return
			estilizar(
				'',
				`
				.resumo-processo dl{
					padding:30px 0 0 0 !important;
				}
				`
			)
		}

		if(contexto.includes('pje-tarefa')){
			if(!CONFIGURACAO?.pjeAoAbrirTarefaDoProcesso?.expandirMenu)
				return
				estilizar(
					'',
					`
					pje-cabecalho-tarefa h1.titulo-tarefa{
						margin:25px 0 0 0 !important;
					}
					`
				)
		}


		let menu = criar('menu-do-processo-expandido','menu-do-processo-expandido')

		criarBotao('menu-do-processo-expandido-configuracoes','configuracoes informacoes',menu,'','Configuracões de Menu',abrirPaginaConfiguracoesMenuExpandido)

		if(CONFIGURACAO?.pjeMenu?.anexarDocumento){
			if(!contexto.includes('pje-anexar'))
				criarBotao('menu-do-processo-expandido-anexar','anexar informacoes',menu,'','Anexar Documento',() => pjeAbrirAnexar(''))
		}

		if(CONFIGURACAO?.pjeMenu?.retificarAutuacao)
			criarBotao('menu-do-processo-expandido-retificar-autuacao','processo-retificar informacoes',menu,'','Retificar Autuação',() => pjeAbrirRetificarAutuacao(''))

		if(CONFIGURACAO?.pjeMenu?.reprocessarChips){
			if(!contexto.includes('pje-anexar'))
				criarBotao('menu-do-processo-expandido-reprocessar','reprocessar informacoes',menu,'','Reprocessar Chips',pjeProcessoReprocessarChips)
		}

		if(CONFIGURACAO?.pjeMenu?.movimentos){
			if(
				!contexto.includes('pje-anexar')
				&&
				!contexto.includes('pje-tarefa')
			)
				criarBotao('menu-do-processo-expandido-movimentos','movimentos informacoes',menu,'','Lançar Movimentos',pjeProcessoDetalhesLancarMovimentos)
		}

		if(CONFIGURACAO?.pjeMenu?.gigs)
			criarBotao('menu-do-processo-expandido-gigs','gigs informacoes',menu,'','Abrir GIGS em Nova Janela',pjeAbrirGigsEmNovaPagina)

		if(CONFIGURACAO?.pjeMenu?.lembrete){
			if(
				!contexto.includes('pje-anexar')
			)
				criarBotao('menu-do-processo-expandido-lembrete','lembrete informacoes',menu,'','Criar Lembrete',pjeProcessoDetalhesInserirLembrete)
		}


		if(CONFIGURACAO?.pjeMenu?.expedientes){
			if(!contexto.includes('pje-anexar'))
				criarBotao('menu-do-processo-expandido-expedientes','expedientes informacoes',menu,'','Expedientes do Processo',pjeProcessoDetalhesExpedientes)
		}


		if(CONFIGURACAO?.pjeMenu?.comunicacoes)
			criarBotao('menu-do-processo-expandido-comunicacoes','comunicacoes informacoes',menu,'','Notificar',() => pjeAbrirComunicacoes(''))

		if(CONFIGURACAO?.pjeMenu?.pagar)
			criarBotao('menu-do-processo-expandido-pagar','pagar informacoes',menu,'','Obrigação de Pagar',() => pjeAbrirObrigacaoDePagar(''))

		if(CONFIGURACAO?.pjeMenu?.pagamento)
			criarBotao('menu-do-processo-expandido-receber','receber informacoes',menu,'','Pagamento',() => pjeAbrirPagamento(''))

		if(CONFIGURACAO?.pjeMenu?.audiencias)
			criarBotao('menu-do-processo-expandido-audiencias','audiencia informacoes',menu,'','Audiências do Processo',pjeAbrirAudienciasSessoes)

		if(CONFIGURACAO?.pjeMenu?.pauta)
			criarBotao('menu-do-processo-expandido-pauta','pauta informacoes',menu,'','Pauta de Audiências',() => pjeAbrirPautaDeAudiencias(''))

		if(CONFIGURACAO?.pjeMenu?.pericias)
			criarBotao('menu-do-processo-expandido-pericias','pericias informacoes',menu,'','Perícias',() => pjeAbrirPericias(''))

		if(CONFIGURACAO?.pjeMenu?.calculos)
			criarBotao('menu-do-processo-expandido-calculos','calculos informacoes',menu,'','Cálculos do Processo',pjeAbrirCalculos)

		if(CONFIGURACAO?.pjeMenu?.bndt)
			criarBotao('menu-do-processo-expandido-bndt','bndt informacoes',menu,'','BNDT',pjeAbrirBndt)

		if(CONFIGURACAO?.pjeMenu?.recursos)
			criarBotao('menu-do-processo-expandido-recurso','recurso informacoes',menu,'','Controle de Recursos',pjeAbrirRecursos)

		if(CONFIGURACAO?.pjeMenu?.historico)
			criarBotao('menu-do-processo-expandido-historico','historico informacoes',menu,'','Histórico de Tarefas',pjeAbrirHistoricoDeTarefas)

		if(CONFIGURACAO?.pjeMenu?.copiarDocumentos)
			criarBotao('menu-do-processo-expandido-clonar','clonar informacoes',menu,'','Copiar Documentos',pjeAbrirCopiarDocumentos)

		if(CONFIGURACAO?.pjeMenu?.removerChips)
			criarBotao('menu-do-processo-expandido-remover-chips','remover-chips informacoes',menu,'','Remover Todos os Chips',pjeRemoverTodosOsChips)

		if(CONFIGURACAO?.pjeMenu?.pdf){
			if(
				!contexto.includes('pje-anexar')
				&&
				!contexto.includes('pje-tarefa')
			)
				criarBotao('menu-do-processo-expandido-pdf','pdf informacoes',menu,'','Baixar Processo Completo',pjeProcessoDetalhesBaixarProcessoCompleto)
		}

	}

}