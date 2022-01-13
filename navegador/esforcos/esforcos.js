window.addEventListener('load',contadorDeEsforcosRepetitivos)

async function contadorDeEsforcosRepetitivos(){

	let armazenamento = await browser.storage.local.get()

	CONFIGURACAO			= armazenamento
	EXTENSAO.ativada	= CONFIGURACAO.ativada

	definicoesGlobais()
	criarCabecalhoDePaginaDaExtensao()
	definirEstadoDaExtensao()
	criarRodapeDePaginaDaExtensao()

	let botao = selecionar('#reiniciar')
	if(!botao)
		return

	botao.addEventListener('click',reiniciarContadorDeEsforcosRepetitivos)

}