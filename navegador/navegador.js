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

		browser.windows.getCurrent().then(
			janela => {
				browser.tabs.query({}).then(
					abas => {
						abas.forEach(
							aba => {
							
								if(
										(aba.url.includes('detalhe') && acao.mensagem == 'separarAbaDetalhesDoProcesso')
									)
									browser.windows.create({
										tabId:aba.id,
										width:Number(acao.largura),
										height:Number(acao.altura),
										left:Number(acao.horizontal),
										top:Number(acao.vertical)
									})
							}
						)
					},
					null
				)
			},
			null
		)

	}

)


