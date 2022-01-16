// Desenvolvido por:	Sisenando Gomes Calixto de Sousa
// E-mail:						sisenandosousa@trt15.jus.br
// Telefone:					(12) 9.8804-3003


browser.storage.local.get(
	null,
	armazenamento => {

		//publicas/definicoes.js
		EXTENSAO.ativada	= armazenamento.ativada
		CONFIGURACAO			= armazenamento


		//publicas/gerais.js
		relatar('CONFIGURAÇÃO: ', CONFIGURACAO)

		otimizar()

	}
)


function otimizar(){

	if(!EXTENSAO.ativada)
		return

	definicoesGlobais()

	//selecao.js
	assistenteDeSelecao()

	//infojud.js
	infojud()

	//penhora.js
	penhora()

	//pje.js
	pje()

	//planilha.js
	planilha()

	//renajud.js
	renajud()

	//sinesp.js
	sinesp()

	//publicas/esforcos.js
	setInterval(contarEsforcosRepetitivosPoupados,1000)

}