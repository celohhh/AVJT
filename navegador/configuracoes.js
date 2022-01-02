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
			obterConfiguracoesDaExtensao()

			selecionar('#salvar').addEventListener(
				'click',
				evento => {
					evento.preventDefault()
					salvarConfiguracoesDaExtensao()
				}
			)

		}
	)

}


