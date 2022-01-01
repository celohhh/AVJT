browser.storage.local.get(
	null,
	armazenamento => {

		//publicas/definicoes.js

		EXTENSAO.ativada	= armazenamento.ativada
		CONFIGURACAO			= armazenamento
		definicoesGlobais()

		if(!CONFIGURACAO?.tribunal)
			abrirPaginaConfiguracaoDoTribunal()

		definirIconeDaExtensaoPeloEstado(EXTENSAO.ativada)

		ativarConfiguracoesIniciais()

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
			

			/*					
			let dados = CONFIGURACAO[destino]
								if(dados[chave] === undefined){
									if(ativar.hasOwnProperty(destino)){
										if(ativar[destino].includes(chave))
											estadoInicial = true
									}
								}
			*/
			
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