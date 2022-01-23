//publicas/pje.js
//publicas/pje-api.js
//publicas/pje-listas.js

function pje(){

	if(!JANELA.includes(LINK.pje.dominio))
		return

	pjePesquisarProcesso()
	pjeRedirecionarPaginaAcessoNegado()
	pjeOtimizarPainelInicial()
	pjeOtimizarPainelGlobal()
	pjeOtimizarPerfilUsuario()
	pjeOtimizarPerfilOficialDeJustica()
	pjeOtimizarGigs()


	function pjePesquisarProcesso(){

		let processo =  obterParametroDeUrl('processo')
		if(!processo)
			return

		esperar('#inputNumeroProcesso',true).then(
			campo => {

				alterarValorDeCampo(campo,processo)
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


function pjeOtimizarPainelGlobal(){

	if(
		!JANELA.match(/global.todos.lista.processos/gi)
		||
		JANELA.href.match(EXPRESSAO.processoNumero)
	)
		return

}


async function pjeOtimizarPerfilUsuario(){

	let id	= pjeObterProcessoId()

	if(id){

		PROCESSO = await pjeObterDadosDoProcesso(id)

		pjeOtimizarDetalhesDoProcesso()
		pjeOtimizarTarefaDoProcesso()

	}

}


async function pjeOtimizarPerfilOficialDeJustica(){

	let id	= pjeObterMandadoId()

	if(id){

		mandado = await pjeApiCentralDeMandadosObterMandadoDadosPrimarios(id)
		if(!mandado?.idProcessoExterno)
			return

		PROCESSO = await pjeObterDadosDoProcesso(mandado.idProcessoExterno)

		pjeOtimizarDetalhesDoMandado()

	}

}


function pjeOtimizarDetalhesDoMandado(){

	let contexto	= pjeObterContexto()

	if(!contexto.includes('mandados'))
		return

	pjeCriarBotaoFixoDestacarDadosDoProcesso()

}




function pjeOtimizarDetalhesDoProcesso(){

	let contexto	= pjeObterContexto()
	if(!contexto.includes('pje-detalhes'))
		return

	pjeCriarBotoesFixos()
	aoAbrir()
		
	function aoAbrir(){
		redimensionarJanela()
		abrirTarefa()
		setTimeout(abrirGigs,500)
	}
	
	function abrirGigs(){

		if(!CONFIGURACAO?.aoAbrirDetalhesDoProcesso?.abrirGigs)
			return
			
		abrirPagina(LINK.pje.gigs,'','','','','pjeGigs')

		esforcosPoupados(1,1)

	}

	function abrirTarefa(){

		if(!CONFIGURACAO?.aoAbrirDetalhesDoProcesso?.abrirTarefa)
			return
			
		abrirPagina(LINK.pje.tarefa,'','','','','pjeTarefa')

		esforcosPoupados(1,1)

	}

	function redimensionarJanela(){

		if(!CONFIGURACAO?.aoAbrirDetalhesDoProcesso?.redimensionar)
			return

		let janela			= CONFIGURACAO?.janela?.pjeDetalhes || ''

		let largura			=	janela?.largura			|| 1200
		let altura			= janela?.altura			|| 900
		let horizontal	= janela?.horizontal	|| 0
		let vertical		= janela?.vertical		|| 0

		destacarJanela(
			CONFIGURACAO.aoAbrirDetalhesDoProcesso.redimensionar,
			'separarAbaDetalhesDoProcesso',
			largura,
			altura,
			horizontal,
			vertical
		)

	}

}


function pjeOtimizarTarefaDoProcesso(){

	let contexto	= pjeObterContexto()
	if(!contexto.includes('pje-tarefa'))
		return

	pjeCriarBotoesFixos()
	aoAbrir()

	function aoAbrir(){
		return
	}

}


function pjeOtimizarGigs(){

	console.debug('gigs')
	let contexto	= pjeObterContexto()
	
	if(!contexto.includes('pje-gigs'))
		return

	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()
	
}


async function pjeObterDadosDoProcesso(id){

	PROCESSO = await pjeApiObterProcessoDadosPrimarios(id)

	if(!PROCESSO?.numero)
		return

	Object.assign(
		PROCESSO,
		obterDadosDoNumeroDoProcesso(PROCESSO.numero)
	)

	PROCESSO.data		= {}
	PROCESSO.valor	= pjeObterValoresDoProcesso()
	PROCESSO.tarefa = await pjeApiObterProcessoTarefa(id)
	PROCESSO.partes = await pjeApiObterProcessoPartes(id)

	LINK.pje.gigs = LINK.pje.kz + 'gigs/abrir-gigs/' + id
	LINK.pje.tarefa = LINK.pje.processo + id + '/tarefa/' + PROCESSO.tarefa.idTarefa

	pjeSalvarDadosDoProcesso()

	return PROCESSO

}


function pjeObterValoresDoProcesso(){

	let valor = {}

	if(PROCESSO?.valorDaCausa)
		valor.causa = Number(PROCESSO.valorDaCausa).toLocaleString('pt-BR',{minimumFractionDigits:2}) || ''

	return valor

}


function pjeCriarBotoesFixos(){

	pjeCriarBotaoFixoDestacarDadosDoProcesso()
	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()

}