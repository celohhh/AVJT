function infojud(){

	if(!JANELA.includes(LINK.infojud.dominio))
		return

	console.debug('DATA',DATA)
	

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

		function preencherDoi(){


			if(verificarExistenciaDeSolicitacao(doi.inicio))
				return

			let observador = new MutationObserver(() => {
				let observado = selecionar('#novaDataFim')
				if(observado){

					selecionarOpcao('#novotipo','DOI')
					console.debug('observado',observado)
					
					if(verificarExistenciaDeSolicitacao(doi.inicio)){
						observador.disconnect()
						return
					}

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
			})

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