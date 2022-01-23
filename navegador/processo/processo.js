window.addEventListener('load',criarMenuDadosDoProcesso)

async function criarMenuDadosDoProcesso(){

	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()

	let armazenamento = await browser.storage.local.get()

	CONFIGURACAO = armazenamento

	let processo = obterParametroDeUrl('processo')

	PROCESSO = JSON.parse(processo)

	definicoesGlobais()
	criarCabecalhoDePaginaDaExtensao()
	selecionar('h1').innerText = 'DADOS DO PROCESSO'

	listarDadosDoProcesso()
	listarPartes()

	CONFIGURACAO = await browser.storage.local.get(['assistenteDeSelecao'])
	CONFIGURACAO.assistenteDeSelecao.copiar = true

	assistenteDeSelecao()

	setInterval(contarEsforcosRepetitivosPoupados,100)

	function listarDadosDoProcesso(){

		let base = selecionar('processo')

		criarTitulo('Processo',base)

		if(PROCESSO?.numero){
			let secao = criar('numero','','subsecao',base)
			criarCampo('Número:','largura49',PROCESSO.numero,secao)
			criarCampo('Número sem separadores:','largura49',numeros(PROCESSO.numero),secao)
		}

		if(PROCESSO?.valor?.causa){
			let secao = criar('valor','','subsecao',base)
			criarCampo('Valor da Causa:','largura49',PROCESSO.valor.causa,secao)
		}


	}

	function listarPartes(){

		let base = selecionar('partes')

		if(PROCESSO?.partes?.ATIVO){
			let polo = PROCESSO.partes.ATIVO
			let secao = criar('polo-ativo','','subsecao',base)
			criarTitulo('Polo Ativo ' + `(${polo.length})`,secao)
			criarCampos(polo,secao)
		}

		if(PROCESSO?.partes?.PASSIVO){
			let polo = PROCESSO.partes.PASSIVO
			let secao = criar('polo-passivo','','subsecao',base)
			criarTitulo('Polo Passivo ' + `(${polo.length})`,secao)
			criarCampos(polo,secao)
		}

		function criarCampos(polo,secao){

			polo.forEach(
				parte => {
					let subsecao = criar('parte','','',secao)

					if(!parte?.nome)
						return
					criarCampo('Nome:','largura100',parte.nome,subsecao)

					let classe = 'largura49'

					if(parte?.documento){
						let cnpj = obterCNPJ(parte.documento)
						if(cnpj)
							classe = 'largura32'
						criarCampo('Documento:',classe,parte.documento,subsecao)
						if(cnpj)
							criarCampo('Raiz do CNPJ:',classe,obterRaizCNPJ(parte.documento),subsecao)
						criarCampo('Sem separadores:',classe,numeros(parte.documento),subsecao)
					}

				}
			)

		}

	}

	function criarTitulo(
		texto			= '',
		ancestral	= ''
	){
		let titulo = criar('h2','','',ancestral)
		titulo.innerText = texto
	}

	function criarCampo(
		titulo		= '',
		classe		= '',
		texto			= '',
		ancestral	= ''
	){

		let rotulo	= criar('rotulo','',classe,ancestral)
		rotulo.setAttribute('aria-label',titulo)

		let campo		= criar('campo','','',rotulo)
		campo.innerText				= texto
		campo.contentEditable	= true
		campo.spellcheck			= false

		campo.addEventListener(
			'click',
			evento => {
				let elemento = evento.target
				window.getSelection().selectAllChildren(elemento)
			}
		)

		return campo

	}

}