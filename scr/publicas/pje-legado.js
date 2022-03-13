function pjeOtimizarLegado(){

	if(!JANELA.includes('.jus.br/primeirograu/Painel/'))
		return

	pjeLegadoOtimizarArvoreDeTarefas()

	let arvore = selecionar('#listaDeProcessosPanel_body')
	if(!arvore)
		return

	arvore.addEventListener(
		'click',
		() => setTimeout(pjeLegadoOtimizarArvoreDeTarefas,1000)
	)

}

function pjeLegadoOtimizarArvoreDeTarefas(){
	
	let tarefas = document.querySelectorAll('table[id*="idTarefaTree"]')

	EXPRESSAO.tarefa								= {}
	EXPRESSAO.tarefa.aguardar				= new RegExp('Aguardando apreciação pela instância superior|Aguardando audiência|Aguardando cumprimento de acordo|Aguardando prazo|Aguardando prazo recursal|Aguardando término dos prazos|Analisar decisão - AR|Analisar Despacho|Analisar sentença|Analisar despacho ED|Cartas devolvidas|Analisar sentença ED|Assinar decisão|Assinar despacho|Assinar sentença|Elaborar decisão|Elaborar despacho|Elaborar sentença|Apreciar dependência|Minutar dependência|Minutar sentença|Minutar sentença ED|Minutar Decisão|Minutar Despacho - Conversão em diligência|Minutar expediente de secretaria|Minutar Despacho|Assinar expedientes e comunicações - magistrado|Concluso ao magistrado','gi')
	EXPRESSAO.tarefa.urgente				= new RegExp('Acordos vencidos|Análise|Iniciar|Apreciar admissibilidade de recursos|Escolher tipo de arquivamento|Prazos|Recebimento de instância superior|Reexame necessário|em julgado|Remeter ao 2o Grau|Triagem Inicial','gi')
	EXPRESSAO.tarefa.ordinaria			= new RegExp('Cumprimento de .rovidência|Aguardando final do sobrestamento','gi')
	EXPRESSAO.tarefa.intermediaria	= new RegExp('Preparar comunicação|Preparar expediente|Publicar|Intimações.*?pendências','gi')
	
	tarefas.forEach(
		tarefa => {
			if(tarefa.textContent.match(EXPRESSAO.tarefa.aguardar))
				tarefa.style.color='#888'
			if(tarefa.textContent.match(EXPRESSAO.tarefa.urgente))
				tarefa.style.color='#F00'
			if(tarefa.textContent.match(EXPRESSAO.tarefa.ordinaria))
				tarefa.style.color='#00F'
			if(tarefa.textContent.match(EXPRESSAO.tarefa.intermediaria))
				tarefa.style.color='#90F'
		}
	)
	
}