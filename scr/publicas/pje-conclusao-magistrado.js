async function pjeOtimizarConclusaoAoMagistrado(){

	let selecao = await esperar('[placeholder="Magistrado"]',true)

	criarBotaoMagistradoConfiguracoes()

	await selecionarMagistradoPorFinadlDoProcesso()
	

	async function selecionarMagistradoPorFinadlDoProcesso(){

		let magistrado = CONFIGURACAO?.pjeMagistrados[PROCESSO.digitoFinal] || ''
		if(!magistrado)
			return

		if(selecao.textContent.includes(magistrado))
			return

		clicar('[placeholder="Magistrado"]')
		await pjeSelecionarOpcaoPorTexto(magistrado)

	}

	function criarBotaoMagistradoConfiguracoes(){

		let destino = selecionar('pje-concluso-tarefa-magistrado')

		let configuracoes = criarBotao(
			'conclusao-ao-magistrado-configuracoes',
			'configuracoes informacoes',
			selecao.parentElement,
			'',
			'Configuracões de Seleção Automática de Magistrad(a)os',
			abrirPaginaConfiguracoesMagistrado
		)
	
		destino.parentElement.insertBefore(configuracoes,destino)

	}

}