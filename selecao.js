function assistenteDeSelecao(){

	if(!CONFIGURACAO.assistenteDeSelecao.ativado)
		return

	document.addEventListener('selectionchange',aoSelecionar)

	function aoSelecionar(){

		let selecao = document.getSelection()

		if(!selecao)
			return

		let conteudo	= selecao.getRangeAt(0)
		let retangulo = conteudo.getBoundingClientRect()

		console.debug('retangulo',retangulo)
		
		let posicao = {}
		posicao.horizontal	= Math.ceil(retangulo.left)
		posicao.vertical		= Math.ceil(retangulo.top)

		let texto	= selecao.toString() || ''

		if(!texto){
			fecharMenu()
			return
		}
		
		let caracteres								= texto.length
		let textoAparado							= texto.trim()
		let numero										= numeros(texto)
		let valor											= obterValorMonetario(texto)
		let uri												= encodeURI(texto)

		let menu = criarMenu()

		criarBotao(
			'copiar',
			'solido',
			'Copiar texto selecionado',
			() => copiarTextoSelecionado()
		)

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

		copiarAutomaticamenteTextoSelecionado()
		
		menu.style.left	= posicao.horizontal + 'px'
		menu.style.top	= (posicao.vertical - menu.offsetHeight) + 'px'

		function escreverValorPorExtenso(){

			if(selecao.rangeCount){

				conteudo.deleteContents()

				let prefixo = ''

				if(!texto.includes('$'))
					prefixo = 'R$ '

				let porExtenso = prefixo + texto + ' (' + extenso(valor,true) + ')'

				conteudo.insertNode(document.createTextNode(porExtenso))

			}

		}


		function escreverNumeroPorExtenso(){

			if(selecao.rangeCount){
				conteudo.deleteContents()
				let porExtenso = texto + ' (' + extenso(texto) + ')'
				conteudo.insertNode(document.createTextNode(porExtenso))
			}

		}


		function converterTextoParaMaiusculas(){

			if(selecao.rangeCount){
				conteudo.deleteContents()
				conteudo.insertNode(document.createTextNode(maiusculas(texto)))
			}

		}


		function converterTextoParaMinusculas(){

			if(selecao.rangeCount){
				conteudo.deleteContents()
				conteudo.insertNode(document.createTextNode(minusculas(texto)))
			}

		}

		function converterTextoParaTitulo(){

			if(selecao.rangeCount){
				conteudo.deleteContents()
				conteudo.insertNode(document.createTextNode(titularizar(texto)))
			}

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

			let botao			= criar('button',id,'link legenda',menu)

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