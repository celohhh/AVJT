window.addEventListener('load',contadorDeEsforcosRepetitivos)

function contadorDeEsforcosRepetitivos(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			console.debug('CONFIGURACAO',CONFIGURACAO)
			
			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			criarRodapeDePaginaDaExtensao()
			obterConfiguracoesDaExtensao()
			selecionar('#salvar').addEventListener('click',salvarConfiguracoesDaExtensao)

		}
	)

}


