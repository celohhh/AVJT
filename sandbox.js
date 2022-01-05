browser.userScripts.onBeforeScript.addListener(
	script => {

		const dados	= script.metadata
		const id		= dados.userScriptID

		function obterIdentificador(nome){
			return `${id}:${nome}`
		}

		
		script.defineGlobals({

			async obterValor(nome){

				const identificador = obterIdentificador(nome)
				const resultado = await browser.storage.local.get(identificador)

				console.debug('Valor obtido:', {id,nome,resultado,dados})

				return resultado[identificador]

			},

			definirValor(
				nome,
				valor
			){

				console.debug('Valor definido:', {id,nome,valor,dados})

				return browser.storage.local.set({[obterIdentificador(nome)]: valor})

			}

		})

		console.debug('API de Script de Usuário definida!')
		console.debug('API de Script de Usuário executada. Detector de Script de Usuário registrado.')

	}
)