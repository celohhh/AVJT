async function pjeRegistrarTransitoEmJulgado(){

	if(CONFIGURACAO?.pjeAoAbrirTarefaDoProcesso?.preencherDataDoTransito){

		document.addEventListener('click',preencherDataDeTransitoComDataCopiada)

		esperar('[aria-label="Devolver processo para vara de origem"]',true).then(preencherDataDeTransitoComDataCopiada)

	}

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-tarefa'))
		return

	async function preencherDataDeTransitoComDataCopiada(){

		let campo = selecionar('[name="dataTransitoJulgado"]')
		if(!campo)
			return

		if(campo.disabled)
			return

		let texto = await navigator.clipboard.readText()
		if(!texto)
			return

		let data = obterData(texto)
		if(!data)
			return

		preencher(campo,data)

	}

}
