async function pjeOtimizarPaginaDetalhesDoProcesso(){

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-detalhes'))
		return

	pjeCriarBotoesFixos()
	pjeCriarPainelSuperior()
	aoAbrir()

	async function aoAbrir(){

		redimensionarJanela()
		otimizarLayout()
		apreciarDocumentos()
		exibirMovimentos()
		fecharAlertas()
		abrirResumoDoProcesso()
		pesquisarTimeline()
		baixarProcessoCompleto()
		reprocessarChips()
		abrirTarefa()
		abrirAnexar()
		abrirConsultaPublicaProcessoInstancia2()
		abrirConsultaTst()
		abrirAudienciasSessoes()
		abrirPericias()
		abrirVersao1()

		pjeDetalhesDoProcessoOtimizarRolagem()
		setTimeout(abrirGigsEmNovaPagina,50)
		setTimeout(pjeAoAbrirDetalhesDoProcessoConsultarDepositosJudiciais,100)
		setTimeout(excluirChips,150)

	}

	function otimizarLayout(){
		return
	}

	function abrirAnexar(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirAnexar)
			return
		pjeAbrirAnexar()
	}

	function abrirAudienciasSessoes(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirAudiencias)
			return
		pjeAbrirAudienciasSessoes()
	}

	function abrirGigsEmNovaPagina(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirGigs)
			return
		pjeAbrirGigsEmNovaPagina()
	}

	function abrirConsultaTst(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirConsultaTst)
			return
		tstConsultarProcesso(PROCESSO.numero)
	}

	function abrirConsultaPublicaProcessoInstancia2(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirConsultaInstancia2)
			return
		pjeConsultaPublicaProcessoInstancia(PROCESSO.numero,2)
	}

	function abrirVersao1(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirVersao1)
			return
		pjeAbrirVersao1()
	}

	function abrirPericias(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirPericias)
			return
		pjeAbrirPericias()
	}

	function abrirTarefa(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirTarefa)
			return
		abrirPagina(LINK.pje.tarefa,'','','','','pjeTarefa')
		esforcosPoupados(1,1)
	}

	function pesquisarTimeline(){
		esperar('[name="Pesquisar movimentos e documentos da lista"]',true).then(
			campo => {
				let configuracao = CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.pesquisarTimeline || ''
				if(!configuracao)
					return
				focar('[name="Pesquisar movimentos e documentos da lista"]')
				preencher(
					campo,
					configuracao
				)
			}
		)
	}

	async function abrirResumoDoProcesso(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.abrirResumo)
			return
		pjeProcessoDetalhesAbrirResumoDoProcesso()
	}

	async function apreciarDocumentos(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.apreciarDocumentos)
			return
		pjeProcessoDetalhesApreciarDocumentos()
	}

	async function exibirMovimentos(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.exibirMovimentos)
			return
		pjeProcessoDetalhesExibirMovimentos()
	}

	function reprocessarChips(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.reprocessarChips)
			return
		pjeProcessoReprocessarChips()
	}

	function baixarProcessoCompleto(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.baixarProcesso)
			return

		esperar('[aria-label="Menu do processo"]',true).then(
			() => setTimeout(pjeProcessoDetalhesBaixarProcessoCompleto,1000)
		)

	}

	function fecharAlertas(){
		esperar('pje-alerta-processo-dialogo button',true,true).then(
			elemento => {
				let configuracao = CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.fecharAlertas || ''
				if(!configuracao)
					return
				clicar(elemento)
				pjeProcessoDetalhesAbrirResumoDoProcesso()
			}
		)
	}

	async function excluirChips(){
		let configuracao = CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.removerChips || ''
		if(!configuracao)
			return
		
		esperar('mat-chip',true).then(excluir)

		async function excluir(){

			let chips = configuracao.split(';')

			for(
				var
					indice = 0,
					esperar = 0
				;
				indice <= chips.length;
				indice++
			){
				let chip = chips[indice] || ''
				if(!chip)
					return
				setTimeout(
					() => pjeRemoverChip(chip),
					esperar += 500
				)
			}
		
		}

	}

	
	function redimensionarJanela(){
		if(!CONFIGURACAO?.pjeAoAbrirDetalhesDoProcesso?.redimensionar)
			return
		let janela			= CONFIGURACAO?.janela?.pjeDetalhes || ''
		let largura			=	janela?.l || 1200
		let altura			= janela?.a || 900
		let horizontal	= janela?.h || 0
		let vertical		= janela?.v || 0
		destacarJanela(
			CONFIGURACAO.pjeAoAbrirDetalhesDoProcesso.redimensionar,
			'separarAbaDetalhesDoProcesso',
			largura,
			altura,
			horizontal,
			vertical
		)
	}

}


async function pjeProcessoDetalhesAbrirResumoDoProcesso(){

	let botao = await esperar('[mattooltip="Abre o resumo do processo."]',true)
	clicar(botao)
	return

}


async function pjeProcessoDetalhesApreciarDocumentos(){
	await esperar('a.tl-documento',true,true)
	clicar('[aria-label="Apreciar todos."]')
	return
}

async function pjeProcessoDetalhesExibirMovimentos(){
	await esperar('a.tl-documento',true,true)
	clicar('[aria-label="Exibir movimentos."]')
	return
}
