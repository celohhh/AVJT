// Desenvolvido por:	Sisenando Gomes Calixto de Sousa
// E-mail:						sisenandosousa@trt15.jus.br
// Telefone:					(12) 9.8804-3003


browser.storage.local.get(
	null,
	armazenamento => {

		//publicas/definicoes.js
		EXTENSAO.ativada	= armazenamento.ativada
		CONFIGURACAO			= armazenamento

		definicoesGlobais()

		//publicas/gerais.js
		relatar('CONFIGURAÇÃO: ', CONFIGURACAO)

		otimizar()

	}
)


function otimizar(){

	if(!EXTENSAO.ativada)
		return

	assistenteDeSelecao()	//selecao.js

	console.debug('saudacao',saudacao())
	

	//publicas/esforcos.js
	setInterval(contarEsforcosRepetitivosPoupados,1000)

}