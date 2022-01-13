window.addEventListener('load',contadorDeEsforcosRepetitivos)

async function contadorDeEsforcosRepetitivos(){

	let armazenamento = await browser.storage.local.get()

	CONFIGURACAO = armazenamento

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