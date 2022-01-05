'use strict'

let scriptRegistrado = null

async function registrarScript(mensagem) {
	const{
		hosts,
		code,
		userScriptID,
	} = mensagem

	if(scriptRegistrado) {
		await scriptRegistrado.unregister()
		scriptRegistrado = null
	}

	scriptRegistrado = await browser.userScripts.register({
		matches: hosts,
		js: [{code}],
		scriptMetadata: {userScriptID}
	})
}

browser.runtime.onMessage.addListener(registrarScript)