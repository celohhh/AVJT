browser.storage.local.get(
	null,
	armazenamento => {

		//publicas/definicoes.js

		EXTENSAO.ativada	= armazenamento.ativada
		CONFIGURACAO			= armazenamento

		if(CONFIGURACAO?.extensaoAtiva)
			browser.storage.local.clear().then(definicoes)

		definicoes()

		function definicoes(){

			definicoesGlobais()

			if(!CONFIGURACAO?.instituicao?.tribunal)
				abrirPaginaConfiguracaoDoTribunal()

			definirIconeDaExtensaoPeloEstado(EXTENSAO.ativada)

			ativarConfiguracoesIniciais()

		}

		function ativarConfiguracoesIniciais(){

			let ativar = {
				assistenteDeSelecao:['ativado']
			}

			for(let chave in ativar){

				let configuracoes = ativar[chave]

				let dados = {}

				if(CONFIGURACAO[chave] === undefined){
					CONFIGURACAO[chave] = {}
					configuracoes.forEach(
						configuracao => {
							dados[configuracao] = true
							browser.storage.local.set({[chave]:dados})
						}
					)
					CONFIGURACAO[chave] = dados

					console.debug('CONFIGURACAO',CONFIGURACAO)

				}

			}

		}

	}
)

browser.runtime.onMessage.addListener(
	acao => {
		if(acao.url){
			criarJanela(
				acao.url,
				acao.chave,
				acao.largura,
				acao.altura,
				acao.horizontal,
				acao.vertical,
				acao.tipo
			)
			return
		}
	}
)