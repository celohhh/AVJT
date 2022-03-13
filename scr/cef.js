function cef(){

	if(!JANELA.includes(LINK.cef.dominio))
		return

	autenticacao()
	cefConsultarDepositosRecursais()
	cefConsultarDepositosJudiciais()

	function autenticacao(){

		let indisponibilidade = document.body.innerText.match(/Sistema Temporariamente Indisponível/g) || ''
		if(indisponibilidade){
			window.location.href = 'https://depositojudicial.caixa.gov.br/sigsj_internet'
			return
		}

	}

}


function cefConsultarDepositosRecursais(){

	if(JANELA.includes('conectividade.caixa.gov.br'))
		caixaEconomicaFederalConectividade()

	if(JANELA.includes('sicse.caixa.gov.br'))
		caixaEconomicaFederalConectividadeSICSE()

	function caixaEconomicaFederalConectividade(){

		setTimeout(
			acessarDepositosRecursais,
			500
		)

		function acessarDepositosRecursais(){
			if(JANELA.includes('registro/cnsicp'))
				acessarEmpresaOutorgante()
			if(JANELA.includes('registro/trocar_raiz.m'))
				alterarEmpresaOutorgante()
		}

		function acessarEmpresaOutorgante(){

			let linkEmpresaOutorgante = selecionar('#frmMenuCNSICP')

			if(!linkEmpresaOutorgante)
				return

			let linkEmpresaOutorganteAcessar = Array.prototype.slice.call(
				linkEmpresaOutorgante.contentWindow.document.querySelectorAll('a')).filter(
					elemento => {
						return elemento.textContent === 'Acessar Empresa Outorgante'
					}
				)[0] || ''

			let linkEmpresaOutorganteSair = Array.prototype.slice.call(
				linkEmpresaOutorgante.contentWindow.document.querySelectorAll('a')).filter(
					elemento => {
						return elemento.textContent === 'Sair da Empresa Outorgante'
					}
				)[0] || ''

			if(linkEmpresaOutorganteAcessar){
				linkEmpresaOutorganteAcessar.click()
				esforcosPoupados(1,1)
			}

			if(linkEmpresaOutorganteSair){
				let opcao = linkEmpresaOutorgante.contentWindow.document.evaluate('//option[text()="Poder Judiciário"]',linkEmpresaOutorgante.contentWindow.document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue || ''
				if(!opcao)
					return
				let selecao = opcao.parentNode
				selecao.selectedIndex = opcao.index
				dispararEvento('change',selecao)
			}

			return

		}


		function alterarEmpresaOutorgante(){

			clicar('#rad3')

			if(!CONFIGURACAO?.delegacoes?.cefDepositosRecursais)
				return

			let campoDocumento = selecionar('#txt_insc')
			if(!campoDocumento)
				return

			preencher(campoDocumento,numeros(CONFIGURACAO.delegacoes.cefDepositosRecursais))

			clicar('[value="Continuar"]')

		}

	}


	function caixaEconomicaFederalConectividadeSICSE(){

		if(JANELA.includes('sicse/ControladorPrincipalServlet'))
			selecionarOpcao('[name="sltOpcao"]','Extrato FGTS Trabalhador-Conta Recursal')

		if(document.body.textContent.includes('Extrato FGTS Trabalhador − Conta Recursal')){

			navigator.clipboard.readText().then(

				texto => {

					if(!texto)
						return

					let campoTrabalhador = selecionar('[name="txtNomeTrabalhador"]')
					if(!campoTrabalhador)
						return

					preencher(campoTrabalhador,texto.replace(EXPRESSAO.processoNumero,'').replace(/DepositosJudiciais.*?ConsultaRealizada/gi,''))
					campoTrabalhador.focus()
				}

			)

		}

	}

}


function cefConsultarDepositosJudiciais(){

	if(
		!JANELA.includes('depositojudicial')
		||
		!JANELA.includes('consulta-avancada')
		||
		JANELA.includes('login')
		||
		JANELA.includes('Autenticacao')
	)
		return


	navigator.clipboard.readText().then(

		texto => {

			if(!texto)
				return

			consultarProcesso(texto)
			consultarDocumento(texto)
			consultarNome(texto)

		}

	)

	function consultarProcesso(texto=''){

		let processo = obterNumeroDoProcessoPadraoCNJ(texto)

		if(!processo)
			return

		let campo = selecionar('[id*="nuProcesso"')
		if(!campo)
			return

		if(texto.includes('DepositosJudiciaisCaixaEconomicaFederalConsultaRealizada'))
			return

		preencher(campo,numeros(processo))
		copiar(texto+'DepositosJudiciaisCaixaEconomicaFederalConsultaRealizada')

		continuar()

	}


	function consultarDocumento(texto=''){

		let cnpj = obterCNPJ(texto)
		let cpf = obterCPF(texto)
		let documento = obterDocumento(texto)

		if(!documento)
			return

		let selecaoPoloAtivo = selecionar('[id*="tipoDocPesquisa"]')
		let campoPoloAtivo = selecionar('[id*="codDocPesquisa"]')
		let selecaoPoloPassivo = selecionar('[id*="tipoDocReu"]')
		let campoPoloPassivo = selecionar('[id*="codDocReu"]')

		if(texto.includes('DepositosJudiciaisCaixaEconomicaFederalConsultaRealizada'))
			return

		copiar(texto+'DepositosJudiciaisCaixaEconomicaFederalConsultaRealizada')

		if(texto.includes('documentoPoloAtivo')){
			if(cpf)
				selecaoPoloAtivo.selectedIndex = 1
			if(cnpj)
				selecaoPoloAtivo.selectedIndex = 2
			dispararEvento('change',selecaoPoloAtivo)
			preencher(campoPoloAtivo,documento)
		}

		if(texto.includes('documentoPoloPassivo')){
			if(cpf)
				selecaoPoloPassivo.selectedIndex = 1
			if(cnpj)
				selecaoPoloPassivo.selectedIndex = 2
			dispararEvento('change',selecaoPoloPassivo)
			preencher(campoPoloPassivo,documento)
		}

		continuar()

	}

	function consultarNome(texto=''){

		let nome = maiusculas(texto.replace(/nomePolo(Ativo|Passivo)./,''))
		if(!nome)
			return

		let numero = numeros(nome)
		if(numero)
			return

		let campoPoloAtivo = selecionar('[id*="noAutor"]')
		let campoPoloPassivo = selecionar('[id*="noReu"]')

		if(texto.includes('DepositosJudiciaisCaixaEconomicaFederalConsultaRealizada'))
			return

		copiar(texto+'DepositosJudiciaisCaixaEconomicaFederalConsultaRealizada')

		if(texto.includes('nomePoloAtivo'))
			preencher(campoPoloAtivo,nome)

		if(texto.includes('nomePoloPassivo'))
			preencher(campoPoloPassivo,nome)

		continuar()

	}


	function continuar(){
		clicar('[title="Consultar"]')
	}

}


function cefConsultarDepositosJudiciaisProcesso(processo=''){

	let pje = pjeObterContexto()

	if(pje)
		processo = PROCESSO?.numero || ''

	copiar(processo)

	let url = LINK.cef.depositos.judiciais

	abrirPagina(url,'','','','','cefJudiciais')

	esforcosPoupados(1,1)

}

function cefConsultarDepositosRecursaisPorNomeDoPoloAtivo(nome=''){

	let pje = pjeObterContexto()

	if(pje){
		if(
			!nome
			||
			nome.match(EXPRESSAO.processoNumero)
		)
			nome += PROCESSO?.partes?.ATIVO[0]?.nome || ''
		}

	copiar(nome)

	let url = LINK.cef.depositos.recursais

	abrirPagina(url,'','','','','cefRecusais')

	esforcosPoupados(1,1)

}

function cefConsultarDocumentoPoloAtivo(documento=''){

	copiar('documentoPoloAtivo:'+documento)
	let url = LINK.cef.depositos.judiciais
	abrirPagina(url,'','','','','cefRecursais')
	esforcosPoupados(1,1)

}

function cefConsultarDocumentoPoloPassivo(documento=''){

	copiar('documentoPoloPassivo:'+documento)
	let url = LINK.cef.depositos.judiciais
	abrirPagina(url,'','','','','cefJudiciais')
	esforcosPoupados(1,1)

}

function cefConsultarNomePoloAtivo(nome=''){

	copiar('nomePoloAtivo:'+nome)
	let url = LINK.cef.depositos.judiciais
	abrirPagina(url,'','','','','cefRecursais')
	esforcosPoupados(1,1)

}

function cefConsultarNomePoloPassivo(nome=''){

	copiar('nomePoloPassivo:'+nome)
	let url = LINK.cef.depositos.judiciais
	abrirPagina(url,'','','','','cefJudiciais')
	esforcosPoupados(1,1)

}

