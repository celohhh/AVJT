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
		case(JANELA.includes('gigs/meu-painel')):
			pjeCopiarProcessosListaPainelPessoal()
			break
		case(JANELA.includes('gigs/relatorios/atividades')):
			pjeCopiarProcessosListaPainelRelatorioAtividades()
			break
		case(JANELA.includes('gigs/relatorios/comentarios')):
			pjeCopiarProcessosListaPainelRelatorioComentarios()
			break
		case(JANELA.includes('painel/global/todos')):
			pjeCopiarProcessosListaPainelGlobal()
			break
		default:
			alert('Funcionalidade não disponível para esta página.')
			return
	}

	alterarIconeBotaoCopiar()


	function pjeCopiarProcessosListaPainelPessoal(){

		exibirLista()

		console.debug('linhas',linhas)

		let processos = ''
		
		linhas.forEach(
			linha => {

				let processo = obterNumeroDoProcessoPadraoCNJ(linha.textContent)
				if(!processo)
					return

				if(processos.includes(processo))
					return

				if(listaDeProcessosContem(processo))
					return

				let desde = obterData(linha?.cells[4]?.textContent) || data
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let fase = obterFase(linha.cells[2]) || ''
				let tarefa = obterTarefa(linha.cells[2]) || ''
				let responsavel = CONFIGURACAO?.usuario?.nome || ''
				
				processos += tabularLinha(data,responsavel,processo,tarefa,desde,fase,'','',poloPassivo)

			}
		)

		if(!processos)
			return

		console.debug('processos',processos)
		
		obterLista(processos)

		document.querySelectorAll('[aria-label="Próximo"]').forEach(
			botao => {
				botao.click()
				esforcosPoupados(1,1)
			}
		)

	}

	function pjeCopiarProcessosListaPainelGlobal(){

		exibirLista()

		let processos = [].reduce.call(
			linhas,
			(lista='',linha) => {

				let processo = obterNumeroDoProcessoPadraoCNJ(linha.textContent)
				if(!processo)
					return

				if(lista.includes(processo))
					return

				if(listaDeProcessosContem(processo))
					return

				let desde = obterData(linha?.cells[6]?.textContent)
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let audiencia = obterDataHoraDaAudiencia(linha?.cells[1]?.textContent)
				let fase = obterFase(linha.cells[3]) || ''
				let tarefa = obterTarefa(linha.cells[3]) || ''
				let responsavel = linha?.querySelector('input[type="text"]')?.value?.trim() || CONFIGURACAO?.usuario?.nome || ''

				return lista + tabularLinha(data,responsavel,processo,tarefa,desde,fase,audiencia,'',poloPassivo)

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

				if(lista.includes(processo))
					return

				if(listaDeProcessosContem(processo))
					return

				let desde = obterData(linha.textContent)
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let detalhes = obterDetalhes(linha?.cells[4]?.textContent)
				let responsavel = linha?.cells[5]?.textContent?.trim() || ''
			
				return lista + tabularLinha(data,responsavel,processo,'',desde,'','',detalhes,poloPassivo)

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

				if(lista.includes(processo))
					return

				if(listaDeProcessosContem(processo))
					return

				let desde = obterData(linha.textContent)
				let poloPassivo = obterPoloPassivo(linha?.cells[1]?.textContent)
				let detalhes = obterDetalhes(linha?.cells[2]?.textContent)
				let responsavel = linha?.cells[4]?.textContent?.trim() || ''
			
				return lista + tabularLinha(data,responsavel,processo,'',desde,'','',detalhes,poloPassivo)

			},[]
		) || ''

		obterLista(processos)
		clicar('[aria-label="Próximo"]')

	}


	function tabularLinha(
		data = '',
		responsavel = '',
		processo = '',
		tarefa = '',
		desde = '',
		fase = '',
		audiencia = '',
		detalhes = '',
		poloPassivo = ''
	){
		return data + '	' + titularizar(responsavel) + '	' + processo + '	' + tarefa + '	' + desde + '	' + fase + '	' + audiencia+detalhes + '	' + poloPassivo + '\r\n'
	}


	function alterarIconeBotaoCopiar(){

		let botao = selecionar('#avjt-botao-listar')
		alternar()
		setTimeout(alternar,1000)

		function alternar(){
			botao.classList.toggle('copiado')
		}

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

	function listaDeProcessosContem(processo){

		let textarea = selecionar('#avjt-listar-processos-texto')
		if(!textarea)
			return false

		let lista = textarea.textContent || ''
		if(lista.includes(processo))
			return true

		return false

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

	function obterDetalhes(texto){
		if(!texto)
			return ''
		return texto?.replace(EXPRESSAO.quebraDeLinha,' - ')?.replace(/\t/gi,' ')?.trim() || ''
	}

	function obterDataHoraDaAudiencia(texto){
		let audiencia = ''
		let audienciaData	= obterData(texto)
		let audienciaHora	= obterHora(texto)
		if(audienciaData && audienciaHora)
			audiencia = 'Audiência: ' + audienciaData + ' - ' + audienciaHora + ' - '
		return audiencia || ''
	}

	function obterFase(elemento=''){
		if(!elemento)
			return ''
		let fase = elemento.textContent.match(/Fase.*/gi) || ''
		if(!fase)
			return ''
		return fase?.join()?.replace(/Fase../gi,'')?.trim() || ''
	}

	function obterTarefa(elemento=''){
		if(!elemento)
			return ''
		let tarefa = elemento?.textContent?.replace(/Fase.*|Abrir a tarefa/gi,'')?.trim() || ''
		return tarefa || ''
	}

}