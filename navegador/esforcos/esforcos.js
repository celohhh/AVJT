window.addEventListener('load',contadorDeEsforcosRepetitivos)

function contadorDeEsforcosRepetitivos(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			definirEstadoDaExtensao()
			criarRodapeDePaginaDaExtensao()

		}
	)

	let botao = selecionar('#reiniciar')
	if(!botao)
		return

	botao.addEventListener('click',reiniciarContadorDeEsforcosRepetitivos)

}
