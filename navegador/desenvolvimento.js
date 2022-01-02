window.addEventListener('load',termosDeUso)

function termosDeUso(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			criarRodapeDePaginaDaExtensao()

			selecionar('#acao').addEventListener(
				'click',
				() => {

					let tribunal	= obterSiglaTribunal()
					let cargo			= CONFIGURACAO.usuario.cargo		|| ''
					let email			= CONFIGURACAO.usuario.email		|| ''
					let nome			= CONFIGURACAO.usuario.nome			|| ''
					let unidade		= CONFIGURACAO.usuario.unidade	|| ''

					let mensagem = saudacao() + `\n\nMeu nome é ${nome}\n\nE-Mail:\n${email}\n\nCargo:\n${cargo}\n\nUnidade:\n${unidade} (${tribunal})\n\n`
					whatsappEscreverMensagem('5512988043003',mensagem)

				}
			)

		}
	)

}