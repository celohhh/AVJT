async function pjeAnexarDocumentoPreencherCertidao(){

	let certificar = obterParametroDeUrl('certificar')
	let tipo = await esperar('[aria-label="Tipo de Documento"]',true)

	clicar(tipo)

	if(!certificar){
		if(!CONFIGURACAO?.pjeAssistentesDocumentosNotificacoes?.selecionarCertidao)
			return
		await pjeSelecionarOpcao('Certidão')
		return
	}

	let certidao = JSON.parse(decodeURIComponent(certificar))

	await pjeSelecionarOpcao(certidao.tipo)

	let descricao = await esperar('[aria-label="Descrição"]',true)
	if(certidao.descricao)
		preencher(descricao,certidao.descricao)

	let corpo = await esperar('.corpo',true)
	if(certidao.texto)
		corpo.innerText = certidao.texto

	if(certidao.sigiloso)
		clicar('input[name="sigiloso"]')

	if(certidao.pdf){
		let pdf = await esperar('mat-slide-toggle .mat-slide-toggle-label',true)
		clicar(pdf)
		let anexar = await esperar('#upload-anexo-0',true)
		clicar(anexar)
		return
	}

	if(certidao.assinar)
		clicar('[aria-label="Assinar documento e juntar ao processo"]')

}


async function pjeSelecionarOpcao(
	texto = '',
	seletor = '.mat-autocomplete-visible'
){

	await esperar(seletor,true)
	let opcao = [...document.querySelectorAll('mat-option')].filter(opcao => opcao.innerText == texto)[0] || ''
	clicar(opcao)

}


function pjeCertificar(
	descricao = '',
	tipo = 'Certidão',
	texto = '',
	pdf = false,
	sigiloso = false,
	assinar = false
){

	let certidao = {}

	certidao.tipo = tipo
	certidao.descricao = descricao
	certidao.texto = texto
	certidao.pdf = pdf
	certidao.sigiloso = sigiloso
	certidao.assinar = assinar

	return certidao

}