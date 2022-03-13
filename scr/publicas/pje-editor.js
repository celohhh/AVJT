function pjeOtimizarPaginaEditor(){

	fecharMensagesDeGravacao()

	esperar('Meus Modelos',true,false,true).then(
		() => {
			expandirArvoreDeDocumentos()
			alterarDescricaoDoDocumento()
		}
	)

	esperar('pje-intimacao-automatica input[type="text"]',true).then(
		() => {
			let texto = obterTextoDoEditor()
			let prazo = obterPrazoEmDias(texto)
			if(prazo)
				pjeEditorIntimacoesAlterarPrazo(prazo)
			
		}
	)

	let contexto = pjeObterContexto()
	if(!contexto.includes('pje-editor'))
		return


	function fecharMensagesDeGravacao(){

		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.fecharMensagensAcaoConcluida)
			return

		let observador = new MutationObserver(
			() => {
				let observado = selecionar('snack-bar-container.success button')
				if(!observado)
					return
				if(observado){
					setTimeout(
						() =>	clicar(observado),
						100
					)
				}
			}
		)
		observador.observe(
			document.body,
			{
				childList:			true,
				subtree:				true,
				attributes:			true,
				characterData:	false
			}
		)


	}


	function obterTextoDoEditor(){
		
		let editor = selecionar('.conteudo')
		if(!editor)
			return ''

		let texto = editor.textContent || ''
		return texto
		
	}


	function obterPrazoEmDias(texto=''){
		
		let prazo = texto.match(/prazo de \d{1,3} (dia|hora)(s)/gi) || ''
		if(!prazo)
			return ''
		
		prazo = minusculas(prazo[0])

		let quantidade = numeros(prazo)

		if(prazo.includes('hora'))
			quantidade = quantidade / 24

		return quantidade
		
	}

	
	function expandirArvoreDeDocumentos(){

	//	if(!autenticado())
		//	return

		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.expandirModelos)
			return

		clicar('Meus Modelos',true)

		let titulo = pjeEditorObterTitulo()

		switch(true){
			case(titulo.includes('Elaborar sentença')):
				clicar('Sentenças',true)
				break
			case(titulo.includes('Elaborar despacho')):
				clicar('Despachos',true)
				break
			case(titulo.includes('Elaborar decisão')):
				clicar('Decisões',true)
				clicar('Processamento de Recursos',true)
				break
			case(titulo.includes('Anexar Documentos')):
				clicar('Certidões',true)
				break
			default:
				clicar('E-CARTA TRT 15 1.3',true)
				return
		}

	}


	async function alterarDescricaoDoDocumento(){

	//	if(!autenticado())
	///		return

		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.descrever)
			return

		let arvore = await esperar('tree-node',true)
		if(!arvore)
			return

		arvore.addEventListener(
			'click',
			evento => {
				let elemento = evento.target.parentElement.parentElement || ''
				if(!elemento)
					return

				let texto = elemento.textContent || ''
				if(!texto)
					return
				texto = texto.replace(/^(\d+.*?[.])/g,'').trim()

				preencher('[aria-label="Descrição"]',texto)
			}

		)

	}



}


function pjeEditorObterTitulo(){

	let titulo = selecionar('h1') || ''

	if(titulo)
		titulo = titulo?.textContent

	return titulo

}


function pjeEditorIntimacoesAlterarPrazo(prazo='5'){

	if(!prazo)
		return

	let campos = document.querySelectorAll('pje-intimacao-automatica input[type="text"]')

	campos.forEach(
		campo => preencher(campo,prazo)
	)

	clicar('[aria-label="Gravar a intimação/notificação"]')

}