function correios(){

	if(!JANELA.includes('correios.com.br'))
		return

	consultarObjeto()

	function consultarObjeto(){

		if(!JANELA.includes('avjtConsultarObjetoNosCorreios'))
			return

		let objeto = obterParametroDeUrl('avjtConsultarObjetoNosCorreios')
		if(!objeto)
			return

		let campo = selecionar('#objeto')
		if(!campo)
			return

		preencher(campo,maiusculas(objeto))

		setTimeout(
			() => {
				focar('#captcha')
			},
			1000
		)

	}

}

