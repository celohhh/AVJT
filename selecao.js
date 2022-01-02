function assistenteDeSelecao(){

	if(!CONFIGURACAO.assistenteDeSelecao.ativado)
		return

	document.addEventListener('selectionchange',aoSelecionar)

	function aoSelecionar(){

		let selecao = document.getSelection()

		if(!selecao)
			return

		let atributos = selecao.getRangeAt(0).getBoundingClientRect()

		let posicao = {}
		posicao.horizontal	= Math.ceil(atributos.left)
		posicao.vertical		= Math.ceil(atributos.top)

		let texto	= selecao.toString().trim() || ''
		
		if(!texto){
			fecharMenu()
			return
		}

		let caracteres								= texto.length
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
	//		console.debug('valor',valor)
	//	let data											= obterData(texto)
	//	let numeroDeProcessoPadraoCNJ	= obterNumeroDoProcessoPadraoCNJ(texto)

		function abrirGoogle(){
			abrirPagina(LINK.google.raiz + 'search?q=' + uri)
			esforcosPoupados(1,2,caracteres)
		}


		function abrirGoogleTradutor(){
			abrirPagina(LINK.google.tradutor + uri)
			esforcosPoupados(1,2,caracteres)
		}


		function abrirWhatsapp(){

			let resposta = prompt("Informe o número do telefone do destinatário observando o padrão internacional (Código do País Código de Área Telefone).\n\nPor exemplo, se o número do telefone for +55 (12) 98765-4321, utilize 5512987654321\n\n",'55'+numero) || ''

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
			copiar(texto)
		}

		
		function criarMenu(){

			let elemento	= criar(
				tag			= 'assistente-de-selecao',
				id			= 'assistente-de-selecao'
			)

			//css/selecao.css
			elemento.style.left	= posicao.horizontal + 'px'
			elemento.style.top	= (posicao.vertical - elemento.offsetHeight) + 'px'

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