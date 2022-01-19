function assistenteDeSelecao(){

	if(!CONFIGURACAO.assistenteDeSelecao.ativado)
		return

	document.addEventListener('selectionchange',aoSelecionar)

	function aoSelecionar(){

		let selecao = document.getSelection() || ''

		if(!selecao)
			return

		let conteudo	= selecao.getRangeAt(0)
		let retangulo = conteudo.getBoundingClientRect()
		let posicao		= {}

		posicao.horizontal	= Math.ceil(retangulo.left)
		posicao.vertical		= Math.ceil(retangulo.top)

		let texto	= selecao.toString() || ''

		if(!texto){
			fecharMenu()
			return
		}

		let caracteres									= contarCaracteres(texto)
		let chassi											= obterChassi(texto)
		let cnpj												= obterCNPJ(texto)
		let contexto										= pjeObterContexto()
		let cpf													= obterCPF(texto)
		let data												= obterData(texto)
		let documento										= obterDocumento(texto)
		let textoAparado								= texto.trim()
		let letra												= texto.match(/[A-Za-zÀ-ȕ]/)
		let mandado											= texto.match(/mandado/gi)
		let nomeCompleto								= obterNomeCompleto(texto)
		let numero											= numeros(texto)
		let pjeNumeroDoProcessoParcial	= obterNumeroDoProcessoParcial(texto)
		let pjeNumeroDoProcessoCompleto	= obterNumeroDoProcessoPadraoCNJ(texto)
		let placa												=	obterPlacaDeVeiculoAutomotor(texto)
		let valor												= obterValorMonetario(texto)
		let uri													= encodeURI(texto)

		let menu = criarMenu()



		criarBotao(
			'copiar',
			'solido',
			'Copiar texto selecionado',
			() => copiarTextoSelecionado()
		)


		if(letra){

			criarBotao(
				'pje-consultar',
				'',
				'Consultar Parte ou Representante no PJe',
				() => pjeAbrirPainelDeConsultaProcessual({nomeParte:maiusculas(textoAparado)})
			)

			if(nomeCompleto){

				if(!texto.match(/(CPF|CNPJ)[:]/gi)){

					let consulta = {}
					consulta.nome = nomeCompleto || ''

					criarBotao(
						'infojud',
						'',
						'InfoJud - Consultar Nome de Pessoa Física',
						() => infojudConsultarNomePessoaFisica(consulta)
					)
		
					criarBotao(
						'infojud-nome',
						'',
						'InfoJud - Consultar Nome de Pessoa Jurídica',
						() => infojudConsultarNomePessoaJuridica(consulta)
					)

				}
			}
	
		}

		if(cnpj){

			criarBotao(
				'pje-consultar',
				'',
				'Consultar CNPJ no PJe',
				() => pjeAbrirPainelDeConsultaProcessual({cnpj})
			)

		}

		if(cpf){

			criarBotao(
				'pje-consultar',
				'',
				'Consultar CPF no PJe',
				() => pjeAbrirPainelDeConsultaProcessual({cpf})
			)

		}

		if(pjeNumeroDoProcessoParcial){

			criarBotao(
				'pje-consultar',
				'',
				'Consultar Processo no PJe',
				() => pjeAbrirPaginaDeConsultaProcessual(pjeNumeroDoProcessoParcial)
			)

		}

		if(pjeNumeroDoProcessoCompleto){

			criarBotao(
				'pje-consultar',
				'',
				'Consultar Detalhes do Processo no PJe',
				() => pjeConsultarDetalhesDoProcesso(pjeNumeroDoProcessoCompleto)
			)

		}


		if(mandado || valor || data){
			criarBotao(
				'penhora-online',
				'',
				'Penhora Online',
				() => {
					let consulta = {}
					if(contexto.includes('pje-mandados')){
						consulta.mandado = {}
						consulta.mandado.id = pjeObterDocumentoId()
						consulta.mandado.data = pjeObterDocumentoData()
					}
					consulta.valor = valor || ''
					penhoraOnlineRegistrar(consulta)
					copiarDadosDoProcesso()
					clicar('#avjt-botao-dados-do-processo')

				}
			)
		}


		if(documento){

			let consulta = {}
			consulta.documento = documento || ''

			criarBotao(
				'infojud-documento',
				'',
				'InfoJud - Consultar Documento',
				() => {
					infojudConsultarDocumento(consulta)
				}
			)

			criarBotao(
				'infojud',
				'',
				'InfoJud - Registrar Solicitação',
				() => {
					consulta.processo = PROCESSO?.numero || ''
					consulta.vara = PROCESSO?.orgaoJulgador?.descricao || ''
					infojudRegistrarSolicitacao(consulta)
				}
			)

			criarBotao(
				'renajud',
				'',
				'Consultar / Inserir Restrição no RENAJUD',
				() => renajudInserirRestricao({documento})
			)

			criarBotao(
				'infoseg',
				'',
				'Consultar Documento no INFOSEG',
				() => infosegPesquisarDocumento(documento)
			)

		}

		if(chassi){
			criarBotao(
				'renajud',
				'',
				'Consultar / Inserir Restrição no RENAJUD',
				() => renajudInserirRestricao({chassi})
			)
		}

		if(placa){
			criarBotao(
				'renajud',
				'',
				'Consultar / Inserir Restrição no RENAJUD',
				() => renajudInserirRestricao({placa})
			)
		}

		if(valor){
			criarBotao(
				'valor-por-extenso',
				'',
				'Valor Monetário por Extenso',
				escreverValorPorExtenso
			)
		}

		if(numero){
			criarBotao(
				'numero-por-extenso',
				'',
				'Número Inteiro por Extenso',
				escreverNumeroPorExtenso
			)
		}

		if(letra){

			criarBotao(
				'maiusculas',
				'',
				'Converter texto para letras maiúsculas',
				converterTextoParaMaiusculas
			)

			criarBotao(
				'minusculas',
				'',
				'Converter texto para letras minúsculas',
				converterTextoParaMinusculas
			)

			criarBotao(
				'titularizar',
				'',
				'Converter texto para Título',
				converterTextoParaTitulo
			)

		}

		criarBotao(
			'google',
			'',
			'Pesquisar texto selecionado no Google',
			abrirGoogle
		)

		criarBotao(
			'google-tradutor',
			'',
			'Traduzir texto selecionado',
			abrirGoogleTradutor
		)

		criarBotao(
			'whatsapp',
			'',
			'Enviar mensagem por WhatsApp para o número selecionado',
			abrirWhatsapp
		)

		menu.style.left			= posicao.horizontal + 'px'
		menu.style.top			= (posicao.vertical - menu.offsetHeight) + 'px'
		menu.style.opacity	= '1'

		copiarAutomaticamenteTextoSelecionado()

		function escreverValorPorExtenso(){

			let prefixo = ''

			if(!texto.includes('$'))
			prefixo = 'R$ '

			let porExtenso = prefixo + texto + ' (' + extenso(valor,true) + ')'

			conteudo.deleteContents()
			conteudo.insertNode(document.createTextNode(porExtenso))
			esforcosPoupados(0,1,contarCaracteres(porExtenso))

		}


		function escreverNumeroPorExtenso(){

			let porExtenso = texto + ' (' + extenso(texto) + ')'
			conteudo.deleteContents()
			conteudo.insertNode(document.createTextNode(porExtenso))
			esforcosPoupados(0,1,contarCaracteres(porExtenso))

		}


		function converterTextoParaMaiusculas(){

			conteudo.deleteContents()
			conteudo.insertNode(document.createTextNode(maiusculas(texto)))
			esforcosPoupados(0,1,caracteres)

		}


		function converterTextoParaMinusculas(){

			conteudo.deleteContents()
			conteudo.insertNode(document.createTextNode(minusculas(texto)))
			esforcosPoupados(0,1,caracteres)

		}

		function converterTextoParaTitulo(){

			conteudo.deleteContents()
			conteudo.insertNode(document.createTextNode(titularizar(texto)))
			esforcosPoupados(0,1,caracteres)

		}

		function abrirGoogle(){

			abrirPagina(LINK.google.raiz + 'search?q=' + uri)
			esforcosPoupados(1,2,caracteres)

		}

		function abrirGoogleTradutor(){

			abrirPagina(LINK.google.tradutor + uri)
			esforcosPoupados(1,2,caracteres)

		}

		function abrirWhatsapp(){

			let resposta = prompt('Informe o número do telefone do destinatário observando o padrão internacional (Código do País Código de Área Telefone).'+"\n\n"+'Por exemplo, se o número do telefone for +55 (12) 98765-4321, utilize 5512987654321'+"\n\n",'55'+numero) || ''

			if(!resposta)
				return

			let telefone	= numeros(resposta)
			let texto			= saudacao() + "\n\n"

			whatsappEscreverMensagem(telefone,texto)

			esforcosPoupados(9,2,(3 + caracteres))

		}

		function copiarAutomaticamenteTextoSelecionado(){

			if(CONFIGURACAO.assistenteDeSelecao.copiar)
				clicar('assistente-de-selecao > #copiar')

		}

		function copiarTextoSelecionado(){
			copiar(textoAparado)
		}


		function criarMenu(){

			let elemento	= criar(
				tag			= 'assistente-de-selecao',
				id			= 'assistente-de-selecao'
			)

			//css/selecao.css
			elemento.addEventListener('click',fecharMenu)

			return elemento

		}

		function criarBotao(
			id				= '',
			classe		= '',
			titulo		= '',
			aoClicar	= ''
		){

			let botao			= criar('botao',id,'link',menu)

			if(id)
				botao.id = id

			if(classe)
				botao.className = classe

			if(titulo)
				botao.setAttribute('aria-label',titulo)

			if(aoClicar){
				botao.addEventListener('click',aoClicar)
			}

			botao.addEventListener(
				'click',
				evento => evento.stopPropagation()
			)

			if(id.includes('copiar')){
				botao.addEventListener(
					'click',
					() => {
						botao.classList.toggle('copiado')
						setTimeout(
							() => botao.classList.toggle('copiado'),
							1000
						)
					}
				)
			}

		}


		function fecharMenu(){
			remover('assistente-de-selecao')
		}


	}


}