async function siscondj(){

	if(!JANELA.includes(LINK.siscondj.raiz))
		return
	
	otimizarUsabilidade()
	otimizarLayout()


	function otimizarLayout(){

		if(!CONFIGURACAO?.siscondj?.otimizarLayout)
			return

		remover('divmsg')

		estilizar(
			'',
			`
				[aria-describedby="div_pdf_alvara"]{
					left:5% !important;
					width:90% !important;
				}

				#div_pdf_alvara{
					width:100% !important;
				}

			`
		)

	}

	function otimizarUsabilidade(){

		if(JANELA.includes('?numeroDoProcesso='))
			buscarNumeroDoProcesso()

		colarDadoAoClicar()
		expandirDepositos()
		siscondjPrepararCertidao()		

		abrirAnexarDocumentosAoClicarNoPDF()

	}

	function expandirDepositos(){

		if(!CONFIGURACAO?.siscondj?.expandirDepositos)
			return

		let depositos = document.querySelectorAll('[src*="/images/refresh.png"]')
		depositos.forEach(deposito => clicar(deposito))

		if(JANELA.includes('pages/mandado/pagamento/new/')){
			let parcelas = document.querySelectorAll('[alt="Parcelas"]')
			parcelas.forEach(deposito => clicar(deposito))
		}

	}


	function colarDadoAoClicar(){
		return
	}


	async function abrirAnexarDocumentosAoClicarNoPDF(){
		if(
			!JANELA.includes('mandado/acompanhamento')
			||
			!CONFIGURACAO?.siscondj?.certificarAoAbrirAlvara
		)
			return
		let pdfs = document.querySelectorAll('img[src*="icon_pdf.png"]')
		pdfs.forEach(
			async pdf => {
				pdf.addEventListener(
					'click',
					async evento => {
						if(!PROCESSO?.id){
							let linha = evento.target.parentElement.parentElement.parentElement.parentElement || ''
							if(!linha)
								return
							let texto = linha.innerText || ''
							let numero = obterNumeroDoProcessoSemSeparadores(texto)
							if(!numero)
								return ''
							let processo = converterNumeroDoProcessoSemSeparadoresParaPadraoCNJ(numero)
							if(!processo)
								return ''
							let dados = await pjeApiConsultaPublicaObterProcessoId(processo)
							PROCESSO = dados[0]
						}

						let certidao = pjeCertificar('Alvará Eletrônico de Pagamento - SISCONDJ-JT','Certidão',false,true)
						LINK.pje.anexar = LINK.pje.processo + PROCESSO.id + '/documento/anexar?certificar='+encodeURIComponent(JSON.stringify(certidao))
						pjeAbrirAnexar()

					}
				)
			}
		)


	}




	function buscarNumeroDoProcesso(){

		let numero = obterParametroDeUrl('numeroDoProcesso')
		if(!numero)
			return

		let campo = selecionar('#numeroProcesso')
		if(!campo)
			return

		preencher(campo,numeros(numero))

		clicar('#bt_buscar')
	}


}


function siscondjConsultarProcesso(processo=''){

	let pje = pjeObterContexto()

	if(!processo){
		if(pje)
			processo = PROCESSO?.numero || ''
	}

	copiar(processo)

	let url = LINK.siscondj.consultarProcesso + encodeURI(processo)

	abrirPagina(url,'','','','','siscondj')

	esforcosPoupados(1,1)

}


async function siscondjPrepararCertidao(){

	let formulario = selecionar('#form_alvara')
	if(!formulario)
		return
	
	let texto = formulario.textContent || ''

	

	let processo = obterNumeroDoProcessoPadraoCNJ(texto)
	if(!processo)
		return
		console.debug('processo',processo)

	let dados = await pjeApiConsultaPublicaObterProcessoId(processo)
	PROCESSO = dados[0]
	console.debug('PROCESSO',PROCESSO)
	

	sigeoCriarBotaoCertificar()

}

function sigeoCriarBotaoCertificar(){
	if(!JANELA.includes('/mandado/pagamento/exibir'))
		return

	let destino = selecionar('#form_alvara h2')
	
	if(!destino)
		return

	estilizar(
		destino,
		`
		botao{
			border-radius:5px;
			color:rgba(var(--extensao-cor-branco),1);
			display:block;
			font-weight:600;
			line-height:20px;
			margin:0 auto;
			padding:5px 30px;
			position:relative;
			text-align:center;
			width:300px;
		}
		`
	)
	
	criarBotao(
		'avjt-siscondj-certificar',
		'avjt-preto informacoes',
		destino,
		'CERTIFICAR NO PJE',
		'Abre a Tarefa Anexar Documento',
		() => {
			let protocolo = numeros(destino.innerText)
			let tipo = 'Mandado de Pagamento'
			let descricao = 'Alvará Finalizado - SISCONDJ-JT'
			let beneficiario = obterNomeDoBeneficiario() || ''
			let texto = 'CERTIFICO que protocolei, sob o número '+protocolo+', Alvará Eletrônico de Pagamento - SISCONDJ-JT'+beneficiario+'.'
			let certidao = pjeCertificar(descricao,tipo,texto)
			LINK.pje.anexar = LINK.pje.processo + PROCESSO.id + '/documento/anexar?certificar='+encodeURIComponent(JSON.stringify(certidao))
			pjeAbrirAnexar()
		}
	)

	function obterNomeDoBeneficiario(){
		let elemento = selecionar('#dados_solicitacao tr td:nth-child(4)')
		if(!elemento)
			return ''
		let beneficiario = elemento?.textContent?.trim() || ''
		if(!beneficiario)
			return ''
		return ', em favor de '+beneficiario
	}

}
