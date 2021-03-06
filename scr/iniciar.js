// Desenvolvido por:	Sisenando Gomes Calixto de Sousa
// E-mail:						sisenandosousa@trt15.jus.br
// Telefone:					(12) 9.8804-3003


browser.storage.local.get(
	null,
	armazenamento => {

		//publicas/definicoes.js
		EXTENSAO.ativada = armazenamento.ativada
		CONFIGURACAO = armazenamento

		//publicas/gerais.js
		MODO.relatar = true
		relatar('CONFIGURAÇÃO: ', CONFIGURACAO)
		MODO.relatar = false

		otimizar()

	}
)




function otimizar(){

	if(!EXTENSAO.ativada)
		return

	definicoesGlobais()

	//selecao.js
	assistenteDeSelecao()

	//bb.js
	bb()

	//cef.js
	cef()

	//chamado.js
	chamado()

	//correios.js
	correios()

	//infojud.js
	infojud()

	//lgpd.js
	lgpd()

	//penhora.js
	penhora()

	//pje.js
	pje()

	//planilha.js
	planilha()

	//renajud.js
	renajud()

	//sigeo.js
	sigeo()

	//sinesp.js
	sinesp()

	//siscondj.js
	siscondj()

	//tst.js
	tst()

	//publicas/esforcos.js
	setInterval(contarEsforcosRepetitivosPoupados,500)

}