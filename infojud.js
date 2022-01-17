function infojud(){

	if(!JANELA.includes(LINK.infojud.dominio))
		return

	solicitar()

	function solicitar(){

		if(!JANELA.includes(LINK.infojud.solicitar))
			return

		let vara			= obterParametroDeUrl('vara')
		let documento = obterParametroDeUrl('novocpfcnpj')
		let cpf				= (documento.length === 11)
		let doi				= {}
		doi.inicio		= '01/1980'
		doi.fim				= DATA.mesAnterior.primeiroDia.replace(/^.../,'')

		selecionarOpcao('#tipoProcesso','Ação Trabalhista')

		if(!vara)
			return

		selecionarOpcao('#siglavara',vara)

		preencherDoi()
		preencherDitr()


		function preencherDirpf(){

			if(!cpf)
				return

			let lista = selecionar('#novotipo')
			if(!lista)
				return
			let selecionada = lista.options[lista.selectedIndex].innerText || ''

			if(!selecionada?.includes('DIRPF'))
				selecionarOpcao('#novotipo','DIRPF')

			let campoAno = selecionar('#novoano')

			let ano1 = campoAno.options[1].innerText || ''
			let ano2 = campoAno.options[2].innerText || ''
			let ano3 = campoAno.options[3].innerText || ''

			if(!verificarExistenciaDeSolicitacao('DIRPF.*?'+ano1)){
				campoAno.selectedIndex = 1
				clicar('[value="Incluir Pedido"]')
				return
			}

			if(!verificarExistenciaDeSolicitacao('DIRPF.*?'+ano2)){
				campoAno.selectedIndex = 2
				clicar('[value="Incluir Pedido"]')
				return
			}

			if(!verificarExistenciaDeSolicitacao('DIRPF.*?'+ano3)){
				campoAno.selectedIndex = 3
				clicar('[value="Incluir Pedido"]')
				return
			}

		}


		function preencherDitr(){

			let lista = selecionar('#novotipo')
			if(!lista)
				return
			let selecionada = lista.options[lista.selectedIndex].innerText || ''

			if(!selecionada?.includes('DITR')){
				setTimeout(
					() => selecionarOpcao('#novotipo','DITR'),
					2500
				)
				setTimeout(
					() => window.wrappedJSObject.carregarExercicios(),
					3000
				)
			}

			let observador = new MutationObserver(
				() => {

					let observado = selecionar('#novoano')

					if(observado){

						let ano1 = observado.options[1].innerText || ''
						let ano2 = observado.options[2].innerText || ''

						if(!verificarExistenciaDeSolicitacao('DITR.*?'+ano1)){
							observado.selectedIndex = 1
							clicar('[value="Incluir Pedido"]')
							observador.disconnect()
							return
						}

						if(!verificarExistenciaDeSolicitacao('DITR.*?'+ano2)){
							observado.selectedIndex = 2
							clicar('[value="Incluir Pedido"]')
							observador.disconnect()
							return
						}
						preencherDirpf()

					}
				}
			)

			observador.observe(
				document.body,
				{
					childList:	true,
					subtree:		true
				}
			)


		}


		function preencherDoi(){

			let observador = new MutationObserver(
				() => {
					let observado = selecionar('#novaDataFim')
					if(observado){

						if(verificarExistenciaDeSolicitacao(doi.inicio)){
							observador.disconnect()
							return
						}

						selecionarOpcao('#novotipo','DOI')

						let campoDoiDataInicio	= selecionar('#novaDataInicio')
						let campoDoiDataFim			= selecionar('#novaDataFim')

						if(campoDoiDataInicio	&& campoDoiDataFim){
							campoDoiDataInicio.removeAttribute('disabled')
							campoDoiDataFim.removeAttribute('disabled')
							alterarValorDeCampo(campoDoiDataInicio,	doi.inicio)
							alterarValorDeCampo(campoDoiDataFim,		doi.fim)
							clicar('[value="Incluir Pedido"]')
							observador.disconnect()
						}

					}
				}
			)

			observador.observe(
				document.body,
				{
					childList:	true,
					subtree:		true
				}
			)

		}

		function verificarExistenciaDeSolicitacao(expressao=''){

			if(!expressao)
				return ''

			let solicitacoes = document.querySelectorAll('tr')
			if(vazio(solicitacoes))
				return ''

			let solicitacao = [...solicitacoes].filter(solicitacao => solicitacao.innerText.match(expressao))

			if(vazio(solicitacao))
				return ''

			return true

		}



	}

}

function infojudRegistrarSolicitacao(consulta = {}){

	if(vazio(consulta))
		return

	let processo			= consulta?.processo	|| ''
	let documento			= consulta?.documento	|| ''
	let vara					= consulta?.vara			|| ''
	let justificativa	= 'Cumprimento de Mandado de Penhora'


	let url = LINK.infojud.solicitar + encodeURI('?' + 'processo=' + numeros(processo) + '&novocpfcnpj=' + numeros(documento) + '&justificativa=' + justificativa + '&vara=' + vara)

	let janela			= CONFIGURACAO?.janela?.infojud || ''

	let largura			=	janela?.largura			|| 1200
	let altura			= janela?.altura			|| 900
	let horizontal	= janela?.horizontal	|| 0
	let vertical		= janela?.vertical		|| 0

	abrirPagina(
		url,
		largura,
		altura,
		horizontal,
		vertical
	)

	esforcosPoupados(3,3,contarCaracteres(processo + documento + justificativa))

}