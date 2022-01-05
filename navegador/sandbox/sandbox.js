definicoesGlobais()
criarCabecalhoDePaginaDaExtensao()
criarRodapeDePaginaDaExtensao()

obterConfiguracoes()
selecionar('#salvar').addEventListener('click', registrarScript)

const campoCodigo			= document.querySelector('#codigo')
const textoErro       = document.querySelector('erro')
const textoResultado  = document.querySelector('resultado')

const codigoPadrao = `(async function(){

console.debug('Script de Usuário')

})()`

campoCodigo.value = codigoPadrao

async function obterConfiguracoes() {

	const armazenamento	= await browser.storage.local.get()
	const {codigoSalvo}	= armazenamento?.scriptDeUsuario || {}

	campoCodigo.value	= codigoSalvo ? codigoSalvo : codigoPadrao
	textoErro.textContent	= armazenamento?.ultimoErro || ''

}

async function registrarScript(){

	const parametros = {
		hosts: ['<all_urls>'],
		code: campoCodigo.value,
		userScriptID: 'scriptDeUsuario'
	}

	await browser.storage.local.set({scriptDeUsuario:parametros})

	try{
		textoResultado.textContent = ''
		await browser.runtime.sendMessage(parametros)
		textoResultado.textContent = 'Script de Usuário salvo com sucesso!'
		textoErro.textContent = ''
		await browser.storage.local.remove('ultimoErro')
	}
	catch(erro){
		const ultimoErro = `${erro}`
		textoErro.textContent = ultimoErro
		await browser.storage.local.set({ultimoErro})
	}

}