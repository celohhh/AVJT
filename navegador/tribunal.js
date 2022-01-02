window.addEventListener('load',definirTribunal)

function definirTribunal(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			criarRodapeDePaginaDaExtensao()

			selecionar('#salvar').addEventListener(
				'click',
				() => {
					salvarConfiguracoesDaExtensao()
					setTimeout(
						() => {
							abrirPaginaTermosDeUso()
							fechar()
						},
						500
					)
			
				}
			)

		}
	)

	


}
