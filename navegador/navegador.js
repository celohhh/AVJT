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