function penhora(){

	if(!JANELA.includes(LINK.penhora.dominio))
		return

	consultarRespostasDeCertidao()
	consultarRespostasDePenhora()
	cadastrarMandado()
	cadastrarProcesso()
	cadastrarPartes()

	function consultarRespostasDeCertidao(){
		if(!JANELA.includes('consultarpedidosdecertidao'))
			return
		let processo = obterParametroDeUrl('processo')
		let campo = selecionar('#txtProcesso')
		alterarValorDeCampo(campo,processo)
		if(campo && processo)
			focar('#filtrar')

	}

	function consultarRespostasDePenhora(){
		if(!JANELA.includes('consultarpedidosdepenhora'))
			return
		let processo = obterParametroDeUrl('processo')
		let campo = selecionar('#txtProcesso')
		alterarValorDeCampo(campo,processo)
		if(campo && processo)
			focar('#filtrar')

	}

	function cadastrarPartes(){

		if(!JANELA.includes('Penhora/frmCadastroPartes.aspx'))
			return
		let campoDocumento = selecionar('#txtDocumento')
		let campoNome = selecionar('#txtNome')

		navigator.clipboard.readText().then(
			texto => {
				if(!texto)
					return
				PROCESSO = JSON.parse(texto)

				let poloAtivo = PROCESSO?.partes?.ATIVO || {}
				let poloPassivo = PROCESSO?.partes?.PASSIVO || {}

				cadastrarParte(poloAtivo)
				cadastrarParte(poloPassivo)

				function cadastrarParte(polo={}){

					if(vazio(polo))
						return
		
					polo.forEach(
						(parte,indice,partes) => {
		
							let documento = parte?.documento || ''
							let nome = parte?.nome?.trim() || ''
							let polo = parte?.polo?.trim() || ''
							let parteAnterior = partes[indice-1] || ''
		
							if(
								!documento
								||
								verificaParteCadastrada(documento)
							)
								return
		
							if(polo.includes('passivo')){
								if(!verificaParteCadastrada(poloAtivo[poloAtivo.length -1].documento))
									return
							}
		
							if(parteAnterior){
								if(!verificaParteCadastrada(parteAnterior.documento))
									return
							}				
		
							let cpf = obterCPF(documento)
							let cnpj = obterCNPJ(documento)
							if(cpf)
								selecionarOpcao('#dplTipoPessoa','Pessoa Física')
							if(cnpj)
								selecionarOpcao('#dplTipoPessoa','Pessoa Jurídica')

							if(polo.includes('ativo')){
								selecionarOpcao('#dplPassivoPenhora','Não')
								selecionarOpcao('#dplClassificacao','Exequente')
							}
							
							if(polo.includes('passivo')){
								selecionarOpcao('#dplClassificacao','Executado')
							}

							if(campoDocumento){
								alterarValorDeCampo(campoDocumento,documento)
								campoDocumento.blur()
							}
		
							if(campoDocumento){
								alterarValorDeCampo(campoDocumento,documento)
								campoDocumento.blur()
							}
		
							if(campoNome){
								alterarValorDeCampo(campoNome,nome)
								campoNome.addEventListener(
									'focus',
									() => {
										if(!campoNome.value)
											alterarValorDeCampo(campoNome,nome)
									}
								)
							}
		
						}
					)
		
				}

			}

		)


		function verificaParteCadastrada(expressao=''){

			if(!expressao)
				return ''

			let partes = document.querySelectorAll('tr')
			if(vazio(partes))
				return ''

			let parte = [...partes].filter(parte => parte.innerText.match(expressao))

			if(vazio(parte))
				return ''

			return true

		}


	}

	function cadastrarProcesso(){

		if(!JANELA.includes('Penhora/frmCadastroProcesso.aspx'))
			return
				
		selecionarOpcao('#dplNomeAcaoPenhora','EXECUÇÃO TRABALHISTA')

		navigator.clipboard.readText().then(
			texto => {
				if(!texto)
					return
				let campo = selecionar('#msgNumeroPenhora')
				let processo = obterNumeroDoProcessoPadraoCNJ(texto)
				if(processo)
					alterarValorDeCampo(campo,processo)
				focar('#btnGerarPenhora')
			}

		)
		
	}


	function cadastrarMandado(){

		if(!JANELA.includes(LINK.penhora.solicitar))
			return

		let mandadoId		= obterParametroDeUrl('mandadoId')
		let mandadoData	= obterParametroDeUrl('mandadoData')
		let campoId			= selecionar('#txtFolhas')
		let campoData		= selecionar('#txtDataDecisao')

		if(campoData && mandadoData)
			alterarValorDeCampo(campoData,mandadoData)

		if(campoId && mandadoId)
			alterarValorDeCampo(campoId,'Id ' + mandadoId)

		focar('#btnProsseguir')

	}

}


function penhoraOnlineRegistrar(consulta = {}){

	if(vazio(consulta))
		return

	let valor = consulta?.valor || ''
	let mandadoId = consulta?.mandado?.id || ''
	let mandadoData = consulta?.mandado?.data || ''

	let url = LINK.penhora.solicitar + encodeURI('?' + 'valor=' + valor + '&mandadoId=' + mandadoId + '&mandadoData=' + mandadoData)

	abrirPagina(url,'','','','','penhora')

}

function penhoraOnlineConsultarRespostasDePenhora(processo=''){

	if(!processo)
		return

	let url = LINK.penhora.respostas + encodeURI(processo)

	abrirPagina(url,'','','','','penhora')

}

function penhoraOnlineConsultarRespostasDeCertidoes(processo=''){

	if(!processo)
		return

	let url = LINK.penhora.certidoes + encodeURI(processo)

	abrirPagina(url,'','','','','penhora')

}