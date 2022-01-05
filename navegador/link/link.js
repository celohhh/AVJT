window.addEventListener('load',editarLinksUteisDoMenuDaExtensao)

function editarLinksUteisDoMenuDaExtensao(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			criarRodapeDePaginaDaExtensao()

			let editar				= obterParametroDeURL('editar')
			let descricao			= obterParametroDeURL('descricao')


			obterConfiguracoes()

			alterarTitulos()

			selecionar('#salvar')?.addEventListener('click',salvarConfiguracoes)


			function alterarTitulos(){

				let texto		= `Editar Dimensões e Posição da Janela ${descricao}`.replace(/(PJe - Painel)(.*)/,"$1")

				let titulo	= selecionar('h2')
				if(titulo){
					titulo.innerText = document.title = texto
				}

			}


			function salvarConfiguracoes(){

				let configuracoes	= document.querySelectorAll('.configuracao')
				let configuracao	= {}
				let janela				= CONFIGURACAO?.janela

				configuracoes.forEach(
					elemento => {
						configuracao[elemento.id] = elemento.value
					}
				)

				console.debug('configuracao',configuracao)

				janela[editar] = configuracao

				browser.storage.local.set({janela})

			}


			function obterConfiguracoes(){

				let configuracoes	= document.querySelectorAll('.configuracao')
				let configuracao	= CONFIGURACAO?.janela[editar] || ''
				if(!configuracao)
					return

				if(configuracao.url){

					let label = criar('label','','largura100',selecionar('#campos'))
					label.innerText = 'Endereço:'
					let campoUrl = criar('input','url','configuracao',label)
					campoUrl.type = 'text'
					campoUrl.value = configuracao.url

				}

				configuracoes.forEach(
					elemento => {
						if(configuracao[elemento.id])
							elemento.value = configuracao[elemento.id]
					}
				)

			}


		}
	)

}