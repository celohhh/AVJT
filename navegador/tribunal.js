window.addEventListener('load',contadorDeEsforcosRepetitivos)

function contadorDeEsforcosRepetitivos(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			criarRodapeDePaginaDaExtensao()

		}
	)

	let salvar = selecionar('#salvar')
	if(!salvar)
		return

	salvar.addEventListener('click',salvarConfiguracoes)

	function salvarConfiguracoes(){

		let configuracoes = selecionar('.configuracao','',true)

		configuracoes.forEach(
			elemento => browser.storage.local.set({[elemento.id]: elemento.value})
		)

		setTimeout(
			() => {
				abrirPaginaTermosDeUso()
				fechar()
			},
			500
		)

	}

}
