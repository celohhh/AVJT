window.addEventListener('load',termosDeUso)

function termosDeUso(){

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

}
