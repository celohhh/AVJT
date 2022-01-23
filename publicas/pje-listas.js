function pjeListarProcessos(){

	let listar = criar('listar','avjt-listar-processos')
	let botoes = criar('botoes','avjt-listar-processos-botoes','',listar)

	criarBotao(
		'avjt-botao-listar',
		'avjt-listar-processos-botao informacoes',
		botoes,
		'',
		'Lista os processos existentes nesta página em formato de dados tabulados e aciona o botão "Próxima Página"',
		pjeListarProcessosExistentesNaPagina

	)

	criarBotao(
		'avjt-botao-limpar',
		'avjt-listar-processos-botao informacoes',
		botoes,
		'',
		'Limpar lista',
		pjeListarProcessos
	)

	criar('textarea','avjt-listar-processos-texto','',listar)

}


function pjeListarProcessosExistentesNaPagina(){

	JANELA = window.location.href

	let data = DATA.hoje.curta

	let linhas = document.querySelectorAll('tr')

	if(vazio(linhas))
		return

	switch(true){
		case(JANELA.includes('gigs/relatorios/atividades')):
			pjeCopiarProcessosListaPainelRelatorioAtividades()
			break
		case(JANELA.includes('gigs/relatorios/comentarios')):
			pjeCopiarProcessosListaPainelRelatorioComentarios()
			break
		case(JANELA.includes('painel/global')):
			pjeCopiarProcessosListaPainelGlobal()
			break
		default:
			alert('Funcionalidade não disponível para esta página.')
			return

	}

	alterarIconeBotaoCopiar()

	function alterarIconeBotaoCopiar(){

		let botao = selecionar('#avjt-botao-listar')
		alternar()
		setTimeout(alternar,1000)

		function alternar(){
			botao.classList.toggle('copiado')
		}

	}

	function pjeCopiarProcessosListaPainelGlobal(){

		exibirLista()

		let processos = [].reduce.call(
			linhas,
			(lista='',linha) => {

				let processo = obterNumeroDoProcessoPadraoCNJ(linha.textContent)
				if(!processo)
					return

				let desde = obterData(linha?.cells[6]?.textContent)
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let audiencia = obterDataHoraDaAudiencia(linha?.cells[1]?.textContent)
				let fase = obterFase(linha.cells[3]) || ''
				let tarefa = obterTarefa(linha.cells[3]) || ''
				let responsavel = linha?.querySelector('input[type="text"]')?.value?.trim() || CONFIGURACAO?.usuario?.nome || ''

				return lista + data + '	' + titularizar(responsavel) + '	' + processo + '	' + tarefa + '	' + desde + '	' + fase + '	' + audiencia + '	' + poloPassivo + '\r\n'

			},[]
		) || ''

		obterLista(processos)
		clicar('[aria-label="Próximo"]')

	}

	function pjeCopiarProcessosListaPainelRelatorioAtividades(){

		exibirLista()

		let processos = [].reduce.call(
			linhas,
			(lista='',linha) => {

				let processo = obterNumeroDoProcessoPadraoCNJ(linha.textContent)
				if(!processo)
					return

				let desde = obterData(linha.textContent)
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let descricao = obterDescricao(linha?.cells[4]?.textContent)
				let responsavel = linha?.cells[5]?.textContent?.trim() || ''
			
				return lista + data + '	' + titularizar(responsavel) + '	' + processo + '		' + desde + '		' + descricao + '	' + poloPassivo + '\r\n'

			},[]
		) || ''

		obterLista(processos)
		clicar('[aria-label="Próximo"]')

	}

	function pjeCopiarProcessosListaPainelRelatorioComentarios(){

		exibirLista()

		let processos = [].reduce.call(
			linhas,
			(lista='',linha) => {

				let processo = obterNumeroDoProcessoPadraoCNJ(linha.textContent)
				if(!processo)
					return

				let desde = obterData(linha.textContent)
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let descricao = obterDescricao(linha?.cells[2]?.textContent)
				let responsavel = linha?.cells[4]?.textContent?.trim() || ''
			
				return lista + data + '	' + titularizar(responsavel) + '	' + processo + '		' + desde + '		' + descricao + '	' + poloPassivo + '\r\n'

			},[]
		) || ''

		obterLista(processos)
		clicar('[aria-label="Próximo"]')

	}


	function exibirLista(){

		let lista = selecionar('#avjt-listar-processos-texto')
		let botaoLimpar = selecionar('#avjt-botao-limpar')

		if(!lista)
			return
		if(lista.getBoundingClientRect().height === 0){
			lista.style.display	='block'
			lista.style.height	='85px'
		}
		if(botaoLimpar){
			botaoLimpar.style.display	='block'
		}

	}

	function obterLista(processos){
		let textarea = selecionar('#avjt-listar-processos-texto')
		if(!textarea)
			return
		let lista = textarea.textContent || ''
		if(lista.includes(processos))
			return
		lista += processos
		textarea.textContent = lista
		copiar(lista)
	}

	function obterDescricao(texto){
		if(!texto)
			return ''
		return texto?.replace(EXPRESSAO.quebraDeLinha,' - ')?.replace(/\t/gi,' ')?.trim() || ''
	}

	function obterDataHoraDaAudiencia(texto){
		let audiencia = ''
		let audienciaData	= obterData(texto)
		let audienciaHora	= obterHora(texto)
		if(audienciaData && audienciaHora)
			audiencia = 'Audiência: '+audienciaData+' - '+audienciaHora
		return audiencia || ''
	}

	function obterFase(elemento=''){
		if(!elemento)
			return ''
		let fase = elemento.querySelector('a div') || ''
		if(fase)
			fase = fase?.textContent?.replace(/.*?Fase../gi,'')?.trim() || ''
		return fase || ''
	}

	function obterTarefa(elemento=''){
		if(!elemento)
			return ''
		let tarefa = elemento.querySelector('a') || ''
		if(tarefa)
			tarefa = tarefa?.textContent?.replace(/Fase.*|Abrir a tarefa/gi,'')?.trim() || ''
		return tarefa || ''
	}




}